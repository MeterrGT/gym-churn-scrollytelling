'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';

export function useHackerGlitch() {
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const clickCount = useRef(0);
  const clickResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerHackerGlitch = useCallback(() => {
    setIsGlitchActive(true);
    setDisplayedLines([]);
    document.body.classList.add('screen-glitch-active');

    // Progressively type terminal lines
    PORTFOLIO_DATA.easterEgg.lines.forEach((line, index) => {
      setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
      }, index * 280 + 100);
    });

    // Automatically close after 1800ms
    setTimeout(() => {
      setIsGlitchActive(false);
      document.body.classList.remove('screen-glitch-active');
      setDisplayedLines([]);
    }, PORTFOLIO_DATA.easterEgg.durationMs);
  }, []);

  const handleNameClick = useCallback(() => {
    clickCount.current += 1;

    if (clickResetTimer.current) {
      clearTimeout(clickResetTimer.current);
    }

    clickResetTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, PORTFOLIO_DATA.easterEgg.timeoutMs);

    if (clickCount.current >= PORTFOLIO_DATA.easterEgg.clickTarget) {
      clickCount.current = 0;
      if (clickResetTimer.current) clearTimeout(clickResetTimer.current);
      triggerHackerGlitch();
    }
  }, [triggerHackerGlitch]);

  // Matrix Code Rain Effect
  useEffect(() => {
    if (!isGlitchActive) return;

    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars =
      '010101 METEHAN BIGDATA CHURN PREDICTION GYM KAFKA SQL PYTHON CLUSTER MATRIX 0x8F';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    let animId: number;

    const drawMatrix = () => {
      ctx.fillStyle = 'rgba(8, 4, 15, 0.25)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.85) {
          ctx.fillStyle = '#E0AAFF';
        } else {
          ctx.fillStyle = '#7B2CBF';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isGlitchActive]);

  return {
    isGlitchActive,
    displayedLines,
    handleNameClick,
    matrixCanvasRef,
  };
}

