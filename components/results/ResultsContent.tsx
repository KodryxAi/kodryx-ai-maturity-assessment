"use client";

import React, { useRef } from "react";
import ResultsDashboard from "./ResultsDashboard";
import PdfDownload from "./PdfDownload";
import type { SwotOutput, BenchmarkOutput, RiskOutput, OpportunityItem, RoiOutput, RoadmapOutput } from "../../lib/types/report";

interface ResultsContentProps {
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
  roi: RoiOutput | null;
  oppMatrix: OpportunityItem[] | null;
  roadmap: RoadmapOutput | null;
  departments: Record<string, { rating: number }> | null;
}

export default function ResultsContent(props: ResultsContentProps) {
  const printRef = useRef<HTMLDivElement>(null!);

  return (
    <>
      <div ref={printRef}>
        <ResultsDashboard {...props} />
      </div>
      <div className="flex justify-center mt-8">
        <PdfDownload contentRef={printRef} companyName={props.companyName} />
      </div>
    </>
  );
}
