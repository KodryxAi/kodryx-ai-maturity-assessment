import type { BenchmarkOutput } from "../types/report";

const BENCHMARK_TABLE: Record<string, { industryAverage: number; topQuartile: number }> = {
  Manufacturing:       { industryAverage: 42, topQuartile: 68 },
  "SaaS / Technology": { industryAverage: 52, topQuartile: 78 },
  Healthcare:          { industryAverage: 40, topQuartile: 65 },
  Retail:              { industryAverage: 38, topQuartile: 62 },
  "Financial Services":     { industryAverage: 45, topQuartile: 72 },
  "Professional Services":  { industryAverage: 40, topQuartile: 65 },
  Education:           { industryAverage: 32, topQuartile: 55 },
  Other:               { industryAverage: 40, topQuartile: 65 },
};

export function getBenchmark(industry: string): BenchmarkOutput {
  const row = BENCHMARK_TABLE[industry] ?? BENCHMARK_TABLE["Other"];
  return { industryAverage: row.industryAverage, topQuartile: row.topQuartile };
}
