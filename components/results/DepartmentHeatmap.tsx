"use client";

interface DepartmentHeatmapProps {
  departments: Record<string, { rating: number }>;
}

const DEPT_LABELS: Record<string, string> = {
  sales: "Sales",
  marketing: "Marketing",
  hr: "HR",
  finance: "Finance",
  operations: "Operations",
  support: "Support",
};

function heatColor(rating: number): string {
  const t = rating / 5;
  const r = Math.round(14 + (201 - 14) * t);
  const g = Math.round(42 + (162 - 42) * t);
  const b = Math.round(58 + (77 - 58) * t);
  return `rgb(${r},${g},${b})`;
}

export default function DepartmentHeatmap({ departments }: DepartmentHeatmapProps) {
  const entries = Object.entries(departments);
  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {entries.map(([key, dept]) => (
        <div
          key={key}
          className="rounded-md p-4 text-center flex flex-col gap-1"
          style={{ backgroundColor: heatColor(dept.rating) }}
        >
          <span className="font-body text-xs font-semibold text-white opacity-90">
            {DEPT_LABELS[key] ?? key}
          </span>
          <span className="font-display text-2xl font-bold text-white">
            {dept.rating}
          </span>
          <span className="font-body text-xs text-white opacity-70">/5</span>
        </div>
      ))}
    </div>
  );
}
