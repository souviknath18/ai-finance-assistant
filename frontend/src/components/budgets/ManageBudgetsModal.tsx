"use client";

import { X, Pencil, Trash2 } from "lucide-react";

import { BudgetItem } from "@/types/budget";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";

type ManageBudgetsModalProps = {
  open: boolean;
  budgets: BudgetItem[];
  onCloseAction: () => void;
  onDeleteAction?: (budgetId: string) => void;
  onEditAction?: (budget: BudgetItem) => void;
};

export default function ManageBudgetsModal({
  open,
  budgets,
  onCloseAction,
  onDeleteAction,
  onEditAction,
}: ManageBudgetsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between border-b border-[#eef2ff] px-5 py-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-black">
              Manage Budgets
            </h2>

            <p className="mt-1 text-[13px] text-[#565e74]">
              Edit, review, or remove your active budget categories.
            </p>
          </div>

          <button
            onClick={onCloseAction}
            className="rounded-full p-1.5 text-[#565e74] transition hover:bg-[#eef2ff] hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-[#eef2ff] bg-[#f8fbff] px-5 py-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              Aura AI Notice
            </p>

            <p className="text-[13px] leading-5 text-[#35524a]">
              {budgets.filter(
                (budget) =>
                  budget.status === "warning" ||
                  budget.status === "critical" ||
                  budget.status === "exceeded"
              ).length}{" "}
              budgets may require attention this period.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {budgets.map((budget) => {
              const Icon = getCategoryIcon(budget.category);

              const isCritical =
                budget.status === "critical" ||
                budget.status === "exceeded";

              return (
                <div
                  key={budget.budget_id}
                  className="rounded-2xl border border-[#e5eeff] bg-white p-4 transition hover:border-[#c6c6cd]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isCritical
                            ? "bg-red-50 text-red-600"
                            : "bg-[#eef2ff] text-black"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-black">
                            {budget.category}
                          </h3>

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

                        <p className="mt-1 text-[13px] text-[#565e74]">
                          {budget.period === "weekly" ? "Weekly" : "Monthly"}{" "}
                          Budget
                        </p>
                      </div>
                    </div>

                    <div className="w-full max-w-md flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-black">
                          {budget.spent_display} / {budget.limit_display}
                        </p>

                        <p
                          className={`text-[11px] font-bold ${
                            isCritical ? "text-red-600" : "text-[#565e74]"
                          }`}
                        >
                          {Math.round(budget.raw_usage_percent)}% used
                        </p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#eef2ff]">
                        <div
                          className={`h-full rounded-full ${
                            isCritical
                              ? "bg-red-600"
                              : budget.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-emerald-600"
                          }`}
                          style={{
                            width: `${budget.usage_percent}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-[11px] text-[#565e74]">
                        Remaining: {budget.remaining_display}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditAction?.(budget)}
                        className="flex items-center gap-2 rounded-xl border border-[#dce9ff] px-3.5 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eef2ff]"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => onDeleteAction?.(budget.budget_id)}
                        className="flex items-center gap-2 rounded-xl border border-red-100 px-3.5 py-2.5 text-[13px] font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}