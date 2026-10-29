'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { PulseAggregateSnapshot, PulseStatus } from '../lib/pulse/types';
import { PulseAggregator } from '../lib/pulse/aggregator';

const SNAPSHOT_STORAGE_KEY = 'bva2245_pulse_snapshot_v1';
const JETSTREAM_URL = 'wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post';

export function usePulseStream() {
  const [status, setStatus] = useState<PulseStatus>('connecting');
  const [snapshot, setSnapshot] = useState<PulseAggregateSnapshot | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [staleSince, setStaleSince] = useState<string | null>(null);
  const [disconnectReason, setDisconnectReason] = useState<'manual' | 'network' | null>(null);
  const [langFilter, setLangFilter] = useState<string>('all');
  const [activeWindow, setActiveWindow] = useState<'5m' | '1h'>('5m');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [liveEventCount, setLiveEventCount] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const fallbackAggregatorRef = useRef<PulseAggregator | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveSnapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);

  // Yaşam döngüsü yetkili referansları (Autoritative Lifecycle Refs)
  const isManuallyClosedRef = useRef<boolean>(false);
  const hasReceivedFreshDataRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const langFilterRef = useRef<string>('all');
  const statusRef = useRef<PulseStatus>('connecting');
  const isStaleRef = useRef<boolean>(false);
  const disconnectReasonRef = useRef<'manual' | 'network' | null>(null);
  const lastSuccessfulDataTimestampRef = useRef<number | null>(null);
  const latestSnapshotRef = useRef<PulseAggregateSnapshot | null>(null);

  // Eşzamanlı ref güncelleyicileri (React re-render döngüsünden bağımsız yetkili durum)
  const updateStatus = useCallback((newStatus: PulseStatus) => {
    statusRef.current = newStatus;
    setStatus(newStatus);
  }, []);

  const updateIsStale = useCallback((newIsStale: boolean) => {
    isStaleRef.current = newIsStale;
    setIsStale(newIsStale);
  }, []);

  const updateDisconnectReason = useCallback((newReason: 'manual' | 'network' | null) => {
    disconnectReasonRef.current = newReason;
    setDisconnectReason(newReason);
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    langFilterRef.current = langFilter;
  }, [langFilter]);

  // 1. Yerel önbellekteki son geçerli anlık görüntüyü (Snapshot) yükle
  const loadCachedSnapshot = useCallback(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw) as PulseAggregateSnapshot;
      return cached;
    } catch {
      return null;
    }
  }, []);

  // 2. Anlık görüntüyü önbelleğe kaydet (Sadece kümülatif sayısal veri, asla ham veri yok)
  const saveSnapshotToStorage = useCallback((snap: PulseAggregateSnapshot) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snap));
    } catch {}
  }, []);

  // 3. Worker veya Fallback Aggregator'ı başlat
  useEffect(() => {
    // Sayfa açıldığında önbellek varsa yükle, ancak canlı veri olarak gösterme (isStale = true)
    const cached = loadCachedSnapshot();
    if (cached && cached.totalPostsProcessed > 0) {
      lastSuccessfulDataTimestampRef.current = cached.timestamp;
      const formattedDate = new Date(cached.timestamp).toLocaleString('tr-TR');
      const initialSnap: PulseAggregateSnapshot = {
        ...cached,
        isStale: false,
        staleSince: formattedDate,
      };
      setSnapshot(initialSnap);
      latestSnapshotRef.current = initialSnap;
      setStaleSince(formattedDate);
    }

    try {
      const worker = new Worker('/workers/pulse.worker.js');
      worker.onmessage = (e) => {
        if (!e.data || e.data.type !== 'AGGREGATE_SNAPSHOT') return;
        const snap = e.data.snapshot as PulseAggregateSnapshot;

        // Canlı akış aktif DEĞİLSE veya henüz taze veri alınmamışsa (ör. manuel kopma, ağ kopması, bağlanıyor vb.):
        if (
          isManuallyClosedRef.current ||
          statusRef.current === 'disconnected' ||
          statusRef.current === 'reconnecting' ||
          statusRef.current === 'connecting' ||
          statusRef.current === 'fallback' ||
          !hasReceivedFreshDataRef.current
        ) {
          // Gelen anlık görüntüyü güncelle (ör. dil filtresi değiştiğinde grafikler ve tablolar filtrelensin),
          // ANCAK bayatlık durumunu ASLA kaldırma!
          const lastTs = lastSuccessfulDataTimestampRef.current || latestSnapshotRef.current?.timestamp || snap.timestamp;
          const freezeTime = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;
          const frozenSnap: PulseAggregateSnapshot = {
            ...snap,
            timestamp: lastTs,
            isStale: true,
            staleSince: freezeTime || undefined,
            disconnectReason: isManuallyClosedRef.current
              ? 'manual'
              : (disconnectReasonRef.current || 'network'),
          };
          latestSnapshotRef.current = frozenSnap;
          setSnapshot(frozenSnap);
          return;
        }

        // Canlı akış gerçekten aktif ve yeni veri alınmış durumda:
        lastSuccessfulDataTimestampRef.current = snap.timestamp;
        latestSnapshotRef.current = snap;
        setSnapshot(snap);
        updateIsStale(false);
        setStaleSince(null);
        updateDisconnectReason(null);
        setConnectionError(null);
      };

      worker.onerror = () => {
        console.warn('Web Worker hatası, ana iş parçacığı dahili toplayıcıya geçiliyor.');
        fallbackAggregatorRef.current = new PulseAggregator();
      };
      workerRef.current = worker;
    } catch {
      console.warn('Web Worker başlatılamadı, dahili toplayıcı devrede.');
      fallbackAggregatorRef.current = new PulseAggregator();
    }

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [loadCachedSnapshot, updateIsStale, updateDisconnectReason]);

  // 4. Periyodik önbellek yedekleme döngüsü (Canlı ve taze veriler her 10 saniyede bir kaydedilir)
  useEffect(() => {
    saveSnapshotIntervalRef.current = setInterval(() => {
      if (
        latestSnapshotRef.current &&
        !isStaleRef.current &&
        hasReceivedFreshDataRef.current &&
        latestSnapshotRef.current.totalPostsProcessed > 0
      ) {
        saveSnapshotToStorage(latestSnapshotRef.current);
      }
    }, 10000);

    return () => {
      if (saveSnapshotIntervalRef.current) {
        clearInterval(saveSnapshotIntervalRef.current);
      }
    };
  }, [saveSnapshotToStorage]);

  // 5. WebSocket bağlantı yönetimi (Sabit bağımlılıklar - Dil veya duraklatma değişiminde soket KOPARILMAZ)
  const connectWebSocket = useCallback(() => {
    if (isManuallyClosedRef.current) return;

    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    updateStatus(retryCountRef.current > 0 ? 'reconnecting' : 'connecting');
    setConnectionError(null);

    try {
      const ws = new WebSocket(JETSTREAM_URL);

      ws.onopen = () => {
        updateStatus('connected');
        setConnectionError(null);
        retryCountRef.current = 0;
        // DİKKAT: Burada isStale veya disconnectReason henüz temizlenmez!
        // Uyarı yalnızca ilk taze veri mesajı ws.onmessage üzerinden alınıp işlendiğinde temizlenir.
      };

      ws.onmessage = (event) => {
        if (isPausedRef.current) return;

        hasReceivedFreshDataRef.current = true;
        setLiveEventCount((prev) => prev + 1);

        if (workerRef.current) {
          workerRef.current.postMessage({
            type: 'INGEST_RAW',
            rawJson: event.data,
            receivedAt: Date.now(),
          });
        } else if (fallbackAggregatorRef.current) {
          fallbackAggregatorRef.current.ingest(event.data, Date.now());
          const snap = fallbackAggregatorRef.current.getSnapshot(Date.now(), langFilterRef.current);
          lastSuccessfulDataTimestampRef.current = snap.timestamp;
          latestSnapshotRef.current = snap;
          setSnapshot(snap);
          updateIsStale(false);
          setStaleSince(null);
          updateDisconnectReason(null);
          setConnectionError(null);
        }
      };

      ws.onerror = () => {
        setConnectionError('Bluesky Jetstream WebSocket bağlantısında ağ hatası oluştu.');
      };

      ws.onclose = () => {
        // Manuel kapatılmışsa yeniden bağlanma döngüsüne GİRME
        if (isManuallyClosedRef.current) {
          updateStatus('disconnected');
          updateIsStale(true);
          updateDisconnectReason('manual');
          return;
        }

        // Beklenmeyen ağ kopması: Yeniden bağlanmayı planla
        updateDisconnectReason('network');
        updateIsStale(true);
        hasReceivedFreshDataRef.current = false;

        // Orijinal veri zaman damgasını koru
        const lastTs = lastSuccessfulDataTimestampRef.current || latestSnapshotRef.current?.timestamp;
        const freezeTime = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;
        if (freezeTime) {
          setStaleSince(freezeTime);
        }

        const nextRetry = Math.min(1000 * Math.pow(1.5, retryCountRef.current), 15000);
        retryCountRef.current++;

        if (latestSnapshotRef.current && latestSnapshotRef.current.totalPostsProcessed > 0) {
          updateStatus('fallback');
        } else {
          updateStatus('reconnecting');
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, nextRetry);
      };

      wsRef.current = ws;
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : 'Bağlantı kurulamadı');
      updateStatus(latestSnapshotRef.current?.totalPostsProcessed ? 'fallback' : 'reconnecting');
      updateIsStale(true);
      updateDisconnectReason('network');
    }
  }, [updateStatus, updateIsStale, updateDisconnectReason]);

  // Sayfa yüklendiğinde bağlantıyı bir kez başlat (Mount effect)
  useEffect(() => {
    isManuallyClosedRef.current = false;
    connectWebSocket();

    return () => {
      isManuallyClosedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  // Dil filtresi değiştiğinde (Bağlantı durumunu bozmaz veya bayatlık uyarısını kaldırmaz)
  const handleSetLangFilter = useCallback((lang: string) => {
    setLangFilter(lang);
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'SET_FILTER',
        lang: lang,
      });
    } else if (fallbackAggregatorRef.current) {
      const snap = fallbackAggregatorRef.current.getSnapshot(Date.now(), lang);
      if (
        isManuallyClosedRef.current ||
        statusRef.current === 'disconnected' ||
        statusRef.current === 'reconnecting' ||
        statusRef.current === 'connecting' ||
        statusRef.current === 'fallback' ||
        !hasReceivedFreshDataRef.current
      ) {
        const lastTs = lastSuccessfulDataTimestampRef.current || latestSnapshotRef.current?.timestamp || snap.timestamp;
        const freezeTime = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;
        const frozenSnap: PulseAggregateSnapshot = {
          ...snap,
          timestamp: lastTs,
          isStale: true,
          staleSince: freezeTime || undefined,
          disconnectReason: isManuallyClosedRef.current
            ? 'manual'
            : (disconnectReasonRef.current || 'network'),
        };
        latestSnapshotRef.current = frozenSnap;
        setSnapshot(frozenSnap);
      } else {
        latestSnapshotRef.current = snap;
        setSnapshot(snap);
      }
    }
  }, []);

  // Duraklat / Devam Et
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Manuel Yeniden Bağlan (Canlı Akışı Başlat)
  const reconnect = useCallback(() => {
    isManuallyClosedRef.current = false;
    hasReceivedFreshDataRef.current = false;
    retryCountRef.current = 0;

    // ÖNEMLİ: Yeniden bağlanma başlatıldığında bayat veri uyarısını HEMEN SİLME!
    // Uyarı yalnızca bağlantı başarıyla kurulup ilk taze veri güncellemesi alındığında silinmelidir.
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    updateStatus('connecting');
    connectWebSocket();
  }, [connectWebSocket, updateStatus]);

  // Manuel Bağlantıyı Kes
  const disconnect = useCallback(() => {
    isManuallyClosedRef.current = true;
    hasReceivedFreshDataRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    updateStatus('disconnected');
    updateIsStale(true);
    updateDisconnectReason('manual');

    // Orijinal veri zaman damgasını koru (asla tıklama anındaki saati veri saati sanma)
    const lastTs = lastSuccessfulDataTimestampRef.current || latestSnapshotRef.current?.timestamp;
    const freezeTime = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;
    setStaleSince(freezeTime);

    if (latestSnapshotRef.current && latestSnapshotRef.current.totalPostsProcessed > 0) {
      const frozenSnapshot: PulseAggregateSnapshot = {
        ...latestSnapshotRef.current,
        timestamp: lastTs || latestSnapshotRef.current.timestamp,
        isStale: true,
        staleSince: freezeTime || undefined,
        disconnectReason: 'manual',
      };
      latestSnapshotRef.current = frozenSnapshot;
      setSnapshot(frozenSnapshot);
      saveSnapshotToStorage(frozenSnapshot);
    }
  }, [updateStatus, updateIsStale, updateDisconnectReason, saveSnapshotToStorage]);

  // Tamponu Sıfırla
  const clearBuffer = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({ type: 'RESET' });
    }
    if (fallbackAggregatorRef.current) {
      fallbackAggregatorRef.current.reset();
    }
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
      }
    } catch {}

    latestSnapshotRef.current = null;
    lastSuccessfulDataTimestampRef.current = null;
    hasReceivedFreshDataRef.current = false;
    setSnapshot(null);
    setLiveEventCount(0);
    setStaleSince(null);
    updateIsStale(false);
  }, [updateIsStale]);

  // Tek doğruluk kaynağından türetilmiş veri durumu
  const hasSnapshot = Boolean(snapshot && snapshot.totalPostsProcessed > 0);

  return {
    snapshot,
    hasSnapshot,
    status,
    isPaused,
    isStale,
    staleSince,
    disconnectReason,
    langFilter,
    setLangFilter: handleSetLangFilter,
    activeWindow,
    setActiveWindow,
    connectionError,
    liveEventCount,
    togglePause,
    reconnect,
    disconnect,
    clearBuffer,
  };
}
