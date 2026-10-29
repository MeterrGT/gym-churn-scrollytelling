import { neon } from '@neondatabase/serverless';
import nextEnvPkg from '@next/env';

const { loadEnvConfig } = nextEnvPkg.default || nextEnvPkg;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

async function testQueries() {
  console.log('=== GÖREV 3.1: 10 dakikadan kısa ve 1000 izlenmeden fazla videolar ===');
  const q31 = await sql`
    SELECT id, baslik, sure_dk, izlenme
    FROM videolar
    WHERE sure_dk < 10
      AND izlenme > 1000
    ORDER BY id;
  `;
  console.table(q31);

  console.log('=== GÖREV 3.2: En çok izlenen 5 video ===');
  const q32 = await sql`
    SELECT id, baslik, izlenme
    FROM videolar
    ORDER BY izlenme DESC
    LIMIT 5;
  `;
  console.table(q32);

  console.log('=== GÖREV 3.3: Toplam tahmini izlenme süresi (saat) ===');
  const q33 = await sql`
    SELECT SUM(sure_dk * izlenme) / 60.0 AS toplam_izlenme_saati
    FROM videolar;
  `;
  console.table(q33);

  console.log('=== GÖREV 3.4: Her oynatma listesinde kaç video var? (LEFT JOIN) ===');
  const q34 = await sql`
    SELECT
      ol.ad AS oynatma_listesi,
      COUNT(v.id) AS video_sayisi
    FROM oynatma_listeleri ol
    LEFT JOIN videolar v ON v.kategori_id = ol.id
    GROUP BY ol.id, ol.ad
    ORDER BY ol.id;
  `;
  console.table(q34);

  console.log('=== GÖREV 3.5: Öğrenci numarasını ILIKE ile bul (2516016026) ===');
  const q35 = await sql`
    SELECT id, baslik
    FROM videolar
    WHERE baslik ILIKE '%2516016026%';
  `;
  console.table(q35);

  console.log('=== GÖREV 3.6: Video adresi boş olan kayıtların önizlemesi ===');
  const q36 = await sql`
    SELECT id, baslik, video_url, yayinda
    FROM videolar
    WHERE video_url IS NULL
       OR TRIM(video_url) = ''
    ORDER BY id;
  `;
  console.table(q36);

  console.log('=== GÖREV 3.7: Silme koşulu eşleşenleri önizle (izlenme < 10 AND 1 yıldan eski) ===');
  const q37 = await sql`
    SELECT id, baslik, izlenme, yayin_tarihi
    FROM videolar
    WHERE izlenme < 10
      AND yayin_tarihi < CURRENT_DATE - INTERVAL '1 year';
  `;
  console.table(q37);

  console.log('=== GÖREV 3.8: Son 7 gündeki işlem türüne göre denetim kaydı sayıları ===');
  const q38 = await sql`
    SELECT islem, COUNT(*) AS islem_sayisi
    FROM islem_kayitlari
    WHERE zaman >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    GROUP BY islem
    ORDER BY islem_sayisi DESC;
  `;
  console.table(q38);
}

testQueries().catch(console.error);
