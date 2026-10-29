/**
 * BVA 2245 — Canlı Sosyal Medya Nabzı Web Worker
 *
 * Çok dilli, gizlilik öncelikli kayan pencere agregasyon worker'ı.
 * Ana iş parçacığını (UI thread) bloklamadan arka planda çalışır.
 */

const KNOWN_LABELS = {
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

function getLanguageLabel(code) {
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

function normalizeLanguageCodes(rawLangs) {
  if (!Array.isArray(rawLangs) || rawLangs.length === 0) {
    return ['und'];
  }

  const validCodes = new Set();
  for (const item of rawLangs) {
    if (typeof item !== 'string') continue;
    const clean = item.trim().toLowerCase();
    if (!clean) continue;
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

class PulseWorkerAggregator {
  constructor() {
    this.minuteBuckets = new Map();
    this.lastSeenMap = new Map();
    this.totalEventsReceived = 0;
    this.totalPostsProcessed = 0;
    this.totalHashtagsExtracted = 0;
    this.langTotals = new Map();
    this.recentTimestamps = [];
    this.filterLang = 'all';
  }

  setFilter(lang) {
    this.filterLang = lang || 'all';
  }

  ingest(rawMessage, receivedAt = Date.now()) {
    this.totalEventsReceived++;

    let data;
    if (typeof rawMessage === 'string') {
      try {
        data = JSON.parse(rawMessage);
      } catch {
        return null;
      }
    } else {
      data = rawMessage;
    }

    if (!data || typeof data !== 'object') return null;

    const commit = data.commit;
    if (commit && commit.collection && commit.collection !== 'app.bsky.feed.post') return null;
    if (commit && commit.operation && commit.operation !== 'create') return null;

    const record = commit?.record || (data.kind === 'commit' ? data.record : null);
    if (!record || typeof record !== 'object') return null;

    this.totalPostsProcessed++;

    const rawTagSet = new Set();

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

    const langs = normalizeLanguageCodes(record.langs);
    this.recentTimestamps.push({ time: receivedAt, langs });

    const normalizedTags = [];
    for (const tag of rawTagSet) {
      const clean = tag.trim().toLowerCase();
      if (clean.length >= 2 && !/^\d+$/.test(clean)) {
        normalizedTags.push(clean);
      }
    }

    this.totalHashtagsExtracted += normalizedTags.length;

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

    for (const tag of normalizedTags) {
      bucket.tagCounts[tag] = (bucket.tagCounts[tag] || 0) + 1;
      this.lastSeenMap.set(tag, receivedAt);
    }

    this.prune(receivedAt);
    return true;
  }

  prune(now = Date.now()) {
    const oneHourCutoff = now - 3600000;
    for (const [minuteKey] of this.minuteBuckets) {
      if (minuteKey < oneHourCutoff) {
        this.minuteBuckets.delete(minuteKey);
      }
    }
    const tenSecCutoff = now - 10000;
    this.recentTimestamps = this.recentTimestamps.filter((t) => t.time >= tenSecCutoff);
  }

  getSnapshot(now = Date.now(), filterLang = this.filterLang) {
    this.prune(now);

    const fiveMinCutoff = now - 300000;
    const oneHourCutoff = now - 3600000;
    const half5mCutoff = now - 150000;

    const isFiltered = Boolean(filterLang && filterLang !== 'all');
    const targetLang = isFiltered ? filterLang : null;

    const tagCounts5m = new Map();
    const tagCounts1h = new Map();
    const tagCountsFirstHalf5m = new Map();
    const tagCountsSecondHalf5m = new Map();

    const activeLangCounts1h = new Map();
    const activeLangCounts5m = new Map();

    let filteredTotalPosts1h = 0;
    let filteredTotalPosts5m = 0;

    const postsPerMinute = [];
    const sortedMinuteKeys = Array.from(this.minuteBuckets.keys()).sort((a, b) => a - b);

    for (const minuteKey of sortedMinuteKeys) {
      if (minuteKey < oneHourCutoff) continue;

      const bucket = this.minuteBuckets.get(minuteKey);

      for (const [lang, count] of Object.entries(bucket.postsByLang)) {
        activeLangCounts1h.set(lang, (activeLangCounts1h.get(lang) || 0) + count);
        if (minuteKey >= fiveMinCutoff) {
          activeLangCounts5m.set(lang, (activeLangCounts5m.get(lang) || 0) + count);
        }
      }

      const bucketPostCount = isFiltered
        ? bucket.postsByLang[targetLang] || 0
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

      const currentTags = isFiltered
        ? bucket.tagsByLang[targetLang] || {}
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

    const getTrend = (tag) => {
      const recent = tagCountsSecondHalf5m.get(tag) || 0;
      const earlier = tagCountsFirstHalf5m.get(tag) || 0;
      if (recent > earlier + 1) return 'up';
      if (earlier > recent + 1) return 'down';
      return 'stable';
    };

    const topTags5m = Array.from(tagCounts5m.entries())
      .map(([tag, count5m]) => ({
        tag,
        count5m,
        count1h: tagCounts1h.get(tag) || count5m,
        lastSeen: this.lastSeenMap.get(tag) || now,
        trend: getTrend(tag),
      }))
      .sort((a, b) => b.count5m - a.count5m)
      .slice(0, 50);

    const topTags1h = Array.from(tagCounts1h.entries())
      .map(([tag, count1h]) => ({
        tag,
        count5m: tagCounts5m.get(tag) || 0,
        count1h,
        lastSeen: this.lastSeenMap.get(tag) || now,
        trend: getTrend(tag),
      }))
      .sort((a, b) => b.count1h - a.count1h)
      .slice(0, 50);

    const recentEvents = isFiltered
      ? this.recentTimestamps.filter((t) => t.langs.includes(targetLang))
      : this.recentTimestamps;

    const recent10sCount = recentEvents.length;
    const currentRatePerSecond = Number((recent10sCount / 10).toFixed(1));

    const currentMinuteKey = Math.floor(now / 60000) * 60000;
    const currentBucket = this.minuteBuckets.get(currentMinuteKey);
    const prevBucket = this.minuteBuckets.get(currentMinuteKey - 60000);

    const currentMinPosts = currentBucket
      ? (isFiltered ? currentBucket.postsByLang[targetLang] || 0 : currentBucket.postCount)
      : 0;
    const prevMinPosts = prevBucket
      ? (isFiltered ? prevBucket.postsByLang[targetLang] || 0 : prevBucket.postCount)
      : 0;

    const currentRatePerMinute = Math.max(
      currentMinPosts + Math.round(prevMinPosts * 0.3),
      recent10sCount * 6
    );

    const availableLanguages = [
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

    const langDistribution = {};
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
      filterLang: this.filterLang,
    };
  }

  reset() {
    this.minuteBuckets.clear();
    this.lastSeenMap.clear();
    this.totalEventsReceived = 0;
    this.totalPostsProcessed = 0;
    this.totalHashtagsExtracted = 0;
    this.langTotals.clear();
    this.recentTimestamps = [];
  }
}

const aggregator = new PulseWorkerAggregator();

let pendingEmit = false;
let lastEmitTime = 0;
const EMIT_INTERVAL_MS = 1000;

function scheduleEmit() {
  if (pendingEmit) return;
  const now = Date.now();
  const elapsed = now - lastEmitTime;

  if (elapsed >= EMIT_INTERVAL_MS) {
    lastEmitTime = now;
    self.postMessage({
      type: 'AGGREGATE_SNAPSHOT',
      snapshot: aggregator.getSnapshot(now),
    });
  } else {
    pendingEmit = true;
    setTimeout(() => {
      pendingEmit = false;
      lastEmitTime = Date.now();
      self.postMessage({
        type: 'AGGREGATE_SNAPSHOT',
        snapshot: aggregator.getSnapshot(lastEmitTime),
      });
    }, EMIT_INTERVAL_MS - elapsed);
  }
}

self.onmessage = function (e) {
  const msg = e.data;
  if (!msg || typeof msg !== 'object') return;

  switch (msg.type) {
    case 'INGEST_RAW':
      aggregator.ingest(msg.rawJson, msg.receivedAt || Date.now());
      scheduleEmit();
      break;

    case 'SET_FILTER':
      aggregator.setFilter(msg.lang || 'all');
      self.postMessage({
        type: 'AGGREGATE_SNAPSHOT',
        snapshot: aggregator.getSnapshot(),
      });
      break;

    case 'REQUEST_SNAPSHOT':
      self.postMessage({
        type: 'AGGREGATE_SNAPSHOT',
        snapshot: aggregator.getSnapshot(),
      });
      break;

    case 'RESET':
      aggregator.reset();
      self.postMessage({
        type: 'AGGREGATE_SNAPSHOT',
        snapshot: aggregator.getSnapshot(),
      });
      break;
  }
};
