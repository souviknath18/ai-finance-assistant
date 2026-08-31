export type AccountConnectionStatus =
  | "connected"
  | "syncing"
  | "error"
  | "disconnected";

export type FinancialAccount = {
  id: string;

  institution_name: string;
  institution_code: string;

  account_name: string;
  account_type: string;

  masked_account_number: string;

  balance: number | null;
  currency: string;

  status: AccountConnectionStatus;

  last_synced_at: string | null;
  created_at: string;
};

export type AccountSummary = {
  total_accounts: number;
  connected_accounts: number;
  total_balance: number;
  last_synced_at: string | null;
};

export type BankInstitution = {
  code: string;
  name: string;

  description?: string;

  available: boolean;

  demo_account_name: string;
  demo_account_type: string;
  demo_masked_account_number: string;
  demo_currency: string;
};

export type AccountsDashboard = {
  summary: AccountSummary;

  accounts: FinancialAccount[];

  available_institutions: BankInstitution[];
};

export type ConnectAccountPayload = {
  institution_code: string;
};

export type AccountSyncResult = {
  account_id: string;

  status: "syncing";

  message: string;
};