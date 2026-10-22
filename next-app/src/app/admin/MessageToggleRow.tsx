'use client';

import { useTransition } from 'react';
import { toggleMessageReadStatus } from './actions';

interface MessageItem {
  id: number;
  ad_soyad: string;
  eposta: string;
  mesaj: string;
  okundu: boolean;
  gonderim_zamani: string;
}

export default function MessageToggleRow({ message }: { message: MessageItem }) {
  const [isPending, startTransition] = useTransition();

  const formattedDate = new Date(message.gonderim_zamani).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr
      className={`border-b border-zinc-800/60 transition-colors ${
        message.okundu ? 'bg-zinc-950/20 opacity-80' : 'bg-purple-950/10 hover:bg-purple-950/20'
      }`}
    >
      <td className="py-3.5 px-4">
        {message.okundu ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-zinc-400 bg-zinc-800/70 border border-zinc-700/50">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            Okundu
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Yeni / Okunmadı
          </span>
        )}
      </td>
      <td className="py-3.5 px-4 text-sm font-semibold text-zinc-100">
        {message.ad_soyad}
      </td>
      <td className="py-3.5 px-4 text-xs font-mono text-zinc-400">
        <a href={`mailto:${message.eposta}`} className="hover:text-purple-300 transition-colors underline decoration-dotted">
          {message.eposta}
        </a>
      </td>
      <td className="py-3.5 px-4 text-xs font-mono text-zinc-400 whitespace-nowrap">
        {formattedDate}
      </td>
      <td className="py-3.5 px-4 text-sm text-zinc-300 max-w-xs md:max-w-md truncate" title={message.mesaj}>
        {message.mesaj}
      </td>
      <td className="py-3.5 px-4 text-right">
        <button
          type="button"
          onClick={() => {
            startTransition(async () => {
              await toggleMessageReadStatus(message.id, message.okundu);
            });
          }}
          disabled={isPending}
          className={`px-3 py-1 text-xs rounded-lg font-mono font-medium border transition-all cursor-pointer ${
            message.okundu
              ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              : 'bg-purple-900/40 border-purple-600/50 text-purple-200 hover:bg-purple-800/60'
          } disabled:opacity-50`}
        >
          {isPending ? '...' : message.okundu ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
        </button>
      </td>
    </tr>
  );
}
