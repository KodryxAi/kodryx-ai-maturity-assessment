"use client";

import type { SecurityAnswers } from "../../lib/types/assessment";
import { SECURITY_CHECKLIST_OPTIONS } from "../../lib/constants/wizardOptions";

export interface StepSecurityProps {
  values: SecurityAnswers;
  onChange: (payload: Partial<SecurityAnswers>) => void;
}

export default function StepSecurity({
  values,
  onChange,
}: StepSecurityProps) {
  // No required field -- zero controls in place is a legitimate, if
  // concerning, answer.

  const toggleControl = (control: string) => {
    const next = values.checklist.includes(control)
      ? values.checklist.filter((c) => c !== control)
      : [...values.checklist, control];
    onChange({ checklist: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Security &amp; governance
        </h2>
        <p className="kx-caption mt-1">
          Check off the security and governance controls your organization
          already has in place.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          Controls in place
        </legend>
        <div className="flex flex-col gap-2">
          {SECURITY_CHECKLIST_OPTIONS.map((control) => (
            <label key={control} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.checklist.includes(control)}
                onChange={() => toggleControl(control)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{control}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
