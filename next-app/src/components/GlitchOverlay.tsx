'use client';
import React from 'react';

interface GlitchOverlayProps {
  isActive: boolean;
  lines: string[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  isActive,
  lines,
  canvasRef,
}) => {
  if (!isActive) return null;

  return (
    <div id="hacker-glitch-overlay" className="glitch-overlay">
      <canvas id="matrix-rain-canvas" ref={canvasRef} />
      <div className="glitch-terminal-box">
        <div className="glitch-terminal-header">
          <span className="glitch-alert-pulse" />
          <span className="glitch-header-title">CRITICAL_SYSTEM_ALERT // KERNEL_PANIC</span>
        </div>
        <div className="glitch-terminal-body" id="glitch-terminal-lines">
          {lines.map((line, idx) => (
            <div key={idx} className="glitch-line">
              <span style={{ color: '#C77DFF', fontWeight: 'bold' }}>[UYARI]</span> {line}
            </div>
          ))}
        </div>
        <div className="glitch-countdown-bar">
          <div className="countdown-fill" id="glitch-timer-fill" />
        </div>
      </div>
    </div>
  );
};

