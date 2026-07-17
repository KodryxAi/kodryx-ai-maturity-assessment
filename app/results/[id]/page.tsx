import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getStage } from "../../../lib/scoring/stage";
import ResultsContent from "../../../components/results/ResultsContent";
import type { SwotOutput, BenchmarkOutput, RiskOutput, OpportunityItem, RoiOutput, RoadmapOutput } from "../../../lib/types/report";

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.id },
  });

  if (!assessment) {
    notFound();
  }

  const stage = getStage(assessment.totalScore);

  const departments = assessment.departments as Record<string, { rating: number }> | null;
  const swot = assessment.swot as SwotOutput | null;
  const benchmark = assessment.benchmark as BenchmarkOutput | null;
  const risk = assessment.risk as RiskOutput | null;
  const oppMatrix = assessment.opportunityMatrix as OpportunityItem[] | null;
  const roi = assessment.roi as RoiOutput | null;
  const roadmap = assessment.roadmap as RoadmapOutput | null;
  const categoryScores = assessment.categoryScores as Record<string, number>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo-kodryx.png"
          alt="Kodryx AI"
          width={72}
          height={74}
          priority
        />
      </div>

      <ResultsContent
        companyName={assessment.companyName}
        contactName={assessment.contactName}
        totalScore={assessment.totalScore}
        stageLabel={stage.label}
        stageWhatThisMeans={stage.whatThisMeans}
        stageWhatsNext={stage.whatsNext}
        dataCompleteness={assessment.dataCompleteness}
        categoryScores={categoryScores}
        executiveSummary={assessment.executiveSummary}
        benchmark={benchmark}
        swot={swot}
        risk={risk}
        roi={roi}
        oppMatrix={oppMatrix}
        roadmap={roadmap}
        departments={departments}
      />
    </main>
  );
}
