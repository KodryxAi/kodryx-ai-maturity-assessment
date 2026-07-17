import type { ScoringInput } from "../types/assessment";
import type { SwotOutput, RiskOutput, RoiOutput, OpportunityItem } from "../types/report";

export function generateExecutiveSummary(
  companyName: string,
  input: ScoringInput,
  stageLabel: string,
  totalScore: number,
  benchmarkIndustryAvg: number,
  swot: SwotOutput,
  risk: RiskOutput,
  roi: RoiOutput,
  firstMoves: OpportunityItem[],
): string {
  const topStrength = swot.strengths[0] ?? "foundational AI readiness";
  const highestRisk = (Object.entries(risk) as [string, string][])
    .filter(([, level]) => level === "High")
    .map(([name]) => name)
    .join(", ") || "no critical risks identified";

  const firstMovesList = firstMoves.length > 0
    ? firstMoves.map((f) => `"${f.initiative}"`).join(", ")
    : "no specific initiatives recommended at this time";

  const roiPercent = roi.total.roiPercentMid > 0
    ? `an estimated ${roi.total.roiPercentMid}% ROI`
    : "a preliminary ROI estimate";
  const payback = roi.total.paybackMonthsMid < 99
    ? ` with payback in approximately ${roi.total.paybackMonthsMid} months`
    : "";

  const benchmarkNote =
    totalScore >= benchmarkIndustryAvg
      ? `scoring above the ${input.companyProfile.industry} industry average of ${benchmarkIndustryAvg}`
      : `scoring below the ${input.companyProfile.industry} industry average of ${benchmarkIndustryAvg}`;

  return (
    `${companyName} has reached ${stageLabel} with an overall AI maturity score of ${totalScore}/100, ` +
    `${benchmarkNote}. The organization's primary strength is ${topStrength.toLowerCase()}. ` +
    `Key risks include ${highestRisk}. Based on this assessment, the recommended first moves are: ` +
    `${firstMovesList}. With these initiatives, ${companyName} can expect ${roiPercent}${payback} ` +
    `on a ${roi.total.investment.toLocaleString()} estimated investment, ` +
    `delivering ${roi.total.costSavingsMid.toLocaleString()} in annual cost savings at the expected case.`
  );
}
