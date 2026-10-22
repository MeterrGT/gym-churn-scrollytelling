import { validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminNav from '../AdminNav';
import VideoManager, { Category, VideoItem } from './VideoManager';

export const metadata = {
  title: 'Video Yönetimi | Metehan Gezer',
  description: 'BVA 2205 Veritabanı Portfolyo Video Yönetim Paneli',
};

export const instant = false;

export default async function VideolarPage() {
  const session = await validateSession();
  if (!session) {
    redirect('/giris');
  }

  // 1. Okunmamış mesaj sayısını nav için al
  const unreadCountResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM iletisim_mesajlari
    WHERE okundu = false
  `;
  const unreadCount = Number(unreadCountResult[0]?.count ?? 0);

  // 2. Videolar listesini oynatma_listeleri ile JOIN yaparak çek
  const rawVideos = await sql`
    SELECT 
      v.id,
      v.baslik,
      v.video_url,
      v.sure_dk,
      v.izlenme,
      v.yayin_tarihi,
      v.yayinda,
      v.kategori_id,
      v.olusturma,
      COALESCE(ol.ad, 'Kategorisiz') AS kategori_adi
    FROM videolar v
    LEFT JOIN oynatma_listeleri ol ON v.kategori_id = ol.id
    ORDER BY v.id DESC
  `;

  // 3. Kategorileri (oynatma listeleri) çek
  const rawCategories = await sql`
    SELECT id, ad
    FROM oynatma_listeleri
    ORDER BY id ASC
  `;

  const videos: VideoItem[] = rawVideos.map((v) => ({
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
    yayinda: Boolean(v.yayinda),
    kategori_id: v.kategori_id,
    kategori_adi: v.kategori_adi,
    olusturma: typeof v.olusturma === 'string' ? v.olusturma : new Date(v.olusturma).toISOString(),
  }));

  const categories: Category[] = rawCategories.map((c) => ({
    id: c.id,
    ad: c.ad,
  }));

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 font-sans">
      <AdminNav userEmail={session.user.eposta} unreadCount={unreadCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sayfa Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Video Yönetimi
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                {videos.length} Video
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Portfolyo videoları, YouTube bağlantıları ve oynatma listesi eşleşmeleri
            </p>
          </div>
        </div>

        {/* Video Yönetici Bileşeni */}
        <VideoManager initialVideos={videos} categories={categories} />
      </main>
    </div>
  );
}
