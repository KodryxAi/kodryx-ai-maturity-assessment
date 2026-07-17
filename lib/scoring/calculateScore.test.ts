import { describe, expect, it } from "vitest";

import { LEADERSHIP_GOALS } from "../constants/companyProfile";
import type { CategoryScores, ScoringInput } from "../types/assessment";
import { calculateCategoryScores, calculateTotalScore } from "./calculateScore";

const baseCompanyProfile = {
  industry: "Other",
  employeeBand: "11-50",
  revenueBand: "$1M-$5M",
  businessModel: "SaaS",
  blendedHourlyCost: 75,
};

describe("calculateCategoryScores", () => {
  it("scores leadership from 3 of 6 selected goals with every other section undefined", () => {
    const input: ScoringInput = {
      companyProfile: {
        ...baseCompanyProfile,
        leadershipGoals: LEADERSHIP_GOALS.slice(0, 3),
      },
    };

    const scores = calculateCategoryScores(input);

    expect(scores.leadership).toBe(2.5);
    (Object.keys(scores) as (keyof CategoryScores)[])
      .filter((key) => key !== "leadership")
      .forEach((key) => {
        expect(scores[key]).toBe(0);
      });
  });

  it("scores leadership as 0 when no goals are selected", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, leadershipGoals: [] },
    };

    const scores = calculateCategoryScores(input);

    expect(scores.leadership).toBe(0);
  });

  it("scores leadership as 5 when all 6 goals are selected", () => {
    const input: ScoringInput = {
      companyProfile: {
        ...baseCompanyProfile,
        leadershipGoals: [...LEADERSHIP_GOALS],
      },
    };

    const scores = calculateCategoryScores(input);

    expect(scores.leadership).toBe(5);
  });
});

describe("calculateTotalScore", () => {
  it("rounds the sum of the 3-of-6-goals category scores to 3", () => {
    const input: ScoringInput = {
      companyProfile: {
        ...baseCompanyProfile,
        leadershipGoals: LEADERSHIP_GOALS.slice(0, 3),
      },
    };
    const scores = calculateCategoryScores(input);

    expect(calculateTotalScore(scores)).toBe(3);
  });

  it("clamps totals to the inclusive 0-100 range", () => {
    const overMax: CategoryScores = {
      businessProcess: 20,
      technology: 15,
      data: 10,
      aiAdoption: 10,
      automation: 10,
      aiAgents: 10,
      security: 5,
      people: 5,
      leadership: 40,
      innovation: 5,
    };
    expect(calculateTotalScore(overMax)).toBe(100);

    const underMin: CategoryScores = {
      businessProcess: -2,
      technology: -2,
      data: -1,
      aiAdoption: -1,
      automation: -1,
      aiAgents: -1,
      security: -1,
      people: -1,
      leadership: 0,
      innovation: 0,
    };
    expect(calculateTotalScore(underMin)).toBe(0);
  });
});

describe("industry-adjusted weights (ENG-02)", () => {
  it("produces a different technology category score for identical techStack/employeeBand when industry differs", () => {
    const sharedTechStack = {
      systems: ["CRM", "ERP", "HRMS"],
      apiMaturity: "Modern",
    };

    const inputManufacturing: ScoringInput = {
      companyProfile: {
        ...baseCompanyProfile,
        industry: "Manufacturing",
        employeeBand: "11-50",
        leadershipGoals: [],
      },
      techStack: sharedTechStack,
    };

    const inputSaas: ScoringInput = {
      companyProfile: {
        ...baseCompanyProfile,
        industry: "SaaS / Technology",
        employeeBand: "11-50",
        leadershipGoals: [],
      },
      techStack: sharedTechStack,
    };

    const manufacturingScores = calculateCategoryScores(inputManufacturing);
    const saasScores = calculateCategoryScores(inputSaas);

    expect(manufacturingScores.technology).not.toBeCloseTo(saasScores.technology, 5);
  });
});
