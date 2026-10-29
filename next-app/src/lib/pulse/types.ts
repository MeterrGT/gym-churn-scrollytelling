export type PulseStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'fallback';

export interface TagMetric {
  tag: string;
  count5m: number;
  count1h: number;
  lastSeen: number; // unix timestamp ms
  trend: 'up' | 'stable' | 'down';
}

export interface MinuteBucket {
  minuteTimestamp: number; // unix timestamp ms rounded to minute start
  postCount: number; // toplam gönderi sayısı
  postsByLang: Record<string, number>; // dil bazında gönderi sayıları (örn. { tr: 3, en: 12, und: 2 })
  tagCounts: Record<string, number>; // tüm dillerdeki etiket frekansları
  tagsByLang: Record<string, Record<string, number>>; // dil bazında etiket frekansları (örn. { tr: { yapayzeka: 2 } })
}

export interface MinuteRate {
  minuteTimestamp: number;
  count: number;
  formattedTime: string;
}

export interface LanguageOption {
  code: string; // e.g. 'all', 'tr', 'en', 'gl', 'und'
  label: string; // e.g. 'Türkçe (tr)', 'İngilizce (en)', 'Belirtilmemiş / Bilinmiyor (und)'
  count1h: number;
  count5m: number;
}

export interface PulseAggregateSnapshot {
  timestamp: number;
  postsPerMinute: MinuteRate[];
  currentRatePerMinute: number;
  currentRatePerSecond: number;
  totalEventsReceived: number;
  totalPostsProcessed: number;
  totalHashtagsExtracted: number;
  uniqueTagsCount5m: number;
  uniqueTagsCount1h: number;
  topTags5m: TagMetric[];
  topTags1h: TagMetric[];
  langDistribution: Record<string, number>;
  availableLanguages: LanguageOption[];
  filterLang: string; // 'all' veya belirli bir dil kodu (örn. 'tr')
  isStale?: boolean;
  staleSince?: string;
  disconnectReason?: 'manual' | 'network' | null;
}

export type WorkerIncomingMessage =
  | { type: 'INGEST_RAW'; rawJson: string; receivedAt: number }
  | { type: 'SET_FILTER'; lang: string }
  | { type: 'REQUEST_SNAPSHOT' }
  | { type: 'RESET' };

export type WorkerOutgoingMessage =
  | { type: 'AGGREGATE_SNAPSHOT'; snapshot: PulseAggregateSnapshot }
  | { type: 'WORKER_ERROR'; error: string };
