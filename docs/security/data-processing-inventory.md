# Veri İşleme Envanteri (Data Processing Inventory - RoPA)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Veri Sorumlusu:** Metehan Gezer (Öğrenci No: 2516016026)  
**Mevzuat Uyumu:** 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) Madde 4, 7, 12 ve AB Genel Veri Koruma Tüzüğü (GDPR) Madde 5, 25, 30.  
**Tarih:** 30 Ekim 2026  

---

## 1. Veri Kategorileri ve Yaşam Döngüsü Tablosu

| Veri Kategorisi | Veri İçeriği / Alanlar | İşleme Amacı | İşleme Yöntemi ve Konumu | Saklama Süresi (Retention) | Silme / İmha Yöntemi | Hukuki Dayanak |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Ham Gönderi Metni (Raw Post Text)** | Kullanıcıların Bluesky üzerinde paylaştığı ham iletiler, URL'ler, serbest metin | Trend hashtag çıkarımı için anlık ayrıştırma | Geçici RAM (Transient Memory / Web Worker). Kesinlikle diske veya veritabanına yazılmaz. | **0 Saniye (Anlık İmmülasyon)** | Regex çıkarımının hemen ardından Garbage Collector tarafından bellekten silinir. | KVKK Md. 4/2-b (Amaca matuf sınırlı işleme) |
| **Yazar Kimlik Belirteçleri (PII / DID / Handle)** | `did:plc:...`, `@kullanici_adi`, profil avatar URL'si, PDS host adresi | Hiçbir amaçla işlenmez (Kişisel Veri) | **Hiçbir yere kaydedilmez.** WebSocket parser seviyesinde filtreye takılır ve okunmaz. | **0 Saniye (Saklanmaz)** | Belleğe dahi kopyalanmadan atılır (Dropped). | KVKK Md. 5 (Rıza ve amaç yokluğu nedeniyle ret) |
| **Konu Etiketleri (Hashtags - Anonim)** | `#yapayzeka`, `#turkey`, `#datascience` vb. metinsel etiketler | Canlı nabız grafiğinde en popüler etiketleri göstermek | Web Worker içi halka bellek (`ring-buffer`) ve opsiyonel Cloudflare KV | **Azami 60 Dakika (1 Saat)** | 5 dakikalık ve 60 dakikalık kayan pencerelerden zaman aşımıyla silinir; KV'de `expirationTtl: 3600`. | Anonim veri (KVKK kapsamı dışı) |
| **Dil İstatistiği (Language Codes)** | ISO-639-1 dil kodları (`tr`, `en`, `de`, `ja` vb.) | Dil bazında filtreleme ve dağılım pasta/oran analizi | Bellek içi sayaç nesnesi (`Record<string, number>`) | **Azami 60 Dakika (1 Saat)** | Bellek içi sliding-window kova rotasyonu ile otomatik imha. | Anonim teknik veri |
| **Sayısal Hız Göstergesi (PPM Time-Series)** | Dakika başına düşen gönderi adedi (`postsPerMinute: number`) | Sistem yükü ve akış yoğunluğu eğrisini çizmek | İstemci oturum belleği (`PulseAggregateSnapshot`) | **5 Dakika - 60 Dakika** | Sayfa yenilendiğinde veya oturum bittiğinde silinir. | Anonim toplu metrik |
| **İstemci Hata ve Erişim Logları** | Hata kodu, HTTP durum kodu, zaman damgası | Güvenlik izleme ve hata ayıklama | Vercel Edge Logs / Cloudflare Observability | **Azami 7 Gün** | Vercel/Cloudflare log rotasyon politikası. Loglarda IP ve PII maskelenir. | KVKK Md. 12 (Sistem güvenliği temini) |

---

## 2. Sıfır Kalıcılık ve Veri Minimizasyonu Prensipleri

1. **Gizlilik Odaklı Tasarım (Privacy by Design - GDPR Md. 25):**
   Uygulama mimarisi, Bluesky ağından akan milyonlarca gönderi içerisinden tek bir kullanıcının kimliğini veya özel mesajını kaydetmeyecek şekilde tasarlanmıştır. Veritabanı tablolarımızda (`public.videolar`, `public.yoneticiler`, `public.islem_kayitlari`) canlı akış verilerini saklayan hiçbir sütun veya tablo bulunmamaktadır.
2. **Kişisel Verinin Ayrıştırılması (Data Segregation):**
   Canlı sosyal medya akışını işleyen `aggregator.ts` ve `pulse.worker.js` modülleri, portföyün ilişkisel veritabanı bağlantılarından (`neon(DATABASE_URL)`) tamamen izole edilmiş bir sandbox içinde çalışır.
3. **Katı Saklama Süresi ve Otomatik İmha (Enforced Retention & TTL):**
   Toplu sayısal istatistikler dahi sınırsız süre saklanmaz:
   - 5 dakikalık pencere verileri her 10 saniyede bir kayan kova (bucket rotation) mantığıyla bellekten atılır.
   - 60 dakikalık pencere verileri her 60 saniyede bir kayan kova mantığıyla bellekten atılır.
   - Cloudflare KV'ye gönderilen toplu özetler `expirationTtl: 3600` parametresi ile 1 saat sonra Cloudflare altyapısı tarafından fiziksel olarak silinir.
