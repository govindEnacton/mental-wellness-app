import { useEffect, useState } from "react";

type Quote = { id: number; quote: string; author: string };

export default function Quotes() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    async function loadQuote() {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setQuote(await res.json());
    }

    loadQuote().catch(console.error);
  }, []);

  return (
    <div className="Quotes text-center text-3xl flex h-screen justify-center items-center">
      {quote ? (
        <blockquote>
          {quote.quote}
          <div className="text-primary">— {quote.author}</div>
        </blockquote>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
