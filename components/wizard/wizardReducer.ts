// State machine for the 10-step assessment wizard. Kept as a pure,
// dependency-free reducer so it is directly unit-testable (see
// wizardReducer.test.ts) independent of React rendering. This plan (02-01)
// wires the full 10-section WizardAnswers contract and the first 5 steps
// (Registration, CompanyProfile, BusinessProcess, Technology,
// DataReadiness); later plans in this phase add the remaining step
// components without touching this file's contract again.

import { DEPARTMENT_CONFIG } from "../../lib/constants/wizardOptions";
import type {
  AgentInterestAnswers,
  AiAdoptionAnswers,
  AutomationAnswers,
  CompanyProfileAnswers,
  ContactInfo,
  DataReadinessAnswers,
  DepartmentAnswer,
  Departments,
  EmployeeReadinessAnswers,
  SecurityAnswers,
  TechStackAnswers,
  WizardAnswers,
} from "../../lib/types/assessment";

/** Total navigable steps across the full 10-step wizard (final value). */
export const TOTAL_WIZARD_STEPS = 10;

export interface WizardState {
  stepIndex: number;
  answers: WizardAnswers;
}

export type WizardAction =
  | { type: "UPDATE_CONTACT"; payload: Partial<ContactInfo> }
  | { type: "UPDATE_COMPANY_PROFILE"; payload: Partial<CompanyProfileAnswers> }
  | {
      type: "UPDATE_DEPARTMENT";
      department: keyof Departments;
      payload: Partial<DepartmentAnswer>;
    }
  | { type: "UPDATE_TECH_STACK"; payload: Partial<TechStackAnswers> }
  | { type: "UPDATE_DATA_READINESS"; payload: Partial<DataReadinessAnswers> }
  | { type: "UPDATE_AI_ADOPTION"; payload: Partial<AiAdoptionAnswers> }
  | { type: "UPDATE_AUTOMATION"; payload: Partial<AutomationAnswers> }
  | { type: "UPDATE_AGENT_INTEREST"; payload: Partial<AgentInterestAnswers> }
  | { type: "UPDATE_SECURITY"; payload: Partial<SecurityAnswers> }
  | {
      type: "UPDATE_EMPLOYEE_READINESS";
      payload: Partial<EmployeeReadinessAnswers>;
    }
  | { type: "NEXT" }
  | { type: "BACK" };

const initialDepartments: Departments = DEPARTMENT_CONFIG.reduce(
  (acc, dept) => {
    acc[dept.key] = { rating: 0, capabilities: [] };
    return acc;
  },
  {} as Departments
);

export const initialWizardState: WizardState = {
  stepIndex: 0,
  answers: {
    contact: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      companyName: "",
    },
    companyProfile: {
      industry: "",
      employeeBand: "",
      revenueBand: "",
      businessModel: "",
      leadershipGoals: [],
      blendedHourlyCost: 0,
    },
    departments: initialDepartments,
    techStack: { systems: [], apiMaturity: "" },
    dataReadiness: { quality: 0, security: 0, accessibility: 0, knowledgeMgmt: 0 },
    aiAdoption: { toolsInUse: [], frequency: "" },
    automation: { processesAutomated: [] },
    agentInterest: { agentTypes: [] },
    security: { checklist: [] },
    employeeReadiness: {
      aiSkills: 0,
      training: 0,
      changeReadiness: 0,
      leadershipSupport: 0,
      innovationCulture: 0,
    },
  },
};

export function wizardReducer(
  state: WizardState,
  action: WizardAction
): WizardState {
  switch (action.type) {
    case "UPDATE_CONTACT":
      return {
        ...state,
        answers: {
          ...state.answers,
          contact: { ...state.answers.contact, ...action.payload },
        },
      };
    case "UPDATE_COMPANY_PROFILE":
      return {
        ...state,
        answers: {
          ...state.answers,
          companyProfile: {
            ...state.answers.companyProfile,
            ...action.payload,
          },
        },
      };
    case "UPDATE_DEPARTMENT":
      return {
        ...state,
        answers: {
          ...state.answers,
          departments: {
            ...state.answers.departments,
            [action.department]: {
              ...state.answers.departments[action.department],
              ...action.payload,
            },
          },
        },
      };
    case "UPDATE_TECH_STACK":
      return {
        ...state,
        answers: {
          ...state.answers,
          techStack: { ...state.answers.techStack, ...action.payload },
        },
      };
    case "UPDATE_DATA_READINESS":
      return {
        ...state,
        answers: {
          ...state.answers,
          dataReadiness: {
            ...state.answers.dataReadiness,
            ...action.payload,
          },
        },
      };
    case "UPDATE_AI_ADOPTION":
      return {
        ...state,
        answers: {
          ...state.answers,
          aiAdoption: { ...state.answers.aiAdoption, ...action.payload },
        },
      };
    case "UPDATE_AUTOMATION":
      return {
        ...state,
        answers: {
          ...state.answers,
          automation: { ...state.answers.automation, ...action.payload },
        },
      };
    case "UPDATE_AGENT_INTEREST":
      return {
        ...state,
        answers: {
          ...state.answers,
          agentInterest: {
            ...state.answers.agentInterest,
            ...action.payload,
          },
        },
      };
    case "UPDATE_SECURITY":
      return {
        ...state,
        answers: {
          ...state.answers,
          security: { ...state.answers.security, ...action.payload },
        },
      };
    case "UPDATE_EMPLOYEE_READINESS":
      return {
        ...state,
        answers: {
          ...state.answers,
          employeeReadiness: {
            ...state.answers.employeeReadiness,
            ...action.payload,
          },
        },
      };
    case "NEXT":
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, TOTAL_WIZARD_STEPS - 1),
      };
    case "BACK":
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    default:
      return state;
  }
}
