import { monthCells } from "../models/calendar";
import { localDate } from "../models/date";
import type { JournalEntry } from "../models/journal";
import { averageRating, moodForRating, type MoodEntry } from "../models/mood";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type CalendarProps = {
  view: Date;
  selected: string;
  onSelect: (dateKey: string) => void;
  onViewChange: (view: Date) => void;
  moods?: MoodEntry[];
  journals?: JournalEntry[];
  compact?: boolean;
  title?: string;
};

export default function Calendar({
  view,
  selected,
  onSelect,
  onViewChange,
  moods = [],
  journals = [],
  compact = false,
  title,
}: CalendarProps) {
  const today = localDate(new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const moodsByDay = new Map<string, MoodEntry[]>();
  for (const entry of moods) {
    const key = localDate(new Date(entry.createdAt));
    moodsByDay.set(key, [...(moodsByDay.get(key) ?? []), entry]);
  }
  const journalDays = new Set(journals.map((entry) => localDate(new Date(entry.createdAt))));

  function goToToday() {
    const now = new Date();
    onViewChange(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelect(localDate(now));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <p className={title ? "text-sm text-tertiary" : "text-sm font-medium"}>{monthLabel}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToToday}
            className={`rounded-full border border-tertiary/40 transition hover:bg-primary/10 ${
              compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
            }`}
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => onViewChange(new Date(year, month - 1, 1))}
            className="rounded-full px-2 py-1 text-lg leading-none transition hover:bg-primary/15"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => onViewChange(new Date(year, month + 1, 1))}
            className="rounded-full px-2 py-1 text-lg leading-none transition hover:bg-primary/15"
          >
            ›
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-7 gap-1 text-center text-tertiary ${compact ? "mt-2 text-[10px]" : "mt-4 text-xs"}`}>
        {weekdays.map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {monthCells(year, month).map((day, index) => {
          if (day === null) return <span key={`empty-${index}`} />;

          const dateKey = localDate(new Date(year, month, day));
          const isFuture = dateKey > today;
          const isSelected = dateKey === selected;
          const dayMoods = moodsByDay.get(dateKey) ?? [];
          const average = averageRating(dayMoods);
          const hasJournal = journalDays.has(dateKey);
          const fullDate = new Date(year, month, day).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          return (
            <button
              key={dateKey}
              type="button"
              disabled={isFuture}
              onClick={() => onSelect(dateKey)}
              aria-label={`${fullDate}${average !== null ? `, mood ${moodForRating(average).label}` : ""}${hasJournal ? ", journal entry" : ""}`}
              aria-pressed={isSelected}
              className={`flex flex-col items-center justify-center border transition ${
                compact ? "min-h-7 rounded-md text-[10px]" : "min-h-14 rounded-xl text-xs"
              } ${
                isSelected
                  ? "border-primary bg-primary/20"
                  : "border-transparent hover:border-primary/40 hover:bg-primary/10"
              } ${isFuture ? "opacity-30" : ""} ${dateKey === today && !isSelected ? "ring-1 ring-primary/60" : ""}`}
            >
              <span className="font-medium">{day}</span>
              <span aria-hidden="true" className={`${compact ? "text-xs" : "text-base"} leading-none`}>
                {average !== null ? moodForRating(average).emoji : ""}
              </span>
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full ${hasJournal ? "bg-primary" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-tertiary ${compact ? "mt-2 text-[10px]" : "mt-4 text-xs"}`}>
        <span>🙂 {compact ? "mood" : "average mood"}</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {compact ? "journal" : "journal entry"}
        </span>
        {!compact && <span className="sm:ml-auto">Select a day to revisit it.</span>}
      </div>
    </div>
  );
}
