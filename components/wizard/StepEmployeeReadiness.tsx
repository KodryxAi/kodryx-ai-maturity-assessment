"use client";

import { useLayoutEffect } from "react";
import type { EmployeeReadinessAnswers } from "../../lib/types/assessment";

export interface StepEmployeeReadinessProps {
  values: EmployeeReadinessAnswers;
  onChange: (payload: Partial<EmployeeReadinessAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

const DIMENSIONS: { key: keyof EmployeeReadinessAnswers; label: string }[] = [
  { key: "aiSkills", label: "AI Skills" },
  { key: "training", label: "Training" },
  { key: "changeReadiness", label: "Change Readiness" },
  { key: "leadershipSupport", label: "Leadership Support" },
  { key: "innovationCulture", label: "Innovation Culture" },
];

export default function StepEmployeeReadiness({
  values,
  onChange,
  onValidityChange,
}: StepEmployeeReadinessProps) {
  // All 5 sliders always have a default value -- no blocking requirement,
  // matching StepDataReadiness.tsx's rule.
  useLayoutEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Employee readiness
        </h2>
        <p className="kx-caption mt-1">
          Rate your organization&apos;s people-readiness for AI adoption
          across these dimensions.
        </p>
      </div>

      {DIMENSIONS.map((dimension) => (
        <label key={dimension.key} className="flex flex-col gap-1.5">
          <span className="kx-caption text-kx-grey">{dimension.label}</span>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={values[dimension.key]}
            onChange={(e) =>
              onChange({ [dimension.key]: Number(e.target.value) })
            }
            className="w-full accent-kx-gold"
          />
          <span className="kx-caption">{values[dimension.key]} / 5</span>
        </label>
      ))}
    </div>
  );
}
