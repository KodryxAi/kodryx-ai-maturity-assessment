"use client";

interface RoadmapTimelineProps {
  quickWins: string[];
  phase2: string[];
  phase3: string[];
  phase4: string[];
}

const PHASES = [
  { key: "quickWins" as const, label: "Quick Wins", time: "30 days", color: "border-kx-gold" },
  { key: "phase2" as const, label: "Phase 2", time: "90 days", color: "border-kx-navy" },
  { key: "phase3" as const, label: "Phase 3", time: "180 days", color: "border-kx-navy" },
  { key: "phase4" as const, label: "Phase 4", time: "12 months", color: "border-kx-navy" },
];

export default function RoadmapTimeline({ quickWins, phase2, phase3, phase4 }: RoadmapTimelineProps) {
  const items = { quickWins, phase2, phase3, phase4 };

  return (
    <div className="flex flex-col gap-0">
      {PHASES.map((phase, idx) => (
        <div key={phase.key} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-4 w-4 rounded-full border-2 ${phase.color} bg-white shrink-0 mt-1`}
            />
            {idx < PHASES.length - 1 && (
              <div className="w-px flex-1 bg-kx-grey-200 my-1" />
            )}
          </div>
          <div className={`pb-6 ${idx === PHASES.length - 1 ? "pb-0" : ""}`}>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-body font-semibold text-kx-navy text-sm">
                {phase.label}
              </h4>
              <span className="kx-caption text-kx-grey text-xs">{phase.time}</span>
            </div>
            <ul className="flex flex-col gap-1">
              {items[phase.key].map((item, i) => (
                <li key={i} className="font-body text-xs text-kx-grey pl-2 border-l-2 border-kx-grey-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
