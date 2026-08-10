"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BudgetHeader from "./BudgetsHeader";
import AIRecommendationCard from "./AIRecommendationCard";
import BudgetGrid from "./BudgetGrid";
import BudgetIntelligenceSection from "./BudgetIntelligenceSection";
import CreateBudgetModal from "./CreateBudgetModal";

import ConfirmModal from "../ui/ConfirmModal";
import PageLoader from "@/components/ui/PageLoader";
import ErrorScreen from "@/components/ui/ErrorScreen";

import {
  deleteBudget,
  getBudgetDashboard,
} from "@/lib/api/budgetApi";

import { BudgetDashboard } from "@/types/budget";

export default function BudgetsPage() {
  const router = useRouter();

  const [data, setData] =
    useState<BudgetDashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedBudgetId, setSelectedBudgetId] =
    useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const loadBudgets = async () => {
    try {
      setError(null);
      setLoading(true);

      const result =
        await getBudgetDashboard();

      setData(result);
    } catch (err) {
      console.error(
        "Failed to load budgets:",
        err
      );

      setData(null);

      setError(
        err instanceof Error
          ? err.message
          : "We couldn't load your budgets."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget =
    async () => {
      if (!selectedBudgetId) {
        return;
      }

      try {
        setDeleteLoading(true);

        await deleteBudget(
          selectedBudgetId
        );

        await loadBudgets();

        setDeleteOpen(false);
        setSelectedBudgetId(null);
      } catch (err) {
        console.error(
          "Failed to delete budget:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "We couldn't delete this budget."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  useEffect(() => {
    loadBudgets();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error && !data) {
    return (
      <ErrorScreen
        title="Unable to load budgets"
        message={error}
        retryText="Try Again"
        backText="Back to Dashboard"
        isRetrying={loading}
        onRetryAction={loadBudgets}
        onBackAction={() =>
          router.push("/dashboard")
        }
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* Page Header */}
      {/* ------------------------------------------------------------- */}

      <BudgetHeader
        onCreateAction={() =>
          setCreateModalOpen(true)
        }
      />

      {/* ------------------------------------------------------------- */}
      {/* Non-blocking error */}
      {/* ------------------------------------------------------------- */}

      {error && data && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[12px] font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Aura Recommendation */}
      {/* ------------------------------------------------------------- */}

      <section className="mb-6">
        <AIRecommendationCard
          title={
            data.recommendation.title
          }
          description={
            data.recommendation.description
          }
        />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Budget Cards */}
      {/* ------------------------------------------------------------- */}

      <section className="mb-8">
        <BudgetGrid
          budgets={data.budgets}
          onRefreshAction={loadBudgets}
          onDeleteRequestAction={(
            budgetId
          ) => {
            setSelectedBudgetId(
              budgetId
            );

            setDeleteOpen(true);
          }}
        />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Aura Budget Intelligence */}
      {/* ------------------------------------------------------------- */}

      <section className="mb-8">
        <BudgetIntelligenceSection />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* Create Budget */}
      {/* ------------------------------------------------------------- */}

      <CreateBudgetModal
        open={createModalOpen}
        onCloseAction={() =>
          setCreateModalOpen(false)
        }
        onSuccessAction={loadBudgets}
      />

      {/* ------------------------------------------------------------- */}
      {/* Delete confirmation */}
      {/* ------------------------------------------------------------- */}

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
        onConfirmAction={
          handleDeleteBudget
        }
      />
    </main>
  );
}