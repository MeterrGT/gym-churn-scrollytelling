'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CyberCanvas } from '@/components/CyberCanvas';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export default function LivePulseCaseStudyPage() {
  const { livePulseProject } = PORTFOLIO_DATA;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="case-study-root min-h-screen bg-[#0d0d0d] text-slate-100 relative selection:bg-[#b829ea] selection:text-white overflow-x-clip font-sans">
      {/* Arka Plan Siber Parçacık Tuvali */}
      <CyberCanvas />

      {/* Üst Sabit Başlık (Sticky Header) */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-[#b829ea]/30 shadow-2xl shadow-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#e0aaff] bg-[#b829ea]/15 hover:bg-[#b829ea]/25 border border-[#b829ea]/50 shadow-[0_0_12px_rgba(184,41,234,0.3)] transition-all"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <span className="hidden sm:inline-block font-mono text-xs text-slate-400">
              VAKA ANALİZİ: <span className="text-emerald-400 font-bold">Canlı Sosyal Medya Nabzı (BVA 2245)</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/canli-sosyal-medya-nabzi"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
            >
              <i className="fa-solid fa-bolt" />
              <span>Canlı Ürünü Aç</span>
            </Link>

            <a
              href={livePulseProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-slate-300 hover:text-[#b829ea] border border-white/10 transition-colors"
              title="GitHub Kaynak Kodu"
            >
              <i className="fa-brands fa-github text-sm" />
            </a>
          </div>
        </div>
      </header>

      {/* ======================================================================
          1. HERO BÖLÜMÜ (Başlık, Ayrım Bildirimi & Temel Rozetler)
         ====================================================================== */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/40 mb-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BVA 2245 VAKA ANALİZİ</span>
            <span>•</span>
            <span>CANLI VERİ ÜRÜNÜ MİMARİSİ</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight !leading-tight mb-6 max-w-4xl">
            Canlı Sosyal Medya Nabzı:{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-[#e0aaff] to-[#b829ea] bg-clip-text text-transparent">
              Bluesky Gerçek Zamanlı Akış & Trend Dinleme Mimarisi
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 font-sans">
            Merkeziyetsiz sosyal medya protokolü (AT Protocol Jetstream WebSocket) üzerinde istemci taraflı Web Worker ile UI thread&apos;i bloke etmeyen, 5 dakika ve 1 saatlik kayan pencereli, çok dilli ve %100 sıfır veri saklama (zero retention) prensipli canlı trend analitiği ürünü.
          </p>

          {/* Açık Ayrım Bildirimi (Historical Archive vs Live Product) */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-mono mb-8 max-w-2xl text-left flex items-start gap-3 shadow-lg">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 text-base shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">⚠️ ÖNEMLİ AYRIM — TARİHSEL AĞ ANALİZİ İLE KARIŞTIRILMAMALIDIR:</strong>
              <span>
                Bu vaka analizi, portfolyodaki 48 saatlik statik retrospektif arşiv çalışması olan <strong>&ldquo;Bluesky Turkish Hashtag Network&rdquo; (/bluesky-hashtag-network)</strong> projesinden tamamen farklıdır. Burada sunulan ürün; canlı WebSocket üzerinden saniyede yüzlerce çok dilli gönderiyi anlık ayrıştıran, kayan pencere sayıcılarıyla çalışan ve bayat veri garantisi sunan <strong>gerçek zamanlı bir Canlı Veri Ürünüdür</strong>.
              </span>
            </div>
          </div>

          {/* Meta Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 font-mono text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-user-astronaut text-[#b829ea]" />
              <span>Geliştirici: <strong className="text-white">Metehan Gezer</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-graduation-cap text-[#b829ea]" />
              <span>MCBÜ Büyük Veri Analistliği</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-bolt text-emerald-400" />
              <span>Gecikme: &lt; 50ms (Web Worker)</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-shield-halved text-purple-400" />
              <span>Gizlilik: %100 Ham Veri İmhası</span>
            </div>
          </div>

          {/* Hızlı Atlama Butonu */}
          <button
            type="button"
            onClick={() => scrollToSection('problem-persona')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#140f26] border border-[#b829ea]/40 text-[#e0aaff] hover:text-white hover:bg-[#b829ea]/20 transition-all text-xs font-mono cursor-pointer"
          >
            <span>Mimari Analizi İncele</span>
            <i className="fa-solid fa-arrow-down text-xs" />
          </button>
        </div>
      </section>

      {/* Ana İçerik */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* ======================================================================
            2. PROBLEM TANIMI VE HEDEF KULLANICI PERSONASI
           ====================================================================== */}
        <section id="problem-persona" className="space-y-6">
          <div className="border-l-4 border-emerald-400 pl-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              Bölüm 1 • İhtiyaç Analizi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Problem Tanımı ve Hedef Kitle (Persona)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol: Problem */}
            <div className="p-6 rounded-2xl bg-[#110e1c] border border-white/10 shadow-lg space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <i className="fa-solid fa-fire-extinguisher text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Geleneksel Sosyal Dinlemenin Çıkmazı</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Geleneksel sosyal dinleme araçları (Hootsuite, Brandwatch vb.) merkezi API limitlerine bağımlıdır; verileri saatler veya dakikalar sonra toplu (batch) işleyerek panoya yansıtır. Bir kriz patlak verdiğinde (örneğin bir boykot kampanyası veya viral skandal), ilk 5 dakikadaki ani debi artışları fark edilemez.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Ayrıca istemci tarayıcıda çalışan canlı panolar, gelen yoğun JSON akışını UI thread üzerinde işlediğinde donmakta; kullanıcıların DID/profil verilerini sunucuda depoladığında ise KVKK ve GDPR kapsamında ağır hukuki sorumluluklar doğurmaktadır.
              </p>
            </div>

            {/* Sağ: Hedef Persona */}
            <div className="p-6 rounded-2xl bg-[#110e1c] border border-emerald-500/30 shadow-lg space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <i className="fa-solid fa-user-tie text-lg" />
              </div>
              <h3 className="text-lg font-bold text-white">Hedef Persona: &ldquo;Deniz Yılmaz&rdquo;</h3>
              <div className="text-xs font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                TrendPulse Medya Ajansı • Dijital İletişim & Kriz Masası Lideri
              </div>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-2 font-sans">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Anlık Trend Radarı:</strong> Bluesky üzerinde son 5 dakikada en çok ivmelenen etiketleri gecikmesiz görmelidir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Çok Dilli İzolasyon:</strong> Global akıştaki gürültüyü filtreleyip Türkçe (`tr`), İngilizce (`en`), Almanca (`de`) vb. dillerin gündemlerini bağımsız izlemelidir.</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-emerald-400 mt-1 shrink-0" />
                  <span><strong>Güvenilir Kopma/Dondurma:</strong> Bağlantı koptuğunda veri sahteciliği yapılmamalı, son başarılı anlık görüntü orijinal zaman damgasıyla dondurulmalıdır.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ======================================================================
            3. UÇTAN UCA VERİ BORU HATTI MİMARİSİ (PIPELINE DIAGRAM)
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-[#b829ea] pl-4">
            <span className="text-xs font-mono font-bold text-[#c77dff] uppercase tracking-wider block">
              Bölüm 2 • Mimari & Veri Akışı
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Uçtan Uca Gerçek Zamanlı Veri Boru Hattı
            </h2>
          </div>

          {/* Pipeline Diagram Card */}
          <div className="p-6 rounded-2xl bg-[#140f26]/90 border border-[#b829ea]/40 shadow-xl space-y-6">
            <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-[#b829ea]" />
              <span>Sıfır Veri Saklama (Zero Retention) Boru Hattı Şeması</span>
            </h3>

            {/* Metin / Blok Tabanlı Akış Şeması */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center text-center justify-between">
                <span className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-2">1</span>
                <div>
                  <strong className="text-white block mb-1">Jetstream WS</strong>
                  <span className="text-[11px] text-slate-400">Bluesky AT Protocol Genel Post Akışı</span>
                </div>
                <span className="mt-2 text-[10px] text-blue-400">wss://jetstream1...</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 flex flex-col items-center text-center justify-between">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">2</span>
                <div>
                  <strong className="text-emerald-300 block mb-1">Ayıkla & İmha Et</strong>
                  <span className="text-[11px] text-slate-400">Yalnızca etiketler ve ISO 639 dilleri alınır</span>
                </div>
                <span className="mt-2 text-[10px] text-emerald-400">DID & Metin Çöpe (GC)</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-purple-500/30 flex flex-col items-center text-center justify-between">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2">3</span>
                <div>
                  <strong className="text-purple-300 block mb-1">Web Worker</strong>
                  <span className="text-[11px] text-slate-400">Arka plan iş parçacığı (`pulse.worker.js`)</span>
                </div>
                <span className="mt-2 text-[10px] text-purple-400">UI Thread Bloklanmaz</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-amber-500/30 flex flex-col items-center text-center justify-between">
                <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold mb-2">4</span>
                <div>
                  <strong className="text-amber-300 block mb-1">Kayan Pencereler</strong>
                  <span className="text-[11px] text-slate-400">60 Adet 1 Dk Kova (Son 5 dk & 1 saat)</span>
                </div>
                <span className="mt-2 text-[10px] text-amber-300">Bounded Memory (FIFO)</span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-[#b829ea]/50 flex flex-col items-center text-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#b829ea]/20 text-[#e0aaff] flex items-center justify-center font-bold mb-2">5</span>
                <div>
                  <strong className="text-white block mb-1">Canlı Gösterge</strong>
                  <span className="text-[11px] text-slate-400">Ayrık SVG PPM Grafiği & Detay Tablosu</span>
                </div>
                <span className="mt-2 text-[10px] text-[#e0aaff]">Bayat Veri Garantisi</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2">
              <strong>Veri Minimizasyonu Güvencesi:</strong> İstemciye ulaşan her WebSocket JSON yükünden (`commit.record`) yalnızca BCP-47 / ISO 639 standartlarına göre normalize edilen dil dizisi (`tr`, `en`, `gl`, `de` vb.) ve `#` etiketleri ayıklanır. Gönderen kullanıcının DID kimliği, rkey, profil resmi ve gönderi gövde metni toplayıcı belleğinde <strong>asla saklanmaz</strong> ve JavaScript Garbage Collector&apos;a bırakılarak anında bellekten düşürülür.
            </p>
          </div>
        </section>

        {/* ======================================================================
            4. TARİHSEL AĞ ANALİZİ VS CANLI VERİ ÜRÜNÜ (KARŞILAŞTIRMA MATRİSİ)
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-amber-400 pl-4">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              Bölüm 3 • Karşılaştırma Matrisi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tarihsel Ağ Analizi vs. Canlı Veri Ürünü
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl bg-[#110e1c]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="bg-[#140f26] text-slate-300 border-b border-white/10">
                <tr>
                  <th scope="col" className="p-4">Karşılaştırma Boyutu</th>
                  <th scope="col" className="p-4 text-[#c77dff]">Tarihsel Ağ Analizi (/bluesky-hashtag-network)</th>
                  <th scope="col" className="p-4 text-emerald-400">Canlı Veri Ürünü (/canli-sosyal-medya-nabzi)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-4 font-bold text-white">Veri Niteliği & Kaynak</td>
                  <td className="p-4">48 saatlik statik arşiv (Dondurulmuş JSON)</td>
                  <td className="p-4 text-emerald-300">Sonsuz canlı WebSocket akışı (Jetstream)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Kapsam ve Boyut</td>
                  <td className="p-4">7.658 gönderi, 7.092 düğüm, 37.206 kenar</td>
                  <td className="p-4 text-emerald-300">Saniyede yüzlerce çok dilli canlı olay akışı</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Analitik Yöntem</td>
                  <td className="p-4">Louvain modülerlik algoritması, Gephi ağ topolojisi</td>
                  <td className="p-4 text-emerald-300">5dk ve 1saat kayan pencere sayımı, anlık PPM debisi</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">İş Parçacığı & Mimari</td>
                  <td className="p-4">Tek seferlik statik yükleme ve D3.js çizimi</td>
                  <td className="p-4 text-emerald-300">Web Worker üzerinde arka planda sürekli kovalama</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Kopma & Ağ Direnci</td>
                  <td className="p-4">Statik dosya olduğu için kopma durumu yoktur</td>
                  <td className="p-4 text-emerald-300">Manuel kopma, üstel geri çekilme ve bayat veri dondurma</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Yasal Uyum & KVKK</td>
                  <td className="p-4">Retrospektif anonimleştirilmiş etiketler</td>
                  <td className="p-4 text-emerald-300">%100 Sıfır Veri Saklama (Zero Data Retention)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ======================================================================
            5. CANLI KOKPİT BİLEŞENLERİ VE GÖRÜNÜM
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-emerald-400 pl-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              Bölüm 4 • Kullanıcı Deneyimi & Tasarım
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Canlı Dashboard Kokpiti ve Görsel Bileşenler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#110e1c] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold block">01 • DÖRT TEMEL KPI KARTI</span>
              <h3 className="text-base font-bold text-white">Tam Senkronize Göstergeler</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Akış debisi (PPM ve /sn), son 5 dakikadaki tekil etiket sayısı, 1 saatlik kümülatif gönderi hacmi ve aktif dil sayacı; filtre değiştiğinde tek doğruluk kaynağından tüm panoya aynı anda yansıtılır.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#110e1c] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-purple-400 font-bold block">02 • BİRİNCİL SVG HIZ GRAFİĞİ</span>
              <h3 className="text-base font-bold text-white">Ayrık Koordinatlı Çubuklar</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Flexbox esnemesi sonucu oluşan opak mor blok sorunu kalıcı olarak giderilmiştir. `viewBox=&quot;0 0 600 210&quot;` koordinat sisteminde kenarları yuvarlatılmış, genişliği 8-24px ile sınırlandırılmış, Y-ekseni kılavuzları ve erişilebilir tablo alternatifi bulunan SVG grafiği kullanılmıştır.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#110e1c] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-[#c77dff] font-bold block">03 • ÇOK DİLLİ FİLTRE ÇEKİRDEĞİ</span>
              <h3 className="text-base font-bold text-white">Dinamik Dil Ayrıştırma</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Yalnızca Türkçe veya İngilizce değil; `tr`, `en`, `gl`, `de`, `es`, `fr`, `pt` ve bilinmeyen `und` dilleri akıştan dinamik olarak türetilir. Bir dil seçildiğinde sadece o dilin etiketleri ve gönderileri izole edilir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#110e1c] border border-white/10 space-y-3">
              <span className="text-xs font-mono text-amber-400 font-bold block">04 • BAYAT VERİ & KOPMA GARANTİSİ</span>
              <h3 className="text-base font-bold text-white">Orijinal Zaman Damgasıyla Dondurma</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                &ldquo;Bağlantıyı Kes&rdquo; butonuna basıldığında WebSocket anında kapatılır, sarı bayat veri uyarısı belirmeye devam eder ve verinin üretildiği son başarılı anlık görüntü zamanı dondurulur. Dil değişimi veya geciken iletiler uyarıyı asla bozamaz.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================================
            6. DOĞRULANAN TEST BULGULARI VE KALİTE GÜVENCESİ
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-purple-400 pl-4">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
              Bölüm 5 • Doğrulama & Kanıtlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Doğrulanan Test Sonuçları & Kalite Güvencesi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#110e1c] border border-emerald-500/40">
              <div className="text-2xl font-extrabold text-emerald-400 mb-1">119 / 119</div>
              <strong className="text-white block mb-1">Pulse Otomasyon Testi</strong>
              <p className="text-[11px] text-slate-400 font-sans">
                Çok dilli fikstürler, kayan pencere zaman aşımı, PPM serisi, kopma yaşam döngüsü ve gizlilik kanıtı testlerinin tamamı sıfır hatayla geçti (`npm run test:pulse`).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#110e1c] border border-[#b829ea]/40">
              <div className="text-2xl font-extrabold text-[#e0aaff] mb-1">23 / 23</div>
              <strong className="text-white block mb-1">Portfolyo Regresyon Testi</strong>
              <p className="text-[11px] text-slate-400 font-sans">
                Footer izolasyonu, boş video durumları, Gym Churn istatistiksel hesaplamaları ve site kimlik kontrolleri doğrulandı (`npm run test:regression`).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#110e1c] border border-blue-500/40">
              <div className="text-2xl font-extrabold text-blue-400 mb-1">13 / 13</div>
              <strong className="text-white block mb-1">Üretim Derlemesi</strong>
              <p className="text-[11px] text-slate-400 font-sans">
                Next.js App Router altındaki 13 rotanın tamamı statik/kısmi ön-derleme ile hatasız derlendi (`npm run build`).
              </p>
            </div>
          </div>

          {/* Gerçek Mobil Lighthouse Sonuçları */}
          <div className="p-6 rounded-2xl bg-[#140f26]/90 border border-white/10 space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <strong className="text-white text-sm flex items-center gap-2">
                <i className="fa-solid fa-gauge-high text-emerald-400" />
                <span>Doğrulanmış Vercel Preview Mobil Lighthouse Sonuçları</span>
              </strong>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">Commit 01558ba</span>
                <span>•</span>
                <span>docs/evidence/lighthouse/</span>
              </div>
            </div>

            {/* 4 Ana Lighthouse Skoru */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-3xl font-extrabold text-emerald-400 block">97</span>
                <span className="text-xs text-slate-200 font-bold mt-1 block">Performance</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5 font-sans">Vercel Preview Mobil</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-3xl font-extrabold text-emerald-400 block">96</span>
                <span className="text-xs text-slate-200 font-bold mt-1 block">Accessibility</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5 font-sans">WCAG 2.1 AA Uyumlu</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-3xl font-extrabold text-emerald-400 block">100</span>
                <span className="text-xs text-slate-200 font-bold mt-1 block">Best Practices</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5 font-sans">Kusursuz Skor</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <span className="text-3xl font-extrabold text-emerald-400 block">100</span>
                <span className="text-xs text-slate-200 font-bold mt-1 block">SEO</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5 font-sans">Kusursuz Skor</span>
              </div>
            </div>

            {/* Ayrıntılı Core Web Vitals Metrikleri */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center pt-1 font-mono">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">FCP (İlk Boyama)</span>
                <strong className="text-white text-sm font-bold">1.7 s</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">LCP (En Büyük Boyama)</span>
                <strong className="text-white text-sm font-bold">2.2 s</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">TBT (Engelleme Süresi)</span>
                <strong className="text-emerald-400 text-sm font-bold">120 ms</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-slate-400 block">CLS (Düzen Kayması)</span>
                <strong className="text-emerald-400 text-sm font-bold">0</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">Speed Index</span>
                <strong className="text-white text-sm font-bold">1.7 s</strong>
              </div>
            </div>

            {/* Kanıt Ekran Görüntüleri ve Ölçüm Ortamı Ayrımı */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-slate-300 font-sans leading-relaxed">
              <div className="flex items-center gap-2 text-white font-mono font-bold text-xs">
                <i className="fa-solid fa-camera text-[#b829ea]" />
                <span>Lighthouse Kanıt Ekran Görüntüleri ve Ortam Ayrımı:</span>
              </div>
              <p className="text-[11px] text-slate-300 m-0">
                - <strong>Puan Kartı Kanıtı:</strong> <code className="text-[#e0aaff]">docs/lighthouse/vercel-preview-lighthouse-mobile-score.png</code> (Performans 97, Erişilebilirlik 96, Best Practices 100, SEO 100).<br />
                - <strong>Metrikler Kanıtı:</strong> <code className="text-[#e0aaff]">docs/lighthouse/vercel-preview-lighthouse-mobile-metrics.png</code> (FCP 1.7s, LCP 2.2s, TBT 120ms, CLS 0, Speed Index 1.7s).
              </p>
              <p className="text-[11px] text-slate-400 m-0 pt-1 border-t border-white/5">
                <strong>Önemli Metodolojik Ayrım:</strong> İlk geliştirme safhasında yerel dev server üzerinde alınan ölçümlerde (Performans 50; yerel dev derlemesi, harici CSS blokajı ve yerel parçacık animasyonu nedeniyle yüksek TBT oluşmuştu), yerel sonuçlar kesinlikle canlı dağıtım sonucu olarak sunulmamıştır. <code className="text-emerald-400">01558ba</code> commit&apos;i ile Font Awesome kritik olmayan asenkron preloading&apos;e alınmış, 27 ikon inline SVG&apos;ye çevrilmiş, arka plan parçacıkları mobilde 16&apos;ya düşürülmüş ve uyarı kartları sabit alt düzene çekilerek CLS sıfırlanmıştır. Vercel Preview CDN üzerindeki gerçek mobil denetimde <strong>97 Performans</strong> ve <strong>96 Erişilebilirlik</strong> doğrulanmıştır.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================================
            7. KULLANICI TESTİ RAPORU (2 KATILIMCI, 3 GÖREV)
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-blue-400 pl-4">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
              Bölüm 6 • Kullanılabilirlik Doğrulaması
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Kullanıcı Testi Raporu (2 Katılımcı, 3 Görev)
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
            <i className="fa-solid fa-check-circle mr-1.5 text-emerald-400" />
            <strong>Akademik Dürüstlük Beyanı & Gerçek Test Oturumu:</strong> Bu bölümdeki bulgular, iki gönüllü katılımcı (arkadaş) ile canlı Vercel Preview uygulaması üzerinde bizzat yürütülen gerçek kullanılabilirlik testlerinin kronometrik ölçümlerine ve gözlemlerine dayanmaktadır. Hiçbir süre veya bulgu uydurulmamıştır.
          </div>

          <div className="p-6 rounded-2xl bg-[#110e1c] border border-white/10 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-emerald-400 block mb-1">Katılımcı 1 (P1 - Arkadaş 1)</strong>
                <span className="text-slate-300 block text-[11px] font-sans">Masaüstü Chrome • Günlük sosyal medya kullanıcısı</span>
                <span className="text-slate-400 block text-[10px] mt-1">Toplam Test Süresi: <strong>100 saniye</strong> (Görev 1: 10 sn, Görev 2: 55 sn, Görev 3: 35 sn)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-purple-400 block mb-1">Katılımcı 2 (P2 - Arkadaş 2)</strong>
                <span className="text-slate-300 block text-[11px] font-sans">Mobil Safari • Web arayüzlerine aşina son kullanıcı</span>
                <span className="text-slate-400 block text-[10px] mt-1">Toplam Test Süresi: <strong>75 saniye</strong> (Katılımcı 1&apos;den 25 saniye daha hızlı)</span>
              </div>
            </div>

            {/* Gerçek Sonuç Tablosu */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#140f26] text-slate-300 border-b border-white/10">
                  <tr>
                    <th className="p-3">Katılımcı</th>
                    <th className="p-3">Görev Adı & Tanımı</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3">Kaydedilen Süre</th>
                    <th className="p-3">Gözlem & Notlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="p-3 font-bold text-white">Katılımcı 1</td>
                    <td className="p-3">Görev 1: Dil filtresi seçimi ve lider etiketi tespit etme</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">✓ Başarılı</span></td>
                    <td className="p-3 font-bold text-emerald-300">10 sn</td>
                    <td className="p-3 text-[11px] font-sans text-slate-300">Filtre hızla seçildi, lider etiket gecikmesiz okundu. Belirgin bir zorluk yaşanmadı.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Katılımcı 1</td>
                    <td className="p-3">Görev 2: Son 5 dakika ile son 1 saati karşılaştırma</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">✓ Başarılı</span></td>
                    <td className="p-3 font-bold text-emerald-300">55 sn</td>
                    <td className="p-3 text-[11px] font-sans text-slate-300">5 dakikalık debi ile 1 saatlik kümülatif hacim arasındaki fark ve grafik incelendi.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Katılımcı 1</td>
                    <td className="p-3">Görev 3: Akış bağlantısını kesme, bayat veri uyarısını yorumlama ve yeniden bağlanma</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">✓ Başarılı</span></td>
                    <td className="p-3 font-bold text-emerald-300">35 sn</td>
                    <td className="p-3 text-[11px] font-sans text-slate-300">Bağlantı kesildi, sarı bayat veri uyarısı fark edildi, son veri saati okundu ve bağlantı yeniden başlatıldı.</td>
                  </tr>
                  <tr className="bg-emerald-500/[0.05]">
                    <td className="p-3 font-bold text-emerald-300">Katılımcı 1 (Toplam)</td>
                    <td className="p-3 font-bold text-white">3 Görevin Tamamı</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">✓ Başarılı</span></td>
                    <td className="p-3 font-bold text-emerald-300">100 sn</td>
                    <td className="p-3 text-[11px] font-sans text-slate-300">Toplam süre 100 saniye olarak kronometreyle kaydedildi.</td>
                  </tr>
                  <tr className="bg-purple-500/[0.05]">
                    <td className="p-3 font-bold text-[#e0aaff]">Katılımcı 2 (Toplam)</td>
                    <td className="p-3 font-bold text-white">Görev 1 + Görev 2 + Görev 3</td>
                    <td className="p-3"><span className="text-emerald-400 font-bold">✓ Başarılı</span></td>
                    <td className="p-3 font-bold text-[#e0aaff]">75 sn*</td>
                    <td className="p-3 text-[11px] font-sans text-slate-300">Katılımcı 1&apos;den 25 saniye daha hızlı bitirdi. Belirgin bir zorluk bildirmedi. *Görev bazlı münferit süreler ayrı kaydedilmediği için yapay olarak dağıtılmamıştır.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Nitel Gözlemler ve Gözlem / Yorum Ayrımı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs font-sans">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <strong className="text-emerald-400 font-mono block">1. Kullanılabilirlik & Görev Akışı</strong>
                <p className="text-slate-300 leading-relaxed text-[11px] m-0">
                  Her iki katılımcı da görevleri yerine getirirken <strong>belirgin bir zorluk veya kafa karışıklığı bildirmedi</strong>. Özellikle çok dilli filtrelemenin hızı ve bağlantı kesildiğinde beliren sabit sarı uyarı kartının netliği kullanıcılar tarafından takdir edildi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 space-y-2">
                <strong className="text-amber-400 font-mono block">2. Gözlemlenen Arayüz Davranışı (Filtre Titremesi)</strong>
                <p className="text-slate-300 leading-relaxed text-[11px] m-0">
                  <strong>Olgusal Gözlem:</strong> Filtre kontrolleri kapatılıp yeniden açılırken etiket filtresi kutusunda kısa süreli bir görsel titreme / kırpışma (visual flicker) gözlemlendi. Filtre tıklanabilir ve seçilebilir kalmaya devam etti; görevlerin tamamlanmasını engellemedi. <br />
                  <strong className="text-amber-300 font-mono text-[10px]">Dürüstlük Durumu:</strong> Bu titreme mevcut sürümde henüz düzeltilmemiştir; bir sonraki geliştirme döngüsü (backlog) için not alınmıştır (düzeltildiği iddia edilmemektedir).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            8. DEMO VİDEO SENARYOSU & ÇEKİM PLANI (YAKLAŞIK 60 SANİYE)
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-red-400 pl-4">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
              Bölüm 7 • Video Sunum Planı & Durumu
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Demo Video Senaryosu & Durumu (~60 Saniye)
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#110e1c] border border-white/10 space-y-4 text-xs font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-slate-400">Format: 1080p MP4 • Dil: Türkçe</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">Kayıt: Tamamlandı (~60 sn)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">Genel URL: Bekleniyor</span>
              </div>
            </div>

            <div className="space-y-3 font-sans text-slate-300 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-emerald-400 font-mono block mb-1">00:00 - 00:15 | Sahne 1: Giriş ve Canlı Akışa Bağlantı</strong>
                <p className="m-0 leading-relaxed">
                  <em>Görsel:</em> Ana sayfadan &ldquo;Canlı Ürünü Aç&rdquo; butonuna tıklanır; sayfa açılır ve yeşil &ldquo;Canlı Akış Aktif&rdquo; rozeti ile canlı olay sayacının arttığı gösterilir. <br />
                  <em>Seslendirme:</em> &ldquo;Merhaba, BVA 2245 kapsamında geliştirdiğim Canlı Sosyal Medya Nabzı ürünündeyiz. Şu anda Bluesky AT Protocol Jetstream WebSocket akışına doğrudan bağlıyız ve saniyede yüzlerce gönderi UI thread&apos;i bloke etmeden Web Worker üzerinde gerçek zamanlı işleniyor.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-[#c77dff] font-mono block mb-1">00:15 - 00:30 | Sahne 2: Çok Dilli Filtreleme ve KPI Senkronizasyonu</strong>
                <p className="m-0 leading-relaxed">
                  <em>Görsel:</em> Dil dropdown&apos;ı açılır. `Türkçe`, `İngilizce` ve `Galiçyaca` seçilir; 4 KPI kartı ve detay tablosunun anında güncellendiği gösterilir. <br />
                  <em>Seslendirme:</em> &ldquo;Sistemimiz çok dilli mimariye sahiptir. Dil seçiciyi İngilizceye aldığımızda KPI kartları, son 5 dakikanın lider etiketleri ve dakikalık hız grafiği yalnızca İngilizce gönderileri izole ederek güncellenir.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-blue-400 font-mono block mb-1">00:30 - 00:45 | Sahne 3: Birincil SVG Hız Grafiği & Tablo Alternatifi</strong>
                <p className="m-0 leading-relaxed">
                  <em>Görsel:</em> Dakikalık hız grafiğindeki ayrık çubukların üzerine gelinir, tooltip gösterilir; ardından &ldquo;Tablo Alternatifi&rdquo; butonuna basılarak erişilebilir tablo gösterilir. <br />
                  <em>Seslendirme:</em> &ldquo;Birincil hız grafiğimiz ayrık SVG koordinatlarında çizilir. Ekran okuyucu kullanıcıları için tek tıkla tam erişilebilir alternatif tablo görünümüne geçiş yapılabilmektedir.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-400 block mb-1">
                <strong className="text-amber-400 font-mono block mb-1">00:45 - 00:55 | Sahne 4: Manuel Bağlantıyı Kesme & Bayat Veri Garantisi</strong>
                <p className="m-0 leading-relaxed">
                  <em>Görsel:</em> &ldquo;Bağlantıyı Kes&rdquo; butonuna basılır; sarı uyarı panosu orijinal dondurma saatiyle belirir. Dil değiştirilir ve uyarının kaybolmadığı kanıtlanır. <br />
                  <em>Seslendirme:</em> &ldquo;Bağlantıyı kestiğimiz anda sistem dondurulan son geçerli kaydı orijinal saat damgasıyla saklar. Dil değiştirsek dahi bayat veri uyarısı kararlı kalır; sahte veri üretilmez.&rdquo;
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <strong className="text-purple-400 font-mono block mb-1">00:55 - 01:00 | Sahne 5: Veri Minimizasyonu & Kapanış</strong>
                <p className="m-0 leading-relaxed">
                  <em>Görsel:</em> Alt kısımdaki gizlilik politikası panosu gösterilir. <br />
                  <em>Seslendirme:</em> &ldquo;KVKK ve GDPR gereğince kullanıcı kimliği ve ham metinler asla diske yazılmaz, sıfır veri saklama ilkesiyle anında imha edilir. Teşekkür ederim.&rdquo;
                </p>
              </div>
            </div>

            {/* Gerçek Video Gömme Konteyneri (Dürüst Durum Koruması) */}
            <div className="p-6 rounded-xl bg-black/60 border border-dashed border-white/20 text-center space-y-2 mt-4">
              <i className="fa-brands fa-youtube text-3xl text-red-500 mb-1" />
              <strong className="text-white block text-sm">Gerçek Video Gömme Alanı (Public URL Bekleniyor)</strong>
              <p className="text-slate-300 text-xs font-sans max-w-lg mx-auto m-0">
                Yaklaşık 60 saniyelik Türkçe demo videosu öğrenci <strong>Metehan Gezer</strong> tarafından yukarıdaki çekim senaryosuna göre kaydedilmiştir. Herkese açık bir YouTube veya Vimeo bağlantısı henüz sağlanmadığı için videonun yüklendiği ya da gömüldüğü iddia edilmemiştir. Genel bağlantı temin edildiğinde iframe bu alana yerleştirilecektir.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================================
            9. MEVCUT KISITLAR VE 1 HAFTA DAHA OLSAYDI NE YAPARDIM?
           ====================================================================== */}
        <section className="space-y-6">
          <div className="border-l-4 border-slate-400 pl-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Bölüm 8 • Kısıtlar & Gelecek Planı
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Mevcut Kısıtlar ve Bir Hafta Daha Olsaydı Ne Yapardım?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#110e1c] border border-white/10 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-400" />
                <span>Mevcut Teknik Kısıtlar</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 font-sans">
                <li>• <strong>İstemci Bellek Sınırı:</strong> Web Worker tarayıcı sekmesi içinde yaşar; sekme kapatıldığında akış kesilir, sunucu tarafında kalıcı bir Kafka/Redis kaydı tutulmaz.</li>
                <li>• <strong>Genel Ağ Hacim Dağılımı:</strong> Bluesky Jetstream akışında İngilizce ve Portekizce gönderi hacmi Türkçe gönderilerden çok daha yüksektir.</li>
                <li>• <strong>Tarihsel Derinlik:</strong> Sistem anlık son 60 dakikayı tutar; günlerce geriye dönük trend karşılaştırması yapamaz.</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#110e1c] border border-emerald-500/30 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-rocket text-emerald-400" />
                <span>Bir Hafta Daha Olsaydı Ne Yapardım?</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 font-sans">
                <li>• <strong>Edge Worker & Upstash Redis Entegrasyonu:</strong> Sunucu tarafında hafif bir Cloudflare/Vercel Edge Worker ile 24 saatlik kayan pencereleri sekme kapalıyken de güncel tutmak.</li>
                <li>• <strong>Canlı D3 Force-Directed Ağ Görselleştirmesi:</strong> Gelen gönderilerdeki çoklu etiketlerden anlık eş-oluşum matrisi hesaplayarak canlı düğüm-kenar ağı çizdirmek.</li>
                <li>• <strong>Web Push Kriz Alarmları:</strong> Ajans kullanıcısının takip ettiği kritik marka etiketlerinde ani debi sıçraması olduğunda tarayıcı bildirim alarmı tetiklemek.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* Alt Footer */}
      <footer className="border-t border-white/10 bg-[#0d0d0d] py-8 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            BVA 2245 • Canlı Sosyal Medya Nabzı Vaka Analizi • <strong className="text-white">Metehan Gezer</strong>
          </span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/canli-sosyal-medya-nabzi" className="text-emerald-400 hover:text-white transition-colors">
              Canlı Ürün
            </Link>
            <span>•</span>
            <Link href="/bluesky-hashtag-network" className="text-[#c77dff] hover:text-white transition-colors">
              Tarihsel Ağ Analizi
            </Link>
            <span>•</span>
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Portfolyo Ana Sayfa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
