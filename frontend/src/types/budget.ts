export type BudgetStatus = "safe" | "warning" | "critical" | "exceeded";
export type BudgetPeriod = "weekly" | "monthly";

export type BudgetItem = {
  id: number;
  budget_id: string;
  category: string;
  limit_amount: string;
  spent_amount: string;
  remaining_amount: string;
  limit_display: string;
  spent_display: string;
  remaining_display: string;
  usage_percent: number;
  raw_usage_percent: number;
  status: BudgetStatus;
  period: BudgetPeriod;
};

export type BudgetDashboard = {
  summary: {
    total_limit: number;
    total_spent: number;
    overall_usage: number;
    active_budgets: number;
  };
  recommendation: {
    title: string;
    description: string;
  };
  budgets: BudgetItem[];
};

export type CreateBudgetPayload = {
  category: string;
  limit_amount: string;
  period?: BudgetPeriod;
  is_active?: boolean;
};