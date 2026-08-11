import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Target,
  TriangleAlert,
} from "lucide-react";

type BudgetRecommendation =
  | string
  | {
      title?: string;
      description?: string;
    };

type BudgetHealthCardProps = {
  budgets: {
    label: string;
    used: string;
    limit: string;
    percent: number;
    overLimit: boolean;
    note?: string | null;
  }[];
  healthyCount: number;
  recommendation: BudgetRecommendation;
};

type BudgetStatus = {
  label: string;
  badge: string;
  progress: string;
  card: string;
  statusText: string;
  icon: typeof CheckCircle2;
};

function getBudgetStatus(
  percent: number,
  overLimit: boolean
): BudgetStatus {
  if (overLimit || percent > 100) {
    return {
      label: "Over limit",
      badge:
        "border-red-200 bg-red-50 text-red-700",
      progress:
        "from-red-600 via-red-500 to-red-400",
      card:
        "border-red-100 bg-red-50/30",
      statusText:
        "text-red-700",
      icon: AlertCircle,
    };
  }

  if (percent >= 85) {
    return {
      label: "Near limit",
      badge:
        "border-orange-200 bg-orange-50 text-orange-700",
      progress:
        "from-orange-600 via-orange-500 to-orange-400",
      card:
        "border-orange-100 bg-orange-50/30",
      statusText:
        "text-orange-700",
      icon: TriangleAlert,
    };
  }

  if (percent >= 60) {
    return {
      label: "Watch spending",
      badge:
        "border-amber-200 bg-amber-50 text-amber-700",
      progress:
        "from-amber-600 via-amber-500 to-amber-400",
      card:
        "border-amber-100 bg-amber-50/30",
      statusText:
        "text-amber-700",
      icon: TriangleAlert,
    };
  }

  return {
    label: "Within budget",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    progress:
      "from-emerald-700 via-emerald-600 to-emerald-400",
    card:
      "border-emerald-100 bg-emerald-50/25",
    statusText:
      "text-emerald-700",
    icon: CheckCircle2,
  };
}

export default function BudgetHealthCard({
  budgets,
  healthyCount,
  recommendation,
}: BudgetHealthCardProps) {
  const totalBudgets =
    budgets.length;

  const warningCount =
    budgets.filter(
      (budget) =>
        !budget.overLimit &&
        budget.percent >= 60 &&
        budget.percent <= 100
    ).length;

  const overLimitCount =
    budgets.filter(
      (budget) =>
        budget.overLimit ||
        budget.percent > 100
    ).length;

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Target size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              Budget Health
            </h3>

            <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
              AI-monitored spending limits and risk signals.
            </p>
          </div>
        </div>

        {/* Stats */}
        {totalBudgets > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <StatCard
              label="Total"
              value={totalBudgets}
            />

            <StatCard
              label="Healthy"
              value={healthyCount}
              tone="green"
            />

            <StatCard
              label="Warning"
              value={warningCount}
              tone="amber"
            />

            <StatCard
              label="Over Limit"
              value={overLimitCount}
              tone="red"
            />
          </div>
        )}
      </div>

      {/* Budgets */}
      <div className="p-4 sm:p-5">
        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Target size={17} />
            </div>

            <p className="mt-3 text-[13px] font-bold text-black">
              No budgets found
            </p>

            <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#565e74]">
              Create budgets to let Aura monitor your spending limits and
              identify categories that need attention.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((budget) => {
              const status =
                getBudgetStatus(
                  budget.percent,
                  budget.overLimit
                );

              const StatusIcon =
                status.icon;

              const progressWidth =
                Math.min(
                  Math.max(
                    budget.percent,
                    0
                  ),
                  100
                );

              return (
                <div
                  key={budget.label}
                  className={`rounded-2xl border p-4 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_5px_16px_rgba(15,23,42,0.05)] ${status.card}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        title={budget.label}
                        className="truncate text-[12px] font-bold text-black"
                      >
                        {budget.label}
                      </p>

                      <p className="mt-1 text-[10px] text-[#7c839b]">
                        {budget.used} of{" "}
                        {budget.limit}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold ${status.badge}`}
                    >
                      {budget.percent}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#e7edf8]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${status.progress}`}
                      style={{
                        width: `${progressWidth}%`,
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div
                    className={`mt-3 flex items-start gap-1.5 text-[10px] font-bold leading-4 ${status.statusText}`}
                  >
                    <StatusIcon
                      size={12}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {budget.overLimit
                        ? budget.note ||
                          "This budget has exceeded its limit."
                        : budget.note ||
                          status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="border-t border-[#edf2fb] bg-emerald-50/40 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
            <Lightbulb size={14} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700">
              Aura Recommendation
            </p>

            {typeof recommendation ===
            "string" ? (
              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                {recommendation ||
                  "Aura will monitor your budgets once you add spending limits."}
              </p>
            ) : (
              <>
                {recommendation?.title && (
                  <p className="mt-1 text-[11px] font-bold text-black">
                    {
                      recommendation.title
                    }
                  </p>
                )}

                <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                  {recommendation?.description ||
                    "Aura will monitor your budgets once you add spending limits."}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?:
    | "default"
    | "green"
    | "amber"
    | "red";
}) {
  const styles = {
    default: {
      card:
        "border-[#e8eefb] bg-[#fbfcff]",
      label:
        "text-[#7c839b]",
      value:
        "text-black",
    },

    green: {
      card:
        "border-emerald-100 bg-emerald-50/40",
      label:
        "text-emerald-700",
      value:
        "text-emerald-700",
    },

    amber: {
      card:
        "border-amber-100 bg-amber-50/40",
      label:
        "text-amber-700",
      value:
        "text-amber-700",
    },

    red: {
      card:
        "border-red-100 bg-red-50/40",
      label:
        "text-red-700",
      value:
        "text-red-700",
    },
  };

  const current =
    styles[tone];

  return (
    <div
      className={`rounded-2xl border px-3.5 py-3 ${current.card}`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.08em] ${current.label}`}
      >
        {label}
      </p>

      <p
        className={`mt-1.5 text-[17px] font-bold leading-none ${current.value}`}
      >
        {value}
      </p>
    </div>
  );
}