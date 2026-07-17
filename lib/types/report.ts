import type { CategoryKey } from "./assessment";

export interface SwotOutput {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface BenchmarkOutput {
  industryAverage: number;
  topQuartile: number;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface RiskOutput {
  technical: RiskLevel;
  business: RiskLevel;
  security: RiskLevel;
  operational: RiskLevel;
  compliance: RiskLevel;
  adoption: RiskLevel;
  budget: RiskLevel;
}

export interface OpportunityItem {
  initiative: string;
  impact: number;
  effort: number;
  roi: number;
  priority: number;
  isFirstMove: boolean;
}

export interface RoiDepartmentBreakdown {
  department: string;
  hoursSavedLow: number;
  hoursSavedMid: number;
  hoursSavedHigh: number;
  costSavingsLow: number;
  costSavingsMid: number;
  costSavingsHigh: number;
}

export interface RoiAssumptions {
  hourlyCost: number;
  workWeeksPerYear: number;
  hoursPerWeek: number;
}

export interface RoiTotal {
  hoursSavedLow: number;
  hoursSavedMid: number;
  hoursSavedHigh: number;
  costSavingsLow: number;
  costSavingsMid: number;
  costSavingsHigh: number;
  investment: number;
  roiPercentLow: number;
  roiPercentMid: number;
  roiPercentHigh: number;
  paybackMonthsMid: number;
}

export interface RoiOutput {
  assumptions: RoiAssumptions;
  byDepartment: RoiDepartmentBreakdown[];
  total: RoiTotal;
}

export interface RoadmapOutput {
  quickWins: string[];
  phase2: string[];
  phase3: string[];
  phase4: string[];
}

export interface CategoryGap {
  key: CategoryKey;
  percentOfMax: number;
  adjustedWeight: number;
  score: number;
  gapScore: number;
}
