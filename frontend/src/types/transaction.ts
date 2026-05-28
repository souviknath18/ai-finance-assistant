export type BackendTransaction = {
  id: number;
  transaction_id: string;
  uploaded_file: number | null;
  uploaded_file_name: string | null;
  date: string;
  description: string;
  merchant_name: string | null;
  amount: string;
  transaction_type: "income" | "expense" | "transfer" | "unknown";
  category: string | null;
  category_source: "rule" | "ai" | "user" | "none";
  balance_after_transaction: string | null;
  is_ai_categorized: boolean;
  ai_confidence: string | null;
  ai_reason: string | null;
  is_reviewed: boolean;
  raw_text: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionTableItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  status:
  | "AI Verified"
  | "Rule Verified"
  | "User Verified"
  | "Manual"
  | "AI Review Needed";
  selected: boolean;
  ai: boolean;
  review?: boolean;
};

export type PaginatedTransactionsResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: BackendTransaction[];
};

export type GetTransactionsParams = {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  transactionType?: string;
  statusFilter?: string;
  startDate?: string;
  endDate?: string;
};