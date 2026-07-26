export type BackendTransaction = {
  id: number;
  transaction_id: string;
  uploaded_file: number | null;
  uploaded_file_name: string | null;
  date: string;
  date_is_estimated: boolean;
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
  status: TransactionStatus;
  selected: boolean;
  ai: boolean;
  review?: boolean;
  uploadId: string;
  uploadName: string;
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

export type TransactionStatus =
  | "AI Verified"
  | "Rule Verified"
  | "User Verified"
  | "Manual"
  | "AI Review Needed";

export type BackendPreviousPayment = {
  transaction_id: string;
  date: string;
  date_is_estimated: boolean;
  description: string;
  merchant_name: string | null;
  amount: string;
  transaction_type: BackendTransaction["transaction_type"];
  category: string | null;
  status: TransactionStatus;
};

export type BackendTransactionSource = {
  id: number;
  upload_id: string | null;
  filename: string;
  file_type: string;
  uploaded_at: string | null;
  processed_at: string | null;
};

export type BackendTransactionAI = {
  categorized: boolean;
  confidence: string | number | null;
  reason: string | null;
  category_source: BackendTransaction["category_source"];
};

export type BackendTransactionTrend = {
  category: string;
  current_month_total: string;
  previous_month_total: string;
  percentage_change: number | null;
  direction: "up" | "down" | "same";
};

export type BackendTransactionDetails = BackendTransaction & {
  status: TransactionStatus;
  review_needed: boolean;
  is_recurring: boolean;

  source: BackendTransactionSource | null;

  previous_payments: BackendPreviousPayment[];

  ai: BackendTransactionAI | null;

  merchant: {
    name: string;
    location: string | null;
    industry: string | null;
  };

  trend: BackendTransactionTrend | null;

  optimization_tips: {
    id?: string;
    type?: string;
    text: string;
  }[];
};

export type PreviousPaymentItem = {
  id: string;
  date: string;
  title: string;
  amount: string;
  type: "income" | "expense";
  status: TransactionStatus;
};

export type TransactionDetails = {
  id: string;
  backendId: number;

  title: string;
  description: string;
  rawText: string | null;

  date: string;
  rawDate: string;

  amount: string;
  rawAmount: string;

  type: "income" | "expense";

  category: string;
  categorySource: BackendTransaction["category_source"];

  status: TransactionStatus;
  reviewNeeded: boolean;
  isReviewed: boolean;
  isRecurring: boolean;

  balanceAfterTransaction: string | null;

  ai: {
    categorized: boolean;
    confidence: number | null;
    reason: string | null;
    categorySource:
      | "rule"
      | "ai"
      | "user"
      | "none";
  } | null;

  source: {
    id: number;
    uploadId: string | null;
    filename: string;
    fileType: string;
    uploadedAt: string | null;
    processedAt: string | null;
  } | null;

  previousPayments: PreviousPaymentItem[];

  merchant: {
    name: string;
    location: string | null;
    industry: string | null;
  };

  trend: {
    category: string;
    currentMonthTotal: number;
    previousMonthTotal: number;
    percentageChange: number | null;
    direction: "up" | "down" | "same";
  } | null;

  optimizationTips: {
    id?: string;
    type?: string;
    text: string;
  }[];
};