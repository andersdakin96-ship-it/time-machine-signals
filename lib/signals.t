import { Candle, Signal } from "@/types";
import { calculateATR, calculateMomentum, calculateVolumeSpike, clampThreshold } from "./indicators";

export function generateSignal(
  symbol: string,
  assetClass: "crypto" | "stock",
  candles: Candle[]
): Signal | null {
  if (candles.length < 20) return null;

  const atr = calculateATR(candles);
  const momentum = calculateMomentum(candles);
  const volumeSpike = calculateVolumeSpike(candles);
  const lastClose = candles[candles.length - 1].close;

  let direction: "bullish" | "bearish" | "neutral" = "neutral";
  let confidence = 0;

  if (momentum > 1.5 && volumeSpike > 1.3) {
    direction = "bullish";
    confidence = Math.min(0.5 + momentum / 20 + (volumeSpike - 1) / 5, 0.95);
  } else if (momentum < -1.5 && volumeSpike > 1.3) {
    direction = "bearish";
    confidence = Math.min(0.5 + Math.abs(momentum) / 20 + (volumeSpike - 1) / 5, 0.95);
  } else {
    return null;
  }

  const atrPct = (atr / lastClose) * 100;
  const thresholdPct = clampThreshold(atrPct * 1.5, assetClass);
  const thresholdDecimal = thresholdPct / 100;

  const targetPrice =
    direction === "bullish"
      ? lastClose * (1 + thresholdDecimal)
      : lastClose * (1 - thresholdDecimal);
  const stopPrice =
    direction === "bullish"
      ? lastClose * (1 - thresholdDecimal)
      : lastClose * (1 + thresholdDecimal);

  return {
    symbol,
    assetClass,
    direction,
    confidence: parseFloat(confidence.toFixed(2)),
    entryPrice: lastClose,
    targetPrice,
    stopPrice,
    atrValue: atr,
    createdAt: new Date().toISOString(),
    outcome: "pending",
  };
}
