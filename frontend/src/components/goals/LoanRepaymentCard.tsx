import { Landmark } from "lucide-react";

import { GoalItem } from "@/types/goal";

type LoanRepaymentCardProps = {
  goals: GoalItem[];
};

export default function LoanRepaymentCard({
  goals,
}: LoanRepaymentCardProps) {
  const goal = goals[0];

  if (!goal) {
    return null;
  }

  const safeProgress = Math.min(
    Math.max(goal.progress, 0),
    100
  );

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
            <Landmark size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-red-600">
              Debt Repayment
            </p>

            <h3 className="mt-1 text-[18px] font-bold tracking-tight text-black">
              {goal.title}
            </h3>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Debt-free target:{" "}
              <span className="font-semibold text-black">
                {goal.target_date
                  ? formatDate(goal.target_date)
                  : "No target date"}
              </span>
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-[20px] font-bold tracking-tight text-red-600">
            {goal.remaining_amount_display}
          </p>

          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Remaining
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-5 sm:p-6">
        {/* Amount summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MetricBox
            label="Repaid"
            value={goal.current_amount_display}
          />

          <MetricBox
            label="Total Debt"
            value={goal.target_amount_display}
          />

          <MetricBox
            label="Progress"
            value={`${Math.round(safeProgress)}%`}
            accent
          />
        </div>

        {/* Progress */}
        <div className="mt-6 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                Repayment Progress
              </p>

              <p className="mt-1 text-[12px] text-[#565e74]">
                Track how much of this debt has already been cleared.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {getProgressLabel(safeProgress)}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-black to-[#4b5563] transition-[width] duration-700 ease-out"
              style={{
                width: `${safeProgress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-[#8a92a5]">
            <span>0%</span>
            <span>{Math.round(safeProgress)}% repaid</span>
            <span>100%</span>
          </div>
        </div>

        {/* Bottom summary */}
        <div className="mt-5 flex flex-col gap-3 border-t border-[#edf2fb] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Remaining Balance
            </p>

            <p className="mt-1 text-[14px] font-bold text-red-600">
              {goal.remaining_amount_display}
            </p>
          </div>

          <div className="inline-flex w-fit rounded-xl border border-[#e6edf9] bg-[#fbfcff] px-3 py-2 text-[10px] font-bold text-[#565e74]">
            {safeProgress >= 100
              ? "Debt fully repaid"
              : safeProgress >= 75
              ? "Close to debt-free"
              : safeProgress >= 40
              ? "Repayment progressing"
              : "Continue reducing the balance"}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-[#edf2fb] bg-[#fbfcff]"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
          accent
            ? "text-emerald-700"
            : "text-[#7c839b]"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1.5 text-[14px] font-bold ${
          accent
            ? "text-emerald-700"
            : "text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function getProgressLabel(
  progress: number
) {
  if (progress >= 100) {
    return "Completed";
  }

  if (progress >= 75) {
    return "Almost Done";
  }

  if (progress >= 40) {
    return "On Track";
  }

  return "In Progress";
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}