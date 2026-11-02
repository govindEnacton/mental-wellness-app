import { useEffect, useState } from "react";
import { dailyQuote, type Quote } from "../models/quote";

export default function QuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    dailyQuote()
      .then((todayQuote) => {
        if (!cancelled) setQuote(todayQuote);
      })
      .catch(() => {
        if (!cancelled) setError("Today's quote couldn't be loaded. Please try again later.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-label="Quote of the day"
      className="quote-card relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/15 via-secondary to-primary/5 p-6 shadow-sm sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-4 font-serif text-[8rem] leading-none text-primary/15"
      >
        “
      </span>
      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-tertiary">Quote of the day</p>

        {quote ? (
          <>
            <blockquote className="mt-4 font-serif text-xl leading-relaxed sm:text-2xl">
              “{quote.quote}”
            </blockquote>
            <p className="mt-4 text-sm font-medium text-primary">— {quote.author}</p>
          </>
        ) : error ? (
          <p role="alert" className="mt-4 text-sm text-tertiary">{error}</p>
        ) : (
          <p className="mt-4 animate-pulse text-tertiary" aria-live="polite">
            Finding a quote for today…
          </p>
        )}
      </div>
    </section>
  );
}
