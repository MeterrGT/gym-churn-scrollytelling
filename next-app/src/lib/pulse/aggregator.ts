import type {
  LanguageOption,
  MinuteBucket,
  MinuteRate,
  PulseAggregateSnapshot,
  TagMetric,
} from './types.ts';

/**
 * Bilinen diller için Türkçe arayüz etiketleri.
 */
const KNOWN_LABELS: Record<string, string> = {
  all: 'Tüm Diller (All Languages)',
  und: 'Belirtilmemiş / Bilinmiyor (und)',
  tr: 'Türkçe (tr)',
  en: 'İngilizce (en)',
  gl: 'Galiçyaca (gl)',
  pt: 'Portekizce (pt)',
  de: 'Almanca (de)',
  es: 'İspanyolca (es)',
  fr: 'Fransızca (fr)',
  ja: 'Japonca (ja)',
  it: 'İtalyanca (it)',
  ru: 'Rusça (ru)',
  zh: 'Çince (zh)',
  ko: 'Korece (ko)',
  ar: 'Arapça (ar)',
  nl: 'Felemenkçe (nl)',
  pl: 'Lehçe (pl)',
  uk: 'Ukraynaca (uk)',
  sv: 'İsveççe (sv)',
  hi: 'Hintçe (hi)',
};

/**
 * Dil koduna karşılık gelen insan tarafından okunabilir etiketi döndürür.
 */
export function getLanguageLabel(code: string): string {
  if (code === 'all') return 'Tüm Diller (All Languages)';
  if (code === 'und') return 'Belirtilmemiş / Bilinmiyor (und)';
  if (KNOWN_LABELS[code]) return KNOWN_LABELS[code];

  try {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const dn = new Intl.DisplayNames(['tr', 'en'], { type: 'language' });
      const name = dn.of(code);
      if (name && name.toLowerCase() !== code.toLowerCase()) {
        return `${name} (${code})`;
      }
    }
  } catch {}

  return `${code.toUpperCase()} (${code})`;
}

/**
 * Ham diller dizisini BCP-47 / ISO 639 standartlarına göre normalize eder.
 * Boş, geçersiz veya eksik değerleri güvenle 'und' (Undetermined) grubuna atar.
 */
export function normalizeLanguageCodes(rawLangs: unknown): string[] {
  if (!Array.isArray(rawLangs) || rawLangs.length === 0) {
    return ['und'];
  }

  const validCodes = new Set<string>();

  for (const item of rawLangs) {
    if (typeof item !== 'string') continue;
    const clean = item.trim().toLowerCase();
    if (!clean) continue;

    // "en-US", "pt-BR", "zh-Hans" gibi bölgesel kodlardan temel dili al
    const primary = clean.split(/[-_]/)[0];
    if (/^[a-z]{2,3}$/.test(primary)) {
      validCodes.add(primary);
    }
  }

  if (validCodes.size === 0) {
    return ['und'];
  }

  return Array.from(validCodes);
}

/**
 * BVA 2245 — Canlı Sosyal Medya Nabzı (PulseAggregator)
 *
 * ÇOK DİLLİ VE GİZLİLİK ÖNCELİKLİ KAYAN PENCERE TOPLAYICI
 */
export class PulseAggregator {
  // En fazla 60 adet 1 dakikalık kova (son 1 saat = 60 dk)
  private minuteBuckets: Map<number, MinuteBucket> = new Map();
  private lastSeenMap: Map<string, number> = new Map();
  private totalEventsReceived: number = 0;
  private totalPostsProcessed: number = 0;
  private totalHashtagsExtracted: number = 0;
  private langTotals: Map<string, number> = new Map();

  private filterLang: string = 'all';

  // Son saniyelerdeki olayların zaman damgaları (hız hesabı için)
  private recentTimestamps: Array<{ time: number; langs: string[] }> = [];

  constructor() {}

  public setFilter(lang: string): void {
    this.filterLang = lang || 'all';
  }

  /**
   * Ham Jetstream WebSocket JSON iletisini işler.
   * Ham metin veya kullanıcı kimliği DÖNDÜRMEZ ve SAKLAMAZ.
   */
  public ingest(
    rawMessage: string | Record<string, unknown>,
    receivedAt: number = Date.now()
  ): { tags: string[]; langs: string[] } | null {
    this.totalEventsReceived++;

    let data: any;
    if (typeof rawMessage === 'string') {
      try {
        data = JSON.parse(rawMessage);
      } catch {
        return null;
      }
    } else {
      data = rawMessage;
    }

    if (!data || typeof data !== 'object') {
      return null;
    }

    const commit = data.commit;
    if (commit && commit.collection && commit.collection !== 'app.bsky.feed.post') {
      return null;
    }

    if (commit && commit.operation && commit.operation !== 'create') {
      return null;
    }

    const record = commit?.record || (data.kind === 'commit' ? data.record : null);
    if (!record || typeof record !== 'object') {
      return null;
    }

    this.totalPostsProcessed++;

    // 1. Etiketleri Ayıkla (Facets + Regex)
    const rawTagSet = new Set<string>();

    if (Array.isArray(record.facets)) {
      for (const facet of record.facets) {
        if (facet && Array.isArray(facet.features)) {
          for (const feat of facet.features) {
            if (feat && (feat['$type'] === 'app.bsky.richtext.facet#tag' || feat.tag)) {
              const t = feat.tag || feat['$tag'];
              if (typeof t === 'string' && t.trim().length > 0) {
                rawTagSet.add(t);
              }
            }
          }
        }
      }
    }

    if (typeof record.text === 'string' && record.text.includes('#')) {
      const matches = record.text.match(/#([\p{L}\p{N}_]+)/gu);
      if (matches) {
        for (const m of matches) {
          const stripped = m.replace(/^#+/, '');
          if (stripped.length > 0) {
            rawTagSet.add(stripped);
          }
        }
      }
    }

    // 2. Dilleri Ayıkla ve Normalize Et (Çoklu dil ve eksik dil desteği)
    const langs = normalizeLanguageCodes(record.langs);
    this.recentTimestamps.push({ time: receivedAt, langs });

    // 3. Etiketleri Normalize Et (Küçük harf, min 2 karakter, salt sayı olmama)
    const normalizedTags: string[] = [];
    for (const tag of rawTagSet) {
      const clean = tag.trim().toLowerCase();
      if (clean.length >= 2 && !/^\d+$/.test(clean)) {
        normalizedTags.push(clean);
      }
    }

    this.totalHashtagsExtracted += normalizedTags.length;

    // 4. Kayan Pencere Kova Güncellemesi
    const minuteKey = Math.floor(receivedAt / 60000) * 60000;
    let bucket = this.minuteBuckets.get(minuteKey);
    if (!bucket) {
      bucket = {
        minuteTimestamp: minuteKey,
        postCount: 0,
        postsByLang: {},
        tagCounts: {},
        tagsByLang: {},
      };
      this.minuteBuckets.set(minuteKey, bucket);
    }

    bucket.postCount++;

    // Dil bazında sayaçları güncelle
    for (const lang of langs) {
      bucket.postsByLang[lang] = (bucket.postsByLang[lang] || 0) + 1;
      this.langTotals.set(lang, (this.langTotals.get(lang) || 0) + 1);

      if (!bucket.tagsByLang[lang]) {
        bucket.tagsByLang[lang] = {};
      }

      for (const tag of normalizedTags) {
        bucket.tagsByLang[lang][tag] = (bucket.tagsByLang[lang][tag] || 0) + 1;
      }
    }

    // Genel etiket sayaçlarını güncelle
    for (const tag of normalizedTags) {
      bucket.tagCounts[tag] = (bucket.tagCounts[tag] || 0) + 1;
      this.lastSeenMap.set(tag, receivedAt);
    }

    // 5. 60 dakikadan eski verileri temizle
    this.prune(receivedAt);

    return {
      tags: normalizedTags,
      langs,
    };
  }

  /**
   * 60 dakikadan (1 saat) eski verileri temizler (bounded memory).
   */
  public prune(now: number = Date.now()): void {
    const oneHourCutoff = now - 3600000; // 60 dakika
    for (const [minuteKey] of this.minuteBuckets) {
      if (minuteKey < oneHourCutoff) {
        this.minuteBuckets.delete(minuteKey);
      }
    }

    const tenSecCutoff = now - 10000;
    this.recentTimestamps = this.recentTimestamps.filter((t) => t.time >= tenSecCutoff);
  }

  /**
   * Anlık toplu metrik görüntüsünü (Aggregate Snapshot) üretir.
   * filterLang: 'all' veya belirli bir dil kodu (örn. 'tr', 'en', 'gl', 'und').
   */
  public getSnapshot(
    now: number = Date.now(),
    filterLang?: string
  ): PulseAggregateSnapshot {
    this.prune(now);

    const effectiveLang = filterLang !== undefined ? filterLang : this.filterLang;
    const fiveMinCutoff = now - 300000; // Son 5 dakika
    const oneHourCutoff = now - 3600000; // Son 1 saat
    const half5mCutoff = now - 150000; // Son 2.5 dakika (trend için)

    const isFiltered = Boolean(effectiveLang && effectiveLang !== 'all');
    const targetLang = isFiltered ? effectiveLang : null;

    const tagCounts5m = new Map<string, number>();
    const tagCounts1h = new Map<string, number>();
    const tagCountsFirstHalf5m = new Map<string, number>();
    const tagCountsSecondHalf5m = new Map<string, number>();

    // Mevcut kovalardaki tüm aktif dilleri tespit et (dropdown için dinamik liste)
    const activeLangCounts1h = new Map<string, number>();
    const activeLangCounts5m = new Map<string, number>();

    let filteredTotalPosts1h = 0;
    let filteredTotalPosts5m = 0;

    const postsPerMinute: MinuteRate[] = [];
    const sortedMinuteKeys = Array.from(this.minuteBuckets.keys()).sort((a, b) => a - b);

    for (const minuteKey of sortedMinuteKeys) {
      if (minuteKey < oneHourCutoff) continue;

      const bucket = this.minuteBuckets.get(minuteKey)!;

      // Dil seçenekleri sayaçları (tüm aktif diller için)
      for (const [lang, count] of Object.entries(bucket.postsByLang)) {
        activeLangCounts1h.set(lang, (activeLangCounts1h.get(lang) || 0) + count);
        if (minuteKey >= fiveMinCutoff) {
          activeLangCounts5m.set(lang, (activeLangCounts5m.get(lang) || 0) + count);
        }
      }

      // Bu dakikadaki gönderi sayısı (dil filtresine duyarlı)
      const bucketPostCount = isFiltered
        ? bucket.postsByLang[targetLang!] || 0
        : bucket.postCount;

      filteredTotalPosts1h += bucketPostCount;
      if (minuteKey >= fiveMinCutoff) {
        filteredTotalPosts5m += bucketPostCount;
      }

      const d = new Date(minuteKey);
      const formattedTime = `${d.getHours().toString().padStart(2, '0')}:${d
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      postsPerMinute.push({
        minuteTimestamp: minuteKey,
        count: bucketPostCount,
        formattedTime,
      });

      // Etiket havuzu (filtrelenmiş veya global)
      const currentTags = isFiltered
        ? bucket.tagsByLang[targetLang!] || {}
        : bucket.tagCounts;

      for (const [tag, count] of Object.entries(currentTags)) {
        tagCounts1h.set(tag, (tagCounts1h.get(tag) || 0) + count);

        if (minuteKey >= fiveMinCutoff) {
          tagCounts5m.set(tag, (tagCounts5m.get(tag) || 0) + count);

          if (minuteKey >= half5mCutoff) {
            tagCountsSecondHalf5m.set(tag, (tagCountsSecondHalf5m.get(tag) || 0) + count);
          } else {
            tagCountsFirstHalf5m.set(tag, (tagCountsFirstHalf5m.get(tag) || 0) + count);
          }
        }
      }
    }

    // Trend fonksiyonu
    const getTrend = (tag: string): 'up' | 'stable' | 'down' => {
      const recent = tagCountsSecondHalf5m.get(tag) || 0;
      const earlier = tagCountsFirstHalf5m.get(tag) || 0;
      if (recent > earlier + 1) return 'up';
      if (earlier > recent + 1) return 'down';
      return 'stable';
    };

    // 5 Dk Top Etiketler
    const topTags5m: TagMetric[] = Array.from(tagCounts5m.entries())
      .map(([tag, count5m]) => ({
        tag,
        count5m,
        count1h: tagCounts1h.get(tag) || count5m,
        lastSeen: this.lastSeenMap.get(tag) || now,
        trend: getTrend(tag),
      }))
      .sort((a, b) => b.count5m - a.count5m)
      .slice(0, 50);

    // 1 Saat Top Etiketler
    const topTags1h: TagMetric[] = Array.from(tagCounts1h.entries())
      .map(([tag, count1h]) => ({
        tag,
        count5m: tagCounts5m.get(tag) || 0,
        count1h,
        lastSeen: this.lastSeenMap.get(tag) || now,
        trend: getTrend(tag),
      }))
      .sort((a, b) => b.count1h - a.count1h)
      .slice(0, 50);

    // Anlık Hız Hesaplamaları (Seçili Dile Duyarlı)
    const recentEvents = isFiltered
      ? this.recentTimestamps.filter((t) => t.langs.includes(targetLang!))
      : this.recentTimestamps;

    const recent10sCount = recentEvents.length;
    const currentRatePerSecond = Number((recent10sCount / 10).toFixed(1));

    const currentMinuteKey = Math.floor(now / 60000) * 60000;
    const currentBucket = this.minuteBuckets.get(currentMinuteKey);
    const prevBucket = this.minuteBuckets.get(currentMinuteKey - 60000);

    const currentMinPosts = currentBucket
      ? (isFiltered ? currentBucket.postsByLang[targetLang!] || 0 : currentBucket.postCount)
      : 0;
    const prevMinPosts = prevBucket
      ? (isFiltered ? prevBucket.postsByLang[targetLang!] || 0 : prevBucket.postCount)
      : 0;

    const currentRatePerMinute = Math.max(
      currentMinPosts + Math.round(prevMinPosts * 0.3),
      recent10sCount * 6
    );

    // Dinamik Dil Seçenekleri Listesi
    const availableLanguages: LanguageOption[] = [
      {
        code: 'all',
        label: getLanguageLabel('all'),
        count1h: this.totalPostsProcessed,
        count5m: filteredTotalPosts5m,
      },
    ];

    const sortedLangs = Array.from(activeLangCounts1h.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [lang, count1h] of sortedLangs) {
      availableLanguages.push({
        code: lang,
        label: getLanguageLabel(lang),
        count1h,
        count5m: activeLangCounts5m.get(lang) || 0,
      });
    }

    // Dil Dağılımı (Top 10)
    const langDistribution: Record<string, number> = {};
    for (const [l, count] of sortedLangs.slice(0, 10)) {
      langDistribution[l] = count;
    }

    return {
      timestamp: now,
      postsPerMinute,
      currentRatePerMinute,
      currentRatePerSecond,
      totalEventsReceived: this.totalEventsReceived,
      totalPostsProcessed: isFiltered ? filteredTotalPosts1h : this.totalPostsProcessed,
      totalHashtagsExtracted: this.totalHashtagsExtracted,
      uniqueTagsCount5m: tagCounts5m.size,
      uniqueTagsCount1h: tagCounts1h.size,
      topTags5m,
      topTags1h,
      langDistribution,
      availableLanguages,
      filterLang: effectiveLang,
    };
  }

  /**
   * Tüm kova ve metrikleri sıfırlar.
   */
  public reset(): void {
    this.minuteBuckets.clear();
    this.lastSeenMap.clear();
    this.totalEventsReceived = 0;
    this.totalPostsProcessed = 0;
    this.totalHashtagsExtracted = 0;
    this.langTotals.clear();
    this.recentTimestamps = [];
    this.filterLang = 'all';
  }
}
