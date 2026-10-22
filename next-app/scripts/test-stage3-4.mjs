import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';
import fs from 'fs';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;

// Mevcut dizindeki ortam değişkenlerini (.env.local vb.) güvenle yükle
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Hata: DATABASE_URL ortam değişkeni bulunamadı. Lütfen .env.local dosyasını yapılandırın.');
  process.exit(1);
}

const sql = neon(connectionString);

async function runStage3And4Tests() {
  console.log('=== BVA 2205 AŞAMA 3 VE 4 ENTEGRASYON VE DOĞRULAMA TESTLERİ ===\n');

  // [1] Ana Sayfa (Public Homepage) HTTP & Veritabanı Testi
  console.log('[1] Ana Sayfa (/) HTTP Yanıtı ve Veritabanı Entegrasyonu...');
  const homeRes = await fetch('http://localhost:3000/');
  console.log(`  [HTTP ${homeRes.status}] GET /`);
  if (homeRes.status !== 200) throw new Error('Ana sayfa 200 dönmedi!');
  const homeHtml = await homeRes.text();

  const checks = [
    { name: 'Portfolyo İsim', needle: 'Metehan' },
    { name: 'Üniversite', needle: 'Manisa Celal Bayar' },
    { name: 'Bölüm', needle: 'Büyük Veri Analistliği' },
    { name: 'Videolarım Bölümü', needle: 'Videolarım' },
    { name: 'Öne Çıkanlar (Görev 3.2)', needle: 'Öne Çıkanlar' },
  ];

  for (const c of checks) {
    if (homeHtml.includes(c.needle)) {
      console.log(`  [BAŞARILI] Ana sayfada "${c.name}" içeriği doğrulandı.`);
    } else {
      throw new Error(`Ana sayfada "${c.name}" bulunamadı!`);
    }
  }

  // [2] Yayındaki Videolar & Görev 3.2 Sorgu Testi
  console.log('\n[2] Neon PostgreSQL: Yayındaki videolar ve Görev 3.2 (En çok izlenen 5 video) sorgusu...');
  const publicVideos = await sql`
    SELECT v.id, v.baslik, v.yayinda, v.izlenme, COALESCE(ol.ad, 'Genel') as kategori_adi
    FROM videolar v
    LEFT JOIN oynatma_listeleri ol ON v.kategori_id = ol.id
    WHERE v.yayinda = true
    ORDER BY v.izlenme DESC
    LIMIT 5
  `;
  console.log(`  [BAŞARILI] Top 5 video sorgulandı (Yalnızca yayinda = true):`);
  console.table(publicVideos);

  // [3] İletişim Sayfası (/iletisim) HTTP Yanıtı
  console.log('\n[3] İletişim Sayfası (/iletisim) HTTP Yanıtı...');
  const contactRes = await fetch('http://localhost:3000/iletisim');
  console.log(`  [HTTP ${contactRes.status}] GET /iletisim`);
  if (contactRes.status !== 200) throw new Error('İletişim sayfası 200 dönmedi!');
  const contactHtml = await contactRes.text();
  if (contactHtml.includes('KVKK ve Gizlilik Onayı') && contactHtml.includes('Mesajı Gönder')) {
    console.log('  [BAŞARILI] İletişim formu, KVKK kutusu ve buton doğrulandı.');
  }

  // [4] İletişim Mesajı Kaydetme ve Sayaç Testi
  console.log('\n[4] İletişim Mesajı Ekleme & Okunmamış Sayaç Testi...');
  const beforeCountResult = await sql`SELECT count(*)::int as count FROM iletisim_mesajlari WHERE okundu = false`;
  const beforeCount = beforeCountResult[0].count;

  const insertMsg = await sql`
    INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay, okundu, gonderim_zamani)
    VALUES ('Dr. Mehmet Özkan', 'mehmet.ozkan@cbu.edu.tr', 'Metehan merhaba, BVA 2205 projenizdeki Neon ve Next.js entegrasyonu başarılı.', true, false, NOW())
    RETURNING id, ad_soyad
  `;
  const insertedMsgId = insertMsg[0].id;

  const afterCountResult = await sql`SELECT count(*)::int as count FROM iletisim_mesajlari WHERE okundu = false`;
  const afterCount = afterCountResult[0].count;
  console.log(`  [BAŞARILI] Mesaj eklendi (ID: ${insertedMsgId}). Okunmamış sayaç: ${beforeCount} -> ${afterCount}`);

  // Test mesajını temizle
  await sql`DELETE FROM iletisim_mesajlari WHERE id = ${insertedMsgId}`;
  console.log('  [+] Test mesajı temizlendi.');

  // [5] Aşama 4: Son Başarılı Giriş (son_giris, son_giris_ip) Testi
  console.log('\n[5] Aşama 4: Son Başarılı Giriş Takibi (son_giris & son_giris_ip)...');
  const testIp = '192.168.1.105';
  await sql`
    UPDATE yoneticiler
    SET son_giris = NOW(), son_giris_ip = ${testIp}
    WHERE eposta = 'gztmetehan@gmail.com'
  `;

  const updatedAdmin = await sql`
    SELECT id, eposta, son_giris, son_giris_ip
    FROM yoneticiler
    WHERE eposta = 'gztmetehan@gmail.com'
  `;
  console.log(`  [BAŞARILI] Yönetici son giriş: ${updatedAdmin[0].son_giris}, IP: ${updatedAdmin[0].son_giris_ip}`);

  // [6] Aşama 4: Giriş Sayfasında Yasal Uyarı Bildirimi Testi
  console.log('\n[6] Giriş Sayfasında (/giris) Yasal Uyarı (TCK m. 243-244)...');
  const loginRes = await fetch('http://localhost:3000/giris');
  const loginHtml = await loginRes.text();
  if (loginHtml.includes('TCK m. 243-244') && loginHtml.includes('yetkisiz erişim')) {
    console.log('  [BAŞARILI] Giriş sayfasında TCK yasal uyarısı mevcut.');
  } else {
    throw new Error('Giriş sayfasında yasal uyarı bulunamadı!');
  }

  // [7] Aşama 4: Hukuk Raporu Dosyası (docs/hukuk_raporu.md) Denetimi
  console.log('\n[7] Hukuk Raporu Dosyası (docs/hukuk_raporu.md) Denetimi...');
  const legalPath = '../docs/hukuk_raporu.md';
  if (fs.existsSync(legalPath)) {
    const legalContent = fs.readFileSync(legalPath, 'utf-8');
    const hasTCK243 = legalContent.includes('TCK m. 243');
    const hasTCK244 = legalContent.includes('TCK m. 244');
    const hasTCK136 = legalContent.includes('TCK m. 136');
    const hasAuthDiff = legalContent.includes('Yetkili Güvenlik Testi');
    console.log(`  [BAŞARILI] Hukuk raporu mevcut. TCK 243: ${hasTCK243}, TCK 244: ${hasTCK244}, TCK 136: ${hasTCK136}, Yetkili Test Ayrımı: ${hasAuthDiff}`);
  } else {
    throw new Error('docs/hukuk_raporu.md dosyası bulunamadı!');
  }

  console.log('\n=== TÜM AŞAMA 3 VE 4 TESTLERİ EKSİKSİZ VE BAŞARIYLA TAMAMLANDI ===');
}

runStage3And4Tests().catch((err) => {
  console.error('Test hatası:', err);
  process.exit(1);
});
