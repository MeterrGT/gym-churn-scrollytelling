import React from 'react';
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

        <div
          className="footer-project-statement p-3 sm:p-4 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl"
          style={{
            background: 'rgba(36, 0, 70, 0.35)',
            border: '1px solid rgba(199, 125, 255, 0.25)',
            borderRadius: '10px',
            boxShadow: '0 0 20px rgba(184, 41, 234, 0.1)',
          }}
        >
          Bu scrollytelling projesi Kaggle'daki Gym Members Churn veri seti kullanılarak hazırlanmıştır. | Metehan Gezer - Manisa Celal Bayar Üniversitesi - Büyük Veri Analistliği
        </div>

        <span className="copyright-text">{PORTFOLIO_DATA.personal.copyright}</span>
      </div>
    </footer>
  );
};
