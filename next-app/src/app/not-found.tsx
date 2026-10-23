import Link from 'next/link';
import { CyberCanvas } from '@/components/CyberCanvas';

export const metadata = {
  title: 'Sayfa Bulunamadı | Metehan Gezer',
  description: 'Aradığınız sayfa bulunamadı.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09080e] text-[#f8fafc] flex flex-col items-center justify-center relative px-4 overflow-hidden">
      <CyberCanvas />

      <main className="relative z-10 max-w-lg w-full text-center p-8 sm:p-10 rounded-2xl bg-[#120f1c]/90 border border-[#b829ea]/40 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_25px_rgba(184,41,234,0.25)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/15 border border-[#b829ea]/40 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>HATA 404 // SAYFA BULUNAMADI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight font-heading">
          404
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
          Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] hover:from-[#9d4edd] hover:to-[#c77dff] shadow-[0_0_15px_rgba(184,41,234,0.4)] transition-all"
          >
            <i className="fa-solid fa-house text-xs" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <Link
            href="/iletisim"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all"
          >
            <i className="fa-regular fa-paper-plane text-xs" />
            <span>İletişime Geç</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
