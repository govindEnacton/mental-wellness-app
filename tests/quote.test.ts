import { expect, test } from "bun:test";
import { cachedQuoteFor, type Quote } from "../src/models/quote";

const quote: Quote = { id: 7, quote: "Breathe.", author: "Someone" };
const saved = JSON.stringify({ date: "2026-10-30", quote });

test("a quote cached today is reused", () => {
  expect(cachedQuoteFor(saved, "2026-10-30")).toEqual(quote);
});

test("a quote cached yesterday is ignored", () => {
  expect(cachedQuoteFor(saved, "2026-10-29")).toBeNull();
});

test("broken or incomplete cache is ignored", () => {
  expect(cachedQuoteFor("not json", "2026-10-30")).toBeNull();
  expect(cachedQuoteFor(JSON.stringify({ date: "2026-10-30", quote: { id: "7" } }), "2026-10-30")).toBeNull();
});
