'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PORTFOLIO_DATA, NavLink } from '../data/portfolio';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    closeMobileMenu();
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', href);
      }
    }
  };

  // Prevent background scrolling on mobile when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-4 sm:top-5 left-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between flex-nowrap h-[58px] sm:h-[66px] bg-[#0f0d18]/90 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 lg:px-8 shadow-2xl shadow-purple-950/40">
          
          {/* Brand Logo */}
          <Link
            href="/#hero"
            className="flex items-center shrink-0 whitespace-nowrap font-heading text-base sm:text-xl font-extrabold tracking-tight mr-2 sm:mr-4 lg:mr-6 group cursor-pointer"
            onClick={closeMobileMenu}
          >
            <span className="text-[#b829ea] group-hover:text-white transition-colors">[</span>
            <span className="text-white">
              {PORTFOLIO_DATA.personal.brandFirst}
              <span className="text-[#b829ea] group-hover:text-[#c77dff] transition-colors">
                {PORTFOLIO_DATA.personal.brandLast}
              </span>
            </span>
            <span className="text-[#b829ea] group-hover:text-white transition-colors">]</span>
          </Link>

          {/* Desktop Navigation Links (hidden on screens smaller than md) */}
          <nav className="hidden md:flex items-center flex-nowrap whitespace-nowrap">
            <ul className="flex items-center gap-2 md:gap-2.5 lg:gap-3.5 xl:gap-4.5 flex-nowrap whitespace-nowrap m-0 p-0 list-none">
              {PORTFOLIO_DATA.navLinks.map((link: NavLink) => {
                const targetId = link.href.replace('#', '').replace('/', '');
                const isActive = activeSection === targetId;

                return (
                  <li key={link.href} className="whitespace-nowrap shrink-0">
                    <a
                      href={link.href}
                      className={`whitespace-nowrap inline-flex items-center text-[0.82rem] md:text-[0.85rem] lg:text-[0.90rem] font-medium py-1 transition-all duration-200 relative ${
                        isActive
                          ? 'text-white font-semibold'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#b829ea] rounded-full shadow-[0_0_8px_#b829ea]" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 shrink-0 whitespace-nowrap">
            {/* Instagram Social Icon */}
            <a
              href="https://www.instagram.com/metehangezer/?hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-slate-300 hover:text-[#b829ea] border border-white/10 hover:border-[#b829ea]/40 transition-all duration-300 shadow-sm"
              title="Instagram Profilim"
            >
              <i className="fa-brands fa-instagram text-xs sm:text-sm" />
            </a>

            {/* Admin Login Icon */}
            <a
              href="/giris"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-slate-300 hover:text-[#b829ea] border border-white/10 hover:border-[#b829ea]/40 transition-all duration-300 shadow-sm"
              title="Yönetici Girişi"
            >
              <i className="fa-solid fa-lock text-xs sm:text-sm" />
            </a>

            {/* Direct CTA (hidden on mobile) */}
            <a
              href="/iletisim"
              className="hidden sm:inline-flex items-center whitespace-nowrap text-xs sm:text-sm font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] hover:from-[#9d4edd] hover:to-[#c77dff] shadow-[0_0_15px_rgba(184,41,234,0.35)] transition-all duration-300 mr-0.5 sm:mr-1"
            >
              İletişime Geç
            </a>

            {/* Mobile Hamburger Menu Toggle Button (< md) */}
            <button
              type="button"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-[#b829ea]/20 text-white border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#b829ea]"
              aria-label="Menüyü Aç / Kapat"
              onClick={toggleMobileMenu}
            >
              <i className={`text-xs ${isMobileMenuOpen ? 'fa-solid fa-xmark text-[#c77dff]' : 'fa-solid fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Backdrop (< md) */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Mobile Dropdown Container */}
            <div className="md:hidden relative z-50 mt-2 p-5 bg-[#0d0d0d]/95 backdrop-blur-2xl border border-[#b829ea]/40 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(184,41,234,0.25)] animate-fadeIn">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#b829ea] bg-[#b829ea]/10 border border-[#b829ea]/30 tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span>Menü Navigasyon</span>
                </span>
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              </div>

              <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                {PORTFOLIO_DATA.navLinks.map((link: NavLink) => {
                  const targetId = link.href.replace('/#', '').replace('#', '').replace('/', '');
                  const isActive = activeSection === targetId;

                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-[#b829ea]/20 text-white border border-[#b829ea]/50 shadow-[0_0_10px_rgba(184,41,234,0.3)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                        }`}
                        onClick={(e) => handleNavClick(e, link.href)}
                      >
                        <span>{link.label}</span>
                        {isActive && <i className="fa-solid fa-chevron-right text-xs text-[#b829ea]" />}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-4 mt-3 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="/iletisim"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7b2cbf] to-[#b829ea] shadow-[0_0_15px_rgba(184,41,234,0.35)]"
                >
                  <i className="fa-regular fa-paper-plane text-xs" />
                  <span>İletişime Geç</span>
                </a>
                <a
                  href="/giris"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-mono text-slate-300 bg-white/[0.04] border border-white/10 hover:border-[#b829ea]/40"
                >
                  <i className="fa-solid fa-lock text-xs text-[#b829ea]" />
                  <span>Yönetici Girişi</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;



