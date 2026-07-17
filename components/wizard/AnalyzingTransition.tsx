"use client";

import { useEffect, useState } from "react";

const CATEGORY_NAMES = [
  "Business Process",
  "Technology",
  "Data Readiness",
  "AI Adoption",
  "Automation",
  "AI Agents",
  "Security",
  "People",
  "Leadership",
  "Innovation",
];

interface AnalyzingTransitionProps {
  onComplete: () => void;
}

export default function AnalyzingTransition({ onComplete }: AnalyzingTransitionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= CATEGORY_NAMES.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="font-display text-kx-navy text-2xl font-bold tracking-tight">
        Analyzing your AI maturity...
      </p>

      <div className="flex flex-col items-center gap-1">
        {CATEGORY_NAMES.map((name, index) => (
          <span
            key={name}
            className={`font-body text-sm transition-all duration-150 ${
              index <= currentIndex
                ? "text-kx-gold opacity-100"
                : "text-kx-grey opacity-30"
            }`}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
