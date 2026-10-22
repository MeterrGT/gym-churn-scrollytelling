import { validateSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminNav from '../AdminNav';

export const metadata = {
  title: 'İşlem Günlüğü (Audit Logs) | Metehan Gezer',
  description: 'BVA 2205 Veritabanı ve Portfolyo Denetim Kayıtları',
};

export const instant = false;

interface AuditRecord {
  id: number;
  islem: string;
  tablo_adi: string | null;
  kayit_id: number | null;
  zaman: string;
  yonetici_eposta: string;
}

export default async function AuditLogsPage() {
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

  // 2. En son 50 denetim kaydını yoneticiler tablosuyla JOIN yaparak çek
  const rawLogs = await sql`
    SELECT 
      k.id,
      k.islem,
      k.tablo_adi,
      k.kayit_id,
      k.zaman,
      COALESCE(y.eposta, 'Sistem') AS yonetici_eposta
    FROM islem_kayitlari k
    LEFT JOIN yoneticiler y ON k.yonetici_id = y.id
    ORDER BY k.zaman DESC
    LIMIT 50
  `;

  // 3. Görev 3.8 sorgusu: Son 7 gündeki işlem türüne göre denetim kaydı sayıları
  const actionCountsResult = await sql`
    SELECT islem, COUNT(*)::int AS islem_sayisi
    FROM islem_kayitlari
    WHERE zaman >= CURRENT_TIMESTAMP - INTERVAL '7 days'
    GROUP BY islem
    ORDER BY islem_sayisi DESC
  `;

  const logs: AuditRecord[] = rawLogs.map((r) => ({
    id: r.id,
    islem: r.islem,
    tablo_adi: r.tablo_adi,
    kayit_id: r.kayit_id,
    zaman: typeof r.zaman === 'string' ? r.zaman : new Date(r.zaman).toISOString(),
    yonetici_eposta: r.yonetici_eposta,
  }));

  const getActionBadge = (islem: string) => {
    switch (islem) {
      case 'giris':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            giris
          </span>
        );
      case 'cikis':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            cikis
          </span>
        );
      case 'ekle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-950/70 text-purple-300 border border-purple-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            ekle
          </span>
        );
      case 'guncelle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-950/70 text-indigo-300 border border-indigo-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            guncelle
          </span>
        );
      case 'sil':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-red-950/70 text-red-300 border border-red-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            sil
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300">
            {islem}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-zinc-100 font-sans">
      <AdminNav userEmail={session.user.eposta} unreadCount={unreadCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sayfa Başlığı */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                İşlem Günlüğü (Audit Logs)
              </h1>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/60">
                Son 50 Kayıt
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Yöneticiler tarafından gerçekleştirilen giriş, çıkış, ekleme, güncelleme ve silme denetim izleri
            </p>
          </div>
        </div>

        {/* Görev 3.8 Metrik Özeti: Son 7 Gündeki İşlemler */}
        <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
              Son 7 Gündeki İşlem Sayıları (Görev 3.8 Sorgusu)
            </h2>
            <span className="text-[11px] font-mono text-zinc-500">
              WHERE zaman &gt;= NOW() - INTERVAL &apos;7 days&apos;
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {['giris', 'cikis', 'ekle', 'guncelle', 'sil'].map((act) => {
              const countItem = actionCountsResult.find((r) => r.islem === act);
              const count = countItem ? countItem.islem_sayisi : 0;
              return (
                <div
                  key={act}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60 flex items-center justify-between"
                >
                  <span className="text-xs font-mono text-zinc-400 uppercase">{act}</span>
                  <span className="text-lg font-bold text-zinc-100 font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kayıtlar Tablosu */}
        <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/50 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4">Kayıt ID</th>
                  <th className="py-3 px-4">İşlem (Action)</th>
                  <th className="py-3 px-4">Yönetici (JOIN eposta)</th>
                  <th className="py-3 px-4">Tablo Adı</th>
                  <th className="py-3 px-4">Kayıt ID (Target)</th>
                  <th className="py-3 px-4 text-right">Zaman (Timestamp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                      Henüz denetim günlüğü kaydı bulunmamaktadır.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const formattedDate = new Date(log.zaman).toLocaleString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });

                    return (
                      <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-zinc-500">#{log.id}</td>
                        <td className="py-3.5 px-4">{getActionBadge(log.islem)}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-200">
                          {log.yonetici_eposta}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">
                          {log.tablo_adi ? (
                            <code className="px-2 py-0.5 rounded bg-zinc-900 text-purple-300 border border-zinc-800">
                              {log.tablo_adi}
                            </code>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400">
                          {log.kayit_id !== null ? `#${log.kayit_id}` : '-'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-zinc-400 text-right whitespace-nowrap">
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
