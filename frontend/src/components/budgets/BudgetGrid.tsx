"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  WalletCards,
} from "lucide-react";

import LargeBudgetCard from "./LargeBudgetCard";
import BudgetCard from "./BudgetCard";
import OtherBudgetCard from "./OtherBudgetCard";
import ManageBudgetsModal from "./ManageBudgetsModal";
import CreateBudgetModal from "./CreateBudgetModal";

import { BudgetItem } from "@/types/budget";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";

type BudgetGridProps = {
  budgets: BudgetItem[];
  onRefreshAction: () => void;
  onDeleteRequestAction: (
    budgetId: string
  ) => void;
};

export default function BudgetGrid({
  budgets,
  onDeleteRequestAction,
  onRefreshAction,
}: BudgetGridProps) {
  const [manageOpen, setManageOpen] =
    useState(false);

  const [editBudget, setEditBudget] =
    useState<BudgetItem | null>(null);

  if (budgets.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <WalletCards size={20} />
        </div>

        <h3 className="mt-4 text-[15px] font-bold text-black">
          No budgets created yet
        </h3>

        <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-[#565e74]">
          Create your first budget to start tracking spending
          and let Aura monitor your category limits.
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
          <Plus size={12} />
          Create a budget to get started
        </div>
      </div>
    );
  }

  const sortedBudgets = [...budgets].sort(
    (a, b) =>
      b.raw_usage_percent -
      a.raw_usage_percent
  );

  const mainBudget =
    sortedBudgets[0];

  const otherBudgets =
    sortedBudgets.slice(1, 5);

  const remainingBudgets =
    sortedBudgets.slice(5);

  return (
    <>
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-12">
        {/* Main budget */}
        <LargeBudgetCard
          budget={mainBudget}
          icon={(() => {
            const Icon = getCategoryIcon(
              mainBudget.category
            );

            return <Icon size={19} />;
          })()}
        />

        {/* Secondary budgets */}
        {otherBudgets.map(
          (budget) => {
            const Icon =
              getCategoryIcon(
                budget.category
              );

            const isCritical =
              budget.status ===
                "critical" ||
              budget.status ===
                "exceeded";

            return (
              <BudgetCard
                key={budget.budget_id}
                icon={
                  <Icon size={18} />
                }
                title={
                  budget.category
                }
                subtitle={`${
                  budget.period ===
                  "weekly"
                    ? "Weekly"
                    : "Monthly"
                } budget`}
                amount={`${budget.spent_display} / ${budget.limit_display}`}
                progress={Math.round(
                  budget.usage_percent
                )}
                badge={
                  isCritical
                    ? "Critical"
                    : budget.status ===
                      "warning"
                    ? "Watch"
                    : "Safe"
                }
                warning={
                  isCritical
                    ? `${budget.remaining_display} remaining.`
                    : undefined
                }
                tone={
                  isCritical
                    ? "red"
                    : "default"
                }
                className="md:col-span-4"
              />
            );
          }
        )}

        {/* Remaining budgets */}
        {remainingBudgets.length >
          0 && (
          <OtherBudgetCard
            icon={
              <MoreHorizontal
                size={18}
              />
            }
            title="Other Categories"
            subtitle={`${remainingBudgets.length} more active budget${
              remainingBudgets.length ===
              1
                ? ""
                : "s"
            }`}
            amount={`${remainingBudgets.length} budget${
              remainingBudgets.length ===
              1
                ? ""
                : "s"
            }`}
            progress={40}
            onManageAction={() =>
              setManageOpen(true)
            }
          />
        )}
      </div>

      {/* Manage remaining budgets */}
      <ManageBudgetsModal
        open={manageOpen}
        budgets={remainingBudgets}
        onCloseAction={() =>
          setManageOpen(false)
        }
        onDeleteAction={
          onDeleteRequestAction
        }
        onEditAction={(budget) => {
          setManageOpen(false);
          setEditBudget(budget);
        }}
      />

      {/* Edit budget */}
      <CreateBudgetModal
        open={Boolean(editBudget)}
        mode="edit"
        budget={editBudget}
        onCloseAction={() =>
          setEditBudget(null)
        }
        onSuccessAction={() => {
          setEditBudget(null);
          onRefreshAction();
        }}
      />
    </>
  );
}