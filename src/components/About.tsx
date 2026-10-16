import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export const About: React.FC = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-heading text-center mb-8 sm:mb-12">
          <span className="section-tag">{PORTFOLIO_DATA.about.tag}</span>
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            {PORTFOLIO_DATA.about.title}
          </h2>
          <div className="heading-line" />
        </div>

        <div className="about-card-modern">
          <div className="about-icon-header">
            <div className="profile-avatar-icon">
              <i className="fa-solid fa-user-astronaut" />
            </div>
            <div>
              <h3 className="about-name">{PORTFOLIO_DATA.personal.name}</h3>
              <span className="about-sub">{PORTFOLIO_DATA.personal.role}</span>
            </div>
          </div>

          <div className="about-text-content">
            {PORTFOLIO_DATA.about.paragraphs.map((p, idx) => (
              <p
                key={idx}
                dangerouslySetInnerHTML={{
                  __html: p
                    .replace(/Büyük Veri Analistliği/g, '<strong>Büyük Veri Analistliği</strong>')
                    .replace(/Python/g, '<strong>Python</strong>')
                    .replace(/SQL/g, '<strong>SQL</strong>'),
                }}
              />
            ))}
          </div>

          {/* Focus Chips */}
          <div className="about-focus-chips">
            {PORTFOLIO_DATA.about.focusChips.map((chip, idx) => (
              <div key={idx} className="focus-chip">
                <i className="fa-solid fa-check" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
