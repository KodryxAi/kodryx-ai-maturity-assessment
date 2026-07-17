"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RoiDepartment {
  department: string;
  costSavingsLow: number;
  costSavingsMid: number;
  costSavingsHigh: number;
}

interface RoiRangeBarsProps {
  departments: RoiDepartment[];
}

export default function RoiRangeBars({ departments }: RoiRangeBarsProps) {
  if (departments.length === 0) return null;

  const data = departments.map((d) => ({
    department: d.department,
    Low: Math.round(d.costSavingsLow / 1000),
    Expected: Math.round(d.costSavingsMid / 1000),
    High: Math.round(d.costSavingsHigh / 1000),
    rangeLabel: `$${(d.costSavingsLow / 1000).toFixed(0)}K - $${(d.costSavingsHigh / 1000).toFixed(0)}K`,
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            tickFormatter={(v) => `$${v}K`}
          />
          <YAxis
            type="category"
            dataKey="department"
            tick={{ fontSize: 11, fill: "#0E2A3A" }}
            width={80}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded border border-kx-grey-100 bg-white px-3 py-2 text-xs shadow-sm">
                  <p className="font-semibold text-kx-navy mb-1">{d.department}</p>
                  <p className="text-kx-grey">{d.rangeLabel}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="Low" stackId="a" fill="transparent" />
          <Bar dataKey="Expected" stackId="a" fill="#C9A24D" radius={[0, 4, 4, 0]} />
          <Bar dataKey="High" stackId="a" fill="transparent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
