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
  switch (stepIndex) {
    case 0:
      return (
        answers.contact.contactName.trim().length > 0 &&
        EMAIL_RE.test(answers.contact.contactEmail) &&
        answers.contact.companyName.trim().length > 0
      );
    case 1:
      return (
        (answers.companyProfile.industry as string).length > 0 &&
        (answers.companyProfile.employeeBand as string).length > 0 &&
        (answers.companyProfile.revenueBand as string).length > 0 &&
        (answers.companyProfile.businessModel as string).length > 0 &&
        answers.companyProfile.blendedHourlyCost > 0
      );
    default:
      return true;
  }
}

export default function WizardShell({ onSubmit }: WizardShellProps) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fadeKey, setFadeKey] = useState(0);

  const isCurrentStepValid = isStepValid(state.stepIndex, state.answers);
  const isLastStep = state.stepIndex === TOTAL_WIZARD_STEPS - 1;

  const goToStep = (nextIndex: number) => {
    setError(null);
    setFadeKey((k) => k + 1);
    if (nextIndex > state.stepIndex) {
      dispatch({ type: "NEXT" });
    } else {
      dispatch({ type: "BACK" });
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid) return;
    goToStep(state.stepIndex + 1);
  };

  const handleBack = () => {
    if (state.stepIndex <= 0) return;
    goToStep(state.stepIndex - 1);
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
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    const noopOnChange = () => {};
    switch (state.stepIndex) {
      case 0:
        return (
          <StepRegistration
            values={state.answers.contact}
            onChange={(payload) => dispatch({ type: "UPDATE_CONTACT", payload })}
          />
        );
      case 1:
        return (
          <StepCompanyProfile
            values={state.answers.companyProfile}
            onChange={(payload) =>
              dispatch({ type: "UPDATE_COMPANY_PROFILE", payload })
            }
          />
        );
      case 2:
        return (
          <StepBusinessProcess
            values={state.answers.departments}
            onChange={(department, payload) =>
              dispatch({ type: "UPDATE_DEPARTMENT", department, payload })
            }
          />
        );
      case 3:
        return (
          <StepTechnology
            values={state.answers.techStack}
            onChange={(payload) => dispatch({ type: "UPDATE_TECH_STACK", payload })}
          />
        );
      case 4:
        return (
          <StepDataReadiness
            values={state.answers.dataReadiness}
            onChange={(payload) => dispatch({ type: "UPDATE_DATA_READINESS", payload })}
          />
        );
      case 5:
        return (
          <StepAiAdoption
            values={state.answers.aiAdoption}
            onChange={(payload) => dispatch({ type: "UPDATE_AI_ADOPTION", payload })}
          />
        );
      case 6:
        return (
          <StepAutomation
            values={state.answers.automation}
            onChange={(payload) => dispatch({ type: "UPDATE_AUTOMATION", payload })}
          />
        );
      case 7:
        return (
          <StepAgentInterest
            values={state.answers.agentInterest}
            onChange={(payload) => dispatch({ type: "UPDATE_AGENT_INTEREST", payload })}
          />
        );
      case 8:
        return (
          <StepSecurity
            values={state.answers.security}
            onChange={(payload) => dispatch({ type: "UPDATE_SECURITY", payload })}
          />
        );
      case 9:
        return (
          <StepEmployeeReadiness
            values={state.answers.employeeReadiness}
            onChange={(payload) =>
              dispatch({ type: "UPDATE_EMPLOYEE_READINESS", payload })
            }
          />
        );
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8 px-6 py-16">
      <ProgressBar stepIndex={state.stepIndex} totalSteps={TOTAL_WIZARD_STEPS} />

      <div
        key={fadeKey}
        className="animate-fade-in-up"
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
