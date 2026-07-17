// Option lists shared by the Company Profile wizard step (WIZ-02) and the
// scoring engine (industry/size adjustment).

export const INDUSTRY_OPTIONS = [
  "Manufacturing",
  "SaaS / Technology",
  "Healthcare",
  "Retail",
  "Financial Services",
  "Professional Services",
  "Education",
  "Other",
] as const;

export const EMPLOYEE_BANDS = ["1-10", "11-50", "51-200", "200+"] as const;

export const REVENUE_BANDS = [
  "<$1M",
  "$1M-$5M",
  "$5M-$20M",
  "$20M-$100M",
  "$100M+",
] as const;

export const BUSINESS_MODEL_OPTIONS = [
  "B2B",
  "B2C",
  "SaaS",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Retail",
  "Services",
] as const;

export const LEADERSHIP_GOALS = [
  "Increase Revenue",
  "Reduce Operating Costs",
  "Improve Operational Efficiency",
  "Enhance Customer Experience",
  "Gain Competitive Advantage",
  "Empower Employee Productivity",
] as const;

/**
 * Starting blended hourly cost prefilled per industry (WIZ-02) — the user
 * can edit or accept it as the Step 1 ROI-calculation input.
 */
export const INDUSTRY_HOURLY_COST_DEFAULTS: Record<string, number> = {
  Manufacturing: 40,
  "SaaS / Technology": 75,
  Healthcare: 65,
  Retail: 35,
  "Financial Services": 70,
  "Professional Services": 60,
  Education: 45,
  Other: 45,
};
