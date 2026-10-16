# Ham Veri Seti Dokümantasyonu (Raw Dataset Provenance & Metadata)

## 📌 Veri Seti Kimliği ve Kaynağı
- **Veri Seti Adı:** Gym customers features and churn
- **Yükleyen / Müellif:** Adrian Vinueza
- **Platform:** Kaggle Datasets
- **Kaynak URL:** [https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn](https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn)
- **Veri Setinin Niteliği:** Kamuya açık 4.000 gözlem ve 14 değişken içeren veri kümesi. İlgili literatür ve veri kaynağı belgeleri, bu kayıtların eğitim ve analitik modelleme amaçlı **simüle edilmiş (sentetik/eğitim amaçlı)** olduğunu belirtmektedir. Bu nedenle bulgular tüm spor salonu sektörünün genel gerçeği olarak değil, incelenen veri kümesi sınırları dahilindeki gözlemsel örüntüler olarak değerlendirilmelidir.
- **Lisans Durumu:** Kaggle veri kümesi sayfasında **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International) olarak listelenmiştir.
  > *Not: Kaggle notebook çalışma ortamı lisansı (Apache 2.0 / MIT) ile veri setinin kendi lisansı karıştırılmamalıdır. Bağımsız değerlendiriciler için Kaggle kaynak sayfasından manuel teyit önerilir.*
- **Dosya Konumu:** `data/raw/gym_churn_us.csv`
- **Gözlem ve Değişken Sayısı:** 4.000 Gözlem (Satır) × 14 Değişken (Sütun)
- **Erişim & İnceleme Tarihi:** Ekim 2026

---

## 📋 Değişkenler ve Şema (14 Sütun)

| Sütun Adı | Veri Tipi | Açıklama | Değer Aralığı / Kategoriler |
| :--- | :--- | :--- | :--- |
| `gender` | `int64` | Üyenin biyolojik cinsiyeti | 0, 1 |
| `Near_Location` | `int64` | Spor salonunun üyenin ikametgahına/işine yakınlığı | 0 (Uzak), 1 (Yakın) |
| `Partner` | `int64` | Üyenin çalıştığı kurumun anlaşmalı kulüp ortağı olup olmadığı | 0 (Bireysel), 1 (Partner Şirket) |
| `Promo_friends` | `int64` | Arkadaş referans kodu/kampanyası ile kayıt durumu | 0 (Referanssız), 1 (Arkadaş İndirimi) |
| `Phone` | `int64` | İletişim telefon numarasının kayıtlı olup olmadığı | 0, 1 |
| `Contract_period` | `int64` | Satın alınan sözleşme taahhüt süresi (Ay) | **1, 6, 12** |
| `Group_visits` | `int64` | Grup derslerine (pilates, spinning vb.) katılım | 0 (Katılmıyor), 1 (Katılıyor) |
| `Age` | `int64` | Üyenin yaşı | 18 – 41 yaş (Ortalama: 29.18) |
| `Avg_additional_charges_total` | `float64` | Kulüp içi yan harcamalar (kafe, bar, masaj, ürün) | 0.15 – 552.59 (Ortalama: 146.94) |
| `Month_to_end_contract` | `float64` | Mevcut sözleşmenin bitimine kalan ay sayısı | 1.0 – 12.0 ay |
| `Lifetime` | `int64` | Salona ilk kayıt tarihinden bu yana geçen süre kategorisi (Ay) | 0 – 31 ay (Ortalama: 3.71 ay) |
| `Avg_class_frequency_total` | `float64` | Üyelik boyunca haftalık ortalama ders/ziyaret sıklığı | 0.0 – 6.02 gün/hafta |
| `Avg_class_frequency_current_month` | `float64` | Son 1 aydaki haftalık ortalama ders/ziyaret sıklığı | 0.0 – 6.15 gün/hafta |
| `Churn` | `int64` | **Hedef Değişken (Target):** İlgili ayda üyeliğin terk edilmesi | **0 (Aktif: %73.5), 1 (Terk: %26.5)** *(Tam: 1.061/4.000 = %26.525)* |

---

## 🔍 Veri Kalite & Bütünlük Kontrolleri

1. **Eksik Değerler (Missing / Null):**
   - `df.isnull().sum().sum() = 0`. Veri setinde hiçbir eksik (NaN/None) değer bulunmamaktadır.
2. **Yinelenen Kayıtlar (Duplicate Rows):**
   - `df.duplicated().sum() = 0`. Tamamen yinelenen hiçbir satır tespit edilmemiştir.
3. **Mantıksal Tutarlılık Kontrolleri:**
   - Yaş değişkeni 18 ile 41 arasındadır (uç veya eksi değer yoktur).
   - `Contract_period` değişkeni kesinlikle yalnızca `[1, 6, 12]` ayrık değerlerini almaktadır.
   - `Lifetime` pozitif tamsayıdır. Kesitsel bir kategoridir; zamana bağlı yaşam kalımı (survival) takibi değildir.
   - `Avg_class_frequency_current_month` ve `Avg_class_frequency_total` negatif olamaz.

---

## ⚙️ Gruplama ve Agregasyon Kararları

Analiz ve web arayüzünde scrollytelling anlatımının netliği için aşağıdaki gruplamalar uygulanmıştır:

1. **Yaş Grupları (`Age_Group`):**
   - `18-25 Yaş` (536 gözlem - Terk Oranı: %61.9)
   - `26-29 Yaş` (1.593 gözlem - Terk Oranı: %33.1)
   - `30-33 Yaş` (1.508 gözlem - Terk Oranı: %12.6)
   - `34+ Yaş` (363 gözlem - Terk Oranı: %3.3)
2. **Sözleşme Modelleri (`Contract_period`):**
   - `1 Ay (Aylık Taahhüt)`: 2.207 gözlem (%55.2 pay, Gözlemlenen Terk: %42.3)
   - `6 Ay (Yarım Yıllık Taahhüt)`: 833 gözlem (%20.8 pay, Gözlemlenen Terk: %12.5)
   - `12 Ay (Yıllık Taahhüt)`: 960 gözlem (%24.0 pay, Gözlemlenen Terk: %2.4)
   - *12 Ay ile 1 Ay arasındaki unrounded fark: 39.9 yüzde puanıdır (pp).*
3. **Kayıt Süresi / Lifetime Kategorileri (`Lifetime`):**
   - `0. Ay`, `1. Ay`, `2. Ay`, `3. Ay`, `4. Ay`, `5. Ay`, `6+ Ay` olarak 7 adıma ayrılmıştır. Bu kategoriler arasındaki farklar gözlemseldir; nedensellik veya zamansal ayrılma anı kanıtı olarak sunulamaz.
4. **Katılım Sıklığı (`Avg_class_frequency_current_month`):**
   - `0-0.5 Gün`, `1 Gün`, `2 Gün`, `3 Gün`, `4+ Gün` olarak haftalık seans aralıklarına ayrılmıştır.

---

## 📤 Üretilen Doğrulanmış Özet Dosyaları

`scripts/process_data.py` betiği ve `notebooks/analiz.ipynb` not defteri tarafından üretilen ve web sitesinde tüketilen dosyalar:
- `data/processed/churn_by_contract.csv` & `public/data/churn_by_contract.csv`
- `data/processed/churn_by_age.csv` & `public/data/churn_by_age.csv`
- `data/processed/churn_combined.csv` & `public/data/churn_combined.csv`
- `data/processed/churn_by_lifetime.csv` & `public/data/churn_by_lifetime.csv`
- `data/processed/churn_by_frequency.csv` & `public/data/churn_by_frequency.csv`
- `data/processed/churn_summary_metrics.json` & `public/data/churn_summary_metrics.json`
