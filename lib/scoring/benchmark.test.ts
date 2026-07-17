import { describe, test, expect } from "vitest";
import { getBenchmark } from "./benchmark";

describe("getBenchmark", () => {
  test("returns SaaS / Technology benchmarks", () => {
    const b = getBenchmark("SaaS / Technology");
    expect(b.industryAverage).toBe(52);
    expect(b.topQuartile).toBe(78);
  });

  test("returns Manufacturing benchmarks", () => {
    const b = getBenchmark("Manufacturing");
    expect(b.industryAverage).toBe(42);
    expect(b.topQuartile).toBe(68);
  });

  test("falls back to Other for unknown industry", () => {
    const b = getBenchmark("Aerospace");
    expect(b.industryAverage).toBe(40);
    expect(b.topQuartile).toBe(65);
  });

  test("every known industry has valid benchmarks (0-100 range)", () => {
    const industries = [
      "Manufacturing", "SaaS / Technology", "Healthcare", "Retail",
      "Financial Services", "Professional Services", "Education", "Other",
    ];
    for (const ind of industries) {
      const b = getBenchmark(ind);
      expect(b.industryAverage).toBeGreaterThan(0);
      expect(b.industryAverage).toBeLessThan(100);
      expect(b.topQuartile).toBeGreaterThan(b.industryAverage);
      expect(b.topQuartile).toBeLessThanOrEqual(100);
    }
  });
});
