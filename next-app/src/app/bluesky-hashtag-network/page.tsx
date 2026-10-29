'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CyberCanvas } from '@/components/CyberCanvas';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export default function BlueskyNetworkPage() {
  const { blueskyProject } = PORTFOLIO_DATA;

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
    <div className="bluesky-page-root min-h-screen bg-[#0d0d0d] text-slate-100 relative selection:bg-[#b829ea] selection:text-white overflow-x-clip">
      {/* Background Interactive Cyber Canvas */}
      <CyberCanvas />

      {/* Top Sticky Navigation Header */}
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
              PROJE: <span className="text-[#b829ea] font-bold">Sosyal Ağ Analizi (SNA)</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden md:inline-flex font-mono text-xs px-3 py-1 rounded-full bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/35">
              NetworkX • Louvain • D3.js
            </span>
            <a
              href={blueskyProject.deliverables.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-slate-300 hover:text-[#b829ea] border border-white/10 transition-colors"
              title="GitHub Deposu"
            >
              <i className="fa-brands fa-github text-sm" />
            </a>
          </div>
        </div>
      </header>

      {/* ======================================================================
          1. HERO SECTION (Açılış Başlığı & Metrikler)
         ====================================================================== */}
      <section
        className="hero-story-section min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center text-center relative px-4 sm:px-6 py-16"
        id="story-hero"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Academic & Dataset Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/40 mb-6 shadow-[0_0_15px_rgba(184,41,234,0.2)] animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AKADEMİK ÇALIŞMA</span>
            <span>•</span>
            <span>BLUESKY 48 SAATLİK ARŞİV ANALİZİ</span>
          </div>

          {/* Catchy Academic Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight !leading-tight mb-6 max-w-3xl">
            Bluesky Turkish Hashtag Network:{' '}
            <span className="bg-gradient-to-r from-[#e0aaff] via-[#b829ea] to-[#7b2cbf] bg-clip-text text-transparent">
              Türkçe Gönderi Akışında Topluluk Kümeleri ve Ağ Topolojisi
            </span>
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
            Merkeziyetsiz sosyal protokol Bluesky üzerinde Türkçe içerik üreten kullanıcıların paylaştığı 48 saatlik kesintisiz arşivden elde edilen 7.658 etiketli gönderi, 7.092 düğüm ve 37.206 eş-oluşum kenarı. Louvain modülerlik algoritması ile dijital kamuoyunun tematik kümelenmesi ve merkeziyet dinamikleri.
          </p>

          {/* Explicit Historical Archive Clarification */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-8 max-w-xl text-center">
            <i className="fa-solid fa-triangle-exclamation text-amber-400 shrink-0" />
            <span>
              <strong>Tarihsel Arşiv Notu:</strong> Bu çalışma 48 saatlik veri toplama penceresine ait retrospektif bir akademik vaka analizidir; anlık canlı yayınlanan bir akış ürünü değildir.
            </span>
          </div>

          {/* Author & Meta Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 font-mono text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-user-astronaut text-[#b829ea]" />
              <span>Yazar: <strong className="text-white">Metehan Gezer</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-graduation-cap text-[#b829ea]" />
              <span>MCBÜ Büyük Veri Analistliği</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-regular fa-clock text-[#b829ea]" />
              <span>Veri Penceresi: 48 Saat</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-regular fa-bookmark text-[#b829ea]" />
              <span>Okuma Süresi: ~6 Dakika</span>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <button
            type="button"
            onClick={() => scrollToSection('research-context')}
            className="group flex flex-col items-center gap-2 text-xs font-mono text-[#c77dff] hover:text-white transition-all cursor-pointer focus:outline-none"
            aria-label="Aşağı Kaydırın"
          >
            <span className="tracking-widest uppercase font-bold text-[11px] group-hover:scale-105 transition-transform">
              Araştırma Detaylarına İn
            </span>
            <div className="w-9 h-9 rounded-full bg-[#161028] border border-[#b829ea] shadow-[0_0_15px_rgba(184,41,234,0.5)] flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(184,41,234,0.8)] transition-all animate-bounce">
              <i className="fa-solid fa-chevron-down text-sm text-[#e0aaff]" />
            </div>
          </button>
        </div>
      </section>

      {/* ======================================================================
          2. KEY VERIFIED METRICS GRID
         ====================================================================== */}
      <section className="py-12 sm:py-16 bg-[#0a0812] border-t border-b border-white/5 relative" id="research-metrics">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-2">
              <i className="fa-solid fa-chart-pie text-[#b829ea]" />
              <span className="uppercase font-bold">Doğrulanmış Çizge Parametreleri</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ağ Büyüklüğü ve Arşiv Özeti
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#e0aaff] font-mono">48 Saat</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Kesintisiz Arşiv Toplama Penceresi</span>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-400 font-mono">7.658</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Hashtag İçeren Türkçe Gönderi</span>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#c77dff] font-mono">7.092</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Ağ Düğümü (Tekil Hashtag)</span>
            </div>
            <div className="p-4 sm:p-5 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center shadow-lg">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">37.206</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Ağ Kenarı (Eş-oluşum Bağlantısı)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. RESEARCH QUESTION & CONTEXT (Bağlam & Araştırma Sorusu)
         ====================================================================== */}
      <section className="py-16 sm:py-20 relative" id="research-context">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
              <i className="fa-solid fa-compass text-[#b829ea]" />
              <span className="uppercase font-bold">Problem Tanımı & Hedefler</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Araştırma Sorusu ve Bağlam
            </h2>
          </div>

          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            <p>
              Geleneksel merkezi sosyal ağların algoritmik kısıtlamalarına alternatif olarak doğan <strong className="text-white font-semibold">Bluesky (AT Protocol)</strong>, Türkiye&apos;deki teknoloji, akademi, medya ve sivil toplum çevrelerinde hızla büyüyen bir kullanıcı tabanına ulaşmıştır. Ancak merkeziyetsiz bir protokolde kullanıcıların bilgi yayılımı ve ortak ilgi alanları etrafında nasıl organize olduğu kritik bir araştırma konusudur.
            </p>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#140f26]/80 border border-[#b829ea]/40 space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase text-[#e0aaff] flex items-center gap-2">
                <i className="fa-solid fa-circle-question text-[#b829ea]" />
                <span>Temel Araştırma Soruları</span>
              </h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                <li>
                  <strong className="text-white">Ağ Topolojisi:</strong> Türkçe Bluesky gönderilerindeki etiket eş-oluşumları (hashtag co-occurrence) rastgele bir yapı mı, yoksa serbest ölçekli (scale-free) bir küçük-dünya ağı mı sergilemektedir?
                </li>
                <li>
                  <strong className="text-white">Topluluk Kümelenmesi:</strong> Louvain modülerlik algoritması uygulandığında Türkçe söylem hangi tematik ve sosyolojik kümelerde toplanmaktadır?
                </li>
                <li>
                  <strong className="text-white">Merkeziyet ve Köprüler:</strong> Ağda en yüksek derece ve arasındalık (betweenness) değerine sahip kritik etiketler hangileridir?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          4. METHODOLOGY (Yöntem & Veri İşleme Boru Hattı)
         ====================================================================== */}
      <section className="py-16 sm:py-20 bg-[#0a0812] border-t border-b border-white/5 relative" id="methodology">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
              <i className="fa-solid fa-gears text-[#b829ea]" />
              <span className="uppercase font-bold">Analitik Boru Hattı</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Metodoloji ve Veri İşleme Süreci
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#120e21] border border-white/10 hover:border-[#b829ea]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center font-mono font-bold text-xs text-[#e0aaff]">
                  01
                </span>
                <h3 className="text-base font-bold text-white">Veri Toplama & Filtreleme</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Bluesky Firehose ve genel akış API uç noktalarından Türkçe dil bayrağına sahip veya Türkçe karakter örüntüsü taşıyan 48 saatlik ham post akışı dinlendi. Yalnızca geçerli hashtag içeren 7.658 gönderi filtrelendi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#120e21] border border-white/10 hover:border-[#b829ea]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center font-mono font-bold text-xs text-[#e0aaff]">
                  02
                </span>
                <h3 className="text-base font-bold text-white">Eş-Oluşum Çizgesi İnşası</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Aynı gönderide birlikte geçen her etiket çifti arasında yönsüz ve ağırlıklı (weighted undirected) bir kenar oluşturuldu. Toplamda 7.092 tekil düğüm ve 37.206 ağırlıklı kenardan oluşan devasa bir çizge matrisi elde edildi.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#120e21] border border-white/10 hover:border-[#b829ea]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center font-mono font-bold text-xs text-[#e0aaff]">
                  03
                </span>
                <h3 className="text-base font-bold text-white">Louvain Modülerlik Analizi</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Yüksek modülerlik skoru hedefleyen Louvain algoritmasıyla topluluk tespiti yapıldı. Ağ, içsel kenar yoğunluğu yüksek, dışsal kenar yoğunluğu düşük anlamlı alt kümelere ayrıştırıldı.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[#120e21] border border-white/10 hover:border-[#b829ea]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg bg-[#b829ea]/20 border border-[#b829ea]/40 flex items-center justify-center font-mono font-bold text-xs text-[#e0aaff]">
                  04
                </span>
                <h3 className="text-base font-bold text-white">Merkeziyet & Force-Directed Görselleştirme</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Derece (Degree), Arasındalık (Betweenness) ve Özvektör merkeziyetleri Python NetworkX ile hesaplandı. Gephi ve D3.js tabanlı interaktif kuvvet yönlendirmeli (force-directed) düzen ile web ortamına aktarıldı.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. COMMUNITY ANALYSIS FINDINGS (Bulgular & Kümelenme)
         ====================================================================== */}
      <section className="py-16 sm:py-20 relative" id="findings">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
              <i className="fa-solid fa-diagram-project text-[#b829ea]" />
              <span className="uppercase font-bold">Topluluk Tespiti Bulguları</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Ağdaki Başlıca Topluluk Kümeleri
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#140f26]/80 border border-purple-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <i className="fa-solid fa-landmark text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Küme 1: Politika, Gündem ve Haber Akışı</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ulusal gündem maddeleri, seçim tartışmaları ve güncel haber başlıkları etrafında şekillenen en yoğun kenar ağırlığına sahip küme. Kullanıcıların haberleri teyit etmek ve görüş bildirmek amacıyla çoklu etiket kullandığı görülmektedir.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140f26]/80 border border-blue-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                <i className="fa-solid fa-code text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Küme 2: Teknoloji, Yazılım & Açık Kaynak</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Yapay zeka modelleri, Python, Linux, açık protokoller ve web geliştirme eksenli teknik tartışmalar. Bluesky&apos;ın erken benimseyen geliştirici kitlesinin yüksek modülerlik gösterdiği ve ağlar arası köprü vazifesi gördüğü saptanmıştır.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140f26]/80 border border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <i className="fa-solid fa-clapperboard text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Küme 3: Popüler Kültür, Sinema, Dizi & Müzik</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Film önerileri, kült diziler, müzik listeleri ve edebiyat paylaşımlarını kapsayan yaratıcı üretim topluluğu. Görece daha düşük yoğunluklu ancak farklı kümelerle çapraz etkileşimi yüksek bir dağılım göstermektedir.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140f26]/80 border border-emerald-500/30 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <i className="fa-solid fa-users text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Küme 4: Gündelik Yaşam & Platform Tanışma</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Platforma yeni katılan kullanıcıların birbirini keşfetme, &quot;hoş geldin&quot; paylaşımları ve sosyal çevre kurma etiketleri. Bu küme, ağın periferisinden merkeze doğru yeni düğüm akışını besleyen dinamik bir geçiş katmanıdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          6. EMBEDDED INTERACTIVE GRAPH SECTION (Responsive Iframe, >= 800px on desktop)
         ====================================================================== */}
      <section className="py-16 sm:py-20 bg-[#0a0812] border-t border-b border-white/5 relative" id="interactive-network">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#c77dff] bg-[#b829ea]/15 border border-[#b829ea]/30">
                  <i className="fa-solid fa-circle-nodes text-[10px]" />
                  <span>D3.js & Gephi Etkileşimli Çizge</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>İnteraktif Görselleştirme</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                İnteraktif Ağ Görselleştirmesi
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Düğümleri fare ile sürükleyebilir, tekerlek ile yakınlaşıp uzaklaşabilir ve etiket kümelerinin bağlantı ağırlıklarını doğrudan keşfedebilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={blueskyProject.deliverables.interactive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#b829ea] hover:bg-[#9d17cb] border border-[#e0aaff]/40 shadow-[0_0_15px_rgba(184,41,234,0.4)] transition-all"
              >
                <i className="fa-solid fa-arrow-up-right-from-square" />
                <span>Tam Ekranda Aç</span>
              </a>
            </div>
          </div>

          {/* Responsive Embedded Iframe Container (At least 800px on desktop) */}
          <div className="w-full bg-[#110e1c] border border-[#b829ea]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(184,41,234,0.2)] rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-[#140f26]/90 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Kaynak: meterrgt.github.io/sosyal-ag-hashtag-analizi/interactive.html</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">
                7.092 Düğüm • 37.206 Kenar
              </span>
            </div>

            <div className="w-full relative bg-[#0a0a0f] min-h-[500px] sm:min-h-[650px] md:min-h-[800px] h-[500px] sm:h-[650px] md:h-[800px] lg:h-[860px]">
              <iframe
                src={blueskyProject.deliverables.interactive}
                title="Bluesky Turkish Hashtag Network İnteraktif Çizgesi"
                className="w-full h-full border-0 block"
                loading="lazy"
                allow="fullscreen"
              />
            </div>

            <div className="px-5 py-3 bg-[#140f26]/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-hand-pointer text-[#b829ea]" />
                <span>İpucu: Düğümlere tıklayarak komşuluk ilişkilerini ve modülerlik küme renklerini inceleyebilirsiniz.</span>
              </span>
              <a
                href={blueskyProject.deliverables.interactive}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c77dff] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Ayrı sekmede görüntüle</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          7. LIMITATIONS & ETHICAL FRAMING (Kısıtlar & Çerçeve)
         ====================================================================== */}
      <section className="py-16 sm:py-20 relative" id="limitations">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 mb-3">
              <i className="fa-solid fa-scale-balanced text-amber-400" />
              <span className="uppercase font-bold">Akademik Kısıtlar & Kapsam</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Metodolojik Kısıtlar ve Değerlendirme
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <strong className="text-white block mb-1">1. Zaman Penceresi Kısıtı (48 Saatlik Arşiv):</strong>
              <p className="text-xs sm:text-sm text-slate-300 m-0">
                Veriler 48 saatlik kesintisiz bir zaman penceresinde toplanmıştır. Elde edilen bulgular o zaman dilimindeki güncel gündem ve aktif kullanıcı kitlesini yansıtır; platformun tüm yıllık dinamiklerini genellemez.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <strong className="text-white block mb-1">2. Etiket (Hashtag) Temsiliyeti:</strong>
              <p className="text-xs sm:text-sm text-slate-300 m-0">
                Çizge yalnızca açıkça hashtag kullanan gönderilerden oluşturulmuştur. Metin içinde anahtar kelime kullandığı halde etiket işareti koymayan gönderiler bu eş-oluşum matrisine dahil edilmemiştir.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <strong className="text-white block mb-1">3. Canlı Akış Ürünü Değildir:</strong>
              <p className="text-xs sm:text-sm text-slate-300 m-0">
                Bu proje gerçek zamanlı bir sosyal dinleme servisi değil; veri madenciliği, ağ bilimi ve modülerlik algoritmalarını test eden akademik bir retrospektif araştırma çıktısıdır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          8. ACADEMIC DELIVERABLES & RESOURCES (Teslimatlar & Belgeler)
         ====================================================================== */}
      <section className="py-16 sm:py-20 bg-[#0a0812] border-t border-white/5 relative" id="deliverables">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-2">
              <i className="fa-solid fa-folder-open text-[#b829ea]" />
              <span className="uppercase font-bold">Akademik Teslimatlar</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Rapor, Poster, Sunum ve Kaynak Kodlar
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              Araştırma sürecine ait tüm doğrulanmış akademik belgeler ve interaktif çizge bağlantıları aşağıda listelenmiştir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Report Card */}
            <a
              href={blueskyProject.deliverables.report}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#140f26]/80 border border-white/10 hover:border-red-500/50 hover:bg-[#191230] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-regular fa-file-pdf text-lg" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-red-300 transition-colors">
                Akademik Rapor (PDF)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Araştırma hipotezleri, veri toplama metodolojisi, Louvain algoritmik detayları ve sonuç tartışmaları.
              </p>
              <span className="text-xs font-mono text-red-400 font-semibold inline-flex items-center gap-1.5">
                <span>Raporu Oku</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </span>
            </a>

            {/* Poster Card */}
            <a
              href={blueskyProject.deliverables.poster}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#140f26]/80 border border-white/10 hover:border-purple-500/50 hover:bg-[#191230] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-image text-lg" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                A3 Akademik Poster (PDF)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Yüksek çözünürlüklü Gephi ağ haritası, küme renk kodları ve özet metrik tablolarını içeren görsel poster.
              </p>
              <span className="text-xs font-mono text-purple-400 font-semibold inline-flex items-center gap-1.5">
                <span>Posteri İncele</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </span>
            </a>

            {/* Presentation Card */}
            <a
              href={blueskyProject.deliverables.presentation}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#140f26]/80 border border-white/10 hover:border-amber-500/50 hover:bg-[#191230] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chalkboard-user text-lg" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                Proje Sunumu (PDF)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Ders kurulu ve jüri sunumu için hazırlanan slayt destesi ve temel bulgu grafikleri.
              </p>
              <span className="text-xs font-mono text-amber-400 font-semibold inline-flex items-center gap-1.5">
                <span>Sunumu Aç</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </span>
            </a>

            {/* GitHub Repository Card */}
            <a
              href={blueskyProject.deliverables.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#140f26]/80 border border-white/10 hover:border-[#b829ea]/50 hover:bg-[#191230] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-github text-lg" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#c77dff] transition-colors">
                GitHub Deposu
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Python veri toplama kodları, NetworkX analiz script&apos;leri ve veri temizleme adımları.
              </p>
              <span className="text-xs font-mono text-[#c77dff] font-semibold inline-flex items-center gap-1.5">
                <span>MeterrGT / sosyal-ag-hashtag-analizi</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </span>
            </a>

            {/* Live Interactive Graph Card */}
            <a
              href={blueskyProject.deliverables.interactive}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#140f26]/80 border border-white/10 hover:border-emerald-500/50 hover:bg-[#191230] transition-all group sm:col-span-2 lg:col-span-2"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-share-nodes text-lg" />
              </div>
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Bağımsız İnteraktif Ağ Grafiği (Web)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Tarayıcıda tam ekran performansıyla çalışan, D3.js ve Gephi dışa aktarımıyla üretilmiş interaktif kuvvet yönlendirmeli ağ haritası.
              </p>
              <span className="text-xs font-mono text-emerald-400 font-semibold inline-flex items-center gap-1.5">
                <span>Tam Ekranda İnteraktif Çizgeyi Aç</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================================
          9. FOOTER
         ====================================================================== */}
      <footer className="footer-story-section py-12 bg-[#08060f] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 text-center sm:text-left">
            <div>
              <span className="text-lg font-extrabold text-white">
                Metehan <span className="text-[#b829ea]">Gezer</span>
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Manisa Celal Bayar Üniversitesi • Büyük Veri Analistliği
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={blueskyProject.deliverables.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all"
              >
                <i className="fa-brands fa-github text-xs" />
                <span>GitHub</span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-[#b829ea]/20 hover:bg-[#b829ea]/35 border border-[#b829ea]/50 text-[#e0aaff] transition-all"
              >
                <i className="fa-solid fa-house text-xs" />
                <span>Portfolyoya Dön</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <span>© 2026 Metehan Gezer • Sosyal Ağ Analizi (SNA) Çalışması</span>
            <Link
              href="/"
              className="text-[#c77dff] hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Portfolyo Ana Sayfasına Dön</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
