# BVA 2205 Teslimat Kanıtları ve Ekran Görüntüleri Envanteri

Bu dizin, Manisa Celal Bayar Üniversitesi BVA 2205 Veritabanı ve Web Entegrasyonu dersi final ödevi kapsamında toplanan gerçek ekran görüntülerini, SQL sorgu sonuçlarını ve kanıt envanterini içerir.

**Öğrenci Adı:** Metehan Gezer
**Öğrenci Numarası:** 2516016026
**Ders:** BVA 2205 - Büyük Veri Analistliği
**Proje:** Next.js & Neon PostgreSQL Entegre Portfolyo ve Yönetim Sistemi

---

## 1. Canlı Uygulama Ekran Görüntüleri Envanteri

Aşağıdaki ekran görüntüleri, çalışan Next.js uygulaması üzerinden Chrome DevTools Protocol (CDP) aracılığıyla gerçek zamanlı olarak alınmıştır:

| Dosya Adı | Açıklama | URL / Rota | Doğrulanan Unsurlar |
|:---|:---|:---|:---|
| `01_public_homepage.png` | Genel Portfolyo Ana Sayfası | `/` | Hero alanı, hakkımda, biyografi, MCBÜ Büyük Veri Analistliği bilgisi |
| `02_public_videos_section.png` | Videolarım & Öne Çıkanlar | `/#videos` | "Henüz yayımlanmış video yok." dürüst boş durum gösterimi, akademik test kaydı açıklaması ve Neon DB entegrasyonu |
| `03_public_gym_churn.png` | Gym Churn Veri Hikâyesi | `/gym-churn` | D3.js interaktif scrollytelling görselleştirmeleri, churn analiz grafikleri |
| `04_public_contact.png` | İletişim & KVKK Onayı | `/iletisim` | Mesaj formu, 6698 sayılı KVKK aydınlatma metni onay kutusu, doğrulama |
| `05_login_page.png` | Yönetici Giriş Sayfası | `/giris` | E-posta ve şifre formu, **TCK m. 243-244** yasal uyarı bildirimi |
| `06_login_invalid.png` | Hatalı Giriş Denemesi | `/giris` | Hatalı e-posta/şifre girildiğinde güvenli hata mesajı ("Geçersiz e-posta veya şifre") |
| `07_admin_dashboard.png` | Yönetici Kontrol Paneli | `/admin` | Son başarılı giriş zamanı (`son_giris`) ve IP adresi (`son_giris_ip`), istatistikler |
| `08_admin_videos.png` | Video Yönetim Paneli | `/admin/videolar` | 9 adet video kaydı, `2516016026` öğrenci numaralı başlık, "Bağlantı eklenmedi" etiketleri, CRUD butonları |
| `09_admin_messages.png` | İletişim Mesajları Paneli | `/admin/mesajlar` | Gelen mesajlar, KVKK onay durumu, okunmamış sayaç rozeti, durum değiştirme/silme |
| `10_admin_logs.png` | Denetim Kayıtları (Audit Log) | `/admin/kayitlar` | Son 50 `islem_kayitlari` (ekle, guncelle, sil, giris), zaman damgası ve yönetici bilgisi |
| `neon_tables_schema.png` | Neon Bulut Konsolu Tabloları | console.neon.tech | 6 ilişkisel tablonun listesi ve `videolar` tablosunun detaylı şeması / kısıtları |
| `neon_sql_query_result.png` | Neon SQL Editor Görev 3.2 | console.neon.tech | Görev 3.2 sorgu icrası ve 5 satırlık azalan izlenme sonuç tablosu |

---

## 2. SQL Görevleri (3.1 – 3.8) ve Gerçek Çıktıları

Tüm SQL görevleri `sql/sorgular.sql` dosyasında yer almakta olup Neon PostgreSQL üzerinde doğrulanmıştır:

### Görev 3.1: 10 dakikadan kısa ve 1000'den fazla izlenmiş videolar
```sql
SELECT *
FROM videolar
WHERE sure_dk < 10
  AND izlenme > 1000;
```
*Gerçek Veritabanı Sonucu:* 4 kayıt (ID 1: 8 dk / 1500 izlenme, ID 2: 9 dk / 2400 izlenme, ID 5: 6 dk / 1250 izlenme, ID 10: 7 dk / 1800 izlenme).

### Görev 3.2: En çok izlenen 5 video
```sql
SELECT id, baslik, izlenme
FROM videolar
ORDER BY izlenme DESC
LIMIT 5;
```
*Gerçek Veritabanı Sonucu:*
1. SQL ile Verileri Sorgulama (3.200 izlenme)
2. Veri Analizi Temelleri (2.400 izlenme)
3. Next.js Başlangıç (1.800 izlenme)
4. Gym Churn Veri Hikâyesi 2516016026 (1.500 izlenme)
5. Grafiklerle Veri Hikâyesi (1.250 izlenme)

### Görev 3.3: Toplam tahmini izlenme süresi (saat)
```sql
SELECT SUM(sure_dk * izlenme) / 60.0 AS toplam_izlenme_saati
FROM videolar;
```
*Gerçek Veritabanı Sonucu:* `2130.5000000000000000` saat.

### Görev 3.4: Her oynatma listesinde kaç video var?
```sql
SELECT
    ol.ad AS oynatma_listesi,
    COUNT(v.id) AS video_sayisi
FROM oynatma_listeleri ol
LEFT JOIN videolar v ON v.kategori_id = ol.id
GROUP BY ol.id, ol.ad
ORDER BY ol.id;
```
*Gerçek Veritabanı Sonucu:*
- Eğitim: 3 video
- Proje Tanıtımı: 3 video
- Veri Bilimi: 2 video
- Kişisel Gelişim: 1 video
- Canlı Yayın: 0 video

### Görev 3.5: Öğrenci numarasını ILIKE ile bul
```sql
SELECT id, baslik
FROM videolar
WHERE baslik ILIKE '%2516016026%';
```
*Gerçek Veritabanı Sonucu:* ID 1 (`Gym Churn Veri Hikâyesi 2516016026`).

### Görev 3.6: Video adresi boş olan kayıtları yayından kaldır
```sql
UPDATE videolar
SET yayinda = FALSE
WHERE video_url IS NULL
   OR TRIM(video_url) = '';
```
*Gerçek Veritabanı Durumu:* `video_url` alanı NULL olan tüm 9 kayıt için `yayinda = FALSE` olarak başarıyla uygulanmıştır.

### Görev 3.7: 10'dan az izlenmiş ve bir yıldan eski videoları sil
```sql
DELETE FROM videolar
WHERE izlenme < 10
  AND yayin_tarihi < CURRENT_DATE - INTERVAL '1 year'
RETURNING id, baslik, izlenme, yayin_tarihi;
```
*Doğrulama Notu:* Canlı tablodaki 9 geçerli kaydın bütünlüğünü korumak adına kalıcı olarak silinmemiş; geçici rollback işlemi ve izole test scriptleri ile doğrulanmıştır.

### Görev 3.8: Son 7 gündeki işlem türüne göre denetim kaydı sayıları
```sql
SELECT islem, COUNT(*) AS islem_sayisi
FROM islem_kayitlari
WHERE zaman >= CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY islem
ORDER BY islem_sayisi DESC;
```
*Gerçek Veritabanı Sonucu:* `guncelle`, `sil`, `ekle`, `giris` işlemleri başarıyla gruplanmaktadır.

---

## 3. Neon Konsolu Ekran Görüntüleri ve Doğrulama

Bulut tabanlı **Neon Console (console.neon.tech)** üzerinden alınan 2 adet gerçek ekran görüntüsü başarıyla doğrulanmış ve PDF raporuna entegre edilmiştir:

1. **Neon Tables Görünümü Ekran Görüntüsü (`neon_tables_schema.png`):**
   - 6 tablonun (`yoneticiler`, `oturumlar`, `oynatma_listeleri`, `videolar`, `iletisim_mesajlari`, `islem_kayitlari`) şeması ve `videolar` tablosunun sütun yapısı, primary key, foreign key ve index kısıtları doğrulanmıştır.
2. **Neon SQL Editor Görev Sonuçları Ekran Görüntüsü (`neon_sql_query_result.png`):**
   - Görev 3.2 sorgusu (`SELECT id, baslik, izlenme FROM videolar ORDER BY izlenme DESC LIMIT 5;`) çalıştırılmış; 93ms içinde dönen 5 satırlık sonuç kümesi Neon SQL konsolundan kaydedilmiştir.
   - *Açıklama:* Bu ekrandaki izlenme sayıları (3200, 2400, 1800, 1500, 1250) akademik test verisidir; gerçek YouTube analitiği iddiası taşımamaktadır.

---

## 4. Veri Doğruluğu ve Beyan

- **Video Verileri:** Veritabanında kayıtlı 9 video, ders yönergesinin gerektirdiği çeşitliliği (süre, izlenme, kategori, yayın tarihi ve öğrenci numarası) sağlamak amacıyla oluşturulmuş gösterim verileridir. Bu veriler gerçek dünya analitiği değil, veritabanı CRUD ve SQL sorgulama işlevselliğini test etmeye dönük akademik verilerdir.
- **Kişisel Veriler:** Öğrenci adı (`Metehan Gezer`), numarası (`2516016026`), üniversitesi (`MCBÜ`) ve e-posta adresi (`gztmetehan@gmail.com`) doğrulanmış gerçek bilgilerdir.
