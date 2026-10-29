# Olay Müdahale Kılavuzu: Sızan API Anahtarı ve Kimlik Bilgisi (Incident Response Runbook)

**Proje:** Canlı Sosyal Medya Nabzı (MeterrGT/gym-churn-scrollytelling)  
**Doküman Kodu:** IR-RUNBOOK-01  
**Kapsam:** Sızan API Belirteci, Veritabanı Parolası veya Bulut Kimlik Bilgisi  
**Sorumlu:** Metehan Gezer (2516016026) — Güvenlik Yöneticisi  
**Hedef Müdahale Süresi:** İptal (Revocation) < 15 Dakika | İnceleme < 24 Saat  

---

## Aşama 1: Tespit ve Alarm (Detect & Triage)
- **Tetikleyiciler:** GitHub Secret Scanning uyarısı, Gitleaks CI hatası, harici güvenlik araştırmacısı bildirimi (`/.well-known/security.txt` üzerinden), olağandışı Cloudflare/Neon trafik artışı.
- **İlk Eylem:**
  1. Alarmı veren belirtecin türünü (Neon DB URL, Cloudflare API Token, Vercel Token) tespit et.
  2. Depodaki commit karma kodunu (`git log -S "<LEAKED_STRING>"`) ve sızıntının halka açık (public) olup olmadığını doğrula.

---

## Aşama 2: Anında İptal (Revoke)
*Sızıntı doğrulandığı an hiçbir kod düzeltmesi beklemeden anahtarı geçersiz kıl:*
- **Neon Postgres:** Neon Console > Project Settings > Reset Password butonuna basarak eski veritabanı parolasını DERHAL geçersiz kıl.
- **Cloudflare API Token:** Cloudflare Dashboard > My Profile > API Tokens > İlgili belirteci bul ve **"Roll"** veya **"Delete"** seçeneğini seç.
- **GitHub PAT / SSH Key:** GitHub Settings > Developer Settings > İlgili token'ı **"Revoke"** et.

---

## Aşama 3: Yeni Anahtar Üretimi ve Rotasyon (Rotate)
1. İlgili bulut platformunda **en az yetkili (least-privilege)** yeni bir belirteç üret.
2. Yeni gizli anahtarı yerel bilgisayara veya koda YAZMA; doğrudan Vercel Dashboard (`Settings > Environment Variables`) veya GitHub Repository Secrets alanına güvenli olarak gir.
3. Uygulamayı yeni ortam değişkeniyle yeniden derle ve dağıt (`Redeploy`).

---

## Aşama 4: Adli Bilişim ve İnceleme (Investigate)
1. **Zaman Aralığı Analizi:** Anahtarın depoya girdiği commit zamanı ile iptal edildiği an arasındaki zaman penceresini (T_leak - T_revoke) belirle.
2. **Erişim Logu Taraması:**
   - Neon/Postgres `islem_kayitlari` ve query loglarını tara: Bilinmeyen IP adreslerinden sorgu çalıştırıldı mı?
   - Cloudflare ve Vercel erişim loglarını incele: Beklenmeyen coğrafyalardan gelen API çağrıları var mı?

---

## Aşama 5: Etki ve Sızıntı Değerlendirmesi (Assess Exposure)
- **Canlı Nabız Modülü Açısından:** Canlı sosyal medya nabzı veri saklamadığı (zero-retention) için bu akış üzerinden hiçbir kişisel veri sızamaz.
- **BVA 2205 Veritabanı Açısından:** Neon DB erişimi sağlandıysa, `iletisim_mesajlari` tablosunun okunup okunmadığını adli loglardan kontrol et.

---

## Aşama 6: Bildirim ve Raporlama (Notify)
1. **İç Bildirim:** Proje yürütücüsü ve ders sorumlusuna olay özeti iletilir.
2. **Yasal Bildirim (KVKK Md. 12/5):** Eğer iletişim tablosundaki isim/eposta gibi gerçek kişisel verilerin ele geçirildiği somut olarak tespit edilirse, 72 saat içinde Kişisel Verileri Koruma Kurumu'na (KVKK) veri ihlali bildirimi yapılır. (Sadece anonim sayaç anahtarı sızdıysa KVKK bildirimi gerekmez).

---

## Aşama 7: Temizlik, İyileştirme ve Kök Neden Analizi (Recovery & Post-Mortem)
1. **Git Geçmişinden Temizleme:** Hassas anahtar `git push` ile depoya girdiyse, `git-filter-repo` veya BFG Repo-Cleaner kullanılarak commit geçmişi yeniden yazılır.
2. **Kök Neden:** Gitleaks pre-commit kancalarının neden çalışmadığı analiz edilir.
3. **Önleyici Tedbir:** Depo düzeyinde GitHub Secret Scanning ve Push Protection kuralları zorunlu hale getirilir.
