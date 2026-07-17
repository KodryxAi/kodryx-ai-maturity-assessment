import { describe, expect, it } from "vitest";

import { getStage } from "./stage";

describe("getStage", () => {
  it("returns Level 1 for a score of 0", () => {
    expect(getStage(0)).toEqual({
      level: 1,
      label: "Level 1 — AI Unaware",
      whatThisMeans:
        "AI adoption has not yet begun in any meaningful way across the business — most work is still fully manual.",
      whatsNext:
        "Start with one high-friction manual process and pilot a single AI tool to build internal confidence.",
    });
  });

  it("keeps 20 in Level 1 and rolls 21 over to Level 2", () => {
    expect(getStage(20)).toEqual({
      level: 1,
      label: "Level 1 — AI Unaware",
      whatThisMeans:
        "AI adoption has not yet begun in any meaningful way across the business — most work is still fully manual.",
      whatsNext:
        "Start with one high-friction manual process and pilot a single AI tool to build internal confidence.",
    });
    expect(getStage(21)).toEqual({
      level: 2,
      label: "Level 2 — AI Curious",
      whatThisMeans:
        "The organization is experimenting with individual AI tools, but adoption is scattered and not yet tied to a strategy.",
      whatsNext:
        "Formalize a short list of priority use cases and assign an owner to move from ad-hoc experimentation to a coordinated first project.",
    });
  });

  it("keeps 40 in Level 2 and rolls 41 over to Level 3", () => {
    expect(getStage(40)).toEqual({
      level: 2,
      label: "Level 2 — AI Curious",
      whatThisMeans:
        "The organization is experimenting with individual AI tools, but adoption is scattered and not yet tied to a strategy.",
      whatsNext:
        "Formalize a short list of priority use cases and assign an owner to move from ad-hoc experimentation to a coordinated first project.",
    });
    expect(getStage(41)).toEqual({
      level: 3,
      label: "Level 3 — AI Exploring",
      whatThisMeans:
        "Multiple departments are using AI tools regularly and early automation is in place, but systems and data still aren't well connected.",
      whatsNext:
        "Invest in data readiness and systems integration so AI initiatives can scale beyond isolated pilots.",
    });
  });

  it("keeps 60 in Level 3, brackets Level 4 at 61 and 75, and rolls 76 to Level 5", () => {
    expect(getStage(60)).toEqual({
      level: 3,
      label: "Level 3 — AI Exploring",
      whatThisMeans:
        "Multiple departments are using AI tools regularly and early automation is in place, but systems and data still aren't well connected.",
      whatsNext:
        "Invest in data readiness and systems integration so AI initiatives can scale beyond isolated pilots.",
    });
    expect(getStage(61)).toEqual({
      level: 4,
      label: "Level 4 — AI Automation",
      whatThisMeans:
        "Core processes are automated and AI is embedded in daily workflows across most departments.",
      whatsNext:
        "Shift focus toward AI agents that handle multi-step work end-to-end, not just point-solution automation.",
    });
    expect(getStage(75)).toEqual({
      level: 4,
      label: "Level 4 — AI Automation",
      whatThisMeans:
        "Core processes are automated and AI is embedded in daily workflows across most departments.",
      whatsNext:
        "Shift focus toward AI agents that handle multi-step work end-to-end, not just point-solution automation.",
    });
    expect(getStage(76)).toEqual({
      level: 5,
      label: "Level 5 — AI Optimized",
      whatThisMeans:
        "AI is deeply integrated into operations, data, and decision-making, putting the business ahead of most industry peers.",
      whatsNext:
        "Formalize AI governance and start measuring compounding ROI to defend and extend the lead.",
    });
  });

  it("keeps 90 in Level 5, rolls 91 to Level 6, and keeps 100 in Level 6", () => {
    expect(getStage(90)).toEqual({
      level: 5,
      label: "Level 5 — AI Optimized",
      whatThisMeans:
        "AI is deeply integrated into operations, data, and decision-making, putting the business ahead of most industry peers.",
      whatsNext:
        "Formalize AI governance and start measuring compounding ROI to defend and extend the lead.",
    });
    expect(getStage(91)).toEqual({
      level: 6,
      label: "Level 6 — AI Native",
      whatThisMeans:
        "AI is a default part of how the business operates, with agents and automation driving most routine work end-to-end.",
      whatsNext:
        "Focus on continuous optimization and explore emerging agent capabilities to stay ahead as the frontier moves.",
    });
    expect(getStage(100)).toEqual({
      level: 6,
      label: "Level 6 — AI Native",
      whatThisMeans:
        "AI is a default part of how the business operates, with agents and automation driving most routine work end-to-end.",
      whatsNext:
        "Focus on continuous optimization and explore emerging agent capabilities to stay ahead as the frontier moves.",
    });
  });
});
