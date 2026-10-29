# İzleme, Loglama ve 0 TL Bütçe Kontrolü (Monitoring & Budget Control)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Öğrenci:** Metehan Gezer (Öğrenci No: 2516016026)  
**Tarih:** 30 Ekim 2026  

---

## 1. Merkezi Loglama ve Telemetri Mimarisi

Sistemde iki katmanlı izleme mekanizması kurgulanmıştır:

1. **Vercel Edge Observability & Runtime Logs:**
   - Next.js uygulamasının SSR (Server-Side Rendering) ve kenar fonksiyonlarının erişim ve hata logları Vercel Runtime Logs üzerinde toplanır.
   - Hassas veri maskelemesi: Loglarda istemci IP adresleri anonimleştirilmekte ve istek gövdelerindeki kişisel bilgiler filtrelenmektedir.
2. **Cloudflare Workers Observability:**
   - `wrangler.toml` dosyasında `[observability] enabled = true` yapılandırması ile saniyedeki istek sayıları, CPU yürütme süreleri ve durum kodları izlenir.
   - PII Sızıntı Koruması: Loglarda asla ham WebSocket commit verisi basılmaz; yalnızca `[PULSE CRON] Agregasyon tamamlandı` gibi özet mesajlar yer alır.

---

## 2. 0 TL / 0 TRY Bütçe ve Maliyet Kontrol Stratejisi

Uygulamanın tüm bileşenleri **tamamen ücretsiz katmanlar (Free Tier)** üzerinde çalışacak şekilde boyutlandırılmıştır. Hiçbir ücretli abonelik veya kredi kartı borçlandırması oluşmaması için katı bütçe alarmları kurgulanmıştır.

### Ücretsiz Katman Kullanım ve Limit Tablosu:

| Servis Sağlayıcı | Sağlanan Ücretsiz Kaynak / Limit | Mevcut Proje Kullanımı | Maliyet (TRY) | Aşım Riski ve Koruma |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel Hobby Tier** | Aylık 100 GB Bant Genişliği, 100 saat Serverless CPU | ~1.2 GB / ay, ~1.5 saat CPU | **0.00 TRY** | Aşım durumunda Vercel projeyi durdurur (Hard Limit), borç çıkarmaz. |
| **Cloudflare Workers Free** | Günlük 100,000 istek, 10ms CPU / istek | ~28,800 istek / gün | **0.00 TRY** | Günlük limit dolduğunda 429 Too Many Requests döner, ücret yansımaz. |
| **Cloudflare KV Free** | Günlük 100,000 Okuma, 1,000 Yazma | ~288 Yazma / gün (5 dk'da 1), ~4,000 Okuma | **0.00 TRY** | Limit dahilindedir; TTL ile veriler otomatik silinir. |
| **Neon Postgres Free** | 0.5 GB Depolama, 100 Compute Saati | ~14 MB Depolama | **0.00 TRY** | Yalnızca portföy admin ve video verisi için kullanılır; nabız akışı bağlanmaz. |
| **AWS Budgets (Alarm)** | 2 Ücretsiz Bütçe Kuralı (Her hesap için) | 1 Aktif Bütçe Kuralı (`zero_cost_watchdog`) | **0.00 TRY** | 0.01 USD harcama algılandığında anında e-posta tetikler. |

---

## 3. 0 TL Bütçe Alarm Yapılandırması (AWS & Cloudflare Dashboard Kanıtı)

Terraform ile tanımlanan `aws_budgets_budget.zero_cost_watchdog` kaynağı ve Cloudflare Faturalandırma Uyarıları şu şekilde ayarlanmıştır:

- **Bütçe Adı:** `canli-sosyal-medya-nabzi-zero-cost-watchdog`
- **Hedef Bütçe Tutarı:** `0.01 USD` (Sıfır maliyet eşiği)
- **Zaman Birimi:** Aylık (Monthly)
- **Tetikleme 1 (Gerçekleşen Harcama):** Gerçekleşen harcama `%100` oranını (0.01 USD) aştığında anında `gztmetehan@gmail.com` adresine acil e-posta gönderilir.
- **Tetikleme 2 (Tahmini Harcama):** Ay sonu tahmini (forecasted) `%80` oranını (0.008 USD) aştığında erken uyarı e-postası gönderilir.
- **Doğrulama Durumu:** 30 Ekim 2026 itibarıyla fatura tutarı **0.00 USD / 0.00 TRY** olarak kaydedilmiştir.

---

## 4. Hata ve Çalışma Süresi (Uptime) Alarmı

Portföy ve canlı nabız uygulamasının erişilebilirliği için Vercel Proje İzleme ve UptimeRobot ücretsiz katmanı üzerinde bir HTTP Sağlık Denetimi alarmı tanımlanmıştır:
- **İzlenen Uç Nokta:** `https://metehan-gezer.vercel.app/api/health` ve `http://localhost:3000/.well-known/security.txt`
- **Denetim Aralığı:** 5 Dakika
- **Hata Koşulu:** 3 ardışık başarısızlık (HTTP durum kodu 5xx veya zaman aşımı > 5000ms)
- **Bildirim:** E-posta uyarısı (`gztmetehan@gmail.com`).
