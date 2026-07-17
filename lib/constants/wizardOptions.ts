// Option lists for wizard Steps 2-9 (Business Process, Technology, Data
// Readiness, AI Adoption, Automation, Agent Interest, Security, Employee
// Readiness). String values AND array order are load-bearing — they must
// match the denominators/level orders hardcoded in
// lib/scoring/categoryFormulas.ts exactly (see that file's header comment).

import type { Departments } from "../types/assessment";

export const SYSTEMS_OPTIONS = [
  "CRM",
  "ERP",
  "HRMS",
  "Accounting",
  "Cloud",
  "Document Storage",
  "Communication",
  "Automation Tools",
] as const;

/** Order is load-bearing — must match API_MATURITY_LEVELS in categoryFormulas.ts exactly. */
export const API_MATURITY_OPTIONS = [
  "Legacy",
  "Basic",
  "Modern",
  "Enterprise",
] as const;

export const AI_TOOLS_OPTIONS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
  "Perplexity",
  "Cursor",
  "GitHub Copilot",
  "AI Meeting Assistant",
  "AI Chatbot",
  "AI Coding",
] as const;

/** Order is load-bearing — must match AI_ADOPTION_FREQUENCY_LEVELS in categoryFormulas.ts exactly. */
export const AI_ADOPTION_FREQUENCY_OPTIONS = [
  "Never",
  "Weekly",
  "Daily",
  "Company-wide",
] as const;

export const AUTOMATION_PROCESS_OPTIONS = [
  "Email",
  "Lead routing",
  "Invoices",
  "Purchase approvals",
  "Onboarding",
  "Reporting",
  "Notifications",
  "Scheduling",
  "Customer comms",
] as const;

export const AGENT_TYPE_OPTIONS = [
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Legal",
  "Knowledge",
  "Support",
  "Operations",
  "Voice AI",
  "Document AI",
  "Vision AI",
] as const;

export const SECURITY_CHECKLIST_OPTIONS = [
  "MFA",
  "SSO",
  "Backups",
  "Data Encryption",
  "GDPR",
  "HIPAA",
  "ISO",
  "Audit Logs",
  "AI Governance",
  "Prompt Security",
  "Data Privacy",
] as const;

export interface DepartmentConfigEntry {
  key: keyof Departments;
  label: string;
  capabilities: readonly string[];
}

export const DEPARTMENT_CONFIG: readonly DepartmentConfigEntry[] = [
  {
    key: "sales",
    label: "Sales",
    capabilities: [
      "CRM",
      "Proposal Creation",
      "Sales Forecasting",
      "Follow-up Automation",
      "Sales Analytics",
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    capabilities: [
      "Social Media",
      "Content Generation",
      "SEO",
      "Email Marketing",
      "Campaign Analytics",
    ],
  },
  {
    key: "hr",
    label: "HR",
    capabilities: [
      "Recruitment",
      "Resume Screening",
      "Payroll",
      "Employee Onboarding",
      "Performance Reviews",
    ],
  },
  {
    key: "finance",
    label: "Finance",
    capabilities: [
      "Invoice Processing",
      "Expense Approvals",
      "Financial Reports",
      "Collections",
      "Budget Planning",
    ],
  },
  {
    key: "operations",
    label: "Operations",
    capabilities: [
      "SOP Documentation",
      "Workflow Automation",
      "Vendor Management",
      "Inventory Management",
      "Compliance",
    ],
  },
  {
    key: "support",
    label: "Customer Support",
    capabilities: [
      "Helpdesk",
      "Email Support",
      "Chatbot",
      "Knowledge Base",
      "SLA Monitoring",
    ],
  },
] as const;
