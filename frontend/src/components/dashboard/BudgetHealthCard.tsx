import { AlertCircle, Target } from "lucide-react";

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

export default function BudgetHealthCard({
  budgets,
  healthyCount,
  recommendation,
}: BudgetHealthCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Target size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Budget Health
              </h3>

              <p className="text-[12px] text-[#565e74]">
                AI monitored spending limits
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-bold text-emerald-700">
            {healthyCount} Healthy
          </span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-5 text-center">
            <p className="text-[13px] font-bold text-black">
              No budgets found
            </p>

            <p className="mt-1 text-[12px] text-[#565e74]">
              Create budgets to let Aura monitor your spending limits.
            </p>
          </div>
        ) : (
          budgets.map((budget) => (
            <div key={budget.label}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-black">
                    {budget.label}
                  </p>

                  <p className="mt-0.5 text-[11px] text-[#7c839b]">
                    {budget.used} of {budget.limit}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                    budget.overLimit
                      ? "bg-red-50 text-red-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {budget.percent}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
                <div
                  className={`relative h-full overflow-hidden rounded-full transition-all duration-700 ${
                    budget.overLimit
                      ? "bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                      : "bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-400"
                  }`}
                  style={{
                    width: `${Math.min(budget.percent, 100)}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent" />
                </div>
              </div>

              {budget.overLimit ? (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                  <AlertCircle size={13} className="shrink-0" />
                  {budget.note || "Over budget"}
                </div>
              ) : (
                <div className="mt-2 text-[11px] font-medium text-emerald-700">
                  Within budget
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[#edf2fb] bg-emerald-50/30 px-5 py-3">
        {typeof recommendation === "string" ? (
          <p className="text-[12px] leading-5 text-[#565e74]">
            {recommendation}
          </p>
        ) : (
          <div>
            {recommendation?.title && (
              <p className="text-[12px] font-bold text-black">
                {recommendation.title}
              </p>
            )}

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              {recommendation?.description ||
                "Aura will monitor your budgets once you add spending limits."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}