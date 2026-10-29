'use client';

import { useState, useTransition } from 'react';
import { isRealVideoUrl } from '@/components/VideosSection';
import {
  createVideoAction,
  updateVideoAction,
  toggleVideoPublishAction,
  deleteVideoAction,
  ActionResponse,
} from './actions';

export interface Category {
  id: number;
  ad: string;
}

export interface VideoItem {
  id: number;
  baslik: string;
  video_url: string | null;
  sure_dk: number | null;
  izlenme: number | null;
  yayin_tarihi: string | null;
  yayinda: boolean;
  kategori_id: number | null;
  kategori_adi: string;
  olusturma: string;
}

interface VideoManagerProps {
  initialVideos: VideoItem[];
  categories: Category[];
}

export default function VideoManager({ initialVideos, categories }: VideoManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  // Bildirim durumu
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Modal durumları
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoItem | null>(null);

  // Form hata durumu
  const [formError, setFormError] = useState<string | null>(null);

  // Arama ve filtreleme
  const filteredVideos = initialVideos.filter((v) => {
    const matchesSearch =
      v.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.video_url && v.video_url.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'null'
        ? v.kategori_id === null
        : v.kategori_id === parseInt(selectedCategory, 10);

    return matchesSearch && matchesCategory;
  });

  // Yeni Video Kaydet
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res: ActionResponse = await createVideoAction(null, formData);
      if (res.error) {
        setFormError(res.error);
      } else {
        setIsCreateOpen(false);
        setFeedback({ type: 'success', message: res.message || 'Video başarıyla eklendi.' });
        setTimeout(() => setFeedback(null), 4000);
      }
    });
  };

  // Video Güncelle
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res: ActionResponse = await updateVideoAction(null, formData);
      if (res.error) {
        setFormError(res.error);
      } else {
        setEditingVideo(null);
        setFeedback({ type: 'success', message: res.message || 'Video başarıyla güncellendi.' });
        setTimeout(() => setFeedback(null), 4000);
      }
    });
  };

  // Yayın Durumunu Değiştir
  const handleTogglePublish = (video: VideoItem) => {
    startTransition(async () => {
      const res = await toggleVideoPublishAction(video.id, video.yayinda);
      if (res.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setFeedback({
          type: 'success',
          message: `"${video.baslik}" yayından ${video.yayinda ? 'kaldırıldı' : 'alındı'}.`,
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  // Video Sil
  const handleDeleteConfirm = () => {
    if (!deletingVideo) return;
    const target = deletingVideo;
    startTransition(async () => {
      const res = await deleteVideoAction(target.id);
      setDeletingVideo(null);
      if (res.error) {
        setFeedback({ type: 'error', message: res.error });
      } else {
        setFeedback({ type: 'success', message: res.message || 'Video silindi.' });
        setTimeout(() => setFeedback(null), 4000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Geri Bildirim Bildirimi */}
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

      {/* Kontrol Çubuğu: Arama, Filtre ve Ekle Butonu */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          {/* Arama */}
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
              placeholder="Video başlığı veya URL ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Kategori Filtresi */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">Tüm Kategoriler ({initialVideos.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.ad}
              </option>
            ))}
          </select>
        </div>

        {/* Yeni Video Butonu */}
        <button
          type="button"
          onClick={() => {
            setFormError(null);
            setIsCreateOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all cursor-pointer whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Yeni Video Ekle</span>
        </button>
      </div>

      {/* Videolar Tablosu */}
      <div className="rounded-2xl bg-zinc-950/70 border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/50 text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Video Başlığı</th>
                <th className="py-3 px-4">Kategori (JOIN)</th>
                <th className="py-3 px-4">Süre</th>
                <th className="py-3 px-4">İzlenme</th>
                <th className="py-3 px-4">Yayın Tarihi</th>
                <th className="py-3 px-4">Yayın Durumu</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs">
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    Arama kriterlerinize uygun video kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-zinc-500">#{video.id}</td>
                    <td className="py-3.5 px-4 font-medium text-zinc-100 max-w-xs">
                      <div className="font-semibold text-zinc-200">{video.baslik}</div>
                      {isRealVideoUrl(video.video_url) ? (
                        <a
                          href={video.video_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-purple-400 hover:text-purple-300 font-mono truncate block max-w-xs mt-0.5"
                        >
                          {video.video_url}
                        </a>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono italic block max-w-xs mt-0.5">
                          Bağlantı eklenmedi
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-950/60 text-purple-300 border border-purple-800/50">
                        {video.kategori_adi}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {video.sure_dk !== null ? `${video.sure_dk} dk` : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {video.izlenme !== null ? Number(video.izlenme).toLocaleString('tr-TR') : '0'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400 whitespace-nowrap">
                      {video.yayin_tarihi
                        ? new Date(video.yayin_tarihi).toLocaleDateString('tr-TR')
                        : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(video)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all cursor-pointer ${
                          video.yayinda
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/70'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                        } disabled:opacity-50`}
                        title="Tıklayarak yayın durumunu değiştirin"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            video.yayinda ? 'bg-emerald-400' : 'bg-zinc-500'
                          }`}
                        />
                        <span>{video.yayinda ? 'Yayında' : 'Yayında Değil'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormError(null);
                            setEditingVideo(video);
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-purple-950/40 hover:text-purple-200 hover:border-purple-600/50 transition-all cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingVideo(video)}
                          className="px-2.5 py-1 text-xs font-medium text-red-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-red-950/50 hover:border-red-900/60 transition-all cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ VİDEO OLUŞTURMA MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Yeni Video Ekle
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Video Başlığı <span className="text-purple-400">*</span>
                </label>
                <input
                  name="baslik"
                  type="text"
                  required
                  placeholder="Örn: Gym Churn Veri Hikâyesi 2516016026"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Video URL Adresi
                </label>
                <input
                  name="video_url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Kategori (Oynatma Listesi)
                  </label>
                  <select
                    name="kategori_id"
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="0">Kategori Seçiniz (İsteğe Bağlı)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ad}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Süre (Dakika)
                  </label>
                  <input
                    name="sure_dk"
                    type="number"
                    min="0"
                    placeholder="Örn: 10"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    İzlenme Sayısı
                  </label>
                  <input
                    name="izlenme"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Yayın Tarihi
                  </label>
                  <input
                    name="yayin_tarihi"
                    type="date"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="create_yayinda"
                  name="yayinda"
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-700 focus:ring-purple-500"
                />
                <label htmlFor="create_yayinda" className="text-xs text-zinc-300 select-none">
                  Hemen yayına al (<code className="text-purple-300">yayinda = true</code>)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-semibold text-white rounded-xl bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Ekleniyor...' : 'Videoyu Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VİDEO DÜZENLEME MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Video Düzenle (#{editingVideo.id})
              </h3>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingVideo.id} />

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Video Başlığı <span className="text-purple-400">*</span>
                </label>
                <input
                  name="baslik"
                  type="text"
                  required
                  defaultValue={editingVideo.baslik}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Video URL Adresi
                </label>
                <input
                  name="video_url"
                  type="url"
                  defaultValue={editingVideo.video_url || ''}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Kategori (Oynatma Listesi)
                  </label>
                  <select
                    name="kategori_id"
                    defaultValue={editingVideo.kategori_id ?? 0}
                    className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="0">Kategori Seçiniz (İsteğe Bağlı)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ad}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Süre (Dakika)
                  </label>
                  <input
                    name="sure_dk"
                    type="number"
                    min="0"
                    defaultValue={editingVideo.sure_dk ?? ''}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    İzlenme Sayısı
                  </label>
                  <input
                    name="izlenme"
                    type="number"
                    min="0"
                    defaultValue={editingVideo.izlenme ?? 0}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Yayın Tarihi
                  </label>
                  <input
                    name="yayin_tarihi"
                    type="date"
                    defaultValue={
                      editingVideo.yayin_tarihi
                        ? new Date(editingVideo.yayin_tarihi).toISOString().split('T')[0]
                        : ''
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="edit_yayinda"
                  name="yayinda"
                  type="checkbox"
                  defaultChecked={editingVideo.yayinda}
                  className="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-700 focus:ring-purple-500"
                />
                <label htmlFor="edit_yayinda" className="text-xs text-zinc-300 select-none">
                  Yayında (<code className="text-purple-300">yayinda = true</code>)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-semibold text-white rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isPending ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SİLME ONAY MODAL */}
      {deletingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-base font-bold text-white">Videoyu Silmeyi Onayla</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-white">#{deletingVideo.id} - {deletingVideo.baslik}</strong> başlıklı video kalıcı olarak silinecektir. Bu işlem geri alınamaz.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setDeletingVideo(null)}
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
                {isPending ? 'Siliniyor...' : 'Evet, Kalıcı Olarak Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
