import type { CategoryKey, CategoryScores, ScoringInput } from "../types/assessment";
import { CATEGORY_RATIO_FNS } from "./categoryFormulas";
import { getAdjustedWeights } from "./industryWeights";

/**
 * Weighted, raw (unrounded) score per category: `adjustedWeight[key] *
 * ratio(input)`, where `adjustedWeight` comes from `getAdjustedWeights`
 * (industry-adjusted, renormalized to 100 — ENG-02). Operates on the full
 * `ScoringInput` shape so Phase 2's additional wizard steps require zero
 * changes here.
 */
export function calculateCategoryScores(input: ScoringInput): CategoryScores {
  const adjustedWeights = getAdjustedWeights(input.companyProfile.industry);
  const scores = {} as CategoryScores;
  (Object.keys(adjustedWeights) as CategoryKey[]).forEach((key) => {
    scores[key] = adjustedWeights[key] * CATEGORY_RATIO_FNS[key](input);
  });
  return scores;
}

/** Rounded sum of all category scores, clamped to the inclusive 0-100 range. */
export function calculateTotalScore(scores: CategoryScores): number {
  const sum = Object.values(scores).reduce((acc, value) => acc + value, 0);
  return Math.min(100, Math.max(0, Math.round(sum)));
}
