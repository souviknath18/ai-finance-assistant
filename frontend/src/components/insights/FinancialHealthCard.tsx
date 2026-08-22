"use client";

import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import {
  FinancialHealth,
  FinancialHealthComponent,
} from "@/types/insights";

type FinancialHealthCardProps = {
  health: FinancialHealth;
};

export default function FinancialHealthCard({
  health,
}: FinancialHealthCardProps) {
  const safeScore = Math.min(
    Math.max(health.score || 0, 0),
    100
  );

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

  const strongest = [...breakdownItems].sort(
    (a, b) =>
      getPercentage(b.data) -
      getPercentage(a.data)
  )[0];

  const weakest = [...breakdownItems].sort(
    (a, b) =>
      getPercentage(a.data) -
      getPercentage(b.data)
  )[0];

  return (
    <div className="h-full min-w-0 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <HeartPulse size={18} />
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-black">
                Financial Health
              </h3>

              <p className="text-[12px] text-[#565e74]">
                Aura financial health score
              </p>
            </div>
          </div>

          <span
            className={`hidden rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide sm:inline-flex ${getScoreBadgeClass(
              safeScore
            )}`}
          >
            {health.status ||
              getScoreLabel(safeScore)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid min-w-0 grid-cols-1 gap-7 p-5 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center">
        {/* Left side */}
        <div className="flex flex-col items-center border-b border-[#edf2fb] pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-7">
          <HealthGauge score={safeScore} />

          <p className="mt-3 text-center text-[14px] font-bold text-black">
            {getScoreHeading(safeScore)}
          </p>

          <p className="mt-1 max-w-[200px] text-center text-[11px] leading-5 text-[#7c839b]">
            Overall financial health based on seven financial factors.
          </p>

          {/* Savings rate */}
          <div className="mt-5 w-full rounded-2xl border border-[#e8eefb] bg-[#fbfcff] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                  Savings Rate
                </p>

                <p className="mt-1 text-[11px] text-[#565e74]">
                  Income retained
                </p>
              </div>

              <p
                className={`text-[18px] font-bold ${getSavingsRateClass(
                  health.savings_rate
                )}`}
              >
                {health.savings_rate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="min-w-0">
          {/* Top summary */}
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <TrendingUp size={13} />

                <p className="text-[9px] font-bold uppercase tracking-wide">
                  Strongest
                </p>
              </div>

              <p className="mt-1 text-[13px] font-bold text-black">
                {strongest.label}
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                {getPercentage(
                  strongest.data
                ).toFixed(0)}
                %
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-amber-700">
                <AlertTriangle size={13} />

                <p className="text-[9px] font-bold uppercase tracking-wide">
                  Needs Attention
                </p>
              </div>

              <p className="mt-1 text-[13px] font-bold text-black">
                {weakest.label}
              </p>

              <p className="mt-0.5 text-[11px] font-semibold text-amber-700">
                {getPercentage(
                  weakest.data
                ).toFixed(0)}
                %
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-5 h-px bg-[#edf2fb]" />

          {/* Factor heading */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black">
                Health Factors
              </p>

              <p className="mt-0.5 text-[11px] text-[#7c839b]">
                Contribution to your overall score
              </p>
            </div>

            <span className="rounded-full border border-[#e8eefb] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold text-[#7c839b]">
              7 Factors
            </span>
          </div>

          {/* Compact progress bars */}
          <div className="space-y-3">
            {breakdownItems.map((item) => (
              <HealthProgressRow
                key={item.label}
                label={item.label}
                data={item.data}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom summary */}
      {(health.strengths.length > 0 ||
        health.concerns.length > 0) && (
        <div className="border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Strengths */}
            {health.strengths.length > 0 && (
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Strengths
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {health.strengths
                    .slice(0, 3)
                    .map((item) => (
                      <span
                        key={item.key}
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700"
                      >
                        <CheckCircle2 size={10} />

                        {item.label}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Concerns */}
            {health.concerns.length > 0 && (
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-700">
                  Needs Attention
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {health.concerns
                    .slice(0, 3)
                    .map((item) => (
                      <span
                        key={item.key}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[9px] font-bold text-amber-700"
                      >
                        <AlertTriangle size={10} />

                        {item.label}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HealthProgressRow({
  label,
  data,
}: {
  label: string;
  data: FinancialHealthComponent;
}) {
  const percentage = getPercentage(data);

  const status = getHealthStatus(data);

  return (
    <div>
      {/* Label row */}
      <div className="mb-1.5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`}
          />

          <p className="truncate text-[11px] font-bold text-black">
            {label}
          </p>

          <span className="hidden text-[9px] font-medium text-[#9aa2b4] sm:inline">
            {data.score}/{data.max_score}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`text-[9px] font-bold ${status.text}`}
          >
            {status.label}
          </span>

          <span className="w-8 text-right text-[10px] font-bold text-[#565e74]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 overflow-hidden rounded-full bg-[#edf2fb]">
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${status.progress}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function HealthGauge({
  score,
}: {
  score: number;
}) {
  const radius = 52;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    circumference -
    (score / 100) * circumference;

  const stroke =
    score >= 80
      ? "#047857"
      : score >= 60
      ? "#d97706"
      : "#dc2626";

  return (
    <div className="relative flex h-[175px] w-[175px] items-center justify-center">
      <div className="absolute inset-[12px] rounded-full bg-gradient-to-br from-white to-[#f8fbff] shadow-[inset_0_0_20px_rgba(15,23,42,0.04)]" />

      <svg
        viewBox="0 0 120 120"
        className="relative z-10 h-full w-full -rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#edf2fb"
          strokeWidth="8"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute z-20 flex flex-col items-center justify-center">
        <p className="text-[34px] font-bold leading-none tracking-tight text-black">
          {score}
        </p>

        <p className="mt-1 text-[11px] font-bold text-[#7c839b]">
          /100
        </p>

        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#7c839b]">
          Health Score
        </p>
      </div>
    </div>
  );
}

function getPercentage(
  data: FinancialHealthComponent
) {
  return Math.min(
    Math.max(data.percentage || 0, 0),
    100
  );
}

function getHealthStatus(
  data: FinancialHealthComponent
) {
  if (data.status === "good") {
    return {
      label: "Good",
      text: "text-emerald-700",
      dot: "bg-emerald-600",
      progress:
        "from-emerald-700 via-emerald-600 to-emerald-400",
    };
  }

  if (data.status === "fair") {
    return {
      label: "Fair",
      text: "text-amber-600",
      dot: "bg-amber-500",
      progress:
        "from-amber-600 via-amber-500 to-amber-400",
    };
  }

  return {
    label: "Low",
    text: "text-red-700",
    dot: "bg-red-600",
    progress:
      "from-red-700 via-red-600 to-red-400",
  };
}

function getScoreBadgeClass(
  score: number
) {
  if (score >= 80) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (score >= 60) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

function getScoreLabel(
  score: number
) {
  if (score >= 80) {
    return "Excellent";
  }

  if (score >= 60) {
    return "Fair";
  }

  return "Needs Attention";
}

function getScoreHeading(
  score: number
) {
  if (score >= 80) {
    return "Strong financial health";
  }

  if (score >= 60) {
    return "Generally stable";
  }

  return "Needs improvement";
}

function getSavingsRateClass(
  rate: number
) {
  if (rate >= 20) {
    return "text-emerald-700";
  }

  if (rate > 0) {
    return "text-amber-600";
  }

  return "text-red-700";
}