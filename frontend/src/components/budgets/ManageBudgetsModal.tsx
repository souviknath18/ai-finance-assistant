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
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#dce9ff] bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#eef2ff] px-8 py-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-black">
              Manage Budgets
            </h2>

            <p className="mt-1 text-sm text-[#565e74]">
              Edit, review, or remove your active budget categories.
            </p>
          </div>

          <button
            onClick={onCloseAction}
            className="rounded-full p-2 text-[#565e74] transition hover:bg-[#eef2ff] hover:text-black"
          >
            <X size={22} />
          </button>
        </div>

        {/* AI NOTICE */}
        <div className="border-b border-[#eef2ff] bg-[#f8fbff] px-8 py-5">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
              Aura AI Notice
            </p>

            <p className="text-sm leading-7 text-[#35524a]">
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

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-5">
            {budgets.map((budget) => {
              const Icon = getCategoryIcon(budget.category);

              const isCritical =
                budget.status === "critical" ||
                budget.status === "exceeded";

              return (
                <div
                  key={budget.budget_id}
                  className="rounded-3xl border border-[#e5eeff] bg-white p-6 transition hover:border-[#c6c6cd]"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    
                    {/* LEFT */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isCritical
                            ? "bg-red-50 text-red-600"
                            : "bg-[#eef2ff] text-black"
                        }`}
                      >
                        <Icon size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-black">
                            {budget.category}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
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

                        <p className="mt-1 text-sm text-[#565e74]">
                          {budget.period === "weekly"
                            ? "Weekly"
                            : "Monthly"}{" "}
                          Budget
                        </p>
                      </div>
                    </div>

                    {/* CENTER */}
                    <div className="w-full max-w-md flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-black">
                          {budget.spent_display} / {budget.limit_display}
                        </p>

                        <p
                          className={`text-xs font-bold ${
                            isCritical
                              ? "text-red-600"
                              : "text-[#565e74]"
                          }`}
                        >
                          {Math.round(budget.raw_usage_percent)}% used
                        </p>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-[#eef2ff]">
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

                      <p className="mt-2 text-xs text-[#565e74]">
                        Remaining: {budget.remaining_display}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditAction?.(budget)}
                        className="flex items-center gap-2 rounded-xl border border-[#dce9ff] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#eef2ff]"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDeleteAction?.(budget.budget_id)
                        }
                        className="flex items-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
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