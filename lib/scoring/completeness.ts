import {
  AI_TOOLS_OPTIONS,
  AUTOMATION_PROCESS_OPTIONS,
  DEPARTMENT_CONFIG,
  SECURITY_CHECKLIST_OPTIONS,
  SYSTEMS_OPTIONS,
} from "../constants/wizardOptions";
import type { ScoringInput } from "../types/assessment";

/**
 * The "optional capability-checklist items across all sections" per the
 * design spec's data-completeness note. These 5 fields are all multi-select
 * checklist inputs where zero selections is a legitimate answer (touching
 * none of them is meaningful signal), as opposed to the 0-5 rating sliders
 * (departments[].rating, dataReadiness.*, employeeReadiness.*) which always
 * carry a default value and are never meaningfully "untouched".
 * `agentInterest.agentTypes` is deliberately excluded — it captures
 * opportunity/interest for Phase 4's Opportunity Matrix, not a
 * maturity/completeness signal.
 */
export const TOTAL_OPTIONAL_CHECKLIST_ITEMS: number =
  DEPARTMENT_CONFIG.reduce((sum, dept) => sum + dept.capabilities.length, 0) +
  SYSTEMS_OPTIONS.length +
  AI_TOOLS_OPTIONS.length +
  AUTOMATION_PROCESS_OPTIONS.length +
  SECURITY_CHECKLIST_OPTIONS.length;

/** Sum of touched items across the 5 optional checklist sections. */
export function countTouchedOptionalItems(input: ScoringInput): number {
  const departmentsTouched = input.departments
    ? Object.values(input.departments).reduce(
        (sum, dept) => sum + dept.capabilities.length,
        0,
      )
    : 0;

  return (
    departmentsTouched +
    (input.techStack?.systems.length ?? 0) +
    (input.aiAdoption?.toolsInUse.length ?? 0) +
    (input.automation?.processesAutomated.length ?? 0) +
    (input.security?.checklist.length ?? 0)
  );
}

/**
 * Implements the design spec's "Data-completeness note": if fewer than half
 * of the optional capability-checklist items across all sections were
 * touched, the submission is flagged "thin" so the results page can show an
 * honest confidence caption rather than presenting a thin-data score as
 * equally authoritative as a fully-detailed one.
 */
export function computeDataCompleteness(
  input: ScoringInput,
): "thin" | "complete" {
  const ratio = countTouchedOptionalItems(input) / TOTAL_OPTIONAL_CHECKLIST_ITEMS;
  return ratio < 0.5 ? "thin" : "complete";
}
