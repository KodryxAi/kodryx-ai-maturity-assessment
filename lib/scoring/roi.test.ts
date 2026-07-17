import { describe, test, expect } from "vitest";
import { generateRoi } from "./roi";
import type { ScoringInput } from "../types/assessment";

function baseInput(overrides?: Partial<ScoringInput>): ScoringInput {
  return {
    companyProfile: {
      industry: "SaaS / Technology",
      employeeBand: "11-50",
      revenueBand: "$5M-$20M",
      businessModel: "B2B",
      leadershipGoals: ["Increase Revenue"],
      blendedHourlyCost: 75,
    },
    departments: {
      sales: { rating: 3, capabilities: ["CRM"] },
      marketing: { rating: 3, capabilities: [] },
      hr: { rating: 3, capabilities: [] },
      finance: { rating: 3, capabilities: [] },
      operations: { rating: 3, capabilities: [] },
      support: { rating: 3, capabilities: [] },
    },
    ...overrides,
  };
}

const baseScores = {
  businessProcess: 12, technology: 9, data: 6, aiAdoption: 6,
  automation: 6, aiAgents: 6, security: 3, people: 3,
  leadership: 6, innovation: 3,
};

describe("generateRoi", () => {
  test("returns assumptions with user's hourly cost", () => {
    const roi = generateRoi(baseInput(), baseScores);
    expect(roi.assumptions.hourlyCost).toBe(75);
    expect(roi.assumptions.workWeeksPerYear).toBe(48);
    expect(roi.assumptions.hoursPerWeek).toBe(40);
  });

  test("returns all 6 departments in breakdown", () => {
    const roi = generateRoi(baseInput(), baseScores);
    expect(roi.byDepartment).toHaveLength(6);
    const names = roi.byDepartment.map((d) => d.department);
    expect(names).toContain("Sales");
    expect(names).toContain("Marketing");
    expect(names).toContain("HR");
    expect(names).toContain("Finance");
    expect(names).toContain("Operations");
    expect(names).toContain("Customer Support");
  });

  test("Conservative ≤ Expected ≤ Optimistic for each department", () => {
    const roi = generateRoi(baseInput(), baseScores);
    for (const dept of roi.byDepartment) {
      expect(dept.hoursSavedLow).toBeLessThanOrEqual(dept.hoursSavedMid);
      expect(dept.hoursSavedMid).toBeLessThanOrEqual(dept.hoursSavedHigh);
      expect(dept.costSavingsLow).toBeLessThanOrEqual(dept.costSavingsMid);
      expect(dept.costSavingsMid).toBeLessThanOrEqual(dept.costSavingsHigh);
    }
  });

  test("total aggregates department values", () => {
    const roi = generateRoi(baseInput(), baseScores);
    const sumLow = roi.byDepartment.reduce((a, d) => a + d.hoursSavedLow, 0);
    const sumMid = roi.byDepartment.reduce((a, d) => a + d.hoursSavedMid, 0);
    const sumHigh = roi.byDepartment.reduce((a, d) => a + d.hoursSavedHigh, 0);
    expect(roi.total.hoursSavedLow).toBe(sumLow);
    expect(roi.total.hoursSavedMid).toBe(sumMid);
    expect(roi.total.hoursSavedHigh).toBe(sumHigh);
  });

  test("investment tier matches employee band", () => {
    const roiSmall = generateRoi(
      baseInput({ companyProfile: { ...baseInput().companyProfile, employeeBand: "1-10" } }),
      baseScores,
    );
    const roiLarge = generateRoi(
      baseInput({ companyProfile: { ...baseInput().companyProfile, employeeBand: "200+" } }),
      baseScores,
    );
    expect(roiSmall.total.investment).toBe(15000);
    expect(roiLarge.total.investment).toBe(500000);
  });

  test("larger company produces more hours saved", () => {
    const roiSmall = generateRoi(
      baseInput({ companyProfile: { ...baseInput().companyProfile, employeeBand: "1-10" } }),
      baseScores,
    );
    const roiLarge = generateRoi(
      baseInput({ companyProfile: { ...baseInput().companyProfile, employeeBand: "200+" } }),
      baseScores,
    );
    expect(roiLarge.total.hoursSavedMid).toBeGreaterThan(roiSmall.total.hoursSavedMid);
  });

  test("different business models produce different department splits", () => {
    const roiB2b = generateRoi(baseInput(), baseScores);
    const roiMfg = generateRoi(
      baseInput({ companyProfile: { ...baseInput().companyProfile, businessModel: "Manufacturing" } }),
      baseScores,
    );
    const b2bOps = roiB2b.byDepartment.find((d) => d.department === "Operations")!;
    const mfgOps = roiMfg.byDepartment.find((d) => d.department === "Operations")!;
    expect(mfgOps.hoursSavedMid).toBeGreaterThan(b2bOps.hoursSavedMid);
  });

  test("roi percent and payback are computed", () => {
    const roi = generateRoi(baseInput(), baseScores);
    expect(roi.total.roiPercentMid).toBeDefined();
    expect(roi.total.paybackMonthsMid).toBeGreaterThan(0);
  });
});
