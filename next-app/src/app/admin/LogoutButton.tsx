'use client';

import { useTransition } from 'react';
import { logoutAction } from './actions';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-red-950/40 hover:text-red-300 hover:border-red-900/50 transition-all cursor-pointer disabled:opacity-50"
      title="Oturumu güvenli bir şekilde kapat"
    >
      {isPending ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Çıkılıyor...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Güvenli Çıkış</span>
        </>
      )}
    </button>
  );
}
