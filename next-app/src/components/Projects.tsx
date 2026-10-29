'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PORTFOLIO_DATA, ProjectTool } from '@/data/portfolio';
import { MotorMinigame } from './MotorMinigame';
import { PriceSimulator } from './PriceSimulator';
import { SectionLabel } from './SectionLabel';

export const Projects: React.FC = () => {
  const { project, previousProjects, blueskyProject } = PORTFOLIO_DATA;
  const motorProject = previousProjects[0];
  const laptopProject = previousProjects[1];

  // Active simulation state: 'laptop' | 'motor' | null
  const [activeSimulation, setActiveSimulation] = useState<'laptop' | 'motor' | null>(null);
  const simContainerRef = useRef<HTMLDivElement>(null);

  // Smooth scroll into view when a simulator is opened
  useEffect(() => {
    if (activeSimulation && simContainerRef.current) {
      simContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSimulation]);

  return (
    <section className="section projects-section" id="projects">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="section-heading text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <SectionLabel label="Projelerim" icon="fa-solid fa-diagram-project" />
          <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
            Projelerim ve Analitik Modeller
          </h2>
          <p className="section-sub text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed px-2 sm:px-0">
            Büyük veri analitiği, sosyal ağ analizi (SNA), IoT kestirimci arıza tespiti ve çok değişkenli ekonometrik regresyon modellerim.
          </p>
          <div className="heading-line w-20 h-1 bg-gradient-to-r from-transparent via-[#b829ea] to-transparent mx-auto mt-5 sm:mt-6" />
        </div>

        {/* 2x2 Grid Layout for Balanced, Spacious Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* ========================================================
              Card 1: Gym Members Churn Prediction
             ======================================================== */}
          <div className="project-showcase-card h-full flex flex-col justify-between bg-[#110e1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/70 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(184,41,234,0.3)] transition-all duration-300 relative group">
            
            {/* Card Top */}
            <div className="project-card-top flex items-center justify-between gap-2 px-5 py-3.5 bg-[#140f26]/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="project-badge text-[11px] py-0.5 px-2.5">
                  <span className="badge-dot" />
                  <span>Kaggle Churn</span>
                </div>
                <span className="academic-note text-[11px] font-mono text-slate-400">
                  <i className="fa-solid fa-graduation-cap text-[#b829ea] mr-1" /> Akademik Proje
                </span>
              </div>

              {/* Status Badge: Completed (Green) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tamamlandı</span>
              </div>
            </div>

            {/* Card Main Body */}
            <div className="project-card-main p-5 sm:p-6 bg-[#0d0d0d]/90 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div>
                  <h3 className="project-heading text-lg sm:text-xl font-extrabold text-white mb-1 group-hover:text-[#c77dff] transition-colors">
                    {project.title}
                  </h3>
                  <span className="project-subheading block text-xs font-mono text-[#b829ea] font-semibold">
                    {project.subtitle}
                  </span>
                </div>

                <p className="project-text text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Insight Box */}
                <div className="project-goal-box p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="goal-icon text-sm text-[#b829ea] mt-0.5 shrink-0">
                    <i className="fa-solid fa-bullseye" />
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-0.5">{project.goal.title}</strong>
                    <p className="text-[11px] text-slate-300 m-0 leading-relaxed">{project.goal.description}</p>
                  </div>
                </div>

                {/* Tools Tags */}
                <div className="project-tools">
                  <div className="tools-tags flex flex-wrap gap-1.5">
                    {project.tools.map((tool: ProjectTool, idx: number) => (
                      <span key={idx} className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/10">
                        <i className={`${tool.icon} text-[#b829ea]`} /> {tool.name}
                      </span>
                    ))}
                    <span className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                      <i className="fa-solid fa-chart-column text-[#b829ea]" /> D3.js & Scrollama
                    </span>
                  </div>
                </div>
              </div>

              {/* Informative Scrollytelling Preview Banner */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <div className="w-full py-2.5 px-3 rounded-xl text-xs font-mono font-medium bg-[#140f26]/60 text-[#c77dff] border border-[#b829ea]/20 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-chart-pie text-[#b829ea]" />
                    <span>İnteraktif Veri Hikayesi</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">6 Adımlı Scrolly</span>
                </div>
              </div>
            </div>

            {/* Card Bottom / Footer Actions */}
            <div className="project-card-bottom flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3.5 bg-[#140f26]/80 border-t border-white/10 shrink-0">
              {/* Secondary: Kaggle Veri Seti */}
              <a
                href="https://www.kaggle.com/datasets"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-purple text-xs px-3 py-2 sm:py-1.5 rounded-lg border border-[#b829ea]/40 text-[#e0aaff] hover:bg-[#b829ea]/15 inline-flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
              >
                <i className="fa-brands fa-kaggle text-sm" />
                <span>Kaggle Veri Seti</span>
              </a>

              {/* Primary: Scrollytelling Sayfasına Git */}
              <Link
                href="/gym-churn"
                className="btn btn-sm btn-primary text-xs font-bold text-white bg-[#b829ea] hover:bg-[#9d17cb] px-3.5 py-2 sm:py-1.5 rounded-lg border border-[#e0aaff]/40 shadow-[0_0_15px_rgba(184,41,234,0.4)] hover:shadow-[0_0_20px_rgba(184,41,234,0.6)] inline-flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
              >
                <i className="fa-solid fa-chart-column" />
                <span>Scrollytelling Sayfasına Git</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </div>

          {/* ========================================================
              Card 2: Kestirimci Bakım Sistemleri ile Endüstride Arıza Önleme
             ======================================================== */}
          <div className="project-showcase-card h-full flex flex-col justify-between bg-[#110e1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/70 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(184,41,234,0.3)] transition-all duration-300 relative group">
            
            {/* Card Top */}
            <div className="project-card-top flex items-center justify-between gap-2 px-5 py-3.5 bg-[#140f26]/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="project-badge text-[11px] py-0.5 px-2.5">
                  <span className="badge-dot" />
                  <span>{motorProject.badge}</span>
                </div>
                <span className="academic-note text-[11px] font-mono text-slate-400">
                  <i className="fa-solid fa-microchip text-[#b829ea] mr-1" /> IoT & Anomali
                </span>
              </div>

              {/* Status Badge: In Research (Yellow) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Araştırma Aşamasında</span>
              </div>
            </div>

            {/* Card Main Body */}
            <div className="project-card-main p-5 sm:p-6 bg-[#0d0d0d]/90 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div>
                  <h3 className="project-heading text-lg sm:text-xl font-extrabold text-white mb-1 group-hover:text-[#c77dff] transition-colors">
                    {motorProject.title}
                  </h3>
                  <span className="project-subheading block text-xs font-mono text-[#b829ea] font-semibold">
                    {motorProject.subtitle}
                  </span>
                </div>

                <p className="project-text text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {motorProject.description}
                </p>

                {/* Key Insight Box */}
                <div className="project-goal-box p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="goal-icon text-sm text-[#b829ea] mt-0.5 shrink-0">
                    <i className="fa-solid fa-temperature-arrow-up" />
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-0.5">Erken Uyarı Mantığı:</strong>
                    <p className="text-[11px] text-slate-300 m-0 leading-relaxed">
                      Sensör sıcaklık ve titreşim sinyalleri izlenerek kritik tolerans eşiği (75°C+) aşıldığında sistem arızasını önceden kestirip koruyucu müdahale tetiklenir.
                    </p>
                  </div>
                </div>

                {/* Tools Tags */}
                <div className="project-tools">
                  <div className="tools-tags flex flex-wrap gap-1.5">
                    {motorProject.tools.map((tool, idx) => (
                      <span key={idx} className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/10">
                        <i className={`${tool.icon} text-[#b829ea]`} /> {tool.name}
                      </span>
                    ))}
                    <span className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                      <i className="fa-solid fa-sliders text-[#b829ea]" /> IoT Simülatörü
                    </span>
                  </div>
                </div>
              </div>

              {/* Trigger Full-Width Simulator Area Button */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveSimulation((prev) => (prev === 'motor' ? null : 'motor'))}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center justify-between group/btn cursor-pointer ${
                    activeSimulation === 'motor'
                      ? 'bg-[#b829ea]/25 text-white border border-[#b829ea] shadow-[0_0_15px_rgba(184,41,234,0.4)]'
                      : 'bg-[#140f26]/80 hover:bg-[#b829ea]/20 text-[#e0aaff] hover:text-white border border-[#b829ea]/40 hover:border-[#b829ea] shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(184,41,234,0.3)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-gamepad text-[#b829ea] group-hover/btn:scale-110 transition-transform" />
                    <span>{activeSimulation === 'motor' ? 'Simülasyonu Kapat' : 'Simülasyonu Aç'}</span>
                  </span>
                  <i
                    className={`fa-solid ${
                      activeSimulation === 'motor' ? 'fa-chevron-up' : 'fa-chevron-down'
                    } text-xs text-[#b829ea] transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Card Bottom / Footer Actions */}
            <div className="project-card-bottom flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3.5 bg-[#140f26]/80 border-t border-white/10 shrink-0">
              <span className="text-[11px] font-mono text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 py-1 sm:py-0">
                <i className="fa-solid fa-clock text-amber-400" />
                <span>Analiz & Test Sürecinde</span>
              </span>

              {/* Inactive / Disabled Action Button: Veri Seti Bekleniyor */}
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-lg text-xs font-semibold font-mono bg-white/[0.04] text-slate-400 border border-white/10 cursor-not-allowed opacity-60 w-full sm:w-auto"
              >
                <i className="fa-solid fa-hourglass-half text-amber-400" />
                <span>Veri Seti Bekleniyor</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              Card 3: Laptop Fiyat Tahmini ve Ekonometrik Regresyon Analizi
             ======================================================== */}
          <div className="project-showcase-card h-full flex flex-col justify-between bg-[#110e1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/70 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(184,41,234,0.3)] transition-all duration-300 relative group">
            
            {/* Card Top */}
            <div className="project-card-top flex items-center justify-between gap-2 px-5 py-3.5 bg-[#140f26]/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="project-badge text-[11px] py-0.5 px-2.5">
                  <span className="badge-dot" />
                  <span>{laptopProject.badge}</span>
                </div>
                <span className="academic-note text-[11px] font-mono text-slate-400">
                  <i className="fa-solid fa-chart-line text-[#b829ea] mr-1" /> OLS Regresyon
                </span>
              </div>

              {/* Status Badge: Completed (Green) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tamamlandı</span>
              </div>
            </div>

            {/* Card Main Body */}
            <div className="project-card-main p-5 sm:p-6 bg-[#0d0d0d]/90 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div>
                  <h3 className="project-heading text-lg sm:text-xl font-extrabold text-white mb-1 group-hover:text-[#c77dff] transition-colors">
                    {laptopProject.title}
                  </h3>
                  <span className="project-subheading block text-xs font-mono text-[#b829ea] font-semibold">
                    {laptopProject.subtitle}
                  </span>
                </div>

                <p className="project-text text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {laptopProject.description}
                </p>

                {/* Key Insight Box */}
                <div className="project-goal-box p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="goal-icon text-sm text-[#b829ea] mt-0.5 shrink-0">
                    <i className="fa-solid fa-calculator" />
                  </div>
                  <div>
                    <strong className="text-white text-xs block mb-0.5">Regresyon Modeli:</strong>
                    <p className="text-[11px] text-slate-300 m-0 leading-relaxed">
                      Fiyat = 280 + 16×(RAM) + 85×(CPU Tier) + 155×(GPU Tier). R² = 0.88 ile donanım katsayılarının anlamlılığı kanıtlanmıştır.
                    </p>
                  </div>
                </div>

                {/* Tools Tags */}
                <div className="project-tools">
                  <div className="tools-tags flex flex-wrap gap-1.5">
                    {laptopProject.tools.map((tool, idx) => (
                      <span key={idx} className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/10">
                        <i className={`${tool.icon} text-[#b829ea]`} /> {tool.name}
                      </span>
                    ))}
                    <span className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                      <i className="fa-solid fa-calculator text-[#b829ea]" /> Fiyat Simülatörü
                    </span>
                  </div>
                </div>
              </div>

              {/* Trigger Full-Width Simulator Area Button */}
              <div className="mt-5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveSimulation((prev) => (prev === 'laptop' ? null : 'laptop'))}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all duration-200 flex items-center justify-between group/btn cursor-pointer ${
                    activeSimulation === 'laptop'
                      ? 'bg-[#b829ea]/25 text-white border border-[#b829ea] shadow-[0_0_15px_rgba(184,41,234,0.4)]'
                      : 'bg-[#140f26]/80 hover:bg-[#b829ea]/20 text-[#e0aaff] hover:text-white border border-[#b829ea]/40 hover:border-[#b829ea] shadow-[0_2px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(184,41,234,0.3)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-calculator text-[#b829ea] group-hover/btn:scale-110 transition-transform" />
                    <span>{activeSimulation === 'laptop' ? 'Simülasyonu Kapat' : 'Simülasyonu Aç'}</span>
                  </span>
                  <i
                    className={`fa-solid ${
                      activeSimulation === 'laptop' ? 'fa-chevron-up' : 'fa-chevron-down'
                    } text-xs text-[#b829ea] transition-transform`}
                  />
                </button>
              </div>
            </div>

            {/* Card Bottom / Footer Actions */}
            <div className="project-card-bottom flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3.5 bg-[#140f26]/80 border-t border-white/10 shrink-0">
              <span className="text-[11px] font-mono text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 py-1 sm:py-0">
                <i className="fa-solid fa-circle-check text-emerald-400" />
                <span>R² = 0.88 Doğruluk</span>
              </span>

              {/* Action Button: Kaggle Veri Seti */}
              <a
                href="https://www.kaggle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-purple text-xs px-3.5 py-2 sm:py-1.5 rounded-lg border border-[#b829ea]/40 text-[#e0aaff] hover:bg-[#b829ea]/15 inline-flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
              >
                <i className="fa-brands fa-kaggle text-sm" />
                <span>Kaggle Veri Seti</span>
              </a>
            </div>
          </div>

          {/* ========================================================
              Card 4: Bluesky Turkish Hashtag Network
             ======================================================== */}
          <div className="project-showcase-card h-full flex flex-col justify-between bg-[#110e1c]/90 border border-[#b829ea]/30 hover:border-[#b829ea]/70 rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,41,234,0.15)] hover:shadow-[0_12px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(184,41,234,0.3)] transition-all duration-300 relative group">

            {/* Card Top */}
            <div className="project-card-top flex items-center justify-between gap-2 px-5 py-3.5 bg-[#140f26]/80 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <div className="project-badge text-[11px] py-0.5 px-2.5">
                  <span className="badge-dot" />
                  <span>{blueskyProject.badge}</span>
                </div>
                <span className="academic-note text-[11px] font-mono text-slate-400">
                  <i className="fa-solid fa-graduation-cap text-[#b829ea] mr-1" /> {blueskyProject.academicNote}
                </span>
              </div>

              {/* Status Badge: Completed (Green) */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tamamlandı</span>
              </div>
            </div>

            {/* Card Main Body */}
            <div className="project-card-main p-5 sm:p-6 bg-[#0d0d0d]/90 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div>
                  <h3 className="project-heading text-lg sm:text-xl font-extrabold text-white mb-1 group-hover:text-[#c77dff] transition-colors">
                    {blueskyProject.title}
                  </h3>
                  <span className="project-subheading block text-xs font-mono text-[#b829ea] font-semibold">
                    {blueskyProject.subtitle}
                  </span>
                </div>

                <p className="project-text text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {blueskyProject.description}
                </p>

                {/* Verified Project Metrics Box */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#e0aaff]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <i className="fa-solid fa-square-poll-vertical text-[#b829ea]" />
                      <span>Doğrulanmış Proje Metrikleri</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">Canlı Arşiv Analizi</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                      <i className="fa-regular fa-clock text-[#b829ea] text-xs shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 leading-tight">48-hour archive</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                      <i className="fa-regular fa-message text-[#b829ea] text-xs shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 leading-tight">7,658 posts</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                      <i className="fa-solid fa-circle-nodes text-[#b829ea] text-xs shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 leading-tight">7,092 nodes</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/5">
                      <i className="fa-solid fa-share-nodes text-[#b829ea] text-xs shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 leading-tight">37,206 edges</span>
                    </div>
                  </div>
                </div>

                {/* Tools Tags */}
                <div className="project-tools">
                  <div className="tools-tags flex flex-wrap gap-1.5">
                    {blueskyProject.tools.map((tool, idx) => (
                      <span key={idx} className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/10">
                        <i className={`${tool.icon} text-[#b829ea]`} /> {tool.name}
                      </span>
                    ))}
                    <span className="tag-item inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/30">
                      <i className="fa-solid fa-network-wired text-[#b829ea]" /> SNA & Louvain
                    </span>
                  </div>
                </div>
              </div>

              {/* Deliverables Link Row */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <i className="fa-solid fa-folder-open text-[#b829ea] text-[10px]" />
                  <span>Teslimatlar:</span>
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={blueskyProject.deliverables.report}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c77dff] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <i className="fa-regular fa-file-pdf text-red-400 text-[10px]" />
                    <span>Rapor</span>
                  </a>
                  <span className="text-white/20">•</span>
                  <a
                    href={blueskyProject.deliverables.poster}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c77dff] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <i className="fa-solid fa-image text-purple-400 text-[10px]" />
                    <span>Poster</span>
                  </a>
                  <span className="text-white/20">•</span>
                  <a
                    href={blueskyProject.deliverables.presentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#c77dff] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <i className="fa-solid fa-chalkboard-user text-amber-400 text-[10px]" />
                    <span>Sunum</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Card Bottom / Footer Actions */}
            <div className="project-card-bottom flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3.5 bg-[#140f26]/80 border-t border-white/10 shrink-0">
              {/* Secondary Action: Live Network */}
              <a
                href={blueskyProject.deliverables.interactive}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-purple text-xs px-3 py-2 sm:py-1.5 rounded-lg border border-[#b829ea]/40 text-[#e0aaff] hover:bg-[#b829ea]/15 inline-flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto"
              >
                <i className="fa-solid fa-share-nodes text-xs" />
                <span>Live Network</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              </a>

              {/* Primary Action: Case Study */}
              <Link
                href="/bluesky-hashtag-network"
                className="btn btn-sm btn-primary text-xs font-bold text-white bg-[#b829ea] hover:bg-[#9d17cb] px-3.5 py-2 sm:py-1.5 rounded-lg border border-[#e0aaff]/40 shadow-[0_0_15px_rgba(184,41,234,0.4)] hover:shadow-[0_0_20px_rgba(184,41,234,0.6)] inline-flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto"
              >
                <i className="fa-solid fa-diagram-project" />
                <span>Case Study</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </div>

        </div>

        {/* ========================================================
            Full-Width Dashboard Expansion Area BELOW the Grid
           ======================================================== */}
        {activeSimulation && (
          <div
            ref={simContainerRef}
            className="mt-8 w-full bg-[#100c1e]/95 border border-[#b829ea] shadow-[0_0_35px_rgba(184,41,234,0.35),0_15px_45px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden transition-all duration-300 animate-fadeIn"
          >
            {/* Expanded Area Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-[#140f26]/95 border-b border-white/10 gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b829ea]/15 border border-[#b829ea]/40 flex items-center justify-center text-[#c77dff] shadow-[0_0_12px_rgba(184,41,234,0.35)] shrink-0">
                  <i
                    className={`fa-solid ${
                      activeSimulation === 'motor' ? 'fa-microchip' : 'fa-laptop-code'
                    } text-lg`}
                  />
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-[#b829ea] uppercase block">
                    {activeSimulation === 'motor'
                      ? 'IoT & Anomali Tespiti İnteraktif Paneli'
                      : 'Ekonometrik Regresyon İnteraktif Paneli'}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">
                    {activeSimulation === 'motor'
                      ? 'Kestirimci Bakım: Motor Sıcaklığı & Arıza Riski Simülatörü'
                      : 'Laptop Fiyat Tahmini: Donanım & Değerleme Regresyon Simülatörü'}
                  </h3>
                </div>
              </div>

              {/* Close Button Inside Expanded Area */}
              <button
                type="button"
                onClick={() => setActiveSimulation(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-[#b829ea]/25 border border-white/15 hover:border-[#b829ea] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group/close"
              >
                <span>Simülasyonu Kapat</span>
                <i className="fa-solid fa-xmark text-sm text-[#b829ea] group-hover/close:rotate-90 transition-transform" />
              </button>
            </div>

            {/* Expanded Area Simulator Body (Full horizontal layout) */}
            <div className="p-4 sm:p-6 md:p-8 bg-[#0d0d0d] [&_.price-simulator-widget]:mt-0 [&_.motor-minigame-widget]:mt-0 overflow-x-hidden">
              {activeSimulation === 'motor' && <MotorMinigame />}
              {activeSimulation === 'laptop' && <PriceSimulator />}
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

export default Projects;



