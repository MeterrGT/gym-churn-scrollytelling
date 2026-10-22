'use client';

import { useState, useTransition } from 'react';
import { toggleMessageStatusAction, deleteMessageAction, ActionResponse } from './actions';

export interface ContactMessage {
  id: number;
  ad_soyad: string;
  eposta: string;
  mesaj: string;
  kvkk_onay: boolean;
  okundu: boolean;
  gonderim_zamani: string;
}

interface MessagesManagerProps {
  initialMessages: ContactMessage[];
}

export default function MessagesManager({ initialMessages }: MessagesManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isPending, startTransition] = useTransition();

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  // Arama ve Durum Filtreleme
  const filteredMessages = initialMessages.filter((m) => {
    const matchesSearch =
      m.ad_soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.eposta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mesaj.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'unread'
        ? !m.okundu
        : m.okundu;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = initialMessages.filter((m) => !m.okundu).length;
  const readCount = initialMessages.filter((m) => m.okundu).length;

  // Okundu / Okunmadı Durum Değiştirme
  const handleToggleStatus = (message: ContactMessage) => {
    startTransition(async () => {
      const res: ActionResponse = await toggleMessageStatusAction(message.id, message.okundu);
      if (res.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setFeedback({
          type: 'success',
          message: res.message || 'Mesaj durumu güncellendi.',
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  // Mesaj Silme
  const handleDeleteConfirm = () => {
    if (!deletingMessage) return;
    const target = deletingMessage;
    startTransition(async () => {
      const res: ActionResponse = await deleteMessageAction(target.id);
      setDeletingMessage(null);
      if (res.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setFeedback({ type: 'success', message: res.message || 'Mesaj silindi.' });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Bildirim Alanı */}
      {feedback && (
        <div
          role="alert"
          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all shadow-lg animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-emerald-950/20'
              : 'bg-red-950/60 border-red-500/40 text-red-300 shadow-red-950/20'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Kontrol Çubuğu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
        {/* Arama Kutusu */}
        <div className="relative flex-1">
          <svg
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="İsim, e-posta veya mesaj içeriğinde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filtre Butonları */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-purple-950/80 text-purple-200 border border-purple-700/60 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tümü ({initialMessages.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              statusFilter === 'unread'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-700/60 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Okunmamış</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300">
              {unreadCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'read'
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Okunmuş ({readCount})
          </button>
        </div>
      </div>

      {/* Mesaj Kartları Listesi */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-zinc-500 text-xs">
            Arama kriterlerinize uygun iletişim mesajı bulunamadı.
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const formattedDate = new Date(msg.gonderim_zamani).toLocaleString('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border transition-all ${
                  msg.okundu
                    ? 'bg-zinc-950/60 border-zinc-800/70 hover:border-zinc-700'
                    : 'bg-purple-950/20 border-purple-500/40 hover:border-purple-400/60 shadow-lg shadow-purple-950/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Okundu / Okunmadı Durumu */}
                    {msg.okundu ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                        Okundu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-800/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Yeni / Okunmamış
                      </span>
                    )}

                    {/* KVKK Onay Rozeti */}
                    {msg.kvkk_onay ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/50">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        KVKK Onaylandı
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800">
                        KVKK Onaysız
                      </span>
                    )}

                    <span className="font-semibold text-zinc-100 text-sm">{msg.ad_soyad}</span>
                    <span className="text-zinc-500 text-xs">&bull;</span>
                    <a
                      href={`mailto:${msg.eposta}`}
                      className="text-xs font-mono text-purple-300 hover:text-purple-200 underline decoration-dotted"
                    >
                      {msg.eposta}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Mesaj İçeriği */}
                <div className="py-3 text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {msg.mesaj}
                </div>

                {/* Butonlar */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(msg)}
                    disabled={isPending}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                      msg.okundu
                        ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                        : 'bg-purple-900/50 border-purple-600/60 text-purple-200 hover:bg-purple-800/70'
                    } disabled:opacity-50`}
                  >
                    {isPending ? '...' : msg.okundu ? 'Okunmadı İşaretle' : 'Okundu Olarak İşaretle'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingMessage(msg)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs font-mono font-medium text-red-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-red-950/60 hover:border-red-900/70 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MESAJ SİLME ONAY MODAL */}
      {deletingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-base font-bold text-white">Mesajı Silmeyi Onayla</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-white">{deletingMessage.ad_soyad}</strong> ({deletingMessage.eposta}) tarafından gönderilen bu mesaj kalıcı olarak silinecektir.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeletingMessage(null)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-5 py-2 text-xs font-semibold text-white rounded-xl bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 transition-all disabled:opacity-50"
              >
                {isPending ? 'Siliniyor...' : 'Evet, Mesajı Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
