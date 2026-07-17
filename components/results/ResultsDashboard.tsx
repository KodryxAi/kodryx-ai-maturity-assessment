"use client";

import ScoreGauge from "./ScoreGauge";
import CategoryRadarChart from "./CategoryRadarChart";
import DepartmentHeatmap from "./DepartmentHeatmap";
import OpportunityQuadrant from "./OpportunityQuadrant";
import RoiRangeBars from "./RoiRangeBars";
import RoadmapTimeline from "./RoadmapTimeline";
import type { SwotOutput, BenchmarkOutput, RiskOutput, OpportunityItem, RoiOutput, RoadmapOutput } from "../../lib/types/report";

interface ResultsDashboardProps {
  companyName: string;
  contactName: string;
  totalScore: number;
  stageLabel: string;
  stageWhatThisMeans: string;
  stageWhatsNext: string;
  dataCompleteness: string | null;
  categoryScores: Record<string, number>;
  executiveSummary: string | null;
  benchmark: BenchmarkOutput | null;
  swot: SwotOutput | null;
  risk: RiskOutput | null;
  roi: RoiOutput & { assumptions: { hourlyCost: number; workWeeksPerYear: number; hoursPerWeek: number }; byDepartment: { department: string; hoursSavedLow: number; hoursSavedMid: number; hoursSavedHigh: number; costSavingsLow: number; costSavingsMid: number; costSavingsHigh: number }[]; total: { hoursSavedLow: number; hoursSavedMid: number; hoursSavedHigh: number; costSavingsLow: number; costSavingsMid: number; costSavingsHigh: number; investment: number; roiPercentLow: number; roiPercentMid: number; roiPercentHigh: number; paybackMonthsMid: number } } | null;
  oppMatrix: OpportunityItem[] | null;
  roadmap: RoadmapOutput | null;
  departments: Record<string, { rating: number }> | null;
}

const riskLabels: Record<string, string> = {
  technical: "Technical", business: "Business", security: "Security",
  operational: "Operational", compliance: "Compliance", adoption: "Adoption",
  budget: "Budget",
};

export default function ResultsDashboard({
  companyName,
  contactName,
  totalScore,
  stageLabel,
  stageWhatThisMeans,
  stageWhatsNext,
  dataCompleteness,
  categoryScores,
  executiveSummary,
  benchmark,
  swot,
  risk,
  roi,
  oppMatrix,
  roadmap,
  departments,
}: ResultsDashboardProps) {
  return (
    <div id="results-content" className="mx-auto flex w-full max-w-[860px] flex-col gap-8 rounded-lg border border-kx-grey-100 bg-white px-10 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-body text-kx-navy text-lg font-semibold">{companyName}</p>
        <p className="font-body kx-caption text-kx-grey">{contactName}</p>
      </div>

      <hr className="kx-divider-gold mx-auto" />

      {/* Benchmark + Executive Summary + First Moves (RES-08: top of report, above gauge) */}
      {benchmark && (
        <section className="rounded border border-kx-grey-100 p-5">
          <div className="flex items-center gap-4 justify-center">
            <div className="text-center">
              <span className="block kx-caption">Industry Avg</span>
              <span className="font-display text-xl font-bold text-kx-navy">{benchmark.industryAverage}</span>
            </div>
            <div className="flex-1 max-w-[300px] h-4 rounded-full bg-kx-grey-50 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-kx-navy opacity-20"
                style={{ width: `${Math.min(100, benchmark.topQuartile)}%` }} />
              <div className="absolute inset-y-0 left-0 rounded-full bg-kx-gold"
                style={{ width: `${Math.min(100, totalScore)}%` }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-kx-navy"
                style={{ left: `${Math.min(100, benchmark.industryAverage)}%` }} />
            </div>
            <div className="text-center">
              <span className="block kx-caption">Top Quartile</span>
              <span className="font-display text-xl font-bold text-kx-navy">{benchmark.topQuartile}</span>
            </div>
          </div>
          <p className="text-center kx-caption mt-2">
            Your score: {totalScore} &middot; Industry average: {benchmark.industryAverage} &middot; Top quartile: {benchmark.topQuartile}
          </p>
        </section>
      )}

      {executiveSummary && (
        <section className="rounded border border-kx-grey-100 p-6 bg-kx-grey-50">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-3">
            Executive Summary
          </h3>
          <p className="font-body text-kx-navy text-sm leading-relaxed">
            {executiveSummary}
          </p>
        </section>
      )}

      {oppMatrix && oppMatrix.filter((i) => i.isFirstMove).length > 0 && (
        <section className="rounded border border-kx-gold p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            Recommended First Moves
          </h3>
          <ol className="flex flex-col gap-3">
            {oppMatrix.filter((i) => i.isFirstMove).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 font-body text-kx-navy text-sm">
                <span className="font-bold text-kx-gold text-base">{idx + 1}.</span>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">{item.initiative}</span>
                  <span className="kx-caption text-kx-grey">
                    Impact: {item.impact}/5 &middot; Effort: {item.effort}/5 &middot;
                    ROI: {item.roi}/5 &middot; Priority: {item.priority}/5
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Score & Stage */}
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="kx-eyebrow">Overall AI Maturity Score</p>
        <ScoreGauge score={totalScore} label={stageLabel} />
        <span className="inline-block rounded-full border border-kx-navy px-4 py-1 kx-caption text-kx-navy">
          {stageLabel}
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <p className="kx-caption text-kx-grey">{stageWhatThisMeans}</p>
          <p className="kx-caption text-kx-grey">{stageWhatsNext}</p>
        </div>
        {dataCompleteness === "thin" && (
          <p className="kx-caption text-kx-grey mt-1">
            Based on a fast-pass assessment; scores refine with more detail.
          </p>
        )}
      </div>

      {/* Radar Chart (RES-03) */}
      <section className="rounded border border-kx-grey-100 p-6">
        <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
          Category Maturity Profile
        </h3>
        <CategoryRadarChart categoryScores={categoryScores} />
      </section>

      {/* Department Heatmap (RES-04) */}
      {departments && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            Department Maturity Heatmap
          </h3>
          <DepartmentHeatmap departments={departments} />
        </section>
      )}

      {/* SWOT */}
      {swot && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            SWOT Analysis
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Strengths", items: swot.strengths },
              { title: "Weaknesses", items: swot.weaknesses },
              { title: "Opportunities", items: swot.opportunities },
              { title: "Threats", items: swot.threats },
            ].map((quad) => (
              <div key={quad.title} className="flex flex-col gap-2">
                <h4 className="font-body font-semibold text-kx-navy text-sm">{quad.title}</h4>
                <ul className="flex flex-col gap-1">
                  {quad.items.map((item, i) => (
                    <li key={i} className="font-body text-xs text-kx-grey pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-kx-gold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Opportunity Quadrant (RES-05) */}
      {oppMatrix && oppMatrix.length > 0 && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            Opportunity Matrix
          </h3>
          <OpportunityQuadrant items={oppMatrix} />
        </section>
      )}

      {/* Risk */}
      {risk && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            Risk Assessment
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(riskLabels).map(([key, label]) => {
              const level = (risk as unknown as Record<string, string>)[key];
              const colorClass =
                level === "High"
                  ? "border-red-400 text-red-600 bg-red-50"
                  : level === "Medium"
                    ? "border-amber-400 text-amber-600 bg-amber-50"
                    : "border-green-400 text-green-600 bg-green-50";
              return (
                <div key={key} className={`rounded border px-3 py-2 text-center font-body text-xs font-medium ${colorClass}`}>
                  <span className="block uppercase tracking-wide opacity-70">{label}</span>
                  <span>{level}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ROI Range Bars (RES-06) */}
      {roi && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            ROI Estimate
          </h3>

          <div className="flex flex-col gap-1 mb-4 kx-caption text-kx-grey">
            <p>
              Assumptions: {roi.assumptions.hoursPerWeek}h/week &middot;
              {roi.assumptions.workWeeksPerYear} weeks/year &middot;
              ${roi.assumptions.hourlyCost}/h blended cost
            </p>
            <p className="italic">
              Estimated using stated assumptions and industry benchmarks. Actual results will vary.
            </p>
          </div>

          <RoiRangeBars departments={roi.byDepartment} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 font-body text-xs">
            <div className="rounded border border-kx-grey-100 p-3 text-center">
              <span className="block text-kx-grey">Investment</span>
              <span className="font-semibold text-kx-navy">${roi.total.investment.toLocaleString()}</span>
            </div>
            <div className="rounded border border-kx-grey-100 p-3 text-center">
              <span className="block text-kx-grey">ROI (Mid)</span>
              <span className="font-semibold text-kx-gold">{roi.total.roiPercentMid}%</span>
            </div>
            <div className="rounded border border-kx-grey-100 p-3 text-center">
              <span className="block text-kx-grey">Annual Savings (E)</span>
              <span className="font-semibold text-kx-navy">${roi.total.costSavingsMid.toLocaleString()}</span>
            </div>
            <div className="rounded border border-kx-grey-100 p-3 text-center">
              <span className="block text-kx-grey">Payback</span>
              <span className="font-semibold text-kx-navy">{roi.total.paybackMonthsMid} months</span>
            </div>
          </div>
        </section>
      )}

      {/* Roadmap Timeline (RES-07) */}
      {roadmap && (
        <section className="rounded border border-kx-grey-100 p-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold mb-4">
            Transformation Roadmap
          </h3>
          <RoadmapTimeline
            quickWins={roadmap.quickWins}
            phase2={roadmap.phase2}
            phase3={roadmap.phase3}
            phase4={roadmap.phase4}
          />
        </section>
      )}
    </div>
  );
}
