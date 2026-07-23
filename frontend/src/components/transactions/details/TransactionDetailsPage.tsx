"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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

  const params = useParams<{ id: string }>();

  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadTransaction = useCallback(async () => {
    if (!params.id) {
      setError("Transaction ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await getTransactionDetails(
        params.id,
      );

      setTransaction(result);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to load transaction.",
        ),
      );

    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void loadTransaction();
  }, [loadTransaction]);

  async function handleDelete() {
    if (!transaction || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteTransaction(transaction.id);

      router.replace("/transactions");
      router.refresh();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to delete transaction.",
        ),
      );

    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  }

  async function handleCategoryChange(
    category: string,
  ) {
    if (!transaction) {
      return;
    }

    try {
      setError("");

      await updateTransactionCategory(
        transaction.id,
        category,
      );

      // Re-fetch so every card receives the updated data.
      await loadTransaction();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update category.",
        ),
      );
    }
  }

  if (loading) {
    return <TransactionDetailsSkeleton />;
  }

  if (error && !transaction) {
    return (
      <ErrorScreen
        title="Unable to load transaction"
        message={error}
        backText="Back to Transactions"
        onBackAction={() => router.push("/transactions")}
        onRetryAction={() => void loadTransaction()}
      />
    );
  }

  if (!transaction) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-7xl">
      <button
        type="button"
        onClick={() => router.push("/transactions")}
        className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold text-[#565e74] transition hover:text-black"
      >
        <ArrowLeft size={17} />
        Back to Transactions
      </button>

      {error && transaction && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <DetailsHeader
        transaction={transaction}
        deleting={deleting}
        onDelete={() => setDeleteModalOpen(true)}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="space-y-5 xl:col-span-8">
          <SummaryCard
            transaction={transaction}
            onCategoryChange={
              handleCategoryChange
            }
          />

          {transaction.ai && (
            <AIInsightsCard
              insight={transaction.ai}
            />
          )}

          <SourceAuditCard
            source={transaction.source}
            rawText={transaction.rawText}
          />

          <PreviousPaymentsCard
            payments={
              transaction.previousPayments
            }
          />
        </section>

        <aside className="space-y-5 xl:col-span-4">
          {transaction.trend && (
            <AIPulseCard
              trend={transaction.trend}
            />
          )}

          <OptimizationTipsCard
            tips={
              transaction.optimizationTips
            }
          />

          <MerchantInfoCard
            merchant={transaction.merchant}
          />
        </aside>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${transaction.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onCloseAction={() => setDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
      />
    </main>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof error.detail === "string"
  ) {
    return error.detail;
  }

  return fallback;
}

function TransactionDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl animate-pulse">
      <div className="mb-4 h-5 w-40 rounded bg-slate-200" />

      <div className="mb-6 h-12 max-w-lg rounded-xl bg-slate-200" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <div className="h-36 rounded-2xl bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-200" />
        </div>

        <div className="space-y-5 xl:col-span-4">
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </main>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
      <h1 className="text-lg font-bold text-red-700">
        Unable to load transaction
      </h1>

      <p className="mt-2 text-[13px] text-red-600">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white"
      >
        Try Again
      </button>
    </div>
  );
}