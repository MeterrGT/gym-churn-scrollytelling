'use client';
import { useState, useMemo } from 'react';
import { calculateOLSPrice, formatPriceUSD, getCpuDescription, getGpuDescription } from '@/utils/olsRegression';

export function usePriceSimulator() {
  const [ram, setRam] = useState<number>(16);
  const [cpu, setCpu] = useState<number>(5);
  const [gpu, setGpu] = useState<number>(4);

  const calculatedPrice = useMemo(() => {
    return calculateOLSPrice({ ram, cpu, gpu });
  }, [ram, cpu, gpu]);

  const formattedPrice = useMemo(() => {
    return formatPriceUSD(calculatedPrice);
  }, [calculatedPrice]);

  const cpuDescription = useMemo(() => {
    return getCpuDescription(cpu);
  }, [cpu]);

  const gpuDescription = useMemo(() => {
    return getGpuDescription(gpu);
  }, [gpu]);

  // Helper for inline gradient track filling
  const getTrackBackground = (val: number, min: number, max: number) => {
    const percentage = ((val - min) / (max - min)) * 100;
    return `linear-gradient(to right, #9D4EDD 0%, #C77DFF ${percentage}%, #171224 ${percentage}%, #171224 100%)`;
  };

  return {
    ram,
    setRam,
    cpu,
    setCpu,
    gpu,
    setGpu,
    calculatedPrice,
    formattedPrice,
    cpuDescription,
    gpuDescription,
    getTrackBackground,
  };
}

