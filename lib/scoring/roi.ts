import type { CategoryScores, ScoringInput } from "../types/assessment";
import type { RoiOutput, RoiDepartmentBreakdown, RoiAssumptions, RoiTotal } from "../types/report";
import { DEPARTMENT_CONFIG } from "../constants/wizardOptions";

const EMPLOYEE_BAND_MIDPOINTS: Record<string, number> = {
  "1-10": 5,
  "11-50": 30,
  "51-200": 125,
  "200+": 500,
};

const INVESTMENT_TIERS: Record<string, number> = {
  "1-10": 15000,
  "11-50": 60000,
  "51-200": 180000,
  "200+": 500000,
};

const HOURS_PER_WEEK = 40;
const WORK_WEEKS_PER_YEAR = 48;
const AUTOMATABLE_PCT = 0.3;

const DEPARTMENT_HEADCOUNT_SPLITS: Record<string, Record<string, number>> = {
  B2B: { sales: 0.22, marketing: 0.12, hr: 0.08, finance: 0.08, operations: 0.30, support: 0.20 },
  B2C: { sales: 0.15, marketing: 0.18, hr: 0.08, finance: 0.07, operations: 0.30, support: 0.22 },
  SaaS: { sales: 0.18, marketing: 0.15, hr: 0.07, finance: 0.08, operations: 0.32, support: 0.20 },
  Manufacturing: { sales: 0.10, marketing: 0.05, hr: 0.08, finance: 0.07, operations: 0.50, support: 0.20 },
  Healthcare: { sales: 0.05, marketing: 0.05, hr: 0.10, finance: 0.08, operations: 0.42, support: 0.30 },
  Education: { sales: 0.05, marketing: 0.08, hr: 0.10, finance: 0.10, operations: 0.37, support: 0.30 },
  Retail: { sales: 0.15, marketing: 0.10, hr: 0.10, finance: 0.05, operations: 0.35, support: 0.25 },
  Services: { sales: 0.18, marketing: 0.12, hr: 0.10, finance: 0.08, operations: 0.32, support: 0.20 },
};

const DEFAULT_SPLIT: Record<string, number> =
  DEPARTMENT_HEADCOUNT_SPLITS["Services"];

function getHeadcountSplit(businessModel: string): Record<string, number> {
  return DEPARTMENT_HEADCOUNT_SPLITS[businessModel] ?? DEFAULT_SPLIT;
}

function computeDepartmentBreakdown(
  employeeCount: number,
  hourlyCost: number,
  split: Record<string, number>,
  scores: CategoryScores,
): RoiDepartmentBreakdown[] {
  const automatableHoursPerWeek = HOURS_PER_WEEK * AUTOMATABLE_PCT;

  return DEPARTMENT_CONFIG.map((dept) => {
    const deptHeadcount = Math.max(1, Math.round(employeeCount * (split[dept.key] ?? 0.1)));
    const rating =
      (scores.businessProcess / 20) * 5 *
      (dept.key === "sales" ? 1 : dept.key === "operations" ? 1 : 0.9);

    const gap = Math.max(0, (5 - Math.min(5, rating)) / 5);
    const weeklyHoursSaved = deptHeadcount * automatableHoursPerWeek * gap;
    const annualHoursMid = Math.round(weeklyHoursSaved * WORK_WEEKS_PER_YEAR);

    return {
      department: dept.label,
      hoursSavedLow: Math.round(annualHoursMid * 0.6),
      hoursSavedMid: annualHoursMid,
      hoursSavedHigh: Math.round(annualHoursMid * 1.4),
      costSavingsLow: Math.round(annualHoursMid * 0.6 * hourlyCost),
      costSavingsMid: Math.round(annualHoursMid * hourlyCost),
      costSavingsHigh: Math.round(annualHoursMid * 1.4 * hourlyCost),
    };
  });
}

function computeTotal(
  departments: RoiDepartmentBreakdown[],
  investment: number,
  hourlyCost: number,
): RoiTotal {
  const sum = (key: "hoursSavedLow" | "hoursSavedMid" | "hoursSavedHigh") =>
    departments.reduce((acc, d) => acc + d[key], 0);

  const hoursSavedLow = sum("hoursSavedLow");
  const hoursSavedMid = sum("hoursSavedMid");
  const hoursSavedHigh = sum("hoursSavedHigh");

  const costSavingsLow = Math.round(hoursSavedLow * hourlyCost);
  const costSavingsMid = Math.round(hoursSavedMid * hourlyCost);
  const costSavingsHigh = Math.round(hoursSavedHigh * hourlyCost);

  const roiPercentLow = investment > 0 ? Math.round(((costSavingsLow - investment) / investment) * 100) : 0;
  const roiPercentMid = investment > 0 ? Math.round(((costSavingsMid - investment) / investment) * 100) : 0;
  const roiPercentHigh = investment > 0 ? Math.round(((costSavingsHigh - investment) / investment) * 100) : 0;

  const annualMidSavings = costSavingsMid;
  const paybackMonthsMid = annualMidSavings > 0
    ? Math.round((investment / annualMidSavings) * 12)
    : 99;

  return {
    hoursSavedLow,
    hoursSavedMid,
    hoursSavedHigh,
    costSavingsLow,
    costSavingsMid,
    costSavingsHigh,
    investment,
    roiPercentLow,
    roiPercentMid,
    roiPercentHigh,
    paybackMonthsMid,
  };
}

export function generateRoi(
  input: ScoringInput,
  scores: CategoryScores,
): RoiOutput {
  const { companyProfile } = input;
  const hourlyCost = companyProfile.blendedHourlyCost;
  const employeeBand = companyProfile.employeeBand;
  const businessModel = companyProfile.businessModel;

  const employeeCount =
    EMPLOYEE_BAND_MIDPOINTS[employeeBand] ?? 30;
  const investment = INVESTMENT_TIERS[employeeBand] ?? 60000;
  const split = getHeadcountSplit(businessModel);

  const byDepartment = computeDepartmentBreakdown(
    employeeCount,
    hourlyCost,
    split,
    scores,
  );

  const total = computeTotal(byDepartment, investment, hourlyCost);

  const assumptions: RoiAssumptions = {
    hourlyCost,
    workWeeksPerYear: WORK_WEEKS_PER_YEAR,
    hoursPerWeek: HOURS_PER_WEEK,
  };

  return { assumptions, byDepartment, total };
}
