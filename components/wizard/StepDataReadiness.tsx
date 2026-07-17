"use client";

import { useLayoutEffect } from "react";
import type { DataReadinessAnswers } from "../../lib/types/assessment";

export interface StepDataReadinessProps {
  values: DataReadinessAnswers;
  onChange: (payload: Partial<DataReadinessAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

const DIMENSIONS: { key: keyof DataReadinessAnswers; label: string }[] = [
  { key: "quality", label: "Data Quality" },
  { key: "security", label: "Data Security" },
  { key: "accessibility", label: "Data Accessibility" },
  { key: "knowledgeMgmt", label: "Knowledge Management" },
];

export default function StepDataReadiness({
  values,
  onChange,
  onValidityChange,
}: StepDataReadinessProps) {
  // All 4 sliders always have a default value -- no blocking requirement,
  // matching StepBusinessProcess.tsx's rule.
  useLayoutEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Data readiness
        </h2>
        <p className="kx-caption mt-1">
          Rate how ready your organization&apos;s data is to power AI
          initiatives.
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
