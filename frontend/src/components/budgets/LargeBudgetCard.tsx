import { Edit } from "lucide-react";
import { BudgetItem } from "@/types/budget";

type LargeBudgetCardProps = {
  budget: BudgetItem;
  icon: React.ReactNode;
  onEditAction?: (budget: BudgetItem) => void;
};

export default function LargeBudgetCard({
  budget,
  icon,
  onEditAction,
}: LargeBudgetCardProps) {
  const isCritical =
    budget.status === "critical" ||
    budget.status === "exceeded";

  const isWarning =
    budget.status === "warning";

  const safeProgress = Math.min(
    Math.max(budget.usage_percent, 0),
    100
  );

  const statusStyles =
    getStatusStyles(budget.status);

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 md:col-span-8 ${
        isCritical
          ? "border-red-100 hover:border-red-200 hover:shadow-[0_8px_26px_rgba(239,68,68,0.07)]"
          : "border-[#e6edf9] hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.08)]"
      }`}
    >
      {/* Soft status background */}
      <div
        className={`pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full blur-3xl ${
          isCritical
            ? "bg-red-50"
            : isWarning
            ? "bg-amber-50"
            : "bg-emerald-50"
        }`}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {/* Icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${statusStyles.icon}`}
          >
            {icon}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[18px] font-bold tracking-tight text-black sm:text-xl">
                {budget.category}
              </h3>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${statusStyles.badge}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                />

                {formatStatus(
                  budget.status
                )}
              </span>
            </div>

            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Active{" "}
              {budget.period === "weekly"
                ? "Weekly"
                : "Monthly"}{" "}
              Budget
            </p>
          </div>
        </div>

        {/* Edit */}
        <button
          type="button"
          onClick={() =>
            onEditAction?.(budget)
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          aria-label={`Edit ${budget.category} budget`}
        >
          <Edit size={15} />
        </button>
      </div>

      {/* Main usage */}
      <div className="relative z-10 mt-auto pt-8">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Budget Usage
            </p>

            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span
                className={`text-2xl font-bold tracking-tight ${
                  isCritical
                    ? "text-red-600"
                    : "text-black"
                }`}
              >
                {budget.spent_display}
              </span>

              <span className="text-[12px] font-medium text-[#565e74]">
                of {budget.limit_display} spent
              </span>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <p
              className={`text-[16px] font-bold ${statusStyles.percent}`}
            >
              {Math.round(
                budget.raw_usage_percent
              )}
              %
            </p>

            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#7c839b]">
              Used
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className={`h-full rounded-full transition-[width] duration-700 ease-out ${statusStyles.progress}`}
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        {/* Bottom summary */}
        <div className="mt-4 flex flex-col gap-3 border-t border-[#edf2fb] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Remaining
            </p>

            <p
              className={`mt-1 text-[13px] font-bold ${
                isCritical
                  ? "text-red-600"
                  : "text-black"
              }`}
            >
              {budget.remaining_display}
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center rounded-xl border px-3 py-2 text-[10px] font-bold ${statusStyles.summary}`}
          >
            {getBudgetMessage(
              budget.status
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusStyles(
  status: BudgetItem["status"]
) {
  if (
    status === "critical" ||
    status === "exceeded"
  ) {
    return {
      icon:
        "border-red-100 bg-red-50 text-red-600",
      badge:
        "border-red-100 bg-red-50 text-red-600",
      dot: "bg-red-500",
      percent: "text-red-600",
      progress:
        "bg-gradient-to-r from-red-600 to-red-400",
      summary:
        "border-red-100 bg-red-50 text-red-600",
    };
  }

  if (status === "warning") {
    return {
      icon:
        "border-amber-100 bg-amber-50 text-amber-700",
      badge:
        "border-amber-100 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
      percent: "text-amber-700",
      progress:
        "bg-gradient-to-r from-amber-500 to-amber-400",
      summary:
        "border-amber-100 bg-amber-50 text-amber-700",
    };
  }

  return {
    icon:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    badge:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    percent: "text-emerald-700",
    progress:
      "bg-gradient-to-r from-emerald-700 to-emerald-400",
    summary:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
  };
}

function formatStatus(
  status: BudgetItem["status"]
) {
  if (status === "exceeded") {
    return "Exceeded";
  }

  if (status === "critical") {
    return "Critical";
  }

  if (status === "warning") {
    return "Watch";
  }

  return "Healthy";
}

function getBudgetMessage(
  status: BudgetItem["status"]
) {
  if (status === "exceeded") {
    return "Budget limit exceeded";
  }

  if (status === "critical") {
    return "Spending needs attention";
  }

  if (status === "warning") {
    return "Approaching budget limit";
  }

  return "Spending is within budget";
}