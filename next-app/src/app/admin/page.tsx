import { validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminNav from './AdminNav';
import MessageToggleRow from './MessageToggleRow';

export const metadata = {
  title: 'Yönetici Paneli | Metehan Gezer',
  description: 'BVA 2205 Veritabanı ve Portfolyo Korumalı Yönetim Paneli',
};
export const instant = false;


export default async function AdminDashboardPage() {
  // 1. Sunucu tarafında veritabanı oturum doğrulaması
  const session = await validateSession();

  // Geçerli veya süresi dolmamış oturum yoksa /giris sayfasına yönlendir
  if (!session) {
    redirect('/giris');
  }

  // 2. iletisim_mesajlari tablosundan okunmamış mesajların sayısını çek
  const unreadCountResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM iletisim_mesajlari
    WHERE okundu = false
  `;
  const unreadCount = Number(unreadCountResult[0]?.count ?? 0);

  // 3. Toplam iletişim mesajları sayısı
  const totalCountResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM iletisim_mesajlari
  `;
  const totalMessagesCount = Number(totalCountResult[0]?.count ?? 0);

  // 4. Son gelen mesajlar listesi
  const messagesResult = await sql`
    SELECT id, ad_soyad, eposta, mesaj, okundu, gonderim_zamani
    FROM iletisim_mesajlari
    ORDER BY okundu ASC, gonderim_zamani DESC
    LIMIT 25
  `;

  // 5. Videolar tablosu genel istatistikleri
  const videoStatsResult = await sql`
    SELECT 
      COUNT(*)::int AS toplam_video,
      COUNT(CASE WHEN yayinda = true THEN 1 END)::int AS yayinda_video,
      COALESCE(SUM(izlenme), 0)::bigint AS toplam_izlenme
    FROM videolar
  `;
  const videoStats = videoStatsResult[0] ?? { toplam_video: 0, yayinda_video: 0, toplam_izlenme: 0 };

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 font-sans">
      <AdminNav userEmail={session.user.eposta} unreadCount={unreadCount} />


      {/* Ana İçerik */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hoş Geldin Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Yönetici Kontrol Paneli
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Giriş yapan yönetici: <span className="text-purple-300 font-mono">{session.user.eposta}</span>
            </p>
            {session.user.son_giris && (
              <p className="text-xs font-mono text-zinc-400 mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-zinc-500">Son başarılı giriş:</span>
                <span className="text-purple-300 font-semibold">
                  {new Date(session.user.son_giris).toLocaleString('tr-TR')}
                </span>
                {session.user.son_giris_ip && (
                  <>
                    <span className="text-zinc-600">&bull;</span>
                    <span className="text-zinc-500">IP:</span>
                    <span className="text-emerald-400 font-semibold">{session.user.son_giris_ip}</span>
                  </>
                )}
              </p>
            )}

          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
              Veritabanı: <span className="text-emerald-400 font-semibold">Neon PostgreSQL</span>
            </span>
          </div>
        </div>

        {/* Metrik Kartları (KPI Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. ÖNEMLİ KART: Okunmamış İletişim Mesajları */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950/60 via-zinc-950/80 to-zinc-950/90 border border-purple-500/30 p-6 shadow-xl shadow-purple-950/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-purple-300 uppercase">
                Okunmamış Mesajlar
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${unreadCount > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {unreadCount}
              </span>
              <span className="text-xs text-zinc-400">
                / {totalMessagesCount} toplam mesaj
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-3 font-medium">
              {unreadCount > 0
                ? `${unreadCount} adet yeni yanıt bekleyen iletişim mesajı var.`
                : 'Tüm iletişim mesajları incelendi.'}
            </p>
          </div>

          {/* 2. KART: Toplam İletişim Mesajları */}
          <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                Toplam Mesajlar
              </span>
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-4xl font-extrabold text-zinc-100 tracking-tight">
              {totalMessagesCount}
            </div>
            <p className="text-xs text-zinc-500 mt-3 font-mono">
              iletisim_mesajlari tablosu
            </p>
          </div>

          {/* 3. KART: Videolar & Yayın Durumu */}
          <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                Yayındaki Videolar
              </span>
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-zinc-100 tracking-tight">
                {videoStats.yayinda_video}
              </span>
              <span className="text-xs text-zinc-400">
                / {videoStats.toplam_video} video
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-3 font-mono">
              Toplam {Number(videoStats.toplam_izlenme).toLocaleString('tr-TR')} izlenme
            </p>
          </div>

          {/* 4. KART: Oturum Güvenliği */}
          <div className="rounded-2xl bg-zinc-950/60 border border-zinc-800/80 p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                Oturum Koruması
              </span>
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
              2 Saatlik
            </div>
            <p className="text-xs text-zinc-400 mt-3 font-mono">
              httpOnly &bull; bcrypt &bull; oturumlar
            </p>
          </div>
        </div>

        {/* Mesajlar Listesi Tablosu */}
        <section className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Gelen İletişim Mesajları
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/50">
                  {unreadCount} Okunmamış
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                iletisim_mesajlari tablosu kayıtları
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4">Gönderen</th>
                  <th className="py-3 px-4">E-posta</th>
                  <th className="py-3 px-4">Tarih</th>
                  <th className="py-3 px-4">Mesaj</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {messagesResult.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">
                      Henüz herhangi bir iletişim mesajı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  messagesResult.map((msg) => (
                    <MessageToggleRow
                      key={msg.id}
                      message={{
                        id: msg.id,
                        ad_soyad: msg.ad_soyad,
                        eposta: msg.eposta,
                        mesaj: msg.mesaj,
                        okundu: Boolean(msg.okundu),
                        gonderim_zamani: typeof msg.gonderim_zamani === 'string'
                          ? msg.gonderim_zamani
                          : new Date(msg.gonderim_zamani).toISOString(),
                      }}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bilgilendirme ve Güvenlik Özeti */}
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 text-xs text-zinc-500 font-mono flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            BVA 2205 Veritabanı ve Portfolyo Yönetimi &bull; Neon Serverless Tagged-Template SQL &bull; bcryptjs
          </span>
          <span className="text-zinc-600">
            Oturum Kimliği: {session.token.substring(0, 16)}...
          </span>
        </div>
      </main>
    </div>
  );
}
