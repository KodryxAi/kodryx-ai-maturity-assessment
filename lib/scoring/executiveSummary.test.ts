import { describe, test, expect } from "vitest";
import { generateExecutiveSummary } from "./executiveSummary";
import type { ScoringInput } from "../types/assessment";
import type { SwotOutput, RiskOutput, RoiOutput } from "../types/report";

function baseInput(): ScoringInput {
  return {
    companyProfile: {
      industry: "SaaS / Technology",
      employeeBand: "11-50",
      revenueBand: "$5M-$20M",
      businessModel: "B2B",
      leadershipGoals: ["Increase Revenue"],
      blendedHourlyCost: 75,
    },
  };
}

const COMPANY = "Acme Corp";

const baseSwot: SwotOutput = {
  strengths: ["Strong technology foundation with integrated systems."],
  weaknesses: ["Manual business processes in Finance and HR."],
  opportunities: ["Automate Finance workflows."],
  threats: ["Competitors are adopting AI faster."],
};

const baseRisk: RiskOutput = {
  technical: "Low", business: "Medium", security: "High",
  operational: "Medium", compliance: "High", adoption: "Medium",
  budget: "Low",
};

const baseRoi: RoiOutput = {
  assumptions: { hourlyCost: 75, workWeeksPerYear: 48, hoursPerWeek: 40 },
  byDepartment: [],
  total: {
    hoursSavedLow: 2000, hoursSavedMid: 4000, hoursSavedHigh: 6000,
    costSavingsLow: 150000, costSavingsMid: 300000, costSavingsHigh: 450000,
    investment: 60000, roiPercentLow: 150, roiPercentMid: 400,
    roiPercentHigh: 650, paybackMonthsMid: 3,
  },
};

describe("generateExecutiveSummary", () => {
  test("includes company name and stage", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 3 — AI Exploring", 65, 52,
      baseSwot, baseRisk, baseRoi,
      [{ initiative: "Deploy AI Sales Agent", impact: 5, effort: 3, roi: 4, priority: 5, isFirstMove: true }],
    );
    expect(summary).toContain("Acme Corp");
    expect(summary).toContain("Level 3");
    expect(summary).toContain("65/100");
  });

  test("includes benchmark comparison (above average)", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 4 — AI Automation", 72, 52,
      baseSwot, baseRisk, baseRoi, [],
    );
    expect(summary).toContain("above the SaaS / Technology industry average");
  });

  test("includes benchmark comparison (below average)", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 2 — AI Curious", 30, 52,
      baseSwot, baseRisk, baseRoi, [],
    );
    expect(summary).toContain("below the SaaS / Technology industry average");
  });

  test("includes high risks", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 3 — AI Exploring", 50, 40,
      baseSwot, baseRisk, baseRoi, [],
    );
    expect(summary).toContain("security");
    expect(summary).toContain("compliance");
  });

  test("includes ROI and payback", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 3 — AI Exploring", 50, 40,
      baseSwot, baseRisk, baseRoi,
      [{ initiative: "Deploy AI Agent", impact: 5, effort: 3, roi: 4, priority: 5, isFirstMove: true }],
    );
    expect(summary).toContain("400%");
    expect(summary).toContain("3 months");
    expect(summary).toContain("60,000");
  });

  test("handles no first moves gracefully", () => {
    const summary = generateExecutiveSummary(
      COMPANY, baseInput(), "Level 1 — AI Unaware", 10, 40,
      { strengths: [], weaknesses: [], opportunities: [], threats: baseSwot.threats },
      { ...baseRisk, security: "Medium", compliance: "Medium" },
      { ...baseRoi, total: { ...baseRoi.total, roiPercentMid: 0, paybackMonthsMid: 99 } },
      [],
    );
    expect(summary).toContain("no specific initiatives");
    expect(summary).toContain("no critical risks");
  });
});
