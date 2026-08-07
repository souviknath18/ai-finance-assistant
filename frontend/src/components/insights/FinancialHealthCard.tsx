import React from "react";
import IconCircle from "./IconCircle";

type FinancialHealthCardProps = {
  icon: React.ReactNode;
  score: number;
  status: string;
  description: string;
};

export default function FinancialHealthCard({
  icon,
  score,
  status,
  description,
}: FinancialHealthCardProps) {
  const safeScore = Math.min(Math.max(score || 0, 0), 100);

  const scoreTone =
    safeScore >= 80
      ? "text-emerald-700"
      : safeScore >= 60
      ? "text-amber-600"
      : "text-red-700";

  const progressTone =
    safeScore >= 80
      ? "bg-emerald-700"
      : safeScore >= 60
      ? "bg-amber-500"
      : "bg-red-600";

  return (
    <div className="flex flex-col rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm transition hover:border-[#d7e6ff] hover:shadow-md">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <IconCircle tone="green">{icon}</IconCircle>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
            Financial Health
          </p>

          <p className="mt-1 text-[13px] font-semibold text-black">
            Aura financial health score
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="rounded-2xl border border-[#e5eeff] bg-[#f8faff] p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className={`text-4xl font-bold tracking-tight ${scoreTone}`}
            >
              {safeScore}
              <span className="ml-1 text-lg text-[#8a92a5]">/100</span>
            </p>

            <p className="mt-2 text-[13px] font-bold text-black">
              {status || "Not enough data"}
            </p>
          </div>

          <ScoreCircle score={safeScore} />
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]">
            <div
              className={`h-full rounded-full transition-all ${progressTone}`}
              style={{
                width: `${safeScore}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] font-semibold text-[#8a92a5]">
            <span>Needs attention</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-[13px] leading-6 text-[#565e74]">
        {description}
      </p>

      {/* Score explanation */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <HealthMetric
          label="Savings"
          status={getMetricStatus(safeScore, 75)}
        />

        <HealthMetric
          label="Spending"
          status={getMetricStatus(safeScore, 65)}
        />

        <HealthMetric
          label="Stability"
          status={getMetricStatus(safeScore, 55)}
        />
      </div>

      {/* Action */}
      <div className="mt-5 border-t border-[#e5eeff] pt-4">
        <button
          type="button"
          className="w-full rounded-xl border border-[#e5eeff] bg-white py-2.5 text-[12px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
        >
          View Score Breakdown
        </button>
      </div>
    </div>
  );
}

type HealthMetricProps = {
  label: string;
  status: "Good" | "Fair" | "Low";
};

function HealthMetric({
  label,
  status,
}: HealthMetricProps) {
  const statusClass =
    status === "Good"
      ? "text-emerald-700"
      : status === "Fair"
      ? "text-amber-600"
      : "text-red-700";

  return (
    <div className="rounded-xl bg-[#f8faff] px-3 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a92a5]">
        {label}
      </p>

      <p className={`mt-1 text-[12px] font-bold ${statusClass}`}>
        {status}
      </p>
    </div>
  );
}

function ScoreCircle({
  score,
}: {
  score: number;
}) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 64 64"
        className="h-16 w-16 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e5eeff"
          strokeWidth="5"
        />

        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className={
            score >= 80
              ? "text-emerald-700"
              : score >= 60
              ? "text-amber-500"
              : "text-red-600"
          }
        />
      </svg>

      <span className="absolute text-[11px] font-bold text-black">
        {score}
      </span>
    </div>
  );
}

function getMetricStatus(
  score: number,
  threshold: number
): "Good" | "Fair" | "Low" {
  if (score >= threshold) {
    return "Good";
  }

  if (score >= threshold - 20) {
    return "Fair";
  }

  return "Low";
}