interface ProgressBarProps {
  stepIndex: number;
  totalSteps: number;
}

export default function ProgressBar({ stepIndex, totalSteps }: ProgressBarProps) {
  const fillPercent = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      <p className="kx-caption mb-2">
        Step {stepIndex + 1} of {totalSteps}
      </p>
      <div className="h-1.5 w-full rounded-full bg-kx-grey-100">
        <div
          className="h-1.5 rounded-full bg-kx-gold transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </div>
  );
}
