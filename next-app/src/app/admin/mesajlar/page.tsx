import { validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminNav from '../AdminNav';
import MessagesManager, { ContactMessage } from './MessagesManager';

export const metadata = {
  title: 'İletişim Mesajları | Metehan Gezer',
  description: 'BVA 2205 Veritabanı Portfolyo İletişim Mesajları Yönetimi',
};

export const instant = false;

export default async function MesajlarPage() {
  const session = await validateSession();
  if (!session) {
    redirect('/giris');
  }

  // 1. Okunmamış mesaj sayısını al
  const unreadCountResult = await sql`
    SELECT COUNT(*)::int AS count
    FROM iletisim_mesajlari
    WHERE okundu = false
  `;
  const unreadCount = Number(unreadCountResult[0]?.count ?? 0);

  // 2. Mesajları en yeniden en eskiye sıralayarak çek
  const rawMessages = await sql`
    SELECT 
      id, 
      ad_soyad, 
      eposta, 
      mesaj, 
      kvkk_onay, 
      okundu, 
      gonderim_zamani
    FROM iletisim_mesajlari
    ORDER BY gonderim_zamani DESC
  `;

  const messages: ContactMessage[] = rawMessages.map((m) => ({
    id: m.id,
    ad_soyad: m.ad_soyad,
    eposta: m.eposta,
    mesaj: m.mesaj,
    kvkk_onay: Boolean(m.kvkk_onay),
    okundu: Boolean(m.okundu),
    gonderim_zamani:
      typeof m.gonderim_zamani === 'string'
        ? m.gonderim_zamani
        : new Date(m.gonderim_zamani).toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 font-sans">
      <AdminNav userEmail={session.user.eposta} unreadCount={unreadCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sayfa Başlığı ve İstatistikler */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                İletişim Mesajları
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                {messages.length} Toplam Mesaj
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Portfolyo ziyaretçileri ve akademik incelemelerden gelen form iletileri
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>Okunmamış: <strong className="text-white">{unreadCount}</strong></span>
            </span>
          </div>
        </div>

        {/* Mesaj Yönetici Bileşeni */}
        <MessagesManager initialMessages={messages} />
      </main>
    </div>
  );
}
