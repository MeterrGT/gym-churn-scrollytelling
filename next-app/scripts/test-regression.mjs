import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;
loadEnvConfig(process.cwd());

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

async function runRegressionTests() {
  console.log('=== METEHAN GEZER PORTFOLYO & BVA 2205 REGRESYON TESTLERİ ===\n');
  let passedCount = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`  [BAŞARILI] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [BAŞARISIZ] ${testName}`);
      throw new Error(`Test başarısız: ${testName}`);
    }
  }

  // 1. FOOTER KONTROLÜ
  console.log('[1] Footer İzolasyon ve Doğruluk Kontrolü:');
  const footerPath = path.join(process.cwd(), 'src', 'components', 'Footer.tsx');
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  const portfolioDataPath = path.join(process.cwd(), 'src', 'data', 'portfolio.ts');
  const portfolioDataContent = fs.readFileSync(portfolioDataPath, 'utf8');

  assert(!footerContent.includes("Bu scrollytelling projesi Kaggle"), 'Genel portfolyo footer dosyasında Gym Churn veri seti metni bulunmamalıdır.');
  assert(footerContent.includes("PORTFOLIO_DATA.personal.university") || footerContent.includes("Manisa Celal Bayar"), 'Genel footer üniversite bilgisini içermelidir.');
  assert(footerContent.includes("PORTFOLIO_DATA.personal.brandFirst") && portfolioDataContent.includes("Metehan Gezer"), 'Genel footer Metehan Gezer portfolyo aidiyetini içermelidir.');

  const gymChurnPath = path.join(process.cwd(), 'src', 'app', 'gym-churn', 'page.tsx');
  const gymChurnContent = fs.readFileSync(gymChurnPath, 'utf8');
  assert(gymChurnContent.includes("Bu scrollytelling projesi Kaggle"), 'Gym Churn sayfasında projeye özel veri seti beyanı bulunmalıdır.');
  assert(!gymChurnContent.includes("Â©"), 'Gym Churn sayfasında karakter kodlama hatası (Â©) bulunmamalıdır.');

  // 2. YAYINDAKİ VİDEO FİLTRESİ VE BOŞ DURUM
  console.log('\n[2] Veritabanı Video Filtresi & Boş Durum (Empty State) Kontrolü:');
  async function executeWithRetry(queryFn, retries = 4) {
    for (let i = 0; i < retries; i++) {
      try {
        return await queryFn();
      } catch (e) {
        if (i === retries - 1) throw e;
        console.log(`  (Veritabanı bağlantısı tekrar deneniyor... ${i + 1}/${retries})`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  if (sql) {
    const rawAllValid = await executeWithRetry(() => sql`
      SELECT id, baslik, video_url, yayinda
      FROM videolar
      WHERE yayinda = true
        AND video_url IS NOT NULL
        AND TRIM(video_url) != ''
        AND video_url NOT ILIKE '%example.com%'
        AND video_url NOT ILIKE '%example.org%'
    `);
    assert(rawAllValid.length === 0, 'Canlı veritabanındaki 9 test videosunun hiçbiri geçerli URL içermediğinden filtreden elenmelidir (0 dönmelidir).');
  } else {
    console.log('  [BİLGİ] DATABASE_URL ortam değişkeni bulunamadı. Çevrimdışı / CI ortamında canlı veritabanı sorgusu atlandı.');
  }

  const videosSecPath = path.join(process.cwd(), 'src', 'components', 'VideosSection.tsx');
  const videosSecContent = fs.readFileSync(videosSecPath, 'utf8');
  assert(videosSecContent.includes('Henüz yayımlanmış video yok.'), 'VideosSection bileşeninde dürüst ve şık boş durum (Henüz yayımlanmış video yok.) bulunmalıdır.');
  assert(videosSecContent.includes('Öne Çıkanlar'), 'VideosSection bileşeninde "Öne Çıkanlar" başlık rozeti korunmalıdır.');

  // 3. GYM CHURN VERİ HESAPLAMALARI DOĞRULAMASI
  console.log('\n[3] Gym Churn İstatistiksel Veri Hesaplamaları Doğrulaması:');
  const summaryMetricsPath = path.join(process.cwd(), 'public', 'data', 'churn_summary_metrics.json');
  const summaryMetrics = JSON.parse(fs.readFileSync(summaryMetricsPath, 'utf8'));
  assert(summaryMetrics.total_observations === 4000, 'Toplam gözlem sayısı 4.000 olmalıdır.');
  assert(summaryMetrics.overall_churn_count === 1061, 'Terk eden gözlem sayısı 1.061 olmalıdır.');
  assert(summaryMetrics.overall_churn_percentage === 26.5, 'Genel terk oranı %26,5 olmalıdır.');
  assert(summaryMetrics.contract_1m_churn_percentage === 42.3, '1 Aylık sözleşme terk oranı %42,3 olmalıdır.');
  assert(summaryMetrics.contract_6m_churn_percentage === 12.5, '6 Aylık sözleşme terk oranı %12,5 olmalıdır.');
  assert(summaryMetrics.contract_12m_churn_percentage === 2.4, '12 Aylık sözleşme terk oranı %2,4 olmalıdır.');
  assert(summaryMetrics.contract_delta_1m_vs_12m_pp === 39.9, '1 Ay vs 12 Ay farkı 39,9 yüzde puanı olmalıdır.');
  assert(summaryMetrics.peak_risk_segment.churn_percentage === 78.2, 'Zirve risk (18-25 & 1 Ay) %78,2 olmalıdır.');
  assert(summaryMetrics.lowest_churn_segment.churn_percentage === 0.0, 'En düşük terk segmenti (34+ & 12 Ay) %0,0 olmalıdır.');

  // 4. METEHAN GEZER KİŞİSEL PORTFOLYO METADATA KONTROLÜ
  console.log('\n[4] Site Kimliği ve Portfolyo Metadata Kontrolü:');
  const layoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  assert(layoutContent.includes('Metehan Gezer'), 'Kök layout başlığı Metehan Gezer ismini taşımalıdır.');
  assert(!layoutContent.includes('title: "Sadakatin Bedeli: Spor Salonları Üyelerini Neden Kaybediyor?'), 'Kök layout OpenGraph başlığı sadece Gym Churn projesine ait olmamalıdır.');

  const gymLayoutPath = path.join(process.cwd(), 'src', 'app', 'gym-churn', 'layout.tsx');
  assert(fs.existsSync(gymLayoutPath), 'gym-churn rotası kendi özel layout ve metadata dosyasına sahip olmalıdır.');

  // 5. SAYFA DURUMLARI (404, ERROR, LOADING)
  console.log('\n[5] Sayfa Durumları (404, Error, Loading) Kontrolü:');
  assert(fs.existsSync(path.join(process.cwd(), 'src', 'app', 'not-found.tsx')), 'src/app/not-found.tsx mevcut olmalıdır.');
  assert(fs.existsSync(path.join(process.cwd(), 'src', 'app', 'error.tsx')), 'src/app/error.tsx mevcut olmalıdır.');
  assert(fs.existsSync(path.join(process.cwd(), 'src', 'app', 'loading.tsx')), 'src/app/loading.tsx mevcut olmalıdır.');

  console.log(`\n=== TÜM REGRESYON TESTLERİ TAMAMLANDI (${passedCount}/${totalTests} BAŞARILI) ===`);
}

runRegressionTests().catch((err) => {
  console.error('\nRegresyon test hatası:', err.message);
  process.exit(1);
});
