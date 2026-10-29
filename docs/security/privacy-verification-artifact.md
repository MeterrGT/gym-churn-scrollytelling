# Gizlilik ve Veri Minimizasyonu Doğrulama Kanıtı (Privacy Verification Artifact)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Öğrenci:** Metehan Gezer (Öğrenci No: 2516016026)  
**Tarih:** 30 Ekim 2026  
**Test Dosyası:** `next-app/scripts/test-privacy-minimization.mjs`  

---

## 1. Otomasyonlu Test Yürütme ve Sonuç Kanıtı

Aşağıdaki çıktı, `next-app` dizininde çalıştırılan `npm run test:privacy` komutunun gerçek yürütme çıktısıdır. Sentetik (sahte) kişisel veriler ile negatif güvenlik ve sızıntı testleri gerçekleştirilmiştir.

```bash
> next-app@0.1.0 test:privacy
> node scripts/test-privacy-minimization.mjs

[GİZLİLİK TESTİ 1] Sentetik PII İçeren Ham Olay Üretildi:
  - Sentetik DID: did:plc:synthetic_user_9999_secret_identifier
  - Sentetik Metin: Merhaba dünya! Bu sahte bir iletidir. Telefon: 0555-019-9988 Adres: Ataturk Cad. No:192 Manisa #yapayzeka #veriBilimi
  - Sentetik PDS URL: https://pds.synthetic-instance-99.example.com

[GİZLİLİK TESTİ 2] Agregator belleği JSON olarak tarandı.
  [BAŞARILI] Bellekte sentetik DID (did:plc:synthetic_user_9999_secret_identifier) BULUNAMADI!
  [BAŞARILI] Bellekte hassas metin/telefon/adres bilgisi BULUNAMADI!
  [BAŞARILI] Bellekte PDS sunucu adresi BULUNAMADI!

[GİZLİLİK TESTİ 3] İstemciye aktarılan anlık özet (Snapshot) şeması denetlendi:
  [BAŞARILI] Snapshot JSON içinde hiçbir PII sızıntısı yok!
  - İzin Verilen Alanlar: totalEventsReceived, postsPerMinute, topHashtags, languages
  - Toplam Alınan Olay Sayısı: 1
  - Çıkarılan Etiketler: [ { tag: 'yapayzeka', count: 1 }, { tag: 'veribilimi', count: 1 } ]

[GİZLİLİK TESTİ 4] 5 Dakikalık ve 60 Dakikalık Kayan Pencere Temizliği (Rolling Eviction) Test Edildi:
  - 5 dakikalık pencere süresi dolan kova: SİLİNDİ (0 eleman kaldı)
  - 60 dakikalık pencere süresi dolan kova: SİLİNDİ (0 eleman kaldı)

[GİZLİLİK TESTİ 5] Konsol ve Log İzolasyonu Denetlendi:
  [BAŞARILI] Log fonksiyonlarına ham event veya PII parametresi geçilmediği doğrulandı.

============================================================
[SONUÇ] TÜM GİZLİLİK VE VERİ MİNİMİZASYONU TESTLERİ BAŞARIYLA GEÇTİ (PASS)!
============================================================
```

---

## 2. Test Metodolojisi ve Sentetik Test Fikstürü

Kişisel verilerin korunması ve KVKK ilkeleri gereği, testlerde asla gerçek kullanıcı verisi kullanılmamış; aşağıdaki sentetik nesne ile sınır testi yapılmıştır:

```javascript
const syntheticPost = {
  did: "did:plc:synthetic_user_9999_secret_identifier",
  time_us: Date.now() * 1000,
  commit: {
    collection: "app.bsky.feed.post",
    record: {
      text: "Merhaba dünya! Bu sahte bir iletidir. Telefon: 0555-019-9988 Adres: Ataturk Cad. No:192 Manisa #yapayzeka #veriBilimi",
      langs: ["tr"],
      createdAt: new Date().toISOString()
    }
  }
};
```

### Yapılan Doğrulamalar:
1. **Bellek Taraması (Heap & State Inspection):**
   `JSON.stringify(aggregator)` çıktısı alınarak `synthetic_user_9999`, `0555-019-9988`, `Ataturk Cad.` ve `synthetic-instance` anahtarları aranmış; hiçbir eşleşme bulunamamıştır.
2. **Snapshot Veri Minimizasyonu:**
   `getSnapshot()` çıktısı incelenmiş; yalnızca sayısal sayaçlar (`topHashtags: [{tag: 'yapayzeka', count: 1}, {tag: 'veribilimi', count: 1}]`) ve sayısal toplamların döndüğü kanıtlanmıştır.
3. **Zaman Aşımı ve Bellek Budama (Eviction):**
   Sahte zaman sıçraması (time advancement) yapılarak 5 dakika ve 60 dakikayı aşan eski sayaçların bellekten sıfırlandığı doğrulanmıştır.

---

## 3. Artık Riskler ve Dürüst Tartışma (Residual Risks)

Sıfır kalıcılık mimarisi yüksek düzeyde gizlilik sağlasa da aşağıdaki artık riskler mevcuttur:

| Artık Risk | Risk Düzeyi | Açıklama | Mevcut Önlem ve Sınır |
| :--- | :--- | :--- | :--- |
| **Etiket İçine PII Gizleme (Hashtag Injection)** | Düşük | Bir kullanıcının kişisel veri içeren bir etiketi bilerek paylaşması (örn: `#TCKN12345678901` veya `#AliYilmaz0555`). | Sistem yalnızca en çok kullanılan ilk 10/20 etiketi ve toplu frekansları listeler. Tekil kişisel etiketler eşiği aşamayacağı için genel gösterimde yer almaz. |
| **Trafik Analizi ve Korelasyon** | Çok Düşük | Saldırganın hedef kullanıcının gönderi attığı saniyedeki anlık PPM artışını gözlemleyerek korelasyon kurmaya çalışması. | Bluesky ağında küresel ölçekte saniyede yüzlerce gönderi aktığından, bireysel bir gönderinin yarattığı +1 sinyali gürültü içinde kaybolur. |
| **WebSocket Bağımlılığı** | Orta | Bluesky Jetstream servisinin kesintiye uğraması durumunda canlı verinin durması. | `stale-data` önbellek uyarısı devreye girer; son geçerli özet kullanıcıya açık uyarı kartıyla gösterilir. |
