"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

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
  onDeleteRequestAction: (budgetId: string) => void;
};

export default function BudgetGrid({
  budgets,
  onDeleteRequestAction,
  onRefreshAction,
}: BudgetGridProps) {
  const [manageOpen, setManageOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<BudgetItem | null>(null);

  if (budgets.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5eeff] bg-white p-6 text-[13px] font-semibold text-[#565e74] shadow-sm">
        No budgets created yet. Create a budget to start tracking spending.
      </div>
    );
  }

  const sortedBudgets = [...budgets].sort(
    (a, b) => b.raw_usage_percent - a.raw_usage_percent
  );

  const mainBudget = sortedBudgets[0];
  const otherBudgets = sortedBudgets.slice(1, 5);
  const remainingBudgets = sortedBudgets.slice(5);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <LargeBudgetCard
          budget={mainBudget}
          icon={(() => {
            const Icon = getCategoryIcon(mainBudget.category);
            return <Icon size={20} />;
          })()}
        />

        {otherBudgets.map((budget) => (
          <BudgetCard
            key={budget.budget_id}
            icon={(() => {
              const Icon = getCategoryIcon(budget.category);
              return <Icon size={18} />;
            })()}
            title={budget.category}
            subtitle={`${budget.period === "weekly" ? "Weekly" : "Monthly"} budget`}
            amount={`${budget.spent_display} / ${budget.limit_display}`}
            progress={Math.round(budget.usage_percent)}
            badge={
              budget.status === "critical" || budget.status === "exceeded"
                ? "Critical"
                : budget.status === "warning"
                ? "Watch"
                : "Safe"
            }
            warning={
              budget.status === "critical" || budget.status === "exceeded"
                ? `${budget.remaining_display} remaining.`
                : undefined
            }
            tone={
              budget.status === "critical" || budget.status === "exceeded"
                ? "red"
                : "default"
            }
            className="md:col-span-4"
          />
        ))}

        {remainingBudgets.length > 0 && (
          <OtherBudgetCard
            icon={<MoreHorizontal size={18} />}
            title="Other Categories"
            subtitle={`${remainingBudgets.length} more active budgets`}
            amount={`${remainingBudgets.length} budgets`}
            progress={40}
            onManageAction={() => setManageOpen(true)}
          />
        )}
      </div>

      <ManageBudgetsModal
        open={manageOpen}
        budgets={remainingBudgets}
        onCloseAction={() => setManageOpen(false)}
        onDeleteAction={onDeleteRequestAction}
        onEditAction={(budget) => {
          setManageOpen(false);
          setEditBudget(budget);
        }}
      />

      <CreateBudgetModal
        open={Boolean(editBudget)}
        mode="edit"
        budget={editBudget}
        onCloseAction={() => setEditBudget(null)}
        onSuccessAction={() => {
          setEditBudget(null);
          onRefreshAction();
        }}
      />
    </>
  );
}