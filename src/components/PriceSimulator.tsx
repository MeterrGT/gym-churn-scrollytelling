import React from 'react';
import { usePriceSimulator } from '@/hooks/usePriceSimulator';

export const PriceSimulator: React.FC = () => {
  const {
    ram,
    setRam,
    cpu,
    setCpu,
    gpu,
    setGpu,
    formattedPrice,
    cpuDescription,
    gpuDescription,
    getTrackBackground,
  } = usePriceSimulator();

  return (
    <div className="price-simulator-widget" id="price-sim-widget">
      <div className="sim-header">
        <div className="sim-title-group">
          <div className="sim-icon-box">
            <i className="fa-solid fa-laptop-code" />
          </div>
          <div>
            <span className="widget-badge">MAKİNE ÖĞRENMESİ REGRESYON MODELİ</span>
            <h4 className="widget-title">Laptop Donanım &amp; Fiyat Tahmini</h4>
          </div>
        </div>
        <span className="sim-model-tag">OLS Regresyon</span>
      </div>

      {/* Responsive Horizontal Grid for Sliders & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-4">
        {/* Sliders Column (Left) */}
        <div className="lg:col-span-7 space-y-4">
          {/* RAM Slider */}
          <div className="sim-control-group !mb-2">
            <div className="sim-control-header">
              <label htmlFor="ram-slider" className="sim-label">
                <i className="fa-solid fa-microchip" /> Sistem Belleği (RAM)
              </label>
              <span className="sim-value-badge" id="ram-val-display">
                {ram} GB
              </span>
            </div>
            <input
              type="range"
              id="ram-slider"
              className="cyber-range-slider"
              min="4"
              max="64"
              step="4"
              value={ram}
              onChange={(e) => setRam(parseInt(e.target.value, 10))}
              style={{ background: getTrackBackground(ram, 4, 64) }}
            />
            <div className="sim-range-hints">
              <span>4 GB</span>
              <span>16 GB (Standart)</span>
              <span>64 GB (İş İstasyonu)</span>
            </div>
          </div>

          {/* CPU Slider */}
          <div className="sim-control-group !mb-2">
            <div className="sim-control-header">
              <label htmlFor="cpu-slider" className="sim-label">
                <i className="fa-solid fa-server" /> İşlemci Gücü (CPU Tier)
              </label>
              <span className="sim-value-badge" id="cpu-val-display">
                {cpuDescription}
              </span>
            </div>
            <input
              type="range"
              id="cpu-slider"
              className="cyber-range-slider"
              min="1"
              max="10"
              step="1"
              value={cpu}
              onChange={(e) => setCpu(parseInt(e.target.value, 10))}
              style={{ background: getTrackBackground(cpu, 1, 10) }}
            />
            <div className="sim-range-hints">
              <span>Tier 1 (Giriş)</span>
              <span>Tier 5 (i7/R7)</span>
              <span>Tier 10 (En Üst)</span>
            </div>
          </div>

          {/* GPU Slider */}
          <div className="sim-control-group !mb-2">
            <div className="sim-control-header">
              <label htmlFor="gpu-slider" className="sim-label">
                <i className="fa-solid fa-gamepad" /> Grafik Kartı (GPU Tier)
              </label>
              <span className="sim-value-badge" id="gpu-val-display">
                {gpuDescription}
              </span>
            </div>
            <input
              type="range"
              id="gpu-slider"
              className="cyber-range-slider"
              min="1"
              max="10"
              step="1"
              value={gpu}
              onChange={(e) => setGpu(parseInt(e.target.value, 10))}
              style={{ background: getTrackBackground(gpu, 1, 10) }}
            />
            <div className="sim-range-hints">
              <span>Tier 1 (Dahili)</span>
              <span>Tier 5 (RTX 4060)</span>
              <span>Tier 10 (RTX 4090)</span>
            </div>
          </div>
        </div>

        {/* Result Display Box Column (Right) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="sim-result-box !mt-0 h-full flex flex-col justify-center py-6">
            <div className="sim-result-meta">
              <span className="sim-result-label">
                <i className="fa-solid fa-calculator" /> Tahmini Piyasa Değeri
              </span>
              <span className="sim-formula-hint">Fiyat = β₀ + β₁(RAM) + β₂(CPU) + β₃(GPU)</span>
            </div>
            <div className="sim-price-display my-2" id="sim-price-display">
              {formattedPrice}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-2 block">
              Doğrusal En Küçük Kareler (OLS) Regresyonu • R² = 0.88
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
