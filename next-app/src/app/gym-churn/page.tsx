'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { CyberCanvas } from '@/components/CyberCanvas';
import { ScrollyDataViz } from '@/components/ScrollyDataViz';
import { ReaderExploration } from '@/components/ReaderExploration';

export default function GymChurnPage() {
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
    <div className="gym-churn-page-root min-h-screen bg-[#0d0d0d] text-slate-100 relative selection:bg-[#b829ea] selection:text-white overflow-x-clip">
      {/* Background Interactive Cyber Canvas */}
      <CyberCanvas />

      {/* Cyberpunk Top Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-[#b829ea]/30 shadow-2xl shadow-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-[#e0aaff] bg-[#b829ea]/15 hover:bg-[#b829ea]/25 border border-[#b829ea]/50 shadow-[0_0_12px_rgba(184,41,234,0.3)] transition-all"
            >
              <i className="fa-solid fa-arrow-left text-xs" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <span className="hidden sm:inline-block font-mono text-xs text-slate-400">
              PROJE: <span className="text-[#b829ea] font-bold">Veri Hikayesi (Data Story)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex font-mono text-xs px-3 py-1 rounded-full bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/35">
              D3.js v7 + Scrollama v3
            </span>
            <a
              href="https://github.com/MeterrGT"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-slate-300 hover:text-[#b829ea] border border-white/10 transition-colors"
              title="GitHub Profilim"
            >
              <i className="fa-brands fa-github text-sm" />
            </a>
          </div>
        </div>
      </header>

      {/* ======================================================================
          1. HERO SECTION (Açılış - Full Height Intro with Catchy Finding)
         ====================================================================== */}
      <section
        className="hero-story-section min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center text-center relative px-4 sm:px-6 py-16"
        id="story-hero"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Academic Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/40 mb-6 shadow-[0_0_15px_rgba(184,41,234,0.2)] animate-fadeIn">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AKADEMİK VERİ HİKAYESİ</span>
            <span>•</span>
            <span>KAGGLE: GYM CUSTOMERS FEATURES AND CHURN (4.000 GÖZLEM)</span>
          </div>

          {/* Catchy Finding Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight !leading-tight mb-6 max-w-3xl">
            Sadakatin Bedeli:{' '}
            <span className="bg-gradient-to-r from-[#e0aaff] via-[#b829ea] to-[#7b2cbf] bg-clip-text text-transparent">
              Spor Salonları Üyelerini Neden Kaybediyor?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 font-sans">
            Kaggle&apos;da yayımlanan 4.000 gözlemli Gym Customers Features and Churn veri seti üzerinde yapılan analiz (%26,5 genel terk oranı); müşteri kaybının ardındaki
            gözlemsel örüntülerin yaş ve sözleşme süresi ile ilişkisini inceliyor. İlgili literatürde eğitim ve analitik amaçlı simüle edildiği belirtilen bu veri setindeki bulgular tüm spor salonu sektörünün geneline değil, incelenen veri kümesine aittir.
          </p>

          {/* Author & Meta Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12 font-mono text-xs text-slate-300">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-user-astronaut text-[#b829ea]" />
              <span>Yazar: <strong className="text-white">Metehan Gezer</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-regular fa-calendar text-[#b829ea]" />
              <span>Tarih: <strong className="text-white">16 Ekim 2026</strong></span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-solid fa-graduation-cap text-[#b829ea]" />
              <span>MCBÜ Büyük Veri Analistliği</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
              <i className="fa-regular fa-clock text-[#b829ea]" />
              <span>Okuma Süresi: ~5 Dakika</span>
            </div>
          </div>

          {/* Glowing Scroll Down Indicator / Button */}
          <button
            type="button"
            onClick={() => scrollToSection('story-context')}
            className="group flex flex-col items-center gap-2 text-xs font-mono text-[#c77dff] hover:text-white transition-all cursor-pointer focus:outline-none"
            aria-label="Aşağı Kaydırın"
          >
            <span className="tracking-widest uppercase font-bold text-[11px] group-hover:scale-105 transition-transform">
              Aşağı Kaydırın
            </span>
            <div className="w-9 h-9 rounded-full bg-[#161028] border border-[#b829ea] shadow-[0_0_15px_rgba(184,41,234,0.5)] flex items-center justify-center group-hover:shadow-[0_0_25px_rgba(184,41,234,0.8)] transition-all animate-bounce">
              <i className="fa-solid fa-chevron-down text-sm text-[#e0aaff]" />
            </div>
          </button>
        </div>
      </section>

      {/* ======================================================================
          2. CONTEXT SECTION (Bağlam - 1-2 Paragraphs in Turkish, 16px+ text)
         ====================================================================== */}
      <section
        className="context-section py-16 sm:py-24 bg-[#0a0812] border-t border-b border-white/5 relative"
        id="story-context"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
              <i className="fa-solid fa-book-open text-[#b829ea]" />
              <span className="uppercase font-bold">Bağlam & Problem</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Müşteri Kaybının (Churn) Perde Arkası
            </h2>
          </div>

          {/* Paragraphs with Highly Readable Typography (16px+ / text-base sm:text-lg) */}
          <div className="space-y-6 text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            <p>
              Spor ve sağlıklı yaşam kulüplerinde sürdürülebilirliği etkileyen başlıklardan biri{' '}
              <strong className="text-white font-semibold">Müşteri Terki (Customer Churn)</strong> olgusudur.
              İncelenen veri setinde, salona adım atan her 4 gözlemden birinin (%26,5) ayrıldığı görülmektedir.
            </p>

            <p>
              Bu analitik araştırma, Kaggle platformunda Adrian Vinueza tarafından yayımlanan, literatürde eğitim ve analitik
              modelleme amaçlı simüle edildiği belirtilen{' '}
              <strong className="text-[#c77dff] font-semibold">4.000 gözlem ve 14 değişken içeren</strong>{' '}
              <em className="text-white not-italic font-mono text-sm bg-white/5 px-2 py-0.5 rounded">Gym Customers Features and Churn</em>{' '}
              veri setini mercek altına alıyor. Elde edilen bulgular tüm spor salonu sektörünün genel gerçeği olarak değil, incelenen veri kümesi sınırları dahilindeki gözlemsel örüntüler olarak değerlendirilmelidir. Amacımız; sözleşme süreleri (1, 6 ve 12 Ay), demografik yaş kategorileri,
              Lifetime kategorilerine göre gözlenen terk oranları ve haftalık devam sıklığı arasındaki gözlemsel örüntüleri incelemektir.
            </p>
          </div>

          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <div className="p-4 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#e0aaff] font-mono">4.000</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">İncelenen Gözlem</span>
            </div>
            <div className="p-4 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">%26,5</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Veri Setindeki Genel Churn Oranı (1.061/4.000)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">%78,20</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">Zirve Risk (18-25 & 1 Ay)</span>
            </div>
            <div className="p-4 rounded-xl bg-[#140f26]/80 border border-[#b829ea]/30 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">39,92 pp</span>
              <span className="text-xs text-slate-400 font-sans mt-1 block">12 Ay vs 1 Ay Gözlemsel Fark</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          3. SCROLLYTELLING SECTION (6-step Scrollama & D3.js component)
         ====================================================================== */}
      <section className="scrollytelling-wrapper-section relative" id="scrolly-story">
        <div className="max-w-7xl mx-auto pt-8 pb-4 px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-2">
            <span className="uppercase font-bold">Adım Adım Veri Anlatımı</span>
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            6 Adımda Spor Salonu Churn Dinamikleri
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Aşağı kaydırdıkça sabit grafik üzerinden sözleşme sürelerini (1, 6, 12 ay), demografik yaş dağılımını,
            12 hücrelik etkileşim matrisini ve Lifetime kategorilerine göre gözlenen terk oranlarını adım adım inceleyin.
          </p>
        </div>

        {/* Verified 6-step D3.js Scrollytelling component */}
        <ScrollyDataViz />
      </section>

      {/* ======================================================================
          4. READER EXPLORATION (Okuyucu Keşfi - Interactive Filter & Horizontal Bar Chart)
         ====================================================================== */}
      <ReaderExploration />

      {/* ======================================================================
          5. CONCLUSION (Peki Ne Olmuş? / Sonuç & Sınırlılıklar)
         ====================================================================== */}
      <section
        className="conclusion-section py-16 sm:py-24 bg-[#0d0d0d] relative"
        id="story-conclusion"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-10 md:p-12 rounded-2xl bg-[#140f26]/90 border border-[#b829ea]/50 shadow-[0_0_35px_rgba(184,41,234,0.25)] relative overflow-hidden">
            
            {/* Ambient Background Gradient Accent */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#b829ea]/10 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/15 border border-[#b829ea]/40 mb-4">
              <i className="fa-solid fa-flag-checkered text-[#b829ea]" />
              <span className="uppercase font-bold">Analitik Çıkarım & Sınırlılıklar</span>
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">
              Peki Ne Olmuş? (Sonuçlar ve Metodolojik Sınırlılıklar)
            </h2>

            {/* Core Conclusion Paragraph (16px+ typography) */}
            <div className="space-y-5 text-slate-300 text-base sm:text-lg leading-relaxed font-sans mb-8">
              <p>
                İncelenen 4.000 gözlemlik kamuya açık veri setinde müşteri kaybı (churn) ile değişkenler arasındaki
                gözlemsel ilişkiler değerlendirildiğinde:{' '}
                <strong className="text-white font-bold">
                  En düşük gözlemlenen terk oranı 12 aylık sözleşmeye sahip üyeler arasında gerçekleşmiştir.
                  1 aylık taahhütsüz paketlerde gözlemlenen terk %42,32 iken, 12 aylık sözleşmede
                  bu oran %2,40&apos;a gerilemektedir (39,92 yüzde puanlık gözlemsel fark).
                </strong>
              </p>

              <p>
                Zirve risk kümesi olan 18-25 yaş grubundaki aylık üyelerde terk oranı %78,20 olarak gözlemlenmiştir.
                Aynı yaş grubunda 12 aylık taahhüde sahip üyelerde ise terk oranı %6,10 seviyesindedir (72,10 pp gözlemsel fark).
                34+ yaş grubunda 12 aylık sözleşmeye sahip 112 gözlemin hiçbirinde terk kaydedilmemiştir (%0,00).
              </p>
            </div>

            {/* Critical Limitations & Caveats Block */}
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-8 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <i className="fa-solid fa-triangle-exclamation text-amber-400" />
                <span>Önemli Metodolojik Uyarılar ve Kısıtlar</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc list-inside font-sans">
                <li>
                  <strong className="text-white">Korelasyon ≠ Nedensellik:</strong> 12 aylık taahhüdün düşük terk (%2,40) ile
                  ilişkili olması doğrudan sözleşmenin terki önlediğini kanıtlamaz. Spor disiplinine ve devamlılık motivasyonuna
                  zaten sahip olan üyelerin uzun taahhütleri tercih etmesi (kendini seçme yanlılığı / self-selection bias) bu örüntüde temel rol oynayabilir.
                </li>
                <li>
                  <strong className="text-white">Veri Setinin Niteliği ve Kapsamı:</strong> İncelenen kayıtlar Kaggle platformunda
                  Adrian Vinueza tarafından paylaşılan 4.000 gözlem ve 14 değişkenlik veri setidir. İlgili literatür ve veri kaynağı
                  bu kayıtların eğitim ve analitik amaçlı simüle edildiğini belirtmektedir; bulgular tüm spor salonu sektörünün geneline genellenemez.
                </li>
                <li>
                  <strong className="text-white">Üyelik Süresi (Lifetime) Analizi Sınırları:</strong> Veri kesitseldir (cross-sectional);
                  üyelerin zamana bağlı ayrılma kronolojisini izleyen bir yaşam kalımı (survival/time-to-event) takibi değildir.
                  Lifetime kategorilerine göre gözlenen terk oranları (0-2. ay kategorilerinde yüksek churn), ilk 90 günün doğrudan terke neden olduğunu veya ayrılma anının kronolojisini kanıtlamaz.
                </li>
              </ul>
            </div>

            {/* Strategic 3-Point Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[#b829ea] text-lg mb-2">
                  <i className="fa-solid fa-file-contract" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Sözleşme Süresi Örüntüsü</h3>
                <p className="text-xs text-slate-400 leading-relaxed m-0">
                  1 aylık paketlerde %42,32 olan terk, 12 aylık sözleşmede %2,40&apos;a inerek 39,92 pp gözlemsel fark sergiler.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[#b829ea] text-lg mb-2">
                  <i className="fa-solid fa-hourglass-start" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Lifetime Kategorileri</h3>
                <p className="text-xs text-slate-400 leading-relaxed m-0">
                  0-2. ay kategorilerinde gözlemlenen terk yüksek olup (%82,75 - %25,74), 3+ ayı aşan kategorilerde %10&apos;un altına inmektedir. Bu durum kesitsel bir dağılımdır; ilk 90 günün nedenselliğini kanıtlamaz.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-[#b829ea] text-lg mb-2">
                  <i className="fa-solid fa-bullseye" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Genç Yaş Kümesi</h3>
                <p className="text-xs text-slate-400 leading-relaxed m-0">
                  18-25 yaş aylık sözleşmeli gözlemlerde (%78,20) terk oranı en yüksek risk düzeyinde kaydedilmiştir.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================================
          6. METHODOLOGY & AUTHOR (Yöntem ve Yazar / Beyanlar & Linkler)
         ====================================================================== */}
      <footer
        className="methodology-section py-16 sm:py-20 bg-[#08060f] border-t border-[#b829ea]/30 relative"
        id="story-methodology"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            
            {/* Left: Methodology & AI Disclosure */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b829ea] block">
                Metodoloji & Beyanlar
              </span>
              <h3 className="text-lg font-bold text-white">Yöntem, Araçlar ve Veri Kaynağı</h3>
              
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-sans">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-database text-[#b829ea] mt-1 shrink-0" />
                  <span>
                    <strong className="text-white">Veri Kaynağı:</strong>{' '}
                    <a
                      href="https://www.kaggle.com/datasets/adrianvinueza/gym-customers-features-and-churn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c77dff] underline hover:text-white"
                    >
                      Kaggle: Adrian Vinueza - Gym Customers Features and Churn
                    </a>{' '}
                    (4.000 gözlem, 14 değişken; eğitim ve analitik amaçlı kamuya açık veri seti).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-scale-balanced text-[#b829ea] mt-1 shrink-0" />
                  <span>
                    <strong className="text-white">Lisans:</strong> Kaggle veri kümesi sayfasında Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) olarak listelenmiştir. <em>(Bağımsız değerlendiriciler için Kaggle kaynak sayfasından manuel teyit önerilir.)</em>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-code text-[#b829ea] mt-1 shrink-0" />
                  <span>
                    <strong className="text-white">Araçlar & Teknolojiler:</strong> Python, Pandas,
                    Jupyter Notebook (<code className="text-[#c77dff] font-mono text-xs">notebooks/analiz.ipynb</code>),
                    D3.js (v7), React (v18), TypeScript, Tailwind CSS, Vite.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-robot text-[#c77dff] mt-1 shrink-0" />
                  <span>
                    <strong className="text-white">Yapay Zeka ve Akademik Dürüstlük Beyanı:</strong> Bu projede; Python veri işleme betikleri,
                    D3.js SVG yaşam döngüsü mimarisi, responsive düzenlemeler ve ilk taslak anlatı metinlerinin yapılandırılmasında yapay zeka (LLM / Antigravity Agent)
                    desteği alınmıştır. Kodlama ve teknik hata ayıklama desteği ile analitik yazım katkısı birbirinden ayrılmıştır.
                    Ders gereklilikleri ve akademik dürüstlük standartları gereğince, öğrencinin (Metehan Gezer) tüm analitik yorumları ve anlatıyı kendi özgün ifadeleriyle gözden geçirip nihai hale getirmesi gerekmektedir.
                  </span>
                </li>
              </ul>
            </div>

            {/* Right: Author Card & Verified Working Links */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#b829ea] block">
                Yazar Bilgileri
              </span>
              <h3 className="text-lg font-bold text-white">Metehan Gezer</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Manisa Celal Bayar Üniversitesi, Büyük Veri Analistliği programı öğrencisi. Veri bilimi,
                ekonometrik modeller ve interaktif veri görselleştirmeleri üzerine çalışmaktadır.
              </p>

              {/* Action Buttons: Verified GitHub & LinkedIn & Notebook Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://github.com/MeterrGT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#b829ea]/20 hover:bg-[#b829ea]/35 border border-[#b829ea]/50 transition-all shadow-[0_0_12px_rgba(184,41,234,0.2)]"
                  title="Metehan Gezer GitHub Profilini Görüntüle"
                >
                  <i className="fa-brands fa-github text-sm text-[#e0aaff]" />
                  <span>GitHub (@MeterrGT)</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/metehan-gezer-aa444b403/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/50 transition-all shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                  title="Metehan Gezer LinkedIn Profilini Görüntüle"
                >
                  <i className="fa-brands fa-linkedin text-sm text-blue-400" />
                  <span>LinkedIn Profilim</span>
                </a>

                <a
                  href="mailto:gztmetehan@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all"
                  title="E-posta İle İletişime Geçin"
                >
                  <i className="fa-regular fa-envelope text-sm text-slate-300" />
                  <span>gztmetehan@gmail.com</span>
                </a>
              </div>
            </div>

          </div>

          {/* Project-specific dataset statement moved from general homepage footer */}
          <div
            className="p-3.5 sm:p-4 text-xs sm:text-sm text-slate-200 leading-relaxed text-center my-6 rounded-xl"
            style={{
              background: 'rgba(36, 0, 70, 0.45)',
              border: '1px solid rgba(199, 125, 255, 0.3)',
              boxShadow: '0 0 20px rgba(184, 41, 234, 0.15)',
            }}
          >
            Bu scrollytelling projesi Kaggle&apos;daki Gym Customers Features and Churn veri seti kullanılarak hazırlanmıştır. | Metehan Gezer - Manisa Celal Bayar Üniversitesi - Büyük Veri Analistliği
          </div>

          {/* Bottom Copyright & Back to Home */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <span>© 2026 Metehan Gezer • Manisa Celal Bayar Üniversitesi</span>
            <Link href="/"
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

