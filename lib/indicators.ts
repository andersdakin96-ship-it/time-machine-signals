import { Candle } from "@/types";

export function calculateATR(candles: Candle[], period = 14): number {
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const cur = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      cur.high - cur.low,
      Math.abs(cur.high - prev.close),
      Math.abs(cur.low - prev.close)
    );
    trs.push(tr);
  }
  const recent = trs.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

export function calculateMomentum(candles: Candle[], period = 10): number {
  const recent = candles.slice(-period);
  const start = recent[0].close;
  const end = recent[recent.length - 1].close;
  return ((end - start) / start) * 100;
}

export function calculateVolumeSpike(candles: Candle[], period = 20): number {
  const recent = candles.slice(-period);
  const avgVol = recent.reduce((a, b) => a + b.volume, 0) / recent.length;
  const lastVol = candles[candles.length - 1].volume;
  return lastVol / avgVol;
}

export function clampThreshold(
  value: number,
  assetClass: "crypto" | "stock"
): number {
  const bounds =
    assetClass === "crypto" ? { min: 1.5, max: 6 } : { min: 0.75, max: 3 };
  return Math.min(Math.max(value, bounds.min), bounds.max);
}
