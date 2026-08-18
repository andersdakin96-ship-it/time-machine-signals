import { NextResponse } from "next/server";
import { getBinanceKlines } from "@/lib/binance";
import { getFinnhubCandles } from "@/lib/finnhub";
import { generateSignal } from "@/lib/signals";
import { supabase } from "@/lib/supabase";

const CRYPTO_WATCHLIST = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];
const STOCK_WATCHLIST = ["AAPL", "MSFT", "NVDA", "TSLA", "AMZN"];

export async function GET() {
  const results: any[] = [];
  const errors: any[] = [];

  for (const symbol of CRYPTO_WATCHLIST) {
    try {
      const candles = await getBinanceKlines(symbol);
      const signal = generateSignal(symbol, "crypto", candles);
      if (signal) results.push(signal);
    } catch (e: any) {
      errors.push({ symbol, error: e.message });
    }
  }

  for (const symbol of STOCK_WATCHLIST) {
    try {
      const candles = await getFinnhubCandles(symbol);
      const signal = generateSignal(symbol, "stock", candles);
      if (signal) results.push(signal);
    } catch (e: any) {
      errors.push({ symbol, error: e.message });
    }
  }

  if (results.length > 0) {
    await supabase.from("signals").insert(results);
  }

  await supabase.from("scan_log").insert({
    run_at: new Date().toISOString(),
    symbols_scanned: CRYPTO_WATCHLIST.length + STOCK_WATCHLIST.length,
    signals_generated: results.length,
    errors: errors.length > 0 ? errors : null,
  });

  return NextResponse.json({ generated: results.length, errors });
}
