import type { CategoryKey, CategoryScores, ScoringInput, Departments } from "../types/assessment";
import type { OpportunityItem, CategoryGap } from "../types/report";
import { getAdjustedWeights } from "./industryWeights";

interface InitiativeTemplate {
  initiative: string;
  impact: number;
  effort: number;
  roi: number;
}

const AGENT_INITIATIVES: Record<string, InitiativeTemplate> = {
  Sales: {
    initiative: "Deploy AI Sales Agent for lead qualification, follow-up automation, and pipeline analytics",
    impact: 5, effort: 3, roi: 4,
  },
  Marketing: {
    initiative: "Deploy AI Marketing Agent for content generation, campaign optimization, and SEO automation",
    impact: 4, effort: 3, roi: 4,
  },
  HR: {
    initiative: "Deploy AI HR Agent for resume screening, interview scheduling, and onboarding automation",
    impact: 4, effort: 3, roi: 4,
  },
  Finance: {
    initiative: "Deploy AI Finance Agent for invoice processing, expense approvals, and financial reporting",
    impact: 4, effort: 3, roi: 4,
  },
  Legal: {
    initiative: "Deploy AI Legal Agent for contract review, compliance checks, and document analysis",
    impact: 3, effort: 4, roi: 3,
  },
  Knowledge: {
    initiative: "Deploy AI Knowledge Agent for internal documentation, SOP retrieval, and employee Q&A",
    impact: 4, effort: 2, roi: 5,
  },
  Support: {
    initiative: "Deploy AI Support Agent for chatbot, ticket routing, and SLA-monitored customer service",
    impact: 4, effort: 2, roi: 4,
  },
  Operations: {
    initiative: "Deploy AI Operations Agent for workflow automation, vendor management, and inventory tracking",
    impact: 4, effort: 3, roi: 4,
  },
  "Voice AI": {
    initiative: "Deploy Voice AI for call summaries, meeting transcription, and voice-activated workflows",
    impact: 3, effort: 4, roi: 3,
  },
  "Document AI": {
    initiative: "Deploy Document AI for automated form processing, data extraction, and contract analysis",
    impact: 4, effort: 3, roi: 4,
  },
  "Vision AI": {
    initiative: "Deploy Vision AI for quality inspection, document scanning, and visual data processing",
    impact: 3, effort: 4, roi: 3,
  },
};

const GAP_INITIATIVES: Partial<Record<CategoryKey, InitiativeTemplate>> = {
  businessProcess: {
    initiative: "Process automation and workflow redesign across core departments",
    impact: 5, effort: 4, roi: 4,
  },
  data: {
    initiative: "Data infrastructure upgrade — centralized warehousing with AI-ready governance",
    impact: 4, effort: 4, roi: 4,
  },
  technology: {
    initiative: "Technology stack modernization — systems integration and API-first architecture",
    impact: 4, effort: 4, roi: 3,
  },
  aiAdoption: {
    initiative: "Company-wide AI tool rollout with structured training and departmental champions",
    impact: 3, effort: 2, roi: 4,
  },
  security: {
    initiative: "Security and governance controls implementation — MFA, encryption, compliance framework",
    impact: 4, effort: 3, roi: 3,
  },
  people: {
    initiative: "AI skills and literacy program — hands-on workshops for non-technical employees",
    impact: 3, effort: 2, roi: 4,
  },
};

function computePriority(impact: number, effort: number, roi: number): number {
  const raw = (impact + roi) / effort;
  if (raw >= 2.5) return 5;
  if (raw >= 2.0) return 4;
  if (raw >= 1.5) return 3;
  if (raw >= 1.0) return 2;
  return 1;
}

function hasGap(cat: CategoryKey, scores: CategoryScores, industry: string): boolean {
  const weights = getAdjustedWeights(industry);
  const pct = weights[cat] > 0 ? (scores[cat] ?? 0) / weights[cat] : 1;
  return pct < 0.6;
}

export function generateOpportunityMatrix(
  input: ScoringInput,
  scores: CategoryScores,
): OpportunityItem[] {
  const items: OpportunityItem[] = [];
  const agentTypes = input.agentInterest?.agentTypes ?? [];
  const seenInitiatives = new Set<string>();

  for (const agentType of agentTypes) {
    const template = AGENT_INITIATIVES[agentType];
    if (template && !seenInitiatives.has(template.initiative)) {
      seenInitiatives.add(template.initiative);
      items.push({
        ...template,
        priority: computePriority(template.impact, template.effort, template.roi),
        isFirstMove: false,
      });
    }
  }

  for (const cat of Object.keys(GAP_INITIATIVES) as CategoryKey[]) {
    if (hasGap(cat, scores, input.companyProfile.industry)) {
      const template = GAP_INITIATIVES[cat]!;
      if (!seenInitiatives.has(template.initiative)) {
        seenInitiatives.add(template.initiative);
        items.push({
          ...template,
          priority: computePriority(template.impact, template.effort, template.roi),
          isFirstMove: false,
        });
      }
    }
  }

  const sorted = items.sort((a, b) => b.priority - a.priority || b.impact - a.impact);

  for (let i = 0; i < Math.min(3, sorted.length); i++) {
    sorted[i].isFirstMove = true;
  }

  return sorted.slice(0, 8);
}
