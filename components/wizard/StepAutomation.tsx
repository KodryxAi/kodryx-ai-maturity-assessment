"use client";

import type { AutomationAnswers } from "../../lib/types/assessment";
import { AUTOMATION_PROCESS_OPTIONS } from "../../lib/constants/wizardOptions";

export interface StepAutomationProps {
  values: AutomationAnswers;
  onChange: (payload: Partial<AutomationAnswers>) => void;
}

export default function StepAutomation({
  values,
  onChange,
}: StepAutomationProps) {
  // No required field -- zero automated processes is a legitimate answer
  // for an early-stage company.

  const toggleProcess = (process: string) => {
    const next = values.processesAutomated.includes(process)
      ? values.processesAutomated.filter((p) => p !== process)
      : [...values.processesAutomated, process];
    onChange({ processesAutomated: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Automation
        </h2>
        <p className="kx-caption mt-1">
          Select the business processes you have already automated.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          Automated processes
        </legend>
        <div className="flex flex-col gap-2">
          {AUTOMATION_PROCESS_OPTIONS.map((process) => (
            <label key={process} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.processesAutomated.includes(process)}
                onChange={() => toggleProcess(process)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{process}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
