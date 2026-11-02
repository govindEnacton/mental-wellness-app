import { localDate } from "./date";

export type JournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  tag: string;
};

export const tags = ["Grateful", "Stressful", "Reflective"] as const;

export function loadJournalEntries(): JournalEntry[] {
  try {
    const entries: unknown = JSON.parse(localStorage.getItem("journal-entries") ?? "[]");
    if (!Array.isArray(entries) || !entries.every((entry) =>
      entry !== null && typeof entry === "object" &&
      typeof entry.id === "string" && typeof entry.text === "string" &&
      typeof entry.createdAt === "string" && !Number.isNaN(Date.parse(entry.createdAt)) &&
      (entry.tag === undefined || typeof entry.tag === "string")
    )) throw new Error("Invalid journal entries");
    return entries.map((entry) => ({
      id: entry.id,
      text: entry.text,
      createdAt: entry.createdAt,
      tag: typeof entry.tag === "string" ? entry.tag : "",
    }));
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem("journal-entries", JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

export function journalCreatedAt(dateKey: string, now = new Date()) {
  return new Date(`${dateKey}T${now.toTimeString().slice(0, 8)}`).toISOString();
}

export function journalEntriesOnDate(entries: JournalEntry[], dateKey: string) {
  return entries
    .filter((entry) => localDate(new Date(entry.createdAt)) === dateKey)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
