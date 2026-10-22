'use client';
import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { MotorMinigame } from './MotorMinigame';
import { PriceSimulator } from './PriceSimulator';

export const PreviousProjects: React.FC = () => {
  const { previousProjects, personal } = PORTFOLIO_DATA;
  const motorProject = previousProjects[0];
  const laptopProject = previousProjects[1];

  return (
    <section className="section previous-projects-section" id="previous-projects">
      <div className="container">
        {/* Section 3 Heading */}
        <div className="section-heading text-center">
          <span className="section-tag">Önceki Çalışmalarım</span>
          <h2 className="section-title">Önceki Projelerim</h2>
          <p className="section-sub">
            Geliştirdiğim etkileşimli simülasyonlar, regresyon modelleri ve kestirimci analiz çalışmalarım
          </p>
          <div className="heading-line" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Project Card A: Kestirimci Bakım Sistemleri ile Endüstride Arıza Önleme */}
          <div className="project-showcase-card">
            <div className="project-card-top">
              <div className="project-badge">
                <span className="badge-dot" />
                <span>{motorProject.badge}</span>
              </div>
              <span className="academic-note">
                <i className="fa-solid fa-microchip" /> IoT & Anomali Tespiti
              </span>
            </div>

            <div className="project-card-main">
              <h3 className="project-heading">
                {motorProject.title}
                <span className="project-subheading">{motorProject.subtitle}</span>
              </h3>

              <p className="project-text">{motorProject.description}</p>

              <div className="project-goal-box">
                <div className="goal-icon">
                  <i className="fa-solid fa-temperature-arrow-up" />
                </div>
                <div>
                  <strong>Erken Uyarı Mantığı:</strong>
                  <p>
                    Sensör sıcaklık ve titreşim sinyalleri izlenerek kritik tolerans eşiği (75°C+) aşıldığında sistem arızasını önceden kestirip otomatik müdahale tetiklenir.
                  </p>
                </div>
              </div>

              {/* Tools */}
              <div className="project-tools">
                <span className="tools-label">Kullanılan Araçlar:</span>
                <div className="tools-tags">
                  {motorProject.tools.map((tool, idx) => (
                    <span key={idx} className="tag-item">
                      <i className={tool.icon} /> {tool.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fully functional Motor Temperature & Failure Risk Simulation UI */}
              <MotorMinigame />
            </div>

            <div className="project-card-bottom">
              <span className="bottom-status">
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} /> Model doğrulaması ve simülasyon tamamlandı.
              </span>
              <a
                href={`mailto:${personal.email}?subject=${encodeURIComponent(
                  'Kestirimci Bakım Projesi Hakkında'
                )}`}
                className="btn btn-sm btn-outline-purple"
              >
                <i className="fa-regular fa-envelope" /> Detaylar İçin İletişime Geç
              </a>
            </div>
          </div>

          {/* Project Card B: Laptop Fiyat Tahmini ve Ekonometrik Regresyon Analizi */}
          <div className="project-showcase-card">
            <div className="project-card-top">
              <div className="project-badge">
                <span className="badge-dot" />
                <span>{laptopProject.badge}</span>
              </div>
              <span className="academic-note">
                <i className="fa-solid fa-chart-line" /> OLS Regresyon & Ekonometri
              </span>
            </div>

            <div className="project-card-main">
              <h3 className="project-heading">
                {laptopProject.title}
                <span className="project-subheading">{laptopProject.subtitle}</span>
              </h3>

              <p className="project-text">{laptopProject.description}</p>

              <div className="project-goal-box">
                <div className="goal-icon">
                  <i className="fa-solid fa-calculator" />
                </div>
                <div>
                  <strong>Regresyon Denklemi & Donanım Esnekliği:</strong>
                  <p>
                    Fiyat = 280 + 16×(RAM) + 85×(CPU Tier) + 155×(GPU Tier). R² = 0.88 ile donanım katsayılarının fiyat üzerindeki istatistiksel anlamlılığı kanıtlanmıştır.
                  </p>
                </div>
              </div>

              {/* Tools */}
              <div className="project-tools">
                <span className="tools-label">Kullanılan Araçlar:</span>
                <div className="tools-tags">
                  {laptopProject.tools.map((tool, idx) => (
                    <span key={idx} className="tag-item">
                      <i className={tool.icon} /> {tool.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fully functional RAM / CPU / GPU slider & OLS regression price simulator UI */}
              <PriceSimulator />
            </div>

            <div className="project-card-bottom">
              <span className="bottom-status">
                <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} /> Regresyon katsayıları hesaplandı, simülatör aktif.
              </span>
              <a
                href={`mailto:${personal.email}?subject=${encodeURIComponent(
                  'Laptop Regresyon Analizi Hakkında'
                )}`}
                className="btn btn-sm btn-outline-purple"
              >
                <i className="fa-regular fa-envelope" /> Fikir Paylaş
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

