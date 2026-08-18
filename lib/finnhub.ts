export async function getFinnhubCandles(symbol: string, resolution = "60", count = 100) {
  const to = Math.floor(Date.now() / 1000);
  const from = to - count * 3600;
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${process.env.FINNHUB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Finnhub error for ${symbol}: ${res.status}`);
  const data = await res.json();
  if (data.s !== "ok") return [];
  return data.t.map((t: number, i: number) => ({
    time: t * 1000,
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    close: data.c[i],
    volume: data.v[i],
  }));
}
