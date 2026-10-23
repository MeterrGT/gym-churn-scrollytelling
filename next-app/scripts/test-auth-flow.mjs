import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;

// Mevcut dizindeki ortam değişkenlerini (.env.local vb.) güvenle yükle
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Hata: DATABASE_URL bulunamadı. Lütfen .env.local dosyasını yapılandırın.');
  process.exit(1);
}

const sql = neon(connectionString);

async function runTests() {
  console.log('=== BVA 2205 AŞAMA 1 TEST DOĞRULAMASI ===\n');

  // 1. İzole bcrypt hash & doğrulama testi (Rastgele üretilen geçici şifre ile)
  console.log('1. TEST: İzole bcrypt hashleme ve karşılaştırma doğrulaması...');
  const tempTestPassword = crypto.randomBytes(16).toString('hex');
  const tempTestHash = await bcrypt.hash(tempTestPassword, 10);
  const tempMatch = await bcrypt.compare(tempTestPassword, tempTestHash);
  const tempMismatch = await bcrypt.compare(tempTestPassword + '_yanlis', tempTestHash);
  if (!tempMatch || tempMismatch) {
    throw new Error('İzole bcrypt algoritma testi başarısız!');
  }
  console.log('  [BAŞARILI] bcrypt.hash ve bcrypt.compare algoritması beklendiği gibi çalışıyor.');

  // 2. Veritabanı ve Yönetici Kayıt Kontrolü
  console.log('\n2. TEST: Yönetici tablosu ve bcrypt şifre hash formatı doğrulaması...');
  const adminEmail = process.env.ADMIN_EMAIL || 'gztmetehan@gmail.com';
  const admins = await sql`SELECT id, eposta, sifre_hash FROM yoneticiler WHERE eposta = ${adminEmail}`;
  if (admins.length === 0) {
    throw new Error(`Yönetici kullanıcısı bulunamadı (${adminEmail})!`);
  }
  const admin = admins[0];
  if (!admin.sifre_hash || (!admin.sifre_hash.startsWith('$2a$') && !admin.sifre_hash.startsWith('$2b$'))) {
    throw new Error('Şifre bcrypt hash formatında değil! Düz metin şifre saklanamaz.');
  }
  console.log('  [BAŞARILI] Yönetici şifresi geçerli bir bcrypt hash formatında saklanıyor (asla düz metin değil).');

  // 3. Yanlış şifre denemesi
  console.log('\n3. TEST: Yanlış şifre ile doğrulama...');
  const wrongMatch = await bcrypt.compare('GecersizSifreDenemesi_12345!', admin.sifre_hash);
  if (wrongMatch) {
    throw new Error('Yanlış şifre doğrulandı, hata!');
  }
  console.log('  [BAŞARILI] Yanlış şifre güvenle reddedildi.');

  // 4. Doğru şifre entegrasyon denemesi (process.env.ADMIN_PASSWORD ile)
  console.log('\n4. TEST: Mevcut yönetici entegrasyon doğrulaması (process.env.ADMIN_PASSWORD)...');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || typeof adminPassword !== 'string' || adminPassword.trim().length === 0) {
    console.log('  [ATLANDI] ADMIN_PASSWORD ortam değişkeni tanımlanmadığı için canlı giriş denemesi atlandı.');
    console.log('  (Canlı şifre testi çalıştırmak için: $env:ADMIN_PASSWORD="..."; npm run test:auth)');
  } else {
    const rightMatch = await bcrypt.compare(adminPassword, admin.sifre_hash);
    if (!rightMatch) {
      throw new Error('Tanımlanan ADMIN_PASSWORD ile veritabanındaki yönetici şifre hash\'i uyuşmadı!');
    }
    console.log('  [BAŞARILI] ADMIN_PASSWORD ortam değişkeni ile yönetici kimliği bcrypt üzerinden başarıyla doğrulandı.');
  }

  // 5. Oturum token oluşturma & veritabanı oturumlar tablosuna kaydetme
  console.log('\n5. TEST: 32 baytlık kriptografik token ve 2 saatlik oturum oluşturma...');
  const testToken = crypto.randomBytes(32).toString('hex');
  if (testToken.length !== 64) {
    throw new Error('Token 32 bayt hex (64 karakter) değil!');
  }
  const twoHoursLater = new Date(Date.now() + 2 * 60 * 60 * 1000);
  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis)
    VALUES (${testToken}, ${admin.id}, ${twoHoursLater.toISOString()})
  `;
  console.log('  [BAŞARILI] Kriptografik oturum tokenı üretildi ve oturumlar tablosuna kaydedildi.');

  // 6. Oturum doğrulama sorgusu
  console.log('\n6. TEST: Aktif oturumun veritabanından sorgulanması...');
  const activeSessions = await sql`
    SELECT o.token, o.bitis, y.id, y.eposta
    FROM oturumlar o
    JOIN yoneticiler y ON o.yonetici_id = y.id
    WHERE o.token = ${testToken}
      AND o.bitis > NOW()
  `;
  if (activeSessions.length !== 1) {
    throw new Error('Oturum doğrulanamadı!');
  }
  console.log('  [BAŞARILI] Aktif oturum doğrulandı: Yönetici =', activeSessions[0].eposta);

  // 7. Okunmamış iletişim mesajları sorgusu
  console.log('\n7. TEST: iletisim_mesajlari okunmamış mesaj sayısı sorgusu...');
  const unreadCountResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM iletisim_mesajlari
    WHERE okundu = false
  `;
  const unreadCount = Number(unreadCountResult[0].count);
  console.log(`  [BAŞARILI] Okunmamış mesaj sayısı parametreli sorguyla okundu: ${unreadCount}`);

  // 8. Oturum sonlandırma (Logout)
  console.log('\n8. TEST: Oturumun veritabanından silinmesi (Logout)...');
  await sql`DELETE FROM oturumlar WHERE token = ${testToken}`;
  const afterLogout = await sql`
    SELECT * FROM oturumlar WHERE token = ${testToken}
  `;
  if (afterLogout.length !== 0) {
    throw new Error('Oturum silinemedi!');
  }
  console.log('  [BAŞARILI] Oturum veritabanından başarıyla silindi.');

  console.log('\n=== TÜM BİRİM & VERİTABANI TESTLERİ EKSİKSİZ GEÇTİ ===');
}

runTests().catch((err) => {
  console.error('Test hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
  process.exit(1);
});
