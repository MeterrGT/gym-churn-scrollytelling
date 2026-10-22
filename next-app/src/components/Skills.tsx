import React from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { SectionLabel } from './SectionLabel';

export const Skills: React.FC = () => {
  return (
    <section className="section skills-section" id="skills">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="section-heading text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <SectionLabel label="Araçlar & Beceriler" icon="fa-solid fa-code" />
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            Öğrendiğim ve Geliştirdiğim Araçlar
          </h2>
          <p className="section-sub text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-0">
            Ustalık iddiası yerine: Aktif olarak çalıştığım ve gelişim aşamasında olduğum temel teknolojiler
          </p>
          <div className="heading-line w-20 h-1 bg-gradient-to-r from-transparent via-[#b829ea] to-transparent mx-auto mt-5 sm:mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PORTFOLIO_DATA.skills.map((skill) => (
            <div
              key={skill.id}
              className="skill-card bg-[#120f1c]/80 border border-[#b829ea]/30 hover:border-[#b829ea] hover:shadow-[0_0_15px_#b829ea] transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.04] border border-[#b829ea]/30 text-2xl text-[#b829ea] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(184,41,234,0.5)] transition-all mb-4">
                  <i className={skill.icon} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#c77dff] transition-colors">
                  {skill.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {skill.description}
                </p>
              </div>
              <span className="self-start text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
