"use client";

import type { TechStackAnswers } from "../../lib/types/assessment";
import { API_MATURITY_OPTIONS, SYSTEMS_OPTIONS } from "../../lib/constants/wizardOptions";

export interface StepTechnologyProps {
  values: TechStackAnswers;
  onChange: (payload: Partial<TechStackAnswers>) => void;
}

const selectClassName =
  "rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none";

export default function StepTechnology({
  values,
  onChange,
}: StepTechnologyProps) {
  const toggleSystem = (system: string) => {
    const next = values.systems.includes(system)
      ? values.systems.filter((s) => s !== system)
      : [...values.systems, system];
    onChange({ systems: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Technology stack
        </h2>
        <p className="kx-caption mt-1">
          Tell us what systems you run today and how mature your API
          integrations are.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          Systems in use
        </legend>
        <div className="flex flex-col gap-2">
          {SYSTEMS_OPTIONS.map((system) => (
            <label key={system} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.systems.includes(system)}
                onChange={() => toggleSystem(system)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{system}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">API maturity</span>
        <select
          required
          value={values.apiMaturity}
          onChange={(e) => onChange({ apiMaturity: e.target.value })}
          className={selectClassName}
        >
          <option value="" disabled>
            Select a level
          </option>
          {API_MATURITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
