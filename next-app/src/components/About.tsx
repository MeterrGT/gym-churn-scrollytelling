import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { SectionLabel } from './SectionLabel';

export const About: React.FC = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="section-heading text-center mb-8 sm:mb-12">
          <SectionLabel label="Biyografi" icon="fa-solid fa-user-astronaut" />
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            {PORTFOLIO_DATA.about.title}
          </h2>
          <div className="heading-line w-20 h-1 bg-gradient-to-r from-transparent via-[#b829ea] to-transparent mx-auto mt-4" />
        </div>

        <div className="about-card-modern bg-[#120f1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/60 rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)] backdrop-blur-xl max-w-4xl mx-auto transition-all duration-300">
          <div className="about-icon-header flex items-center gap-4 mb-6 pb-5 border-b border-white/10">
            <div className="profile-avatar-icon w-14 h-14 rounded-xl flex items-center justify-center bg-white/[0.04] border border-[#b829ea]/40 text-2xl text-[#b829ea] shrink-0 shadow-[0_0_15px_rgba(184,41,234,0.25)]">
              <i className="fa-solid fa-user-astronaut" />
            </div>
            <div>
              <h3 className="about-name text-xl sm:text-2xl font-bold text-white mb-1">
                {PORTFOLIO_DATA.personal.name}
              </h3>
              <span className="about-sub text-xs sm:text-sm font-mono text-[#e0aaff]">
                {PORTFOLIO_DATA.personal.role}
              </span>
            </div>
          </div>

          <div className="about-text-content space-y-4">
            {PORTFOLIO_DATA.about.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{
                  __html: p
                    .replace(/Büyük Veri Analistliği/g, '<strong className="text-white font-semibold">Büyük Veri Analistliği</strong>')
                    .replace(/Python/g, '<strong className="text-white font-semibold">Python</strong>')
                    .replace(/SQL/g, '<strong className="text-white font-semibold">SQL</strong>'),
                }}
              />
            ))}
          </div>

          {/* Focus Chips */}
          <div className="about-focus-chips flex flex-wrap items-center justify-start gap-2 sm:gap-2.5 mt-8 pt-6 border-t border-white/10 w-full">
            {PORTFOLIO_DATA.about.focusChips.map((chip, idx) => (
              <div
                key={idx}
                className="focus-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono bg-white/[0.04] text-slate-300 border border-white/10 hover:border-[#b829ea]/50 hover:bg-[#b829ea]/10 transition-all"
              >
                <i className="fa-solid fa-check text-[#b829ea] text-[10px]" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
