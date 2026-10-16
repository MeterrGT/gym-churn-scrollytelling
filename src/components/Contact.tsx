import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      alert('Lütfen formdaki tüm alanları doldurunuz.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    }, 1000);
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-box-wrapper">
          <div className="contact-header text-center mb-8 sm:mb-12">
            <span className="section-tag inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
              &lt;iletisim&gt;
            </span>
            <h2 className="contact-slogan text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug mb-3">
              &quot;Veriler yalan söylemez,{' '}
              <span className="gradient-purple">hadi tanışalım.</span>&quot;
            </h2>
            <p className="contact-intro text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
              Büyük Veri Analistliği, dönem projem veya akademik değerlendirmeleriniz için bana
              dilediğiniz zaman ulaşabilirsiniz.
            </p>
          </div>

          <div className="contact-layout">
            {/* Left Panel: Social Media & Contact Cards */}
            <div className="contact-info-panel">
              <h3 className="panel-title">Sosyal Ağlar &amp; İletişim</h3>
              <p className="panel-desc">
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

              <div className="uni-location-pill">
                <i className="fa-solid fa-location-dot" />
                <span>{PORTFOLIO_DATA.personal.location}</span>
              </div>
            </div>

            {/* Right Panel: Clean Form */}
            <div className="contact-form-panel">
              <form id="contact-form" className="clean-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name" className="clean-label">
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="clean-input"
                    placeholder="Örn: Dr. Ahmet Yılmaz"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="clean-label">
                    E-Posta Adresiniz
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="clean-input"
                    placeholder="ornek@alanadi.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="clean-label">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="clean-input"
                    placeholder="Dönem Projesi / Staj"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="clean-label">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="clean-input clean-textarea"
                    rows={4}
                    placeholder="Mesajınızı buraya yazabilirsiniz..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary-neon btn-block"
                  id="form-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-paper-plane" />
                      <span>Mesajı Gönder</span>
                    </>
                  )}
                </button>
              </form>

              {showSuccessAlert && (
                <div className="form-success-alert" id="form-alert">
                  <i className="fa-solid fa-circle-check" />
                  <span>
                    Mesajınız başarıyla iletildi! {PORTFOLIO_DATA.personal.email} üzerinden geri
                    döneceğim.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
