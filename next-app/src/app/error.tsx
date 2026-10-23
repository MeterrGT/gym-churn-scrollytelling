'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Uygulama hatası:', error?.message || error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09080e] text-[#f8fafc] flex flex-col items-center justify-center relative px-4">
      <main className="relative z-10 max-w-lg w-full text-center p-8 sm:p-10 rounded-2xl bg-[#120f1c]/90 border border-red-500/30 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_25px_rgba(239,68,68,0.2)]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-red-300 bg-red-500/15 border border-red-500/30 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>SİSTEM UYARISI // HATA</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight font-heading">
          Beklenmeyen Bir Durum Oluştu
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mb-8 leading-relaxed">
          İşlem gerçekleştirilirken geçici bir sorun meydana geldi. Sayfayı yeniden yüklemeyi veya ana sayfaya dönmeyi deneyebilirsiniz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] hover:from-[#9d4edd] hover:to-[#c77dff] shadow-[0_0_15px_rgba(184,41,234,0.4)] transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right text-xs" />
            <span>Tekrar Dene</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all"
          >
            <i className="fa-solid fa-house text-xs" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
