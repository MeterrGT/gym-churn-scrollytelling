'use client';
import React from 'react';
import { useCanvasBackground } from '@/hooks/useCanvasBackground';

export const CyberCanvas: React.FC = () => {
  const canvasRef = useCanvasBackground();

  return (
    <>
      <canvas id="cyber-canvas" ref={canvasRef} />
      <div className="ambient-glow orb-purple-1" />
      <div className="ambient-glow orb-purple-2" />
    </>
  );
};

