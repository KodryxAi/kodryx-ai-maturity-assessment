import { describe, test, expect } from "vitest";
import { assessRisk } from "./risk";

describe("assessRisk", () => {
  test("all Low when scores are high", () => {
    const scores = {
      businessProcess: 18, technology: 14, data: 9, aiAdoption: 9,
      automation: 9, aiAgents: 9, security: 4.5, people: 4.5,
      leadership: 9, innovation: 4.5,
    };
    const risks = assessRisk(scores, 90, "Other");
    expect(risks.technical).toBe("Low");
    expect(risks.business).toBe("Low");
    expect(risks.security).toBe("Low");
    expect(risks.budget).toBe("Low");
  });

  test("all High when scores are very low", () => {
    const scores = {
      businessProcess: 2, technology: 1, data: 1, aiAdoption: 1,
      automation: 1, aiAgents: 1, security: 0.5, people: 0.5,
      leadership: 1, innovation: 0.5,
    };
    const risks = assessRisk(scores, 10, "Other");
    expect(risks.technical).toBe("High");
    expect(risks.business).toBe("High");
    expect(risks.security).toBe("High");
    expect(risks.adoption).toBe("High");
    expect(risks.budget).toBe("High");
  });

  test("Medium when scores are in middle range", () => {
    const scores = {
      businessProcess: 10, technology: 7, data: 5, aiAdoption: 5,
      automation: 5, aiAgents: 5, security: 3, people: 3,
      leadership: 5, innovation: 2.5,
    };
    const risks = assessRisk(scores, 50, "Other");
    expect(risks.technical).toBe("Medium");
    expect(risks.business).toBe("Medium");
  });

  test("operational risk maps to automation category", () => {
    const lowScores = {
      businessProcess: 18, technology: 14, data: 9, aiAdoption: 9,
      automation: 1, aiAgents: 9, security: 4.5, people: 4.5,
      leadership: 9, innovation: 4.5,
    };
    const risks = assessRisk(lowScores, 90, "Other");
    expect(risks.operational).toBe("High");
  });

  test("compliance risk mirrors security risk (same category)", () => {
    const lowSecurity = {
      businessProcess: 15, technology: 12, data: 8, aiAdoption: 8,
      automation: 8, aiAgents: 8, security: 1, people: 4,
      leadership: 8, innovation: 4,
    };
    const risks = assessRisk(lowSecurity, 80, "Other");
    expect(risks.security).toBe("High");
    expect(risks.compliance).toBe("High");
  });

  test("returns all 7 risk types", () => {
    const scores = {
      businessProcess: 12, technology: 10, data: 6, aiAdoption: 6,
      automation: 6, aiAgents: 6, security: 3, people: 3,
      leadership: 6, innovation: 3,
    };
    const risks = assessRisk(scores, 60, "Other");
    const keys = Object.keys(risks);
    expect(keys).toHaveLength(7);
    expect(keys.sort()).toEqual([
      "adoption", "budget", "business", "compliance",
      "operational", "security", "technical",
    ]);
  });
});
