"use client";

import { useReducer, useRef, useState } from "react";
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
  const [fadeKey, setFadeKey] = useState(0);

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const isLastStep = state.stepIndex === TOTAL_WIZARD_STEPS - 1;

  function goNext() {
    if (!isCurrentStepValid) return;
    setError(null);
    setFadeKey((k) => k + 1);
    dispatch({ type: "NEXT" });
  }

  function goBack() {
    if (state.stepIndex <= 0) return;
    setError(null);
    setFadeKey((k) => k + 1);
    dispatch({ type: "BACK" });
  }

  async function goSubmit() {
    if (!isCurrentStepValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmitRef.current(state.answers);
      if (!result.ok) {
        setError(result.error);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  let stepContent: React.ReactNode;
  switch (state.stepIndex) {
    case 0:
      stepContent = (
        <StepRegistration
          key="step-0"
          values={state.answers.contact}
          onChange={(p) => dispatch({ type: "UPDATE_CONTACT", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 1:
      stepContent = (
        <StepCompanyProfile
          key="step-1"
          values={state.answers.companyProfile}
          onChange={(p) => dispatch({ type: "UPDATE_COMPANY_PROFILE", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 2:
      stepContent = (
        <StepBusinessProcess
          key="step-2"
          values={state.answers.departments}
          onChange={(d, p) => dispatch({ type: "UPDATE_DEPARTMENT", department: d, payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 3:
      stepContent = (
        <StepTechnology
          key="step-3"
          values={state.answers.techStack}
          onChange={(p) => dispatch({ type: "UPDATE_TECH_STACK", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 4:
      stepContent = (
        <StepDataReadiness
          key="step-4"
          values={state.answers.dataReadiness}
          onChange={(p) => dispatch({ type: "UPDATE_DATA_READINESS", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 5:
      stepContent = (
        <StepAiAdoption
          key="step-5"
          values={state.answers.aiAdoption}
          onChange={(p) => dispatch({ type: "UPDATE_AI_ADOPTION", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 6:
      stepContent = (
        <StepAutomation
          key="step-6"
          values={state.answers.automation}
          onChange={(p) => dispatch({ type: "UPDATE_AUTOMATION", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 7:
      stepContent = (
        <StepAgentInterest
          key="step-7"
          values={state.answers.agentInterest}
          onChange={(p) => dispatch({ type: "UPDATE_AGENT_INTEREST", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 8:
      stepContent = (
        <StepSecurity
          key="step-8"
          values={state.answers.security}
          onChange={(p) => dispatch({ type: "UPDATE_SECURITY", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    case 9:
      stepContent = (
        <StepEmployeeReadiness
          key="step-9"
          values={state.answers.employeeReadiness}
          onChange={(p) => dispatch({ type: "UPDATE_EMPLOYEE_READINESS", payload: p })}
          onValidityChange={setIsCurrentStepValid}
        />
      );
      break;
    default:
      stepContent = null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-6 py-16">
      <ProgressBar stepIndex={state.stepIndex} totalSteps={TOTAL_WIZARD_STEPS} />

      <div key={fadeKey} className="animate-fade-in-up">
        {stepContent}
      </div>

      {error ? <p className="kx-caption text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={state.stepIndex === 0}
          className="rounded-md border border-kx-grey-200 px-6 py-3 text-kx-navy transition-colors duration-200 hover:border-kx-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={isLastStep ? goSubmit : goNext}
          disabled={!isCurrentStepValid || submitting}
          className="rounded-md bg-kx-navy px-6 py-3 text-white transition-colors duration-200 hover:bg-kx-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLastStep ? (submitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </div>
  );
}
