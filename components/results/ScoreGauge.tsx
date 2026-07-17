"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label: string;
}

export default function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 110;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const center = radius + strokeWidth;

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const progress = animatedScore / 100;
  const dashOffset = circumference * (1 - progress);

  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={svgSize}
        height={svgSize * 0.7}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="-mb-4"
        aria-label={`Score gauge: ${animatedScore} out of 100`}
      >
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${center}`}
          fill="none"
          stroke="#EEF0F3"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={`M ${strokeWidth} ${center} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${center}`}
          fill="none"
          stroke="#C9A24D"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
        />
      </svg>

      <div className="flex flex-col items-center gap-1 -mt-12">
        <span className="font-display text-4xl font-bold text-kx-gold">
          {animatedScore}
        </span>
        <span className="kx-eyebrow">out of 100</span>
      </div>
    </div>
  );
}
