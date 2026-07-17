"use client";

import { useRef, useState } from "react";
import type { CompanyProfileAnswers } from "../../lib/types/assessment";
import { BUSINESS_MODEL_OPTIONS, EMPLOYEE_BANDS, INDUSTRY_HOURLY_COST_DEFAULTS, INDUSTRY_OPTIONS, LEADERSHIP_GOALS, REVENUE_BANDS } from "../../lib/constants/companyProfile";

export interface StepCompanyProfileProps {
  values: CompanyProfileAnswers;
  onChange: (payload: Partial<CompanyProfileAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

const selectClassName = "rounded-sm border border-kx-grey-200 px-3 py-2 transition-colors duration-200 focus:border-kx-gold focus:outline-none";

export default function StepCompanyProfile({ values, onChange, onValidityChange }: StepCompanyProfileProps) {
  const [costEdited, setCostEdited] = useState(false);
  const lastValid = useRef<boolean | null>(null);

  const valid =
    values.industry.length > 0 &&
    values.employeeBand.length > 0 &&
    values.revenueBand.length > 0 &&
    values.businessModel.length > 0 &&
    values.blendedHourlyCost > 0;

  if (lastValid.current !== valid) {
    lastValid.current = valid;
    onValidityChange(valid);
  }

  const handleIndustry = (v: string) => {
    if (!costEdited) onChange({ industry: v, blendedHourlyCost: INDUSTRY_HOURLY_COST_DEFAULTS[v] ?? 0 });
    else onChange({ industry: v });
  };

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="font-display text-kx-navy text-2xl font-semibold">Your company profile</h2><p className="kx-caption mt-1">This calibrates your score and ROI estimate against your industry and size.</p></div>
      <label className="flex flex-col gap-1.5"><span className="kx-caption text-kx-grey">Industry</span><select required value={values.industry} onChange={(e) => handleIndustry(e.target.value)} className={selectClassName}><option value="" disabled>Select an industry</option>{INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
      <label className="flex flex-col gap-1.5"><span className="kx-caption text-kx-grey">Employee Count</span><select required value={values.employeeBand} onChange={(e) => onChange({ employeeBand: e.target.value })} className={selectClassName}><option value="" disabled>Select a range</option>{EMPLOYEE_BANDS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
      <label className="flex flex-col gap-1.5"><span className="kx-caption text-kx-grey">Annual Revenue</span><select required value={values.revenueBand} onChange={(e) => onChange({ revenueBand: e.target.value })} className={selectClassName}><option value="" disabled>Select a range</option>{REVENUE_BANDS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
      <label className="flex flex-col gap-1.5"><span className="kx-caption text-kx-grey">Business Model</span><select required value={values.businessModel} onChange={(e) => onChange({ businessModel: e.target.value })} className={selectClassName}><option value="" disabled>Select a model</option>{BUSINESS_MODEL_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></label>
      <fieldset className="flex flex-col gap-2"><legend className="kx-caption text-kx-grey mb-1">Leadership Goals</legend><div className="flex flex-col gap-2">{LEADERSHIP_GOALS.map((g) => (<label key={g} className="flex items-center gap-2"><input type="checkbox" checked={values.leadershipGoals.includes(g)} onChange={() => { const next = values.leadershipGoals.includes(g) ? values.leadershipGoals.filter((x) => x !== g) : [...values.leadershipGoals, g]; onChange({ leadershipGoals: next }); }} className="accent-kx-navy" /><span className="text-kx-navy text-sm">{g}</span></label>))}</div></fieldset>
      <label className="flex flex-col gap-1.5"><span className="kx-caption text-kx-grey">Blended Hourly Team Cost ($)</span><input type="number" required min={1} value={values.blendedHourlyCost || ""} onChange={(e) => { setCostEdited(true); onChange({ blendedHourlyCost: Number(e.target.value) || 0 }); }} className={selectClassName} /></label>
    </div>
  );
}
