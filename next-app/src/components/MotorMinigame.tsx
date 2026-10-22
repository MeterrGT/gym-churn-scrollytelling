'use client';
import React from 'react';
import { useMotorMinigame } from '@/hooks/useMotorMinigame';

export const MotorMinigame: React.FC = () => {
  const {
    currentTemp,
    successfulInterventions,
    isGameLocked,
    gameStatus,
    coolMotor,
    restartGame,
  } = useMotorMinigame();

  const getGearDuration = () => {
    switch (gameStatus) {
      case 'crashed':
        return '0s';
      case 'saved':
        return '2.5s';
      case 'critical':
        return '0.35s';
      case 'warning':
        return '0.7s';
      default:
        return '1.4s';
    }
  };

  const renderStatus = () => {
    switch (gameStatus) {
      case 'crashed':
        return (
          <>
            <i className="fa-solid fa-skull" style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}> SİSTEM ÇÖKTÜ - Termal Hasar Oluştu!</span>
          </>
        );
      case 'saved':
        return (
          <>
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} />
            <span style={{ color: '#10b981' }}> SİSTEM KURTARILDI - Erken Müdahale Başarılı!</span>
          </>
        );
      case 'critical':
        return (
          <>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}> Yüksek Risk: Kritik Aşırı Isınma!</span>
          </>
        );
      case 'warning':
        return (
          <>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b' }} />
            <span style={{ color: '#f59e0b' }}> Dikkat: Sıcaklık Yükseliyor</span>
          </>
        );
      default:
        return (
          <>
            <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }} />
            <span style={{ color: '#10b981' }}> Normal Çalışma Sıcaklığı</span>
          </>
        );
    }
  };

  const getFillColor = () => {
    if (gameStatus === 'saved') return '#10b981';
    if (gameStatus === 'critical' || gameStatus === 'crashed') return '#ef4444';
    if (gameStatus === 'warning') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div
      className="motor-minigame-widget w-full overflow-hidden"
      id="motor-widget"
      style={{
        background: 'rgba(14, 10, 24, 0.85)',
        border: '1px solid rgba(199, 125, 255, 0.25)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginTop: '0.5rem',
        boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(184, 41, 234, 0.1)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 w-full">
        <div className="flex items-center gap-3">
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(199, 125, 255, 0.12)',
              border: '1px solid rgba(199, 125, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--purple-bright)',
              fontSize: '1.3rem',
              boxShadow: '0 0 15px rgba(157, 78, 221, 0.25)',
              flexShrink: 0,
            }}
          >
            <i
              className="fa-solid fa-gear fa-spin"
              style={{ animationDuration: getGearDuration() }}
            />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--purple-bright)',
                letterSpacing: '0.5px',
                display: 'block',
              }}
            >
              KESTİRİMCİ BAKIM SİMÜLASYONU
            </span>
            <h4 className="text-base sm:text-lg font-bold text-white m-0">
              Motor Sıcaklığı & Arıza Riski
            </h4>
          </div>
        </div>

        <div
          className="self-start sm:self-auto font-mono text-xs px-3.5 py-1 rounded-full border border-[#c77dff]/30 text-[#c77dff] bg-[#240046]/60"
        >
          Müdahale: <strong style={{ color: '#ffffff' }}>{successfulInterventions}/5</strong>
        </div>
      </div>

      {/* Temperature Progress Track */}
      <div className="mb-5 w-full">
        <div
          style={{
            height: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '0.6rem',
            width: '100%',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, currentTemp))}%`,
              background: getFillColor(),
              boxShadow: `0 0 10px ${getFillColor()}`,
              transition: 'all 0.3s ease',
              borderRadius: '5px',
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm font-mono">
          <span>{renderStatus()}</span>
          <span style={{ color: getFillColor(), fontWeight: 'bold' }}>
            {gameStatus === 'crashed'
              ? '%100 [ARIZA]'
              : gameStatus === 'saved'
              ? '%22 Optimal'
              : `%${Math.round(currentTemp)} Sıcaklık`}
          </span>
        </div>
      </div>

      {/* Action Buttons (Full width on mobile, stacked) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
        <button
          type="button"
          onClick={coolMotor}
          disabled={isGameLocked}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white transition-all shadow-[0_0_20px_rgba(157,78,221,0.4)]"
          style={{
            background: 'linear-gradient(135deg, #7b2cbf, #9d4edd)',
            border: 'none',
            cursor: isGameLocked ? 'not-allowed' : 'pointer',
            opacity: isGameLocked ? 0.5 : 1,
          }}
        >
          <i className="fa-solid fa-snowflake" />
          <span>Analiz Et ve Müdahale Et</span>
        </button>

        {isGameLocked && (
          <button
            type="button"
            onClick={restartGame}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-semibold text-white bg-white/[0.08] hover:bg-white/15 border border-[#c77dff]/30 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right" />
            <span>Yeniden Başlat</span>
          </button>
        )}
      </div>

      {/* Success Badge */}
      {gameStatus === 'saved' && (
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
          <i className="fa-solid fa-award text-lg shrink-0" />
          <div>
            <strong className="block font-bold">SİSTEM KURTARILDI!</strong>
            <span>Erken uyarı algoritması motor arızasını başarıyla önledi.</span>
          </div>
        </div>
      )}
    </div>
  );
};

