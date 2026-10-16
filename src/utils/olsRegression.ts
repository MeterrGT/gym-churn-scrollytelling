import { PORTFOLIO_DATA } from '@/data/portfolio';

export interface RegressionParams {
  ram: number;
  cpu: number;
  gpu: number;
}

export function calculateOLSPrice({ ram, cpu, gpu }: RegressionParams): number {
  const { basePrice, ramBeta, cpuBeta, gpuBeta } = PORTFOLIO_DATA.regressionModel;

  const price = Math.round(
    basePrice +
      (ram - 4) * ramBeta +
      (cpu - 1) * cpuBeta +
      (gpu - 1) * gpuBeta
  );

  return Math.max(basePrice, price);
}

export function formatPriceUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function getCpuDescription(tier: number): string {
  return (
    PORTFOLIO_DATA.regressionModel.cpuDescriptions[tier] || `Seviye ${tier}`
  );
}

export function getGpuDescription(tier: number): string {
  return (
    PORTFOLIO_DATA.regressionModel.gpuDescriptions[tier] || `Seviye ${tier}`
  );
}
