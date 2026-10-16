export interface GymChurnRecord {
  ageGroup: string;
  contractPeriod: number | string;
  contractLabel?: string;
  totalCount?: number;
  churnCount?: number;
  churnRate: number;
  churnPercentage: number;
}

export interface LaptopPriceRecord {
  id: number;
  brand: string;
  model: string;
  ramGb: number;
  cpuTier: number;
  gpuTier: number;
  storageGb: number;
  priceUsd: number;
}

export function parseGymChurnCSV(csvText: string): GymChurnRecord[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const records: GymChurnRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 6) {
      records.push({
        ageGroup: parts[0].trim(),
        contractPeriod: parseInt(parts[1].trim(), 10) || parts[1].trim(),
        totalCount: parseInt(parts[2].trim(), 10) || 0,
        churnCount: parseInt(parts[3].trim(), 10) || 0,
        churnRate: parseFloat(parts[4].trim()) || 0,
        churnPercentage: parseFloat(parts[5].trim()) || 0,
        contractLabel: parts[6] ? parts[6].trim() : undefined,
      });
    }
  }
  return records;
}

export function parseLaptopCSV(csvText: string): LaptopPriceRecord[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];

  const records: LaptopPriceRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    if (parts.length >= 8) {
      records.push({
        id: parseInt(parts[0], 10),
        brand: parts[1],
        model: parts[2],
        ramGb: parseInt(parts[3], 10),
        cpuTier: parseInt(parts[4], 10),
        gpuTier: parseInt(parts[5], 10),
        storageGb: parseInt(parts[6], 10),
        priceUsd: parseFloat(parts[7]),
      });
    }
  }
  return records;
}
