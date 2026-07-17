import { describe, test, expect } from "vitest";
import { getFirstMoves, formatFirstMovesList } from "./firstMoves";
import type { OpportunityItem } from "../types/report";

const items: OpportunityItem[] = [
  {
    initiative: "Quick win — low effort, high impact automation",
    impact: 5, effort: 1, roi: 5, priority: 5, isFirstMove: false,
  },
  {
    initiative: "Medium priority system integration",
    impact: 4, effort: 3, roi: 4, priority: 3, isFirstMove: false,
  },
  {
    initiative: "Important but complex data overhaul",
    impact: 5, effort: 4, roi: 4, priority: 3, isFirstMove: false,
  },
  {
    initiative: "Easy but low-impact training program",
    impact: 2, effort: 1, roi: 3, priority: 4, isFirstMove: false,
  },
  {
    initiative: "High effort, moderate reward compliance project",
    impact: 3, effort: 5, roi: 2, priority: 2, isFirstMove: false,
  },
];

describe("getFirstMoves", () => {
  test("returns top 3 items sorted by (impact+roi)/effort", () => {
    const moves = getFirstMoves(items);
    expect(moves).toHaveLength(3);
    expect(moves[0].initiative).toContain("Quick win");
    expect(moves[0].isFirstMove).toBe(true);
  });

  test("handles fewer than 3 items", () => {
    const few = items.slice(0, 2);
    const moves = getFirstMoves(few);
    expect(moves).toHaveLength(2);
  });

  test("handles empty input", () => {
    const moves = getFirstMoves([]);
    expect(moves).toHaveLength(0);
  });

  test("highest (impact+roi)/effort ranks first", () => {
    const moves = getFirstMoves(items);
    const scores = moves.map((m) => (m.impact + m.roi) / m.effort);
    expect(scores[0]).toBeGreaterThanOrEqual(scores[1]);
    expect(scores[1]).toBeGreaterThanOrEqual(scores[2]);
  });
});

describe("formatFirstMovesList", () => {
  test("joins initiatives with semicolons", () => {
    const moves = getFirstMoves(items);
    const formatted = formatFirstMovesList(moves);
    expect(formatted).toContain(";");
    expect(formatted.split(";")).toHaveLength(3);
  });

  test("returns empty string for empty list", () => {
    expect(formatFirstMovesList([])).toBe("");
  });
});
