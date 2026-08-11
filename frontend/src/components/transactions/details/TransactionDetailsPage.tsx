"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
} from "lucide-react";

import {
  deleteTransaction,
  getTransactionDetails,
  updateTransactionCategory,
} from "@/lib/api/transactionApi";

import type {
  TransactionDetails,
} from "@/types/transaction";

import DetailsHeader from "./DetailsHeader";
import SummaryCard from "./SummaryCard";
import AIInsightsCard from "./AIInsightsCard";
import SourceAuditCard from "./SourceAuditCard";
import PreviousPaymentsCard from "./PreviousPaymentsCard";
import AIPulseCard from "./AIPulseCard";
import OptimizationTipsCard from "./OptimizationTipsCard";
import MerchantInfoCard from "./MerchantInfoCard";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ErrorScreen from "@/components/ui/ErrorScreen";

export default function TransactionDetailsPage() {
  const router = useRouter();

  const params =
    useParams<{
      id: string;
    }>();

  const [
    transaction,
    setTransaction,
  ] =
    useState<TransactionDetails | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadTransaction =
    useCallback(async () => {
      if (!params.id) {
        setError(
          "Transaction ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const result =
          await getTransactionDetails(
            params.id
          );

        setTransaction(
          result
        );
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            "Unable to load transaction."
          )
        );
      } finally {
        setLoading(false);
      }
    }, [params.id]);

  useEffect(() => {
    void loadTransaction();
  }, [loadTransaction]);

  async function handleDelete() {
    if (
      !transaction ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteTransaction(
        transaction.id
      );

      router.replace(
        "/transactions"
      );

      router.refresh();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to delete transaction."
        )
      );
    } finally {
      setDeleting(false);

      setDeleteModalOpen(
        false
      );
    }
  }

  async function handleCategoryChange(
    category: string
  ) {
    if (!transaction) {
      return;
    }

    try {
      setError("");

      await updateTransactionCategory(
        transaction.id,
        category
      );

      await loadTransaction();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update category."
        )
      );
    }
  }

  if (loading) {
    return (
      <TransactionDetailsSkeleton />
    );
  }

  if (
    error &&
    !transaction
  ) {
    return (
      <ErrorScreen
        title="Unable to load transaction"
        message={error}
        backText="Back to Transactions"
        onBackAction={() =>
          router.push(
            "/transactions"
          )
        }
        onRetryAction={() =>
          void loadTransaction()
        }
      />
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <>
      {/* Back */}
      <button
        type="button"
        onClick={() =>
          router.push(
            "/transactions"
          )
        }
        className="group mb-4 inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[11px] font-bold text-[#565e74] transition hover:text-black"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />

        Back to Transactions
      </button>

      {/* Inline Error */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[11px] font-semibold leading-5 text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Header */}
      <DetailsHeader
        transaction={
          transaction
        }
        deleting={
          deleting
        }
        onDelete={() =>
          setDeleteModalOpen(
            true
          )
        }
      />

      {/* Content */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Main */}
        <section className="min-w-0 space-y-4 xl:col-span-8">
          <SummaryCard
            transaction={transaction}
          />

          {transaction.ai && (
            <AIInsightsCard
              insight={
                transaction.ai
              }
            />
          )}

          <SourceAuditCard
            source={
              transaction.source
            }
            rawText={
              transaction.rawText
            }
          />

          <PreviousPaymentsCard
            payments={
              transaction.previousPayments
            }
          />
        </section>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-4 xl:col-span-4">
          {transaction.trend && (
            <AIPulseCard
              trend={
                transaction.trend
              }
            />
          )}

          <OptimizationTipsCard
            tips={
              transaction.optimizationTips
            }
          />

          <MerchantInfoCard
            merchant={
              transaction.merchant
            }
          />
        </aside>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={
          deleteModalOpen
        }
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transaction.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={
          deleting
        }
        onCloseAction={() =>
          setDeleteModalOpen(
            false
          )
        }
        onConfirmAction={
          handleDelete
        }
      />
    </>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error ===
      "object" &&
    error !== null &&
    "detail" in error &&
    typeof error.detail ===
      "string"
  ) {
    return error.detail;
  }

  return fallback;
}

function TransactionDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back */}
      <div className="mb-4 h-4 w-32 rounded bg-[#e5eeff]" />

      {/* Header */}
      <div className="mb-5 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 h-6 w-28 rounded-full bg-[#e5eeff]" />

            <div className="h-6 w-72 max-w-full rounded bg-[#e5eeff]" />

            <div className="mt-2 h-3 w-44 rounded bg-[#eff4ff]" />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="h-10 w-28 rounded-xl bg-[#e5eeff]" />

            <div className="h-10 w-28 rounded-xl bg-[#e5eeff]" />

            <div className="h-10 w-20 rounded-xl bg-red-100" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Main */}
        <div className="min-w-0 space-y-4 xl:col-span-8">
          <SkeletonCard height="h-48" />

          <SkeletonCard height="h-64" />

          <SkeletonCard height="h-56" />

          <SkeletonCard height="h-64" />
        </div>

        {/* Sidebar */}
        <div className="min-w-0 space-y-4 xl:col-span-4">
          <div className="h-80 rounded-3xl bg-black/90" />

          <SkeletonCard height="h-56" />

          <SkeletonCard height="h-64" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({
  height,
}: {
  height: string;
}) {
  return (
    <div
      className={`${height} rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.04)]`}
    />
  );
}