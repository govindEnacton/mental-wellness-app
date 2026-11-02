import { localDate } from "./date";

export type Quote = { id: number; quote: string; author: string };
type CachedQuote = { date: string; quote: Quote };

export function isQuote(value: unknown): value is Quote {
  if (value === null || typeof value !== "object") return false;
  const candidate = value as Partial<Quote>;
  return (
    typeof candidate.id === "number" &&
    typeof candidate.quote === "string" && candidate.quote.trim() !== "" &&
    typeof candidate.author === "string"
  );
}

export function cachedQuoteFor(raw: string | null, today: string): Quote | null {
  try {
    const saved: unknown = JSON.parse(raw ?? "null");
    if (saved === null || typeof saved !== "object") return null;
    const cached = saved as Partial<CachedQuote>;
    return cached.date === today && isQuote(cached.quote) ? cached.quote : null;
  } catch {
    return null;
  }
}

export async function dailyQuote(today = localDate(new Date())): Promise<Quote> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("daily-quote");
  } catch {
    // Storage can be blocked; the quote still loads from the API.
  }
  const cached = cachedQuoteFor(raw, today);
  if (cached) return cached;

  const response = await fetch("https://dummyjson.com/quotes/random");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const quote: unknown = await response.json();
  if (!isQuote(quote)) throw new Error("Invalid quote response");

  try {
    localStorage.setItem("daily-quote", JSON.stringify({ date: today, quote } satisfies CachedQuote));
  } catch {
    // A quote can still be shown when storage is unavailable.
  }
  return quote;
}
