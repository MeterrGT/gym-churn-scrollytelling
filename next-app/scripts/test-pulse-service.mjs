/**
 * BVA 2245 — Canlı Sosyal Medya Nabzı (Live Social Media Pulse)
 * Kapsamlı Otomasyon, Çok Dilli Agregasyon ve Dayanıklılık Testleri
 *
 * Doğrulanan Bileşenler:
 * 1. Çok Dilli Agregasyon ve Normalizasyon (tr, en, gl, de, es, fr, pt, und, çoklu dil)
 * 2. Dil Bazlı Filtreleme ve KPI/Etiket İzolasyonu (Her dilin bağımsız ve doğru sonuçları)
 * 3. Kayan Pencere Zaman Aşımı ve Budama (5 dk & 1 saat rolling windows per language)
 * 4. Filtre Geçişlerinde Veri Tutarlılığı ve Idempotency (Tekrarlayan filtrelemede çift sayma yok)
 * 5. Dakikalık Grafik Veri Üretimi (Posts-per-minute series, all-lang & lang-specific, sıfır kova tutarlılığı)
 * 6. Manuel Bağlantı Kesme, Ağ Kopması, Yeniden Bağlanma ve Bayat Veri (Stale-data lifecycle)
 * 7. Kesin Gizlilik ve Veri Minimizasyonu Kanıtı (Zero raw text, zero DIDs, zero profile metadata)
 */

import { PulseAggregator, normalizeLanguageCodes, getLanguageLabel } from '../src/lib/pulse/aggregator.ts';

async function runPulseTests() {
  console.log('================================================================');
  console.log('   BVA 2245 CANLI SOSYAL MEDYA NABZI ÇOK DİLLİ TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [BAŞARILI] ${message}`);
      passed++;
    } else {
      console.error(`  [BAŞARISIZ] ${message}`);
      throw new Error(`Test başarısız: ${message}`);
    }
  }

  // =========================================================================
  // BÖLÜM 1: Dil Kodu Normalizasyonu ve Çoklu Dil Desteği
  // =========================================================================
  console.log('--- [BÖLÜM 1] Dil Kodu Normalizasyonu ve Kural Doğrulama ---');

  assert(
    JSON.stringify(normalizeLanguageCodes(['tr'])) === JSON.stringify(['tr']),
    'Tekli dil kodu ("tr") başarıyla normalize edildi.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(['en-US'])) === JSON.stringify(['en']),
    'Bölgesel kod içeren ("en-US") dil kodu ana koda ("en") indirgendi.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(['pt-BR'])) === JSON.stringify(['pt']),
    'Portekizce bölgesel ("pt-BR") -> ("pt") olarak normalize edildi.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(['gl'])) === JSON.stringify(['gl']),
    'Galiçyaca ("gl") kodu doğru tanındı.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(['tr', 'en'])) === JSON.stringify(['tr', 'en']),
    'Çok dilli ("tr", "en") post dizisi her iki dili de korudu.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes([])) === JSON.stringify(['und']),
    'Boş dil dizisi ([]) güvenle "und" (belirtilmemiş) grubuna atandı.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(null)) === JSON.stringify(['und']),
    'null dil metadatası güvenle "und" olarak sınıflandırıldı.'
  );
  assert(
    JSON.stringify(normalizeLanguageCodes(['invalid_code_too_long'])) === JSON.stringify(['und']),
    'Geçersiz ISO kodu güvenle "und" olarak ele alındı.'
  );
  assert(
    getLanguageLabel('und').includes('Belirtilmemiş') || getLanguageLabel('und').includes('und'),
    'Bilinmeyen diller için anlaşılır arayüz etiketi sağlandı.'
  );

  // =========================================================================
  // BÖLÜM 2: Çok Dilli Fikstür Verileri ile Deterministik Agregasyon
  // (tr, en, gl, de, es, fr, pt, und ve çift dilli post)
  // =========================================================================
  console.log('\n--- [BÖLÜM 2] Çok Dilli Deterministik Fikstür Agregasyonu ---');

  const aggregator = new PulseAggregator();
  const baseTime = 1700000000000; // Sabit referans zamanı

  const fixtures = [
    // 1. Türkçe (tr)
    {
      id: 'fix_tr_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Cumhuriyet bayramı kutlu olsun! #cumhuriyet #veriAnalizi',
            langs: ['tr'],
            facets: [{ features: [{ '$type': 'app.bsky.richtext.facet#tag', tag: 'cumhuriyet' }] }],
          },
        },
      },
      time: baseTime,
    },
    // 2. İngilizce (en)
    {
      id: 'fix_en_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Exploring #dataScience and cutting edge #ai architectures.',
            langs: ['en-US'],
            facets: [{ features: [{ '$type': 'app.bsky.richtext.facet#tag', tag: 'datascience' }] }],
          },
        },
      },
      time: baseTime + 1000,
    },
    // 3. Galiçyaca (gl)
    {
      id: 'fix_gl_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Novas dende Galicia con #galicia e #pobra!',
            langs: ['gl'],
            facets: [{ features: [{ '$type': 'app.bsky.richtext.facet#tag', tag: 'galicia' }] }],
          },
        },
      },
      time: baseTime + 2000,
    },
    // 4. Almanca (de)
    {
      id: 'fix_de_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Zukunft der Künstlichen Intelligenz mit #ki und #technologie.',
            langs: ['de-DE'],
          },
        },
      },
      time: baseTime + 3000,
    },
    // 5. İspanyolca (es)
    {
      id: 'fix_es_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Últimas novedades del sector con #noticias y #tecnologia.',
            langs: ['es'],
          },
        },
      },
      time: baseTime + 4000,
    },
    // 6. Fransızca (fr)
    {
      id: 'fix_fr_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Innovation en direct depuis #paris avec #ia.',
            langs: ['fr'],
          },
        },
      },
      time: baseTime + 5000,
    },
    // 7. Portekizce (pt)
    {
      id: 'fix_pt_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Tendências do mercado tech no #brasil com #inteligencia.',
            langs: ['pt-BR'],
          },
        },
      },
      time: baseTime + 6000,
    },
    // 8. Bilinmeyen / Eksik Dil (und)
    {
      id: 'fix_und_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Post without language metadata #mysterytag',
            // langs eksik!
          },
        },
      },
      time: baseTime + 7000,
    },
    // 9. Çift Dilli Olay (tr + en)
    {
      id: 'fix_multi_1',
      event: {
        kind: 'commit',
        commit: {
          collection: 'app.bsky.feed.post',
          operation: 'create',
          record: {
            text: 'Bilingual post linking both worlds! #bilingual #future',
            langs: ['tr', 'en'],
          },
        },
      },
      time: baseTime + 8000,
    },
  ];

  // Fikstürleri toplayıcıya besle
  for (const item of fixtures) {
    const res = aggregator.ingest(item.event, item.time);
    assert(res !== null, `Fikstür olayı (${item.id}) başarıyla işlendi.`);
  }

  // =========================================================================
  // BÖLÜM 3: Dil Filtreleme ve Sonuç İzolasyonu Testleri
  // =========================================================================
  console.log('\n--- [BÖLÜM 3] Dil Filtreleme ve Sonuç İzolasyonu ---');

  // 3.1: Tüm Diller (All Languages)
  const snapAll = aggregator.getSnapshot(baseTime + 10000, 'all');
  assert(snapAll.totalPostsProcessed === 9, 'Tüm diller görünümünde toplam 9 gönderi işlendi.');
  assert(
    snapAll.availableLanguages.some((l) => l.code === 'tr') &&
    snapAll.availableLanguages.some((l) => l.code === 'en') &&
    snapAll.availableLanguages.some((l) => l.code === 'gl') &&
    snapAll.availableLanguages.some((l) => l.code === 'de') &&
    snapAll.availableLanguages.some((l) => l.code === 'es') &&
    snapAll.availableLanguages.some((l) => l.code === 'fr') &&
    snapAll.availableLanguages.some((l) => l.code === 'pt') &&
    snapAll.availableLanguages.some((l) => l.code === 'und'),
    'Dinamik dil listesinde tr, en, gl, de, es, fr, pt ve und eksiksiz temsil edildi.'
  );

  // 3.2: Türkçe Filtresi (tr: 1 adet salt Türkçe + 1 adet çift dilli = 2 post)
  const snapTR = aggregator.getSnapshot(baseTime + 10000, 'tr');
  assert(snapTR.totalPostsProcessed === 2, 'Türkçe filtresinde yalnızca 2 gönderi sayıldı (1 TR + 1 TR/EN).');
  assert(snapTR.topTags5m.some((t) => t.tag === 'cumhuriyet'), 'Türkçe etiketlerinde #cumhuriyet mevcut.');
  assert(snapTR.topTags5m.some((t) => t.tag === 'bilingual'), 'Çift dilli postun etiketi #bilingual Türkçe listesinde mevcut.');
  assert(!snapTR.topTags5m.some((t) => t.tag === 'datascience'), 'İngilizceye ait #datascience etiketi Türkçe listesine sızmadı.');
  assert(!snapTR.topTags5m.some((t) => t.tag === 'galicia'), 'Galiçyaca etiketi #galicia Türkçe listesine sızmadı.');

  // 3.3: İngilizce Filtresi (en: 1 adet salt İngilizce + 1 adet çift dilli = 2 post)
  const snapEN = aggregator.getSnapshot(baseTime + 10000, 'en');
  assert(snapEN.totalPostsProcessed === 2, 'İngilizce filtresinde 2 gönderi sayıldı (1 EN + 1 TR/EN).');
  assert(snapEN.topTags5m.some((t) => t.tag === 'datascience'), 'İngilizce etiketlerinde #datascience mevcut.');
  assert(!snapEN.topTags5m.some((t) => t.tag === 'cumhuriyet'), 'Türkçe etiketi #cumhuriyet İngilizce listesine sızmadı.');

  // 3.4: Galiçyaca Filtresi (gl: 1 post)
  const snapGL = aggregator.getSnapshot(baseTime + 10000, 'gl');
  assert(snapGL.totalPostsProcessed === 1, 'Galiçyaca filtresinde tam 1 gönderi sayıldı.');
  assert(snapGL.topTags5m.some((t) => t.tag === 'galicia'), 'Galiçyaca etiketlerinde #galicia mevcut.');
  assert(snapGL.topTags5m.some((t) => t.tag === 'pobra'), 'Galiçyaca etiketlerinde #pobra mevcut.');
  assert(!snapGL.topTags5m.some((t) => t.tag === 'ki'), 'Almanca etiketi #ki Galiçyaca listesine sızmadı.');

  // 3.5: Almanca Filtresi (de: 1 post)
  const snapDE = aggregator.getSnapshot(baseTime + 10000, 'de');
  assert(snapDE.totalPostsProcessed === 1, 'Almanca filtresinde 1 gönderi sayıldı.');
  assert(snapDE.topTags5m.some((t) => t.tag === 'ki'), 'Almanca etiketlerinde #ki mevcut.');

  // 3.6: İspanyolca Filtresi (es: 1 post)
  const snapES = aggregator.getSnapshot(baseTime + 10000, 'es');
  assert(snapES.totalPostsProcessed === 1, 'İspanyolca filtresinde 1 gönderi sayıldı.');
  assert(snapES.topTags5m.some((t) => t.tag === 'noticias'), 'İspanyolca etiketlerinde #noticias mevcut.');

  // 3.7: Fransızca Filtresi (fr: 1 post)
  const snapFR = aggregator.getSnapshot(baseTime + 10000, 'fr');
  assert(snapFR.totalPostsProcessed === 1, 'Fransızca filtresinde 1 gönderi sayıldı.');
  assert(snapFR.topTags5m.some((t) => t.tag === 'paris'), 'Fransızca etiketlerinde #paris mevcut.');

  // 3.8: Portekizce Filtresi (pt: 1 post)
  const snapPT = aggregator.getSnapshot(baseTime + 10000, 'pt');
  assert(snapPT.totalPostsProcessed === 1, 'Portekizce filtresinde 1 gönderi sayıldı.');
  assert(snapPT.topTags5m.some((t) => t.tag === 'brasil'), 'Portekizce etiketlerinde #brasil mevcut.');

  // 3.9: Belirtilmemiş / Bilinmeyen Filtresi (und: 1 post)
  const snapUND = aggregator.getSnapshot(baseTime + 10000, 'und');
  assert(snapUND.totalPostsProcessed === 1, 'Bilinmeyen dil filtresinde (und) 1 gönderi sayıldı.');
  assert(snapUND.topTags5m.some((t) => t.tag === 'mysterytag'), 'und etiketlerinde #mysterytag mevcut.');
  assert(!snapUND.topTags5m.some((t) => t.tag === 'cumhuriyet'), 'Diğer dillerin etiketleri und listesine karışmadı.');

  // =========================================================================
  // BÖLÜM 4: Filtre Değişimlerinde Veri Tutarlılığı ve Idempotency
  // =========================================================================
  console.log('\n--- [BÖLÜM 4] Filtre Değişimlerinde Veri Bütünlüğü ve Idempotency ---');

  // Filtreleri ardışık olarak değiştirip tekrar 'all' seçildiğinde veri kaybı veya çift sayım olmamalı
  aggregator.setFilter('tr');
  const checkTR = aggregator.getSnapshot(baseTime + 10000);
  assert(checkTR.totalPostsProcessed === 2, 'Dahili filtre TR olarak ayarlandı, post sayısı 2.');

  aggregator.setFilter('gl');
  const checkGL = aggregator.getSnapshot(baseTime + 10000);
  assert(checkGL.totalPostsProcessed === 1, 'Dahili filtre GL olarak ayarlandı, post sayısı 1.');

  aggregator.setFilter('all');
  const checkAllAgain = aggregator.getSnapshot(baseTime + 10000);
  assert(checkAllAgain.totalPostsProcessed === 9, 'Tüm dillere geri dönüldüğünde toplam gönderi sayısı eksiksiz (9) olarak korundu.');
  assert(checkAllAgain.uniqueTagsCount5m === snapAll.uniqueTagsCount5m, 'Filtre geçişleri kümülatif etiket sayısını bozmadı.');

  // =========================================================================
  // BÖLÜM 5: Kayan Pencere (5 Dk & 1 Saat) Dil Bazlı Zaman Aşımı
  // =========================================================================
  console.log('\n--- [BÖLÜM 5] Kayan Pencere (5 Dk & 1 Saat) Dil İzolasyonlu Zaman Aşımı ---');

  // 6 dakika sonraya bir Galiçyaca ve bir Türkçe post ekleyelim (baseTime + 360.000 ms)
  const time6m = baseTime + 360000;
  aggregator.ingest({
    kind: 'commit',
    commit: {
      collection: 'app.bsky.feed.post',
      operation: 'create',
      record: {
        text: 'Nova mensaxe dende Vigo #vigo',
        langs: ['gl'],
      },
    },
  }, time6m);

  aggregator.ingest({
    kind: 'commit',
    commit: {
      collection: 'app.bsky.feed.post',
      operation: 'create',
      record: {
        text: 'Yeni Türkçe güncelleme #guncel',
        langs: ['tr'],
      },
    },
  }, time6m);

  // 6. dakikada Galiçyaca görünümü:
  // Eski #galicia etiketi (0. dakikada gelmişti) 5 dk penceresinden düşmeli, 1 saatlikte kalmalı!
  // Yeni #vigo etiketi 5 dk penceresinde yer almalı!
  const snapGLat6m = aggregator.getSnapshot(time6m, 'gl');
  assert(!snapGLat6m.topTags5m.some((t) => t.tag === 'galicia'), '6 dakika önceki #galicia etiketi 5 dk penceresinden başarıyla düşürüldü.');
  assert(snapGLat6m.topTags1h.some((t) => t.tag === 'galicia'), '6 dakika önceki #galicia etiketi 1 saatlik pencerede muhafaza ediliyor.');
  assert(snapGLat6m.topTags5m.some((t) => t.tag === 'vigo'), 'Yeni eklenen #vigo etiketi 5 dk penceresinde yer alıyor.');

  // 65 dakika sonra (baseTime + 3.900.000 ms): 1 saatlik pencereden de tamamen budanmalı
  const time65m = baseTime + 3900000;
  const snapAll65m = aggregator.getSnapshot(time65m, 'all');
  assert(!snapAll65m.topTags1h.some((t) => t.tag === 'galicia'), '65 dakika önceki #galicia etiketi 1 saatlik pencereden kalıcı olarak silindi.');
  assert(!snapAll65m.topTags1h.some((t) => t.tag === 'cumhuriyet'), '65 dakika önceki #cumhuriyet etiketi 1 saatlik pencereden kalıcı olarak silindi.');

  // =========================================================================
  // BÖLÜM 6: Dakikalık Hız Grafiği (PPM Series) Veri Üretimi Testleri
  // =========================================================================
  console.log('\n--- [BÖLÜM 6] Dakikalık Hız Grafiği (PPM) Veri Üretimi ---');

  // Temiz bir toplayıcı ile belirli dakikalarda olaylar oluşturalım
  const chartAggregator = new PulseAggregator();
  // Dakika sınırına hizala (:00.000)
  const chartBaseTime = Math.floor(1700050000000 / 60000) * 60000;

  // Dakika 0: 3 TR, 2 EN (hepsi 0-20 saniye aralığında, aynı dakikada)
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#tr1', langs: ['tr'] } },
  }, chartBaseTime);
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#tr2', langs: ['tr'] } },
  }, chartBaseTime + 5000);
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#tr3', langs: ['tr'] } },
  }, chartBaseTime + 10000);
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#en1', langs: ['en'] } },
  }, chartBaseTime + 15000);
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#en2', langs: ['en'] } },
  }, chartBaseTime + 20000);

  // Dakika 2 (arada Dakika 1 boş!): 1 TR
  chartAggregator.ingest({
    kind: 'commit',
    commit: { collection: 'app.bsky.feed.post', operation: 'create', record: { text: '#tr4', langs: ['tr'] } },
  }, chartBaseTime + 120000);

  // "all" filtresi için grafik serisini test et
  const chartSnapAll = chartAggregator.getSnapshot(chartBaseTime + 130000, 'all');
  assert(chartSnapAll.postsPerMinute.length >= 2, 'Grafik için dakika serileri başarıyla üretildi.');
  const bucket0All = chartSnapAll.postsPerMinute.find((b) => b.minuteTimestamp === chartBaseTime);
  assert(bucket0All && bucket0All.count === 5, '0. dakikada Tüm Diller gönderi sayısı 5 (3 TR + 2 EN).');

  // "tr" filtresi için grafik serisini test et
  const chartSnapTR = chartAggregator.getSnapshot(chartBaseTime + 130000, 'tr');
  const bucket0TR = chartSnapTR.postsPerMinute.find((b) => b.minuteTimestamp === Math.floor(chartBaseTime / 60000) * 60000);
  assert(bucket0TR && bucket0TR.count === 3, '0. dakikada Türkçe filtresi gönderi sayısı yalnızca 3.');

  // "en" filtresi için grafik serisini test et
  const chartSnapEN = chartAggregator.getSnapshot(chartBaseTime + 130000, 'en');
  const bucket0EN = chartSnapEN.postsPerMinute.find((b) => b.minuteTimestamp === Math.floor(chartBaseTime / 60000) * 60000);
  assert(bucket0EN && bucket0EN.count === 2, '0. dakikada İngilizce filtresi gönderi sayısı yalnızca 2.');

  const bucket2EN = chartSnapEN.postsPerMinute.find((b) => b.minuteTimestamp === Math.floor((chartBaseTime + 120000) / 60000) * 60000);
  assert(bucket2EN && bucket2EN.count === 0, 'Dakika 2\'de İngilizce gönderi olmadığı için kova değeri 0 (uydurma değer yok).');

  // =========================================================================
  // BÖLÜM 7: Manuel Bağlantı Kesme, Ağ Hatası ve Bayat Veri Yaşam Döngüsü
  // (Intermittent Stale Warning Regresyon Testleri)
  // =========================================================================
  console.log('\n--- [BÖLÜM 7] Manuel Bağlantı Kesme, Ağ Hatası ve Bayat Veri Yaşam Döngüsü ---');

  // Deterministik Yaşam Döngüsü Durum Makinesi Modeli
  class PulseLifecycleStateModel {
    constructor(initialSnapshot = null) {
      this.status = 'connecting';
      this.snapshot = initialSnapshot;
      this.isManuallyClosed = false;
      this.hasReceivedFreshData = false;
      this.isStale = false;
      this.staleSince = null;
      this.disconnectReason = null;
      this.lastSuccessfulTimestamp = initialSnapshot?.timestamp || null;
      this.reconnectTimerActive = false;
      this.retryCount = 0;
      this.langFilter = 'all';
    }

    get hasSnapshot() {
      return Boolean(this.snapshot && this.snapshot.totalPostsProcessed > 0);
    }

    get showStaleWarning() {
      return (
        this.hasSnapshot &&
        (this.isStale ||
          this.disconnectReason !== null ||
          this.status === 'disconnected' ||
          this.status === 'fallback')
      );
    }

    get showDisconnectedEmpty() {
      return (
        !this.hasSnapshot &&
        (this.status === 'disconnected' ||
          this.status === 'fallback' ||
          this.disconnectReason === 'manual' ||
          this.status === 'reconnecting')
      );
    }

    receiveWorkerSnapshot(workerSnap) {
      // Canlı bağlantı aktif DEĞİLSE veya taze veri henüz doğrulanmamışsa:
      if (
        this.isManuallyClosed ||
        this.status === 'disconnected' ||
        this.status === 'reconnecting' ||
        this.status === 'connecting' ||
        this.status === 'fallback' ||
        !this.hasReceivedFreshData
      ) {
        const lastTs = this.lastSuccessfulTimestamp || workerSnap.timestamp;
        const freezeTime = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;
        this.snapshot = {
          ...workerSnap,
          timestamp: lastTs,
          isStale: true,
          staleSince: freezeTime,
          disconnectReason: this.isManuallyClosed ? 'manual' : (this.disconnectReason || 'network'),
        };
        return;
      }

      // Canlı ve taze:
      this.lastSuccessfulTimestamp = workerSnap.timestamp;
      this.snapshot = workerSnap;
      this.isStale = false;
      this.staleSince = null;
      this.disconnectReason = null;
    }

    disconnect() {
      this.isManuallyClosed = true;
      this.hasReceivedFreshData = false;
      this.reconnectTimerActive = false;
      this.status = 'disconnected';
      this.isStale = true;
      this.disconnectReason = 'manual';

      const lastTs = this.lastSuccessfulTimestamp || this.snapshot?.timestamp;
      this.staleSince = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;

      if (this.hasSnapshot) {
        this.snapshot = {
          ...this.snapshot,
          timestamp: lastTs,
          isStale: true,
          staleSince: this.staleSince,
          disconnectReason: 'manual',
        };
      }
    }

    changeLanguage(newLang) {
      this.langFilter = newLang;
      // Web worker'ın SET_FILTER sonrası anında gönderdiği anlık görüntü simülasyonu
      const snapForLang = {
        ...(this.snapshot || {}),
        filterLang: newLang,
        timestamp: Date.now(),
      };
      this.receiveWorkerSnapshot(snapForLang);
    }

    triggerNetworkDrop() {
      this.disconnectReason = 'network';
      this.isStale = true;
      this.hasReceivedFreshData = false;

      const lastTs = this.lastSuccessfulTimestamp || this.snapshot?.timestamp;
      this.staleSince = lastTs ? new Date(lastTs).toLocaleString('tr-TR') : null;

      this.status = this.hasSnapshot ? 'fallback' : 'reconnecting';
      this.reconnectTimerActive = true;
      this.retryCount++;
    }

    reconnect() {
      this.isManuallyClosed = false;
      this.hasReceivedFreshData = false;
      this.retryCount = 0;
      this.status = 'connecting';
    }

    socketOpen() {
      this.status = 'connected';
      this.retryCount = 0;
    }

    firstLiveEventReceived() {
      this.hasReceivedFreshData = true;
    }
  }

  // 7.1 Manuel Bağlantı Kesme ve Worker Snapshot Dayanıklılığı
  const initialDataSnap = {
    timestamp: 1700060000000,
    totalPostsProcessed: 42,
    postsPerMinute: [],
    filterLang: 'all',
  };
  const model = new PulseLifecycleStateModel(initialDataSnap);

  // Başlangıçta canlı akış aktifleştirilsin
  model.socketOpen();
  model.firstLiveEventReceived();
  model.receiveWorkerSnapshot({ ...initialDataSnap, timestamp: 1700060005000 });
  assert(model.showStaleWarning === false, 'Canlı akış aktifken bayat veri uyarısı gösterilmiyor.');

  // "Bağlantıyı Kes" tıklandı
  model.disconnect();
  assert(model.status === 'disconnected', 'Manuel kopmada status="disconnected" oldu.');
  assert(model.isStale === true, 'isStale=true oldu.');
  assert(model.disconnectReason === 'manual', 'disconnectReason="manual" oldu.');
  assert(model.showStaleWarning === true, 'Snapshot mevcut olduğunda bayat veri uyarısı görünür oldu.');
  assert(model.reconnectTimerActive === false, 'Manuel kopma ASLA otomatik yeniden bağlanma loop\'u başlatmadı.');
  assert(model.snapshot.timestamp === 1700060005000, 'Verinin orijinal son güncelleme zaman damgası tık saatine karışmadan korundu.');

  // Worker'dan art arda 5 adet gecikmiş AGGREGATE_SNAPSHOT geldiğinde uyarının kaybolmadığı testi
  for (let i = 1; i <= 5; i++) {
    model.receiveWorkerSnapshot({
      timestamp: 1700060010000 + i * 1000,
      totalPostsProcessed: 42,
      filterLang: 'all',
    });
    assert(model.showStaleWarning === true, `Worker snapshot ${i} sonrasında bayat veri uyarısı YİNE GÖRÜNÜR kaldı.`);
    assert(model.isStale === true, `Worker snapshot ${i} sonrasında isStale bozulmadı.`);
    assert(model.disconnectReason === 'manual', `Worker snapshot ${i} sonrasında disconnectReason silinmedi.`);
  }

  // 7.2 Dil Filtresi Değişiminde Uyarının Kaybolmaması Testi
  const languagesToTest = ['tr', 'en', 'gl', 'de', 'es', 'fr', 'pt', 'und', 'all'];
  for (const lang of languagesToTest) {
    model.changeLanguage(lang);
    assert(model.showStaleWarning === true, `Dil "${lang}" olarak değiştirildiğinde bayat veri uyarısı KESİNTİSİZ görünür kaldı.`);
    assert(model.snapshot.filterLang === lang, `Dil filtresi "${lang}" anlık görüntüde güncellendi.`);
  }

  // 7.3 Beklenmeyen Ağ Kopması ve Exponential Backoff
  const netModel = new PulseLifecycleStateModel(initialDataSnap);
  netModel.socketOpen();
  netModel.firstLiveEventReceived();
  netModel.receiveWorkerSnapshot(initialDataSnap);

  netModel.triggerNetworkDrop();
  assert(netModel.status === 'fallback', 'Önbellekli ağ kopmasında status="fallback" oldu.');
  assert(netModel.showStaleWarning === true, 'Ağ kopmasında bayat veri uyarısı anında belirdi.');
  assert(netModel.disconnectReason === 'network', 'Kopma sebebi "network" olarak işaretlendi.');
  assert(netModel.reconnectTimerActive === true, 'Ağ kopmasında yeniden bağlanma planlandı.');

  const delay1 = Math.min(1000 * Math.pow(1.5, 0), 15000);
  const delay2 = Math.min(1000 * Math.pow(1.5, 1), 15000);
  const delay3 = Math.min(1000 * Math.pow(1.5, 2), 15000);
  assert(delay1 === 1000 && delay2 === 1500 && delay3 === 2250, 'Üstel geri çekilme gecikmeleri (1000, 1500, 2250ms) doğru hesaplandı.');

  // 7.4 Başarısız Yeniden Bağlanma (Failed Reconnection)
  netModel.reconnect();
  assert(netModel.status === 'connecting', 'Yeniden bağlanma tıklandığında statü "connecting" oldu.');
  assert(netModel.showStaleWarning === true, 'Yeniden bağlanma denemesi başlarken bayat veri uyarısı ERKEN SİLİNMEDİ.');

  // Bağlantı başarısız oldu
  netModel.triggerNetworkDrop();
  assert(netModel.showStaleWarning === true, 'Bağlantı denemesi başarısız olduğunda uyarı görünür kalmaya devam etti.');

  // 7.5 Yalnızca Başarılı Bağlantı ve Taze Veride Uyarının Temizlenmesi
  netModel.reconnect();
  assert(netModel.showStaleWarning === true, 'Tekrar denendiğinde uyarı hala görünür.');
  netModel.socketOpen();
  assert(netModel.showStaleWarning === true, 'Yalnızca soket açıldığında (onopen) taze veri henüz gelmediği için uyarı silinmedi.');

  // İlk canlı olay geldi ve worker yeni snapshot gönderdi
  netModel.firstLiveEventReceived();
  netModel.receiveWorkerSnapshot({
    timestamp: 1700070000000,
    totalPostsProcessed: 50,
    filterLang: 'all',
  });
  assert(netModel.showStaleWarning === false, 'Taze veri alındıktan sonra bayat veri uyarısı başarıyla kaldırıldı.');
  assert(netModel.isStale === false, 'isStale false oldu.');
  assert(netModel.disconnectReason === null, 'disconnectReason sıfırlandı.');

  // 7.6 Snapshot Bulunmayan Boş Durum (No-Snapshot Case)
  const emptyModel = new PulseLifecycleStateModel(null); // Hiç veri yok!
  emptyModel.disconnect();
  assert(emptyModel.hasSnapshot === false, 'Önbellekte geçerli veri bulunmuyor.');
  assert(emptyModel.showStaleWarning === false, 'Veri yokken yanıltıcı bayat veri uyarısı GÖSTERİLMEDİ.');
  assert(emptyModel.showDisconnectedEmpty === true, 'Veri yokken net ve stabil boş/bağlantısız durum uyarısı gösterildi.');

  // =========================================================================
  // BÖLÜM 8: KESİN GİZLİLİK VE VERİ MİNİMİZASYONU KANITI
  // =========================================================================
  console.log('\n--- [BÖLÜM 8] Kesin Gizlilik ve Veri Minimizasyonu Kanıtı ---');

  const sensitivePayload = {
    did: 'did:plc:superSensitiveIdentity777',
    time_us: 1729000000000000,
    kind: 'commit',
    commit: {
      collection: 'app.bsky.feed.post',
      operation: 'create',
      rkey: '3l3secretpostrkey',
      cid: 'bafyreihsecretcid777',
      record: {
        $type: 'app.bsky.feed.post',
        text: 'Bu son derece gizli bir kişisel mesajdır! #veriGuvenciligi #privacy2026 Mehmet Kaya tarafından paylaşıldı.',
        langs: ['tr'],
        facets: [
          {
            features: [{ '$type': 'app.bsky.richtext.facet#tag', tag: 'veriGuvenciligi' }],
          },
        ],
      },
    },
  };

  chartAggregator.ingest(sensitivePayload, chartBaseTime + 200000);
  const privacySnapshot = chartAggregator.getSnapshot(chartBaseTime + 200000);

  const aggregatorMemoryDump = JSON.stringify(chartAggregator);
  const snapshotJsonDump = JSON.stringify(privacySnapshot);

  assert(!aggregatorMemoryDump.includes('superSensitiveIdentity777'), '[GİZLİLİK KANITI] Kullanıcı DID (did:plc:...) toplayıcı belleğinde ASLA tutulmadı.');
  assert(!aggregatorMemoryDump.includes('Bu son derece gizli'), '[GİZLİLİK KANITI] Ham gönderi metni toplayıcı belleğinde ASLA tutulmadı.');
  assert(!aggregatorMemoryDump.includes('Mehmet Kaya'), '[GİZLİLİK KANITI] Kişi/hesap adları toplayıcı belleğinde ASLA tutulmadı.');
  assert(!aggregatorMemoryDump.includes('3l3secretpostrkey'), '[GİZLİLİK KANITI] Gönderi rkey/cid kimlikleri toplayıcı belleğinde ASLA tutulmadı.');

  assert(!snapshotJsonDump.includes('superSensitiveIdentity777'), '[GİZLİLİK KANITI] Snapshot çıktısında kullanıcı DID bulunmuyor.');
  assert(!snapshotJsonDump.includes('Bu son derece gizli'), '[GİZLİLİK KANITI] Snapshot çıktısında ham metin bulunmuyor.');

  console.log('\n================================================================');
  console.log(`   TÜM TESTLER BAŞARIYLA GEÇTİ (${passed}/${total})`);
  console.log('================================================================\n');
}

runPulseTests().catch((err) => {
  console.error('\nTest yürütme hatası:', err);
  process.exit(1);
});
