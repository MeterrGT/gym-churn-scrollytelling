'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePulseStream } from '@/hooks/usePulseStream';
import { TagMetric } from '@/lib/pulse/types';
import { CyberCanvas } from '@/components/CyberCanvas';

// Inline SVG İkon Bileşenleri (Dış CSS/font bağımlılığını ve render-blocking gecikmelerini sıfıra indirir)
const IconArrowLeft = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
);
const IconExternalLink = () => (
  <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
);
const IconArchive = () => (
  <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></svg>
);
const IconAlertTriangle = () => (
  <svg className="w-4 h-4 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const IconAlertCircle = () => (
  <svg className="w-4 h-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);
const IconRotate = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
);
const IconPlug = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v10M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
);
const IconPower = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.36 6.64A9 9 0 1 1 5.63 6.64M12 2v10"/></svg>
);
const IconPlay = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>
);
const IconPause = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
const IconReset = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const IconShield = () => (
  <svg className="w-4 h-4 shrink-0 text-[#e0aaff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconLock = () => (
  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const IconSpeed = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
);
const IconHashtag = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-[#e0aaff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
);
const IconChart = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const IconLanguage = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const IconSearch = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconX = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconTable = () => (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
);
const IconSpinner = () => (
  <svg className="w-5 h-5 animate-spin text-[#b829ea] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);
const IconInbox = () => (
  <svg className="w-5 h-5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
);
const IconSort = ({ active }: { active: boolean }) => (
  <svg className={`w-3 h-3 shrink-0 ${active ? 'text-[#b829ea]' : 'text-slate-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
);
const IconTrendUp = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);
const IconTrendDown = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
);
const IconMinus = () => (
  <svg className="w-3.5 h-3.5 shrink-0 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconFilter = () => (
  <svg className="w-5 h-5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

export default function LiveSocialPulsePage() {
  const {
    snapshot,
    hasSnapshot,
    status,
    isPaused,
    isStale,
    staleSince,
    disconnectReason,
    langFilter,
    setLangFilter,
    activeWindow,
    setActiveWindow,
    connectionError,
    liveEventCount,
    togglePause,
    reconnect,
    disconnect,
    clearBuffer,
  } = usePulseStream();

  // Arama filtresi
  const [searchQuery, setSearchQuery] = useState('');
  // Tablo sıralama
  const [sortField, setSortField] = useState<'count5m' | 'count1h' | 'tag' | 'lastSeen'>('count5m');
  const [sortAsc, setSortAsc] = useState(false);
  // Grafikler için erişilebilir alternatif tablo gösterimleri
  const [showRateTable, setShowRateTable] = useState(false);
  const [showTopTable, setShowTopTable] = useState(false);

  // Saat gösterimi için anlık zaman
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('tr-TR'));
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('tr-TR'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Aktif pencereye göre etiket listesi
  const rawTags: TagMetric[] = useMemo(() => {
    if (!snapshot) return [];
    return activeWindow === '5m' ? snapshot.topTags5m : snapshot.topTags1h;
  }, [snapshot, activeWindow]);

  // Arama ve sıralama
  const filteredTags = useMemo(() => {
    let result = [...rawTags];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim().replace(/^#/, '');
      result = result.filter((t) => t.tag.includes(q));
    }

    result.sort((a, b) => {
      if (sortField === 'tag') {
        return sortAsc ? a.tag.localeCompare(b.tag) : b.tag.localeCompare(a.tag);
      }
      if (sortField === 'count5m') {
        return sortAsc ? a.count5m - b.count5m : b.count5m - a.count5m;
      }
      if (sortField === 'count1h') {
        return sortAsc ? a.count1h - b.count1h : b.count1h - a.count1h;
      }
      if (sortField === 'lastSeen') {
        return sortAsc ? a.lastSeen - b.lastSeen : b.lastSeen - a.lastSeen;
      }
      return 0;
    });

    return result;
  }, [rawTags, searchQuery, sortField, sortAsc]);

  const handleSort = (field: 'count5m' | 'count1h' | 'tag' | 'lastSeen') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Zaman farkı formatlayıcı
  const formatTimeAgo = (ts: number) => {
    const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diffSec < 5) return 'az önce';
    if (diffSec < 60) return `${diffSec} sn önce`;
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin} dk önce`;
  };

  // Hız grafiği için dakikalık veriler
  const rateBuckets = useMemo(() => {
    if (!snapshot?.postsPerMinute) return [];
    return snapshot.postsPerMinute;
  }, [snapshot?.postsPerMinute]);

  // Hız grafiği maksimum değeri
  const maxMinuteRate = useMemo(() => {
    if (!rateBuckets || rateBuckets.length === 0) return 10;
    const max = Math.max(...rateBuckets.map((p) => p.count));
    // Eksenin tepesinde nefes payı bırakmak için en yakın 5 veya 10'a yuvarla
    const rounded = Math.ceil((max + 2) / 5) * 5;
    return Math.max(rounded, 10);
  }, [rateBuckets]);

  // Top 10 maksimum değeri
  const maxTagCount = useMemo(() => {
    if (filteredTags.length === 0) return 10;
    const key = activeWindow === '5m' ? 'count5m' : 'count1h';
    return Math.max(...filteredTags.slice(0, 10).map((t) => t[key]), 1);
  }, [filteredTags, activeWindow]);

  // Dinamik dil listesi
  const availableLangs = useMemo(() => {
    if (snapshot?.availableLanguages && snapshot.availableLanguages.length > 0) {
      return snapshot.availableLanguages;
    }
    return [
      { code: 'all', label: 'Tüm Diller (All Languages)', count1h: 0, count5m: 0 },
      { code: 'tr', label: 'Türkçe (tr)', count1h: 0, count5m: 0 },
      { code: 'en', label: 'İngilizce (en)', count1h: 0, count5m: 0 },
      { code: 'und', label: 'Belirtilmemiş / Bilinmiyor (und)', count1h: 0, count5m: 0 },
    ];
  }, [snapshot?.availableLanguages]);

  // Seçili dilin etiketi
  const activeLangLabel = useMemo(() => {
    const found = availableLangs.find((l) => l.code === langFilter);
    return found ? found.label : langFilter;
  }, [availableLangs, langFilter]);
  // Sabit bildirim kartını mobil cihazda kullanıcı isteğiyle geçici gizleme durumu
  const [dismissedAlert, setDismissedAlert] = useState(false);

  useEffect(() => {
    setDismissedAlert(false);
  }, [status, disconnectReason]);

  // Durum Bildirimleri (Tek Doğruluk Kaynağından Türetilmiş)
  // 1. Bayat Veri Bildirimi: Başarılı bir veri anlık görüntüsü var, ancak akış canlı/taze değil.
  const showStaleWarning =
    hasSnapshot &&
    (isStale ||
      disconnectReason !== null ||
      status === 'disconnected' ||
      status === 'fallback');

  // 2. Boş / Bağlantısız Durum Bildirimi: Hiç veri yok ve akış mevcut değil.
  const showDisconnectedEmpty =
    !hasSnapshot &&
    (status === 'disconnected' ||
      status === 'fallback' ||
      disconnectReason === 'manual' ||
      status === 'reconnecting');

  const showStaleWarningCard = showStaleWarning && !dismissedAlert;
  const showDisconnectedEmptyCard = showDisconnectedEmpty && !dismissedAlert;

  return (
    <div className="pulse-page-root min-h-screen bg-[#0d0d0d] text-slate-100 relative selection:bg-[#b829ea] selection:text-white overflow-x-clip font-sans">
      {/* Arka Plan Siber Parçacık Tuvali */}
      <CyberCanvas />

      {/* Üst Sabit Başlık (Sticky Header) */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-[#b829ea]/30 shadow-2xl shadow-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#e0aaff] bg-[#b829ea]/15 hover:bg-[#b829ea]/25 border border-[#b829ea]/50 shadow-[0_0_12px_rgba(184,41,234,0.3)] transition-all focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none"
            >
              <IconArrowLeft />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block font-mono text-xs text-slate-400">
                BVA 2245: <strong className="text-white">Canlı Sosyal Medya Nabzı</strong>
              </span>
            </div>
          </div>

          {/* Durum Rozetleri & Zaman */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end text-xs font-mono">
            {/* Bağlantı Durumu */}
            {status === 'connected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
                <span>Canlı Akış Aktif</span>
              </span>
            )}
            {status === 'connecting' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                <span>Bağlanıyor...</span>
              </span>
            )}
            {status === 'reconnecting' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse motion-reduce:animate-none" />
                <span>Yeniden Bağlanıyor...</span>
              </span>
            )}
            {status === 'disconnected' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/40">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Bağlantı Kesildi</span>
              </span>
            )}
            {status === 'fallback' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/50">
                <IconArchive />
                <span>Son Anlık Görüntü (Önbellek)</span>
              </span>
            )}

            {/* Son Güncelleme Zamanı */}
            <span className="text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10 hidden sm:inline-block">
              Saat: <strong className="text-slate-200">{currentTime}</strong>
            </span>

            {/* Canlı Kaynak Bağlantısı */}
            <a
              href="https://docs.bsky.app/docs/advanced-guides/jetstream"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c77dff] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors inline-flex items-center gap-1"
              title="Bluesky Jetstream WebSocket Dokümantasyonu"
            >
              <span>Jetstream API</span>
              <IconExternalLink />
            </a>
          </div>
        </div>
      </header>

      {/* Ana İçerik Konteyneri */}
      <main
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${
          showStaleWarningCard || showDisconnectedEmptyCard ? 'pb-36 sm:pb-12' : 'pb-12'
        }`}
      >
        {/* ======================================================================
            1. HERO & PROJE TANIMI
           ====================================================================== */}
        <section className="relative text-center sm:text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/40 mb-3 shadow-[0_0_12px_rgba(184,41,234,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
              <span>BVA 2245 CANLI VERİ ÜRÜNÜ</span>
              <span>•</span>
              <span>ÇOK DİLLİ GERÇEK ZAMANLI AKIŞ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight !leading-tight">
              Canlı Sosyal Medya Nabzı:{' '}
              <span className="bg-gradient-to-r from-[#e0aaff] via-[#b829ea] to-[#7b2cbf] bg-clip-text text-transparent">
                Bluesky Türkçe & Global Trend Takibi
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed font-sans">
              Bluesky genel post akışına (<code className="text-[#e0aaff] font-mono text-xs">Jetstream WebSocket</code>) doğrudan bağlanan ve Web Worker üzerinde ana arayüzü dondurmadan çalışan gerçek zamanlı sosyal dinleme ürünü. 5 dakikalık ve 1 saatlik kayan pencerelerde etiket sıklığı, dakikalık akış debisi ve <strong>%100 veri minimizasyonu</strong>.
            </p>
          </div>

          {/* Hızlı Kontrol Paneli Butonları */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={togglePause}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none inline-flex items-center gap-1.5 ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-white/[0.06] text-slate-200 border-white/15 hover:bg-white/[0.12]'
              }`}
              title={isPaused ? 'Akışı Devam Ettir' : 'Akışı Duraklat'}
              aria-label={isPaused ? 'Akışı Devam Ettir' : 'Akışı Duraklat'}
            >
              {isPaused ? <IconPlay /> : <IconPause />}
              <span>{isPaused ? 'Devam Et' : 'Duraklat'}</span>
            </button>

            {status === 'connected' ? (
              <button
                type="button"
                onClick={disconnect}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/40 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none inline-flex items-center gap-1.5"
                title="WebSocket Bağlantısını Kes"
                aria-label="WebSocket Bağlantısını Kes"
              >
                <IconPower />
                <span>Bağlantıyı Kes</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={reconnect}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#b829ea]/20 hover:bg-[#b829ea]/30 text-[#e0aaff] border border-[#b829ea]/50 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none inline-flex items-center gap-1.5"
                title="Canlı Akışı Başlat"
                aria-label="Canlı Akışı Başlat"
              >
                <IconPlug />
                <span>Canlı Akışı Başlat</span>
              </button>
            )}

            <button
              type="button"
              onClick={clearBuffer}
              className="px-3 py-2 rounded-xl text-xs font-mono font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none inline-flex items-center gap-1"
              title="Kayan Pencere Belleğini Temizle"
              aria-label="Belleği Sıfırla"
            >
              <IconReset />
              <span>Sıfırla</span>
            </button>
          </div>
        </section>

        {/* ======================================================================
            BAYAT VERİ VE BAĞLANTI DURUM BİLDİRİMLERİ (STALE & DISCONNECTED NOTICES)
            Sıfır Kümülatif Düzen Kayması (CLS = 0) ve Kesintisiz Kullanıcı Farkındalığı:
            Sabit konumlu (fixed floating) bildirim kartı olarak sunulur; DOM akışındaki
            öğeleri asla itmez ve mobil cihazlarda alttaki içeriği kapatmaması için
            kullanıcı tarafından gizlenebilir (dismissible) ve sayfa alt boşluğu eklenmiştir.
           ====================================================================== */}
        {/* DURUM 1: Geçmişte/önbellekte veri var, ancak akış aktif değil (Stale Data Notice) */}
        {showStaleWarningCard && (
          <aside
            role="alert"
            aria-live="polite"
            className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xl z-50 rounded-2xl bg-amber-950/95 border border-amber-500/80 text-amber-200 p-3.5 sm:p-4 shadow-2xl shadow-black backdrop-blur-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-start gap-2.5 flex-1 pr-6 sm:pr-0">
                <IconAlertTriangle />
                <div>
                  <strong className="text-amber-300 block sm:inline">
                    {disconnectReason === 'manual'
                      ? '⚠️ Manuel Olarak Bağlantı Kesildi:'
                      : '⚠️ Ağ Kesintisi / Bayat Veri Bildirimi:'}
                  </strong>{' '}
                  <span className="text-amber-200/90 text-[11px] sm:text-xs">
                    {disconnectReason === 'manual'
                      ? 'Canlı WebSocket akışı kullanıcı tarafından kapatılmıştır. Dondurulmuş anlık görüntü gösterilmektedir.'
                      : 'Bağlantı koptu; sistem yerel önbellekteki son başarılı kümülatif anlık görüntüyü göstermektedir.'}
                    {staleSince && (
                      <> (Kayıt: <strong className="text-white">{staleSince}</strong>)</>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={reconnect}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-500/50 font-bold transition-all shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none inline-flex items-center gap-1.5 text-xs"
                >
                  <IconRotate />
                  <span>Canlı Akışı Başlat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedAlert(true)}
                  className="p-1.5 rounded-lg text-amber-300/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Bildirimi Gizle"
                  aria-label="Bildirimi Gizle"
                >
                  <IconX />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* DURUM 2: Hiç veri yok ve bağlantı kesik/kurulamadı (Disconnected Empty State) */}
        {showDisconnectedEmptyCard && (
          <aside
            role="alert"
            aria-live="polite"
            className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xl z-50 rounded-2xl bg-slate-900/95 border border-white/30 text-slate-300 p-3.5 sm:p-4 shadow-2xl shadow-black backdrop-blur-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-start gap-2.5 flex-1 pr-6 sm:pr-0">
                <IconAlertCircle />
                <div>
                  <strong className="text-white block sm:inline">
                    {disconnectReason === 'manual'
                      ? 'Bağlantı Kesildi (Kayıt Yok):'
                      : 'Bağlantı Bekleniyor (Kayıt Yok):'}
                  </strong>{' '}
                  <span className="text-slate-300 text-[11px] sm:text-xs">
                    Aktif bağlantı ve gösterilecek geçmiş veri bulunmuyor.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={reconnect}
                  className="px-3.5 py-1.5 rounded-xl bg-[#b829ea]/20 hover:bg-[#b829ea]/30 text-[#e0aaff] border border-[#b829ea]/50 font-bold transition-all shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none inline-flex items-center gap-1.5 text-xs"
                >
                  <IconPlug />
                  <span>Canlı Akışı Başlat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedAlert(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Bildirimi Gizle"
                  aria-label="Bildirimi Gizle"
                >
                  <IconX />
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* ======================================================================
            2. GİZLİLİK VE VERİ MİNİMİZASYONU BİLDİRİMİ (PRIVACY BANNER)
           ====================================================================== */}
        <section
          className="p-4 sm:p-5 rounded-2xl bg-[#140f26]/80 border border-[#b829ea]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-slate-300"
          aria-labelledby="privacy-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center text-[#e0aaff] shrink-0 mt-0.5">
              <IconShield />
            </div>
            <div>
              <h2 id="privacy-heading" className="text-sm font-bold text-white mb-0.5">
                Gizlilik Öncelikli Mimari & Sıfır Veri Saklama (Zero Data Retention)
              </h2>
              <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
                Bu sistem, 6698 sayılı KVKK ve GDPR veri minimizasyonu ilkelerine tam uyumludur. Gelen Bluesky gönderilerinden yalnızca etiket ve dil kodu anlık olarak ayıklanır; <strong>kullanıcı kimliği (DID), kullanıcı adı, profil bilgisi veya ham gönderi metni asla bellekte tutulmaz, veritabanına yazılmaz veya diske kaydedilmez.</strong>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 font-mono text-[11px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl">
            <IconLock />
            <span>%100 Ham Veri İmhası</span>
          </div>
        </section>

        {/* ======================================================================
            3. DÖRT TEMEL KPI KARTI (TÜMÜ SEÇİLİ DİLE VE PENCEREYE SENKRONİZE)
           ====================================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Temel Göstergeler">
          {/* KPI 1: Akış Hızı */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">
                Akış Debisi {langFilter !== 'all' && <span className="text-emerald-400">({langFilter})</span>}
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <IconSpeed />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">
                {snapshot ? snapshot.currentRatePerMinute.toLocaleString('tr-TR') : '0'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-1">
                <span>gönderi / dakika</span>
                <span className="text-emerald-400">({snapshot ? snapshot.currentRatePerSecond : '0'} /sn)</span>
              </span>
            </div>
          </div>

          {/* KPI 2: Son 5 Dk Aktif Etiketler */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Son 5 Dk Tekil Etiket</span>
              <div className="w-7 h-7 rounded-lg bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center text-[#e0aaff]">
                <IconHashtag />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#e0aaff] font-mono block">
                {snapshot ? snapshot.uniqueTagsCount5m.toLocaleString('tr-TR') : '0'}
              </span>
              <span className="text-[11px] text-slate-400 font-sans mt-1 block truncate">
                Lider:{' '}
                <strong className="text-white font-mono">
                  {snapshot?.topTags5m?.[0] ? `#${snapshot.topTags5m[0].tag}` : 'Veri bekleniyor...'}
                </strong>
              </span>
            </div>
          </div>

          {/* KPI 3: İşlenen Hacim */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">
                {langFilter === 'all' ? '1 Saatlik Gönderi' : `${langFilter.toUpperCase()} Gönderileri`}
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <IconChart />
              </div>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono block">
                {snapshot ? snapshot.totalPostsProcessed.toLocaleString('tr-TR') : '0'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Tekil 1 Saat:{' '}
                <strong className="text-slate-200">
                  {snapshot ? snapshot.uniqueTagsCount1h.toLocaleString('tr-TR') : '0'}
                </strong>
              </span>
            </div>
          </div>

          {/* KPI 4: Bellek & Olay Sayacı */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-400">Aktif Dil & Bellek</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <IconLanguage />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-purple-300 font-mono block truncate">
                {langFilter === 'all' ? 'Tüm Diller' : langFilter.toUpperCase()}
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                Toplam Olay: <strong className="text-emerald-400 font-mono">{liveEventCount.toLocaleString('tr-TR')}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================================
            4. FİLTRE VE GÖRÜNÜM KONTROLLERİ (DİNAMİK DİL SEÇİCİ)
           ====================================================================== */}
        <section
          className="p-4 rounded-2xl bg-[#110e1c] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
          aria-label="Filtreleme ve Kontroller"
        >
          {/* Sol: Kayan Pencere ve Dinamik Dil Seçici */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Kayan Pencere Butonları */}
            <div className="flex items-center rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveWindow('5m')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none ${
                  activeWindow === '5m'
                    ? 'bg-[#b829ea] text-white font-bold shadow-[0_0_10px_rgba(184,41,234,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Son 5 Dakika
              </button>
              <button
                type="button"
                onClick={() => setActiveWindow('1h')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none ${
                  activeWindow === '1h'
                    ? 'bg-[#b829ea] text-white font-bold shadow-[0_0_10px_rgba(184,41,234,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Son 1 Saat
              </button>
            </div>

            {/* Dinamik Dil Filtresi Dropdown */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-400 hidden sm:inline">Filtrele:</span>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="bg-black/60 border border-white/20 text-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none cursor-pointer max-w-[220px] truncate"
                aria-label="Dil Filtresi Seçiniz"
              >
                {availableLangs.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} {lang.code !== 'all' ? `(${lang.count1h})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {langFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setLangFilter('all')}
                className="text-[11px] font-mono text-purple-300 hover:text-white px-2 py-1 rounded bg-purple-500/15 border border-purple-500/30 transition-colors inline-flex items-center gap-1"
                title="Tüm Dilleri Göster"
              >
                <IconX />
                <span>Filtreyi Kaldır</span>
              </button>
            )}
          </div>

          {/* Sağ: Etiket Arama Kutusu */}
          <div className="relative min-w-[200px] sm:min-w-[260px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              <IconSearch />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Etiket ara (örn: yapayzeka)..."
              className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 font-mono focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none"
              aria-label="Etiketlerde Ara"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                aria-label="Aramayı Temizle"
              >
                <IconX />
              </button>
            )}
          </div>
        </section>

        {/* ======================================================================
            5. BİRİNCİL VE İKİNCİL GRAFİKLER
           ====================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================================================
              BİRİNCİL GRAFİK: DAKİKALIK GÖNDERİ HIZI (SVG ÇUBUK GRAFİĞİ)
             ======================================================== */}
          <section
            className="p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between"
            aria-labelledby="chart-rate-heading"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#c77dff] uppercase tracking-wider block">
                  Birincil Grafik • {activeLangLabel}
                </span>
                <h2 id="chart-rate-heading" className="text-base sm:text-lg font-bold text-white">
                  Dakikalık Gönderi Hızı (Posts Per Minute)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowRateTable(!showRateTable)}
                className="text-[11px] font-mono text-[#e0aaff] hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#b829ea] focus-visible:outline-none inline-flex items-center gap-1"
                aria-label="Erişilebilir tablo görünümünü aç/kapat"
              >
                <IconTable />
                <span>{showRateTable ? 'Grafiği Göster' : 'Tablo Alternatifi'}</span>
              </button>
            </div>

            {/* Ekran Okuyucu Özeti */}
            <p className="sr-only">
              Dakikalık gönderi hızı zaman serisi grafiği. Seçili dil: {activeLangLabel}. Tepe debi dakikada {maxMinuteRate} gönderidir.
            </p>

            {showRateTable ? (
              /* Erişilebilir Tablo Alternatifi */
              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full text-xs font-mono text-left text-slate-300">
                  <caption className="sr-only">Dakikalık Gönderi Hızı Tablosu ({activeLangLabel})</caption>
                  <thead className="bg-white/[0.04] text-slate-400 sticky top-0">
                    <tr>
                      <th scope="col" className="p-2">Zaman</th>
                      <th scope="col" className="p-2 text-right">Gönderi Sayısı</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateBuckets.length > 0 ? (
                      rateBuckets.map((p) => (
                        <tr key={p.minuteTimestamp} className="border-b border-white/5">
                          <td className="p-2">{p.formattedTime}</td>
                          <td className="p-2 text-right font-bold text-[#e0aaff]">{p.count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="p-4 text-center text-slate-500">
                          Seçilen kriterlerde veri toplanmadı.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Profesyonel SVG Zaman Serisi Çubuk Grafiği */
              <div className="w-full h-[250px] flex flex-col justify-end">
                {rateBuckets.length > 0 ? (
                  <svg
                    viewBox="0 0 600 210"
                    className="w-full h-full overflow-visible"
                    aria-label="Dakikalık akış hız grafiği"
                  >
                    <defs>
                      <linearGradient id="rateBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e0aaff" />
                        <stop offset="30%" stopColor="#b829ea" />
                        <stop offset="100%" stopColor="#5a189a" />
                      </linearGradient>
                      <linearGradient id="rateBarHover" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c77dff" />
                      </linearGradient>
                    </defs>

                    {/* Y-Ekseni Kılavuz Çizgileri ve Değerleri */}
                    {[0, 0.33, 0.66, 1].map((pct, i) => {
                      const yPos = 175 - pct * 155;
                      const val = Math.round(pct * maxMinuteRate);
                      return (
                        <g key={i}>
                          <line
                            x1="45"
                            y1={yPos}
                            x2="590"
                            y2={yPos}
                            stroke="rgba(255,255,255,0.08)"
                            strokeDasharray="4 4"
                          />
                          <text
                            x="38"
                            y={yPos + 3}
                            fill="#94a3b8"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="end"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-Ekseni Taban Çizgisi */}
                    <line x1="45" y1="175" x2="590" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* Dakikalık Ayrık Çubuklar (Discrete Bounded Bars) */}
                    {(() => {
                      const count = rateBuckets.length;
                      const usableWidth = 545; // 590 - 45
                      const slotWidth = usableWidth / Math.max(count, 12);
                      const barWidth = Math.min(Math.max(slotWidth * 0.65, 8), 24);

                      return rateBuckets.map((p, idx) => {
                        const x = 45 + idx * slotWidth + (slotWidth - barWidth) / 2;
                        const barHeight = maxMinuteRate > 0 ? (p.count / maxMinuteRate) * 155 : 0;
                        const y = 175 - barHeight;

                        return (
                          <g key={p.minuteTimestamp} className="cursor-pointer group">
                            {/* Çubuk */}
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={Math.max(barHeight, p.count > 0 ? 3 : 0)}
                              rx="3"
                              fill="url(#rateBarGradient)"
                              className="transition-all duration-200 hover:fill-[url(#rateBarHover)] opacity-90 hover:opacity-100"
                            >
                              <title>{`${p.formattedTime}: ${p.count} gönderi`}</title>
                            </rect>

                            {/* Çubuk Üzeri Değer (Yeterli yer varsa) */}
                            {p.count > 0 && barWidth >= 12 && (
                              <text
                                x={x + barWidth / 2}
                                y={Math.max(y - 4, 15)}
                                fill="#e0aaff"
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="middle"
                                fontWeight="bold"
                              >
                                {p.count}
                              </text>
                            )}

                            {/* X-Ekseni Zaman Etiketi (Aralıklı) */}
                            {(idx % Math.ceil(count / 8) === 0 || idx === count - 1) && (
                              <text
                                x={x + barWidth / 2}
                                y="193"
                                fill="#94a3b8"
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="middle"
                              >
                                {p.formattedTime}
                              </text>
                            )}
                          </g>
                        );
                      });
                    })()}
                  </svg>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono py-8">
                    <IconSpinner />
                    <span className="mt-2">Akıştan dakikalık debi verisi bekleniyor...</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2 px-2 border-t border-white/5 pt-1">
                  <span>← Önceki Zaman Dilimi</span>
                  <span>Tepe Noktası: <strong className="text-white">{maxMinuteRate} post/dk</strong></span>
                  <span>Şu An →</span>
                </div>
              </div>
            )}
          </section>

          {/* ========================================================
              İKİNCİL GRAFİK: EN POPÜLER 10 ETİKET (YATAY BAR GRAFİĞİ)
             ======================================================== */}
          <section
            className="p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg flex flex-col justify-between"
            aria-labelledby="chart-top-heading"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  İkincil Grafik • {activeWindow === '5m' ? 'Son 5 Dk' : 'Son 1 Saat'} ({activeLangLabel})
                </span>
                <h2 id="chart-top-heading" className="text-base sm:text-lg font-bold text-white">
                  En Çok Bahsedilen 10 Etiket
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowTopTable(!showTopTable)}
                className="text-[11px] font-mono text-amber-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none inline-flex items-center gap-1"
                aria-label="En popüler etiketler için alternatif tablo görünümünü aç/kapat"
              >
                <IconTable />
                <span>{showTopTable ? 'Grafiği Göster' : 'Tablo Alternatifi'}</span>
              </button>
            </div>

            {/* Ekran Okuyucu Özeti */}
            <p className="sr-only">
              En çok kullanılan 10 etiket yatay çubuk grafiği.
            </p>

            {showTopTable ? (
              /* Erişilebilir Tablo Alternatifi */
              <div className="overflow-x-auto max-h-[260px] overflow-y-auto">
                <table className="w-full text-xs font-mono text-left text-slate-300">
                  <caption className="sr-only">En Popüler 10 Etiket Tablosu</caption>
                  <thead className="bg-white/[0.04] text-slate-400 sticky top-0">
                    <tr>
                      <th scope="col" className="p-2">Sıra</th>
                      <th scope="col" className="p-2">Etiket</th>
                      <th scope="col" className="p-2 text-right">Adet ({activeWindow})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTags.slice(0, 10).map((t, idx) => (
                      <tr key={t.tag} className="border-b border-white/5">
                        <td className="p-2">#{idx + 1}</td>
                        <td className="p-2 font-bold text-white">#{t.tag}</td>
                        <td className="p-2 text-right font-bold text-amber-300">
                          {activeWindow === '5m' ? t.count5m : t.count1h}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Yatay Bar Grafiği */
              <div className="h-[250px] w-full flex flex-col justify-center gap-2 overflow-hidden">
                {filteredTags.slice(0, 7).length > 0 ? (
                  filteredTags.slice(0, 7).map((t, idx) => {
                    const count = activeWindow === '5m' ? t.count5m : t.count1h;
                    const pct = Math.max(6, Math.round((count / maxTagCount) * 100));
                    return (
                      <div key={t.tag} className="flex items-center gap-3 text-xs font-mono">
                        <span className="w-5 text-slate-500 text-[10px] text-right font-bold shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="w-24 sm:w-28 text-white font-bold truncate shrink-0" title={`#${t.tag}`}>
                          #{t.tag}
                        </span>
                        <div className="flex-1 bg-white/[0.05] rounded-full h-4 overflow-hidden relative border border-white/5">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-amber-500/80 via-[#b829ea]/80 to-[#e0aaff] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(184,41,234,0.3)]"
                          />
                        </div>
                        <span className="w-12 text-right font-bold text-amber-300 shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono py-8">
                    <IconInbox />
                    <span className="mt-2">Seçilen dilde ve pencerede henüz etiket bulunamadı.</span>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* ======================================================================
            6. AYRINTILI SIRALANABİLİR ETİKET TABLOSU
           ====================================================================== */}
        <section
          className="p-5 rounded-2xl bg-[#110e1c]/90 border border-white/10 shadow-lg"
          aria-labelledby="table-heading"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#c77dff] uppercase tracking-wider block">
                Canlı Veri Havuzu • {activeLangLabel}
              </span>
              <h2 id="table-heading" className="text-lg sm:text-xl font-bold text-white">
                Sıralanabilir Etiket & Trend Tablosu
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Gösterilen:{' '}
              <strong className="text-white font-bold">{filteredTags.length}</strong> tekil etiket
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-xs font-mono text-left text-slate-300 min-w-[600px]">
              <caption className="sr-only">Detaylı Etiket Frekans Tablosu ({activeLangLabel})</caption>
              <thead className="bg-[#161028] text-slate-400 border-b border-white/10 select-none">
                <tr>
                  <th scope="col" className="p-3 w-12 text-center">
                    #
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort('tag')}
                    className="p-3 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Etiket</span>
                      <IconSort active={sortField === 'tag'} />
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort('count5m')}
                    className="p-3 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Son 5 Dk</span>
                      <IconSort active={sortField === 'count5m'} />
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort('count1h')}
                    className="p-3 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Son 1 Saat</span>
                      <IconSort active={sortField === 'count1h'} />
                    </div>
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleSort('lastSeen')}
                    className="p-3 text-right cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Son Görülme</span>
                      <IconSort active={sortField === 'lastSeen'} />
                    </div>
                  </th>
                  <th scope="col" className="p-3 text-center">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTags.length > 0 ? (
                  filteredTags.slice(0, 30).map((t, idx) => (
                    <tr
                      key={t.tag}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-3 font-bold text-white">
                        <span className="text-[#c77dff] mr-0.5">#</span>
                        {t.tag}
                      </td>
                      <td className="p-3 text-right font-bold text-[#e0aaff]">{t.count5m}</td>
                      <td className="p-3 text-right font-bold text-amber-300">{t.count1h}</td>
                      <td className="p-3 text-right text-slate-400">{formatTimeAgo(t.lastSeen)}</td>
                      <td className="p-3 text-center">
                        {t.trend === 'up' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <IconTrendUp />
                            <span>Yükselişte</span>
                          </span>
                        )}
                        {t.trend === 'down' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/10">
                            <IconTrendDown />
                            <span>Yavaşlıyor</span>
                          </span>
                        )}
                        {t.trend === 'stable' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
                            <IconMinus />
                            <span>Dengeli</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <IconFilter />
                        <span>Kriterlere uyan etiket bulunamadı.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ======================================================================
            7. ANALİTİK MİMARİ VE VERİ AKIŞI (ARCHITECTURE & PIPELINE)
           ====================================================================== */}
        <section
          className="p-6 rounded-2xl bg-[#0a0812] border border-white/10 space-y-6"
          aria-labelledby="pipeline-heading"
        >
          <div>
            <span className="text-xs font-mono font-bold text-[#c77dff] uppercase tracking-wider block">
              Sistem Mimarisi
            </span>
            <h2 id="pipeline-heading" className="text-xl font-bold text-white mt-1">
              Gerçek Zamanlı Veri Boru Hattı & Veri Saklamama Politikası
            </h2>
          </div>

          {/* Boru Hattı Akış Diyagramı */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#140f26] border border-white/10">
              <span className="w-6 h-6 rounded bg-[#b829ea]/20 text-[#e0aaff] flex items-center justify-center font-bold mb-2">
                1
              </span>
              <strong className="text-white block mb-1">Bluesky Jetstream</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Firehose üzerinden gelen WebSocket akışı doğrudan istemciye bağlanır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#140f26] border border-white/10">
              <span className="w-6 h-6 rounded bg-[#b829ea]/20 text-[#e0aaff] flex items-center justify-center font-bold mb-2">
                2
              </span>
              <strong className="text-white block mb-1">Web Worker Ayrıştırma</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Arka planda çalışan worker, UI thread&apos;i bloke etmeden JSON, dil ve etiketleri yakalar.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#140f26] border border-emerald-500/30">
              <span className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
                3
              </span>
              <strong className="text-emerald-300 block mb-1">Ham Veri İmhası</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Kullanıcı DID, metin ve yazar kimlikleri ayıklanır ayıklanmaz çöpe (GC) atılır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#140f26] border border-white/10">
              <span className="w-6 h-6 rounded bg-[#b829ea]/20 text-[#e0aaff] flex items-center justify-center font-bold mb-2">
                4
              </span>
              <strong className="text-white block mb-1">Kayan Pencere Kovaları</strong>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                5 dk ve 1 saati aşan sayısal kovalar otomatik silinir; yalnızca anlık özetler çizilir.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-white text-sm">Resmi Veri Saklama Politikası (Retention Policy):</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Ham gönderi verileri hiçbir kalıcı ortamda (Disk, IndexedDB, Neon DB) saklanmaz.</li>
              <li>Yerel depolamada (<code className="text-[#e0aaff]">localStorage</code>) yalnızca ağ kesintisi fallback&apos;i için son kümülatif sayısal anlık görüntü tutulur.</li>
              <li>Bellek boyutu 60 adet 1 dakikalık kova ile katı olarak sınırlandırılmıştır (bounded memory).</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Alt Bilgi (Footer) */}
      <footer className="footer-story-section py-8 bg-[#08060f] border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            <span>© 2026 Metehan Gezer • BVA 2245 Canlı Veri Ürünü</span>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Manisa Celal Bayar Üniversitesi • Büyük Veri Analistliği
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/bluesky-hashtag-network"
              className="text-[#c77dff] hover:text-white transition-colors"
            >
              48 Saatlik Tarihsel Ağ Vaka Analizi →
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Portfolyo Ana Sayfa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
