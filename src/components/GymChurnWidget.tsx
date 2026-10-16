import React, { useState } from 'react';

// Lookup table based on real Kaggle Gym Churn US (4,000 records)
const CHURN_LOOKUP: Record<string, Record<string, { pct: number; rate: number; label: string }>> = {
  '18-25': {
    '1': { pct: 78.20, rate: 0.7820, label: 'Zirve Yüksek Risk' },
    '6': { pct: 45.98, rate: 0.4598, label: 'Yüksek Risk' },
    '12': { pct: 6.10, rate: 0.0610, label: 'Düşük Risk' },
  },
  '26-29': {
    '1': { pct: 50.44, rate: 0.5044, label: 'Yüksek Risk' },
    '6': { pct: 15.34, rate: 0.1534, label: 'Orta Risk' },
    '12': { pct: 4.53, rate: 0.0453, label: 'Düşük Risk' },
  },
  '30-33': {
    '1': { pct: 22.91, rate: 0.2291, label: 'Orta Risk' },
    '6': { pct: 3.93, rate: 0.0393, label: 'Düşük Risk' },
    '12': { pct: 0.48, rate: 0.0048, label: 'En Düşük Risk (Sadık)' },
  },
  '34+': {
    '1': { pct: 6.79, rate: 0.0679, label: 'Düşük Risk' },
    '6': { pct: 1.12, rate: 0.0112, label: 'En Düşük Risk' },
    '12': { pct: 0.00, rate: 0.0000, label: 'Sıfır Terk (Mükemmel Sadakat)' },
  },
};

export const GymChurnWidget: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<string>('18-25');
  const [selectedPlan, setSelectedPlan] = useState<string>('1');
  const [actionApplied, setActionApplied] = useState<boolean>(false);

  const rawInfo = CHURN_LOOKUP[selectedAge]?.[selectedPlan] || { pct: 26.5, rate: 0.26525, label: 'Orta Risk' };
  const currentPct = actionApplied ? 4.53 : rawInfo.pct;
  const currentLabel = actionApplied ? 'Tutundurma Başarılı (Yıllık Taahhüt)' : rawInfo.label;

  const handleApplyAction = () => {
    setActionApplied(true);
  };

  const handleReset = () => {
    setActionApplied(false);
  };

  const getRiskColor = (pct: number) => {
    if (pct >= 40) return '#ef4444';
    if (pct >= 15) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div
      className="gym-churn-widget"
      id="churn-widget"
      style={{
        marginTop: '0.5rem',
        padding: '1rem',
        background: 'rgba(18, 15, 28, 0.85)',
        border: '1px solid rgba(199, 125, 255, 0.25)',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(184, 41, 234, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(184,41,234,0.3), rgba(123,44,191,0.15))',
              border: '1px solid rgba(199,125,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c77dff',
              fontSize: '1.2rem',
            }}
          >
            <i className="fa-solid fa-dumbbell" />
          </div>
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#c77dff',
                letterSpacing: '1px',
                fontWeight: 600,
              }}
            >
              KAGGLE CHURN MODELİ ETKİLEŞİMLİ SİMÜLATÖR
            </span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>
              Üye Profili Churn Riski Tahmini
            </h4>
          </div>
        </div>

        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            background: 'rgba(36, 0, 70, 0.6)',
            padding: '0.35rem 0.85rem',
            borderRadius: '50px',
            border: '1px solid rgba(199, 125, 255, 0.3)',
            color: '#c77dff',
          }}
        >
          Kaggle Gym Dataset EDA
        </div>
      </div>

      {/* Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Age Group Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
            Yaş Grubu Seçin:
          </label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['18-25', '26-29', '30-33', '34+'].map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => {
                  setSelectedAge(age);
                  setActionApplied(false);
                }}
                style={{
                  flex: 1,
                  minWidth: '60px',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  borderRadius: '8px',
                  background: selectedAge === age ? 'var(--purple-bright)' : 'rgba(255,255,255,0.05)',
                  color: selectedAge === age ? '#0d0d0d' : '#e2e8f0',
                  border: selectedAge === age ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: selectedAge === age ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Membership Type Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
            Sözleşme Süresi Seçin:
          </label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: '1', label: '1 Ay' },
              { id: '6', label: '6 Ay' },
              { id: '12', label: '12 Ay' },
            ].map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedPlan(plan.id);
                  setActionApplied(false);
                }}
                style={{
                  flex: 1,
                  minWidth: '70px',
                  padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  borderRadius: '8px',
                  background: selectedPlan === plan.id ? 'var(--purple-bright)' : 'rgba(255,255,255,0.05)',
                  color: selectedPlan === plan.id ? '#0d0d0d' : '#e2e8f0',
                  border: selectedPlan === plan.id ? '1px solid #ffffff' : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: selectedPlan === plan.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {plan.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Churn Risk Bar & Score */}
      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: getRiskColor(currentPct),
                boxShadow: `0 0 8px ${getRiskColor(currentPct)}`,
              }}
            />
            <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 600 }}>
              Tahmin Edilen Churn Riski:
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: `${getRiskColor(currentPct)}22`,
                color: getRiskColor(currentPct),
                border: `1px solid ${getRiskColor(currentPct)}44`,
              }}
            >
              {currentLabel}
            </span>
          </div>

          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: getRiskColor(currentPct),
            }}
          >
            %{currentPct.toFixed(1).replace('.', ',')}
          </span>
        </div>

        {/* Progress track */}
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, (currentPct / 45) * 100)}%`,
              background: getRiskColor(currentPct),
              borderRadius: '4px',
              transition: 'all 0.5s ease',
              boxShadow: `0 0 10px ${getRiskColor(currentPct)}`,
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {!actionApplied ? (
          <button
            type="button"
            onClick={handleApplyAction}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '0.65rem 1.25rem',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #b829ea, #7b2cbf)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 15px rgba(184, 41, 234, 0.4)',
            }}
          >
            <i className="fa-solid fa-user-shield" />
            <span>Erken Uyarı &amp; Tutundurma Stratejisi Uygula</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.88rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <i className="fa-solid fa-rotate-right" />
            <span>Sıfırla</span>
          </button>
        )}
      </div>

      {/* Success Card */}
      {actionApplied && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '8px',
            color: '#10b981',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <i className="fa-solid fa-circle-check" style={{ fontSize: '1.1rem' }} />
          <span>
            <strong>Tutundurma Aksiyonu Başarılı:</strong> Üyeye yıllık taahhüt avantajı ve kişisel antrenman programı tanımlandı. Terk riski <strong>%4,5</strong> seviyesine düşürüldü!
          </span>
        </div>
      )}
    </div>
  );
};
