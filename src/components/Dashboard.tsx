import { useState } from "react";
import { Link } from "react-router";
import { localDate } from "../models/date";
import { journalEntriesOnDate, loadJournalEntries, type JournalEntry } from "../models/journal";
import { averageRating, dayEntries, loadMoodEntries, moodForRating, type MoodEntry } from "../models/mood";
import Calendar from "./Calendar";
import QuoteCard from "./QuoteCard";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-tertiary/30 bg-secondary/70 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-tertiary">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      <p className="text-sm text-tertiary">{hint}</p>
    </div>
  );
}

export default function Dashboard() {
  const [moods] = useState<MoodEntry[]>(loadMoodEntries);
  const [journals] = useState<JournalEntry[]>(loadJournalEntries);
  const [selected, setSelected] = useState(() => localDate(new Date()));
  const [view, setView] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const now = new Date();
  const today = localDate(now);
  const currentMonthPrefix = today.slice(0, 7);

  const selectedMoods = dayEntries(moods, selected);
  const selectedJournals = journalEntriesOnDate(journals, selected);
  const selectedAverage = averageRating(selectedMoods);
  const selectedLabel = new Date(`${selected}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayMoods = dayEntries(moods, today);
  const todayAverage = averageRating(todayMoods);
  const todayJournalCount = journalEntriesOnDate(journals, today).length;
  const monthMoodCount = moods.filter((entry) => localDate(new Date(entry.createdAt)).startsWith(currentMonthPrefix)).length;
  const monthJournalCount = journals.filter((entry) => localDate(new Date(entry.createdAt)).startsWith(currentMonthPrefix)).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-tertiary">
            {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-primary sm:text-4xl">
            {greetingFor(now.getHours())}
          </h1>
          <p className="mt-1 text-tertiary">A quiet place to check in with yourself.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/journal"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-[#323437] transition hover:opacity-90"
          >
            Write in journal
          </Link>
          <Link
            to="/trackmood"
            className="rounded-full border border-primary px-4 py-2 text-sm font-medium transition hover:bg-primary/10"
          >
            Log a mood
          </Link>
        </div>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Today's mood"
          value={todayAverage !== null ? `${moodForRating(todayAverage).emoji} ${moodForRating(todayAverage).label}` : "—"}
          hint={todayMoods.length ? `${todayMoods.length} check-in${todayMoods.length === 1 ? "" : "s"}` : "Not logged yet"}
        />
        <Stat
          label="Journal today"
          value={`${todayJournalCount} ${todayJournalCount === 1 ? "entry" : "entries"}`}
          hint={todayJournalCount ? "Your thoughts are saved" : "A few lines are enough"}
        />
        <Stat
          label="This month"
          value={`${monthMoodCount} moods`}
          hint={`${monthJournalCount} journal entr${monthJournalCount === 1 ? "y" : "ies"}`}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="rounded-4xl border border-tertiary/30 bg-secondary/70 p-4 shadow-sm sm:p-6">
          <Calendar
            title="Your calendar"
            view={view}
            onViewChange={setView}
            selected={selected}
            onSelect={setSelected}
            moods={moods}
            journals={journals}
          />
        </section>

        <div className="flex flex-col gap-6">
          <QuoteCard />

          <section className="rounded-4xl border border-tertiary/30 bg-secondary/70 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold">
                  {selected === today ? `Today · ${selectedLabel}` : selectedLabel}
                </h2>
                <p className="text-sm text-tertiary">
                  {selectedMoods.length} mood{selectedMoods.length === 1 ? "" : "s"} ·{" "}
                  {selectedJournals.length} journal {selectedJournals.length === 1 ? "entry" : "entries"}
                </p>
              </div>
              {selectedAverage !== null && (
                <span className="rounded-full bg-primary/15 px-3 py-1 text-sm">
                  {moodForRating(selectedAverage).emoji} {moodForRating(selectedAverage).label}
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-tertiary">Mood</h3>
              {selectedMoods.length === 0 ? (
                <p className="mt-1 text-sm text-tertiary">No mood logged for this day.</p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selectedMoods.map((entry) => {
                    const mood = moodForRating(entry.rating);
                    return (
                      <li
                        key={entry.id}
                        className="rounded-full border border-tertiary/30 px-3 py-1 text-sm"
                      >
                        <span aria-hidden="true">{mood.emoji}</span> {mood.label}{" "}
                        <span className="text-tertiary">
                          {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-tertiary">Journal</h3>
              {selectedJournals.length === 0 ? (
                <p className="mt-1 text-sm text-tertiary">No journal entry for this day.</p>
              ) : (
                <ul className="mt-2 space-y-3">
                  {selectedJournals.map((entry) => (
                    <li key={entry.id} className="rounded-xl border border-tertiary/25 bg-secondary/70 p-3">
                      {entry.tag && (
                        <span className="text-xs font-medium text-primary">{entry.tag}</span>
                      )}
                      <p className="mt-1 whitespace-pre-wrap text-sm">{entry.text}</p>
                      <time dateTime={entry.createdAt} className="mt-2 block text-xs text-tertiary">
                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {selectedJournals.length === 0 && (
              <Link
                to="/journal"
                className="mt-4 inline-block text-sm font-medium text-primary transition hover:opacity-80"
              >
                Write about this day →
              </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
