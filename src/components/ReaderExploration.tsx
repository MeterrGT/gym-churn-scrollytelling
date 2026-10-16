import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CombinedRecord {
  ageGroup: string;
  contractPeriod: number;
  contractLabel: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
}

// Fallback lookup derived from 4,000 observations
const VERIFIED_RECORDS: CombinedRecord[] = [
  { ageGroup: '18-25', contractPeriod: 1, contractLabel: '1 Ay (Aylık)', totalCount: 367, churnCount: 287, churnRate: 0.7820, churnPercentage: 78.20 },
  { ageGroup: '18-25', contractPeriod: 6, contractLabel: '6 Ay (Yarım Yıl)', totalCount: 87, churnCount: 40, churnRate: 0.4598, churnPercentage: 45.98 },
  { ageGroup: '18-25', contractPeriod: 12, contractLabel: '12 Ay (Yıllık)', totalCount: 82, churnCount: 5, churnRate: 0.0610, churnPercentage: 6.10 },
  { ageGroup: '26-29', contractPeriod: 1, contractLabel: '1 Ay (Aylık)', totalCount: 914, churnCount: 461, churnRate: 0.5044, churnPercentage: 50.44 },
  { ageGroup: '26-29', contractPeriod: 6, contractLabel: '6 Ay (Yarım Yıl)', totalCount: 326, churnCount: 50, churnRate: 0.1534, churnPercentage: 15.34 },
  { ageGroup: '26-29', contractPeriod: 12, contractLabel: '12 Ay (Yıllık)', totalCount: 353, churnCount: 16, churnRate: 0.0453, churnPercentage: 4.53 },
  { ageGroup: '30-33', contractPeriod: 1, contractLabel: '1 Ay (Aylık)', totalCount: 764, churnCount: 175, churnRate: 0.2291, churnPercentage: 22.91 },
  { ageGroup: '30-33', contractPeriod: 6, contractLabel: '6 Ay (Yarım Yıl)', totalCount: 331, churnCount: 13, churnRate: 0.0393, churnPercentage: 3.93 },
  { ageGroup: '30-33', contractPeriod: 12, contractLabel: '12 Ay (Yıllık)', totalCount: 413, churnCount: 2, churnRate: 0.0048, churnPercentage: 0.48 },
  { ageGroup: '34+', contractPeriod: 1, contractLabel: '1 Ay (Aylık)', totalCount: 162, churnCount: 11, churnRate: 0.0679, churnPercentage: 6.79 },
  { ageGroup: '34+', contractPeriod: 6, contractLabel: '6 Ay (Yarım Yıl)', totalCount: 89, churnCount: 1, churnRate: 0.0112, churnPercentage: 1.12 },
  { ageGroup: '34+', contractPeriod: 12, contractLabel: '12 Ay (Yıllık)', totalCount: 112, churnCount: 0, churnRate: 0.0000, churnPercentage: 0.00 },
];

const OVERALL_BENCHMARK = 26.5;
const EXACT_BENCHMARK = (1061 / 4000) * 100; // 26.525%

const CONTRACT_NAMES: Record<number, string> = {
  1: '1 Ay (Aylık)',
  6: '6 Ay (Yarım Yıl)',
  12: '12 Ay (Yıllık)',
};

export const ReaderExploration: React.FC = () => {
  const [records, setRecords] = useState<CombinedRecord[]>(VERIFIED_RECORDS);
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const chartRef = useRef<SVGSVGElement | null>(null);

  // Dynamic CSV loader
  useEffect(() => {
    d3.csv('/data/churn_combined.csv').then((rows) => {
      if (!rows.length) return;
      const parsed: CombinedRecord[] = rows.map((r) => ({
        ageGroup: String(r.Age_Group || '').trim(),
        contractPeriod: parseInt(r.Contract_period || '1', 10),
        contractLabel: String(r.Contract_Label || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
      })).filter((r) => r.ageGroup && !isNaN(r.contractPeriod) && !isNaN(r.churnPercentage));

      if (parsed.length === 12) {
        setRecords(parsed);
      }
    }).catch(() => {});
  }, []);

  // Compute stats based on current filters
  const filteredRecords = records.filter((r) => {
    const ageMatch = selectedAge === 'all' || r.ageGroup === selectedAge;
    const contractMatch = selectedContract === 'all' || String(r.contractPeriod) === selectedContract;
    return ageMatch && contractMatch;
  });

  const totalMembersInFilter = filteredRecords.reduce((sum, r) => sum + r.totalCount, 0);
  const totalChurnInFilter = filteredRecords.reduce((sum, r) => sum + r.churnCount, 0);

  const averageChurn = totalMembersInFilter > 0
    ? (totalChurnInFilter / totalMembersInFilter) * 100
    : EXACT_BENCHMARK;

  // Unrounded delta comparison
  const deltaFromBenchmark = averageChurn - EXACT_BENCHMARK;
  const isHigher = deltaFromBenchmark > 0;

  // Render D3 comparative bars
  useEffect(() => {
    if (!chartRef.current) return;
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 660;
    const height = 260;
    const margin = { top: 20, right: 30, bottom: 40, left: 125 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    interface BarItem {
      label: string;
      value: number;
      count: number;
      isHighlighted: boolean;
      color: string;
    }

    let items: BarItem[] = [];

    if (selectedAge !== 'all') {
      const ageRows = records.filter((r) => r.ageGroup === selectedAge);
      items = [1, 6, 12].map((period) => {
        const found = ageRows.find((r) => r.contractPeriod === period);
        const val = found ? found.churnPercentage : 0;
        const count = found ? found.totalCount : 0;
        const isHl = selectedContract === 'all' || selectedContract === String(period);
        const color = period === 1 ? '#c084fc' : period === 6 ? '#38bdf8' : '#34d399';
        return {
          label: CONTRACT_NAMES[period],
          value: val,
          count,
          isHighlighted: isHl,
          color,
        };
      });
    } else if (selectedContract !== 'all') {
      const contractPeriodNum = parseInt(selectedContract, 10);
      const contractRows = records.filter((r) => r.contractPeriod === contractPeriodNum);
      items = ['18-25', '26-29', '30-33', '34+'].map((ag) => {
        const found = contractRows.find((r) => r.ageGroup === ag);
        const val = found ? found.churnPercentage : 0;
        const count = found ? found.totalCount : 0;
        return {
          label: `${ag} Yaş`,
          value: val,
          count,
          isHighlighted: true,
          color: val >= 40 ? '#ef4444' : val <= 10 ? '#34d399' : '#c084fc',
        };
      });
    } else {
      // Both 'all' -> show 3 contract overall averages
      items = [
        { label: '1 Ay (Aylık)', value: 42.32, count: 2207, isHighlighted: true, color: '#c084fc' },
        { label: '6 Ay (Yarım Yıl)', value: 12.48, count: 833, isHighlighted: true, color: '#38bdf8' },
        { label: '12 Ay (Yıllık)', value: 2.40, count: 960, isHighlighted: true, color: '#34d399' },
      ];
    }

    const y = d3.scaleBand().domain(items.map((d) => d.label)).range([0, innerH]).padding(0.3);
    const x = d3.scaleLinear().domain([0, 85]).range([0, innerW]);

    // Grid lines with 12px tick labels
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `%${d}`).tickSize(-innerH))
      .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.2)'))
      .call((axis) => axis.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.1)'))
      .call((axis) => axis.selectAll('text').attr('fill', '#94a3b8').attr('font-family', 'monospace').attr('font-size', 12));

    // Benchmark line with readable 12px label
    const bmX = x(OVERALL_BENCHMARK);
    g.append('line')
      .attr('x1', bmX).attr('x2', bmX)
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#f59e0b')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1.5);

    g.append('text')
      .attr('x', bmX + 6)
      .attr('y', 12)
      .attr('fill', '#fbbf24')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .attr('font-family', 'monospace')
      .text(`Ortalama: %${String(OVERALL_BENCHMARK).replace('.', ',')}`);

    // Bars
    items.forEach((item) => {
      const barY = y(item.label) ?? 0;
      const barW = x(item.value);

      // Track
      g.append('rect')
        .attr('x', 0)
        .attr('y', barY)
        .attr('width', innerW)
        .attr('height', y.bandwidth())
        .attr('rx', 6)
        .attr('fill', 'rgba(255, 255, 255, 0.03)');

      // Bar
      g.append('rect')
        .attr('x', 0)
        .attr('y', barY)
        .attr('width', barW)
        .attr('height', y.bandwidth())
        .attr('rx', 6)
        .attr('fill', item.color)
        .attr('opacity', item.isHighlighted ? 0.95 : 0.35);

      // Y Label (13px, font-bold)
      g.append('text')
        .attr('x', -10)
        .attr('y', barY + y.bandwidth() / 2 + 5)
        .attr('text-anchor', 'end')
        .attr('fill', item.isHighlighted ? '#f8fafc' : '#64748b')
        .attr('font-size', 13)
        .attr('font-family', 'Outfit, sans-serif')
        .attr('font-weight', 700)
        .text(item.label);

      // Value Label (13.5px, Turkish comma)
      g.append('text')
        .attr('x', barW + 10)
        .attr('y', barY + y.bandwidth() / 2 + 5)
        .attr('fill', item.isHighlighted ? '#ffffff' : '#94a3b8')
        .attr('font-size', 13.5)
        .attr('font-family', 'monospace')
        .attr('font-weight', 800)
        .text(`%${item.value.toFixed(1).replace('.', ',')} (${item.count} gözlem)`);
    });
  }, [records, selectedAge, selectedContract]);

  // Contextual Analytical Comment (Observational & Non-causal, Turkish comma format)
  const getInsightText = () => {
    if (selectedAge === '18-25' && selectedContract === '1') {
      return '⚠️ Zirve Risk Segmenti: 18-25 yaş aralığında 1 aylık taahhütsüz paket tercih eden 367 gözlemin 287\'si (%78,2) salonu terk etmiştir. Genel ortalamanın (+51,7 pp) fevkalade üzerinde gözlemlenen en riskli gruptur.';
    }
    if (selectedAge === '34+' && selectedContract === '12') {
      return '🏆 En Düşük Terk: 34+ yaş grubunda 12 aylık taahhüt yapan 112 gözlemin HİÇBİRİ (%0,0) salonu terk etmemiştir. Genel ortalamaya kıyasla 26,5 yüzde puanlık negatif fark sergiler.';
    }
    if (selectedAge === '18-25' && selectedContract === '12') {
      return 'Gençlerde Sözleşme Farkı: 18-25 yaş grubunda 1 aylık paketteki gözlemlenen terk oranı %78,2 iken, 12 aylık taahhüt alanlarda bu oran %6,1\'e gerilemektedir (72,1 pp gözlemsel fark).';
    }
    if (selectedAge === '18-25') {
      return '18-25 Yaş Grubu: Ortalama %61,9 churn ile en kırılgan demografidir. Sözleşme süresi uzadıkça gözlemlenen terk oranı düşmektedir (1 Ay: %78,2 → 12 Ay: %6,1).';
    }
    if (selectedAge === '26-29') {
      return '26-29 Yaş Grubu: Veri setinin en kalabalık kümesidir (1.593 gözlem). Ortalama churn %33,1\'dir. 1 aylık sözleşmede %50,4 olan kayıp, 12 aylık sözleşmede %4,5\'e düşmektedir.';
    }
    if (selectedAge === '30-33') {
      return '30-33 Yaş Grubu: %12,6 ortalama terk ile istikrarlı bir kitle. 6 aylık pakette %3,9, 12 aylık pakette ise yalnızca %0,5 churn gözlemlenmiştir.';
    }
    if (selectedAge === '34+') {
      return '34+ Yaş Grubu: %3,3 genel terk oranıyla en düşük terk oranına sahip yaş segmentidir. 12 aylık taahhütte sıfır kayıp (%0,0) kaydedilmiştir.';
    }
    if (selectedContract === '1') {
      return '1 Aylık Sözleşme Analizi: Taahhütsüz üyelerin genel terk oranı %42,3\'tür. Gençlerde %78,2\'ye ulaşan bu oran, kısa vadeli sözleşmelerdeki yüksek ayrılma eğilimini gösterir.';
    }
    if (selectedContract === '12') {
      return '12 Aylık Sözleşme Analizi: Yıllık taahhütte gözlemlenen genel terk oranı yalnızca %2,4\'tür. 960 üyeden sadece 23\'ü ayrılmıştır. En düşük terk oranı bu grupta gözlemlenmektedir.';
    }
    return 'Genel Bakış: 4.000 gözlemlik kamuya açık veri setinde genel terk oranı %26,5\'tir. Sözleşme süresi 1 aydan 12 aya çıktıkça gözlemlenen terk oranı %42,3\'ten %2,4\'e (39,9 pp) gerilemektedir.';
  };

  const applyPreset = (age: string, contract: string) => {
    setSelectedAge(age);
    setSelectedContract(contract);
  };

  return (
    <section
      className="reader-exploration-section py-16 sm:py-20 bg-[#0d0d0d] border-t border-b border-[#b829ea]/20 relative"
      id="reader-exploration"
      role="region"
      aria-label="Okuyucu Keşfi Analiz Paneli"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider text-[#c77dff] bg-[#b829ea]/10 border border-[#b829ea]/30 mb-3">
            <i className="fa-solid fa-flask text-[#b829ea]" />
            <span>&lt;okuyucu_kesfi&gt;</span>
            <span>•</span>
            <span>4.000 Gözlemli Veri Filtresi</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Kendi Analizinizi Yapın: Yaş ve Sözleşme Etkisi
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aşağıdaki filtreleri kullanarak <strong>Yaş Grubu</strong> ve <strong>Sözleşme Süresi (1, 6, 12 Ay)</strong> seçin.
            Seçtiğiniz segmentin gözlemlenen Churn (Terk) oranını ve genel veri seti ortalamasına (%26,5) kıyasla farkını anlık olarak inceleyin.
          </p>
        </div>

        {/* Exploration Card Container */}
        <div className="bg-[#110e1c]/90 border border-[#b829ea]/40 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(184,41,234,0.15)] backdrop-blur-xl">
          
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 mb-6 border-b border-white/10">
            {/* Age Filter */}
            <div>
              <label
                htmlFor="exploration-age-select"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#c77dff] mb-2"
              >
                <i className="fa-solid fa-users mr-1.5 text-[#b829ea]" /> 1. Yaş Grubu Seçin:
              </label>
              <div className="relative">
                <select
                  id="exploration-age-select"
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full bg-[#161028] text-white border border-[#b829ea]/50 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#b829ea] cursor-pointer shadow-inner"
                  aria-label="Yaş Grubu Filtresi"
                >
                  <option value="all">Tüm Yaş Grupları (18-41 Yaş Geneli)</option>
                  <option value="18-25">18-25 Yaş (Genç Kitle: %61,94 Churn)</option>
                  <option value="26-29">26-29 Yaş (Genç Profesyonel: %33,08 Churn)</option>
                  <option value="30-33">30-33 Yaş (Kariyer Dönemi: %12,60 Churn)</option>
                  <option value="34+">34+ Yaş (En Sadık Grup: %3,31 Churn)</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#b829ea] pointer-events-none" />
              </div>
            </div>

            {/* Contract Filter */}
            <div>
              <label
                htmlFor="exploration-contract-select"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-[#c77dff] mb-2"
              >
                <i className="fa-solid fa-file-contract mr-1.5 text-[#38bdf8]" /> 2. Sözleşme Süresi Seçin:
              </label>
              <div className="relative">
                <select
                  id="exploration-contract-select"
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  className="w-full bg-[#161028] text-white border border-[#b829ea]/50 rounded-xl px-4 py-3 font-mono text-xs sm:text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#b829ea] cursor-pointer shadow-inner"
                  aria-label="Sözleşme Süresi Filtresi"
                >
                  <option value="all">Tüm Sözleşme Süreleri</option>
                  <option value="1">1 Ay (Aylık Taahhütsüz: %42,32 Churn)</option>
                  <option value="6">6 Ay (Yarım Yıllık Paket: %12,48 Churn)</option>
                  <option value="12">12 Ay (Yıllık Taahhüt: %2,40 Churn)</option>
                </select>
                <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#b829ea] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2 items-center mb-8">
            <span className="text-[11px] font-mono text-slate-400">Hızlı Senaryolar:</span>
            <button
              type="button"
              onClick={() => applyPreset('all', 'all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedAge === 'all' && selectedContract === 'all'
                  ? 'bg-[#b829ea] text-white font-bold shadow-[0_0_10px_#b829ea]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Genel Ortalama
            </button>
            <button
              type="button"
              onClick={() => applyPreset('18-25', '1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedAge === '18-25' && selectedContract === '1'
                  ? 'bg-red-500 text-white font-bold shadow-[0_0_10px_#ef4444]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Zirve Risk (18-25 &amp; 1 Ay: %78,20)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('34+', '12')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedAge === '34+' && selectedContract === '12'
                  ? 'bg-emerald-600 text-white font-bold shadow-[0_0_10px_#10b981]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Kusursuz Sadakat (34+ &amp; 12 Ay: %0,00)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('18-25', '12')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedAge === '18-25' && selectedContract === '12'
                  ? 'bg-cyan-600 text-white font-bold shadow-[0_0_10px_#06b6d4]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Genç Taahhüt (18-25 &amp; 12 Ay: %6,10)
            </button>
          </div>

          {/* Dynamic Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">Seçilen Segment Terk Oranı</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                %{averageChurn.toFixed(1).replace('.', ',')}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                ({totalChurnInFilter} / {totalMembersInFilter} üye)
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">Genel Ortalamaya Göre Fark</span>
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${isHigher ? 'text-red-400' : 'text-emerald-400'}`}>
                {isHigher ? `+${deltaFromBenchmark.toFixed(1).replace('.', ',')} pp` : `${deltaFromBenchmark.toFixed(1).replace('.', ',')} pp`}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                (Baz: %{String(OVERALL_BENCHMARK).replace('.', ',')})
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-1">Risk Değerlendirmesi</span>
              <span className={`text-lg sm:text-xl font-bold font-mono ${averageChurn >= 40 ? 'text-red-400' : averageChurn <= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {averageChurn >= 40 ? 'KRİTİK RİSK' : averageChurn <= 10 ? 'DÜŞÜK RİSK (SADIK)' : 'ORTA SEVİYE'}
              </span>
            </div>
          </div>

          {/* Interactive D3 Bar Chart */}
          <div className="w-full bg-[#0d0a17] p-4 sm:p-5 rounded-xl border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-[#c77dff]">
                KARŞILAŞTIRMA GRAFİĞİ (D3.js)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedAge !== 'all' ? `${selectedAge} Yaş Altı Sözleşmeler` : selectedContract !== 'all' ? `${CONTRACT_NAMES[parseInt(selectedContract, 10)]} Yaş Dağılımı` : 'Sözleşme Ortalamaları'}
              </span>
            </div>
            <svg
              ref={chartRef}
              className="w-full h-auto"
              role="img"
              aria-label="Okuyucu keşfi karşılaştırma bar grafiği"
            />
          </div>

          {/* Dynamic Analytical Insight Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#140f26] border border-[#b829ea]/40 flex items-start gap-3">
            <i className="fa-solid fa-lightbulb text-[#fbbf24] mt-1 shrink-0 text-base" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              <strong>Analitik Yorum:</strong> {getInsightText()}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ReaderExploration;
