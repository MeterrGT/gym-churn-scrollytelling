import { sql } from '@/lib/db';
import { PortfolioClientHome } from '@/components/PortfolioClientHome';
import { PublicVideo } from '@/components/VideosSection';

export const metadata = {
  title: 'Metehan Gezer | Kişisel Portfolyo & Büyük Veri Analistliği',
  description:
    'Manisa Celal Bayar Üniversitesi Büyük Veri Analistliği öğrencisi Metehan Gezer kişisel portfolyosu, projeleri ve videoları.',
};

export const instant = false;

export default async function HomePage() {
  let allVideos: PublicVideo[] = [];
  let topVideos: PublicVideo[] = [];

  try {
    // 1. Tüm yayındaki geçerli videolar (oynatma_listeleri ile JOIN)
    const rawAll = await sql`
      SELECT 
        v.id,
        v.baslik,
        v.video_url,
        v.sure_dk,
        v.izlenme,
        v.yayin_tarihi,
        COALESCE(ol.ad, 'Genel') AS kategori_adi
      FROM videolar v
      LEFT JOIN oynatma_listeleri ol ON v.kategori_id = ol.id
      WHERE v.yayinda = true
        AND v.video_url IS NOT NULL
        AND TRIM(v.video_url) != ''
        AND v.video_url NOT ILIKE '%example.com%'
        AND v.video_url NOT ILIKE '%example.org%'
      ORDER BY v.yayin_tarihi DESC NULLS LAST, v.id DESC
    `;

    allVideos = rawAll.map((v) => ({
      id: v.id,
      baslik: v.baslik,
      video_url: v.video_url,
      sure_dk: v.sure_dk,
      izlenme: v.izlenme,
      yayin_tarihi: v.yayin_tarihi
        ? typeof v.yayin_tarihi === 'string'
          ? v.yayin_tarihi
          : new Date(v.yayin_tarihi).toISOString()
        : null,
      kategori_adi: v.kategori_adi,
    }));

    // 2. Görev 3.2: En çok izlenen ilk 5 yayındaki geçerli video
    const rawTop = await sql`
      SELECT 
        v.id,
        v.baslik,
        v.video_url,
        v.sure_dk,
        v.izlenme,
        v.yayin_tarihi,
        COALESCE(ol.ad, 'Genel') AS kategori_adi
      FROM videolar v
      LEFT JOIN oynatma_listeleri ol ON v.kategori_id = ol.id
      WHERE v.yayinda = true
        AND v.video_url IS NOT NULL
        AND TRIM(v.video_url) != ''
        AND v.video_url NOT ILIKE '%example.com%'
        AND v.video_url NOT ILIKE '%example.org%'
      ORDER BY v.izlenme DESC NULLS LAST
      LIMIT 5
    `;

    topVideos = rawTop.map((v) => ({
      id: v.id,
      baslik: v.baslik,
      video_url: v.video_url,
      sure_dk: v.sure_dk,
      izlenme: v.izlenme,
      yayin_tarihi: v.yayin_tarihi
        ? typeof v.yayin_tarihi === 'string'
          ? v.yayin_tarihi
          : new Date(v.yayin_tarihi).toISOString()
        : null,
      kategori_adi: v.kategori_adi,
    }));
  } catch (err) {
    if (!(err instanceof Error && err.message.includes('prerendering'))) {
      console.error(
        'Veritabanından videolar çekilirken hata oluştu:',
        err instanceof Error ? err.message : err
      );
    }
  }

  return <PortfolioClientHome allVideos={allVideos} topVideos={topVideos} />;
}
