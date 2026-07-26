import {
  BackendTransaction,
  BackendTransactionDetails,
  TransactionDetails,
  TransactionStatus,
  TransactionTableItem,
  GetTransactionsParams,
} from "@/types/transaction";

import { authFetch } from "@/lib/api/authFetch";

function formatTransactionDate(
  date: string,
  isEstimated: boolean,
) {
  if (isEstimated) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

function formatAmount(amount: string, type: string) {
  const value = Number(amount);
  const prefix = type === "income" ? "+" : "-";

  return `${prefix}₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function isTransactionReviewNeeded(
  transaction: BackendTransaction,
): boolean {
  return (
    !transaction.category ||
    transaction.category === "Uncategorized" ||
    transaction.category_source === "none"
  );
}

function getTransactionStatus(
  transaction: BackendTransaction,
): TransactionStatus {
  if (isTransactionReviewNeeded(transaction)) {
    return "AI Review Needed";
  }

  if (transaction.category_source === "ai") {
    return "AI Verified";
  }

  if (transaction.category_source === "rule") {
    return "Rule Verified";
  }

  if (transaction.category_source === "user") {
    return "User Verified";
  }

  return "Manual";
}

function mapTransaction(
  transaction: BackendTransaction,
): TransactionTableItem {
  const reviewNeeded =
    isTransactionReviewNeeded(transaction);

  return {
    id: transaction.transaction_id,
    date: formatTransactionDate(
      transaction.date,
      transaction.date_is_estimated,
    ),
    title:
      transaction.description ||
      transaction.merchant_name ||
      "Unknown transaction",
    subtitle:
      transaction.uploaded_file_name ||
      "Manual Transaction",
    category:
      transaction.category ||
      "Select Category",
    amount: formatAmount(
      transaction.amount,
      transaction.transaction_type,
    ),
    type:
      transaction.transaction_type === "income"
        ? "income"
        : transaction.transaction_type === "expense"
          ? "expense"
          : "expense",
    status: getTransactionStatus(transaction),
    selected: false,
    ai: transaction.category_source === "ai",
    review: reviewNeeded,
    uploadId:
      transaction.uploaded_file !== null
        ? String(transaction.uploaded_file)
        : "manual",
    uploadName:
      transaction.uploaded_file_name ||
      "Manual Transactions",
  };
}

function normalizeAIConfidence(
  confidence: string | number | null,
): number | null {
  if (confidence === null || confidence === undefined) {
    return null;
  }

  const value = Number(confidence);

  if (!Number.isFinite(value)) {
    return null;
  }

  // AI services commonly return probabilities between 0 and 1.
  const percentage = value <= 1
    ? value * 100
    : value;

  return Math.min(
    100,
    Math.max(0, percentage),
  );
}

function mapTransactionDetails(
  transaction: BackendTransactionDetails,
): TransactionDetails {
  return {
    id: transaction.transaction_id,
    backendId: transaction.id,

    title:
      transaction.description ||
      transaction.merchant_name ||
      "Unknown transaction",

    description: transaction.description,
    rawText: transaction.raw_text,

    date: formatTransactionDate(
      transaction.date,
      transaction.date_is_estimated,
    ),
    rawDate: transaction.date,

    amount: formatAmount(
      transaction.amount,
      transaction.transaction_type,
    ),

    rawAmount: transaction.amount,

    type:
      transaction.transaction_type === "income"
        ? "income"
        : transaction.transaction_type === "expense"
          ? "expense"
          : "expense",

    category:
      transaction.category ||
      "Uncategorized",

    categorySource:
      transaction.category_source,

    status:
      transaction.status ||
      getTransactionStatus(transaction),

    reviewNeeded:
      transaction.review_needed,

    isReviewed:
      transaction.is_reviewed,

    isRecurring:
      transaction.is_recurring,

    balanceAfterTransaction:
      transaction.balance_after_transaction,

    ai: transaction.ai
      ? {
          categorized:
            transaction.ai.categorized,

          confidence: normalizeAIConfidence(
            transaction.ai.confidence,
          ),

          reason:
            transaction.ai.reason,

          categorySource:
            transaction.ai.category_source,
        }
      : null,

    source: transaction.source
      ? {
          id: transaction.source.id,
          uploadId:
            transaction.source.upload_id,
          filename:
            transaction.source.filename,
          fileType:
            transaction.source.file_type,
          uploadedAt:
            transaction.source.uploaded_at,
          processedAt:
            transaction.source.processed_at,
        }
      : null,

    previousPayments:
      transaction.previous_payments.map(
        (payment) => ({
          id: payment.transaction_id,

          date: formatTransactionDate(
            payment.date,
            payment.date_is_estimated,
          ),

          title:
            payment.description ||
            payment.merchant_name ||
            "Unknown transaction",

          amount: formatAmount(
            payment.amount,
            payment.transaction_type,
          ),

          type:
            payment.transaction_type === "income"
              ? "income"
              : "expense",

          status: payment.status,
        }),
      ),

    merchant: transaction.merchant,

    trend: transaction.trend
      ? {
          category:
            transaction.trend.category,

          currentMonthTotal: Number(
            transaction.trend.current_month_total,
          ),

          previousMonthTotal: Number(
            transaction.trend.previous_month_total,
          ),

          percentageChange:
            transaction.trend.percentage_change,

          direction:
            transaction.trend.direction,
        }
      : null,

    optimizationTips:
      transaction.optimization_tips,
  };
}

export async function getTransactions(params: GetTransactionsParams): Promise<{
  count: number;
  totalPages: number;
  currentPage: number;
  results: TransactionTableItem[];
}> {
  const query = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });

  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "all") {
    query.set("category", params.category);
  }
  if (params.transactionType && params.transactionType !== "all") {
    query.set("type", params.transactionType);
  }
  if (params.statusFilter && params.statusFilter !== "all") {
    query.set("status", params.statusFilter);
  }
  if (params.startDate) query.set("start_date", params.startDate);
  if (params.endDate) query.set("end_date", params.endDate);

  const response = await authFetch(
    `/api/transactions/?${query.toString()}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return {
    count: data.count,
    totalPages: data.total_pages,
    currentPage: data.current_page,
    results: data.results.map(mapTransaction),
  };
}

export async function deleteTransaction(transactionId: string) {
  const response = await authFetch(
    `/api/transactions/${transactionId}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  const response = await authFetch("/api/transactions/bulk-delete/", {
    method: "POST",
    body: JSON.stringify({
      transaction_ids: transactionIds,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function updateTransactionCategory(
  transactionId: string,
  category: string
) {
  const response = await authFetch(
    `/api/transactions/${transactionId}/`,
    {
      method: "PATCH",
      body: JSON.stringify({
        category,
        is_reviewed: true,
        category_source: "user",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return mapTransaction(data);
}

export async function getTransactionDetails(
  transactionId: string,
): Promise<TransactionDetails> {
  const response = await authFetch(
    `/api/transactions/${transactionId}/`,
    {
      method: "GET",
    },
  );

  const contentType =
    response.headers.get("content-type") ?? "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (typeof data === "string") {
      throw new Error(
        response.status >= 500
          ? "The server encountered an error. Please try again."
          : data || "Unable to load transaction.",
      );
    }

    throw data;
  }

  return mapTransactionDetails(
    data as BackendTransactionDetails,
  );
}