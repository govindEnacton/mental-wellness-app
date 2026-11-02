import { localDate } from "./date";

export const moods = [
  { label: "Angry", emoji: "😠" },
  { label: "Stressed", emoji: "😣" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😢" },
  { label: "Tired", emoji: "😴" },
  { label: "Okay", emoji: "😐" },
  { label: "Calm", emoji: "😌" },
  { label: "Good", emoji: "🙂" },
  { label: "Happy", emoji: "😄" },
  { label: "Excited", emoji: "🤩" },
] as const;

export type MoodEntry = { id: string; rating: number; createdAt: string };
export type Period = "day" | "this-month" | "last-month";

export function loadMoodEntries(): MoodEntry[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem("mood-entries") ?? "[]");
    if (!Array.isArray(saved) || !saved.every((entry) =>
      entry !== null && typeof entry === "object" &&
      typeof entry.id === "string" &&
      Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= moods.length &&
      typeof entry.createdAt === "string" && !Number.isNaN(Date.parse(entry.createdAt))
    )) throw new Error("Invalid mood entries");
    return saved as MoodEntry[];
  } catch {
    return [];
  }
}

export function saveMoodEntries(entries: MoodEntry[]) {
  try {
    localStorage.setItem("mood-entries", JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function moodForRating(rating: number) {
  return moods[Math.max(1, Math.min(moods.length, Math.round(rating))) - 1];
}

export function sameMinute(first: string, second: string) {
  return Math.floor(Date.parse(first) / 60_000) === Math.floor(Date.parse(second) / 60_000);
}

export function upsertMoodEntry(entries: MoodEntry[], entry: MoodEntry) {
  const existing = entries.find((item) => sameMinute(item.createdAt, entry.createdAt));
  return [
    ...entries.filter((item) => !sameMinute(item.createdAt, entry.createdAt)),
    { ...entry, id: existing?.id ?? entry.id },
  ];
}

export function dayEntries(entries: MoodEntry[], dateKey: string) {
  return entries
    .filter((entry) => localDate(new Date(entry.createdAt)) === dateKey)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function averageRating(entries: MoodEntry[]) {
  return entries.length
    ? entries.reduce((total, entry) => total + entry.rating, 0) / entries.length
    : null;
}

export function chartPoints(entries: MoodEntry[], period: Period, dateKey: string, now = new Date()) {
  if (period === "day") {
    return dayEntries(entries, dateKey).map((entry) => ({
      label: `${new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${moodForRating(entry.rating).emoji}`,
      rating: entry.rating,
      count: 1,
    }));
  }

  const today = localDate(now);
  const month = today.slice(0, 7);
  const lastMonth = localDate(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7);
  const selected = entries.filter((entry) => localDate(new Date(entry.createdAt)).startsWith(period === "this-month" ? month : lastMonth));

  const byDay = new Map<string, MoodEntry[]>();
  for (const entry of selected) {
    const day = localDate(new Date(entry.createdAt));
    byDay.set(day, [...(byDay.get(day) ?? []), entry]);
  }
  return [...byDay]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, dayMoods]) => {
      const rating = averageRating(dayMoods) ?? 0;
      return {
        label: `${Number(day.slice(8))} ${moodForRating(rating).emoji}`,
        rating: Number(rating.toFixed(2)),
        count: dayMoods.length,
      };
    });
}
