import { describe, test, expect } from "vitest";
import { generateRoadmap } from "./roadmap";

describe("generateRoadmap", () => {
  const highScores = {
    businessProcess: 18, technology: 14, data: 9, aiAdoption: 9,
    automation: 9, aiAgents: 9, security: 4.5, people: 4.5,
    leadership: 9, innovation: 4.5,
  };

  test("returns all 4 roadmap phases with 3 items each", () => {
    const roadmap = generateRoadmap(highScores, "Other");
    expect(roadmap.quickWins).toHaveLength(3);
    expect(roadmap.phase2).toHaveLength(3);
    expect(roadmap.phase3).toHaveLength(3);
    expect(roadmap.phase4).toHaveLength(3);
  });

  test("uses base template when scores are high (no swaps)", () => {
    const roadmap = generateRoadmap(highScores, "Other");
    expect(roadmap.quickWins[0]).toContain("AI readiness workshop");
    expect(roadmap.quickWins[1]).toContain("Deploy a company-wide AI tool");
  });

  test("swaps quick-wins item when security is lowest", () => {
    const lowSecurity = { ...highScores, security: 0.5 };
    const roadmap = generateRoadmap(lowSecurity, "Other");
    expect(roadmap.quickWins[0]).toContain("baseline security controls");
  });

  test("swaps quick-wins item when business process is lowest", () => {
    const lowBP = { ...highScores, businessProcess: 2 };
    const roadmap = generateRoadmap(lowBP, "Other");
    expect(roadmap.quickWins[0]).toContain("Map and document all core business processes");
  });

  test("swaps phase2 item when data is lowest", () => {
    const lowData = { ...highScores, data: 1 };
    const roadmap = generateRoadmap(lowData, "Other");
    expect(roadmap.phase2[0]).toContain("data quality initiative");
  });

  test("swaps at most 2 items across all phases", () => {
    const allLow = {
      businessProcess: 2, technology: 1, data: 1, aiAdoption: 1,
      automation: 1, aiAgents: 1, security: 0.5, people: 0.5,
      leadership: 1, innovation: 0.5,
    };
    const roadmap = generateRoadmap(allLow, "Other");
    const defaultQuickWins = [
      "Conduct an AI readiness workshop with department leads to align on top 3 use cases.",
      "Deploy a company-wide AI tool (e.g., ChatGPT Team or Copilot) with basic usage guidelines.",
      "Identify the single highest-friction manual process and run a 2-week automation pilot.",
    ];

    let swapCount = 0;
    for (let i = 0; i < 3; i++) {
      if (roadmap.quickWins[i] !== defaultQuickWins[i]) swapCount++;
    }
    expect(swapCount).toBeLessThanOrEqual(2);
  });
});
