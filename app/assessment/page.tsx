"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import WizardShell from "../../components/wizard/WizardShell";
import AnalyzingTransition from "../../components/wizard/AnalyzingTransition";
import type { WizardAnswers } from "../../lib/types/assessment";

export default function AssessmentPage() {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const handleSubmit = async (answers: WizardAnswers) => {
    const response = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return {
        ok: false as const,
        error: body.error ?? "Submission failed",
      };
    }

    const { id } = await response.json();
    setResultId(id);
    setAnalyzing(true);
    return { ok: true as const, id };
  };

  if (analyzing && resultId) {
    return (
      <AnalyzingTransition
        onComplete={() => router.push(`/results/${resultId}`)}
      />
    );
  }

  return <WizardShell onSubmit={handleSubmit} />;
}
