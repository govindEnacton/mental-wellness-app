import QuoteCard from "./QuoteCard";

export default function Quotes() {
  return (
    <section className="relative mx-auto flex min-h-[70vh] max-w-4xl flex-col justify-center px-4 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-tertiary">
          Daily inspiration
        </p>
        <h1 className="mt-3 text-center text-3xl font-semibold text-primary sm:text-4xl">
          A little light for today
        </h1>
        <p className="mt-2 text-center text-tertiary">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <div className="mt-8">
          <QuoteCard />
        </div>
        <p className="mt-4 text-center text-sm text-tertiary">A new quote arrives each day.</p>
      </div>
    </section>
  );
}
