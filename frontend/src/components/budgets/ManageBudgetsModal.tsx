"use client";

import {
  X,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";

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

  const attentionCount =
    budgets.filter(
      (budget) =>
        budget.status === "warning" ||
        budget.status === "critical" ||
        budget.status === "exceeded"
    ).length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-black">
              Manage Budgets
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Edit, review, or remove your active budget categories.
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseAction}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            aria-label="Close manage budgets"
          >
            <X size={17} />
          </button>
        </div>

        {/* Aura notice */}
        <div className="shrink-0 border-b border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                <Sparkles size={15} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Aura Budget Notice
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#35524a]">
                  {attentionCount > 0
                    ? `${attentionCount} ${
                        attentionCount === 1
                          ? "budget may"
                          : "budgets may"
                      } require attention this period.`
                    : "All listed budgets are currently within a healthy range."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget list */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          {budgets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-6 py-12 text-center">
              <p className="text-[13px] font-bold text-black">
                No additional budgets
              </p>

              <p className="mt-1 text-[12px] text-[#565e74]">
                There are no more budget categories to manage.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => {
                const Icon =
                  getCategoryIcon(
                    budget.category
                  );

                const statusStyles =
                  getStatusStyles(
                    budget.status
                  );

                const safeProgress =
                  Math.min(
                    Math.max(
                      budget.usage_percent,
                      0
                    ),
                    100
                  );

                return (
                  <div
                    key={budget.budget_id}
                    className="rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      {/* Left */}
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${statusStyles.icon}`}
                        >
                          <Icon size={17} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[14px] font-bold text-black">
                              {budget.category}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${statusStyles.badge}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                              />

                              {formatStatus(
                                budget.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] font-medium text-[#7c839b]">
                            {budget.period ===
                            "weekly"
                              ? "Weekly"
                              : "Monthly"}{" "}
                            budget
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="w-full lg:max-w-sm">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-[12px] font-bold text-black">
                            {
                              budget.spent_display
                            }{" "}
                            /{" "}
                            {
                              budget.limit_display
                            }
                          </p>

                          <p
                            className={`shrink-0 text-[10px] font-bold ${statusStyles.text}`}
                          >
                            {Math.round(
                              budget.raw_usage_percent
                            )}
                            % used
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#edf2fb]">
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 ${statusStyles.progress}`}
                            style={{
                              width: `${safeProgress}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1.5 text-[10px] text-[#7c839b]">
                          Remaining:{" "}
                          <span className="font-semibold text-[#565e74]">
                            {
                              budget.remaining_display
                            }
                          </span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEditAction?.(
                              budget
                            )
                          }
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3.5 text-[11px] font-bold text-black transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDeleteAction?.(
                              budget.budget_id
                            )
                          }
                          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3.5 text-[11px] font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
      dot:
        "bg-red-500",
      text:
        "text-red-600",
      progress:
        "bg-red-600",
    };
  }

  if (status === "warning") {
    return {
      icon:
        "border-amber-100 bg-amber-50 text-amber-700",
      badge:
        "border-amber-100 bg-amber-50 text-amber-700",
      dot:
        "bg-amber-500",
      text:
        "text-amber-700",
      progress:
        "bg-amber-500",
    };
  }

  return {
    icon:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    badge:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    dot:
      "bg-emerald-500",
    text:
      "text-emerald-700",
    progress:
      "bg-emerald-600",
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