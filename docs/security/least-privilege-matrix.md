# En Az Yetki Prensibi ve Kimlik Matrisi (Least-Privilege Security Matrix)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Öğrenci:** Metehan Gezer (Öğrenci No: 2516016026)  
**Tarih:** 30 Ekim 2026  

Sistemde rol alan tüm servis hesapları, CI/CD belirteçleri ve altyapı kimlikleri **En Az Yetki Prensibi (Principle of Least Privilege - PoLP)** doğrultusunda yapılandırılmıştır. Hiçbir servis bileşeni gereksiniminden fazla yetkiye sahip değildir.

---

## 1. Servis ve Kimlik Yetki Matrisi

| Kimlik / Servis Hesabı | Platform / Ortam | Atanan Yetkiler / Kapsamlar | Teknik Gerekçe | Yasaklanan / Kısıtlanan Yetkiler |
| :--- | :--- | :--- | :--- | :--- |
| **GitHub Actions CI/CD Botu** | GitHub Workflows (`security-ci.yml`) | `contents: read`, `security-events: write` | Yalnızca kaynak kodları okuma, Gitleaks ve güvenlik denetimlerinin SARIF çıktılarını Security sekmesine yükleme. | Kod gönderme (`contents: write`), repo ayarlarını değiştirme, gizli anahtarları dışa aktarma kesinlikle engellidir. |
| **Cloudflare Worker Uç İşleyici** | Cloudflare Workers & KV | `KV:Read`, `KV:Write` (yalnızca `PULSE_AGGREGATES_KV` namespace) | İstemcilere 1 saatlik önbellek sunma ve 5 dakikalık özetleri 3600s TTL ile yazma. | Cloudflare DNS kayıtlarını değiştirme, hesap genelinde yönetim (`Account:Admin`), Zone SSL ayarlarını kurcalama yasaktır. |
| **Vercel Dağıtım Servisi** | Vercel Deployment | `Deployments:Create`, `Project:Read` | Next.js uygulamasını statik ve serverless kenar fonksiyonu olarak derleme ve sunma. | Takım ve faturalandırma yönetimi, DNS transferi veya proje silme yetkileri verilmemiştir. |
| **Neon PostgreSQL Bağlantısı** | Neon Serverless Postgres | `SELECT`, `INSERT` (yalnızca `islem_kayitlari`, `iletisim_mesajlari`), `UPDATE` (video sayaçları) | Portföy iletişim formu ve video izlenme sayısı artırma işlevleri. Canlı nabız akışı bu DB'ye ASLA bağlanmaz. | `DROP TABLE`, `ALTER SCHEMA`, `SUPERUSER`, veritabanı silme yetkileri kısıtlanmıştır. |
| **Jetstream Akış İstemcisi** | Bluesky Jetstream WebSocket | Salt-okunur WebSocket tüketimi (`wantedCollections=app.bsky.feed.post`) | Yalnızca açık ve anonim gönderi olaylarını canlı dinlemek. | Herhangi bir kullanıcı adına yazma, beğeni atma, takip etme veya kimlik doğrulama gerektirmeyen anonim erişim. |
| **AWS Bütçe Denetleyicisi** | AWS Budgets & SNS | `budgets:ViewBudget`, `budgets:ModifyBudget`, `sns:Publish` | Aylık 0 TL / 0.01 USD harcama sınırını denetlemek ve e-posta bildirimlerini göndermek. | EC2, S3, RDS veya diğer pahalı AWS kaynaklarını başlatma yetkisi (IAM Full Access) kesinlikle verilmemiştir. |

---

## 2. CI/CD İş Akışı En Az Yetki Yapılandırması

GitHub Actions iş akışlarında varsayılan olarak gelen geniş `GITHUB_TOKEN` yetkileri devre dışı bırakılmış ve `.github/workflows/security-ci.yml` dosyasında şu şekilde sınırlandırılmıştır:

```yaml
permissions:
  contents: read           # Yalnızca repodaki kodu çekmek için
  security-events: write   # Gitleaks ve CodeQL SARIF raporlarını yüklemek için
  actions: none
  checks: none
  deployments: none
  issues: none
  packages: none
  pull-requests: none
  repository-projects: none
  statuses: none
```

Bu kısıtlama sayesinde, CI sürecinde çalışan bağımlılıklardan (npm paketleri) herhangi birinde tedarik zinciri saldırısı (supply chain compromise) meydana gelse dahi, saldırgan `GITHUB_TOKEN` belirtecini kullanarak depoya kötü niyetli commit atamaz, pull request oluşturamaz veya sürüm yayınlayamaz.

---

## 3. Gizli Anahtarların (Secrets) İzolasyonu ve Güvenliği

1. **İstemci Kodunda Sıfır Gizli Anahtar:**
   - İstemciye sunulan JavaScript dosyalarında hiçbir API anahtarı, veritabanı şifresi veya Cloudflare API Token yer almaz.
   - `NEXT_PUBLIC_` öneki yalnızca kamusal temas e-postası (`NEXT_PUBLIC_SECURITY_CONTACT`) için kullanılmıştır.
2. **Ortam Değişkenleri:**
   - Hassas değişkenler (`DATABASE_URL`, `ADMIN_PASSWORD`) yalnızca Vercel ve Neon'un güvenli şifreli ortam değişkeni kasasında (Environment Variables Store) tutulur.
   - Loglara ortam değişkenlerinin dökülmesi (environment dump) kod düzeyinde engellenmiştir.
3. **Gitleaks İle Sürekli Tarama:**
   - Her commit ve pull request öncesinde Gitleaks kural seti çalıştırılarak yanlışlıkla dahi olsa hiçbir kimlik bilgisinin depoya girmesine izin verilmez.
