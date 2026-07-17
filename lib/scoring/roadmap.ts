import type { CategoryKey, CategoryScores } from "../types/assessment";
import type { RoadmapOutput, CategoryGap } from "../types/report";
import { getAdjustedWeights } from "./industryWeights";

const BASE_TEMPLATE: RoadmapOutput = {
  quickWins: [
    "Conduct an AI readiness workshop with department leads to align on top 3 use cases.",
    "Deploy a company-wide AI tool (e.g., ChatGPT Team or Copilot) with basic usage guidelines.",
    "Identify the single highest-friction manual process and run a 2-week automation pilot.",
  ],
  phase2: [
    "Integrate core business systems (CRM, ERP, HRMS) to create a unified data layer.",
    "Launch an AI skills program — hands-on workshops for non-technical staff in every department.",
    "Automate the top 3 high-volume manual processes identified by department leads.",
  ],
  phase3: [
    "Deploy department-specific AI agents for Sales, HR, and Customer Support workflows.",
    "Build a centralized data warehouse with AI-ready data quality and governance standards.",
    "Implement AI-driven analytics dashboards for real-time operational visibility.",
  ],
  phase4: [
    "Achieve end-to-end AI orchestration — agents handle multi-step workflows across departments.",
    "Formalize AI governance framework with continuous ROI measurement and quarterly reviews.",
    "Explore emerging AI capabilities (voice AI, vision AI, autonomous agents) for competitive advantage.",
  ],
};

function getLowestCategories(
  scores: CategoryScores,
  industry: string,
  count: number,
): CategoryKey[] {
  const adjustedWeights = getAdjustedWeights(industry);
  const gaps: CategoryGap[] = (Object.keys(adjustedWeights) as CategoryKey[]).map((key) => {
    const weight = adjustedWeights[key];
    const score = scores[key] ?? 0;
    const pctOfMax = weight > 0 ? score / weight : 1;
    return {
      key,
      percentOfMax: pctOfMax,
      adjustedWeight: weight,
      score,
      gapScore: weight * (1 - pctOfMax),
    };
  });
  const lowOnly = gaps.filter((g) => g.percentOfMax < 0.5);
  lowOnly.sort((a, b) => b.gapScore - a.gapScore);
  return lowOnly.slice(0, count).map((g) => g.key);
}

const PRIORITY_SWAPS: Partial<Record<CategoryKey, { phase: keyof RoadmapOutput; item: string }>> = {
  security: {
    phase: "quickWins",
    item: "Implement baseline security controls — MFA, data encryption, and access audit logging.",
  },
  businessProcess: {
    phase: "quickWins",
    item: "Map and document all core business processes — identify automation candidates by volume and friction.",
  },
  data: {
    phase: "phase2",
    item: "Launch a data quality initiative — clean, deduplicate, and structure core datasets for AI readiness.",
  },
  technology: {
    phase: "phase2",
    item: "Modernize the technology stack — prioritize systems integration and API upgrades.",
  },
  aiAdoption: {
    phase: "phase2",
    item: "Roll out a structured AI adoption program with tool licenses, training, and departmental champions.",
  },
  automation: {
    phase: "phase3",
    item: "Accelerate automation — target 50%+ of repeatable processes for end-to-end workflow automation.",
  },
  people: {
    phase: "quickWins",
    item: "Launch an AI literacy program — monthly lunch-and-learns with hands-on tool demos for all staff.",
  },
  leadership: {
    phase: "quickWins",
    item: "Establish an AI steering committee with explicit executive ownership and monthly progress reviews.",
  },
  innovation: {
    phase: "phase3",
    item: "Create an AI innovation fund — ring-fence budget and time for cross-functional experimentation teams.",
  },
};

export function generateRoadmap(
  scores: CategoryScores,
  industry: string,
): RoadmapOutput {
  const output: RoadmapOutput = {
    quickWins: [...BASE_TEMPLATE.quickWins],
    phase2: [...BASE_TEMPLATE.phase2],
    phase3: [...BASE_TEMPLATE.phase3],
    phase4: [...BASE_TEMPLATE.phase4],
  };

  const lowest = getLowestCategories(scores, industry, 2);

  for (const cat of lowest) {
    const swap = PRIORITY_SWAPS[cat];
    if (swap) {
      output[swap.phase][0] = swap.item;
    }
  }

  return output;
}
