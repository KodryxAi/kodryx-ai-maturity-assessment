"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import WizardShell from "../../components/wizard/WizardShell";
import AnalyzingTransition from "../../components/wizard/AnalyzingTransition";
import type { WizardAnswers } from "../../lib/types/assessment";

export default function AssessmentPage() {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const handleSubmit = useCallback(async (answers: WizardAnswers) => {
    try {
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
    } catch {
      return {
        ok: false as const,
        error: "Network error — please check your connection and try again.",
      };
    }
  }, []);

  if (analyzing && resultId) {
    return (
      <AnalyzingTransition
        onComplete={() => router.push(`/results/${resultId}`)}
      />
    );
  }

  return <WizardShell onSubmit={handleSubmit} />;
}
