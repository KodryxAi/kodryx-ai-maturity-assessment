// Shared TS contracts consumed by the wizard, scoring engine, API routes,
// and results/report pages across all phases of this project.

export interface ContactInfo {
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  companyName: string;
}

export interface CompanyProfileAnswers {
  industry: string;
  employeeBand: string;
  revenueBand: string;
  businessModel: string;
  leadershipGoals: string[];
  blendedHourlyCost: number;
}

export interface WizardAnswers {
  contact: ContactInfo;
  companyProfile: CompanyProfileAnswers;
  departments: Departments;
  techStack: TechStackAnswers;
  dataReadiness: DataReadinessAnswers;
  aiAdoption: AiAdoptionAnswers;
  automation: AutomationAnswers;
  agentInterest: AgentInterestAnswers;
  security: SecurityAnswers;
  employeeReadiness: EmployeeReadinessAnswers;
}

/** The 10 scoring categories from the design spec's scoring engine. */
export type CategoryKey =
  | "businessProcess"
  | "technology"
  | "data"
  | "aiAdoption"
  | "automation"
  | "aiAgents"
  | "security"
  | "people"
  | "leadership"
  | "innovation";

export type CategoryScores = Record<CategoryKey, number>;

export interface Stage {
  level: number;
  label: string;
  whatThisMeans: string;
  whatsNext: string;
}

/** Per-department maturity rating + capability checklist (Step 2). */
export interface DepartmentAnswer {
  rating: number;
  capabilities: string[];
}

export type Departments = Record<
  "sales" | "marketing" | "hr" | "finance" | "operations" | "support",
  DepartmentAnswer
>;

export interface TechStackAnswers {
  systems: string[];
  apiMaturity: string;
}

export interface DataReadinessAnswers {
  quality: number;
  security: number;
  accessibility: number;
  knowledgeMgmt: number;
}

export interface AiAdoptionAnswers {
  toolsInUse: string[];
  frequency: string;
}

export interface AutomationAnswers {
  processesAutomated: string[];
}

export interface AgentInterestAnswers {
  agentTypes: string[];
}

export interface SecurityAnswers {
  checklist: string[];
}

export interface EmployeeReadinessAnswers {
  aiSkills: number;
  training: number;
  changeReadiness: number;
  leadershipSupport: number;
  innovationCulture: number;
}

/**
 * The shape the scoring engine reads. Mirrors every JSON column on
 * `Assessment`. `companyProfile` is the only section collected (and
 * therefore required) in Phase 1; every other section is optional until
 * its wizard step is built in Phase 2.
 */
export interface ScoringInput {
  companyProfile: CompanyProfileAnswers;
  departments?: Departments;
  techStack?: TechStackAnswers;
  dataReadiness?: DataReadinessAnswers;
  aiAdoption?: AiAdoptionAnswers;
  automation?: AutomationAnswers;
  agentInterest?: AgentInterestAnswers;
  security?: SecurityAnswers;
  employeeReadiness?: EmployeeReadinessAnswers;
}
