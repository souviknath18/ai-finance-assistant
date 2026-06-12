import {
  BackendTransaction,
  TransactionTableItem,
  GetTransactionsParams,
} from "@/types/transaction";

import { authFetch } from "@/lib/api/authFetch";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: string, type: string) {
  const value = Number(amount);
  const prefix = type === "income" ? "+" : "-";

  return `${prefix}₹${Math.abs(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

function mapTransaction(transaction: BackendTransaction): TransactionTableItem {
  const reviewNeeded =
    !transaction.category ||
    transaction.category === "Uncategorized" ||
    transaction.category_source === "none";

  let status: TransactionTableItem["status"] = "Manual";

  if (reviewNeeded) {
    status = "AI Review Needed";
  } else if (transaction.category_source === "ai") {
    status = "AI Verified";
  } else if (transaction.category_source === "rule") {
    status = "Rule Verified";
  } else if (transaction.category_source === "user") {
    status = "User Verified";
  }

  return {
    id: transaction.transaction_id,
    date: formatDate(transaction.date),
    title: transaction.merchant_name || transaction.description,
    subtitle: transaction.uploaded_file_name || "Manual Transaction",
    category: transaction.category || "Select Category",
    amount: formatAmount(transaction.amount, transaction.transaction_type),
    type: transaction.transaction_type === "income" ? "income" : "expense",
    status,
    selected: false,
    ai: transaction.category_source === "ai",
    review: reviewNeeded,
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