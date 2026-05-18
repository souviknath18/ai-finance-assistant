import {
  BackendTransaction,
  TransactionTableItem,
} from "@/types/transaction";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

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

export async function getTransactions(): Promise<TransactionTableItem[]> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/transactions/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.map(mapTransaction);
}


export async function deleteTransaction(transactionId: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/transactions/${transactionId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/transactions/bulk-delete/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/transactions/${transactionId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category,
      is_reviewed: true,
      category_source: "user",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return mapTransaction(data);
}