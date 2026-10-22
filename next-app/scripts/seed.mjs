import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';
import bcrypt from 'bcryptjs';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;

// Mevcut dizindeki ortam değişkenlerini (.env.local vb.) güvenle yükle
loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Hata: DATABASE_URL ortam değişkeni bulunamadı. Lütfen .env.local dosyasını yapılandırın.');
  process.exit(1);
}

const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword || typeof adminPassword !== 'string' || adminPassword.trim().length === 0) {
  console.error('Hata: ADMIN_PASSWORD ortam değişkeni tanımlanmalıdır. Tohumlama (seed) işlemi güvenli şekilde durduruldu.');
  console.error('Kullanım örneği:');
  console.error('  PowerShell: $env:ADMIN_PASSWORD="..."; npm run seed');
  console.error('  Bash      : ADMIN_PASSWORD="..." npm run seed');
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  console.log('--- BVA 2205 Veritabanı Başlatma & Yönetici Tohumlama (Seed) ---');

  const adminEmail = process.env.ADMIN_EMAIL || 'gztmetehan@gmail.com';

  // Şifreyi bcrypt ile hash'le (saltRounds = 12). Düz metin şifre asla saklanmaz.
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  // Mevcut yönetici var mı kontrol et
  const existingAdmins = await sql`
    SELECT id, eposta FROM yoneticiler WHERE LOWER(eposta) = ${adminEmail.toLowerCase()}
  `;

  if (existingAdmins.length === 0) {
    const inserted = await sql`
      INSERT INTO yoneticiler (eposta, sifre_hash, olusturma)
      VALUES (${adminEmail}, ${passwordHash}, NOW())
      RETURNING id, eposta
    `;
    console.log(`[+] Yönetici başarıyla eklendi: ID=${inserted[0].id}, E-posta=${inserted[0].eposta}`);
  } else {
    // Şifre hash'ini güncelle
    await sql`
      UPDATE yoneticiler
      SET sifre_hash = ${passwordHash}
      WHERE id = ${existingAdmins[0].id}
    `;
    console.log(`[+] Mevcut yönetici şifre hash'i güncellendi: ID=${existingAdmins[0].id}, E-posta=${existingAdmins[0].eposta}`);
  }

  // İletişim mesajları tablosunu kontrol et
  const messageCount = await sql`SELECT count(*)::int AS count FROM iletisim_mesajlari`;
  if (messageCount[0].count === 0) {
    console.log('[*] iletisim_mesajlari tablosu boş. Test amaçlı örnek mesajlar ekleniyor...');
    await sql`
      INSERT INTO iletisim_mesajlari (ad_soyad, eposta, mesaj, kvkk_onay, okundu, gonderim_zamani)
      VALUES 
        ('Dr. Ahmet Yılmaz', 'ahmet.yilmaz@cbu.edu.tr', 'Merhaba Metehan, Gym Churn veri hikayesi projenin görselleştirmelerini çok beğendim. Akademik sunum tarihi hakkında görüşelim.', true, false, NOW() - INTERVAL '2 hours'),
        ('Zeynep Kaya', 'zeynep.kaya@techcorp.com.tr', 'Portfolyonuzdaki ekonometrik fiyat tahminleme modelini inceledik. Staj imkanlarımız için sizinle tanışmak isteriz.', true, false, NOW() - INTERVAL '1 day'),
        ('Mehmet Demir', 'mehmet.demir@veri.io', 'BVA 2205 dönem projeniz için tebrikler. Neon PostgreSQL entegrasyonu gayet başarılı görünüyor.', true, true, NOW() - INTERVAL '3 days')
    `;
    console.log('[+] 3 adet örnek iletişim mesajı (2 okunmamış, 1 okunmuş) eklendi.');
  } else {
    console.log(`[*] iletisim_mesajlari tablosunda ${messageCount[0].count} kayıt mevcut.`);
  }

  console.log('\n--- Yönetici Tohumlama Tamamlandı ---');
  console.log(`E-posta : ${adminEmail}`);
  console.log('Şifre   : [process.env.ADMIN_PASSWORD ile hash\'lendi, düz metin yazdırılmaz]');
  console.log('------------------------------------');
}

main().catch((err) => {
  console.error('Seed hatası:', err instanceof Error ? err.message : 'Bilinmeyen hata');
  process.exit(1);
});

