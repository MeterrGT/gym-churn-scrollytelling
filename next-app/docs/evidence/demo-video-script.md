# BVA 2245 — Canlı Sosyal Medya Nabzı
## 60-90 Saniyelik Türkçe Demo Video Senaryosu & Çekim Planı (Shot List)

> **⚠️ BİLGİLENDİRME & DÜRÜSTLÜK BEYANI:**  
> Akademik dürüstlük standartları uyarınca, **yaklaşık 60 saniyelik gerçek demo videosu öğrenci tarafından başarıyla kaydedilmiştir**, ancak henüz herkese açık bir YouTube/Vimeo bağlantısı sağlanmamıştır. Videonun yüklendiği, yayınlandığı veya gömüldüğü yönünde asılsız beyanda bulunulmamış; gerçek URL temin edilene kadar mevcut video gömme alanı ve dokümantasyonu dürüstçe korunmuştur.

---

### 1. Video Genel Özellikleri

- **Kayıt Durumu:** Kaydedildi (~60 saniye, MP4 formatında; genel URL bekleniyor)
- **Hedef Süre:** ~60 Saniye
- **Dil:** Türkçe (Net, profesyonel ve tempolu anlatım)
- **Çözünürlük & Format:** 1080p, 60 FPS, MP4

---

### 2. Sahne ve Çekim Planı (Shot List & Script)

#### **Sahne 1: Giriş ve Problem Tanımı (00:00 - 00:15)**
- **Görsel Odak:** Ana sayfa `/` ve portfolyo üzerinden `/canli-sosyal-medya-nabzi` sayfasına geçiş. Sayfa açılır açılmaz canlı WebSocket bağlantısının kurulması ve sayacın artmaya başlaması.
- **Seslendirme (Metin):**
  > *"Merhaba, ben Metehan Gezer. BVA 2245 dersi kapsamında geliştirdiğim 'Canlı Sosyal Medya Nabzı' projesini sunuyorum. Dijital pazarlama ve sosyal medya uzmanlarının en büyük zorluğu, anlık gelişen gündemi gecikmesiz yakalamak ve bunu yaparken kullanıcı gizliliğini ihlal etmemektir. İşte bu ürün, tam bu probleme çözüm üretiyor."*

#### **Sahne 2: Mimari & Web Worker Ayrıştırması (00:15 - 00:35)**
- **Görsel Odak:** Dashboard'daki canlı hız grafiği ve sayaçların akışı.
- **Seslendirme (Metin):**
  > *"Ürünümüz, Bluesky'ın kamuya açık Jetstream WebSocket rölesine doğrudan bağlanıyor. Saniyede yüzlerce gelen gönderi, ana arayüzü kilitlememek için arka planda bir Web Worker üzerinde işleniyor. Burada gönderilerin metinleri, kullanıcı kimlikleri veya DID bilgileri kesinlikle kaydedilmiyor; anında imha edilerek yalnızca etiket ve dil agregasyonları 5 dakikalık ve 1 saatlik kayan pencerelerde toplanıyor."*

#### **Sahne 3: Çok Dilli Filtreleme ve Etiket Analizi (00:35 - 00:55)**
- **Görsel Odak:** Dil menüsünden "Türkçe (tr)" seçilmesi, etiket listesinin ve grafiğin saniyeler içinde filtrelenmesi.
- **Seslendirme (Metin):**
  > *"Arayüz üzerinden dilediğimiz dili anında filtreleyebiliyoruz. Örneğin Türkçe filtresini seçtiğimizde, Web Worker yerel bellek havuzunu süzerek yalnızca Türkçe gönderilerdeki popüler etiketleri ve akış hızını dinamik SVG grafiğimize yansıtıyor. Hiçbir donma veya takılma yaşanmıyor."*

#### **Sahne 4: Bayat Veri Tespiti & Dayanıklılık (00:55 - 01:15)**
- **Görsel Odak:** "Bağlantıyı Kes" butonuna tıklanması, sarı renkli bayat veri banner'ının çıkması ve verilerin ekranda donması. Ardından tekrar "Canlı Bağlantıyı Başlat" butonuna basılması.
- **Seslendirme (Metin):**
  > *"Ağ kesintisi ya da manuel durdurma durumunda sistem 'Bayat Veri' moduna geçiyor. Ekranda net bir uyarı beliriyor ve kullanıcının eski veriyi canlı zannetmesi engelleniyor. Yeniden bağlan butonuna bastığımızda ise canlı akış kesintisiz kaldığı yerden devam ediyor."*

#### **Sahne 5: Kapanış & Vaka Analizi (01:15 - 01:30)**
- **Görsel Odak:** `/canli-sosyal-medya-nabzi/vaka-analizi` sayfasına geçiş, mimari şema ve test sonuçları.
- **Seslendirme (Metin):**
  > *"119 otomatik testten geçen ve Lighthouse mobilde 96 erişilebilirlik puanına sahip projemizin tüm detaylarına, vaka analizi sayfamızdan ve GitHub depomuzdan ulaşabilirsiniz. Teşekkür ederim."*

---

### 3. Kayıt Sonrası Video Yerleştirme Talimatı

Videoyu kaydettikten sonra:
1. Videoyu YouTube'a **"Liste Dışı" (Unlisted)** veya Vimeo'ya yükleyin.
2. `next-app/src/app/canli-sosyal-medya-nabzi/vaka-analizi/page.tsx` dosyasındaki video embed konteynerindeki `IFRAME_SRC` yerine YouTube video embed URL'nizi (`https://www.youtube.com/embed/VIDEO_ID`) yapıştırın.
