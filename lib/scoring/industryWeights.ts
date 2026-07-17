// Industry weight adjustment (ENG-02) — a static per-industry multiplier
// table nudges the base category weights so the score reflects what
// actually matters for that business type, then renormalizes back to a
// 100-point total. See design spec's "Industry weight adjustment" section.

import type { CategoryKey } from "../types/assessment";
import { CATEGORY_WEIGHTS } from "./categoryFormulas";

/**
 * The design spec's example multiplier table columns are "Operations,
 * Technology, Data, Security". "Operations" maps to the `businessProcess`
 * CategoryKey (the category covering day-to-day departmental process
 * maturity across the 6 Business Process departments).
 *
 * The spec's table only tabulates Manufacturing / SaaS / Healthcare /
 * Retail explicitly. The remaining 4 `INDUSTRY_OPTIONS` values
 * ("Financial Services", "Professional Services", "Education", "Other")
 * are not given explicit rows, so they fall back to the spec's own stated
 * "(default/other)" row of 1.0 across the board — a true no-op relative to
 * the base `CATEGORY_WEIGHTS`.
 */
export const INDUSTRY_MULTIPLIERS: Record<string, Partial<Record<CategoryKey, number>>> = {
  Manufacturing: { businessProcess: 1.2, technology: 0.9, data: 1.0, security: 0.9 },
  "SaaS / Technology": { businessProcess: 0.8, technology: 1.3, data: 1.1, security: 1.1 },
  Healthcare: { businessProcess: 0.9, technology: 1.0, data: 1.1, security: 1.3 },
  Retail: { businessProcess: 1.1, technology: 1.0, data: 1.0, security: 0.9 },
  "Financial Services": { businessProcess: 1.0, technology: 1.0, data: 1.0, security: 1.0 },
  "Professional Services": { businessProcess: 1.0, technology: 1.0, data: 1.0, security: 1.0 },
  Education: { businessProcess: 1.0, technology: 1.0, data: 1.0, security: 1.0 },
  Other: { businessProcess: 1.0, technology: 1.0, data: 1.0, security: 1.0 },
};

// Note: every `INDUSTRY_OPTIONS` value (see lib/constants/companyProfile.ts)
// has an explicit row above, so `getIndustryMultiplier`'s `?? 1.0` fallback
// only ever triggers for genuinely unrecognized industry strings (e.g.
// stale/bad data), matching Test 4's "Not A Real Industry" case.

/**
 * Returns the multiplier for a given industry/category pair, defaulting to
 * 1.0 (no adjustment) when the industry or category isn't in the table —
 * this is what makes the 6 categories the spec's table doesn't adjust
 * (aiAdoption, automation, aiAgents, people, leadership, innovation)
 * always multiply by 1.0 regardless of industry.
 */
export function getIndustryMultiplier(industry: string, category: CategoryKey): number {
  return INDUSTRY_MULTIPLIERS[industry]?.[category] ?? 1.0;
}

/**
 * Applies each category's industry multiplier to the base weight, then
 * renormalizes all 10 adjusted weights so they sum to exactly 100.
 */
export function getAdjustedWeights(industry: string): Record<CategoryKey, number> {
  const keys = Object.keys(CATEGORY_WEIGHTS) as CategoryKey[];
  const raw = {} as Record<CategoryKey, number>;
  keys.forEach((key) => {
    raw[key] = CATEGORY_WEIGHTS[key] * getIndustryMultiplier(industry, key);
  });
  const sum = keys.reduce((acc, key) => acc + raw[key], 0);
  const adjusted = {} as Record<CategoryKey, number>;
  keys.forEach((key) => {
    adjusted[key] = (raw[key] / sum) * 100;
  });
  return adjusted;
}
