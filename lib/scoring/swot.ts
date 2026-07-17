import type { CategoryKey, CategoryScores, ScoringInput } from "../types/assessment";
import type { SwotOutput, CategoryGap } from "../types/report";
import { getAdjustedWeights } from "./industryWeights";
import { DEPARTMENT_CONFIG } from "../constants/wizardOptions";

const DEPT_LABELS: Record<string, string> = {};
for (const d of DEPARTMENT_CONFIG) {
  DEPT_LABELS[d.key] = d.label;
}

function computeCategoryGaps(
  scores: CategoryScores,
  industry: string,
): CategoryGap[] {
  const adjustedWeights = getAdjustedWeights(industry);
  const gaps: CategoryGap[] = [];

  for (const key of Object.keys(adjustedWeights) as CategoryKey[]) {
    const weight = adjustedWeights[key];
    const score = scores[key] ?? 0;
    const pctOfMax = weight > 0 ? Math.min(1, score / weight) : 1;
    const gapScore = weight * (1 - pctOfMax);
    gaps.push({ key, percentOfMax: pctOfMax, adjustedWeight: weight, score, gapScore });
  }

  gaps.sort((a, b) => b.gapScore - a.gapScore);
  return gaps;
}

function generateStrengths(
  gaps: CategoryGap[],
  input: ScoringInput,
): string[] {
  const strong = gaps.filter((g) => g.percentOfMax >= 0.8);
  const bullets: string[] = [];

  for (const g of strong) {
    const bullet = strengthBullet(g.key, input);
    if (bullet) bullets.push(bullet);
  }

  return bullets.slice(0, 5);
}

function generateWeaknesses(
  gaps: CategoryGap[],
  input: ScoringInput,
): string[] {
  const weak = gaps.filter((g) => g.percentOfMax < 0.4);
  const bullets: string[] = [];

  for (const g of weak) {
    const bullet = weaknessBullet(g.key, input);
    if (bullet) bullets.push(bullet);
  }

  return bullets.slice(0, 5);
}

function generateThreats(
  gaps: CategoryGap[],
  totalScore: number,
): string[] {
  const threats: string[] = [
    "Competitors are adopting AI faster, creating market share risk within 12-18 months.",
    "Rising operational costs without automation will continue to erode margins year over year.",
  ];

  const securityGap = gaps.find((g) => g.key === "security");
  if (securityGap && securityGap.percentOfMax < 0.5) {
    threats.push(
      "Data privacy and security gaps expose the business to regulatory, reputational, and breach risk.",
    );
  }

  const peopleGap = gaps.find((g) => g.key === "people");
  if (peopleGap && peopleGap.percentOfMax < 0.5) {
    threats.push(
      "Low employee AI readiness may create internal resistance to process changes and slow adoption.",
    );
  }

  if (totalScore < 40) {
    threats.push(
      "Lagging AI maturity risks permanent competitive disadvantage as AI-native competitors enter the market.",
    );
  }

  return threats.slice(0, 5);
}

function generateOpportunities(
  gaps: CategoryGap[],
  input: ScoringInput,
): string[] {
  const opportunities: string[] = [];
  const agentTypes = input.agentInterest?.agentTypes ?? [];

  if (agentTypes.length > 0) {
    const named = agentTypes.slice(0, 3).join(", ");
    opportunities.push(
      `High interest in AI agents (${named}) signals readiness to deploy domain-specific AI — prioritize agent deployment in lowest-scoring areas for maximum impact.`,
    );
  }

  for (const g of gaps.filter((g2) => g2.percentOfMax < 0.6)) {
    if (opportunities.length >= 5) break;
    const op = opportunityBullet(g.key, input);
    if (op) opportunities.push(op);
  }

  return opportunities.slice(0, 5);
}

function strengthBullet(cat: CategoryKey, input: ScoringInput): string | null {
  const deps = input.departments;
  const tech = input.techStack;
  const data = input.dataReadiness;
  const ai = input.aiAdoption;
  const auto = input.automation;
  const sec = input.security;
  const emp = input.employeeReadiness;
  const cp = input.companyProfile;

  switch (cat) {
    case "businessProcess": {
      if (!deps) return "Business processes show mature, well-documented operations across departments.";
      const strongDep = Object.entries(deps)
        .filter(([, d]) => d.rating >= 4)
        .map(([key]) => DEPT_LABELS[key] ?? key);
      if (strongDep.length === 0) return null;
      return `${strongDep.slice(0, 3).join(", ")} operations are mature (4+/5) with established, repeatable processes.`;
    }
    case "technology": {
      if (!tech) return "Technology infrastructure supports modern, integrated workflows.";
      const sysCount = tech.systems.length;
      const apiLabel = tech.apiMaturity;
      return `Solid technology foundation — ${sysCount}/8 systems integrated with ${apiLabel} API infrastructure, supporting data flow across the business.`;
    }
    case "data": {
      if (!data) return "Data practices support reliable, accessible business intelligence.";
      const dims = Object.entries(data) as [string, number][];
      const high = dims.filter(([, v]) => v >= 4).map(([k]) => k);
      if (high.length === 0) return null;
      return `Strong data foundation — ${high.slice(0, 2).join(", ")} practices are well-established, enabling data-driven decisions.`;
    }
    case "aiAdoption": {
      if (!ai) return "AI adoption is underway with tools integrated into daily workflows.";
      const toolCount = ai.toolsInUse.length;
      return `${toolCount}/10 AI tools in active use with ${ai.frequency.toLowerCase()} usage — AI is embedded in routine work.`;
    }
    case "automation": {
      if (!auto) return "Automation is reducing manual effort across key processes.";
      const count = auto.processesAutomated.length;
      return `${count}/9 business processes automated, reducing manual handoffs and error rates.`;
    }
    case "security": {
      if (!sec) return "Security and governance controls are established.";
      const count = sec.checklist.length;
      return `${count}/11 security and governance controls implemented, protecting data and operations.`;
    }
    case "people": {
      if (!emp) return "Workforce shows readiness for AI-augmented work.";
      const dims: [string, number][] = [
        ["AI Skills", emp.aiSkills],
        ["Training", emp.training],
        ["Change Readiness", emp.changeReadiness],
      ];
      const high = dims.filter(([, v]) => v >= 4).map(([k]) => k);
      if (high.length === 0) return null;
      return `${high.join(", ")} ratings are strong (4+/5) — team is prepared for AI-driven transformation.`;
    }
    case "leadership": {
      const goals = cp.leadershipGoals.length;
      const support = emp?.leadershipSupport ?? 3;
      return `Leadership is engaged with ${goals} strategic AI-aligned goals and ${support}/5 leadership support rating.`;
    }
    case "innovation": {
      const culture = emp?.innovationCulture ?? 3;
      return `Innovation culture rated ${culture}/5 — the organization actively encourages experimentation and new ideas.`;
    }
    case "aiAgents":
      return "AI agent readiness is high, with strong automation and AI adoption foundations enabling agent deployment.";
    default:
      return null;
  }
}

function weaknessBullet(cat: CategoryKey, input: ScoringInput): string | null {
  const deps = input.departments;
  const tech = input.techStack;
  const data = input.dataReadiness;
  const ai = input.aiAdoption;
  const auto = input.automation;
  const sec = input.security;
  const emp = input.employeeReadiness;
  const cp = input.companyProfile;

  switch (cat) {
    case "businessProcess": {
      if (!deps) return "Business processes lack formal documentation and repeatable workflows — operations run on tribal knowledge.";
      const weakDep = Object.entries(deps)
        .filter(([, d]) => d.rating <= 2)
        .map(([key, d]) => {
          const label = DEPT_LABELS[key] ?? key;
          const missing = d.capabilities.length < 3
            ? d.capabilities.length === 0
              ? "no capabilities automated"
              : `only ${d.capabilities.length} capabilities tracked`
            : "";
          return missing ? `${label} (${d.rating}/5 — ${missing})` : `${label} (${d.rating}/5)`;
        });
      if (weakDep.length === 0) return null;
      return `${weakDep.slice(0, 3).join("; ")} — manual processes slow throughput and create error-prone handoffs.`;
    }
    case "technology": {
      if (!tech) return "Technology infrastructure is minimal — core business systems are not yet integrated.";
      const sysCount = tech.systems.length;
      const apiLabel = tech.apiMaturity;
      const missingSys = sysCount < 4 ? `only ${sysCount} systems connected` : "";
      const lowApi = apiLabel === "Legacy" || apiLabel === "Basic"
        ? `with ${apiLabel} API capability`
        : "";
      const detail = [missingSys, lowApi].filter(Boolean).join("; ");
      return `Limited technology stack — ${detail} — systems are siloed and data doesn't flow across departments.`;
    }
    case "data": {
      if (!data) return "Data practices are informal — no structured approach to quality, security, or accessibility.";
      const dims = Object.entries(data) as [string, number][];
      const low = dims.filter(([, v]) => v <= 2).map(([k]) => k);
      if (low.length === 0) return null;
      return `Data ${low.slice(0, 3).join(", ")} practices are weak — inhibiting reliable reporting and AI-ready data pipelines.`;
    }
    case "aiAdoption": {
      if (!ai) return "No AI tools are in active use — the organization has not yet begun AI experimentation.";
      const toolCount = ai.toolsInUse.length;
      if (toolCount === 0) return "No AI tools in use — the organization has zero AI experimentation underway.";
      return `Only ${toolCount}/10 AI tools in use with ${ai.frequency.toLowerCase()} frequency — AI usage is sparse and not yet driving measurable outcomes.`;
    }
    case "automation": {
      if (!auto) return "No processes are automated — all workflows are manual.";
      const count = auto.processesAutomated.length;
      if (count === 0) return "Zero processes automated — every workflow, approval, and notification is manual.";
      return `Only ${count}/9 processes automated — manual handoffs slow every department and introduce human error.`;
    }
    case "security": {
      if (!sec) return "Security and governance controls are not established.";
      const count = sec.checklist.length;
      if (count === 0) return "No security controls documented — the organization has no formal data protection, access control, or governance in place.";
      return `Only ${count}/11 security controls in place — gaps in data protection, access control, or governance create exposure.`;
    }
    case "people": {
      if (!emp) return "Employee AI readiness is untested — no assessment of skills or change readiness exists.";
      const dims: [string, number][] = [
        ["AI Skills", emp.aiSkills],
        ["Training", emp.training],
        ["Change Readiness", emp.changeReadiness],
      ];
      const low = dims.filter(([, v]) => v <= 2).map(([k]) => k);
      if (low.length === 0) return null;
      return `Low ${low.join(", ")} ratings (${low.map((k) => {
        const d = dims.find(([kk]) => kk === k)!;
        return d[1];
      }).join("/")}/5) — the workforce is not yet prepared for AI-augmented roles.`;
    }
    case "leadership": {
      const goals = cp.leadershipGoals.length;
      const support = emp?.leadershipSupport ?? 0;
      return `Leadership alignment is weak — only ${goals} strategic goals tracked with ${support}/5 leadership support for AI initiatives.`;
    }
    case "innovation": {
      const culture = emp?.innovationCulture ?? 0;
      return `Innovation culture rated ${culture}/5 — the organization does not yet have a structured approach to experimentation and learning.`;
    }
    case "aiAgents":
      return "AI agent capability is nascent — automation and AI adoption foundations need strengthening before agents can deliver value.";
    default:
      return null;
  }
}

function opportunityBullet(cat: CategoryKey, input: ScoringInput): string | null {
  const deps = input.departments;

  switch (cat) {
    case "businessProcess": {
      if (!deps) return "Document and standardize core business processes to eliminate tribal knowledge and reduce onboarding time.";
      const weakDep = Object.entries(deps)
        .filter(([, d]) => d.rating <= 2)
        .map(([key]) => DEPT_LABELS[key] ?? key);
      if (weakDep.length === 0) return null;
      return `Automate ${weakDep.slice(0, 2).join(" and ")} workflows to close the maturity gap and free up ${weakDep.length > 1 ? "teams" : "the team"} for higher-value work.`;
    }
    case "technology":
      return "Integrate core business systems (CRM, ERP, HRMS) to enable end-to-end data flow and eliminate manual reconciliation.";
    case "data":
      return "Invest in data quality and accessibility to build a reliable foundation for AI-powered analytics and decision support.";
    case "aiAdoption":
      return "Roll out AI tools across departments with structured training to move from scattered experimentation to coordinated adoption.";
    case "automation":
      return "Automate high-volume manual processes (email, approvals, reporting) to reduce cycle times and free staff for strategic work.";
    case "security":
      return "Implement baseline security controls (MFA, encryption, backups) to protect operations and enable compliant AI deployment.";
    case "people":
      return "Launch an AI skills program with hands-on workshops to build applied capability across the organization, not just in technical roles.";
    case "leadership":
      return "Establish an AI steering committee with explicit ownership and quarterly roadmap reviews to drive accountability.";
    case "innovation":
      return "Create a structured experimentation program with clear guardrails — encourage teams to test AI tools on real problems with fast feedback loops.";
    case "aiAgents":
      return "Pilot a single AI agent in a high-friction workflow to build internal confidence and demonstrate measurable ROI before scaling.";
    default:
      return null;
  }
}

export function generateSwot(
  scores: CategoryScores,
  totalScore: number,
  input: ScoringInput,
): SwotOutput {
  const gaps = computeCategoryGaps(scores, input.companyProfile.industry);

  return {
    strengths: generateStrengths(gaps, input),
    weaknesses: generateWeaknesses(gaps, input),
    opportunities: generateOpportunities(gaps, input),
    threats: generateThreats(gaps, totalScore),
  };
}
