import { expect, test } from "bun:test";
import { chartPoints, dayEntries, moodForRating, sameMinute, type MoodEntry } from "../src/models/mood";

const now = new Date(2026, 9, 29, 18, 30);
const entries: MoodEntry[] = [
  { id: "1", rating: 1, createdAt: new Date(2026, 9, 29, 9).toISOString() },
  { id: "2", rating: 4, createdAt: new Date(2026, 9, 29, 17).toISOString() },
  { id: "3", rating: 5, createdAt: new Date(2026, 9, 28, 12).toISOString() },
  { id: "4", rating: 2, createdAt: new Date(2026, 8, 30, 12).toISOString() },
];

test("the selected day keeps multiple entries per day in time order", () => {
  expect(chartPoints(entries, "day", "2026-10-29", now).map((point) => point.rating)).toEqual([1, 4]);
});

test("this month averages each day and includes its entry count", () => {
  const points = chartPoints(entries, "this-month", "2026-10-29", now);
  expect(points.map((point) => point.rating)).toEqual([5, 2.5]);
  expect(points[1].count).toBe(2);
  expect(points[1].label).toContain("😰");
});

test("last month excludes the current month", () => {
  expect(chartPoints(entries, "last-month", "2026-10-29", now).map((point) => point.rating)).toEqual([2]);
});

test("entries can be filtered for a selected day", () => {
  expect(dayEntries(entries, "2026-10-29").map((entry) => entry.id)).toEqual(["1", "2"]);
});

test("two timestamps in the same minute count as duplicates", () => {
  expect(sameMinute("2026-10-29T09:00:10.000Z", "2026-10-29T09:00:59.000Z")).toBe(true);
  expect(sameMinute("2026-10-29T09:00:59.000Z", "2026-10-29T09:01:00.000Z")).toBe(false);
});

test("the mood scale has 10 steps", () => {
  expect(moodForRating(1).label).toBe("Angry");
  expect(moodForRating(10).label).toBe("Excited");
  expect(moodForRating(11).label).toBe("Excited");
});
