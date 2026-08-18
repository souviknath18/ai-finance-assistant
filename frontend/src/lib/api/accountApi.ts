import { authFetch } from "@/lib/api/authFetch";

import {
  AccountSyncResult,
  AccountsDashboard,
  ConnectAccountPayload,
  FinancialAccount,
} from "@/types/account";

export async function getAccountsDashboard() {
  const response = await authFetch(
    "/api/banking/accounts/",
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as AccountsDashboard;
}

export async function connectAccount(
  payload: ConnectAccountPayload
) {
  const response = await authFetch(
    "/api/banking/accounts/connect/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as FinancialAccount;
}

export async function syncAccount(
  accountId: string
) {
  const response = await authFetch(
    `/api/banking/accounts/${accountId}/sync/`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as AccountSyncResult;
}

export async function disconnectAccount(
  accountId: string
) {
  const response = await authFetch(
    `/api/banking/accounts/${accountId}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    let data;

    try {
      data = await response.json();
    } catch {
      data = {
        detail: "Failed to disconnect account.",
      };
    }

    throw data;
  }

  return true;
}