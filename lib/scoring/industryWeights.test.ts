import { describe, expect, it } from "vitest";

import { INDUSTRY_OPTIONS } from "../constants/companyProfile";
import type { CategoryKey } from "../types/assessment";
import { CATEGORY_WEIGHTS } from "./categoryFormulas";
import { getAdjustedWeights, getIndustryMultiplier } from "./industryWeights";

describe("getAdjustedWeights", () => {
  it("sums to exactly 100 (within floating-point tolerance) for every INDUSTRY_OPTIONS value", () => {
    INDUSTRY_OPTIONS.forEach((industry) => {
      const weights = getAdjustedWeights(industry);
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(100, 6);
    });
  });

  it("renormalizes Manufacturing's technology weight to (15*0.9/102)*100", () => {
    // Manufacturing raw adjusted weights: businessProcess 20*1.2=24, technology 15*0.9=13.5,
    // data 10*1.0=10, aiAdoption 10, automation 10, aiAgents 10, security 5*0.9=4.5,
    // people 5, leadership 10, innovation 5. Sum = 102.
    const expected = (15 * 0.9 / 102) * 100;
    expect(getAdjustedWeights("Manufacturing").technology).toBeCloseTo(expected, 5);
  });

  it("returns CATEGORY_WEIGHTS unchanged for Education (not explicitly listed, default 1.0 fallback is a no-op)", () => {
    const weights = getAdjustedWeights("Education");
    (Object.keys(CATEGORY_WEIGHTS) as CategoryKey[]).forEach((key) => {
      expect(weights[key]).toBeCloseTo(CATEGORY_WEIGHTS[key], 6);
    });
  });
});

describe("getIndustryMultiplier", () => {
  it("returns 0.9 for Manufacturing/security", () => {
    expect(getIndustryMultiplier("Manufacturing", "security")).toBe(0.9);
  });

  it("returns 1.0 default fallback for an unrecognized industry", () => {
    expect(getIndustryMultiplier("Not A Real Industry", "businessProcess")).toBe(1.0);
  });
});
