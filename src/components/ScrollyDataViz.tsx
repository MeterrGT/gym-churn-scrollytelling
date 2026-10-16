import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PORTFOLIO_DATA } from '@/data/portfolio';

// Interfaces for verified 4,000-row dataset (Adrian Vinueza - Gym Churn US)
interface ContractRow {
  contractPeriod: number;
  label: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
  sharePercentage: number;
}

interface AgeRow {
  ageGroup: string;
  label: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
  sharePercentage: number;
}

interface CombinedRow {
  ageGroup: string;
  contractPeriod: number;
  contractLabel: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
}

interface LifetimeRow {
  lifetimeBucket: string;
  label: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
}

interface FrequencyRow {
  freqBucket: string;
  totalCount: number;
  churnCount: number;
  churnRate: number;
  churnPercentage: number;
}

// Fallback data verified from 4,000 records
const DEFAULT_CONTRACT_DATA: ContractRow[] = [
  { contractPeriod: 1, label: '1 Ay (Aylık)', totalCount: 2207, churnCount: 934, churnRate: 0.4232, churnPercentage: 42.32, sharePercentage: 55.18 },
  { contractPeriod: 6, label: '6 Ay (Yarım Yıl)', totalCount: 833, churnCount: 104, churnRate: 0.1248, churnPercentage: 12.48, sharePercentage: 20.83 },
  { contractPeriod: 12, label: '12 Ay (Yıllık)', totalCount: 960, churnCount: 23, churnRate: 0.0240, churnPercentage: 2.40, sharePercentage: 24.00 },
];

const DEFAULT_AGE_DATA: AgeRow[] = [
  { ageGroup: '18-25', label: '18-25 Yaş', totalCount: 536, churnCount: 332, churnRate: 0.6194, churnPercentage: 61.94, sharePercentage: 13.40 },
  { ageGroup: '26-29', label: '26-29 Yaş', totalCount: 1593, churnCount: 527, churnRate: 0.3308, churnPercentage: 33.08, sharePercentage: 39.83 },
  { ageGroup: '30-33', label: '30-33 Yaş', totalCount: 1508, churnCount: 190, churnRate: 0.1260, churnPercentage: 12.60, sharePercentage: 37.70 },
  { ageGroup: '34+', label: '34+ Yaş', totalCount: 363, churnCount: 12, churnRate: 0.0331, churnPercentage: 3.31, sharePercentage: 9.08 },
];

const DEFAULT_COMBINED_DATA: CombinedRow[] = [
  { ageGroup: '18-25', contractPeriod: 1, contractLabel: '1 Ay', totalCount: 367, churnCount: 287, churnRate: 0.7820, churnPercentage: 78.20 },
  { ageGroup: '18-25', contractPeriod: 6, contractLabel: '6 Ay', totalCount: 87, churnCount: 40, churnRate: 0.4598, churnPercentage: 45.98 },
  { ageGroup: '18-25', contractPeriod: 12, contractLabel: '12 Ay', totalCount: 82, churnCount: 5, churnRate: 0.0610, churnPercentage: 6.10 },
  { ageGroup: '26-29', contractPeriod: 1, contractLabel: '1 Ay', totalCount: 914, churnCount: 461, churnRate: 0.5044, churnPercentage: 50.44 },
  { ageGroup: '26-29', contractPeriod: 6, contractLabel: '6 Ay', totalCount: 326, churnCount: 50, churnRate: 0.1534, churnPercentage: 15.34 },
  { ageGroup: '26-29', contractPeriod: 12, contractLabel: '12 Ay', totalCount: 353, churnCount: 16, churnRate: 0.0453, churnPercentage: 4.53 },
  { ageGroup: '30-33', contractPeriod: 1, contractLabel: '1 Ay', totalCount: 764, churnCount: 175, churnRate: 0.2291, churnPercentage: 22.91 },
  { ageGroup: '30-33', contractPeriod: 6, contractLabel: '6 Ay', totalCount: 331, churnCount: 13, churnRate: 0.0393, churnPercentage: 3.93 },
  { ageGroup: '30-33', contractPeriod: 12, contractLabel: '12 Ay', totalCount: 413, churnCount: 2, churnRate: 0.0048, churnPercentage: 0.48 },
  { ageGroup: '34+', contractPeriod: 1, contractLabel: '1 Ay', totalCount: 162, churnCount: 11, churnRate: 0.0679, churnPercentage: 6.79 },
  { ageGroup: '34+', contractPeriod: 6, contractLabel: '6 Ay', totalCount: 89, churnCount: 1, churnRate: 0.0112, churnPercentage: 1.12 },
  { ageGroup: '34+', contractPeriod: 12, contractLabel: '12 Ay', totalCount: 112, churnCount: 0, churnRate: 0.0000, churnPercentage: 0.00 },
];

const DEFAULT_LIFETIME_DATA: LifetimeRow[] = [
  { lifetimeBucket: '0', label: '0. Ay', totalCount: 487, churnCount: 403, churnRate: 0.8275, churnPercentage: 82.75 },
  { lifetimeBucket: '1', label: '1. Ay', totalCount: 843, churnCount: 414, churnRate: 0.4911, churnPercentage: 49.11 },
  { lifetimeBucket: '2', label: '2. Ay', totalCount: 610, churnCount: 157, churnRate: 0.2574, churnPercentage: 25.74 },
  { lifetimeBucket: '3', label: '3. Ay', totalCount: 490, churnCount: 50, churnRate: 0.1020, churnPercentage: 10.20 },
  { lifetimeBucket: '4', label: '4. Ay', totalCount: 383, churnCount: 23, churnRate: 0.0601, churnPercentage: 6.01 },
  { lifetimeBucket: '5', label: '5. Ay', totalCount: 273, churnCount: 8, churnRate: 0.0293, churnPercentage: 2.93 },
  { lifetimeBucket: '6+', label: '6+ Ay', totalCount: 914, churnCount: 6, churnRate: 0.0066, churnPercentage: 0.66 },
];

const DEFAULT_FREQ_DATA: FrequencyRow[] = [
  { freqBucket: '0-0.5 Gün', totalCount: 502, churnCount: 291, churnRate: 0.5797, churnPercentage: 57.97 },
  { freqBucket: '1 Gün', totalCount: 1191, churnCount: 476, churnRate: 0.3997, churnPercentage: 39.97 },
  { freqBucket: '2 Gün', totalCount: 1294, churnCount: 249, churnRate: 0.1924, churnPercentage: 19.24 },
  { freqBucket: '3 Gün', totalCount: 796, churnCount: 44, churnRate: 0.0553, churnPercentage: 5.53 },
  { freqBucket: '4+ Gün', totalCount: 217, churnCount: 1, churnRate: 0.0046, churnPercentage: 0.46 },
];

const OVERALL_CHURN_BENCHMARK = 26.5;

// Coordinate space optimized for ~1:1 scale on desktop (680 x 440)
const WIDTH = 680;
const HEIGHT = 440;
const MARGIN = { top: 25, right: 35, bottom: 50, left: 115 };
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

// Format Turkish percentages and percentage points
function formatTurkishPercent(value: number, decimals: number = 1): string {
  return `%${value.toFixed(decimals).replace('.', ',')}`;
}

function formatTurkishPp(value: number, decimals: number = 1, showSign: boolean = true): string {
  const formatted = Math.abs(value).toFixed(decimals).replace('.', ',');
  if (!showSign) return `${formatted} pp`;
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${formatted} pp`;
}

function addSvgGradientsAndFilters(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
  if (!svg.select('defs').empty()) return;
  const defs = svg.append('defs');

  // Purple Neon Bar Gradient
  const purpleGrad = defs.append('linearGradient')
    .attr('id', 'scrolly-grad-purple')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
  purpleGrad.append('stop').attr('offset', '0%').attr('stop-color', '#9333ea');
  purpleGrad.append('stop').attr('offset', '100%').attr('stop-color', '#c084fc');

  // Cyan Gradient
  const cyanGrad = defs.append('linearGradient')
    .attr('id', 'scrolly-grad-cyan')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
  cyanGrad.append('stop').attr('offset', '0%').attr('stop-color', '#0284c7');
  cyanGrad.append('stop').attr('offset', '100%').attr('stop-color', '#38bdf8');

  // Emerald Gradient
  const emeraldGrad = defs.append('linearGradient')
    .attr('id', 'scrolly-grad-emerald')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
  emeraldGrad.append('stop').attr('offset', '0%').attr('stop-color', '#059669');
  emeraldGrad.append('stop').attr('offset', '100%').attr('stop-color', '#34d399');

  // Area Fill Gradient for Lifetime Curve
  const areaGrad = defs.append('linearGradient')
    .attr('id', 'scrolly-grad-area')
    .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
  areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#b829ea').attr('stop-opacity', 0.45);
  areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#b829ea').attr('stop-opacity', 0.02);

  // Glow filter
  const filter = defs.append('filter').attr('id', 'scrolly-glow')
    .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
  filter.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'blur');
  const merge = filter.append('feMerge');
  merge.append('feMergeNode').attr('in', 'blur');
  merge.append('feMergeNode').attr('in', 'SourceGraphic');
}

// =========================================================================
// 1. Step 1: Sorted Bar Chart — Churn by Contract Period (1, 6, 12 Months)
// =========================================================================
function drawContractSortedBarChart(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ContractRow[],
  duration: number,
  prefersReduced: boolean,
) {
  const g = container.append('g')
    .attr('class', 'contract-bar-group')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const sorted = [...data].sort((a, b) => b.churnPercentage - a.churnPercentage);

  const y = d3.scaleBand()
    .domain(sorted.map((d) => d.label))
    .range([0, INNER_HEIGHT])
    .padding(0.32);

  const x = d3.scaleLinear()
    .domain([0, 52])
    .range([0, INNER_WIDTH]);

  // X Axis Grid with 12px tick labels
  g.append('g')
    .attr('transform', `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat((d) => `%${d}`).tickSize(-INNER_HEIGHT))
    .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.2)'))
    .call((axis) => axis.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.1)'))
    .call((axis) => axis.selectAll('text').attr('fill', '#94a3b8').attr('font-family', 'monospace').attr('font-size', 12.5));

  // Benchmark line (Genel Ortalama: %26,5)
  const bmX = x(OVERALL_CHURN_BENCHMARK);
  const bmLine = g.append('line')
    .attr('x1', bmX).attr('x2', bmX)
    .attr('y1', 0).attr('y2', INNER_HEIGHT)
    .attr('stroke', '#f59e0b')
    .attr('stroke-dasharray', '4 4')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0);

  bmLine.transition()
    .duration(duration)
    .attr('opacity', 1);

  const bmText = g.append('text')
    .attr('x', bmX + 6)
    .attr('y', 14)
    .attr('fill', '#fbbf24')
    .attr('font-size', 12.5)
    .attr('font-family', 'monospace')
    .attr('font-weight', 700)
    .attr('opacity', 0)
    .text(`Ortalama: ${formatTurkishPercent(OVERALL_CHURN_BENCHMARK)}`);

  bmText.transition()
    .duration(duration)
    .delay(prefersReduced ? 0 : 100)
    .attr('opacity', 1);

  // Bars with smooth staggered width animation
  sorted.forEach((d, i) => {
    const barY = y(d.label) ?? 0;
    const targetWidth = x(d.churnPercentage);
    const gradId = d.contractPeriod === 1
      ? 'url(#scrolly-grad-purple)'
      : d.contractPeriod === 6
        ? 'url(#scrolly-grad-cyan)'
        : 'url(#scrolly-grad-emerald)';

    // Bar background track
    g.append('rect')
      .attr('x', 0)
      .attr('y', barY)
      .attr('width', INNER_WIDTH)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', 'rgba(255, 255, 255, 0.03)');

    // Active Bar with width transition
    const bar = g.append('rect')
      .attr('x', 0)
      .attr('y', barY)
      .attr('width', prefersReduced ? targetWidth : 0)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', gradId)
      .attr('filter', d.contractPeriod === 1 ? 'url(#scrolly-glow)' : null);

    if (!prefersReduced) {
      bar.transition()
        .duration(duration)
        .delay(i * 85)
        .ease(d3.easeCubicOut)
        .attr('width', targetWidth);
    }

    // Category Label on Y axis (13.5px, font-bold)
    g.append('text')
      .attr('x', -12)
      .attr('y', barY + y.bandwidth() / 2 + 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#f1f5f9')
      .attr('font-size', 13.5)
      .attr('font-family', 'Outfit, sans-serif')
      .attr('font-weight', 700)
      .text(d.label);

    // Percentage value text (14.5px, monospace font-extrabold)
    const valText = g.append('text')
      .attr('x', targetWidth + 12)
      .attr('y', barY + y.bandwidth() / 2 + 5)
      .attr('fill', '#ffffff')
      .attr('font-size', 14.5)
      .attr('font-family', 'monospace')
      .attr('font-weight', 800)
      .attr('opacity', prefersReduced ? 1 : 0)
      .text(formatTurkishPercent(d.churnPercentage));

    if (!prefersReduced) {
      valText.transition()
        .duration(duration)
        .delay(120 + i * 85)
        .attr('opacity', 1);
    }

    // Delta badge calculated from unrounded floats (12.5px font-mono)
    const delta = d.churnPercentage - OVERALL_CHURN_BENCHMARK;
    const deltaSign = formatTurkishPp(delta, 1, true);
    const deltaColor = delta > 0 ? '#f87171' : '#34d399';

    const deltaText = g.append('text')
      .attr('x', targetWidth + 74)
      .attr('y', barY + y.bandwidth() / 2 + 5)
      .attr('fill', deltaColor)
      .attr('font-size', 12.5)
      .attr('font-family', 'monospace')
      .attr('font-weight', 600)
      .attr('opacity', prefersReduced ? 1 : 0)
      .text(`(${deltaSign}) • ${d.totalCount.toLocaleString('tr-TR')} üye`);

    if (!prefersReduced) {
      deltaText.transition()
        .duration(duration)
        .delay(180 + i * 85)
        .attr('opacity', 1);
    }
  });
}

// =========================================================================
// 2. Step 2: Dot Plot / Lollipop Chart — Churn by Age Groups
// =========================================================================
function drawAgeLollipopChart(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: AgeRow[],
  duration: number,
  prefersReduced: boolean,
) {
  const g = container.append('g')
    .attr('class', 'age-lollipop-group')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const x = d3.scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, INNER_WIDTH])
    .padding(0.35);

  const y = d3.scaleLinear()
    .domain([0, 72])
    .range([INNER_HEIGHT, 0]);

  // Horizontal Grid Lines with 12px tick text
  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `%${d}`).tickSize(-INNER_WIDTH))
    .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.2)'))
    .call((axis) => axis.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.1)'))
    .call((axis) => axis.selectAll('text').attr('fill', '#94a3b8').attr('font-family', 'monospace').attr('font-size', 12.5));

  // X Axis Category Labels (13.5px Outfit, font-bold)
  g.append('g')
    .attr('transform', `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.3)'))
    .call((axis) => axis.selectAll('text').attr('fill', '#e2e8f0').attr('font-family', 'Outfit, sans-serif').attr('font-size', 13.5).attr('font-weight', 700).attr('dy', '1.6em'));

  // Benchmark line
  const bmY = y(OVERALL_CHURN_BENCHMARK);
  const bmLine = g.append('line')
    .attr('x1', 0).attr('x2', INNER_WIDTH)
    .attr('y1', bmY).attr('y2', bmY)
    .attr('stroke', '#f59e0b')
    .attr('stroke-dasharray', '4 4')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0);

  bmLine.transition()
    .duration(duration)
    .attr('opacity', 1);

  const bmText = g.append('text')
    .attr('x', INNER_WIDTH)
    .attr('y', bmY - 7)
    .attr('text-anchor', 'end')
    .attr('fill', '#fbbf24')
    .attr('font-size', 12.5)
    .attr('font-family', 'monospace')
    .attr('font-weight', 700)
    .attr('opacity', 0)
    .text(`Genel Ortalama: ${formatTurkishPercent(OVERALL_CHURN_BENCHMARK)}`);

  bmText.transition()
    .duration(duration)
    .delay(prefersReduced ? 0 : 100)
    .attr('opacity', 1);

  // Lollipop sticks & circles with rising motion
  data.forEach((d, i) => {
    const cx = (x(d.label) ?? 0) + x.bandwidth() / 2;
    const cy = y(d.churnPercentage);
    const isHighest = d.ageGroup === '18-25';
    const isLowest = d.ageGroup === '34+';

    const color = isHighest ? '#ef4444' : isLowest ? '#34d399' : '#c084fc';
    const targetR = isHighest || isLowest ? 12 : 9.5;

    // Stick
    const stick = g.append('line')
      .attr('x1', cx).attr('x2', cx)
      .attr('y1', INNER_HEIGHT)
      .attr('y2', prefersReduced ? cy : INNER_HEIGHT)
      .attr('stroke', color)
      .attr('stroke-width', isHighest || isLowest ? 3 : 2.2)
      .attr('opacity', 0.85);

    if (!prefersReduced) {
      stick.transition()
        .duration(duration)
        .delay(i * 75)
        .ease(d3.easeCubicOut)
        .attr('y2', cy);
    }

    // Glow circle behind
    if (isHighest || isLowest) {
      const glowCircle = g.append('circle')
        .attr('cx', cx).attr('cy', prefersReduced ? cy : INNER_HEIGHT)
        .attr('r', prefersReduced ? 18 : 0)
        .attr('fill', color)
        .attr('opacity', 0.28)
        .attr('filter', 'url(#scrolly-glow)');

      if (!prefersReduced) {
        glowCircle.transition()
          .duration(duration)
          .delay(i * 75)
          .ease(d3.easeCubicOut)
          .attr('cy', cy)
          .attr('r', 18);
      }
    }

    // Main Circle
    const circle = g.append('circle')
      .attr('cx', cx).attr('cy', prefersReduced ? cy : INNER_HEIGHT)
      .attr('r', prefersReduced ? targetR : 0)
      .attr('fill', color)
      .attr('stroke', '#0d0d0d')
      .attr('stroke-width', 2.5);

    if (!prefersReduced) {
      circle.transition()
        .duration(duration)
        .delay(i * 75)
        .ease(d3.easeBackOut.overshoot(1.1))
        .attr('cy', cy)
        .attr('r', targetR);
    }

    // Value text above circle (14px font-mono font-bold)
    const valText = g.append('text')
      .attr('x', cx)
      .attr('y', cy - 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', 14)
      .attr('font-family', 'monospace')
      .attr('font-weight', 800)
      .attr('opacity', prefersReduced ? 1 : 0)
      .text(formatTurkishPercent(d.churnPercentage));

    if (!prefersReduced) {
      valText.transition()
        .duration(duration)
        .delay(180 + i * 75)
        .attr('opacity', 1);
    }

    // Status Annotation Badge
    if (isHighest) {
      const badgeGroup = g.append('g').attr('opacity', prefersReduced ? 1 : 0);
      badgeGroup.append('rect')
        .attr('x', cx - 50)
        .attr('y', cy - 44)
        .attr('width', 100)
        .attr('height', 22)
        .attr('rx', 11)
        .attr('fill', 'rgba(239, 68, 68, 0.22)')
        .attr('stroke', 'rgba(239, 68, 68, 0.7)');

      badgeGroup.append('text')
        .attr('x', cx)
        .attr('y', cy - 29)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fca5a5')
        .attr('font-size', 10.5)
        .attr('font-weight', 800)
        .attr('font-family', 'monospace')
        .text('▲ ZİRVE RİSK');

      if (!prefersReduced) {
        badgeGroup.transition()
          .duration(duration)
          .delay(350)
          .attr('opacity', 1);
      }
    } else if (isLowest) {
      const badgeGroup = g.append('g').attr('opacity', prefersReduced ? 1 : 0);
      badgeGroup.append('rect')
        .attr('x', cx - 50)
        .attr('y', cy - 44)
        .attr('width', 100)
        .attr('height', 22)
        .attr('rx', 11)
        .attr('fill', 'rgba(52, 211, 153, 0.22)')
        .attr('stroke', 'rgba(52, 211, 153, 0.7)');

      badgeGroup.append('text')
        .attr('x', cx)
        .attr('y', cy - 29)
        .attr('text-anchor', 'middle')
        .attr('fill', '#6ee7b7')
        .attr('font-size', 10.5)
        .attr('font-weight', 800)
        .attr('font-family', 'monospace')
        .text('▼ EN SADIK KİTLE');

      if (!prefersReduced) {
        badgeGroup.transition()
          .duration(duration)
          .delay(350)
          .attr('opacity', 1);
      }
    }
  });
}

// =========================================================================
// 3. Step 3 & 4: Annotated Matrix Heatmap (12 Cells: Age Group × Contract Period)
// =========================================================================
function drawAgeContractHeatmap(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: CombinedRow[],
  isFocused: boolean,
  duration: number,
  prefersReduced: boolean,
) {
  const g = container.append('g')
    .attr('class', 'heatmap-matrix-group')
    .attr('id', 'chart-step-heatmap')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top + 5})`);

  const heatmapWidth = INNER_WIDTH - 15;
  const heatmapHeight = INNER_HEIGHT - 25;

  const ageGroups = ['18-25', '26-29', '30-33', '34+'];
  const contracts = [1, 6, 12];
  const contractLabels: Record<number, string> = {
    1: '1 Ay (Aylık)',
    6: '6 Ay (Yarım Yıl)',
    12: '12 Ay (Yıllık)',
  };

  const x = d3.scaleBand().domain(contracts.map(String)).range([0, heatmapWidth]).padding(0.08);
  const y = d3.scaleBand().domain(ageGroups).range([0, heatmapHeight]).padding(0.08);

  // High contrast sequential color scale
  const colorScale = d3.scaleSequential()
    .domain([0, 80])
    .interpolator(d3.interpolateRgbBasis(['#1e1b4b', '#4c1d95', '#8b5cf6', '#d946ef', '#ef4444']));

  // Heatmap Cells
  data.forEach((d, i) => {
    const cellX = x(String(d.contractPeriod)) ?? 0;
    const cellY = y(d.ageGroup) ?? 0;
    const isPeak = d.ageGroup === '18-25' && d.contractPeriod === 1;
    const isLowest = d.ageGroup === '34+' && d.contractPeriod === 12;

    const cellTargetOpacity = isFocused ? (isPeak || isLowest ? 1 : 0.22) : 1;
    const strokeColor = isPeak ? '#ef4444' : isLowest ? '#34d399' : 'rgba(255, 255, 255, 0.12)';
    const strokeWidth = (isPeak || isLowest) && isFocused ? 3 : 1;

    // Background rect
    const rect = g.append('rect')
      .attr('class', `heatmap-cell cell-${d.ageGroup}-${d.contractPeriod}`)
      .attr('x', cellX)
      .attr('y', cellY)
      .attr('width', x.bandwidth())
      .attr('height', y.bandwidth())
      .attr('rx', 8)
      .attr('fill', colorScale(d.churnPercentage))
      .attr('stroke', strokeColor)
      .attr('stroke-width', strokeWidth)
      .attr('opacity', prefersReduced ? cellTargetOpacity : 0)
      .attr('filter', (isPeak || isLowest) && isFocused ? 'url(#scrolly-glow)' : null);

    if (!prefersReduced) {
      rect.transition()
        .duration(duration)
        .delay(i * 30)
        .attr('opacity', cellTargetOpacity);
    }

    // Percentage Label (16px font-mono font-extrabold)
    const pctLabel = g.append('text')
      .attr('class', `heatmap-label label-pct-${d.ageGroup}-${d.contractPeriod}`)
      .attr('x', cellX + x.bandwidth() / 2)
      .attr('y', cellY + y.bandwidth() / 2 + 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', isPeak || isLowest ? 16.5 : 15.5)
      .attr('font-family', 'monospace')
      .attr('font-weight', 800)
      .attr('opacity', prefersReduced ? cellTargetOpacity : 0)
      .text(formatTurkishPercent(d.churnPercentage));

    if (!prefersReduced) {
      pctLabel.transition()
        .duration(duration)
        .delay(100 + i * 30)
        .attr('opacity', cellTargetOpacity);
    }

    // Delta compared to overall average (12.5px font-mono font-bold)
    const delta = d.churnPercentage - OVERALL_CHURN_BENCHMARK;
    const deltaSign = formatTurkishPp(delta, 1, true);

    const deltaLabel = g.append('text')
      .attr('class', `heatmap-label label-delta-${d.ageGroup}-${d.contractPeriod}`)
      .attr('x', cellX + x.bandwidth() / 2)
      .attr('y', cellY + y.bandwidth() / 2 + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', delta > 0 ? '#fca5a5' : '#86efac')
      .attr('font-size', 12)
      .attr('font-family', 'monospace')
      .attr('font-weight', 700)
      .attr('opacity', prefersReduced ? cellTargetOpacity : 0)
      .text(deltaSign);

    if (!prefersReduced) {
      deltaLabel.transition()
        .duration(duration)
        .delay(150 + i * 30)
        .attr('opacity', cellTargetOpacity);
    }

    // Callout banners in focused mode
    if (isPeak) {
      const peakTag = g.append('text')
        .attr('class', 'spotlight-callout peak-callout')
        .attr('x', cellX + x.bandwidth() / 2)
        .attr('y', cellY - 6)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fca5a5')
        .attr('font-size', 12)
        .attr('font-family', 'monospace')
        .attr('font-weight', 800)
        .attr('opacity', isFocused ? 1 : 0)
        .text('▲ ZİRVE RİSK (%78,2)');

      if (isFocused && !prefersReduced) {
        peakTag.transition().duration(duration).attr('opacity', 1);
      }
    }

    if (isLowest) {
      const lowestTag = g.append('text')
        .attr('class', 'spotlight-callout lowest-callout')
        .attr('x', cellX + x.bandwidth() / 2)
        .attr('y', cellY + y.bandwidth() + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', '#86efac')
        .attr('font-size', 12)
        .attr('font-family', 'monospace')
        .attr('font-weight', 800)
        .attr('opacity', isFocused ? 1 : 0)
        .text('▼ EN SADIK (%0,0 / 0 TERK)');

      if (isFocused && !prefersReduced) {
        lowestTag.transition().duration(duration).attr('opacity', 1);
      }
    }
  });

  // X Axis Column Headers (Contract Periods - 13.5px font-bold)
  contracts.forEach((c) => {
    const cx = (x(String(c)) ?? 0) + x.bandwidth() / 2;
    g.append('text')
      .attr('x', cx)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', 13.5)
      .attr('font-family', 'Outfit, sans-serif')
      .attr('font-weight', 700)
      .text(contractLabels[c] ?? `${c} Ay`);
  });

  // Y Axis Row Headers (Age Groups - 13.5px font-bold)
  ageGroups.forEach((ag) => {
    const cy = (y(ag) ?? 0) + y.bandwidth() / 2 + 5;
    g.append('text')
      .attr('x', -14)
      .attr('y', cy)
      .attr('text-anchor', 'end')
      .attr('fill', '#e2e8f0')
      .attr('font-size', 13.5)
      .attr('font-family', 'Outfit, sans-serif')
      .attr('font-weight', 700)
      .text(`${ag} Yaş`);
  });
}

// In-place smooth transition between Step 2 (Full Heatmap) and Step 3 (Spotlight Heatmap)
function transitionHeatmapFocus(
  isFocused: boolean,
  duration: number,
) {
  const g = d3.select('#chart-step-heatmap');
  if (g.empty()) return;

  // Animate cells
  g.selectAll<SVGRectElement, unknown>('.heatmap-cell')
    .each(function () {
      const rect = d3.select(this);
      const isPeak = rect.classed('cell-18-25-1');
      const isLowest = rect.classed('cell-34+-12');

      const targetOpacity = isFocused ? (isPeak || isLowest ? 1 : 0.22) : 1;
      const strokeColor = isPeak ? '#ef4444' : isLowest ? '#34d399' : 'rgba(255, 255, 255, 0.12)';
      const strokeWidth = (isPeak || isLowest) && isFocused ? 3 : 1;
      const filterVal = (isPeak || isLowest) && isFocused ? 'url(#scrolly-glow)' : null;

      rect.transition()
        .duration(duration)
        .attr('opacity', targetOpacity)
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeWidth)
        .attr('filter', filterVal);
    });

  // Animate text labels
  g.selectAll<SVGTextElement, unknown>('.heatmap-label')
    .each(function () {
      const txt = d3.select(this);
      const isPeak = txt.classed('label-pct-18-25-1') || txt.classed('label-delta-18-25-1');
      const isLowest = txt.classed('label-pct-34+-12') || txt.classed('label-delta-34+-12');
      const targetOpacity = isFocused ? (isPeak || isLowest ? 1 : 0.22) : 1;

      txt.transition()
        .duration(duration)
        .attr('opacity', targetOpacity);
    });

  // Animate callout banners
  g.selectAll<SVGTextElement, unknown>('.spotlight-callout')
    .transition()
    .duration(duration)
    .attr('opacity', isFocused ? 1 : 0);
}

// =========================================================================
// 4. Step 5: Area / Curve Plot — Churn by Lifetime (Tenure in Months)
// =========================================================================
function drawLifetimeCurveChart(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: LifetimeRow[],
  duration: number,
  prefersReduced: boolean,
) {
  const g = container.append('g')
    .attr('class', 'lifetime-curve-group')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`);

  const x = d3.scalePoint()
    .domain(data.map((d) => d.label))
    .range([20, INNER_WIDTH - 20])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, 92])
    .range([INNER_HEIGHT, 0]);

  // Horizontal Grid Lines with 12px tick text
  g.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `%${d}`).tickSize(-INNER_WIDTH))
    .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.2)'))
    .call((axis) => axis.selectAll('line').attr('stroke', 'rgba(148, 163, 184, 0.1)'))
    .call((axis) => axis.selectAll('text').attr('fill', '#94a3b8').attr('font-family', 'monospace').attr('font-size', 12.5));

  // X Axis Labels (13px Outfit, font-bold)
  g.append('g')
    .attr('transform', `translate(0,${INNER_HEIGHT})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call((axis) => axis.select('.domain').attr('stroke', 'rgba(148, 163, 184, 0.3)'))
    .call((axis) => axis.selectAll('text').attr('fill', '#cbd5e1').attr('font-family', 'Outfit, sans-serif').attr('font-size', 13).attr('font-weight', 700).attr('dy', '1.6em'));

  // Area & Line generator
  const area = d3.area<LifetimeRow>()
    .x((d) => x(d.label) ?? 0)
    .y0(INNER_HEIGHT)
    .y1((d) => y(d.churnPercentage))
    .curve(d3.curveMonotoneX);

  const line = d3.line<LifetimeRow>()
    .x((d) => x(d.label) ?? 0)
    .y((d) => y(d.churnPercentage))
    .curve(d3.curveMonotoneX);

  // Gradient area fill
  const areaPath = g.append('path')
    .datum(data)
    .attr('fill', 'url(#scrolly-grad-area)')
    .attr('d', area)
    .attr('opacity', prefersReduced ? 1 : 0);

  if (!prefersReduced) {
    areaPath.transition()
      .duration(duration)
      .delay(120)
      .attr('opacity', 1);
  }

  // Animated line path
  const linePath = g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#c084fc')
    .attr('stroke-width', 3.5)
    .attr('filter', 'url(#scrolly-glow)')
    .attr('d', line);

  if (!prefersReduced) {
    const node = linePath.node();
    const totalLength = node ? node.getTotalLength() : 800;
    linePath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
  }

  // Observational threshold annotation (0-2. Ay)
  const xThreshold = x('2. Ay') ?? 0;
  const thLine = g.append('line')
    .attr('x1', xThreshold).attr('x2', xThreshold)
    .attr('y1', 0).attr('y2', INNER_HEIGHT)
    .attr('stroke', '#f59e0b')
    .attr('stroke-dasharray', '4 4')
    .attr('stroke-width', 1.5)
    .attr('opacity', prefersReduced ? 1 : 0);

  const thText = g.append('text')
    .attr('x', xThreshold + 8)
    .attr('y', 22)
    .attr('fill', '#fbbf24')
    .attr('font-size', 12)
    .attr('font-family', 'monospace')
    .attr('font-weight', 700)
    .attr('opacity', prefersReduced ? 1 : 0)
    .text('Gözlemsel Eşik: 0-2. Ay Kategorisi');

  if (!prefersReduced) {
    thLine.transition().duration(duration).delay(250).attr('opacity', 1);
    thText.transition().duration(duration).delay(300).attr('opacity', 1);
  }

  // Dots & Value labels (13.5px font-mono font-bold)
  data.forEach((d, i) => {
    const cx = x(d.label) ?? 0;
    const cy = y(d.churnPercentage);

    const circle = g.append('circle')
      .attr('cx', cx).attr('cy', cy)
      .attr('r', prefersReduced ? 6 : 0)
      .attr('fill', '#ffffff')
      .attr('stroke', '#b829ea')
      .attr('stroke-width', 2.5);

    if (!prefersReduced) {
      circle.transition()
        .duration(duration)
        .delay(200 + i * 50)
        .attr('r', 6);
    }

    const valText = g.append('text')
      .attr('x', cx)
      .attr('y', cy - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f1f5f9')
      .attr('font-size', 13.5)
      .attr('font-family', 'monospace')
      .attr('font-weight', 800)
      .attr('opacity', prefersReduced ? 1 : 0)
      .text(formatTurkishPercent(d.churnPercentage));

    if (!prefersReduced) {
      valText.transition()
        .duration(duration)
        .delay(280 + i * 50)
        .attr('opacity', 1);
    }
  });
}

// =========================================================================
// 5. Step 6: Attendance Frequency & Analytical Synthesis
// =========================================================================
function drawFrequencySynthesis(
  container: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: FrequencyRow[],
  duration: number,
  prefersReduced: boolean,
) {
  const g = container.append('g')
    .attr('class', 'frequency-synthesis-group')
    .attr('transform', `translate(${MARGIN.left},${MARGIN.top + 5})`);

  // Left side: Compact Frequency Bar Chart
  const chartW = 270;
  const chartH = INNER_HEIGHT - 15;

  const y = d3.scaleBand().domain(data.map((d) => d.freqBucket)).range([0, chartH]).padding(0.28);
  const x = d3.scaleLinear().domain([0, 65]).range([0, chartW]);

  g.append('text')
    .attr('x', 0).attr('y', -8)
    .attr('fill', '#c084fc').attr('font-size', 12.5).attr('font-family', 'monospace').attr('font-weight', 700)
    .text('Haftalık Ders Sıklığına Göre Terk:');

  data.forEach((d, i) => {
    const barY = y(d.freqBucket) ?? 0;
    const barW = x(d.churnPercentage);

    g.append('rect')
      .attr('x', 0).attr('y', barY)
      .attr('width', chartW).attr('height', y.bandwidth())
      .attr('rx', 5).attr('fill', 'rgba(255,255,255,0.03)');

    const bar = g.append('rect')
      .attr('x', 0).attr('y', barY)
      .attr('width', prefersReduced ? barW : 0)
      .attr('height', y.bandwidth())
      .attr('rx', 5)
      .attr('fill', d.churnPercentage >= 35 ? '#f87171' : d.churnPercentage <= 6 ? '#34d399' : '#38bdf8');

    if (!prefersReduced) {
      bar.transition()
        .duration(duration)
        .delay(i * 65)
        .ease(d3.easeCubicOut)
        .attr('width', barW);
    }

    g.append('text')
      .attr('x', -8).attr('y', barY + y.bandwidth() / 2 + 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#e2e8f0').attr('font-size', 12.5).attr('font-family', 'sans-serif').attr('font-weight', 600)
      .text(d.freqBucket);

    const valText = g.append('text')
      .attr('x', barW + 8).attr('y', barY + y.bandwidth() / 2 + 5)
      .attr('fill', '#ffffff').attr('font-size', 13).attr('font-family', 'monospace').attr('font-weight', 800)
      .attr('opacity', prefersReduced ? 1 : 0)
      .text(formatTurkishPercent(d.churnPercentage));

    if (!prefersReduced) {
      valText.transition()
        .duration(duration)
        .delay(100 + i * 65)
        .attr('opacity', 1);
    }
  });

  // Right side: Methodological Caveats Cards (12.5-13.5px readable text)
  const rightX = chartW + 28;
  const rightW = INNER_WIDTH - rightX;

  const card1 = g.append('g')
    .attr('transform', `translate(${rightX}, 0)`)
    .attr('opacity', prefersReduced ? 1 : 0);

  card1.append('rect')
    .attr('x', 0).attr('y', 0).attr('width', rightW).attr('height', 110).attr('rx', 10)
    .attr('fill', 'rgba(245, 158, 11, 0.08)').attr('stroke', 'rgba(245, 158, 11, 0.4)').attr('stroke-width', 1.2);

  card1.append('text')
    .attr('x', 14).attr('y', 24)
    .attr('fill', '#fbbf24').attr('font-size', 12.5).attr('font-weight', 800).attr('font-family', 'Outfit, sans-serif')
    .text('KORELASYON ≠ NEDENSELLİK');

  card1.append('text')
    .attr('x', 14).attr('y', 46)
    .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-family', 'sans-serif')
    .text('12 aylık taahhüt ile %2,4 terk ilişkisi');

  card1.append('text')
    .attr('x', 14).attr('y', 66)
    .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-family', 'sans-serif')
    .text('doğrudan sözleşmenin eseri değildir.');

  card1.append('text')
    .attr('x', 14).attr('y', 86)
    .attr('fill', '#94a3b8').attr('font-size', 11.5).attr('font-family', 'sans-serif')
    .text('Disiplinli üyeler uzun süreyi seçer (Bias).');

  const card2 = g.append('g')
    .attr('transform', `translate(${rightX}, 125)`)
    .attr('opacity', prefersReduced ? 1 : 0);

  card2.append('rect')
    .attr('x', 0).attr('y', 0).attr('width', rightW).attr('height', 110).attr('rx', 10)
    .attr('fill', 'rgba(56, 189, 248, 0.08)').attr('stroke', 'rgba(56, 189, 248, 0.35)').attr('stroke-width', 1.2);

  card2.append('text')
    .attr('x', 14).attr('y', 24)
    .attr('fill', '#38bdf8').attr('font-size', 12.5).attr('font-weight', 800).attr('font-family', 'Outfit, sans-serif')
    .text('DOĞRULANMIŞ VERİ SETİ KAPSAMI');

  card2.append('text')
    .attr('x', 14).attr('y', 46)
    .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-family', 'sans-serif')
    .text('4.000 gözlemlik kamuya açık veri seti.');

  card2.append('text')
    .attr('x', 14).attr('y', 66)
    .attr('fill', '#e2e8f0').attr('font-size', 12).attr('font-family', 'sans-serif')
    .text('Adrian Vinueza (Kaggle simüle veri).');

  card2.append('text')
    .attr('x', 14).attr('y', 86)
    .attr('fill', '#94a3b8').attr('font-size', 11.5).attr('font-family', 'monospace')
    .text('Lisans: CC BY-NC-SA 4.0 (Teyit Önerilir)');

  if (!prefersReduced) {
    card1.transition().duration(duration).delay(150).attr('opacity', 1);
    card2.transition().duration(duration).delay(250).attr('opacity', 1);
  }
}

// =========================================================================
// Main Component
// =========================================================================
export const ScrollyDataViz: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const chartRef = useRef<SVGSVGElement | null>(null);
  const prevStepRef = useRef<number | null>(null);

  const [contractData, setContractData] = useState<ContractRow[]>(DEFAULT_CONTRACT_DATA);
  const [ageData, setAgeData] = useState<AgeRow[]>(DEFAULT_AGE_DATA);
  const [combinedData, setCombinedData] = useState<CombinedRow[]>(DEFAULT_COMBINED_DATA);
  const [lifetimeData, setLifetimeData] = useState<LifetimeRow[]>(DEFAULT_LIFETIME_DATA);
  const [freqData, setFreqData] = useState<FrequencyRow[]>(DEFAULT_FREQ_DATA);

  const steps = PORTFOLIO_DATA.scrollySteps;
  const active = steps[activeStep] ?? steps[0];

  // Asynchronous CSV data loader
  useEffect(() => {
    let isMounted = true;

    // 1. Contract CSV
    d3.csv('/data/churn_by_contract.csv').then((rows) => {
      if (!isMounted || !rows.length) return;
      const parsed: ContractRow[] = rows.map((r) => ({
        contractPeriod: parseInt(r.Contract_period || '1', 10),
        label: String(r.Label || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
        sharePercentage: parseFloat(r.Share_Percentage || '0'),
      }));
      if (parsed.length > 0) setContractData(parsed);
    }).catch(() => {});

    // 2. Age CSV
    d3.csv('/data/churn_by_age.csv').then((rows) => {
      if (!isMounted || !rows.length) return;
      const parsed: AgeRow[] = rows.map((r) => ({
        ageGroup: String(r.Age_Group || '').trim(),
        label: String(r.Label || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
        sharePercentage: parseFloat(r.Share_Percentage || '0'),
      }));
      if (parsed.length > 0) setAgeData(parsed);
    }).catch(() => {});

    // 3. Combined CSV
    d3.csv('/data/churn_combined.csv').then((rows) => {
      if (!isMounted || !rows.length) return;
      const parsed: CombinedRow[] = rows.map((r) => ({
        ageGroup: String(r.Age_Group || '').trim(),
        contractPeriod: parseInt(r.Contract_period || '1', 10),
        contractLabel: String(r.Contract_Label || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
      }));
      if (parsed.length > 0) setCombinedData(parsed);
    }).catch(() => {});

    // 4. Lifetime CSV
    d3.csv('/data/churn_by_lifetime.csv').then((rows) => {
      if (!isMounted || !rows.length) return;
      const parsed: LifetimeRow[] = rows.map((r) => ({
        lifetimeBucket: String(r.Lifetime_Bucket || '').trim(),
        label: String(r.Label || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
      }));
      if (parsed.length > 0) setLifetimeData(parsed);
    }).catch(() => {});

    // 5. Frequency CSV
    d3.csv('/data/churn_by_frequency.csv').then((rows) => {
      if (!isMounted || !rows.length) return;
      const parsed: FrequencyRow[] = rows.map((r) => ({
        freqBucket: String(r.Freq_Bucket || '').trim(),
        totalCount: parseInt(r.Total_Count || '0', 10),
        churnCount: parseInt(r.Churn_Count || '0', 10),
        churnRate: parseFloat(r.Churn_Rate || '0'),
        churnPercentage: parseFloat(r.Churn_Percentage || '0'),
      }));
      if (parsed.length > 0) setFreqData(parsed);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // IntersectionObserver for scrolly steps
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.scrolly-narrative-step'));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (inView) {
          const index = elements.indexOf(inView.target as HTMLElement);
          if (index >= 0) setActiveStep(index);
        }
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Stable D3 rendering lifecycle with premium transitions
  useEffect(() => {
    if (!chartRef.current) return;
    const svg = d3.select(chartRef.current);

    // Stop any in-flight animations on step change (supports fast scrolling in either direction)
    svg.selectAll('*').interrupt();

    // Respect user's motion preference
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReduced ? 0 : 580;

    // Ensure viewBox and gradients are set
    svg.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`).attr('preserveAspectRatio', 'xMidYMid meet');
    addSvgGradientsAndFilters(svg);

    // Persistent plot area container
    let plotLayer = svg.select<SVGGElement>('.chart-plot-layer');
    if (plotLayer.empty()) {
      plotLayer = svg.append('g').attr('class', 'chart-plot-layer');
    }

    const prevStep = prevStepRef.current;

    // Specialized in-place transition between Step 2 (Full Heatmap) and Step 3 (Spotlight Heatmap)
    const isHeatmapStep = activeStep === 2 || activeStep === 3;
    const wasHeatmapStep = prevStep === 2 || prevStep === 3;

    if (isHeatmapStep && wasHeatmapStep && !svg.select('#chart-step-heatmap').empty()) {
      transitionHeatmapFocus(activeStep === 3, duration);
      prevStepRef.current = activeStep;
      return;
    }

    // Coordinated exit/enter transition for switching between different chart types
    plotLayer.selectAll('.chart-step-group')
      .transition()
      .duration(prefersReduced ? 0 : 180)
      .style('opacity', 0)
      .remove();

    const newGroup = plotLayer.append('g')
      .attr('class', 'chart-step-group')
      .attr('id', `chart-step-${activeStep}`)
      .style('opacity', prefersReduced ? 1 : 0);

    if (!prefersReduced) {
      newGroup.transition()
        .duration(180)
        .style('opacity', 1);
    }

    switch (activeStep) {
      case 0:
        drawContractSortedBarChart(newGroup, contractData, duration, prefersReduced);
        break;
      case 1:
        drawAgeLollipopChart(newGroup, ageData, duration, prefersReduced);
        break;
      case 2:
        drawAgeContractHeatmap(newGroup, combinedData, false, duration, prefersReduced);
        break;
      case 3:
        drawAgeContractHeatmap(newGroup, combinedData, true, duration, prefersReduced);
        break;
      case 4:
        drawLifetimeCurveChart(newGroup, lifetimeData, duration, prefersReduced);
        break;
      case 5:
      default:
        drawFrequencySynthesis(newGroup, freqData, duration, prefersReduced);
        break;
    }

    prevStepRef.current = activeStep;
  }, [activeStep, contractData, ageData, combinedData, lifetimeData, freqData]);

  const goToStep = (index: number) => {
    setActiveStep(index);
    document.querySelectorAll<HTMLElement>('.scrolly-narrative-step')[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="relative w-full pb-10">
      {/* Sticky Progress Bar for Desktop */}
      <div className="hidden md:flex sticky top-20 z-30 w-full justify-center py-2 pointer-events-none mb-6">
        <div className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#0d0d0d]/90 backdrop-blur-xl border border-[#b829ea]/40 shadow-[0_0_25px_rgba(184,41,234,0.3)]">
          <span className="text-xs font-mono font-bold text-[#b829ea]">ADIM {activeStep + 1} / {steps.length}</span>
          <span className="h-4 w-px bg-white/20" />
          <div className="flex gap-2 items-center">
            {steps.map((step, index) => (
              <button
                key={step.step}
                type="button"
                onClick={() => goToStep(index)}
                aria-label={`${index + 1}. adıma git: ${step.title}`}
                aria-current={index === activeStep ? 'step' : undefined}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  index === activeStep
                    ? 'bg-[#b829ea] text-white shadow-[0_0_12px_#b829ea] scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 gap-4 md:gap-8">
        {/* Narrative Steps Column */}
        <div className="w-full md:w-1/2 flex flex-col z-10 order-2 md:order-1">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <article
                key={step.step}
                className="scrolly-narrative-step min-h-[58vh] md:min-h-screen flex flex-col justify-center py-8 md:py-20 px-2 sm:px-6 scroll-mt-24"
                data-step={index}
              >
                <div className={`p-5 sm:p-7 md:p-9 rounded-2xl transition-all duration-500 relative ${
                  isActive
                    ? 'bg-[#151024]/95 border-2 border-[#b829ea] shadow-[0_0_35px_rgba(184,41,234,0.35),inset_0_0_20px_rgba(184,41,234,0.1)] scale-[1.01]'
                    : 'bg-[#100d1a]/60 border border-white/10 opacity-55 hover:opacity-80'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-3 md:mb-4 flex-wrap">
                    <span className="font-mono text-xs font-bold tracking-wider text-[#c77dff]">{step.badge}</span>
                    <span className={`text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                      step.status === 'critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : step.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {index === 0 && 'SÖZLEŞME MODELLERİ • 1, 6, 12 AY'}
                      {index === 1 && 'DEMOGRAFİK DAĞILIM • LOLLIPOP'}
                      {index === 2 && '12 HÜCRE MATRİSİ • ISI HARİTASI'}
                      {index === 3 && 'ZİRVE RİSK VE ODAK NOKTASI'}
                      {index === 4 && 'LIFETIME • GÖZLEMSEL İLİŞKİ'}
                      {index === 5 && 'HAFTALIK KATILIM & SENTEZ'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 md:mb-3">{step.title}</h3>
                  <p className="text-base sm:text-base md:text-lg text-slate-200 leading-relaxed mb-4 md:mb-6">{step.description}</p>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-[#b829ea]/15 text-[#e0aaff] border border-[#b829ea]/40 shadow-[0_0_15px_rgba(184,41,234,0.2)]">
                    <span aria-hidden="true">◆</span>
                    <span>{step.highlightMetric}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Sticky Visualization Column */}
        <div className="scrolly-chart-sticky sticky top-0 w-full md:w-1/2 h-[56vh] md:h-screen flex flex-col justify-center p-2 sm:p-4 z-20 order-1 md:order-2">
          <div className="w-full max-w-2xl mx-auto flex flex-col p-4 sm:p-5 md:p-6 bg-[#100d1c]/95 backdrop-blur-xl border border-[#b829ea]/40 rounded-xl md:rounded-2xl shadow-[0_0_35px_rgba(184,41,234,0.25)]">
            
            {/* HTML Chart Title Bar (18-20px rendered desktop size, eliminating duplicate inside SVG) */}
            <div className="flex items-start justify-between gap-2 mb-2 pb-2.5 border-b border-white/10 shrink-0">
              <div className="min-w-0 flex-1">
                <span className="font-mono text-xs md:text-[13px] font-bold text-[#c77dff] flex items-center gap-1.5">
                  <span aria-hidden="true">▥</span>
                  {activeStep === 0 && 'D3.js SIRALI SÜTUN (BAR) GRAFİĞİ'}
                  {activeStep === 1 && 'D3.js NOKTA / LOLLIPOP GRAFİĞİ'}
                  {activeStep === 2 && 'D3.js ETKİLEŞİM ISI HARİTASI (HEATMAP)'}
                  {activeStep === 3 && 'D3.js ODAKLANMIŞ ISI HARİTASI (SPOTLIGHT)'}
                  {activeStep === 4 && 'D3.js ALAN & EĞRİ GRAFİĞİ (LIFETIME)'}
                  {activeStep === 5 && 'D3.js KATILIM SIKLIĞI VE METODOLOJİ'}
                </span>
                <h4 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-tight mt-0.5">
                  {activeStep === 0 && 'Sözleşme Süresine Göre Gözlemlenen Terk Oranları'}
                  {activeStep === 1 && 'Demografik Yaş Gruplarına Göre Churn Dağılımı'}
                  {activeStep === 2 && 'Yaş ve Sözleşme Tipi Etkileşim Matrisi (12 Hücre)'}
                  {activeStep === 3 && 'Zirve Risk: 18-25 Yaş & 1 Ay (%78,2)'}
                  {activeStep === 4 && 'Üyelik Süresi (Lifetime) Kategorileri ve Terk'}
                  {activeStep === 5 && 'Haftalık Katılım Sıklığı & Metodolojik Sentez'}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-300 font-sans mt-0.5 truncate">
                  {activeStep === 0 && '12 aylık taahhüt ile 1 aylık paket arasında 39,9 pp gözlemsel fark görülmektedir'}
                  {activeStep === 1 && '18-25 yaş kümesi (%61,9) en kırılgan grup; 34+ yaş grubu (%3,3) en sadık kitle'}
                  {activeStep === 2 && '4 Yaş Grubu × 3 Sözleşme Tipi = 12 Analitik Hücrede Terk Dağılımı'}
                  {activeStep === 3 && '18-25 & 1 Ay (%78,2) ile 34+ & 12 Ay (%0,0) arasında 78,2 pp gözlemsel uçurum'}
                  {activeStep === 4 && '0-2 ay kategorilerinde gözlemlenen terk yüksek; zamansal kopuş veya nedensellik içermez'}
                  {activeStep === 5 && 'Haftada 2+ gün gelenlerde terk %5-19 bandına geriliyor; korelasyon ≠ nedensellik'}
                </p>
              </div>
              <div className="font-mono text-xs md:text-[13px] font-bold px-2.5 py-1 rounded-lg bg-[#b829ea]/20 text-[#e0aaff] border border-[#b829ea]/40 shrink-0 text-center">
                {activeStep === 0 && '1, 6, 12 Ay'}
                {activeStep === 1 && '18 ile 41 Yaş'}
                {activeStep === 2 && '12 Hücre'}
                {activeStep === 3 && 'Odak Noktası'}
                {activeStep === 4 && 'Tenure Eğrisi'}
                {activeStep === 5 && 'Katılım & Sentez'}
              </div>
            </div>

            {/* D3.js SVG Container (Broadened plotting area without vertical header duplication) */}
            <div className="w-full min-w-0">
              <svg
                ref={chartRef}
                className="block w-full h-auto max-h-[44vh] md:max-h-[58vh]"
                role="img"
                aria-label={`Adım ${activeStep + 1}: ${active.title}. ${active.highlightMetric}`}
              />
            </div>

            {/* Source Note Footer */}
            <div className="flex items-center justify-between gap-2 mt-1.5 pt-2 border-t border-white/10 text-xs sm:text-[13px] font-mono text-slate-400">
              <span>Kaynak: Kaggle Gym Churn US (4.000 Gözlem)</span>
              <span>{activeStep + 1} / {steps.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Step Switcher */}
      <div className="flex md:hidden justify-center gap-2 px-4 pt-4">
        {steps.map((step, index) => (
          <button
            key={step.step}
            type="button"
            onClick={() => goToStep(index)}
            aria-label={`${index + 1}. adıma git`}
            className={`h-9 w-9 rounded-lg text-xs font-mono font-bold ${index === activeStep ? 'bg-[#b829ea] text-white shadow-[0_0_10px_#b829ea]' : 'bg-white/10 text-slate-300'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrollyDataViz;
