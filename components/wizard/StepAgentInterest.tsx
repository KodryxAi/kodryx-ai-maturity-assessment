"use client";

import { useRef } from "react";
import type { AgentInterestAnswers } from "../../lib/types/assessment";
import { AGENT_TYPE_OPTIONS } from "../../lib/constants/wizardOptions";

export interface StepAgentInterestProps {
  values: AgentInterestAnswers;
  onChange: (payload: Partial<AgentInterestAnswers>) => void;
  onValidityChange: (valid: boolean) => void;
}

export default function StepAgentInterest({
  values,
  onChange,
  onValidityChange,
}: StepAgentInterestProps) {
  const _vr = useRef(false);
  if (!_vr.current) { _vr.current = true; onValidityChange(true); }
  // No required field -- zero agent types selected is a legitimate answer.

  const toggleAgentType = (agentType: string) => {
    const next = values.agentTypes.includes(agentType)
      ? values.agentTypes.filter((a) => a !== agentType)
      : [...values.agentTypes, agentType];
    onChange({ agentTypes: next });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-kx-navy text-2xl font-semibold">
          AI agent interest
        </h2>
        <p className="kx-caption mt-1">
          This step identifies which AI agent types would be valuable for
          your business -- not what you use today, but where you see
          opportunity.
        </p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="kx-caption text-kx-grey mb-1">
          Agent types of interest
        </legend>
        <div className="flex flex-col gap-2">
          {AGENT_TYPE_OPTIONS.map((agentType) => (
            <label key={agentType} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={values.agentTypes.includes(agentType)}
                onChange={() => toggleAgentType(agentType)}
                className="accent-kx-navy"
              />
              <span className="text-kx-navy text-sm">{agentType}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
