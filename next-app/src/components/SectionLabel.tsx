import React from 'react';

interface SectionLabelProps {
  label: string;
  icon?: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  label,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 shadow-[0_0_15px_rgba(184,41,234,0.15)] mb-3 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
      {icon && <i className={`${icon} text-[11px] text-[#b829ea]`} />}
      <span className="uppercase">{label}</span>
    </div>
  );
};

export default SectionLabel;
