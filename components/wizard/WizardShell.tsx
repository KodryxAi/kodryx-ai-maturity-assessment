"use client";

import { useEffect, useReducer, useState } from "react";
import type { WizardAnswers } from "../../lib/types/assessment";
import ProgressBar from "./ProgressBar";
import StepRegistration from "./StepRegistration";
import StepCompanyProfile from "./StepCompanyProfile";
import StepBusinessProcess from "./StepBusinessProcess";
import StepTechnology from "./StepTechnology";
import StepDataReadiness from "./StepDataReadiness";
import StepAiAdoption from "./StepAiAdoption";
import StepAutomation from "./StepAutomation";
import StepAgentInterest from "./StepAgentInterest";
import StepSecurity from "./StepSecurity";
import StepEmployeeReadiness from "./StepEmployeeReadiness";
import { initialWizardState, TOTAL_WIZARD_STEPS, wizardReducer } from "./wizardReducer";

export type WizardSubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export interface WizardShellProps {
  onSubmit: (answers: WizardAnswers) => Promise<WizardSubmitResult>;
}

export default function WizardShell({ onSubmit }: WizardShellProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // 200ms fade + small slide on every step change, per brand motion rules
  // (no bounce, no large translate).
  useEffect(() => {
    setFadeIn(false);
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [state.stepIndex]);

  // Re-evaluate validity whenever the step changes, since the previous
  // step's validity callback does not apply to the newly rendered step
  // until it reports in.
  useEffect(() => {
    setIsCurrentStepValid(false);
    setError(null);
  }, [state.stepIndex]);

  const handleBack = () => dispatch({ type: "BACK" });

  const handleNext = () => {
    if (!isCurrentStepValid) return;
    dispatch({ type: "NEXT" });
  };

  const handleSubmit = async () => {
    if (!isCurrentStepValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(state.answers);
      if (!result.ok) {
        setError(result.error);
      }
      // On success, this plan does not navigate — the real onSubmit
      // implementation (Plan 01-04) owns the redirect once wired.
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = state.stepIndex === TOTAL_WIZARD_STEPS - 1;

  const renderStep = () => {
    switch (state.stepIndex) {
      case 0:
        return (
          <StepRegistration
            values={state.answers.contact}
            onChange={(payload) => dispatch({ type: "UPDATE_CONTACT", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 1:
        return (
          <StepCompanyProfile
            values={state.answers.companyProfile}
            onChange={(payload) =>
              dispatch({ type: "UPDATE_COMPANY_PROFILE", payload })
            }
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 2:
        return (
          <StepBusinessProcess
            values={state.answers.departments}
            onChange={(department, payload) =>
              dispatch({ type: "UPDATE_DEPARTMENT", department, payload })
            }
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 3:
        return (
          <StepTechnology
            values={state.answers.techStack}
            onChange={(payload) => dispatch({ type: "UPDATE_TECH_STACK", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 4:
        return (
          <StepDataReadiness
            values={state.answers.dataReadiness}
            onChange={(payload) => dispatch({ type: "UPDATE_DATA_READINESS", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 5:
        return (
          <StepAiAdoption
            values={state.answers.aiAdoption}
            onChange={(payload) => dispatch({ type: "UPDATE_AI_ADOPTION", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 6:
        return (
          <StepAutomation
            values={state.answers.automation}
            onChange={(payload) => dispatch({ type: "UPDATE_AUTOMATION", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 7:
        return (
          <StepAgentInterest
            values={state.answers.agentInterest}
            onChange={(payload) => dispatch({ type: "UPDATE_AGENT_INTEREST", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 8:
        return (
          <StepSecurity
            values={state.answers.security}
            onChange={(payload) => dispatch({ type: "UPDATE_SECURITY", payload })}
            onValidityChange={setIsCurrentStepValid}
          />
        );
      case 9:
        return (
          <StepEmployeeReadiness
            values={state.answers.employeeReadiness}
            onChange={(payload) =>
              dispatch({ type: "UPDATE_EMPLOYEE_READINESS", payload })
            }
            onValidityChange={setIsCurrentStepValid}
          />
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-6 py-16">
      <ProgressBar stepIndex={state.stepIndex} totalSteps={TOTAL_WIZARD_STEPS} />

      <div
        key={state.stepIndex}
        className={`transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
          fadeIn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {renderStep()}
      </div>

      {error ? <p className="kx-caption text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={state.stepIndex === 0}
          className="rounded-md border border-kx-grey-200 px-6 py-3 text-kx-navy transition-colors duration-200 hover:border-kx-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={!isCurrentStepValid || submitting}
          className="rounded-md bg-kx-navy px-6 py-3 text-white transition-colors duration-200 hover:bg-kx-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastStep ? (submitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </div>
  );
}
