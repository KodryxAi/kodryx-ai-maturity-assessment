import { afterAll, describe, expect, it } from "vitest";

import { prisma } from "../../../lib/prisma";
import { DEPARTMENT_CONFIG } from "../../../lib/constants/wizardOptions";
import type { CategoryKey } from "../../../lib/types/assessment";
import { POST } from "./route";
import { GET } from "./[id]/route";

const CATEGORY_KEYS: CategoryKey[] = [
  "businessProcess",
  "technology",
  "data",
  "aiAdoption",
  "automation",
  "aiAgents",
  "security",
  "people",
  "leadership",
  "innovation",
];

function fullDepartments(capCount = 2) {
  return DEPARTMENT_CONFIG.reduce(
    (acc, dept) => {
      acc[dept.key] = {
        rating: 4,
        capabilities: dept.capabilities.slice(0, capCount),
      };
      return acc;
    },
    {} as Record<string, { rating: number; capabilities: string[] }>
  );
}

function fullBody(overrides: Record<string, unknown> = {}) {
  return {
    contact: {
      contactName: "Jane Doe",
      contactEmail: "jane@example.com",
      contactPhone: "555-0100",
      companyName: "Acme Co",
    },
    companyProfile: {
      industry: "SaaS / Technology",
      employeeBand: "11-50",
      revenueBand: "$1M-$5M",
      businessModel: "SaaS",
      leadershipGoals: [
        "Increase Revenue",
        "Reduce Operating Costs",
        "Improve Operational Efficiency",
      ],
      blendedHourlyCost: 75,
    },
    departments: fullDepartments(),
    techStack: { systems: ["CRM", "ERP"], apiMaturity: "Modern" },
    dataReadiness: { quality: 4, security: 4, accessibility: 4, knowledgeMgmt: 4 },
    aiAdoption: { toolsInUse: ["ChatGPT", "Claude"], frequency: "Daily" },
    automation: { processesAutomated: ["Email", "Invoices"] },
    agentInterest: { agentTypes: ["Sales", "Marketing"] },
    security: { checklist: ["MFA", "SSO"] },
    employeeReadiness: {
      aiSkills: 4,
      training: 4,
      changeReadiness: 4,
      leadershipSupport: 4,
      innovationCulture: 4,
    },
    ...overrides,
  };
}

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/assessments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

const createdIds: string[] = [];

describe("POST /api/assessments (full 10-section body)", () => {
  it("persists all 10 sections and produces non-zero scores for all 10 categories", async () => {
    const response = await post(fullBody());
    expect(response.status).toBe(201);
    const { id } = await response.json();
    expect(typeof id).toBe("string");
    createdIds.push(id);

    const getResponse = await GET(new Request(`http://localhost/api/assessments/${id}`), {
      params: { id },
    });
    expect(getResponse.status).toBe(200);
    const record = await getResponse.json();
    const categoryScores = record.categoryScores as Record<CategoryKey, number>;

    for (const key of CATEGORY_KEYS) {
      expect(categoryScores[key], `expected ${key} > 0`).toBeGreaterThan(0);
    }
  });

  it("returns 400 naming departments when departments.sales is missing", async () => {
    const departments = fullDepartments();
    delete departments.sales;
    const response = await post(fullBody({ departments }));
    expect(response.status).toBe(400);
    const { error } = await response.json();
    expect(error).toMatch(/departments/i);
  });

  it("returns 400 naming security when security.checklist contains an unknown value", async () => {
    const response = await post(
      fullBody({ security: { checklist: ["Not-A-Real-Control"] } })
    );
    expect(response.status).toBe(400);
    const { error } = await response.json();
    expect(error).toMatch(/security/i);
  });

  it("returns 400 when security.checklist contains a duplicate valid value", async () => {
    const response = await post(fullBody({ security: { checklist: ["MFA", "MFA"] } }));
    expect(response.status).toBe(400);
    const { error } = await response.json();
    expect(error).toMatch(/security/i);
  });

  it("persists dataCompleteness \"thin\" for a minimally-touched submission (20/68)", async () => {
    const response = await post(fullBody());
    expect(response.status).toBe(201);
    const { id } = await response.json();
    createdIds.push(id);

    const getResponse = await GET(new Request(`http://localhost/api/assessments/${id}`), {
      params: { id },
    });
    expect(getResponse.status).toBe(200);
    const record = await getResponse.json();
    expect(record.dataCompleteness).toBe("thin");
  });

  it("persists dataCompleteness \"complete\" for a heavily-touched submission (38/68)", async () => {
    const response = await post(fullBody({ departments: fullDepartments(5) }));
    expect(response.status).toBe(201);
    const { id } = await response.json();
    createdIds.push(id);

    const getResponse = await GET(new Request(`http://localhost/api/assessments/${id}`), {
      params: { id },
    });
    expect(getResponse.status).toBe(200);
    const record = await getResponse.json();
    expect(record.dataCompleteness).toBe("complete");
  });
});

afterAll(async () => {
  if (createdIds.length > 0) {
    await prisma.assessment.deleteMany({ where: { id: { in: createdIds } } });
  }
  await prisma.$disconnect();
});
