import type { CategoryKey, CategoryScores } from "../types/assessment";
import type { RiskLevel, RiskOutput } from "../types/report";
import { getAdjustedWeights } from "./industryWeights";

function pctOfMax(
  key: CategoryKey,
  scores: CategoryScores,
  adjustedWeights: Record<CategoryKey, number>,
): number {
  const max = adjustedWeights[key];
  if (max === 0) return 1;
  return Math.min(1, Math.max(0, scores[key] / max));
}

function toRiskLevel(pct: number): RiskLevel {
  if (pct >= 0.7) return "Low";
  if (pct >= 0.4) return "Medium";
  return "High";
}

const RISK_CATEGORY_MAP: Record<string, CategoryKey> = {
  technical: "technology",
  business: "businessProcess",
  security: "security",
  operational: "automation",
  compliance: "security",
  adoption: "people",
};

export function assessRisk(
  scores: CategoryScores,
  totalScore: number,
  industry: string,
): RiskOutput {
  const adjustedWeights = getAdjustedWeights(industry);

  const result = {} as Record<string, RiskLevel>;

  for (const [riskType, categoryKey] of Object.entries(RISK_CATEGORY_MAP)) {
    const pct = pctOfMax(categoryKey, scores, adjustedWeights);
    result[riskType] = toRiskLevel(pct);
  }

  result.budget = toRiskLevel(totalScore / 100);

  return result as unknown as RiskOutput;
}
