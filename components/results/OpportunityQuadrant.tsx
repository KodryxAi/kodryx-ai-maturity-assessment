"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ZAxis,
  Tooltip,
} from "recharts";

interface OpportunityItem {
  initiative: string;
  impact: number;
  effort: number;
  roi: number;
  isFirstMove: boolean;
}

interface OpportunityQuadrantProps {
  items: OpportunityItem[];
}

export default function OpportunityQuadrant({ items }: OpportunityQuadrantProps) {
  if (items.length === 0) {
    return <p className="kx-caption">No opportunity data available.</p>;
  }

  const data = items.map((item) => ({
    x: item.effort,
    y: item.impact,
    z: item.roi * 20,
    name: item.initiative.slice(0, 30),
    isFirstMove: item.isFirstMove,
  }));

  return (
    <div className="w-full h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 30 }}>
          <CartesianGrid stroke="#EEF0F3" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Effort"
            domain={[0, 6]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            label={{ value: "Effort →", position: "bottom", offset: -5, fontSize: 11, fill: "#6B7280" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Impact"
            domain={[0, 6]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            label={{ value: "Impact →", angle: -90, position: "left", fontSize: 11, fill: "#6B7280" }}
          />
          <ZAxis type="number" dataKey="z" range={[40, 180]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded border border-kx-grey-100 bg-white px-3 py-2 text-xs shadow-sm">
                  <p className="font-semibold text-kx-navy">{d.name}</p>
                  <p className="text-kx-grey">
                    Impact: {d.y} / Effort: {d.x} / ROI: {d.isFirstMove ? "★ " : ""}{Math.round(d.z / 20)}/5
                  </p>
                </div>
              );
            }}
          />
          <Scatter
            data={data.filter((d) => !d.isFirstMove)}
            fill="#0E2A3A"
            fillOpacity={0.5}
            stroke="#0E2A3A"
            strokeWidth={0.5}
            name="Opportunities"
          />
          <Scatter
            data={data.filter((d) => d.isFirstMove)}
            fill="#C9A24D"
            fillOpacity={0.9}
            stroke="#C9A24D"
            strokeWidth={1.5}
            name="First Moves"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
