import os
import nbformat as nbf
from nbclient import NotebookClient

def build_and_run_notebook():
    nb = nbf.v4.new_notebook()

    cells = []

    # Title & Metadata
    cells.append(nbf.v4.new_markdown_cell("""# Spor Salonu Müşteri Terk (Churn) Analizi ve Keşifçi Veri Analitiği (EDA)

- **Yazar:** Metehan Gezer
- **Üniversite:** Manisa Celal Bayar Üniversitesi
- **Bölüm:** Büyük Veri Analistliği
- **Dönem Projesi:** Gym Members Churn Data Story & Interactive Scrollytelling
- **Veri Seti:** Gym customers features and churn (Adrian Vinueza, Kaggle)
- **Veri Seti URL:** https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn
- **Veri Setinin Niteliği:** Kamuya açık 4.000 gözlem ve 14 değişken içeren veri kümesi. İlgili literatür ve veri kaynağı belgeleri, bu kayıtların eğitim ve analitik amaçlı **simüle edilmiş (sentetik/eğitim amaçlı)** olduğunu belirtmektedir. Bulgular tüm spor salonu sektörünün genel gerçeği olarak değil, incelenen veri kümesi sınırları dahilindeki gözlemsel örüntüler olarak ele alınmalıdır.
- **Veri Seti Lisansı:** Kaggle veri kümesi sayfasında Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (**CC BY-NC-SA 4.0**) olarak listelenmiştir. *(Bağımsız değerlendiriciler için Kaggle kaynak sayfasından manuel teyit önerilir.)*
- **Kapsam:** 4.000 Gözlem, 14 Değişken

---

## 1. Amaç ve Hipotezler
Bu analizin temel amacı, incelenen veri setindeki değişkenler arasındaki gözlemsel örüntüleri incelemektir:
1. **Sözleşme Süresi (Contract Period):** 1 ay, 6 ay ve 12 aylık taahhüt kategorilerine göre gözlemlenen terk oranları.
2. **Demografik Yaş:** Farklı yaş kategorilerinin (`18-25`, `26-29`, `30-33`, `34+`) gözlemlenen terk oranları.
3. **Etkileşim (Interaction):** Yaş grubu ile sözleşme modelinin birlikte yarattığı 12 hücrelik gözlem matrisi.
4. **Davranışsal Katılım (Engagement):** Üyelik süresi (Lifetime) kategorileri ve haftalık ders katılım sıklığının terk ile gözlemsel ilişkisi.
"""))

    # Imports
    cells.append(nbf.v4.new_code_cell("""import os
import json
import pandas as pd
import numpy as np

# Pandas gösterim ayarları
pd.set_option('display.max_columns', 20)
pd.set_option('display.width', 1000)
print("Kütüphaneler başarıyla yüklendi.")
print(f"Pandas Versiyonu: {pd.__version__}")
"""))

    # Data Loading
    cells.append(nbf.v4.new_markdown_cell("""## 2. Veri Setinin Yüklenmesi ve Şema İncelemesi"""))
    cells.append(nbf.v4.new_code_cell("""raw_csv_path = os.path.join('..', 'data', 'raw', 'gym_churn_us.csv')
if not os.path.exists(raw_csv_path):
    raw_csv_path = os.path.join('data', 'raw', 'gym_churn_us.csv')

df = pd.read_csv(raw_csv_path)
print(f"Veri Seti Boyutu: {df.shape[0]} gözlem (satır), {df.shape[1]} değişken (sütun)\\n")
print("Sütunlar ve Veri Tipleri:")
print(df.dtypes)
"""))

    # Cleaning & Null Check
    cells.append(nbf.v4.new_markdown_cell("""## 3. Veri Kalitesi, Eksik Değer ve Aykırı Değer Kontrolü"""))
    cells.append(nbf.v4.new_code_cell("""null_summary = df.isnull().sum()
duplicate_count = df.duplicated().sum()

print("Eksik Değer (Missing Values) Özeti:")
print(null_summary)
print(f"\\nTekrarlanan Satır Sayısı: {duplicate_count}")

# Sayısal değişkenlerin özet istatistikleri
print("\\nTemel İstatistikler:")
df[['Age', 'Contract_period', 'Lifetime', 'Avg_class_frequency_current_month', 'Avg_additional_charges_total', 'Churn']].describe()
"""))

    # Baseline Churn
    cells.append(nbf.v4.new_markdown_cell("""## 4. Genel Terk (Churn) Temel Seviyesi (Baseline)
Tam oran: 1.061 / 4.000 = %26.525. Standart arayüz gösterimi: **%26.5**."""))
    cells.append(nbf.v4.new_code_cell("""churn_counts = df['Churn'].value_counts()
churn_rates = df['Churn'].value_counts(normalize=True)

print(f"Toplam Gözlem Sayısı: {len(df)}")
print(f"Aktif Kalan Üyeler (0): {churn_counts[0]} (%{churn_rates[0]*100:.1f})")
print(f"Terk Eden Üyeler (1): {churn_counts[1]} (%{churn_rates[1]*100:.1f})")
print(f"Genel Veri Seti Churn Gösterimi: %{churn_rates[1]*100:.1f} (Tam Hesaplanan: %{churn_rates[1]*100:.3f})")
"""))

    # Contract Period Analysis
    cells.append(nbf.v4.new_markdown_cell("""## 5. Sözleşme Süresi Kategorilerine Göre Gözlemlenen Terk Oranları
Sözleşme süreleri veri setinde **1 Ay**, **6 Ay** ve **12 Ay** olarak yer almaktadır."""))
    cells.append(nbf.v4.new_code_cell("""contract_labels = {1: '1 Ay (Aylık)', 6: '6 Ay (Yarım Yıl)', 12: '12 Ay (Yıllık)'}
by_contract = df.groupby('Contract_period')['Churn'].agg(
    Toplam_Uye='count',
    Terk_Eden='sum',
    Terk_Orani='mean'
).reset_index()

by_contract['Terk_Yuzdesi'] = (by_contract['Terk_Orani'] * 100).round(2)
by_contract['Paket_Adi'] = by_contract['Contract_period'].map(contract_labels)
by_contract['Uye_Payi'] = ((by_contract['Toplam_Uye'] / len(df)) * 100).round(2)

print("--- SÖZLEŞME MODELLERİ CHURN TABLOSU ---")
print(by_contract[['Contract_period', 'Paket_Adi', 'Toplam_Uye', 'Uye_Payi', 'Terk_Eden', 'Terk_Yuzdesi']])

# Unrounded calculation for difference between 1m and 12m
c1_rate = by_contract.loc[by_contract['Contract_period'] == 1, 'Terk_Orani'].values[0]
c12_rate = by_contract.loc[by_contract['Contract_period'] == 12, 'Terk_Orani'].values[0]
delta_pp = (c1_rate - c12_rate) * 100
print(f"\\nEn düşük gözlemlenen terk oranı 12 aylık sözleşmeye sahip üyeler arasındadır (%{c12_rate*100:.1f}).")
print(f"1 Aylık vs 12 Aylık Sözleşme Terk Farkı (Unrounded Hesap): {delta_pp:.1f} yüzde puanı (pp) fark!")
"""))

    # Age Groups Analysis
    cells.append(nbf.v4.new_markdown_cell("""## 6. Demografik Yaş Gruplarına Göre Terk Oranları
Üyelerin yaş dağılımı 18 ile 41 arasında değişmektedir. 4 demografik yaş kategorisi oluşturulmuştur:
- `18-25 Yaş` (Genç / Erken Kariyer)
- `26-29 Yaş` (Genç Profesyonel)
- `30-33 Yaş` (Yerleşik Profesyonel)
- `34+ Yaş` (Olgun Kitle)"""))
    cells.append(nbf.v4.new_code_cell("""age_bins = [17, 25, 29, 33, 50]
age_labels = ['18-25', '26-29', '30-33', '34+']
df['Age_Group'] = pd.cut(df['Age'], bins=age_bins, labels=age_labels)

by_age = df.groupby('Age_Group', observed=False)['Churn'].agg(
    Toplam_Uye='count',
    Terk_Eden='sum',
    Terk_Orani='mean'
).reset_index()

by_age['Terk_Yuzdesi'] = (by_age['Terk_Orani'] * 100).round(2)
by_age['Uye_Payi'] = ((by_age['Toplam_Uye'] / len(df)) * 100).round(2)

print("--- YAŞ GRUPLARI CHURN TABLOSU ---")
print(by_age[['Age_Group', 'Toplam_Uye', 'Uye_Payi', 'Terk_Eden', 'Terk_Yuzdesi']])
"""))

    # Interaction: Age Group x Contract Period
    cells.append(nbf.v4.new_markdown_cell("""## 7. Yaş ve Sözleşme Tipi Etkileşim Matrisi (12 Hücre)
Demografik değişkenler ile sözleşme modellerinin birlikte oluşturduğu 12 analitik hücre."""))
    cells.append(nbf.v4.new_code_cell("""interaction_pivot = df.pivot_table(
    index='Age_Group',
    columns='Contract_period',
    values='Churn',
    aggfunc=['count', lambda x: round(np.mean(x)*100, 2)],
    observed=False
)
interaction_pivot.columns = ['1 Ay (Sayı)', '6 Ay (Sayı)', '12 Ay (Sayı)', '1 Ay (Terk %)', '6 Ay (Terk %)', '12 Ay (Terk %)']

print("--- 12 HÜCRELİK ETKİLEŞİM MATRİSİ ---")
print(interaction_pivot[['1 Ay (Terk %)', '6 Ay (Terk %)', '12 Ay (Terk %)']])

# Zirve risk ve en düşük terk segmenti tespiti
by_combined = df.groupby(['Age_Group', 'Contract_period'], observed=False)['Churn'].agg(
    Toplam_Uye='count',
    Terk_Eden='sum',
    Terk_Orani='mean'
).reset_index()
by_combined['Terk_Yuzdesi'] = (by_combined['Terk_Orani'] * 100).round(2)

peak_row = by_combined.loc[by_combined['Terk_Yuzdesi'].idxmax()]
min_row = by_combined.loc[by_combined['Terk_Yuzdesi'].idxmin()]

print(f"\\n▲ EN YÜKSEK TERK SEGMENTİ: {peak_row['Age_Group']} Yaş + {peak_row['Contract_period']} Ay Taahhüt -> %{peak_row['Terk_Yuzdesi']:.1f} Churn ({peak_row['Terk_Eden']}/{peak_row['Toplam_Uye']} gözlem)")
print(f"▼ EN DÜŞÜK TERK SEGMENTİ: {min_row['Age_Group']} Yaş + {min_row['Contract_period']} Ay Taahhüt -> %{min_row['Terk_Yuzdesi']:.1f} Churn ({min_row['Terk_Eden']}/{min_row['Toplam_Uye']} gözlem)")
print(f"Gözlemsel Fark: {peak_row['Terk_Yuzdesi'] - min_row['Terk_Yuzdesi']:.1f} percentage points (pp)!")
"""))

    # Engagement & Lifetime
    cells.append(nbf.v4.new_markdown_cell("""## 8. Üyelik Süresi (Lifetime) Kategorileri ve Antrenman Sıklığı ile Gözlemlenen İlişki
*Önemli Metodolojik Not:* Veri seti kesitseldir (cross-sectional). Üyelerin ne zaman ayrıldığını gösteren zamana bağlı bir yaşam kalımı (survival/time-to-event) takibi değildir; ilk 90 günün doğrudan terke neden olduğunu kanıtlamaz."""))
    cells.append(nbf.v4.new_code_cell("""# 1. Lifetime (Kayıt Süresi Kategorileri - Ay)
df['Lifetime_Bucket'] = df['Lifetime'].apply(lambda x: str(x) if x < 6 else '6+')
lifetime_order = ['0', '1', '2', '3', '4', '5', '6+']
by_lifetime = df.groupby('Lifetime_Bucket')['Churn'].agg(
    Toplam_Uye='count',
    Terk_Eden='sum',
    Terk_Orani='mean'
).reindex(lifetime_order).reset_index()
by_lifetime['Terk_Yuzdesi'] = (by_lifetime['Terk_Orani'] * 100).round(2)

print("--- ÜYELİK SÜRESİ KATEGORİLERİ VE TERK ORANI ---")
print(by_lifetime)

# 2. Haftalık Sınıf Katılım Sıklığı
print("\\nOrtalama Haftalık Ders Katılımı (Son Ay):")
print(f"Kalan Üyeler (0): {df[df['Churn'] == 0]['Avg_class_frequency_current_month'].mean():.2f} gün/hafta")
print(f"Terk Eden Üyeler (1): {df[df['Churn'] == 1]['Avg_class_frequency_current_month'].mean():.2f} gün/hafta")
"""))

    # Exporting
    cells.append(nbf.v4.new_markdown_cell("""## 9. Web Uygulaması İçin Özet CSV Dosyalarının Üretilmesi
`scripts/process_data.py` modülü çağrılarak web sitesi için standartlaştırılmış özetler üretilir."""))
    cells.append(nbf.v4.new_code_cell("""# scripts/process_data.py modülünü çağırarak verileri doğrulanmış biçimde dışa aktar
try:
    import sys
    sys.path.append('..')
    from scripts.process_data import process_gym_churn
    metrics = process_gym_churn()
    print("Veri işleme ve dışa aktarma başarıyla tamamlandı:")
    print(json.dumps(metrics, indent=2, ensure_ascii=False))
except Exception as e:
    print("Modül çağrısında hata:", e)
"""))

    # Methodological Limitations & AI Disclosure
    cells.append(nbf.v4.new_markdown_cell("""## 10. Metodolojik Çıkarımlar, Sınırlılıklar ve Akademik Dürüstlük

1. **Korelasyon vs. Nedensellik:** En düşük gözlemlenen terk oranı 12 aylık sözleşmeye sahip üyeler arasında gerçekleşmiştir (%2.4). Bu durum tek başına uzun sözleşmenin terki önlediğini kanıtlamaz; zira sporu yaşam biçimi haline getirmiş disiplinli bireylerin baştan yıllık taahhüt seçmesi (**Kendini Seçme Yanlılığı / Selection Bias**) bu örüntüde temel rol oynamaktadır.
2. **Kayıt Süresi (Lifetime) Kategorileri:** 0-2. ay kategorilerinde gözlemlenen terk oranı yüksek olmakla birlikte, bu veri zamana bağlı bir yaşam kalımı (survival/time-to-event) takibi değildir; ilk 90 günün doğrudan terke neden olduğunu iddia etmez.
3. **Zirve Risk Kümesi:** `18-25 Yaş` grubunda aylık sözleşme alanlarda gözlemlenen terk oranı %78.2 ile en yüksek seviyededir.
4. **Veri Setinin Niteliği ve Lisans:** Adrian Vinueza tarafından Kaggle'da paylaşılan veri seti, ilgili literatürde eğitim ve analitik amaçlı simüle edilmiş kamuya açık bir veri seti olarak nitelendirilmektedir. Lisansı Kaggle sayfasında **CC BY-NC-SA 4.0** olarak listelenmiştir; bağımsız değerlendiriciler için manuel teyit önerilir.
5. **Yapay Zeka (AI) Kullanım Beyanı:** Bu çalışmada Python veri işleme kodları, D3.js entegrasyonu ve ilk anlatı taslaklarının hazırlanmasında yapay zeka (LLM / Antigravity Agent) teknik desteği alınmıştır. Kodlama ve hata ayıklama desteği ile analitik yazım katkısı açıkça ayrılmıştır. Öğrencinin (**Metehan Gezer**) tüm yorum ve metinleri kendi özgün ifadeleriyle gözden geçirip revize etmesi ders gerekliliğidir.
"""))

    nb.cells = cells

    # Save notebook
    notebook_path = os.path.join('notebooks', 'analiz.ipynb')
    os.makedirs('notebooks', exist_ok=True)
    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    print(f"Notebook written to {notebook_path}")

    # Execute notebook using NotebookClient
    print("Executing notebook from top to bottom with NotebookClient...")
    client = NotebookClient(nb, timeout=60, kernel_name='python3')
    client.execute()

    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    print(f"Notebook executed successfully and re-saved with full execution outputs to {notebook_path}!")

if __name__ == '__main__':
    build_and_run_notebook()
