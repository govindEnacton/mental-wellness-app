import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthCells } from "../models/calendar";
import { localDate } from "../models/date";
import { averageRating, chartPoints, dayEntries, loadMoodEntries, moodForRating, moods, sameMinute, saveMoodEntries, type MoodEntry, type Period } from "../models/mood";

function displayDate(dateKey: string, today: string) {
  if (!dateKey) return "No date selected";
  if (dateKey === today) return "Today";
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function TrackMood() {
  const [entries, setEntries] = useState<MoodEntry[]>(loadMoodEntries);
  const [rating, setRating] = useState<number | null>(null);
  const [date, setDate] = useState(() => localDate(new Date()));
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [view, setView] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [period, setPeriod] = useState<Period>("day");
  const [error, setError] = useState("");
  const today = localDate(new Date());
  const points = chartPoints(entries, period, date);
  const average = averageRating(dayEntries(entries, date));

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const cells = monthCells(year, month);

  function pickDate(dateKey: string) {
    setDate(dateKey);
    setView(new Date(`${dateKey}T00:00:00`));
    setPeriod("day");
  }

  function addMood() {
    if (rating === null || !date || !time) return;
    const createdAt = new Date(`${date}T${time}`);
    if (Number.isNaN(createdAt.getTime()) || createdAt > new Date()) {
      setError("Choose a date and time that isn't in the future.");
      return;
    }
    if (entries.some((entry) => sameMinute(entry.createdAt, createdAt.toISOString()))) {
      setError("Only one mood entry per minute.");
      return;
    }

    const next = [...entries, { id: crypto.randomUUID(), rating, createdAt: createdAt.toISOString() }];
    if (!saveMoodEntries(next)) {
      setError("Could not save your mood. Check your browser storage and try again.");
      return;
    }
    setEntries(next);
    setRating(null);
    if (date === today) setTime(new Date().toTimeString().slice(0, 5));
    setError("");
  }

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center gap-3 px-2 py-4 lg:h-[90vh] lg:flex-row lg:gap-2 lg:px-0 lg:py-0">
      <div className="flex h-[60vh] w-full flex-col rounded-lg border border-tertiary/40 bg-secondary/70 p-4 shadow-sm lg:w-1/2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-primary">Mood trends</h1>
          <select
            aria-label="Chart period"
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            className="rounded border border-tertiary bg-secondary p-2"
          >
            <option value="day">{date === today ? "Today" : "Selected day"}</option>
            <option value="this-month">This month</option>
            <option value="last-month">Last month</option>
          </select>
        </div>

        {points.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-tertiary">
            {period === "day" ? "No moods recorded for this day." : "No moods recorded for this period."}
          </p>
        ) : (
          <div className="mt-4 min-h-0 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" opacity={0.3} />
                <XAxis dataKey="label" stroke="var(--muted)" tick={{ fill: "var(--muted)" }} minTickGap={16} />
                <YAxis domain={[1, 10]} ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} stroke="var(--muted)" tick={{ fill: "var(--muted)" }} />
                <Tooltip
                  formatter={(value: unknown) => `${String(value)} / 10`}
                  contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--muted)", borderRadius: 12 }}
                  labelStyle={{ color: "var(--muted)" }}
                />
                <Line type="monotone" dataKey="rating" stroke="#e2b714" strokeWidth={2} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          )}
        {period !== "day" && <p className="mt-2 text-sm text-tertiary">Each point averages that day's entries; the emoji uses the rounded average.</p>}
      </div>

      <div className="flex w-full flex-col gap-3 lg:h-[60vh] lg:w-1/4 lg:gap-4">
        <div className="flex flex-col overflow-y-auto rounded-lg border border-tertiary/40 bg-secondary/70 p-4 shadow-sm lg:h-[59%]">
          <div className="flex items-center justify-between gap-2">
            <button type="button" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))} className="rounded px-2 py-1 transition hover:bg-primary/20">‹</button>
            <p className="text-sm font-medium">{monthLabel}</p>
            <button type="button" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))} className="rounded px-2 py-1 transition hover:bg-primary/20">›</button>
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-tertiary">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, index) => {
              if (day === null) return <span key={`empty-${index}`} />;
              const dateKey = localDate(new Date(year, month, day));
              const isFuture = dateKey > today;
              const isSelected = dateKey === date;
              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={isFuture}
                  onClick={() => pickDate(dateKey)}
                  aria-label={new Date(year, month, day).toLocaleDateString()}
                  aria-pressed={isSelected}
                  className={`h-6 rounded text-xs transition ${isSelected ? "bg-primary text-[#323437]" : isFuture ? "opacity-30" : "hover:bg-primary/20"} ${dateKey === today && !isSelected ? "ring-1 ring-primary" : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-xs text-tertiary">
              Date
              <input
                type="date"
                max={today}
                value={date}
                onChange={(event) => {
                  const next = event.target.value;
                  setDate(next);
                  if (next) setView(new Date(`${next}T00:00:00`));
                  setPeriod("day");
                }}
                className="mt-1 w-full rounded border border-tertiary bg-secondary p-1 text-sm"
              />
            </label>
            <label className="text-xs text-tertiary">
              Time
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="mt-1 w-full rounded border border-tertiary bg-secondary p-1 text-sm"
              />
            </label>
          </div>
          <p className="mt-2 text-sm text-tertiary">
            {displayDate(date, today)}{average !== null ? ` · avg ${moodForRating(average).emoji}` : ""}
          </p>
        </div>

        <div className="flex flex-col overflow-y-auto rounded-lg border border-tertiary/40 bg-secondary/70 p-4 shadow-sm lg:h-[39%]">
          <h2 className="text-lg font-semibold">Add a mood</h2>
          <p className="mt-1 text-sm text-tertiary">{displayDate(date, today)} · {time}</p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {moods.map((mood, index) => (
              <button
                key={mood.label}
                type="button"
                onClick={() => setRating(index + 1)}
                aria-pressed={rating === index + 1}
                aria-label={`${mood.label} (${index + 1} of 10)`}
                title={`${mood.label} (${index + 1} of 10)`}
                className="rounded-lg border border-tertiary py-1 text-lg transition hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary/10"
              >
                <span aria-hidden="true">{mood.emoji}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm">{rating ? `${moods[rating - 1].emoji} ${moods[rating - 1].label}` : "Pick a mood"}</p>
          <button
            type="button"
            onClick={addMood}
            disabled={rating === null || !date || !time}
            className="mt-auto w-full rounded-full bg-primary px-5 py-2 font-medium text-[#323437] transition hover:opacity-90 disabled:opacity-50"
          >
            Add mood
          </button>
          {error && <p role="alert" className="mt-2 text-sm text-alert">{error}</p>}
        </div>
      </div>
    </section>
  );
}
