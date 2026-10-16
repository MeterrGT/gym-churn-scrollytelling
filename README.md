# Metehan Gezer - Kişisel Portfolyo & Gym Churn Veri Gazeteciliği Hikayesi

Bu depo, **Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği** öğrencisi **Metehan Gezer**'in kişisel web portfolyosunu ve dönem sonu akademik veri görselleştirme projesi olan **Gym Churn Data Story (Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor?)** sayfasını barındırır.

---

## 📌 Proje Genel Bakışı

### 1. Portfolyo Ana Sayfası (`/`)
- Siberpunk / neon ve lila tonlarında modern, yüksek kontrastlı arayüz tasarımı.
- İnteraktif parçacık arka planı (`CyberCanvas`).
- Ekonometrik dizüstü bilgisayar fiyat tahmin simülatörü (OLS regresyon modeli).
- Kestirimci bakım ve IoT makine öğrenmesi projeleri.
- **Gym Churn Hızlı Simülatörü:** 4.000 gözlemden hesaplanan 12 hücrelik yaş × sözleşme matrisi ile anlık risk hesaplayan dinamik araç.

### 2. Gym Churn Veri Hikayesi (`/gym-churn`)
- **D3.js (v7)** ve **Scrollama / IntersectionObserver** kullanılarak hazırlanmış 6 adımlı scrollytelling veri hikayesi.
- Masaüstünde sol tarafta sabit (sticky) grafik konteyneri, sağ tarafta adım adım ilerleyen anlatı kartları; mobilde akıcı dikey sıralama.
- **5 Farklı Veri Görselleştirmesi & Çoklu Grafik Türü:**
  1. **Adım 1 - Sıralı Sütun Grafiği (Sorted Bar Chart):** Sözleşme sürelerine göre (1 Ay: %42.3, 6 Ay: %12.5, 12 Ay: %2.4) gözlemlenen terk oranları (39.9 yüzde puanlık fark). En düşük gözlemlenen terk oranı 12 aylık sözleşmeye sahip üyeler arasındadır.
  2. **Adım 2 - Nokta / Lollipop Grafiği (Lollipop Plot):** 4 yaş kategorisinin genel veri seti ortalaması (%26.5) ile kıyaslanması (18-25 yaşta %61.9 terk vs 34+ yaşta %3.3 terk).
  3. **Adım 3 - Etkileşim Matrisi (Annotated Matrix Heatmap):** 4 Yaş Grubu × 3 Sözleşme Modeli = 12 hücrelik çapraz gözlem matrisi.
  4. **Adım 4 - Odaklanmış Risk & Sadakat Matrisi (Spotlight Heatmap):** Zirve risk segmenti (18-25 Yaş & 1 Ay: **%78.2 terk**) ile en düşük terk oranına sahip segmentin (34+ Yaş & 12 Ay: **%0.0 terk**) karşılaştırılması.
  5. **Adım 5 - Üyelik Süresi (Lifetime) Kategorileri ile Gözlemlenen Terk İlişkisi:** 0-2. ay kategorilerinde (%82.8 - %25.7) yüksek terk gözlemlenirken, 3+ ay kategorilerinde %10'un altına inmektedir. *(Not: Bu analiz kesitsel bir dağılımdır; zaman serisi veya zamana bağlı yaşam kalımı/survival takibi değildir; ilk 90 günün doğrudan terke neden olduğunu kanıtlamaz).*
  6. **Adım 6 - Analitik Sentez & Katılım Grafiği (Attendance Synthesis):** Haftalık ders sıklığı ile terk ilişkisi (Terk edenler: 1.0 gün/hafta vs Aktifler: 2.0 gün/hafta) ve nedensellik kısıtları paneli.
- **Okuyucu Keşfi (Reader Exploration):** Okuyucunun yaş grubu ve sözleşme süresini interaktif butonlarla filtreleyip alt grupların terk oranlarını, toplam gözlem sayısını ve dinamik D3 sütun grafiğini anlık inceleyebildiği panel.

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

## 🛠 Kullanılan Teknolojiler

- **Frontend & UI:** React 18, TypeScript, Vite, Tailwind CSS, Font Awesome 6
- **Veri Görselleştirme:** D3.js (v7) — SVG dönüşümleri, eksen animasyonları, tooltipler
- **Scrollytelling:** Scrollama & IntersectionObserver API
- **Veri Analitiği:** Python 3.10+, Pandas, NumPy, Jupyter Notebook

---

## 🚀 Projeyi Yerel Ortamda Çalıştırma

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev

# 3. Üretim derlemesi oluşturun ve test edin
npm run build

# 4. Kod kalitesi ve lint kontrolleri
npm run lint
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde açılır.

---

## 🤖 Yapay Zeka (AI) ve Akademik Dürüstlük Beyanı

Bu projede; Python veri işleme betikleri, D3.js SVG yaşam döngüsü mimarisi, responsive mobil uyumluluk ve ilk taslak anlatı metinlerinin yapılandırılmasında yapay zeka araçlarından (Antigravity LLM Agent) teknik ve mimari destek alınmıştır.

Kodlama ve teknik hata ayıklama desteği ile analitik yazım katkısı açıkça ayrılmıştır. Ders gereklilikleri ve akademik dürüstlük standartları doğrultusunda, öğrencinin (**Metehan Gezer**) tüm analitik yorumları, hikaye anlatımını ve çıkarımları kendi özgün cümleleriyle gözden geçirip revize etmesi gerekmektedir.

---

## 👤 Yazar & İletişim

- **Metehan Gezer**
- Manisa Celal Bayar Üniversitesi, Büyük Veri Analistliği
- **GitHub:** [https://github.com/MeterrGT](https://github.com/MeterrGT)
- **LinkedIn:** [Metehan Gezer](https://www.linkedin.com/in/metehan-gezer-aa444b403/)
- **E-posta:** [gztmetehan@gmail.com](mailto:gztmetehan@gmail.com)
