"use client";

import { useReducer, useState } from "react";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStepValid(stepIndex: number, answers: WizardAnswers): boolean {
  if (stepIndex === 0) {
    return (
      answers.contact.contactName.trim().length > 0 &&
      EMAIL_RE.test(answers.contact.contactEmail) &&
      answers.contact.companyName.trim().length > 0
    );
  }
  if (stepIndex === 1) {
    return (
      answers.companyProfile.industry.length > 0 &&
      answers.companyProfile.employeeBand.length > 0 &&
      answers.companyProfile.revenueBand.length > 0 &&
      answers.companyProfile.businessModel.length > 0 &&
      answers.companyProfile.blendedHourlyCost > 0
    );
  }
  return true;
}

export default function WizardShell({ onSubmit }: WizardShellProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeKey, setFadeKey] = useState(0);

  const stepIndex = state.stepIndex;
  const valid = isStepValid(stepIndex, state.answers);
  const last = stepIndex === TOTAL_WIZARD_STEPS - 1;

  function goNext() {
    if (!valid) return;
    setError(null);
    setFadeKey((k) => k + 1);
    dispatch({ type: "NEXT" });
  }

  function goBack() {
    if (stepIndex <= 0) return;
    setError(null);
    setFadeKey((k) => k + 1);
    dispatch({ type: "BACK" });
  }

  async function doSubmit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await onSubmit(state.answers);
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
  switch (stepIndex) {
    case 0:
      stepContent = (
        <StepRegistration
          values={state.answers.contact}
          onChange={(payload) => dispatch({ type: "UPDATE_CONTACT", payload })}
        />
      );
      break;
    case 1:
      stepContent = (
        <StepCompanyProfile
          values={state.answers.companyProfile}
          onChange={(payload) => dispatch({ type: "UPDATE_COMPANY_PROFILE", payload })}
        />
      );
      break;
    case 2:
      stepContent = (
        <StepBusinessProcess
          values={state.answers.departments}
          onChange={(department, payload) => dispatch({ type: "UPDATE_DEPARTMENT", department, payload })}
        />
      );
      break;
    case 3:
      stepContent = (
        <StepTechnology
          values={state.answers.techStack}
          onChange={(payload) => dispatch({ type: "UPDATE_TECH_STACK", payload })}
        />
      );
      break;
    case 4:
      stepContent = (
        <StepDataReadiness
          values={state.answers.dataReadiness}
          onChange={(payload) => dispatch({ type: "UPDATE_DATA_READINESS", payload })}
        />
      );
      break;
    case 5:
      stepContent = (
        <StepAiAdoption
          values={state.answers.aiAdoption}
          onChange={(payload) => dispatch({ type: "UPDATE_AI_ADOPTION", payload })}
        />
      );
      break;
    case 6:
      stepContent = (
        <StepAutomation
          values={state.answers.automation}
          onChange={(payload) => dispatch({ type: "UPDATE_AUTOMATION", payload })}
        />
      );
      break;
    case 7:
      stepContent = (
        <StepAgentInterest
          values={state.answers.agentInterest}
          onChange={(payload) => dispatch({ type: "UPDATE_AGENT_INTEREST", payload })}
        />
      );
      break;
    case 8:
      stepContent = (
        <StepSecurity
          values={state.answers.security}
          onChange={(payload) => dispatch({ type: "UPDATE_SECURITY", payload })}
        />
      );
      break;
    case 9:
      stepContent = (
        <StepEmployeeReadiness
          values={state.answers.employeeReadiness}
          onChange={(payload) => dispatch({ type: "UPDATE_EMPLOYEE_READINESS", payload })}
        />
      );
      break;
    default:
      stepContent = null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-6 py-16">
      <ProgressBar stepIndex={stepIndex} totalSteps={TOTAL_WIZARD_STEPS} />

      <div key={fadeKey} className="animate-fade-in-up">
        {stepContent}
      </div>

      {error ? <p className="kx-caption text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="rounded-md border border-kx-grey-200 px-6 py-3 text-kx-navy transition-colors duration-200 hover:border-kx-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={last ? doSubmit : goNext}
          disabled={!valid || submitting}
          className="rounded-md bg-kx-navy px-6 py-3 text-white transition-colors duration-200 hover:bg-kx-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {last ? (submitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </div>
  );
}
