# Metehan Gezer - Kişisel Portfolyo & Gym Churn Veri Gazeteciliği Hikayesi

Bu depo, **Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği** öğrencisi **Metehan Gezer**'in kişisel web portfolyosunu ve dönem sonu akademik veri görselleştirme projesi olan **Gym Churn Data Story (Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor?)** sayfasını barındırır.

- **Canlı Üretim Sitesi (Canonical Production):** [https://metehan-gezer.vercel.app](https://metehan-gezer.vercel.app)<br />
  *(Eski alan adı yönlendirmesi: `https://metehan-gym-churn.vercel.app`)*
- **BVA 2245 Canlı Veri Ürünü (Live Pulse):** [https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi](https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi)
- **BVA 2245 Vaka Analizi (Case Study):** [https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi](https://metehan-gezer.vercel.app/canli-sosyal-medya-nabzi/vaka-analizi)
- **Tarihsel Bluesky Ağ Analizi (SNA):** [https://metehan-gezer.vercel.app/bluesky-hashtag-network](https://metehan-gezer.vercel.app/bluesky-hashtag-network)
- **Gym Churn Veri Hikayesi:** [https://metehan-gezer.vercel.app/gym-churn](https://metehan-gezer.vercel.app/gym-churn)
- **GitHub Deposu:** [https://github.com/MeterrGT/gym-churn-scrollytelling](https://github.com/MeterrGT/gym-churn-scrollytelling)

---

## 📌 Proje Genel Bakışı

### 1. Portfolyo Ana Sayfası (`/`)
- Siberpunk / neon ve lila tonlarında modern, yüksek kontrastlı arayüz tasarımı.
- İnteraktif parçacık arka planı (`CyberCanvas`).
- Ekonometrik dizüstü bilgisayar fiyat tahmin simülatörü (OLS regresyon modeli).
- Kestirimci bakım ve IoT makine öğrenmesi projeleri.
- **Gym Churn Hızlı Simülatörü:** 4.000 gözlemden hesaplanan 12 hücrelik yaş × sözleşme matrisi ile anlık risk hesaplayan dinamik araç.
- **Canlı Sosyal Medya Nabzı & Ağ Analizi Kartları:** Canlı veri ürünü, vaka analizleri ve GitHub kaynak bağlantılarına doğrudan erişim.

### 2. BVA 2245 — Canlı Sosyal Medya Nabzı (`/canli-sosyal-medya-nabzi`)
- **Bluesky Jetstream WebSocket** üzerinden akan canlı genel gönderileri tarayıcıda Web Worker ile işleyen gerçek zamanlı trend dinleme platformu.
- 5 dakikalık ve 1 saatlik kayan pencereler (sliding/rolling windows) ile en popüler etiketler ve dakikalık akış hızı (posts/min) zaman serisi.
- Çok dilli (Türkçe, İngilizce, Almanca, Japonca, Portekizce, İspanyolca, Fransızca) anlık filtreleme.
- **%100 Tasarım Yoluyla Gizlilik (Privacy by Design):** Ham gönderi metinleri, kullanıcı DID ve profil bilgileri kalıcı belleğe asla yazılmaz, anında imha edilir.

### 3. Bluesky Turkish Hashtag Network — Tarihsel Ağ Analizi (`/bluesky-hashtag-network`)
- Bluesky platformundan toplanan **48 saatlik tarihsel arşiv** (7.658 etiketli gönderi, 7.092 düğüm, 37.206 kenar) üzerinde gerçekleştirilen statik Sosyal Ağ Analizi (SNA).
- Louvain modülerlik algoritması, derece merkeziyeti ve D3.js interaktif ağ görselleştirmesi.
- *(Not: Bu çalışma geçmişe dönük statik bir arşiv çalışması olup, canlı akan BVA 2245 ürününden kavramsal ve mimari olarak tamamen bağımsızdır).*

### 4. Gym Churn Veri Hikayesi (`/gym-churn`)
- **D3.js (v7)** ve **Scrollama / IntersectionObserver** kullanılarak hazırlanmış 6 adımlı scrollytelling veri hikayesi.
- Masaüstünde sol tarafta sabit (sticky) grafik konteyneri, sağ tarafta adım adım ilerleyen anlatı kartları; mobilde akıcı dikey sıralama.
- **5 Farklı Veri Görselleştirmesi & Çoklu Grafik Türü:**
  1. **Adım 1 - Sıralı Sütun Grafiği (Sorted Bar Chart):** Sözleşme sürelerine göre (1 Ay: %42.3, 6 Ay: %12.5, 12 Ay: %2.4) gözlemlenen terk oranları (39.9 yüzde puanlık fark).
  2. **Adım 2 - Nokta / Lollipop Grafiği (Lollipop Plot):** 4 yaş kategorisinin genel veri seti ortalaması (%26.5) ile kıyaslanması.
  3. **Adım 3 - Etkileşim Matrisi (Annotated Matrix Heatmap):** 4 Yaş Grubu × 3 Sözleşme Modeli = 12 hücrelik çapraz gözlem matrisi.
  4. **Adım 4 - Odaklanmış Risk & Sadakat Matrisi (Spotlight Heatmap):** Zirve risk segmenti (18-25 Yaş & 1 Ay: **%78.2 terk**) ile en düşük terk oranına sahip segmentin (34+ Yaş & 12 Ay: **%0.0 terk**) karşılaştırılması.
  5. **Adım 5 - Üyelik Süresi (Lifetime) Kategorileri ile Gözlemlenen Terk İlişkisi:** Kesitsel dağılım analizi.
  6. **Adım 6 - Analitik Sentez & Katılım Grafiği (Attendance Synthesis):** Haftalık ders sıklığı ile terk ilişkisi ve nedensellik kısıtları paneli.
- **Okuyucu Keşfi (Reader Exploration):** Yaş ve sözleşme parametreleriyle dinamik D3 filtresi.

---

## 📊 Veri Seti Provenansı, Lisans ve Metodoloji

- **Veri Seti Adı:** [Gym customers features and churn](https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn)
- **Müellif / Yükleyen:** Adrian Vinueza (Kaggle)
- **Veri Setinin Niteliği:** Kamuya açık 4.000 gözlem ve 14 değişken içeren veri kümesi. İlgili literatür ve kaynak belgeleri, bu kayıtların eğitim ve analitik modelleme amacıyla **simüle edildiğini** belirtmektedir. Bu nedenle elde edilen istatistikler tüm spor salonu sektörünün genel gerçeği olarak değil, incelenen veri kümesi sınırları dahilindeki gözlemsel örüntüler olarak değerlendirilmelidir.
- **Lisans:** Kaggle veri kümesi sayfasında **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International) olarak listelenmiştir. *(Bağımsız değerlendiriciler için Kaggle kaynak sayfasından manuel teyit önerilir.)*
- **Gözlem Sayısı:** 4.000 Gözlem (Satır)
- **Değişken Sayısı:** 14 Değişken (Age, Contract_period, Lifetime, Avg_class_frequency_current_month, Group_visits, Churn vb.)
- **Veri Kalitesi:** 0 eksik değer (null), 0 yinelenen kayıt (duplicate).
- **Üretilen Doğrulanmış Özet Dosyaları (`public/data/` & `data/processed/`):**
  - `churn_by_contract.csv`: 1, 6 ve 12 aylık taahhütlerin üye sayıları ve terk oranları.
  - `churn_by_age.csv`: 18-25, 26-29, 30-33, 34+ yaş gruplarının dağılımı.
  - `churn_combined.csv`: 12 hücrelik yaş × sözleşme etkileşim matrisi.
  - `churn_by_lifetime.csv`: 0 ile 6+ ay arası üyelik süresi kategorileri terk oranları.
  - `churn_by_frequency.csv`: Haftalık antrenman sıklığı aralıkları.
  - `churn_summary_metrics.json`: Genel metrikler, zirve risk ve en düşük terk segmentleri.
- **Bilimsel Dürüstlük ve Nedensellik İlkesi:**
  - Korelasyonun nedensellik anlamına gelmediği, uzun sözleşmeye sahip üyelerin daha yüksek içsel motivasyona sahip olabileceği (kendini seçme yanlılığı / self-selection bias) açıkça vurgulanmıştır.
  - Yıllık sözleşmelerin terki "önleyen doğrudan neden" olduğu iddia edilmemiş; gözlemlenen en düşük terk oranının 12 aylık sözleşmeli üyelerde (%2.4) gerçekleştiği kesin gözlemsel bir dille ifade edilmiştir.

---

## 🔬 Jupyter Notebook & Analiz Çoğaltılabilirliği (Reproducibility)

Tüm veri analitiği adımları `notebooks/analiz.ipynb` dosyasında belgelenmiştir ve baştan sona çalıştırılabilir durumdadır.

### Anaconda ile Not Defterini Çalıştırma Adımları:
1. **Anaconda Navigator**'ı açın veya terminalde Anaconda prompt başlatın.
2. Jupyter Notebook veya JupyterLab uygulamasını başlatın:
   ```bash
   jupyter notebook
   ```
3. Dosya tarayıcısından `notebooks/analiz.ipynb` dosyasını açın.
4. Üst menüden **Kernel -> Restart & Run All** seçeneğine tıklayın.
5. Not defteri sırasıyla:
   - Ham veriyi (`data/raw/gym_churn_us.csv`) yükler ve şemayı denetler.
   - Eksik ve yinelenen kayıtları doğrular.
   - Tanımlayıcı istatistikleri ve çapraz tabloları hesaplar.
   - Python işleme betiğini (`scripts/process_data.py`) tetikleyerek `public/data/` özet dosyalarını günceller.
   - Tüm grafik verilerini gerçek hesaplamalarla üretir.

Alternatif olarak komut satırından doğrudan veri işleme betiğini çalıştırmak için:
```bash
python scripts/process_data.py
```

---

## 🏛 BVA 2245 Mimari Şeması (Live Data Pipeline)

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
```

---

## 🔒 Gizlilik Minimizasyonu (Privacy Minimization)

- **Sıfır Kişisel Veri Saklama:** Kullanıcıların hesap tanımlayıcıları (`did:plc:...`), rumuzları (`handle`), profil URL'leri ve gönderi tam metinleri kalıcı belleğe, sunucu veritabanına, `localStorage` veya `IndexedDB`'ye yazılmaz.
- **Geçici Bellek ve Anında İmha:** Jetstream üzerinden gelen JSON paketi Web Worker içinde işlenir; yalnızca etiket listesi ve dil kodu alınır; ham paket JavaScript çöp toplayıcısına (Garbage Collector) bırakılarak anında bellekten düşürülür.
- **Yalnızca İstatistiki Agregasyon:** İstemci tarafında yalnızca matematiksel sayaçlar (5 dakikalık kayan penceredeki frekans haritası ve 60 dakikalık zaman serisi kovaları) tutulur.

---

## 📡 Veri Kaynağı ve Kullanım Şartları (Data Source & Terms)

- **Veri Sağlayıcısı:** Bluesky Social PBC kamuya açık [Jetstream Relay](https://github.com/bluesky-social/jetstream).
- **Protokol:** AT Protocol (Authenticated Transfer Protocol).
- **Uç Nokta:** `wss://jetstream1.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post`
- **Kullanım Koşulları & Lisans:** Bluesky genel ağındaki herkese açık gönderiler, AT Protocol şartları gereği genel federasyon akışında paylaşılmaktadır. Bu proje; yalnızca tek bir istemci WebSocket bağlantısı açar, `wantedCollections=app.bsky.feed.post` filtresi ile bant genişliği tüketimini asgari seviyede tutar, hiçbir içeriği yeniden dağıtmaz veya ticari olarak satmaz. Bluesky API ve AT Protocol geliştirici kullanım kurallarına tam uyumludur.

---

## 🛠 Kullanılan Teknolojiler

- **Frontend & UI:** Next.js (App Router), React 18, TypeScript, Tailwind CSS, Font Awesome 6
- **Gerçek Zamanlı Veri İşleme:** Bluesky Jetstream WebSocket, HTML5 Web Workers, Sliding / Rolling Windows
- **Veri Görselleştirme:** D3.js (v7), SVG dinamik alan/çizgi grafikleri
- **Veritabanı & Backend:** Neon PostgreSQL, Drizzle ORM / Server Actions, bcryptjs
- **Test Araçları:** Node.js Test Runner, Google Chrome Lighthouse

---

## 🚀 Projeyi Yerel Ortamda Çalıştırma ve Testler

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
  - **Ölçüm Ayrımı:** İlk yerel geliştirme ortamındaki ölçümler (Performance 50, FCP 0.9s, LCP 0.9s; optimize edilmemiş fontlar ve yüksek TBT) ile `01558ba` commit'i ile optimize edilmiş Vercel Preview dağıtımı üzerindeki resmi sonuçlar (Performance 97, CLS 0, TBT 120ms) açıkça ayrılmıştır.
- **Kullanılabilirlik & Kullanıcı Testi (2 Katılımcı, 3 Görev):**
  - İki gönüllü katılımcı (arkadaş) uygulamayı test etmiş ve **3 görevin tamamını başarıyla tamamlamıştır**.
  - **Katılımcı 1:** Görev 1 (Dil filtresi ve lider etiket tespiti): 10 sn | Görev 2 (5 dk vs 1 saat karşılaştırması): 55 sn | Görev 3 (Bağlantı kesme, bayat veri & yeniden bağlanma): 35 sn | **Toplam: 100 sn**.
  - **Katılımcı 2:** Testi genel olarak Katılımcı 1'den **25 saniye daha hızlı (Toplam: 75 sn)** tamamlamıştır. Katılımcı 2'nin münferit görev süreleri ayrı tutulmadığı için akademik dürüstlük gereği yapay olarak dağıtılmamıştır.
  - **Gözlem & Sürtünme Notu:** Katılımcılar belirgin bir zorluk bildirmedi. Filtre kontrolleri tekrar açılırken etiket filtresinde kısa süreli görsel titreme (flicker) gözlemlendi; filtre seçilebilir kaldı ve görevi engellemedi. Dürüstlük ilkesi gereği henüz düzeltilmediği belirtilmiş ve geliştirme backlog'una alınmıştır.
- **Demo Video Durumu:**
  - Yaklaşık 60 saniyelik Türkçe demo videosu kaydedilmiştir.
  - Herkese açık YouTube/Vimeo bağlantısı henüz sağlanmadığı için videonun yüklendiği/yayınlandığı iddia edilmemiş; embed alanı gerçek link gelene kadar korunmuştur.

---

## 💼 Özgeçmiş / Portfolyo İfade Önerisi (Evidence-Based CV Sentence)

> *"Bluesky Jetstream WebSocket akışı üzerinden saniyede 150+ genel gönderiyi istemci tarafında UI dondurmadan Web Worker ve kayan pencereler (5 dk / 1 saat) ile işleyen, %100 gizlilik odaklı (ham veri ve kullanıcı kimliklerini anında imha eden), 119 otomatik testten geçen, 2 kullanıcı testiyle doğrulanan ve Vercel Preview mobil Lighthouse denetiminde 97 Performans / 96 Erişilebilirlik (CLS: 0, TBT: 120ms) elde eden 'Canlı Sosyal Medya Nabzı' veri ürününü geliştirdi."*

---

## 🤖 Yapay Zeka (AI) ve Akademik Dürüstlük Beyanı

Bu projede; Web Worker mimarisi, TypeScript tip tanımlamaları, D3.js SVG yaşam döngüsü mimarisi, otomatik test kütüklerinin yazımı ve dokümantasyon taslaklarının hazırlanmasında yapay zeka araçlarından (Antigravity LLM Agent) teknik ve mimari destek alınmıştır.

Kodlama ve teknik hata ayıklama desteği ile analitik yazım katkısı açıkça ayrılmıştır. Ders gereklilikleri ve akademik dürüstlük standartları doğrultusunda, tüm mimari kararlar, gizlilik ilkeleri, SQL analizleri, veri yorumları ve çıkarımlar öğrenci (**Metehan Gezer**) tarafından denetlenmiş ve doğrulanmıştır.

---

## 👤 Yazar & İletişim

- **Metehan Gezer**
- Manisa Celal Bayar Üniversitesi, Büyük Veri Analistliği
- **GitHub:** [https://github.com/MeterrGT](https://github.com/MeterrGT)
- **Canlı Yayın (Vercel):** [https://metehan-gezer.vercel.app](https://metehan-gezer.vercel.app) *(Yönlendirme: `https://metehan-gym-churn.vercel.app`)*
- **LinkedIn:** [Metehan Gezer](https://www.linkedin.com/in/metehan-gezer-aa444b403/)
- **E-posta:** [gztmetehan@gmail.com](mailto:gztmetehan@gmail.com)
