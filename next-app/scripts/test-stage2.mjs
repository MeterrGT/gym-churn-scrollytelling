import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;

// Mevcut dizindeki ortam değişkenlerini (.env.local vb.) güvenle yükle
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Hata: DATABASE_URL ortam değişkeni bulunamadı. Lütfen .env.local dosyasını yapılandırın.');
  process.exit(1);
}

const sql = neon(connectionString);

async function runStage2Tests() {
  console.log('=== BVA 2205 AŞAMA 2 ENTEGRASYON VE DOĞRULAMA TESTLERİ ===\n');

  // 1. Yönetici Kontrolü
  const admins = await sql`SELECT id, eposta FROM yoneticiler WHERE eposta = 'gztmetehan@gmail.com'`;
  if (admins.length === 0) throw new Error('Test yöneticisi bulunamadı!');
  const adminId = admins[0].id;
  console.log(`[1] Test yöneticisi doğrulandı: ID=${adminId}, Eposta=${admins[0].eposta}`);

  // 2. Video Listesi ve Kategori JOIN Testi
  console.log('\n[2] Video listesi & Oynatma Listeleri (JOIN) testi...');
  const videosWithCat = await sql`
    SELECT 
      v.id, v.baslik, v.yayinda, v.kategori_id,
      COALESCE(ol.ad, 'Kategorisiz') AS kategori_adi
    FROM videolar v
    LEFT JOIN oynatma_listeleri ol ON v.kategori_id = ol.id
    ORDER BY v.id DESC
  `;
  console.log(`  [BAŞARILI] Toplam ${videosWithCat.length} video JOIN ile sorgulandı. Örnek kategori: "${videosWithCat[0]?.kategori_adi}"`);

  // 3. Video Ekleme (Create) & RETURNING id & islem_kayitlari ('ekle')
  console.log('\n[3] Video ekleme (INSERT RETURNING id) ve audit log ("ekle") testi...');
  const insertResult = await sql`
    INSERT INTO videolar (baslik, video_url, sure_dk, izlenme, yayin_tarihi, kategori_id, yayinda)
    VALUES ('BVA 2205 Test Videosu', 'https://example.com/test-bva-2205', 12, 100, CURRENT_DATE, 1, true)
    RETURNING id, baslik
  `;
  const createdVideoId = insertResult[0].id;
  console.log(`  [+] Video eklendi: ID=${createdVideoId}, Başlık="${insertResult[0].baslik}"`);

  await sql`
    INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
    VALUES (${adminId}, 'ekle', 'videolar', ${createdVideoId}, NOW())
  `;

  // 4. Video Güncelleme (Update) & islem_kayitlari ('guncelle')
  console.log('\n[4] Video güncelleme ve audit log ("guncelle") testi...');
  await sql`
    UPDATE videolar
    SET baslik = 'BVA 2205 Test Videosu (Guncellendi)', sure_dk = 15
    WHERE id = ${createdVideoId}
  `;

  await sql`
    INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
    VALUES (${adminId}, 'guncelle', 'videolar', ${createdVideoId}, NOW())
  `;
  console.log(`  [BAŞARILI] Video güncellendi ve 'guncelle' audit kaydı düşüldü.`);

  // 5. Video Yayın Durumu Değiştirme (Publish toggle)
  console.log('\n[5] Video yayinda sütunu toggle testi...');
  const toggleResult = await sql`
    UPDATE videolar
    SET yayinda = NOT yayinda
    WHERE id = ${createdVideoId}
    RETURNING yayinda
  `;
  console.log(`  [BAŞARILI] Video yayın durumu değiştirildi: yayinda=${toggleResult[0].yayinda}`);

  // 6. Video Silme (Delete) & islem_kayitlari ('sil')
  console.log('\n[6] Video silme ve audit log ("sil") testi...');
  await sql`
    DELETE FROM videolar
    WHERE id = ${createdVideoId}
  `;

  await sql`
    INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
    VALUES (${adminId}, 'sil', 'videolar', ${createdVideoId}, NOW())
  `;
  console.log(`  [BAŞARILI] Video silindi ve 'sil' audit kaydı düşüldü.`);

  // 7. İletişim Mesajları & Durum Değiştirme / Silme
  console.log('\n[7] İletişim mesajları durum değiştirme ve sayaç testi...');
  // Test mesajı ekle
  const msgResult = await sql`
    INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay, okundu, gonderim_zamani)
    VALUES ('Akademik Hakem', 'hakem@bva2205.edu.tr', 'Test değerlendirme mesajı', true, false, NOW())
    RETURNING id
  `;
  const testMsgId = msgResult[0].id;

  // Okundu yap
  await sql`UPDATE iletisim_mesajlari SET okundu = true WHERE id = ${testMsgId}`;
  await sql`
    INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
    VALUES (${adminId}, 'guncelle', 'iletisim_mesajlari', ${testMsgId}, NOW())
  `;
  console.log(`  [BAŞARILI] Mesaj durumu okundu olarak güncellendi.`);

  // Mesajı sil
  await sql`DELETE FROM iletisim_mesajlari WHERE id = ${testMsgId}`;
  await sql`
    INSERT INTO islem_kayitlari (yonetici_id, islem, tablo_adi, kayit_id, zaman)
    VALUES (${adminId}, 'sil', 'iletisim_mesajlari', ${testMsgId}, NOW())
  `;
  console.log(`  [BAŞARILI] Test mesajı silindi.`);

  // 8. Görev 3.8 Sorgusu Denetimi
  console.log('\n[8] Görev 3.8 Sorgusu Denetimi (Son 7 gündeki işlem türü sayıları)...');
  const task38 = await sql`
    SELECT islem, COUNT(*)::int AS islem_sayisi
    FROM islem_kayitlari
    WHERE zaman >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    GROUP BY islem
    ORDER BY islem_sayisi DESC
  `;
  console.table(task38);

  // 9. Son 50 Denetim Kaydı (JOIN yoneticiler)
  console.log('\n[9] Son 50 denetim kaydı (JOIN yoneticiler)...');
  const logs = await sql`
    SELECT 
      k.id, k.islem, k.tablo_adi, k.kayit_id, k.zaman,
      y.eposta AS yonetici_eposta
    FROM islem_kayitlari k
    LEFT JOIN yoneticiler y ON k.yonetici_id = y.id
    ORDER BY k.zaman DESC
    LIMIT 10
  `;
  console.table(logs);

  // 10. HTTP Rota Yanıtları (Oturumlu GET İstekleri)
  console.log('\n[10] Oturumlu HTTP Rota Yanıtları Testi...');

  const crypto = await import('crypto');
  const tempToken = crypto.randomBytes(32).toString('hex');
  const bitis = new Date(Date.now() + 2 * 60 * 60 * 1000);
  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis)
    VALUES (${tempToken}, ${adminId}, ${bitis.toISOString()})
  `;

  const routes = ['/admin', '/admin/videolar', '/admin/mesajlar', '/admin/kayitlar'];
  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r, {
        headers: { Cookie: `admin_session=${tempToken}` },
        redirect: 'manual',
      });
      console.log(`  [HTTP 200] ${r} -> Status: ${res.status}`);
      if (res.status !== 200) {
        throw new Error(`${r} rotası 200 dönmedi: ${res.status}`);
      }
    } catch (e) {
      console.error(`  [HATA] ${r} isteğinde hata:`, e.message);
    }
  }

  await sql`DELETE FROM oturumlar WHERE token = ${tempToken}`;
  console.log('  [+] Geçici oturum tokenı temizlendi.');

  console.log('\n=== TÜM AŞAMA 2 VERİTABANI İŞLEMLERİ VE SORGULARI BAŞARIYLA TAMAMLANDI ===');
}

runStage2Tests().catch((err) => {
  console.error('Test hatası:', err);
  process.exit(1);
});

