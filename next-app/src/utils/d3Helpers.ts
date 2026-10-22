/**
 * D3 and SVG styling constants and helper functions
 */
export const D3_CYBER_THEME = {
  purpleDeep: "#240046",
  purpleDark: "#3c096c",
  purpleElectric: "#7b2cbf",
  purpleNeon: "#9d4edd",
  purpleBright: "#c77dff",
  purpleGlow: "#e0aaff",
  emeraldSafe: "#10b981",
  amberWarn: "#f59e0b",
  roseDanger: "#ef4444",
  cyanAccent: "#00f5d4",
  blueAccent: "#38bdf8",
  bgCard: "rgba(18, 15, 28, 0.8)",
  borderColor: "rgba(199, 125, 255, 0.2)",
};

export function getChurnRiskColor(percentage: number): string {
  if (percentage >= 30) return D3_CYBER_THEME.roseDanger;
  if (percentage >= 20) return D3_CYBER_THEME.amberWarn;
  return D3_CYBER_THEME.emeraldSafe;
}

export function getMembershipColor(type: string): string {
  if (type === '1' || type === 'Monthly') return D3_CYBER_THEME.purpleBright;
  if (type === '6' || type === 'Quarterly') return D3_CYBER_THEME.blueAccent;
  return D3_CYBER_THEME.emeraldSafe;
}

export function getContractColor(period: number | string): string {
  const p = String(period);
  if (p === '1') return D3_CYBER_THEME.purpleBright;
  if (p === '6') return D3_CYBER_THEME.blueAccent;
  return D3_CYBER_THEME.emeraldSafe;
}
