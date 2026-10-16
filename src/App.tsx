import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { GymChurnPage } from '@/pages/GymChurnPage';
import { GlitchOverlay } from '@/components/GlitchOverlay';
import { useHackerGlitch } from '@/hooks/useHackerGlitch';

export const App: React.FC = () => {
  const { isGlitchActive, displayedLines, handleNameClick, matrixCanvasRef } =
    useHackerGlitch();

  // Welcome console message
  useEffect(() => {
    console.log(
      '%c[Metehan Gezer // Portfolyo] %cManisa Celal Bayar Üniversitesi Büyük Veri Analistliği',
      'color: #C77DFF; font-weight: bold; font-size: 13px;',
      'color: #94A3B8; font-size: 12px;'
    );
  }, []);

  return (
    <div className="portfolio-app-root">
      {/* Multi-Page Routes */}
      <Routes>
        {/* Route /: Clean Home page with About, Skills, and 3 Project Cards */}
        <Route path="/" element={<HomePage onEasterEggClick={handleNameClick} />} />

        {/* Route /gym-churn: Dedicated page that only renders the updated ScrollyDataViz component */}
        <Route path="/gym-churn" element={<GymChurnPage />} />
      </Routes>

      {/* Hidden Easter Egg: Glitch & Hacker Mode Overlay */}
      <GlitchOverlay
        isActive={isGlitchActive}
        lines={displayedLines}
        canvasRef={matrixCanvasRef}
      />
    </div>
  );
};

export default App;

