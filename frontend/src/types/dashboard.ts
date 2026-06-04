export type DashboardData = {
  metrics: {
    balance: string;
    income: string;
    expenses: string;
    savings: string;
  };
  chart: {
    month: string;
    income: number;
    expense: number;
  }[];
  ai_insights: {
    title: string;
    description: string;
  }[];
  top_spending: {
    label: string;
    amount: string;
    total: number;
  }[];
  recent_transactions: {
    date: string;
    description: string;
    category: string;
    amount: string;
    type: "income" | "expense" | "transfer" | "unknown";
  }[];

  recent_uploads: {
    id: number;
    name: string;
    size: string;
    status: "pending" | "processing" | "success" | "failed";
    progress: number;
  }[];

  subscriptions: {
    id: number;
    name: string;
    price: string;
    nextBilling: string;
  }[];

  subscriptions_monthly_total: string;

  budgets: {
    label: string;
    used: string;
    limit: string;
    percent: number;
    overLimit: boolean;
    note?: string | null;
  }[];

  budget_healthy_count: number;
  budget_recommendation: string;

  semantic_preview_query: string;

  semantic_preview: {
    merchant: string;
    amount: string;
    category: string;
    similarity: string;
  }[];
};