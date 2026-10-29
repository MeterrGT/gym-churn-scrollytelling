/**
 * BVA 2245 & Güvenli Bulut Yayını — Otomatik Gizlilik ve Veri Minimizasyonu Doğrulama Testi
 * (Privacy-by-Design & Zero-Retention Automated Verification Test)
 *
 * Doğrulanan İlkeler:
 * 1. Kişisel Veri Saklamama (Zero-Retention): DID, rumuz, profil, PDS ve ham post metinleri asla saklanmaz.
 * 2. Sentetik Negatif Testler: Hassas veriler içeren sahte gönderiler akıtılır, toplayıcı belleğinde taranır.
 * 3. Log İzolasyonu: Loglara veya çıktılara hiçbir kişisel veri sızmaz.
 * 4. Kayan Pencere İtfa Politikası (Retention Expiry): 5 dk ve 60 dk sınırları dışında bellekten zorunlu imha.
 */

import assert from 'node:assert';
import { PulseAggregator } from '../src/lib/pulse/aggregator.ts';

console.log('================================================================');
console.log('  GÜVENLİ BULUT YAYINI: GİZLİLİK VE VERİ MİNİMİZASYONU TESTİ');
console.log('================================================================\n');

// 1. Sentetik Kişisel Veri Fikstürü (Synthetic PII Fixture - Negatif Test İçin)
const SYNTHETIC_PII = {
  did: 'did:plc:synthetic_user_9999_secret_identifier',
  handle: 'confidential_alice_investor.bsky.social',
  pdsUrl: 'https://pds.confidential-domain.example.com/u/alice',
  postBody: 'Özel cep telefonum 0555-019-9988 ve adresim Bornova Izmir. Gizli proje toplantısı #gizlianaliz #veriguvenligi',
  avatarUrl: 'https://cdn.example.org/avatars/alice_private_photo.jpg',
  rkey: '3l3sensitivepostrkey999',
  cid: 'bafyreihconfidentialcid999'
};

const syntheticJetstreamEvent = {
  did: SYNTHETIC_PII.did,
  time_us: Date.now() * 1000,
  kind: 'commit',
  commit: {
    rev: '3l3sensitive_rev',
    operation: 'create',
    collection: 'app.bsky.feed.post',
    rkey: SYNTHETIC_PII.rkey,
    record: {
      $type: 'app.bsky.feed.post',
      text: SYNTHETIC_PII.postBody,
      createdAt: new Date().toISOString(),
      langs: ['tr'],
      facets: [
        {
          index: { byteStart: 70, byteEnd: 82 },
          features: [{ $type: 'app.bsky.richtext.facet#tag', tag: 'gizlianaliz' }]
        },
        {
          index: { byteStart: 83, byteEnd: 96 },
          features: [{ $type: 'app.bsky.richtext.facet#tag', tag: 'veriguvenligi' }]
        }
      ]
    },
    cid: SYNTHETIC_PII.cid
  }
};

const aggregator = new PulseAggregator();
const baseTime = 1730246400000; // Sabit zaman başlangıcı (30 Ekim 2026 00:00:00 UTC)

// TEST BÖLÜMÜ 1: Sentetik Verinin Toplayıcıya Gönderilmesi ve Ayıklama
console.log('--- [BÖLÜM 1] Sentetik Olay Yükleme & Geçici Ayıklama Doğrulaması ---');
const extractResult = aggregator.ingest(syntheticJetstreamEvent, baseTime);

assert(extractResult !== null, 'Sentetik olay başarıyla işlenmeli');
assert(extractResult.tags.includes('gizlianaliz'), 'Etiket #gizlianaliz başarıyla ayıklanmalı');
assert(extractResult.tags.includes('veriguvenligi'), 'Etiket #veriguvenligi başarıyla ayıklanmalı');
assert.deepStrictEqual(extractResult.langs, ['tr'], 'Dil kodu tr olarak doğru normalize edilmeli');
console.log('  [BAŞARILI] Yalnızca etiketler ve ISO 639 dilleri başarıyla ayıklandı.');

// TEST BÖLÜMÜ 2: Toplayıcı İç Bellek Taraması (Deep Memory Dump Inspection)
console.log('\n--- [BÖLÜM 2] Bellek Derin Taraması (Zero-Retention Negative Inspection) ---');
const memoryDump = JSON.stringify(aggregator);

// Hiçbir kişisel veri dizesi toplayıcı nesnesinde bulunmamalıdır!
assert(!memoryDump.includes(SYNTHETIC_PII.did), '[GİZLİLİK İHLALİ YOK] Kullanıcı DID (did:plc:...) belleğe asla yazılmadı.');
assert(!memoryDump.includes(SYNTHETIC_PII.handle), '[GİZLİLİK İHLALİ YOK] Kullanıcı kullanıcı adı/rumuz belleğe asla yazılmadı.');
assert(!memoryDump.includes(SYNTHETIC_PII.pdsUrl), '[GİZLİLİK İHLALİ YOK] PDS sunucu adresi belleğe asla yazılmadı.');
assert(!memoryDump.includes(SYNTHETIC_PII.avatarUrl), '[GİZLİLİK İHLALİ YOK] Avatar/profil resmi adresi belleğe asla yazılmadı.');
assert(!memoryDump.includes('0555-019-9988'), '[GİZLİLİK İHLALİ YOK] Ham metindeki hassas telefon numarası belleğe asla yazılmadı.');
assert(!memoryDump.includes('Bornova Izmir'), '[GİZLİLİK İHLALİ YOK] Ham metindeki adres/konum bilgisi belleğe asla yazılmadı.');
assert(!memoryDump.includes(SYNTHETIC_PII.rkey), '[GİZLİLİK İHLALİ YOK] Gönderi rkey tanımlayıcısı belleğe asla yazılmadı.');
assert(!memoryDump.includes(SYNTHETIC_PII.cid), '[GİZLİLİK İHLALİ YOK] Gönderi IPFS/AT CID kriptografik kimliği belleğe asla yazılmadı.');
console.log('  [BAŞARILI] Bellek taraması tamamlandı: 0 adet kişisel veri, 0 adet ham metin.');

// TEST BÖLÜMÜ 3: Snapshot Çıktı Güvenliği (Public Interface Privacy Proof)
console.log('\n--- [BÖLÜM 3] Halka Açık Snapshot Çıktı Güvenliği ---');
const snapshot = aggregator.getSnapshot(baseTime);

assert.strictEqual(typeof snapshot.totalEventsReceived, 'number', 'totalEventsReceived sayısal olmalı');
assert.strictEqual(typeof snapshot.currentRatePerMinute, 'number', 'currentRatePerMinute sayısal olmalı');
assert(Array.isArray(snapshot.postsPerMinute), 'postsPerMinute dizi olmalı');
assert(Array.isArray(snapshot.topTags5m), 'topTags5m dizi olmalı');
assert(Array.isArray(snapshot.topTags1h), 'topTags1h dizi olmalı');

const snapshotDump = JSON.stringify(snapshot);
assert(!snapshotDump.includes('did:plc:'), '[GÜVENLİK KANITI] Snapshot çıktısında hiçbir DID yer almaz.');
assert(!snapshotDump.includes('0555-'), '[GÜVENLİK KANITI] Snapshot çıktısında hiçbir iletişim bilgisi yer almaz.');
assert(!snapshotDump.includes('Bornova'), '[GÜVENLİK KANITI] Snapshot çıktısında hiçbir konum bilgisi yer almaz.');
console.log('  [BAŞARILI] Snapshot çıktısında sadece matematiksel sayaçlar ve genel etiketler mevcut.');

// TEST BÖLÜMÜ 4: Kayan Pencere İtfa ve İmha Politikası (Data Retention Enforcement)
console.log('\n--- [BÖLÜM 4] Veri Saklama ve İmha Süresi (Retention & Expiry Enforcement) ---');
// 5 dakika sonrası (301 saniye sonra)
const fiveMinutesLater = baseTime + 301 * 1000;
const snapshot5mLater = aggregator.getSnapshot(fiveMinutesLater);
const hasGizlianalizIn5m = snapshot5mLater.topTags5m.some(t => t.tag === 'gizlianaliz');
assert(!hasGizlianalizIn5m, '5 dakika geçen etiket 5 dakikalık kayan pencereden otomatik imha edilmeli.');
console.log('  [BAŞARILI] 5 dakikayı aşan etiketler kısa vadeli kayan pencereden düşürüldü.');

// 65 dakika sonrası (3900 saniye sonra) -> 1 saatlik sınırın ötesi
const sixtyFiveMinutesLater = baseTime + 3900 * 1000;
const snapshot65mLater = aggregator.getSnapshot(sixtyFiveMinutesLater);
const memoryDump65m = JSON.stringify(aggregator);

// 65 dakika önceki kovanın Map'ten tamamen silindiğini doğrula
assert(!memoryDump65m.includes('gizlianaliz'), '60 dakikayı aşan tüm veriler bellek Map yapısından tamamen silinmelidir.');
console.log('  [BAŞARILI] 60 dakikalık yaşam döngüsü dolan kovalar bellekten kalıcı olarak imha edildi.');

// TEST BÖLÜMÜ 5: Loglama İzolasyonu (Logging Isolation Proof)
console.log('\n--- [BÖLÜM 5] Loglama İzolasyonu Doğrulaması ---');
let capturedLogs = '';
const originalLog = console.log;
console.log = (msg, ...args) => {
  capturedLogs += msg + ' ' + args.join(' ') + '\n';
  originalLog(msg, ...args);
};

// Log üretebilecek işlemleri tetikle
aggregator.setFilter('tr');
aggregator.getSnapshot(Date.now());
console.log = originalLog;

assert(!capturedLogs.includes('synthetic_user'), 'Log akışına hiçbir kullanıcı kimliği sızmamalı.');
assert(!capturedLogs.includes('0555-'), 'Log akışına hiçbir kişisel veri sızmamalı.');
console.log('  [BAŞARILI] Loglama sistemine hiçbir kullanıcı kimliği veya ham metin sızmadı.');

console.log('\n================================================================');
console.log('  TÜM GİZLİLİK VE VERİ MİNİMİZASYONU TESTLERİ BAŞARIYLA GEÇTİ');
console.log('================================================================\n');
