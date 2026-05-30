"use client";

import { useEffect, useState } from "react";

import BudgetHeader from "./BudgetsHeader";
import AIRecommendationCard from "./AIRecommendationCard";
import BudgetGrid from "./BudgetGrid";
import QuickEditSection from "./QuickEditSection";
import CreateBudgetModal from "./CreateBudgetModal";
import { getBudgetDashboard } from "@/lib/api/budgetApi";
import { BudgetDashboard } from "@/types/budget";
import ConfirmModal from "../ui/ConfirmModal";
import { deleteBudget } from "@/lib/api/budgetApi";
import PageLoader from "@/components/ui/PageLoader";

export default function BudgetsPage() {
  const [data, setData] = useState<BudgetDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadBudgets = async () => {
    setLoading(true);

    try {
      const result = await getBudgetDashboard();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!selectedBudgetId) return;

    try {
      setDeleteLoading(true);

      await deleteBudget(selectedBudgetId);

      await loadBudgets();

      setDeleteOpen(false);
      setSelectedBudgetId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  if (loading) {
    return <PageLoader message="Loading budgets..." />;
  }

  if (!data) {
    return (
      <div className="text-[13px] font-semibold text-red-600">
        Failed to load budgets.
      </div>
    );
  }

  return (
    <>
      <BudgetHeader onCreateAction={() => setCreateModalOpen(true)} />

      <AIRecommendationCard
        title={data.recommendation.title}
        description={data.recommendation.description}
      />

      <BudgetGrid
        budgets={data.budgets}
        onRefreshAction={loadBudgets}
        onDeleteRequestAction={(budgetId) => {
          setSelectedBudgetId(budgetId);
          setDeleteOpen(true);
        }}
      />

      <QuickEditSection />

      <CreateBudgetModal
        open={createModalOpen}
        onCloseAction={() => setCreateModalOpen(false)}
        onSuccessAction={loadBudgets}
      />

      <ConfirmModal
        open={deleteOpen}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmText="Delete Budget"
        loading={deleteLoading}
        onCloseAction={() => {
          setDeleteOpen(false);
          setSelectedBudgetId(null);
        }}
        onConfirmAction={handleDeleteBudget}
      />
    </>
  );
}