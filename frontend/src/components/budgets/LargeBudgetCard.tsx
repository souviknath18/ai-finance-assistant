import { Edit } from "lucide-react";
import { BudgetItem } from "@/types/budget";

type LargeBudgetCardProps = {
  budget: BudgetItem;
  icon: React.ReactNode;
};

export default function LargeBudgetCard({
  budget,
  icon,
}: LargeBudgetCardProps) {
  const isCritical =
    budget.status === "critical" || budget.status === "exceeded";

  return (
    <div
      className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm md:col-span-8 ${
        isCritical
          ? "border-red-100 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
          : "border-[#e5eeff]"
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isCritical ? "bg-red-50 text-red-600" : "bg-[#e5eeff] text-black"
            }`}
          >
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-bold text-black">
              {budget.category}
            </h3>

            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  isCritical
                    ? "bg-red-50 text-red-600"
                    : budget.status === "warning"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {budget.status}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Active {budget.period === "weekly" ? "Weekly" : "Monthly"} Budget
            </p>
          </div>
        </div>

        <button className="rounded-full p-1.5 text-[#565e74] transition hover:bg-[#e5eeff] hover:text-black">
          <Edit size={16} />
        </button>
      </div>

      <div className="mt-auto">
        <div className="mb-2.5 flex items-end justify-between gap-4">
          <div>
            <span className="text-2xl font-bold text-black">
              {budget.spent_display}
            </span>

            <span className="ml-2 text-[13px] text-[#565e74]">
              of {budget.limit_display} spent
            </span>
          </div>

          <span
            className={`text-[11px] font-bold uppercase tracking-wide ${
              isCritical ? "text-red-600" : "text-[#565e74]"
            }`}
          >
            {Math.round(budget.raw_usage_percent)}% used
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className={`h-full rounded-full ${
              budget.status === "critical" || budget.status === "exceeded"
                ? "bg-red-600"
                : "bg-emerald-700"
            }`}
            style={{ width: `${budget.usage_percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}