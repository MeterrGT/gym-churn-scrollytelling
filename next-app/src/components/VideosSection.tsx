import React from 'react';
import { SectionLabel } from './SectionLabel';

export interface PublicVideo {
  id: number;
  baslik: string;
  video_url: string | null;
  sure_dk: number | null;
  izlenme: number | null;
  yayin_tarihi: string | null;
  kategori_adi: string;
}

export function isRealVideoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed.toLowerCase() === 'null') return false;
  if (trimmed.includes('example.com') || trimmed.includes('example.org') || trimmed.startsWith('test')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface VideosSectionProps {
  allVideos: PublicVideo[];
  topVideos: PublicVideo[];
}

export const VideosSection: React.FC<VideosSectionProps> = ({ allVideos, topVideos }) => {
  return (
    <section className="section videos-section" id="videos">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="section-heading text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <SectionLabel label="Video Arşivi" icon="fa-solid fa-video" />
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            Videolarım
          </h2>
          <p className="section-sub text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-0">
            Büyük veri analitiği, Python, SQL sorguları ve veri görselleştirme süreçlerine dair hazırladığım eğitim videoları.
          </p>
          <div className="heading-line w-20 h-1 bg-gradient-to-r from-transparent via-[#b829ea] to-transparent mx-auto mt-5 sm:mt-6" />
        </div>

        {/* If no valid published videos with playable URLs exist, render polished honest empty state */}
        {allVideos.length === 0 ? (
          <div className="empty-videos-state max-w-3xl mx-auto p-8 sm:p-10 rounded-2xl bg-[#120f1c]/80 border border-[#b829ea]/30 text-center shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-[#b829ea]/15 border border-[#b829ea]/40 flex items-center justify-center text-[#c77dff] mx-auto mb-5 shadow-[0_0_20px_rgba(184,41,234,0.3)]">
              <i className="fa-solid fa-film text-2xl" />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-[#c77dff] bg-[#b829ea]/15 border border-[#b829ea]/30 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Öne Çıkanlar &bull; Neon Veritabanı Entegrasyonu</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
              Henüz yayımlanmış video yok.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto mb-6">
              Veritabanında kayıtlı mevcut videolar, BVA 2205 dersi SQL test senaryoları ve ilişkisel sorgu pratikleri için yapılandırılmış akademik gösterim kayıtlarıdır. Kamuya açık portfolyo arayüzünde yalnızca doğrulanmış, gerçek ve izlenebilir harici video bağlantısına sahip kayıtlar listelenmektedir.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono text-[#b829ea] font-bold block mb-1">
                  <i className="fa-solid fa-database mr-1.5" /> Neon PostgreSQL
                </span>
                <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                  İlişkisel oynatma listeleri ve video tabloları dinamik SQL sorgularıyla entegredir.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-[11px] font-mono text-[#b829ea] font-bold block mb-1">
                  <i className="fa-solid fa-play mr-1.5" /> Video Yayın Akışı
                </span>
                <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                  YouTube ve harici eğitim serileri incelenip onaylandıktan sonra bu alanda listelenecektir.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ========================================================
                Öne Çıkanlar (En Çok İzlenen 5 Video)
               ======================================================== */}
            {topVideos.length > 0 && (
              <div className="mb-14">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#b829ea]/20">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                    <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      Öne Çıkanlar
                    </h3>
                    <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
                      (En Çok İzlenen 5 Video)
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#c77dff] bg-[#b829ea]/15 px-3 py-1 rounded-full border border-[#b829ea]/30">
                    Top 5 İzlenme
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {topVideos.map((video, idx) => (
                    <div
                      key={`top-${video.id}`}
                      className="group relative bg-[#120f1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea] rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_25px_rgba(184,41,234,0.25)] transition-all duration-300"
                    >
                      {/* Ranking Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7b2cbf] to-[#b829ea] text-white text-xs font-extrabold flex items-center justify-center font-mono shadow-[0_0_10px_rgba(184,41,234,0.4)]">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <i className="fa-regular fa-eye text-[9px]" />
                          <span>{(video.izlenme || 0).toLocaleString('tr-TR')}</span>
                        </span>
                      </div>

                      {/* Video Info */}
                      <div className="mb-3">
                        <span className="block text-[11px] font-mono text-[#b829ea] mb-1 truncate">
                          {video.kategori_adi}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#c77dff] transition-colors line-clamp-2 leading-snug">
                          {video.baslik}
                        </h4>
                      </div>

                      {/* Bottom Meta & Link */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <i className="fa-regular fa-clock text-[#b829ea]" />
                          <span>{video.sure_dk ? `${video.sure_dk} dk` : '-'}</span>
                        </span>

                        {isRealVideoUrl(video.video_url) ? (
                          <a
                            href={video.video_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#e0aaff] hover:text-white inline-flex items-center gap-1 font-semibold group/link"
                            title="Videoyu İzle"
                          >
                            <span>İzle</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono italic">
                            Bağlantı eklenmedi
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                Tüm Yayındaki Videolar Grid
               ======================================================== */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#b829ea]/20">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <i className="fa-solid fa-film text-[#b829ea]" />
                  <span>Tüm Video Arşivi</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Toplam {allVideos.length} Video
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVideos.map((video) => (
                  <div
                    key={`video-${video.id}`}
                    className="bg-[#110e1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/70 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_35px_rgba(184,41,234,0.2)] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                            <i className="fa-solid fa-folder-open text-[10px]" />
                            <span>{video.kategori_adi}</span>
                          </span>

                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <i className="fa-regular fa-clock text-[#b829ea]" />
                            <span>{video.sure_dk ? `${video.sure_dk} dk` : '-'}</span>
                          </span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-[#c77dff] transition-colors leading-snug">
                          {video.baslik}
                        </h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <i className="fa-regular fa-eye text-emerald-400" />
                          <span>{(video.izlenme || 0).toLocaleString('tr-TR')} izlenme</span>
                        </span>

                        {video.yayin_tarihi && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <i className="fa-regular fa-calendar text-[10px]" />
                            <span>{new Date(video.yayin_tarihi).toLocaleDateString('tr-TR')}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-[#140f26]/80 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Yayında</span>
                      </span>

                      {isRealVideoUrl(video.video_url) ? (
                        <a
                          href={video.video_url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c77dff] hover:text-white px-3 py-1.5 rounded-lg bg-[#b829ea]/15 hover:bg-[#b829ea]/30 border border-[#b829ea]/40 transition-all shadow-[0_0_10px_rgba(184,41,234,0.2)]"
                        >
                          <i className="fa-brands fa-youtube text-red-500" />
                          <span>İzle</span>
                          <i className="fa-solid fa-arrow-right text-[10px]" />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                          <i className="fa-solid fa-link-slash text-[9px] text-slate-400" />
                          <span>Bağlantı eklenmedi</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  );
};
