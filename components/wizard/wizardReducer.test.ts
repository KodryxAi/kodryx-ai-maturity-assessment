import { describe, expect, it } from "vitest";
import {
  initialWizardState,
  TOTAL_WIZARD_STEPS,
  wizardReducer,
  type WizardState,
} from "./wizardReducer";

describe("wizardReducer", () => {
  it("starts at stepIndex 0 with empty contact and companyProfile answers", () => {
    expect(initialWizardState.stepIndex).toBe(0);
    expect(initialWizardState.answers.contact).toEqual({
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      companyName: "",
    });
    expect(initialWizardState.answers.companyProfile).toEqual({
      industry: "",
      employeeBand: "",
      revenueBand: "",
      businessModel: "",
      leadershipGoals: [],
      blendedHourlyCost: 0,
    });
  });

  it("UPDATE_CONTACT merges partial payload into contact without touching companyProfile", () => {
    const state: WizardState = {
      ...initialWizardState,
      answers: {
        ...initialWizardState.answers,
        companyProfile: {
          ...initialWizardState.answers.companyProfile,
          industry: "Healthcare",
        },
      },
    };
    const next = wizardReducer(state, {
      type: "UPDATE_CONTACT",
      payload: { contactName: "Jane Doe" },
    });
    expect(next.answers.contact.contactName).toBe("Jane Doe");
    expect(next.answers.contact.contactEmail).toBe("");
    expect(next.answers.companyProfile.industry).toBe("Healthcare");
  });

  it("UPDATE_COMPANY_PROFILE merges partial payload into companyProfile without touching contact", () => {
    const state: WizardState = {
      ...initialWizardState,
      answers: {
        ...initialWizardState.answers,
        contact: { ...initialWizardState.answers.contact, contactName: "Jane Doe" },
      },
    };
    const next = wizardReducer(state, {
      type: "UPDATE_COMPANY_PROFILE",
      payload: { industry: "Retail" },
    });
    expect(next.answers.companyProfile.industry).toBe("Retail");
    expect(next.answers.companyProfile.employeeBand).toBe("");
    expect(next.answers.contact.contactName).toBe("Jane Doe");
  });

  it("NEXT advances stepIndex from 0 to the last step and does not advance past it", () => {
    const lastStep = TOTAL_WIZARD_STEPS - 1;
    let state = initialWizardState;
    for (let i = 0; i < lastStep; i++) {
      state = wizardReducer(state, { type: "NEXT" });
    }
    expect(state.stepIndex).toBe(lastStep);
    const stillLastStep = wizardReducer(state, { type: "NEXT" });
    expect(stillLastStep.stepIndex).toBe(lastStep);
  });

  it("BACK returns stepIndex from the last step to 0 and does not go below 0", () => {
    const lastStep = TOTAL_WIZARD_STEPS - 1;
    let state = initialWizardState;
    for (let i = 0; i < lastStep; i++) {
      state = wizardReducer(state, { type: "NEXT" });
    }
    for (let i = 0; i < lastStep; i++) {
      state = wizardReducer(state, { type: "BACK" });
    }
    expect(state.stepIndex).toBe(0);
    const stillStep0 = wizardReducer(state, { type: "BACK" });
    expect(stillStep0.stepIndex).toBe(0);
  });

  it("UPDATE_DEPARTMENT merges payload into only the targeted department, leaving siblings at defaults", () => {
    const next = wizardReducer(initialWizardState, {
      type: "UPDATE_DEPARTMENT",
      department: "sales",
      payload: { rating: 3 },
    });
    expect(next.answers.departments.sales.rating).toBe(3);
    expect(next.answers.departments.sales.capabilities).toEqual([]);
    (["marketing", "hr", "finance", "operations", "support"] as const).forEach(
      (key) => {
        expect(next.answers.departments[key]).toEqual({
          rating: 0,
          capabilities: [],
        });
      }
    );
  });

  it("UPDATE_TECH_STACK merges payload into techStack without touching systems or dataReadiness", () => {
    const next = wizardReducer(initialWizardState, {
      type: "UPDATE_TECH_STACK",
      payload: { apiMaturity: "Modern" },
    });
    expect(next.answers.techStack.apiMaturity).toBe("Modern");
    expect(next.answers.techStack.systems).toEqual([]);
    expect(next.answers.dataReadiness).toEqual({
      quality: 0,
      security: 0,
      accessibility: 0,
      knowledgeMgmt: 0,
    });
  });

  it("preserves contact data across NEXT then BACK (no data loss walking forward and back)", () => {
    let state = wizardReducer(initialWizardState, {
      type: "UPDATE_CONTACT",
      payload: { contactName: "Jane Doe", contactEmail: "jane@acme.com", companyName: "Acme" },
    });
    state = wizardReducer(state, { type: "NEXT" });
    state = wizardReducer(state, { type: "BACK" });
    expect(state.answers.contact).toEqual({
      contactName: "Jane Doe",
      contactEmail: "jane@acme.com",
      contactPhone: "",
      companyName: "Acme",
    });
  });
});
