import React from 'react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_DATA, ProjectTool } from '@/data/portfolio';
import { GymChurnWidget } from './GymChurnWidget';

interface CurrentTermProjectProps {
  onEasterEggClick?: () => void;
}

export const CurrentTermProject: React.FC<CurrentTermProjectProps> = ({ onEasterEggClick }) => {
  const { project, personal } = PORTFOLIO_DATA;

  return (
    <section className="section current-project-section" id="current-project">
      <div className="container">
        {/* Section 1 Heading */}
        <div className="section-heading text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span
              className="section-tag"
              style={{ cursor: onEasterEggClick ? 'pointer' : 'default' }}
              onClick={onEasterEggClick}
              title="Easter Egg: 5 kez tıkla!"
            >
              &lt;donem_projesi_1&gt;
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '50px',
                background: 'rgba(184, 41, 234, 0.15)',
                color: 'var(--purple-bright)',
                border: '1px solid rgba(199, 125, 255, 0.3)',
              }}
            >
              {personal.name} • {personal.university}
            </span>
          </div>

          <h2
            className="section-title"
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.3rem)',
              lineHeight: 1.3,
              maxWidth: '960px',
              margin: '0 auto 0.75rem',
              color: '#ffffff',
            }}
          >
            Üzerinde Çalıştığım Dönem Projesi ve D3.js &amp; Scrollama ile Gym Members Churn (Terk) Analizi
          </h2>
          <p
            className="section-sub"
            style={{ maxWidth: '780px', margin: '0 auto', color: 'var(--text-secondary)' }}
          >
            Kaggle Gym Members veri seti üzerinde Python ve Pandas ile yürütülen büyük veri analitiği, müşteri kaybı (churn) modellemesi ve interaktif D3.js scrollytelling görselleştirmesi.
          </p>
          <div className="heading-line" />
        </div>

        {/* Project Showcase Card */}
        <div className="project-showcase-card">
          <div className="project-card-top">
            <div className="project-badge">
              <span className="badge-dot" />
              <span>{project.badge}</span>
            </div>
            <span className="academic-note">
              <i className="fa-solid fa-graduation-cap" /> {project.academicNote}
            </span>
          </div>

          <div className="project-card-main">
            <h3 className="project-heading">
              {project.title}
              <span className="project-subheading">{project.subtitle}</span>
            </h3>

            <p className="project-text">{project.description}</p>

            <div className="project-goal-box">
              <div className="goal-icon">
                <i className="fa-solid fa-bullseye" />
              </div>
              <div>
                <strong>{project.goal.title}</strong>
                <p>{project.goal.description}</p>
              </div>
            </div>

            {/* Tools */}
            <div className="project-tools">
              <span className="tools-label">Kullanılan Araçlar &amp; Kütüphaneler:</span>
              <div className="tools-tags">
                {project.tools.map((tool: ProjectTool, idx: number) => (
                  <span key={idx} className="tag-item">
                    <i className={tool.icon} /> {tool.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Member Churn Risk Simulator */}
            <GymChurnWidget />
          </div>

          <div className="project-card-bottom">
            <span className="bottom-status">
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} /> {project.bottomStatus}
            </span>
            <a
              href={`mailto:${PORTFOLIO_DATA.personal.email}?subject=${encodeURIComponent(
                project.contactMailSubject
              )}`}
              className="btn btn-sm btn-outline-purple"
            >
              <i className="fa-regular fa-envelope" /> Analiz Hakkında Fikir Paylaş
            </a>
          </div>
        </div>

        {/* Scrollytelling Dedicated Page CTA Card */}
        <div
          style={{
            marginTop: '3rem',
            padding: '2.2rem 2.4rem',
            background: 'linear-gradient(135deg, rgba(36, 0, 70, 0.65) 0%, rgba(13, 13, 13, 0.95) 100%)',
            border: '1px solid rgba(184, 41, 234, 0.45)',
            borderRadius: '16px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(184, 41, 234, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: 'var(--purple-bright)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-chart-line" /> ÖZEL BÜYÜK VERİ SCROLLYTELLING
            </span>
            <h4 style={{ color: '#ffffff', fontSize: '1.35rem', margin: '0.4rem 0 0.5rem', fontWeight: 700 }}>
              D3.js &amp; Scrollama ile 6 Adımlı Churn Görselleştirmesi
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>
              Kaggle Gym verisindeki yaş grupları ve sözleşme modellerini adım adım hikayeleyen özel tam sayfa interaktif D3 scrollytelling deneyimine göz atın.
            </p>
          </div>
          <Link
            to="/gym-churn"
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.8rem',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 0 20px rgba(184, 41, 234, 0.5)',
              fontWeight: 700,
            }}
          >
            <span>Scrollytelling Sayfasına Git</span>
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
};
