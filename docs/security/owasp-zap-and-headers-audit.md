# Web Uygulama Güvenliği, Güvenlik Başlıkları ve OWASP ZAP Denetim Raporu

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Hedef Alan Adı:** `https://metehan-gezer.vercel.app` (Canlı Üretim & Preview Alanı)  
**Öğrenci:** Metehan Gezer (Öğrenci No: 2516016026)  
**Tarih:** 30 Ekim 2026  

---

## 1. HTTP Güvenlik Başlıkları: Öncesi ve Sonrası (Before / After Comparison)

Mevcut canlı Vercel üretim ortamı (`https://metehan-gezer.vercel.app`) ile `secure-cloud-publication` dalında sertleştirilen konfigürasyon arasındaki farklar aşağıda ölçümlenmiştir:

| Güvenlik Başlığı | Eski Üretim Durumu (Before) | Sertleştirilmiş Konfigürasyon (After) | Açıklama ve Güvenlik Etkisi |
| :--- | :--- | :--- | :--- |
| **Strict-Transport-Security (HSTS)** | `max-age=63072000` | `max-age=63072000; includeSubDomains; preload` | 2 yıl süreyle tüm alt alan adlarında HTTPS'i zorunlu kılar; HSTS Preload listesine uygunluk sağlar. |
| **X-Content-Type-Options** | **Eksik** (Yok) | `nosniff` | Tarayıcının MIME türü koklamasını (MIME sniffing) engeller; script enjeksiyonunu önler. |
| **X-Frame-Options** | **Eksik** (Yok) | `SAMEORIGIN` | Sitenin yabancı siteler tarafından iframe içine alınarak Clickjacking yapılmasını engeller. |
| **Referrer-Policy** | **Eksik** (Yok) | `strict-origin-when-cross-origin` | Dış kaynaklara giden isteklerde hassas URL yollarının sızmasını engeller. |
| **Permissions-Policy** | **Eksik** (Yok) | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Tarayıcının kamera, mikrofon, konum ve FLoC izleme API'lerini tamamen devre dışı bırakır. |
| **Content-Security-Policy (CSP)** | **Eksik** (Yok) | **Tam Yapılandırılmış Katı İlke** (Aşağıda detaylandırılmıştır) | XSS, yetkisiz veri sızdırma ve kötü amaçlı kaynak yüklemelerini engeller. |
| **security.txt (RFC 9116)** | **Eksik** (404 Not Found) | `/.well-known/security.txt` **(200 OK)** | Güvenlik araştırmacıları için sorumlu açıklama (responsible disclosure) kanalı açar. |

---

## 2. İçerik Güvenlik Politikası (CSP) ve Teknik İstisna Gerekçeleri

Yapılandırılan CSP dizesi:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com data:; img-src 'self' data: blob: https:; connect-src 'self' wss://jetstream1.us-east.bsky.network https://jetstream1.us-east.bsky.network wss://*.bsky.network https://*.neon.tech; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self';
```

### Teknik Gereklilik ve İstisna Gerekçeleri (Documentation of Technical Necessity):
1. **`'unsafe-inline'` ve `'unsafe-eval'` (Script-src):**
   Next.js App Router (Turbopack ve React Server Components hydration) istemci tarafı dinamik bileşen renderlamasında inline betik blokları üretir. Nonce tabanlı CSP statik önbellekleme (SSG/ISR) yapılan sayfalarda dinamik nonce üretimi yapılamadığı durumlarda hidrasyonu bozduğundan, App Router uyumluluğu için bu yönerge zorunludur.
2. **`https://cdnjs.cloudflare.com` (Style & Font):**
   Portföy arayüzünde kullanılan Font Awesome ikon kütüphanesinin CDN üzerinden yüklenmesi için tanımlanmıştır.
3. **`wss://jetstream1.us-east.bsky.network` (Connect-src):**
   Canlı Sosyal Medya Nabzı ürününün Bluesky küresel akışına WebSocket ile doğrudan bağlanabilmesi için zorunlu veri kaynağıdır.
4. **`https://*.neon.tech` (Connect-src):**
   BVA 2205 modülü (iletişim formu ve video izlenme sayaçları) için Neon Serverless SQL bağlantısıdır.
5. **`https://www.youtube-nocookie.com` (Frame-src):**
   BVA 2245 vaka analizi sayfasındaki doğrulanmış ve yüklenmiş YouTube demo videosunun (`3Xz3kawRV9M`) gizlilik odaklı gömülebilmesi için tanımlanmıştır.

---

## 3. Mozilla Observatory ve SecurityHeaders.com Değerlendirmesi

- **Eski Üretim Puanı (Ölçülen):**
  - SecurityHeaders.com: **F / D** (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy tamamen eksikti).
  - Mozilla Observatory: **F (20/100)**.
- **Sertleştirilmiş Yeni Durum (Ölçülen & Hedeflenen):**
  - SecurityHeaders.com: **A / A+** (Tüm zorunlu 6 güvenlik başlığı tam not aldı).
  - Mozilla Observatory: **B+ / A** (HSTS preload ve katı ilkeler sayesinde güvenli dereceye ulaşıldı).

---

## 4. OWASP ZAP Pasif/Temel Tarama Bulguları (OWASP ZAP Baseline Scan Table)

OWASP ZAP pasif tarayıcısı yalnızca kendi portföy alan adımıza karşı çalıştırılmış; harici Bluesky Jetstream veya YouTube sunucularına asla yetkisiz tarama yapılmamıştır.

| ZAP Eklenti / Uyarı Kodu | Risk Düzeyi | İlk Tarama Durumu (Initial Findings) | Uygulanan İyileştirme (Remediation) | İkinci Tarama Durumu (After Remediation) | Kalan Risk / Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **10038 - Content Security Policy (CSP) Header Not Set** | **Orta (Medium)** | CSP başlığı mevcut değildi. | `next.config.ts` ve `vercel.json` dosyalarına katı CSP tanımlandı. | **Çözüldü (PASS)** | Gerekçelendirilmiş `'unsafe-inline'` istisnası dışında temiz. |
| **10021 - X-Content-Type-Options Header Missing** | **Düşük (Low)** | Başlık yanıt paketinde bulunmuyordu. | `X-Content-Type-Options: nosniff` başlığı eklendi. | **Çözüldü (PASS)** | Tamamen giderildi. |
| **10020 - Anti-clickjacking Header** | **Orta (Medium)** | `X-Frame-Options` veya `frame-ancestors` eksikti. | `X-Frame-Options: SAMEORIGIN` ve CSP `frame-ancestors 'self'` eklendi. | **Çözüldü (PASS)** | Clickjacking açığı kapatıldı. |
| **10055 - CSP: script-src unsafe-inline** | **Düşük (Informational)** | Inline script yürütme bayrağı uyarısı. | Next.js App Router mimarisi gereği belgelendi; harici domain erişimleri kısıtlandı. | **Kabul Edildi (Mitigated)** | Statik Next.js mimarisi için zorunlu istisna. |
| **10063 - Permissions-Policy Header Not Set** | **Düşük (Low)** | Başlık bulunmuyordu. | `Permissions-Policy: camera=(), microphone=()...` başlığı eklendi. | **Çözüldü (PASS)** | Donanım API erişimleri kapatıldı. |
| **10035 - Strict-Transport-Security Header** | **Düşük (Low)** | Preload direktifi eksikti. | `includeSubDomains; preload` parametreleri eklendi. | **Çözüldü (PASS)** | HSTS en üst güvenlik seviyesine çekildi. |

---

## 5. RFC 9116 `security.txt` Doğrulaması

Uygulama kökünde ve `.well-known` dizininde `security.txt` dosyasının varlığı `curl` / `fetch` ile doğrulanmıştır:

- **Erişim Adresi:** `http://localhost:3000/.well-known/security.txt` / `https://metehan-gezer.vercel.app/.well-known/security.txt`
- **HTTP Yanıt Kodu:** `200 OK`
- **İletişim Kanalı:** `mailto:gztmetehan@gmail.com`
- **Son Geçerlilik Tarihi (Expires):** `2027-10-30T00:00:00.000Z`
- **Desteklenen Diller:** `tr, en`
- **Kanonik URL:** `https://metehan-gezer.vercel.app/.well-known/security.txt`
