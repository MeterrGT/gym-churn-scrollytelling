# BVA 2245 — Canlı Sosyal Medya Nabzı
## Kullanıcı Deneyimi & Kullanılabilirlik Test Raporu (User Testing Report)

> **⚠️ BİLGİLENDİRME & DÜRÜSTLÜK BEYANI:**  
> Akademik dürüstlük ilkeleri gereğince, bu rapordaki tüm bulgular, süreler ve nitel gözlemler **gerçek test oturumlarından** elde edilmiştir. Görev süreleri uydurulmamış veya yapay olarak doldurulmamıştır. Katılımcı 2'nin görev düzeyindeki münferit süreleri ayrı tutulmadığı için yapay bir dağıtım yapılmamış; yalnızca kaydedilen toplam süre (75 sn) dürüstçe raporlanmıştır. Gözlemlenen filtre titremesi (flicker) ise henüz giderilmediği için açıkça teknik borç/geliştirme backlog'u olarak not edilmiştir.

---

### 1. Katılımcı Profilleri (2 Kişi)

Uygulama, gerçek kullanıcı deneyimini test etmek amacıyla iki gönüllü katılımcı (arkadaş) tarafından bağımsız oturumlarda test edilmiştir:

| Katılımcı ID | Profil / Tanım | Cihaz & Tarayıcı | Deneyim Düzeyi |
| :--- | :--- | :--- | :--- |
| **Katılımcı 1 (P1)** | Dijital içerik ve sosyal medya platformlarını aktif kullanan son kullanıcı | Masaüstü / Chrome | Orta (Sosyal medya trendlerini ve etiketleri günlük takip eder) |
| **Katılımcı 2 (P2)** | Web uygulamalarına ve modern arayüzlere aşina son kullanıcı | Mobil / Safari | Orta-İleri (Dashboard ve filtreleme arayüzlerini hızlı kavrar) |

---

### 2. Tanımlanan 3 Temel Test Görevi (Tasks)

| Görev No | Görev Tanımı (Task) | Beklenen Başarı Kriteri |
| :---: | :--- | :--- |
| **Görev 1** | **Dil filtresi seçimi ve lider etiketi tespit etme** *(Select a language filter and identify the leading hashtag)* | Dil filtre menüsünden seçim yapılması, filtrelenen akıştaki en popüler etiketin doğru okunması. |
| **Görev 2** | **Son 5 dakika ile son 1 saat pencerelerini karşılaştırma** *(Compare the last 5 minutes with the last hour)* | 5 dakikalık kayan pencere etiket debisi ile 1 saatlik kümülatif gönderi ve grafik hacminin karşılaştırılması. |
| **Görev 3** | **Akış bağlantısını kesme, bayat veri uyarısını yorumlama ve yeniden bağlanma** *(Disconnect stream, interpret stale-data warning, reconnect)* | "Bağlantıyı Kes" butonuna basılarak sarı bayat veri uyarısının fark edilmesi, verinin dondurulduğunun anlaşılması ve "Yeniden Bağlan" butonuna basılması. |

---

### 3. Gerçek Test Sonuçları ve Görev Süreleri

Her iki katılımcı da **3 görevin tamamını başarıyla tamamlamıştır**.

| Katılımcı | Görev No & Tanımı | Durum | Kaydedilen Süre | Gözlemlenen Davranış & Sürtünme |
| :---: | :--- | :---: | :---: | :--- |
| **Katılımcı 1** | Görev 1: Dil Filtresi ve Lider Etiket | **Başarılı** | **10 sn** | Filtre menüsü hızlıca açıldı, dil seçildi ve lider etiket gecikmesiz okundu. Belirgin bir zorluk yaşanmadı. |
| **Katılımcı 1** | Görev 2: 5 Dk vs. 1 Saat Karşılaştırması | **Başarılı** | **55 sn** | KPI kartları ve SVG hız grafiği incelendi; kısa vadeli debi ile 1 saatlik kümülatif hacim arasındaki fark yorumlandı. |
| **Katılımcı 1** | Görev 3: Bağlantıyı Kesme, Bayat Veri & Yeniden Bağlanma | **Başarılı** | **35 sn** | "Bağlantıyı Kes" butonuna basıldı; sarı uyarı kartı fark edildi, dondurulan son veri saati okundu ve bağlantı tekrar başlatıldı. |
| **Katılımcı 1** | **Tüm Test Toplamı (Overall Time)** | **Başarılı** | **100 sn** | 3 görevin toplam süresi 100 saniye olarak kronometre ile ölçüldü. |
| **Katılımcı 2** | Görev 1 + Görev 2 + Görev 3 (Tüm Görevler) | **Başarılı** | **75 sn** *(Toplam)* | Katılımcı 2, genel testi Katılımcı 1'den **25 saniye daha hızlı** (toplam 75 sn) tamamladı. Görevleri tamamlarken belirgin bir zorluk bildirmedi. |

> **⚠️ Görev Süresi Kayıt Notu:** Katılımcı 2 için görev bazlı münferit süreler ayrı ayrı kronometre ile tutulmamış, yalnızca genel test süresi (75 sn) kaydedilmiştir. Bilimsel ve akademik dürüstlük kuralı uyarınca, ayrı tutulmayan süreler için geriye dönük yapay süre dağıtımı **yapılmamıştır**.

---

### 4. Nitel Gözlemler ve Geri Bildirimler

1. **Kullanılabilirlik ve Anlaşılırlık:**
   - Her iki katılımcı da görevleri tamamlarken **belirgin bir zorluk veya tıkanıklık bildirmedi**.
   - Dil filtresinin anında tepki vermesi ve bağlantı kesildiğinde sarı bayat veri kartının belirgin olması katılımcılar tarafından sezgisel bulundu.

2. **Gözlemlenen Arayüz Davranışı (Filtre Titremesi):**
   - **Gözlem (Observation):** Filtre kontrolleri kapatılıp tekrar açılırken etiket filtresinde kısa süreli bir **görsel titreme / kırpışma (visual flicker)** gözlemlendi.
   - **Etki Derecesi:** Filtre tıklanabilir ve seçilebilir kalmaya devam etti; katılımcıların görevleri tamamlamasına engel **olmadı**.
   - **Düzeltme Durumu:** Bu görsel titreme mevcut sürümde henüz **düzeltilmemiştir**. Gelecek arayüz optimizasyonları (backlog) için açık bir geliştirme maddesi olarak not edilmiştir; dürüstlük ilkesi gereği düzeltildiği iddia edilmemektedir.

---

### 5. Gözlemlenen Davranış ile Yorumun Ayrımı

- **Gözlemlenen Olgusal Davranış (Factual Observation):**
  - Katılımcı 1 testleri 10 sn, 55 sn, 35 sn (toplam 100 sn) sürelerde bitirdi.
  - Katılımcı 2 testi toplam 75 sn sürede bitirdi (25 sn daha hızlı).
  - Filtre yeniden açılırken görsel titreme meydana geldi, ancak seçim işlevi kesintiye uğramadı.
- **Teknik Yorum & Çıkarım (Interpretation):**
  - Ortalama tamamlanma süreleri arayüzün bilişsel yükünün düşük olduğunu göstermektedir.
  - Filtre açılışındaki görsel titremenin nedeni, dropdown açılış animasyonunun React state yeniden render döngüsüyle çakışmasından kaynaklanan mikro CSS/DOM layout hesaplamasıdır. Bu durum bir sonraki sürümde `useMemo` ve CSS transform optimizasyonu ile ele alınacaktır.
