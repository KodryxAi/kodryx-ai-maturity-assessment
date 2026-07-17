// Pure per-category raw-ratio (0-1) formulas over the full `ScoringInput`
// shape. Each ratio defaults to 0 when its required `ScoringInput` section
// is undefined, so a Phase-1 Company-Profile-only input scores every
// category except `leadership` at 0 with zero special-casing.

import { LEADERSHIP_GOALS } from "../constants/companyProfile";
import type { CategoryKey, ScoringInput } from "../types/assessment";

/** Base category weights from the design spec's scoring-engine table (sum to 100). */
export const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  businessProcess: 20,
  technology: 15,
  data: 10,
  aiAdoption: 10,
  automation: 10,
  aiAgents: 10,
  security: 5,
  people: 5,
  leadership: 10,
  innovation: 5,
};

// Option-count denominators from the design spec's per-step option lists
// (Steps 3, 5, 6, 8). Phase 2 reuses these exact numbers when it builds the
// real multi-select UIs for those steps.
const TOTAL_SYSTEMS_OPTIONS = 8;
const TOTAL_AI_TOOLS_OPTIONS = 10;
const TOTAL_AUTOMATION_PROCESSES_OPTIONS = 9;
const TOTAL_SECURITY_CHECKLIST_OPTIONS = 11;

const API_MATURITY_LEVELS = ["Legacy", "Basic", "Modern", "Enterprise"];
const AI_ADOPTION_FREQUENCY_LEVELS = ["Never", "Weekly", "Daily", "Company-wide"];

/**
 * Company-size normalization (ENG-03) — expectations for Technology and
 * Automation coverage are scaled by employee-count band so a 10-person
 * company isn't judged against enterprise-ERP benchmarks. Keyed to match
 * `EMPLOYEE_BANDS` (lib/constants/companyProfile.ts) verbatim.
 *
 * "1-10".systemsBaseline: 3 matches the design spec's own illustrative
 * example verbatim ("a small company with 3 of 8 systems selected can...
 * score comparably... if 3 is at/above what's typical for its size band").
 * "200+" baselines equal the full absolute option-list lengths
 * (TOTAL_SYSTEMS_OPTIONS=8, TOTAL_AUTOMATION_PROCESSES_OPTIONS=9) since an
 * enterprise-scale company is reasonably expected to cover the full option
 * set. "11-50"/"51-200" are simple linear steps between those two anchors.
 */
export const SIZE_BAND_BASELINES: Record<
  string,
  { systemsBaseline: number; automationBaseline: number }
> = {
  "1-10": { systemsBaseline: 3, automationBaseline: 3 },
  "11-50": { systemsBaseline: 5, automationBaseline: 5 },
  "51-200": { systemsBaseline: 7, automationBaseline: 7 },
  "200+": { systemsBaseline: 8, automationBaseline: 9 },
};

export function businessProcessRatio(input: ScoringInput): number {
  const departments = input.departments;
  if (!departments) return 0;
  const entries = Object.values(departments);
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, department) => acc + department.rating / 5, 0);
  return sum / entries.length;
}

export function technologyRatio(input: ScoringInput): number {
  const techStack = input.techStack;
  if (!techStack) return 0;
  const baseline =
    SIZE_BAND_BASELINES[input.companyProfile.employeeBand]?.systemsBaseline ??
    TOTAL_SYSTEMS_OPTIONS;
  const systemsRatio = Math.min(1, techStack.systems.length / baseline);
  const levelIndex = API_MATURITY_LEVELS.indexOf(techStack.apiMaturity);
  const levelRatio = levelIndex >= 0 ? levelIndex / 3 : 0;
  return 0.5 * systemsRatio + 0.5 * levelRatio;
}

export function dataRatio(input: ScoringInput): number {
  const dataReadiness = input.dataReadiness;
  if (!dataReadiness) return 0;
  const { quality, security, accessibility, knowledgeMgmt } = dataReadiness;
  return (quality / 5 + security / 5 + accessibility / 5 + knowledgeMgmt / 5) / 4;
}

export function aiAdoptionRatio(input: ScoringInput): number {
  const aiAdoption = input.aiAdoption;
  if (!aiAdoption) return 0;
  const toolsRatio = aiAdoption.toolsInUse.length / TOTAL_AI_TOOLS_OPTIONS;
  const frequencyIndex = AI_ADOPTION_FREQUENCY_LEVELS.indexOf(aiAdoption.frequency);
  const frequencyRatio = frequencyIndex >= 0 ? frequencyIndex / 3 : 0;
  return 0.5 * toolsRatio + 0.5 * frequencyRatio;
}

export function automationRatio(input: ScoringInput): number {
  const automation = input.automation;
  if (!automation) return 0;
  const baseline =
    SIZE_BAND_BASELINES[input.companyProfile.employeeBand]?.automationBaseline ??
    TOTAL_AUTOMATION_PROCESSES_OPTIONS;
  return Math.min(1, automation.processesAutomated.length / baseline);
}

/** Composite proxy for agent readiness — Step 7 captures interest/opportunity, not current usage. */
export function aiAgentsRatio(input: ScoringInput): number {
  return 0.5 * automationRatio(input) + 0.5 * aiAdoptionRatio(input);
}

export function securityRatio(input: ScoringInput): number {
  const security = input.security;
  if (!security) return 0;
  return security.checklist.length / TOTAL_SECURITY_CHECKLIST_OPTIONS;
}

export function peopleRatio(input: ScoringInput): number {
  const employeeReadiness = input.employeeReadiness;
  if (!employeeReadiness) return 0;
  const { aiSkills, training, changeReadiness } = employeeReadiness;
  return (aiSkills / 5 + training / 5 + changeReadiness / 5) / 3;
}

export function leadershipRatio(input: ScoringInput): number {
  const goalsRatio = input.companyProfile.leadershipGoals.length / LEADERSHIP_GOALS.length;
  const leadershipSupport = input.employeeReadiness?.leadershipSupport ?? 0;
  return 0.5 * goalsRatio + 0.5 * (leadershipSupport / 5);
}

export function innovationRatio(input: ScoringInput): number {
  const innovationCulture = input.employeeReadiness?.innovationCulture ?? 0;
  return innovationCulture / 5;
}

/** One ratio function per `CategoryKey`, keyed identically to `CATEGORY_WEIGHTS`. */
export const CATEGORY_RATIO_FNS: Record<CategoryKey, (input: ScoringInput) => number> = {
  businessProcess: businessProcessRatio,
  technology: technologyRatio,
  data: dataRatio,
  aiAdoption: aiAdoptionRatio,
  automation: automationRatio,
  aiAgents: aiAgentsRatio,
  security: securityRatio,
  people: peopleRatio,
  leadership: leadershipRatio,
  innovation: innovationRatio,
};
