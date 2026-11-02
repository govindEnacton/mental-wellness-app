import { expect, test } from "bun:test";
import { monthCells } from "../src/models/calendar";

test("a month grid pads the first weekday and always has six weeks", () => {
  const cells = monthCells(2026, 9);
  expect(cells).toHaveLength(42);
  expect(cells.slice(0, 4)).toEqual([null, null, null, null]);
  expect(cells[4]).toBe(1);
});

test("a leap February keeps all 29 days", () => {
  const days = monthCells(2028, 1).filter((day) => day !== null);
  expect(days).toHaveLength(29);
  expect(days.at(-1)).toBe(29);
});
