import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { useTypingEffect } from '@/hooks/useTypingEffect';

interface HeroProps {
  onEasterEggClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEasterEggClick }) => {
  const typedText = useTypingEffect(PORTFOLIO_DATA.personal.typingSubtitles);

  return (
    <section className="hero-section py-24 sm:py-32 relative overflow-hidden" id="hero">
      <div className="container hero-container max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
        {/* Top Info Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wide bg-[#b829ea]/10 border border-[#b829ea]/30 text-[#e0aaff] mb-4 max-w-full">
          <span className="pulse-beacon w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">
            {PORTFOLIO_DATA.personal.university} • {PORTFOLIO_DATA.personal.department}
          </span>
        </div>

        {/* Title with Easter Egg (5 Clicks) */}
        <h1
          className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight !leading-tight mb-3 sm:mb-4"
          id="main-name"
          title="Easter Egg: 5 kez tıkla!"
          onClick={onEasterEggClick}
          style={{ cursor: 'pointer' }}
        >
          Merhaba, Ben{' '}
          <span className="gradient-purple">{PORTFOLIO_DATA.personal.name}</span>
        </h1>

        {/* Typing Box */}
        <div className="typing-box max-w-full overflow-hidden inline-flex items-center bg-[#120f1c]/70 border border-[#b829ea]/30 rounded-xl px-3.5 py-2 mb-4 text-xs sm:text-sm md:text-base font-mono text-[#c77dff]">
          <span className="typing-text truncate" id="typing-text">
            {typedText}
          </span>
          <span className="typing-cursor ml-1 inline-block w-1.5 h-4 bg-[#b829ea] animate-pulse" />
        </div>

        {/* Description */}
        <p className="hero-description text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
          {PORTFOLIO_DATA.personal.heroDescription}
        </p>

        {/* CTA Buttons (Stacked on mobile, row on tablet/desktop) */}
        <div className="hero-cta-group flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center mb-8">
          <a
            href="#projects"
            className="btn btn-primary-neon w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] hover:from-[#9d4edd] hover:to-[#c77dff] shadow-[0_0_20px_rgba(184,41,234,0.4)] transition-all"
          >
            <i className="fa-solid fa-diagram-project" />
            <span>Dönem Projemi İncele</span>
          </a>
          <a
            href="#contact"
            className="btn btn-glass w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-all"
          >
            <i className="fa-regular fa-paper-plane" />
            <span>Bana Ulaşın</span>
          </a>
        </div>

        {/* Info Pills */}
        <div className="hero-info-pills flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-2xl">
          <div className="info-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/10">
            <i className="fa-solid fa-graduation-cap text-[#b829ea]" />
            <span>MCBÜ Büyük Veri Analistliği</span>
          </div>
          <div className="info-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/10">
            <i className="fa-solid fa-laptop-code text-[#b829ea]" />
            <span>Python &amp; SQL Öğrenimi</span>
          </div>
          <div className="info-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/10">
            <i className="fa-regular fa-envelope text-[#b829ea]" />
            <span>{PORTFOLIO_DATA.personal.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
