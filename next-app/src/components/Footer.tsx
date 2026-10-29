import React from 'react';
import Link from 'next/link';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export const Footer: React.FC = () => {
  return (
    <footer className="footer" id="footer">
      <div
        className="container footer-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.25rem',
        }}
      >
        <div className="footer-brand-row flex flex-col sm:flex-row justify-between items-center w-full gap-4 text-center sm:text-left">
          <div className="footer-left">
            <span className="footer-logo">
              {PORTFOLIO_DATA.personal.brandFirst}
              <span className="highlight-purple">{PORTFOLIO_DATA.personal.brandLast}</span>
            </span>
            <p className="footer-subtext text-xs sm:text-sm text-slate-400 mt-1">
              {PORTFOLIO_DATA.personal.university} • {PORTFOLIO_DATA.personal.department}
            </p>
          </div>

          <div className="footer-links flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-mono text-slate-400">
            <Link href="/#hero" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/#projects" className="hover:text-white transition-colors">Projelerim</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/gym-churn" className="hover:text-[#c77dff] transition-colors">Gym Churn</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/bluesky-hashtag-network" className="hover:text-[#c77dff] transition-colors">Bluesky SNA</Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link>
          </div>

          <div className="footer-socials flex items-center gap-3">
            <a
              href="https://www.instagram.com/metehangezer/?hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram" />
            </a>
            <a
              href="https://www.linkedin.com/in/metehan-gezer-aa444b403/?isSelfProfile=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a
              href="https://github.com/MeterrGT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github" />
            </a>
            <a href={`mailto:${PORTFOLIO_DATA.personal.email}`} aria-label="E-Posta">
              <i className="fa-regular fa-envelope" />
            </a>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 my-1" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs text-slate-400 gap-2">
          <span>{PORTFOLIO_DATA.personal.copyright}</span>
          <span className="font-mono text-[11px] text-slate-400">
            Büyük Veri Analistliği Portfolyosu • Manisa Celal Bayar Üniversitesi
          </span>
        </div>
      </div>
    </footer>
  );
};

