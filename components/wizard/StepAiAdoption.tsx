"use client";

import { useEffect } from "react";
import type { AiAdoptionAnswers } from "../../lib/types/assessment";
import {
  AI_ADOPTION_FREQUENCY_OPTIONS,
  AI_TOOLS_OPTIONS,
} from "../../lib/constants/wizardOptions";

export interface StepAiAdoptionProps {
  values: AiAdoptionAnswers;
  onChange: (payload: Partial<AiAdoptionAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

const selectClassName =
  "rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none";

export default function StepAiAdoption({
  values,
  onChange,
  onValidityChange,
}: StepAiAdoptionProps) {
  // Tools selection is optional -- 0 tools selected is a legitimate answer.
  // "Never" is itself a valid, selectable frequency option, so the
  // requirement is only that some option was chosen.
  useEffect(() => {
    onValidityChange(values.frequency.trim().length > 0);
  }, [values.frequency, onValidityChange]);

  const toggleTool = (tool: string) => {
    const next = values.toolsInUse.includes(tool)
      ? values.toolsInUse.filter((t) => t !== tool)
      : [...values.toolsInUse, tool];
    onChange({ toolsInUse: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          AI adoption
        </h2>
        <p className="kx-caption mt-1">
          Tell us which AI tools your team uses today and how often.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          AI tools in use
        </legend>
        <div className="flex flex-col gap-2">
          {AI_TOOLS_OPTIONS.map((tool) => (
            <label key={tool} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.toolsInUse.includes(tool)}
                onChange={() => toggleTool(tool)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{tool}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Usage frequency</span>
        <select
          required
          value={values.frequency}
          onChange={(e) => onChange({ frequency: e.target.value })}
          className={selectClassName}
        >
          <option value="" disabled>
            Select a frequency
          </option>
          {AI_ADOPTION_FREQUENCY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
