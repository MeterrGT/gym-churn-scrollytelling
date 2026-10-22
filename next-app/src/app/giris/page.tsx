import { validateSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Yönetici Girişi | Metehan Gezer',
  description: 'BVA 2205 Portfolyo ve Veri Gazeteciliği Yönetici Paneli Girişi',
};
export const instant = false;


export default async function LoginPage() {
  const session = await validateSession();

  // Halihazırda geçerli bir oturum varsa doğrudan yönetici paneline yönlendir
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#07070b] text-zinc-100 relative overflow-hidden font-sans">
      {/* Arka plan parlama efektleri */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-md relative z-10">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-purple-950/20">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-purple-300 bg-purple-950/60 border border-purple-800/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Yönetici Girişi &bull; Kimlik Doğrulama</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Yönetici Girişi
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              BVA 2205 Portfolyo ve Veritabanı Yönetim Portalı
            </p>
          </div>

          <LoginForm />

          {/* Yasal Uyarı Bildirimi (TCK m. 243-244) */}
          <div className="mt-6 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/25 text-amber-200/90 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">Yasal Uyarı (TCK m. 243-244):</strong>
                Bu sisteme yetkisiz erişim sağlamak veya sistem verilerine müdahale etmek Türk Ceza Kanunu kapsamında suçtur. Güvenlik ve denetim amacıyla tüm başarılı ve başarısız oturum işlemleri IP adresi ve zaman damgasıyla kayıt altına alınmaktadır.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-800/60 text-center">

            <p className="text-xs text-zinc-500 font-mono">
              Güvenli Oturum &bull; Neon PostgreSQL &bull; bcrypt
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
