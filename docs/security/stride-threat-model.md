# STRIDE Tehdit Modeli ve Risk Analizi (STRIDE Threat Model)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Öğrenci:** Metehan Gezer (Öğrenci No: 2516016026)  
**Tarih:** 30 Ekim 2026  

---

## 1. STRIDE Tehdit Modelleme Metodolojisi

Sistem bileşenleri Microsoft STRIDE çerçevesi (**S**poofing, **T**ampering, **R**epudiation, **I**nformation Disclosure, **D**enial of Service, **E**levation of Privilege) kapsamında analiz edilmiştir. Her tehdit için **Olasılık (1-5)**, **Etki (1-5)** ve **Risk Skoru (Olasılık x Etki: 1-25)** belirlenmiştir.

---

## 2. STRIDE Tehdit ve Risk Matrisi (10 Temel Tehdit)

| No | STRIDE Kategorisi | Tehdit Tanımı ve Senaryosu | Olasılık (1-5) | Etki (1-5) | Risk Skoru (1-25) | Uygulanan Güvenlik Önlemi (Mitigation) | Artık Risk (Residual Risk) |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **T01** | **Spoofing (Kimlik Sahteciliği)** | Saldırganın sahte bir DNS veya ARP zehirlemesi ile sahte bir Jetstream WebSocket sunucusu sunması. | 2 (Düşük) | 4 (Yüksek) | **8 (Orta)** | TLS 1.3 zorunluluğu, sertifika doğrulama ve CSP `connect-src` içinde katı alan adı kilitleme (`wss://jetstream1.us-east.bsky.network`). | CA (Sertifika Otoritesi) ele geçirilmesi (ihmal edilebilir). |
| **T02** | **Tampering (Veri Tahrifatı)** | Akıştaki JSON paketlerinin yolda değiştirilerek arayüzde sahte trend etiketleri gösterilmesi. | 2 (Düşük) | 3 (Orta) | **6 (Düşük)** | WSS (WebSocket Secure) şifrelemesi ve Web Worker içinde katı JSON şema validasyonu. | İstemcinin yerel cihazındaki kötü amaçlı yazılımlar. |
| **T03** | **Tampering (Kod Tahrifatı)** | CDN veya üçüncü taraf scriptler üzerinden zararlı JS enjekte edilmesi (XSS). | 2 (Düşük) | 5 (Kritik) | **10 (Orta)** | Katı CSP (`script-src 'self'`), `X-Content-Type-Options: nosniff` ve Subresource Integrity (SRI) ilkeleri. | App Router hidrasyonu için zorunlu `'unsafe-inline'` istisnası. |
| **T04** | **Repudiation (İnkar Edilebilirlik)** | Bir yöneticinin veritabanında yaptığı değişiklikleri veya iletişim formuna gelen mesajları inkar etmesi. | 2 (Düşük) | 3 (Orta) | **6 (Düşük)** | Neon veritabanında `islem_kayitlari` (Audit Logs) tablosunda değiştirilemez zaman damgası ve IP kaydı tutulması. | Veritabanı süper kullanıcısının log tablosunu temizlemesi. |
| **T05** | **Information Disclosure (Bilgi İfşası) [ÖZEL ATANAN TEHDİT]** | **Ham sosyal medya akışından kişisel verilerin (DID, yazar bilgisi, telefon, profil URL'si, ham ileti) toplanması, bellekte saklanması veya loglara sızması.** | 4 (Yüksek) | 5 (Kritik) | **20 (Kritik)** | **Sıfır Kalıcılık Güvenlik Duvarı (Zero-Retention Firewall):** Ham metin ve DID anında imha edilir, sadece regex ile anonim etiket çıkarılır. Veritabanına ASLA PII yazılmaz. 3600s katı KV TTL. Otomatik PII test paketi devrededir. | Bir kullanıcının açıkça etiketin içine TCKN veya telefon yazması (Hashtag Injection). Sistem sadece popüler ilk 10 etiketi sunduğundan tekil sızıntı maskelenir. |
| **T06** | **Information Disclosure (Anahtar Sızıntısı)** | Veritabanı bağlantı dizesi veya API belirteçlerinin GitHub'a ya da istemci JS paketine sızması. | 3 (Orta) | 5 (Kritik) | **15 (Yüksek)** | `.gitleaks.toml` ile sürekli tarama, GitHub Actions CI gizli anahtar kontrolü, `NEXT_PUBLIC_` sınırlandırması. | Sıfırıncı gün geliştirici hatası (Incident Response Runbook ile 15 dk içinde iptal hazır). |
| **T07** | **Information Disclosure (İzleme)** | Ziyaretçilerin tarayıcı parmak izi veya üçüncü taraf çerezlerle izlenmesi. | 2 (Düşük) | 3 (Orta) | **6 (Düşük)** | `Permissions-Policy: browsing-topics=(), geolocation=()` uygulanması; üçüncü taraf analitik çerezi kullanılmaması. | Ağ seviyesinde ISS trafik analizi. |
| **T08** | **Denial of Service (Hizmet Engelleme)** | Jetstream akışında saniyede binlerce sahte gönderi patlaması yaratarak tarayıcı belleğini tüketme (OOM Crash). | 3 (Orta) | 4 (Yüksek) | **12 (Yüksek)** | Web Worker izolasyonu (ana iş parçacığı donmaz), 30 ve 60 kovalı sınırlandırılmış kayan halka bellek (`ring-buffer`) ve otomatik bellek budama. | Aşırı CPU tüketimi durumunda istemcinin manuel "Bağlantıyı Kes" butonuna basması gerekir. |
| **T09** | **Denial of Service (DDoS)** | Portföy sitesine ve API rotalarına aşırı HTTP isteği gönderilerek sunucunun kilitlenmesi. | 3 (Orta) | 3 (Orta) | **9 (Orta)** | Cloudflare Rate Limiting (Dakikada 100 istek eşiği) ve Vercel Global Edge Anycast CDN önbelleklemesi. | Dağıtık büyük botnet saldırıları (Cloudflare Under Attack modu devreye girer). |
| **T10** | **Elevation of Privilege (Yetki Yükseltme)** | CI/CD iş akışına sızan kötü niyetli bir npm paketinin depoda yönetici hakları elde etmesi. | 2 (Düşük) | 5 (Kritik) | **10 (Orta)** | GitHub Actions'ta `permissions: { contents: read, security-events: write }` ile tam en az yetki; `npm audit` denetimi. | GitHub altyapısının kendi sanal makine izolasyon açıkları. |

---

## 3. Özel Atanan Gizlilik Tehdidi (T05) Derinlemesine Analiz

### Tehdit Vektörü:
Canlı sosyal medya akışları (Bluesky Jetstream) kamuya açık paylaşımları iletse de, bu iletilerin içinde gerçek kişilere ait Ad-Soyad, e-posta, telefon, konum, siyasi/felsefi görüş veya sağlık verileri (KVKK Md. 6 Özel Nitelikli Kişisel Veri) yer alabilir. Bu verilerin bir sunucu veritabanında toplanması, profillenmesi veya günlüğe (log) kaydedilmesi **KVKK Madde 4 (Hukuka ve dürüstlük kurallarına uygun olma, amaçla bağlantılı ve sınırlı olma)** ilkelerine doğrudan aykırılık teşkil eder.

### Savunma Mimarisi (Defense-in-Depth):
1. **İçerik İzolasyonu:** Jetstream dinleyicisi `record.text` verisini kalıcı bir nesnede saklamaz.
2. **Düzenli İfade (Regex) Süzgeci:** Yalnızca `#` ile başlayan kelimeler yakalanır, metnin geri kalanı anında yok sayılır.
3. **Özetleme (Aggregation):** İstemciye ve depolama birimine gönderilen veri sadece şu şekildedir:
   ```json
   {
     "tag": "yapayzeka",
     "count": 142
   }
   ```
4. **Doğrulama ve Kanıt:** `test-privacy-minimization.mjs` test komutu ile bellekte hiçbir kişisel bilginin kalmadığı doğrulanmıştır.
