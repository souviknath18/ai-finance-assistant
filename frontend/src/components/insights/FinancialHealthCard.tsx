import React from "react";

import IconCircle from "./IconCircle";

import {
  FinancialHealth,
  FinancialHealthComponent,
} from "@/types/insights";


type FinancialHealthCardProps = {
  icon: React.ReactNode;
  health: FinancialHealth;
};


export default function FinancialHealthCard({
  icon,
  health,
}: FinancialHealthCardProps) {
  const safeScore = Math.min(
    Math.max(
      health.score || 0,
      0
    ),
    100
  );

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

  const breakdownItems = [
    {
      label: "Savings",
      data: health.breakdown.savings,
    },
    {
      label: "Cash Flow",
      data: health.breakdown.cashflow,
    },
    {
      label: "Stability",
      data: health.breakdown.stability,
    },
    {
      label: "Recurring",
      data: health.breakdown.recurring,
    },
    {
      label: "Anomalies",
      data: health.breakdown.anomalies,
    },
    {
      label: "Budgets",
      data: health.breakdown.budgets,
    },
    {
      label: "Goals",
      data: health.breakdown.goals,
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <IconCircle tone="green">
          {icon}
        </IconCircle>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
            Financial Health
          </p>

          <p className="mt-1 text-[13px] font-semibold text-black">
            Aura financial health score
          </p>
        </div>
      </div>

      {/* Main Score */}
      <div className="rounded-2xl border border-[#e5eeff] bg-[#f8faff] p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className={`text-4xl font-bold tracking-tight ${scoreTone}`}
            >
              {safeScore}

              <span className="ml-1 text-lg text-[#8a92a5]">
                /100
              </span>
            </p>

            <p className="mt-2 text-[13px] font-bold text-black">
              {health.status ||
                "Not enough data"}
            </p>
          </div>

          <ScoreCircle
            score={safeScore}
          />
        </div>

        {/* Main progress */}
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

      {/* Savings Summary */}
      <div className="mt-4 rounded-xl border border-[#e5eeff] bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Savings Rate
            </p>

            <p className="mt-1 text-[13px] font-semibold text-[#565e74]">
              Portion of income retained this period
            </p>
          </div>

          <p
            className={`shrink-0 text-lg font-bold ${
              health.savings_rate >= 20
                ? "text-emerald-700"
                : health.savings_rate > 0
                ? "text-amber-600"
                : "text-red-700"
            }`}
          >
            {health.savings_rate.toFixed(
              1
            )}
            %
          </p>
        </div>
      </div>

      {/* Real Health Breakdown */}
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#565e74]">
            Score Breakdown
          </p>

          <span className="text-[10px] font-semibold text-[#8a92a5]">
            7 factors
          </span>
        </div>

        <div className="space-y-3">
          {breakdownItems.map(
            (item) => (
              <HealthBreakdownRow
                key={item.label}
                label={item.label}
                data={item.data}
              />
            )
          )}
        </div>
      </div>

      {/* Strengths */}
      {health.strengths.length >
        0 && (
        <div className="mt-5 border-t border-[#e5eeff] pt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Strengths
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {health.strengths.map(
              (item) => (
                <span
                  key={item.key}
                  className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"
                >
                  {item.label}{" "}
                  {item.score_percent.toFixed(
                    0
                  )}
                  %
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Concerns */}
      {health.concerns.length >
        0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">
            Needs Attention
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {health.concerns.map(
              (item) => (
                <span
                  key={item.key}
                  className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700"
                >
                  {item.label}{" "}
                  {item.score_percent.toFixed(
                    0
                  )}
                  %
                </span>
              )
            )}
          </div>
        </div>
      )}

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


function HealthBreakdownRow({
  label,
  data,
}: {
  label: string;
  data: FinancialHealthComponent;
}) {
  const percentage = Math.min(
    Math.max(
      data.percentage || 0,
      0
    ),
    100
  );

  const barClass =
    data.status === "good"
      ? "bg-emerald-700"
      : data.status === "fair"
      ? "bg-amber-500"
      : "bg-red-600";

  const statusClass =
    data.status === "good"
      ? "text-emerald-700"
      : data.status === "fair"
      ? "text-amber-600"
      : "text-red-700";

  const statusLabel =
    data.status === "good"
      ? "Good"
      : data.status === "fair"
      ? "Fair"
      : "Low";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold text-black">
            {label}
          </p>

          <p className="mt-0.5 text-[10px] text-[#8a92a5]">
            {data.score}/
            {data.max_score} points
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-[11px] font-bold ${statusClass}`}
          >
            {statusLabel}
          </p>

          <p className="mt-0.5 text-[10px] font-semibold text-[#8a92a5]">
            {percentage.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}


function ScoreCircle({
  score,
}: {
  score: number;
}) {
  const radius = 28;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    circumference -
    (score / 100) *
      circumference;

  const circleClass =
    score >= 80
      ? "text-emerald-700"
      : score >= 60
      ? "text-amber-500"
      : "text-red-600";

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 64 64"
        className="h-16 w-16 -rotate-90"
        aria-label={`Financial health score ${score} out of 100`}
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
          strokeDasharray={
            circumference
          }
          strokeDashoffset={
            progress
          }
          className={
            circleClass
          }
        />
      </svg>

      <span className="absolute text-[11px] font-bold text-black">
        {score}
      </span>
    </div>
  );
}