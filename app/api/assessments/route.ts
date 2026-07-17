import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import {
  BUSINESS_MODEL_OPTIONS,
  EMPLOYEE_BANDS,
  INDUSTRY_OPTIONS,
  LEADERSHIP_GOALS,
  REVENUE_BANDS,
} from "../../../lib/constants/companyProfile";
import {
  AGENT_TYPE_OPTIONS,
  AI_ADOPTION_FREQUENCY_OPTIONS,
  AI_TOOLS_OPTIONS,
  API_MATURITY_OPTIONS,
  AUTOMATION_PROCESS_OPTIONS,
  DEPARTMENT_CONFIG,
  SECURITY_CHECKLIST_OPTIONS,
  SYSTEMS_OPTIONS,
} from "../../../lib/constants/wizardOptions";
import { calculateCategoryScores, calculateTotalScore } from "../../../lib/scoring/calculateScore";
import { computeDataCompleteness } from "../../../lib/scoring/completeness";
import { getStage } from "../../../lib/scoring/stage";
import { getBenchmark } from "../../../lib/scoring/benchmark";
import { generateSwot } from "../../../lib/scoring/swot";
import { assessRisk } from "../../../lib/scoring/risk";
import { generateRoi } from "../../../lib/scoring/roi";
import { generateRoadmap } from "../../../lib/scoring/roadmap";
import { generateOpportunityMatrix } from "../../../lib/scoring/opportunityMatrix";
import { getFirstMoves } from "../../../lib/scoring/firstMoves";
import { generateExecutiveSummary } from "../../../lib/scoring/executiveSummary";
import type {
  AgentInterestAnswers,
  AiAdoptionAnswers,
  AutomationAnswers,
  Departments,
  DataReadinessAnswers,
  EmployeeReadinessAnswers,
  ScoringInput,
  SecurityAnswers,
  TechStackAnswers,
  WizardAnswers,
} from "../../../lib/types/assessment";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function invalid(field: string) {
  return NextResponse.json({ error: `${field} is invalid` }, { status: 400 });
}

function isFiniteInRange(value: unknown, min: number, max: number): value is number {
  return (
    typeof value === "number" && Number.isFinite(value) && value >= min && value <= max
  );
}

/** Every entry must be a member of `options` and no entry may repeat (prevents ratio-inflating duplicates). */
function isSubsetNoDuplicates(value: unknown, options: readonly string[]): value is string[] {
  if (!Array.isArray(value)) return false;
  if (!value.every((entry) => typeof entry === "string" && options.includes(entry))) {
    return false;
  }
  return new Set(value).size === value.length;
}

export async function POST(request: Request) {
  let body: Partial<WizardAnswers>;
  try {
    body = await request.json();
  } catch {
    return invalid("request body");
  }

  const contact = body?.contact;
  const companyProfile = body?.companyProfile;

  if (!contact || typeof contact.contactName !== "string" || contact.contactName.trim() === "") {
    return invalid("contact.contactName");
  }
  if (!contact || typeof contact.contactEmail !== "string" || !EMAIL_RE.test(contact.contactEmail)) {
    return invalid("contact.contactEmail");
  }
  if (!contact || typeof contact.companyName !== "string" || contact.companyName.trim() === "") {
    return invalid("contact.companyName");
  }
  if (!companyProfile || typeof companyProfile !== "object") {
    return invalid("companyProfile");
  }
  if (!(INDUSTRY_OPTIONS as readonly string[]).includes(companyProfile.industry)) {
    return invalid("companyProfile.industry");
  }
  if (!(EMPLOYEE_BANDS as readonly string[]).includes(companyProfile.employeeBand)) {
    return invalid("companyProfile.employeeBand");
  }
  if (!(REVENUE_BANDS as readonly string[]).includes(companyProfile.revenueBand)) {
    return invalid("companyProfile.revenueBand");
  }
  if (!(BUSINESS_MODEL_OPTIONS as readonly string[]).includes(companyProfile.businessModel)) {
    return invalid("companyProfile.businessModel");
  }
  if (
    !Array.isArray(companyProfile.leadershipGoals) ||
    !companyProfile.leadershipGoals.every((goal: string) =>
      (LEADERSHIP_GOALS as readonly string[]).includes(goal)
    )
  ) {
    return invalid("companyProfile.leadershipGoals");
  }
  if (
    typeof companyProfile.blendedHourlyCost !== "number" ||
    !Number.isFinite(companyProfile.blendedHourlyCost) ||
    companyProfile.blendedHourlyCost <= 0
  ) {
    return invalid("companyProfile.blendedHourlyCost");
  }

  const departments = body?.departments as Departments | undefined;
  const techStack = body?.techStack as TechStackAnswers | undefined;
  const dataReadiness = body?.dataReadiness as DataReadinessAnswers | undefined;
  const aiAdoption = body?.aiAdoption as AiAdoptionAnswers | undefined;
  const automation = body?.automation as AutomationAnswers | undefined;
  const agentInterest = body?.agentInterest as AgentInterestAnswers | undefined;
  const security = body?.security as SecurityAnswers | undefined;
  const employeeReadiness = body?.employeeReadiness as EmployeeReadinessAnswers | undefined;

  const departmentKeys = DEPARTMENT_CONFIG.map((dept) => dept.key);
  if (!departments || typeof departments !== "object") {
    return invalid("departments");
  }
  if (
    departmentKeys.length !== Object.keys(departments).length ||
    !departmentKeys.every((key) => key in departments)
  ) {
    return invalid("departments");
  }
  for (const dept of DEPARTMENT_CONFIG) {
    const answer = departments[dept.key];
    if (!answer || !isFiniteInRange(answer.rating, 0, 5)) {
      return invalid("departments");
    }
    if (!isSubsetNoDuplicates(answer.capabilities, dept.capabilities)) {
      return invalid("departments");
    }
  }

  if (
    !techStack ||
    !isSubsetNoDuplicates(techStack.systems, SYSTEMS_OPTIONS) ||
    !(API_MATURITY_OPTIONS as readonly string[]).includes(techStack.apiMaturity || "Legacy")
  ) {
    return invalid("techStack");
  }

  if (
    !dataReadiness ||
    !isFiniteInRange(dataReadiness.quality, 0, 5) ||
    !isFiniteInRange(dataReadiness.security, 0, 5) ||
    !isFiniteInRange(dataReadiness.accessibility, 0, 5) ||
    !isFiniteInRange(dataReadiness.knowledgeMgmt, 0, 5)
  ) {
    return invalid("dataReadiness");
  }

  if (
    !aiAdoption ||
    !isSubsetNoDuplicates(aiAdoption.toolsInUse, AI_TOOLS_OPTIONS) ||
    !(AI_ADOPTION_FREQUENCY_OPTIONS as readonly string[]).includes(aiAdoption.frequency || "Never")
  ) {
    return invalid("aiAdoption");
  }

  if (
    !automation ||
    !isSubsetNoDuplicates(automation.processesAutomated, AUTOMATION_PROCESS_OPTIONS)
  ) {
    return invalid("automation");
  }

  if (
    !agentInterest ||
    !isSubsetNoDuplicates(agentInterest.agentTypes, AGENT_TYPE_OPTIONS)
  ) {
    return invalid("agentInterest");
  }

  if (!security || !isSubsetNoDuplicates(security.checklist, SECURITY_CHECKLIST_OPTIONS)) {
    return invalid("security");
  }

  if (
    !employeeReadiness ||
    !isFiniteInRange(employeeReadiness.aiSkills, 0, 5) ||
    !isFiniteInRange(employeeReadiness.training, 0, 5) ||
    !isFiniteInRange(employeeReadiness.changeReadiness, 0, 5) ||
    !isFiniteInRange(employeeReadiness.leadershipSupport, 0, 5) ||
    !isFiniteInRange(employeeReadiness.innovationCulture, 0, 5)
  ) {
    return invalid("employeeReadiness");
  }

  if (!techStack.apiMaturity) techStack.apiMaturity = "Legacy";
  if (!aiAdoption.frequency) aiAdoption.frequency = "Never";

  const scoringInput: ScoringInput = {
    companyProfile,
    departments,
    techStack,
    dataReadiness,
    aiAdoption,
    automation,
    agentInterest,
    security,
    employeeReadiness,
  };
  const categoryScores = calculateCategoryScores(scoringInput);
  const totalScore = calculateTotalScore(categoryScores);
  const stage = getStage(totalScore);

  const benchmark = getBenchmark(companyProfile.industry);
  const swot = generateSwot(categoryScores, totalScore, scoringInput);
  const risk = assessRisk(categoryScores, totalScore, companyProfile.industry);
  const roi = generateRoi(scoringInput, categoryScores);
  const roadmap = generateRoadmap(categoryScores, companyProfile.industry);
  const opportunityMatrix = generateOpportunityMatrix(scoringInput, categoryScores);
  const firstMoves = getFirstMoves(opportunityMatrix);
  const executiveSummary = generateExecutiveSummary(
    contact.companyName,
    scoringInput,
    stage.label,
    totalScore,
    benchmark.industryAverage,
    swot,
    risk,
    roi,
    firstMoves,
  );

  try {
    const created = await prisma.assessment.create({
      data: {
        contactName: contact.contactName,
        contactEmail: contact.contactEmail,
        contactPhone: contact.contactPhone || null,
        companyName: contact.companyName,
        companyProfile: companyProfile as unknown as Prisma.InputJsonValue,
        departments: departments as unknown as Prisma.InputJsonValue,
        techStack: techStack as unknown as Prisma.InputJsonValue,
        dataReadiness: dataReadiness as unknown as Prisma.InputJsonValue,
        aiAdoption: aiAdoption as unknown as Prisma.InputJsonValue,
        automation: automation as unknown as Prisma.InputJsonValue,
        agentInterest: agentInterest as unknown as Prisma.InputJsonValue,
        security: security as unknown as Prisma.InputJsonValue,
        employeeReadiness: employeeReadiness as unknown as Prisma.InputJsonValue,
        categoryScores,
        totalScore,
        stage: stage.label,
        dataCompleteness: computeDataCompleteness(scoringInput),
        benchmark: benchmark as unknown as Prisma.InputJsonValue,
        swot: swot as unknown as Prisma.InputJsonValue,
        opportunityMatrix: (opportunityMatrix as unknown as Prisma.InputJsonValue),
        risk: risk as unknown as Prisma.InputJsonValue,
        roadmap: roadmap as unknown as Prisma.InputJsonValue,
        roi: roi as unknown as Prisma.InputJsonValue,
        executiveSummary,
      },
    });

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
  }
}
