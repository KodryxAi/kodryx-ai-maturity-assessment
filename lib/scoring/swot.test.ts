import { describe, test, expect } from "vitest";
import { generateSwot } from "./swot";
import type { ScoringInput } from "../types/assessment";

function baseInput(overrides?: Partial<ScoringInput>): ScoringInput {
  return {
    companyProfile: {
      industry: "Other",
      employeeBand: "11-50",
      revenueBand: "$5M-$20M",
      businessModel: "B2B",
      leadershipGoals: ["Increase Revenue", "Reduce Operating Costs"],
      blendedHourlyCost: 60,
    },
    departments: {
      sales: { rating: 4, capabilities: ["CRM", "Proposal Creation", "Sales Forecasting"] },
      marketing: { rating: 1, capabilities: [] },
      hr: { rating: 3, capabilities: ["Recruitment", "Payroll"] },
      finance: { rating: 4, capabilities: ["Invoice Processing", "Financial Reports", "Budget Planning"] },
      operations: { rating: 2, capabilities: ["SOP Documentation"] },
      support: { rating: 3, capabilities: ["Helpdesk", "Knowledge Base"] },
    },
    techStack: {
      systems: ["CRM", "ERP", "HRMS", "Cloud", "Communication"],
      apiMaturity: "Modern",
    },
    dataReadiness: {
      quality: 4, security: 4, accessibility: 5, knowledgeMgmt: 3,
    },
    aiAdoption: {
      toolsInUse: ["ChatGPT", "Claude", "GitHub Copilot"],
      frequency: "Daily",
    },
    automation: {
      processesAutomated: ["Email", "Invoices", "Reporting"],
    },
    agentInterest: {
      agentTypes: ["Sales", "Marketing", "HR"],
    },
    security: {
      checklist: ["MFA", "SSO", "Backups", "Data Encryption", "GDPR"],
    },
    employeeReadiness: {
      aiSkills: 4, training: 3, changeReadiness: 3, leadershipSupport: 5, innovationCulture: 2,
    },
    ...overrides,
  };
}

describe("generateSwot", () => {
  test("returns all 4 quadrants", () => {
    const swot = generateSwot(
      {
        businessProcess: 14, technology: 12, data: 8, aiAdoption: 7,
        automation: 6, aiAgents: 6, security: 4, people: 3,
        leadership: 9, innovation: 2,
      },
      71,
      baseInput(),
    );
    expect(Array.isArray(swot.strengths)).toBe(true);
    expect(Array.isArray(swot.weaknesses)).toBe(true);
    expect(Array.isArray(swot.opportunities)).toBe(true);
    expect(Array.isArray(swot.threats)).toBe(true);
  });

  test("strengths include high-scoring categories", () => {
    const swot = generateSwot(
      {
        businessProcess: 18, technology: 14, data: 9, aiAdoption: 9,
        automation: 9, aiAgents: 9, security: 4.5, people: 4.5,
        leadership: 9, innovation: 4.5,
      },
      90,
      baseInput({
        departments: {
          sales: { rating: 5, capabilities: ["CRM", "Proposal Creation", "Sales Forecasting", "Follow-up Automation", "Sales Analytics"] },
          marketing: { rating: 4, capabilities: ["Social Media", "Content Generation", "SEO"] },
          hr: { rating: 5, capabilities: ["Recruitment", "Resume Screening", "Payroll", "Employee Onboarding", "Performance Reviews"] },
          finance: { rating: 4, capabilities: ["Invoice Processing", "Financial Reports", "Budget Planning"] },
          operations: { rating: 4, capabilities: ["SOP Documentation", "Workflow Automation", "Vendor Management"] },
          support: { rating: 5, capabilities: ["Helpdesk", "Email Support", "Chatbot", "Knowledge Base", "SLA Monitoring"] },
        },
      }),
    );
    expect(swot.strengths.length).toBeGreaterThan(0);
    const all = swot.strengths.join(" ");
    expect(all).toContain("Sales");
    expect(all).toContain("HR");
  });

  test("weaknesses include low-scoring categories with gap-specific text", () => {
    const swot = generateSwot(
      {
        businessProcess: 2, technology: 1, data: 1, aiAdoption: 1,
        automation: 1, aiAgents: 1, security: 0.5, people: 0.5,
        leadership: 1, innovation: 0.5,
      },
      10,
      baseInput({
        departments: {
          sales: { rating: 1, capabilities: [] },
          marketing: { rating: 1, capabilities: [] },
          hr: { rating: 1, capabilities: [] },
          finance: { rating: 1, capabilities: [] },
          operations: { rating: 1, capabilities: [] },
          support: { rating: 1, capabilities: [] },
        },
        techStack: { systems: [], apiMaturity: "Legacy" },
        security: { checklist: ["MFA"] },
        automation: { processesAutomated: [] },
        employeeReadiness: { aiSkills: 1, training: 1, changeReadiness: 1, leadershipSupport: 1, innovationCulture: 1 },
      }),
    );
    expect(swot.weaknesses.length).toBeGreaterThan(0);
  });

  test("weaknesses cap at 5 bullets", () => {
    const swot = generateSwot(
      {
        businessProcess: 2, technology: 1, data: 1, aiAdoption: 1,
        automation: 1, aiAgents: 1, security: 0.5, people: 0.5,
        leadership: 1, innovation: 0.5,
      },
      10,
      baseInput(),
    );
    expect(swot.weaknesses.length).toBeLessThanOrEqual(5);
  });

  test("strengths cap at 5 bullets", () => {
    const swot = generateSwot(
      {
        businessProcess: 19, technology: 14, data: 9, aiAdoption: 9,
        automation: 9, aiAgents: 9, security: 4.5, people: 4.5,
        leadership: 9, innovation: 4.5,
      },
      95,
      baseInput(),
    );
    expect(swot.strengths.length).toBeLessThanOrEqual(5);
  });

  test("threats include static threats", () => {
    const swot = generateSwot(
      {
        businessProcess: 12, technology: 10, data: 6, aiAdoption: 6,
        automation: 6, aiAgents: 6, security: 3, people: 3,
        leadership: 6, innovation: 3,
      },
      60,
      baseInput(),
    );
    expect(swot.threats.some((t) => t.includes("Competitors"))).toBe(true);
    expect(swot.threats.some((t) => t.includes("Rising operational costs"))).toBe(true);
  });

  test("threats include security warning when security is low", () => {
    const swot = generateSwot(
      {
        businessProcess: 12, technology: 10, data: 6, aiAdoption: 6,
        automation: 6, aiAgents: 6, security: 1, people: 3,
        leadership: 6, innovation: 3,
      },
      60,
      baseInput({ security: { checklist: ["MFA"] } }),
    );
    expect(swot.threats.some((t) => t.includes("Data privacy"))).toBe(true);
  });

  test("opportunities include agent interest signal", () => {
    const swot = generateSwot(
      {
        businessProcess: 8, technology: 6, data: 4, aiAdoption: 4,
        automation: 4, aiAgents: 4, security: 2, people: 2,
        leadership: 4, innovation: 2,
      },
      40,
      baseInput({
        agentInterest: { agentTypes: ["Sales", "Marketing", "HR", "Finance", "Knowledge", "Support"] },
      }),
    );
    expect(swot.opportunities.some((o) => o.includes("Sales"))).toBe(true);
  });

  test("weak, low-score submission produces more threats", () => {
    const swot = generateSwot(
      {
        businessProcess: 2, technology: 1, data: 1, aiAdoption: 1,
        automation: 1, aiAgents: 1, security: 0.5, people: 0.5,
        leadership: 1, innovation: 0.5,
      },
      10,
      baseInput(),
    );
    expect(swot.threats.length).toBeGreaterThanOrEqual(3);
  });
});
