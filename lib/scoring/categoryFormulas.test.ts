import { describe, expect, it } from "vitest";

import type { ScoringInput } from "../types/assessment";
import { automationRatio, technologyRatio } from "./categoryFormulas";

const baseCompanyProfile = {
  industry: "Other",
  employeeBand: "11-50",
  revenueBand: "$1M-$5M",
  businessModel: "SaaS",
  leadershipGoals: [],
  blendedHourlyCost: 75,
};

describe("technologyRatio (size-normalized, ENG-03)", () => {
  it("gives full systems-coverage credit to a '1-10'-band company at its baseline (3 systems)", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "1-10" },
      techStack: { systems: ["CRM", "ERP", "HRMS"], apiMaturity: "Legacy" },
    };

    expect(technologyRatio(input)).toBeCloseTo(0.5, 5);
  });

  it("gives only partial credit to a '200+'-band company with the same 3 systems", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "200+" },
      techStack: { systems: ["CRM", "ERP", "HRMS"], apiMaturity: "Legacy" },
    };

    expect(technologyRatio(input)).toBeCloseTo(0.5 * (3 / 8), 5);
  });

  it("caps systemsRatio at 1.0 even when systems selected exceed the band's baseline", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "1-10" },
      techStack: {
        systems: ["CRM", "ERP", "HRMS", "Marketing Automation", "Helpdesk", "BI/Analytics"],
        apiMaturity: "Legacy",
      },
    };

    expect(technologyRatio(input)).toBeCloseTo(0.5, 5);
  });

});

describe("automationRatio (size-normalized, ENG-03)", () => {
  it("gives full credit to a '1-10'-band company at its automation baseline (3 processes)", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "1-10" },
      automation: { processesAutomated: ["Email", "Lead routing", "Invoices"] },
    };

    expect(automationRatio(input)).toBeCloseTo(1, 5);
  });

  it("gives partial credit to a '200+'-band company with the same 3 processes", () => {
    const input: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "200+" },
      automation: { processesAutomated: ["Email", "Lead routing", "Invoices"] },
    };

    expect(automationRatio(input)).toBeCloseTo(3 / 9, 5);
  });
});

describe("employeeBand not in SIZE_BAND_BASELINES (defensive fallback)", () => {
  it("technologyRatio/automationRatio fall back to the pre-existing TOTAL_*_OPTIONS denominators", () => {
    const techInput: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "unknown-band" },
      techStack: { systems: ["CRM", "ERP", "HRMS"], apiMaturity: "Legacy" },
    };
    const automationInput: ScoringInput = {
      companyProfile: { ...baseCompanyProfile, employeeBand: "unknown-band" },
      automation: { processesAutomated: ["Email", "Lead routing", "Invoices"] },
    };

    expect(technologyRatio(techInput)).toBeCloseTo(0.5 * (3 / 8), 5);
    expect(automationRatio(automationInput)).toBeCloseTo(3 / 9, 5);
  });
});
