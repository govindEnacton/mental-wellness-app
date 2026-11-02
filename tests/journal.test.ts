import { expect, test } from "bun:test";
import { journalEntriesOnDate, type JournalEntry } from "../src/models/journal";

const entries: JournalEntry[] = [
  { id: "1", text: "Morning", createdAt: new Date(2026, 9, 29, 8).toISOString(), tag: "Grateful" },
  { id: "2", text: "Evening", createdAt: new Date(2026, 9, 29, 20).toISOString(), tag: "Reflective" },
  { id: "3", text: "Other day", createdAt: new Date(2026, 9, 28, 12).toISOString(), tag: "Stressful" },
];

test("journal entries are filtered by local day and newest comes first", () => {
  expect(journalEntriesOnDate(entries, "2026-10-29").map((entry) => entry.id)).toEqual(["2", "1"]);
});

test("a day without entries returns an empty list", () => {
  expect(journalEntriesOnDate(entries, "2026-10-27")).toEqual([]);
});
