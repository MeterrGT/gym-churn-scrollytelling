# BVA 2245 - Canlı Sosyal Medya Nabzı (Live Data Product)
## Bluesky Gerçek Zamanlı Akış & Trend Dinleme Platformu

Bu proje, **Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği** programı kapsamında **BVA 2245** dersi için geliştirilen gerçek zamanlı veri ürünüdür. Bluesky genel gönderi akışını (Jetstream WebSocket) doğrudan tarayıcıda Web Worker ile işleyerek kullanıcı arayüzünü (UI thread) bloke etmeden son 5 dakika ve 1 saatlik dinamik trendleri analiz eder.

---

## 🔗 Canlı Bağlantılar & Kaynaklar

- **Canlı Veri Ürünü (Live Product):** [https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi](https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi)
- **Vaka Analizi & Mimari Raporu (Case Study):** [https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi](https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi)
- **Demo Videosu (YouTube):** [https://youtu.be/3Xz3kawRV9M](https://youtu.be/3Xz3kawRV9M) *(Video ID: 3Xz3kawRV9M - Liste Dışı)*
- **Tarihsel Sosyal Ağ Analizi (SNA - 48 Saatlik Arşiv):** [https://metehan-gezer.vercel.app/bluesky-hashtag-network](https://metehan-gezer.vercel.app/bluesky-hashtag-network)
- **Kişisel Portfolyo & Gym Churn Hikayesi:** [https://metehan-gezer.vercel.app](https://metehan-gezer.vercel.app)
- **GitHub Deposu:** [https://github.com/MeterrGT/gym-churn-scrollytelling](https://github.com/MeterrGT/gym-churn-scrollytelling)

---

## 🏛 Mimari Şema (Architecture Diagram)

```
[Bluesky Jetstream WebSocket]
       │  (wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post)
       ▼
[Gizlilik Odaklı Anlık Ayıklama (Privacy-Minimizing Extraction)]
       │  - Regex ile hashtag ayıklama (#\p{L}\p{N}_+)
       │  - ISO 639 dil kodu sınıflandırması (tr, en, de, ja, pt, es, fr)
       │  - DID, post metni, kullanıcı profili ve PDS bilgisi ANINDA ÇÖPE ATILIR
       ▼
[Web Worker Toplayıcı (pulse.worker.js)]  <-- UI Thread'den bağımsız arka plan
       │
       ├── [5 Dakikalık Kayan Kuyruk (Sliding Queue)] ──> En Çok Kullanılan 10 Etiket & Hız
       └── [1 Saatlik Dairesel Kova (60 x 1 Dk)]      ──> Dakikalık Hız Zaman Serisi (Sparkline)
       │
       │  (Saniyede 1 kez AGGREGATE_SNAPSHOT yayını)
       ▼
[usePulseStream React Kancası & Durum Makinesi]
       │  - Canlı bağlantı, duraklatma (pause), manuel kesme yönetimi
       │  - Ağ kesintisinde simüle jeneratör yedeği (fallback generator)
       │  - Bayat veri (stale-data) tespiti ve uyarı banner'ı
       ▼
[Next.js Responsive Dashboard Arayüzü (/canli-sosyal-medya-nabzi)]
       ├── Özet Metrik Kartları (Toplam Gönderi, Dakikalık Hız, Aktif Etiket, Dil)
       ├── SVG Akış Hızı Grafiği (Alan degrade, imleç takibi, tepe değerler)
       ├── Popüler Etiketler Sıralaması (Etiket frekansı ve yüzdesel çubuklar)
       ├── Çok Dilli Filtreleme Menüsü (Tüm Diller, Türkçe, İngilizce, Almanca, vb.)
       └── Bağlantı Durumu, Bayat Veri Uyarısı ve Veri Koruma Rozeti
```

---

## 🔒 Gizlilik Minimizasyonu (Privacy Minimization)

Ürün **Privacy by Design** (Tasarım Yoluyla Gizlilik) ve **KVKK / GDPR Veri Minimizasyonu** ilkelerine göre tasarlanmıştır:

1. **Kişisel Veri Saklamama:** Kullanıcıların hesap tanımlayıcıları (`did:plc:...`), rumuzları (`handle`), profil URL'leri ve gönderi tam metinleri hiçbir şekilde kalıcı belleğe, sunucu veritabanına, `localStorage` veya `IndexedDB`'ye yazılmaz.
2. **Geçici Bellek ve Anında İmha:** Jetstream üzerinden gelen JSON paketi Web Worker içinde ayrıştırılır; yalnızca etiket listesi ve dil kodu alınır; ham paket JavaScript çöp toplayıcısına (Garbage Collector) bırakılarak anında bellekten düşürülür.
3. **Yalnızca İstatistiki Agregasyon:** İstemci tarafında yalnızca matematiksel sayaçlar (5 dakikalık kayan penceredeki frekans haritası ve 60 dakikalık zaman serisi kovaları) tutulur.

---

## 📡 Veri Kaynağı ve Lisans / Kullanım Şartları

- **Veri Sağlayıcısı:** Bluesky Social PBC tarafından işletilen kamuya açık [Jetstream Relay](https://github.com/bluesky-social/jetstream).
- **Protokol:** AT Protocol (Authenticated Transfer Protocol).
- **Uç Nokta:** `wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post`
- **Lisans & Kullanım Koşulları:** Bluesky genel ağındaki herkese açık gönderiler, AT Protocol şartları gereği genel federasyon akışında paylaşılmaktadır. Bu proje; yalnızca tek bir istemci WebSocket bağlantısı açar, `wantedCollections=app.bsky.feed.post` filtresi ile bant genişliği tüketimini asgari seviyede tutar, hiçbir içeriği yeniden dağıtmaz veya ticari olarak satmaz. Bluesky API ve AT Protocol geliştirici kullanım kurallarına tam uyumludur.

---

## ⚡ Kurulum ve Çalıştırma Komutları

```bash
# next-app dizinine geçin
cd next-app

# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın (http://localhost:3000)
npm run dev

# 3. Nabız servisi birim ve durum testlerini çalıştırın (119 test)
npm run test:pulse

# 4. Portfolyo regresyon testlerini çalıştırın (23 test)
npm run test:regression

# 5. Üretim derlemesini oluşturun (14 rota)
npm run build
```

---

## 📊 Doğrulanmış Test ve Denetim Sonuçları

- **Birim & Servis Testleri (`npm run test:pulse`):** **119/119 BAŞARILI** (Web Worker mesajlaşması, kayan pencere kova hesaplaması, bayat veri durum makinesi, çok dilli etiket ayrıştırması).
- **Regresyon Testleri (`npm run test:regression`):** **23/23 BAŞARILI** (Neon DB bağlantısı, şema doğrulaması, `/bluesky-hashtag-network`, `/gym-churn` ve admin oturum kontrolleri).
- **Lighthouse Mobil Denetimi (`/canli-sosyal-medya-nabzi`):**
  - **Vercel Preview Resmi Dağıtımı (`01558ba` commit'i sonrası doğrulanmış mobil sonuçlar):**
    - **Performans (Performance):** **97 / 100**
    - **Erişilebilirlik (Accessibility):** **96 / 100** *(WCAG 2.1 AA uyumlu etiketler ve renk kontrastı)*
    - **En İyi Uygulamalar (Best Practices):** **100 / 100**
    - **Arama Motoru Optimizasyonu (SEO):** **100 / 100**
    - **Temel Web Metrikleri (Core Web Vitals):**
      - **İlk Zengin İçerikli Boyama (FCP):** 1.7 s
      - **En Büyük İçerikli Boyama (LCP):** 2.2 s
      - **Toplam Engelleme Süresi (TBT):** 120 ms
      - **Kümülatif Düzen Kayması (CLS):** 0 *(Sabit kart bildirimi ile sıfır kayma)*
      - **Hız İndeksi (Speed Index):** 1.7 s
    - **Kanıt Ekran Görüntüleri:** `docs/lighthouse/vercel-preview-lighthouse-mobile-score.png` ve `docs/lighthouse/vercel-preview-lighthouse-mobile-metrics.png`.
  - **Ölçüm Ayrımı & Geçmiş Veri Notu:** İlk geliştirme aşamasındaki yerel dev server ölçümleri (Performance 50, FCP 0.9s, LCP 0.9s; optimize edilmemiş CSS ve yerel parçacık animasyonu nedeniyle yüksek TBT) ile `01558ba` commit'inde uygulanan optimizasyonlar (Font Awesome'ın asenkron preloading'e alınması, 27 inline SVG, CSS font değişkenlerinin derlenmesi, tuval parçacıklarının mobilde 16'ya düşürülmesi ve CLS'in 0'a indirilmesi) sonrası elde edilen **Vercel Preview 97 Performans / 96 Erişilebilirlik** resmi sonuçları birbirinden açıkça ayrılmıştır.
- **Kullanılabilirlik & Kullanıcı Testi (2 Katılımcı, 3 Görev):**
  - İki gönüllü katılımcı (arkadaş) uygulamayı test etmiş ve **3 görevin tamamını başarıyla tamamlamıştır**.
  - **Katılımcı 1:** Görev 1 (Dil filtresi ve lider etiket tespiti): 10 sn | Görev 2 (5 dk vs 1 saat karşılaştırması): 55 sn | Görev 3 (Bağlantı kesme, bayat veri & yeniden bağlanma): 35 sn | **Toplam: 100 sn**.
  - **Katılımcı 2:** Testi genel olarak Katılımcı 1'den **25 saniye daha hızlı (Toplam: 75 sn)** tamamlamıştır. Katılımcı 2'nin görev düzeyindeki münferit süreleri ayrı tutulmadığı için akademik dürüstlük gereği yapay olarak dağıtılmamıştır.
  - **Gözlem & Sürtünme Notu:** Hiçbir katılımcı belirgin bir zorluk bildirmedi. Filtre kontrolleri tekrar açılırken etiket filtresinde kısa süreli görsel titreme (flicker) gözlemlendi; filtre seçilebilir kaldı ve görevi engellemedi. Dürüstlük ilkesi gereği henüz düzeltilmediği belirtilmiş ve geliştirme backlog'una alınmıştır.
- **Demo Video Durumu:**
  - Yaklaşık 60 saniyelik Türkçe demo videosu öğrenci Metehan Gezer tarafından başarıyla kaydedilmiş ve YouTube'a Liste Dışı (Unlisted) olarak yüklenmiştir.
  - **Video Bağlantısı:** [https://youtu.be/3Xz3kawRV9M](https://youtu.be/3Xz3kawRV9M) (Video ID: `3Xz3kawRV9M`).
  - Vaka analizi sayfasına (`/canli-sosyal-medya-nabzi/vaka-analizi`) 16:9 responsive oranında ve `youtube-nocookie.com` üzerinden gizlilik odaklı olarak başarıyla gömülmüştür.

---

## 💼 Özgeçmiş / Portfolyo İfade Önerisi (Evidence-Based CV Sentence)

> *"Bluesky Jetstream WebSocket akışı üzerinden saniyede 150+ genel gönderiyi istemci tarafında UI dondurmadan Web Worker ve kayan pencereler (5 dk / 1 saat) ile işleyen, %100 gizlilik odaklı (ham veri ve kullanıcı kimliklerini anında imha eden), 119 otomatik testten geçen, 2 kullanıcı testiyle doğrulanan ve Vercel Preview mobil Lighthouse denetiminde 97 Performans / 96 Erişilebilirlik (CLS: 0, TBT: 120ms) elde eden 'Canlı Sosyal Medya Nabzı' veri ürününü geliştirdi."*

---

## 🤖 Yapay Zeka (AI) ve Akademik Dürüstlük Beyanı

Bu projede; Web Worker durum makinesi mimarisi, TypeScript tip tanımlamaları, otomatik test kütüklerinin yazımı ve dokümantasyon taslaklarının hazırlanmasında Antigravity yapay zeka aracından kodlama ve refactoring desteği alınmıştır. Tüm veri mimarisi kararları, gizlilik ilkeleri, test senaryoları ve doğrulama süreçleri öğrenci (**Metehan Gezer**) tarafından denetlenmiş, test edilmiş ve onaylanmıştır.
