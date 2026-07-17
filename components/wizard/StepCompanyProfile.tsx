"use client";

import { useLayoutEffect, useState } from "react";
import type { CompanyProfileAnswers } from "../../lib/types/assessment";
import {
  BUSINESS_MODEL_OPTIONS,
  EMPLOYEE_BANDS,
  INDUSTRY_HOURLY_COST_DEFAULTS,
  INDUSTRY_OPTIONS,
  LEADERSHIP_GOALS,
  REVENUE_BANDS,
} from "../../lib/constants/companyProfile";

export interface StepCompanyProfileProps {
  values: CompanyProfileAnswers;
  onChange: (payload: Partial<CompanyProfileAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

const selectClassName =
  "rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none";

export default function StepCompanyProfile({
  values,
  onChange,
  onValidityChange,
}: StepCompanyProfileProps) {
  const [costManuallyEdited, setCostManuallyEdited] = useState(false);

  useLayoutEffect(() => {
    const valid =
      values.industry.trim().length > 0 &&
      values.employeeBand.trim().length > 0 &&
      values.revenueBand.trim().length > 0 &&
      values.businessModel.trim().length > 0 &&
      values.blendedHourlyCost > 0;
    onValidityChange(valid);
  }, [
    values.industry,
    values.employeeBand,
    values.revenueBand,
    values.businessModel,
    values.blendedHourlyCost,
    onValidityChange,
  ]);

  const handleIndustryChange = (industry: string) => {
    if (!costManuallyEdited) {
      onChange({
        industry,
        blendedHourlyCost: INDUSTRY_HOURLY_COST_DEFAULTS[industry] ?? 0,
      });
    } else {
      onChange({ industry });
    }
  };

  const handleCostChange = (raw: string) => {
    setCostManuallyEdited(true);
    onChange({ blendedHourlyCost: Number(raw) || 0 });
  };

  const toggleGoal = (goal: string) => {
    const next = values.leadershipGoals.includes(goal)
      ? values.leadershipGoals.filter((g) => g !== goal)
      : [...values.leadershipGoals, goal];
    onChange({ leadershipGoals: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          Your company profile
        </h2>
        <p className="kx-caption mt-1">
          This calibrates your score and ROI estimate against your industry
          and size.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Industry</span>
        <select
          required
          value={values.industry}
          onChange={(e) => handleIndustryChange(e.target.value)}
          className={selectClassName}
        >
          <option value="" disabled>
            Select an industry
          </option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Employee Count</span>
        <select
          required
          value={values.employeeBand}
          onChange={(e) => onChange({ employeeBand: e.target.value })}
          className={selectClassName}
        >
          <option value="" disabled>
            Select a range
          </option>
          {EMPLOYEE_BANDS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Annual Revenue</span>
        <select
          required
          value={values.revenueBand}
          onChange={(e) => onChange({ revenueBand: e.target.value })}
          className={selectClassName}
        >
          <option value="" disabled>
            Select a range
          </option>
          {REVENUE_BANDS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">Business Model</span>
        <select
          required
          value={values.businessModel}
          onChange={(e) => onChange({ businessModel: e.target.value })}
          className={selectClassName}
        >
          <option value="" disabled>
            Select a model
          </option>
          {BUSINESS_MODEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          Leadership Goals
        </legend>
        <div className="flex flex-col gap-2">
          {LEADERSHIP_GOALS.map((goal) => (
            <label key={goal} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.leadershipGoals.includes(goal)}
                onChange={() => toggleGoal(goal)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{goal}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1.5">
        <span className="kx-caption text-kx-grey">
          Blended Hourly Team Cost ($)
        </span>
        <input
          type="number"
          required
          min={1}
          value={values.blendedHourlyCost || ""}
          onChange={(e) => handleCostChange(e.target.value)}
          className={selectClassName}
        />
      </label>
    </div>
  );
}
