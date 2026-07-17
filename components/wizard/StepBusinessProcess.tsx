"use client";

import type { DepartmentAnswer, Departments } from "../../lib/types/assessment";
import { DEPARTMENT_CONFIG } from "../../lib/constants/wizardOptions";

export interface StepBusinessProcessProps {
  values: Departments;
  onChange: (
    department: keyof Departments,
    payload: Partial<DepartmentAnswer>
  ) => void;
}

export default function StepBusinessProcess({
  values,
  onChange,
}: StepBusinessProcessProps) {
  const toggleCapability = (department: keyof Departments, capability: string) => {
    const current = values[department].capabilities;
    const next = current.includes(capability)
      ? current.filter((c) => c !== capability)
      : [...current, capability];
    onChange(department, { capabilities: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Business process maturity
        </h2>
        <p className="kx-caption mt-1">
          Rate each department&apos;s AI maturity and check off the
          capabilities already in place.
        </p>
      </div>

      {DEPARTMENT_CONFIG.map((dept) => (
        <div key={dept.key} className="flex flex-col gap-3 border-b border-kx-grey-200 pb-6">
          <h3 className="font-display text-kx-navy text-lg font-semibold">
            {dept.label}
          </h3>

          <label className="flex flex-col gap-1.5">
            <span className="kx-caption text-kx-grey">Maturity rating</span>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={values[dept.key].rating}
              onChange={(e) =>
                onChange(dept.key, { rating: Number(e.target.value) })
              }
              className="w-full accent-kx-gold"
            />
            <span className="kx-caption">{values[dept.key].rating} / 5</span>
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="kx-caption text-kx-grey mb-1">
              Capabilities in place
            </legend>
            <div className="flex flex-col gap-2">
              {dept.capabilities.map((capability) => (
                <label key={capability} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={values[dept.key].capabilities.includes(capability)}
                    onChange={() => toggleCapability(dept.key, capability)}
                    className="accent-kx-navy"
                  />
                  <span className="text-kx-navy text-sm">{capability}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ))}
    </div>
  );
}
