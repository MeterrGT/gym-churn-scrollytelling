'use client';

import React, { useEffect } from 'react';
import { CyberCanvas } from '@/components/CyberCanvas';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { VideosSection, PublicVideo } from '@/components/VideosSection';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { GlitchOverlay } from '@/components/GlitchOverlay';
import { useScrollspy } from '@/hooks/useScrollspy';
import { useHackerGlitch } from '@/hooks/useHackerGlitch';

interface PortfolioClientHomeProps {
  allVideos: PublicVideo[];
  topVideos: PublicVideo[];
}

export const PortfolioClientHome: React.FC<PortfolioClientHomeProps> = ({
  allVideos,
  topVideos,
}) => {
  const activeSection = useScrollspy(
    ['hero', 'about', 'skills', 'projects', 'videos', 'contact'],
    200
  );

  const { isGlitchActive, displayedLines, handleNameClick, matrixCanvasRef } =
    useHackerGlitch();

  // Welcome console message (exact match to original portfolio)
  useEffect(() => {
    console.log(
      '%c[Metehan Gezer // Portfolyo] %cManisa Celal Bayar Üniversitesi Büyük Veri Analistliği',
      'color: #C77DFF; font-weight: bold; font-size: 13px;',
      'color: #94A3B8; font-size: 12px;'
    );
  }, []);

  return (
    <div className="portfolio-app-root">
      {/* Background Interactive Canvas and Ambient Glows */}
      <CyberCanvas />

      {/* 1. Navbar */}
      <Navbar activeSection={activeSection} />

      {/* 2. Hero Component */}
      <Hero onEasterEggClick={handleNameClick} />

      {/* 3. About Component ('Hakkımda') */}
      <About />

      {/* 4. Skills Component ('Beceriler') */}
      <Skills />

      {/* 5. Combined Uniform 3 Projects Grid: Gym Churn, Kestirimci Bakım, Laptop Fiyat */}
      <Projects />

      {/* 6. Neon PostgreSQL Database Backed Videos Section & Öne Çıkanlar */}
      <VideosSection allVideos={allVideos} topVideos={topVideos} />

      {/* 7. Contact Component ('İletişim') */}
      <Contact />

      {/* 8. Footer Component */}
      <Footer />

      {/* Hidden Easter Egg: Glitch & Hacker Mode Overlay */}
      <GlitchOverlay
        isActive={isGlitchActive}
        lines={displayedLines}
        canvasRef={matrixCanvasRef}
      />
    </div>
  );
};
