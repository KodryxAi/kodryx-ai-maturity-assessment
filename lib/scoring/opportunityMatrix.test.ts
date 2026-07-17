import { describe, test, expect } from "vitest";
import { generateOpportunityMatrix } from "./opportunityMatrix";
import type { ScoringInput } from "../types/assessment";

function baseInput(overrides?: Partial<ScoringInput>): ScoringInput {
  return {
    companyProfile: {
      industry: "Other",
      employeeBand: "11-50",
      revenueBand: "$5M-$20M",
      businessModel: "B2B",
      leadershipGoals: ["Increase Revenue"],
      blendedHourlyCost: 60,
    },
    agentInterest: {
      agentTypes: ["Sales", "Marketing", "Knowledge", "Support"],
    },
    ...overrides,
  };
}

const baseScores = {
  businessProcess: 8, technology: 6, data: 4, aiAdoption: 4,
  automation: 4, aiAgents: 4, security: 3, people: 3,
  leadership: 4, innovation: 2,
};

describe("generateOpportunityMatrix", () => {
  test("returns items for selected agent types", () => {
    const matrix = generateOpportunityMatrix(baseInput(), baseScores);
    const initiatives = matrix.map((i) => i.initiative);
    expect(initiatives.some((i) => i.includes("Sales"))).toBe(true);
    expect(initiatives.some((i) => i.includes("Marketing"))).toBe(true);
    expect(initiatives.some((i) => i.includes("Knowledge"))).toBe(true);
  });

  test("does not include items for unselected agent types", () => {
    const matrix = generateOpportunityMatrix(
      baseInput({ agentInterest: { agentTypes: ["Sales"] } }),
      baseScores,
    );
    const initiatives = matrix.map((i) => i.initiative);
    expect(initiatives.some((i) => i.includes("HR"))).toBe(false);
  });

  test("marks top 3 items as first moves", () => {
    const matrix = generateOpportunityMatrix(baseInput(), baseScores);
    const firstMoves = matrix.filter((i) => i.isFirstMove);
    expect(firstMoves).toHaveLength(3);
  });

  test("each item has numeric impact, effort, roi, priority fields", () => {
    const matrix = generateOpportunityMatrix(baseInput(), baseScores);
    for (const item of matrix) {
      expect(typeof item.impact).toBe("number");
      expect(typeof item.effort).toBe("number");
      expect(typeof item.roi).toBe("number");
      expect(typeof item.priority).toBe("number");
      expect(item.impact).toBeGreaterThanOrEqual(1);
      expect(item.impact).toBeLessThanOrEqual(5);
      expect(item.priority).toBeGreaterThanOrEqual(1);
      expect(item.priority).toBeLessThanOrEqual(5);
    }
  });

  test("capped at 8 items", () => {
    const matrix = generateOpportunityMatrix(
      baseInput({
        agentInterest: {
          agentTypes: [
            "Sales", "Marketing", "HR", "Finance", "Legal",
            "Knowledge", "Support", "Operations", "Voice AI",
            "Document AI", "Vision AI",
          ],
        },
      }),
      baseScores,
    );
    expect(matrix.length).toBeLessThanOrEqual(8);
  });

  test("returns empty array when no agent types selected and no gaps", () => {
    const matrix = generateOpportunityMatrix(
      baseInput({ agentInterest: { agentTypes: [] } }),
      {
        businessProcess: 19, technology: 14, data: 9, aiAdoption: 9,
        automation: 9, aiAgents: 9, security: 4.5, people: 4.5,
        leadership: 9, innovation: 4.5,
      },
    );
    expect(matrix).toHaveLength(0);
  });
});
