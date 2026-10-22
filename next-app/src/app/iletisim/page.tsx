import React from 'react';
import { CyberCanvas } from '@/components/CyberCanvas';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { SectionLabel } from '@/components/SectionLabel';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'İletişim | Metehan Gezer',
  description:
    'Metehan Gezer ile iletişime geçin. Büyük Veri Analistliği projeleri ve akademik değerlendirmeler.',
};

export default function ContactPage() {
  return (
    <div className="portfolio-app-root min-h-screen relative flex flex-col justify-between">
      {/* Background Interactive Cyber Canvas */}
      <CyberCanvas />

      {/* Top Navigation Bar */}
      <Navbar activeSection="iletisim" />

      {/* Main Content Area */}
      <main className="section contact-section pt-28 sm:pt-36 pb-20 relative z-10 flex-1">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="contact-box-wrapper p-6 sm:p-10 lg:p-12">
            
            {/* Contact Header */}
            <div className="contact-header text-center mb-8 sm:mb-12">
              <SectionLabel label="İletişim" icon="fa-regular fa-paper-plane" />
              <h1 className="contact-slogan text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
                &quot;Veriler yalan söylemez,{' '}
                <span className="gradient-purple">hadi tanışalım.</span>&quot;
              </h1>
              <p className="contact-intro text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
                Büyük Veri Analistliği, dönem projem veya akademik değerlendirmeleriniz için bana
                dilediğiniz zaman ulaşabilirsiniz.
              </p>
            </div>

            {/* 2-Column Contact Layout */}
            <div className="contact-layout grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Panel: Social Media & Contact Cards */}
              <div className="contact-info-panel">
                <h2 className="panel-title text-lg font-bold text-white mb-2">
                  Sosyal Ağlar & İletişim
                </h2>
                <p className="panel-desc text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
                  Aşağıdaki kutucuklardan sosyal medya hesaplarıma göz atabilir veya doğrudan e-posta
                  gönderebilirsiniz:
                </p>

                <div className="social-cards-grid">
                  {PORTFOLIO_DATA.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-card-item ${link.type}`}
                    >
                      <div className="social-icon-box">
                        <i className={link.icon} />
                      </div>
                      <div className="social-meta">
                        <span className="social-platform">{link.platform}</span>
                        <span className="social-handle">{link.handle}</span>
                      </div>
                      <i className="fa-solid fa-arrow-up-right-from-square external-link-icon" />
                    </a>
                  ))}
                </div>

                <div className="uni-location-pill mt-6">
                  <i className="fa-solid fa-location-dot" />
                  <span>{PORTFOLIO_DATA.personal.location}</span>
                </div>
              </div>

              {/* Right Panel: Database-backed Contact Form */}
              <div className="contact-form-panel">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
