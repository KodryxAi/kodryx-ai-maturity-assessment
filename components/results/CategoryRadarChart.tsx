"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const CATEGORY_LABELS: Record<string, string> = {
  businessProcess: "Business Process",
  technology: "Technology",
  data: "Data",
  aiAdoption: "AI Adoption",
  automation: "Automation",
  aiAgents: "AI Agents",
  security: "Security",
  people: "People",
  leadership: "Leadership",
  innovation: "Innovation",
};

interface RadarChartProps {
  categoryScores: Record<string, number>;
}

export default function CategoryRadarChart({ categoryScores }: RadarChartProps) {
  const data = Object.entries(categoryScores).map(([key, value]) => ({
    category: CATEGORY_LABELS[key] ?? key,
    score: Math.round(value * 10) / 10,
    fullMark: 20,
  }));

  return (
    <div className="w-full h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#D8DCE2" strokeWidth={0.5} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: "#6B7280", fontFamily: "var(--font-inter)" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 20]}
            tick={{ fontSize: 9, fill: "#6B7280" }}
            axisLine={false}
            tickCount={5}
          />
          <Radar
            name="Maturity"
            dataKey="score"
            stroke="#C9A24D"
            strokeWidth={2}
            fill="#C9A24D"
            fillOpacity={0.15}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
