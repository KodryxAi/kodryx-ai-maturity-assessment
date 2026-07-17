import { describe, expect, it } from "vitest";

import type { ScoringInput } from "../types/assessment";
import {
  computeDataCompleteness,
  TOTAL_OPTIONAL_CHECKLIST_ITEMS,
} from "./completeness";

const baseCompanyProfile: ScoringInput["companyProfile"] = {
  industry: "Other",
  employeeBand: "1-10",
  revenueBand: "Under $1M",
  businessModel: "B2B",
  leadershipGoals: [],
  blendedHourlyCost: 50,
};

describe("TOTAL_OPTIONAL_CHECKLIST_ITEMS", () => {
  it("equals exactly 68 (30 department capabilities + 8 systems + 10 AI tools + 9 automation + 11 security)", () => {
    expect(TOTAL_OPTIONAL_CHECKLIST_ITEMS).toBe(68);
  });
});

describe("computeDataCompleteness", () => {
  it('returns "thin" when only 20 of 68 optional items are touched', () => {
    const input: ScoringInput = {
      companyProfile: baseCompanyProfile,
      departments: {
        sales: { rating: 3, capabilities: ["CRM", "Proposal Creation"] },
        marketing: { rating: 3, capabilities: ["Social Media", "Content Generation"] },
        hr: { rating: 3, capabilities: ["Recruitment", "Resume Screening"] },
        finance: { rating: 3, capabilities: ["Invoice Processing", "Expense Approvals"] },
        operations: { rating: 3, capabilities: ["SOP Documentation", "Workflow Automation"] },
        support: { rating: 3, capabilities: ["Helpdesk", "Email Support"] },
      },
      techStack: { systems: ["CRM", "ERP"], apiMaturity: "Basic" },
      aiAdoption: { toolsInUse: ["ChatGPT", "Claude"], frequency: "Weekly" },
      automation: { processesAutomated: ["Email", "Lead routing"] },
      security: { checklist: ["MFA", "SSO"] },
    };

    // 12 (departments, 2 each) + 2 + 2 + 2 + 2 = 20; 20/68 ≈ 0.294 < 0.5
    expect(computeDataCompleteness(input)).toBe("thin");
  });

  it('returns "complete" when 38 of 68 optional items are touched', () => {
    const input: ScoringInput = {
      companyProfile: baseCompanyProfile,
      departments: {
        sales: {
          rating: 3,
          capabilities: [
            "CRM",
            "Proposal Creation",
            "Sales Forecasting",
            "Follow-up Automation",
            "Sales Analytics",
          ],
        },
        marketing: {
          rating: 3,
          capabilities: [
            "Social Media",
            "Content Generation",
            "SEO",
            "Email Marketing",
            "Campaign Analytics",
          ],
        },
        hr: {
          rating: 3,
          capabilities: [
            "Recruitment",
            "Resume Screening",
            "Payroll",
            "Employee Onboarding",
            "Performance Reviews",
          ],
        },
        finance: {
          rating: 3,
          capabilities: [
            "Invoice Processing",
            "Expense Approvals",
            "Financial Reports",
            "Collections",
            "Budget Planning",
          ],
        },
        operations: {
          rating: 3,
          capabilities: [
            "SOP Documentation",
            "Workflow Automation",
            "Vendor Management",
            "Inventory Management",
            "Compliance",
          ],
        },
        support: {
          rating: 3,
          capabilities: [
            "Helpdesk",
            "Email Support",
            "Chatbot",
            "Knowledge Base",
            "SLA Monitoring",
          ],
        },
      },
      techStack: { systems: ["CRM", "ERP"], apiMaturity: "Basic" },
      aiAdoption: { toolsInUse: ["ChatGPT", "Claude"], frequency: "Weekly" },
      automation: { processesAutomated: ["Email", "Lead routing"] },
      security: { checklist: ["MFA", "SSO"] },
    };

    // 30 (departments, 5 each) + 2 + 2 + 2 + 2 = 38; 38/68 ≈ 0.559 >= 0.5
    expect(computeDataCompleteness(input)).toBe("complete");
  });

  it('returns "thin" when departments/techStack/aiAdoption/automation/security are all undefined', () => {
    const input: ScoringInput = {
      companyProfile: baseCompanyProfile,
    };

    expect(computeDataCompleteness(input)).toBe("thin");
  });
});
