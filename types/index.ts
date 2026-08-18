export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  id?: string;
  symbol: string;
  assetClass: "crypto" | "stock";
  direction: "bullish" | "bearish" | "neutral";
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopPrice: number;
  atrValue: number;
  createdAt: string;
  outcome: "pending" | "win" | "loss" | "expired";
}
