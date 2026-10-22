# BVA 2205 — Bilişim Hukuku ve Ceza Hukuku Değerlendirme Raporu

**Öğrenci Adı Soyadı:** Metehan Gezer  
**Öğrenci Numarası:** 2516016026  
**Ders:** BVA 2205 — Büyük Veri Analistliği Veritabanı ve Web Sistemleri  
**Konu:** Türk Ceza Kanunu Kapsamında Bilişim Suçları (TCK m. 243, 244, 136) ve Yetkili Güvenlik Testlerinin Analizi  
**Tarih:** 2026-10-22  

---

## 1. Giriş ve Yasal Çerçeve

Modern web mimarileri ve veritabanı yönetim sistemleri, yetkilendirilmiş kullanıcıların meşru sınırlar dahilinde veri işlemesi amacıyla tasarlanır. Bu sistemlerin korunması, bireylerin mahremiyet haklarının güvence altına alınması ve bilişim altyapılarının bütünlüğünün sağlanması amacıyla 5237 sayılı Türk Ceza Kanunu’nda (TCK) müstakil ceza normları ihdas edilmiştir.

Bu raporda, akademik senaryolar üzerinden bilişim sistemlerine yetkisiz müdahaleler incelenmekte; TCK m. 243, 244 ve 136 hükümleri çerçevesinde suçların maddi ve manevi unsurları hukuki bir yaklaşımla analiz edilmektedir.

---

## 2. Senaryo Analizleri

### (a) Bir Sınıf Arkadaşının Şifresini Tahmin Ederek Yönetici Paneline Giriş Yapılması

- **İlgili Ceza Normu:** TCK m. 243 — *Bilişim sistemine girme*
- **Kanun Metni Özeti:** TCK m. 243/1 uyarınca; *"Bir bilişim sisteminin bütününe veya bir kısmına, hukuka aykırı olarak giren veya orada kalmaya devam eden kimseye bir yıla kadar hapis veya adlî para cezası verilir."*
- **Hukuki Değerlendirme:**
  - Suçun maddi unsuru, hak sahibi tarafından verilmiş meşru bir yetki veya rıza bulunmaksızın bilişim sistemine herhangi bir vasıtayla (şifre kırma, tahmin etme, güvenlik açığından faydalanma vb.) dahil olmak veya sistemde kalmaya devam etmektir.
  - Şifrenin kolay tahmin edilebilir olması, brute-force veya sosyal mühendislik yoluyla elde edilmiş bulunması eylemi hukuka uygun hale getirmez. Zira kanun koyucu sisteme giriş yöntemini sınırlamamış, fiilin **hukuka aykırı** olmasını yeterli görmüştür.
  - Fail hiçbir veriye zarar vermese veya hiçbir kaydı değiştirmese dahi, sisteme izinsiz giriş yapıldığı an sırf hareket suçu niteliğindeki TCK m. 243/1 tamamlanmış olur.

---

### (b) Yetkisiz Olarak Panele Girilmesi ve Proje/Video Kayıtlarının Silinmesi

- **İlgili Ceza Normu:** TCK m. 244 — *Sistemi engelleme, bozma, verileri yok etme veya değiştirme*
- **Kanun Metni Özeti:** TCK m. 244/2 uyarınca; *"Bir bilişim sistemindeki verileri bozan, yok eden, değiştiren veya erişilmez kılan, sisteme veri yerleştiren, var olan verileri başka bir yere gönderen kişi, altı aydan üç yıla kadar hapis cezası ile cezalandırılır."*
- **Hukuki Değerlendirme:**
  - Fail, yönetim paneline yetkisizce erişmekle m. 243 suçunu işlemiş; ardından sistemde yer alan projeleri, veritabanı kayıtlarını (`videolar`, `oturumlar` vb.) sildiğinde TCK m. 244/2'deki verileri yok etme veya erişilmez kılma fiilini gerçekleştirmiştir.
  - TCK m. 243/3 hükmünde de *"Bu fiil nedeniyle sistemin içerdiği veriler yok olur veya değişirse, altı aydan iki yıla kadar hapis cezasına hükmolunur"* düzenlemesi yer almaktadır. Yargıtay uygulamalarında failin doğrudan verileri silme kastıyla hareket ettiği somut olaylarda, özel ve daha ağır yaptırım öngören TCK m. 244/2 uygulanmaktadır.
  - Eylemin bir eğitim kurumu veya kamu/özel tüzel kişiliğine ait bilişim sisteminin işleyişini akamete uğratması halinde m. 244/3 gereğince cezanın yarı oranında artırılması gündeme gelebilecektir.

---

### (c) İletişim Mesajlarının İndirilmesi ve Üçüncü Kişilerle Paylaşılması

- **İlgili Ceza Normu:** TCK m. 136 — *Verileri hukuka aykırı olarak verme veya ele geçirme* (Özel Hayata ve Hayatın Gizli Alanına Karşı Suçlar)
- **Kanun Metni Özeti:** TCK m. 136/1 uyarınca; *"Kişisel verileri, hukuka aykırı olarak bir başkasına veren, yayan veya ele geçiren kişi, iki yıldan dört yıla kadar hapis cezası ile cezalandırılır."*
- **Hukuki Değerlendirme:**
  - `iletisim_mesajlari` tablosunda saklanan ad-soyad, e-posta adresi, iletişim notları ve zaman damgaları, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) m. 3/1-(d) kapsamında belirli veya belirlenebilir bir gerçek kişiye ilişkin **kişisel veri** niteliğindedir.
  - Bu verilerin yetkisiz bir biçimde indirilmesi eylemi *"verileri ele geçirme"*; bir başkasına gönderilmesi, forumlarda veya sohbet gruplarında paylaşılması ise *"verileri verme veya yayma"* fiilini oluşturur.
  - Burada TCK m. 243 (sisteme girme) ve TCK m. 136 (kişisel verileri ele geçirme/yayma) arasında fikri içtima (TCK m. 44) veya gerçek içtima ilkeleri uyarınca değerlendirme yapılır. Somut olayın koşullarına göre fail, hem bilişim sistemine hukuka aykırı girmekten hem de bağımsız korunan hukuki yarar olan kişisel verilerin korunması hakkını ihlal etmekten sorumlu tutulabilir.

---

## 3. Yetkili Güvenlik Testleri ile Hukuka Aykırı Erişim Arasındaki Ayrım

| Boyut | Yetkili Güvenlik Testi (Beyaz Şapka / Penetrasyon Testi) | Yetkisiz Müdahale / İhlal (TCK Kapsamı) |
| :--- | :--- | :--- |
| **Hukuki Dayanak** | Sistem sahibinin açık, yazılı ve önceden tanımlanmış rızası/sözleşmesi | Hukuka aykırılık; sistem sahibinin bilgisi ve rızası dışı eylem |
| **Manevi Unsur (Kast)** | Zafiyetleri tespit etme, raporlama ve güvenliği artırma amacı | İzinsiz yararlanma, merak giderme, zarar verme veya haksız kazanç |
| **Kapsam ve Sınırlar** | Belirlenen IP, port ve senaryolarla sınırlı; test verileriyle icra | Sınırsız, yetki aşımı içeren, canlı verileri hedef alan eylemler |
| **Hukuka Uygunluk Nedeni**| TCK m. 26/2 — *Hakkın kullanılması ve ilgilinin rızası* | Hukuka uygunluk nedeni bulunmaz; suç teşkil eder |

Kişinin **kendi geliştirdiği yerel veya bulut projesinde** güvenlik zafiyeti testleri yapması, SQL enjeksiyon açıklarını sınaması veya oturum doğrulama kontrollerini denemesi; kendi mülkiyet ve tasarruf yetkisi dahilindeki bir sistemi incelemesi mahiyetindedir. Dolayısıyla eylemde hukuka aykırılık unsuru bulunmadığından suç teşkil etmez.

Ancak, aynı test teknikleri (örneğin SQLmap, şifre denemeleri, yetkisiz API sorguları) izinsiz olarak bir sınıf arkadaşının, üçüncü şahsın veya kurumun sistemine yöneltildiği anda TCK m. 243 ve devamı maddeleri kapsamında cezai sorumluluk doğurur.

---

## 4. Sonuç ve Hukuki Hatırlatma

Bilişim sistemlerinde erişim yetkisi teknik bir olanaktan ibaret olmayıp, hukuki bir meşruiyet zeminine dayanmak zorundadır. Kolay tahmin edilebilen kimlik bilgileri dahi olsa, sahibinin rızası hilafına erişim sağlamak TCK m. 243'ü; verileri silmek veya değiştirmek TCK m. 244'ü; kişisel mesajları üçüncü şahıslara aktarmak ise TCK m. 136'yı ihlal edebilecek ağırlıkta ceza hukuku yaptırımlarına bağlanmıştır.

*İşbu metin, BVA 2205 dersi ödevi gereğince genel akademik ve yasal bilgilendirme gayesiyle kaleme alınmış olup bağlayıcı bir hukuki mütalaa veya kesinleşmiş yargı hükmü niteliği taşımamaktadır.*
