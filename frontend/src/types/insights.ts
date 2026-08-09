export type InsightSeverity =
  | "info"
  | "positive"
  | "warning"
  | "critical";

export type InsightDirection =
  | "up"
  | "down"
  | "same"
  | "unknown";

export type InsightAction = {
  label: string;
  url: string;
};

export type InsightImpact = {
  value: string | number | null;
  display: string;
  direction?: InsightDirection;
};

export type InsightAIContent = {
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  source: "ai" | "rule";
};

export type InsightItem = {
  id: string;
  type: string;
  severity: InsightSeverity;
  priority: number;

  title: string;
  description: string;

  category?: string;

  impact?: InsightImpact;

  action?: InsightAction;

  confidence?: number;

  evidence?: Record<string, unknown>;

  ai?: InsightAIContent;
};

export type InsightPeriod = {
  start: string;
  end: string;

  comparison_start: string;
  comparison_end: string;
};

export type InsightOverview = {
  income: string;
  income_display: string;

  expenses: string;
  expenses_display: string;

  savings: string;
  savings_display: string;

  savings_rate: number;

  transaction_count: number;
  expense_count: number;
  income_count: number;
};

export type ExecutiveSummary = {
  headline: string;
  description: string;
  recommendation: string;
  confidence: number;
  source: "ai" | "rule";
};

export type SpendingTrend = {
  current: string;
  previous: string;

  change_percent: number | null;

  direction: InsightDirection;
};

export type CategoryBreakdownItem = {
  category: string;

  amount: string;
  total_display: string;

  count: number;
  percentage: number;
};

export type TopMerchantItem = {
  merchant: string;

  amount: string;
  amount_display: string;

  count: number;
};

export type MonthlySpendingItem = {
  month: string;
  month_key?: string;

  amount: string;
  amount_display: string;

  transaction_count?: number;
};

export type InsightAnomalyItem = {
  transaction_id?: string | null;

  merchant: string;
  category: string;

  date?: string | null;

  amount: string;
  amount_display: string;

  title: string;
  description: string;

  reason?: string;
  basis?: string;

  z_score?: number | null;
  multiplier?: number | null;

  historical_average?: string;
  historical_average_display?: string;

  history_count?: number;
};

export type InsightAnomalies = {
  count: number;

  items: InsightAnomalyItem[];

  biggest_expense: InsightAnomalyItem | null;

  primary_alert: {
    title: string;
    description: string;
  };
};

export type RecurringSubscriptionItem = {
  id?: string | number | null;

  subscription_id?: string | null;

  merchant: string;
  category: string;

  amount: string;
  amount_display: string;

  monthly_amount: string;
  monthly_amount_display: string;

  billing_cycle: string;

  transactions_count: number;

  status?: string | null;
  source?: string | null;

  preference_status?: string | null;
  preference_note?: string | null;

  last_payment_date?: string | null;
  next_billing_date?: string | null;
};

export type RecurringDuplicateItem = {
  group: string;
  services: string[];
  count: number;
};

export type UpcomingBillItem = {
  merchant: string;

  amount: string;
  amount_display: string;

  next_billing_date?: string | null;

  days_remaining?: number | null;
};

export type InsightRecurring = {
  monthly_total: string;
  monthly_total_display: string;

  subscription_count: number;
  duplicate_count: number;
  upcoming_count: number;

  recurring_transaction_count?: number;

  subscriptions: RecurringSubscriptionItem[];

  duplicates: RecurringDuplicateItem[];

  upcoming_bills: UpcomingBillItem[];

  recommendation: string;
};

export type BudgetStatus =
  | "healthy"
  | "warning"
  | "at_risk"
  | "critical"
  | "exceeded";

export type BudgetRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type InsightBudgetItem = {
  id: string | number;

  budget_id: string;

  category: string;

  period: string;

  period_start: string;
  period_end: string;

  limit_amount: string;
  limit_display: string;

  spent_amount: string;
  spent_display: string;

  remaining_amount: string;
  remaining_display: string;

  usage_percent: number;

  projected_spend: string;
  projected_spend_display: string;

  projected_usage_percent: number;

  projected_overage: string;
  projected_overage_display: string;

  transaction_count: number;

  days_remaining: number;

  status: BudgetStatus;

  risk_level: BudgetRiskLevel;
};

export type InsightBudgetSummary = {
  active_budgets: number;

  total_limit: string;
  total_limit_display: string;

  total_spent: string;
  total_spent_display: string;

  total_remaining: string;
  total_remaining_display: string;

  overall_usage_percent: number;

  exceeded_count: number;
  at_risk_count: number;
  warning_count: number;
  healthy_count: number;
};

export type InsightBudgets = {
  summary: InsightBudgetSummary;

  items: InsightBudgetItem[];

  exceeded: InsightBudgetItem[];

  at_risk: InsightBudgetItem[];

  warnings: InsightBudgetItem[];

  healthy: InsightBudgetItem[];

  recommendation: {
    title: string;
    description: string;
  };
};

export type GoalStatus =
  | "completed"
  | "overdue"
  | "on_track"
  | "progressing"
  | "slightly_behind"
  | "at_risk"
  | "needs_attention";

export type GoalRiskLevel =
  | "low"
  | "medium"
  | "high";

export type InsightGoalItem = {
  id: string | number;

  goal_id: string;

  title: string;

  goal_type: string;

  priority: string;

  category?: string | number | null;
  category_name?: string | null;

  target_amount: string;
  target_amount_display: string;

  current_amount: string;
  current_amount_display: string;

  remaining_amount: string;
  remaining_amount_display: string;

  monthly_average: string;
  monthly_average_display: string;

  progress_percent: number;

  target_date?: string | null;

  days_remaining?: number | null;

  months_remaining?: number | null;

  required_monthly_contribution?: string | null;

  required_monthly_contribution_display?: string | null;

  monthly_gap?: string | null;

  monthly_gap_display?: string | null;

  expected_completion_months?: number | null;

  status: GoalStatus;

  risk_level: GoalRiskLevel;

  ai_recommendations_enabled: boolean;
};

export type InsightGoalSummary = {
  active_goals: number;

  completed_count: number;
  on_track_count: number;
  progressing_count: number;
  slightly_behind_count: number;
  at_risk_count: number;
  overdue_count: number;
  needs_attention_count: number;

  total_target: string;
  total_target_display: string;

  total_current: string;
  total_current_display: string;

  total_remaining: string;
  total_remaining_display: string;

  overall_progress_percent: number;
};

export type InsightGoals = {
  summary: InsightGoalSummary;

  items: InsightGoalItem[];

  completed: InsightGoalItem[];

  on_track: InsightGoalItem[];

  progressing: InsightGoalItem[];

  slightly_behind: InsightGoalItem[];

  at_risk: InsightGoalItem[];

  overdue: InsightGoalItem[];

  needs_attention: InsightGoalItem[];

  recommendation: {
    title: string;
    description: string;
  };
};

export type FinancialHealthComponentStatus =
  | "good"
  | "fair"
  | "low";

export type FinancialHealthComponent = {
  score: number;
  max_score: number;

  percentage: number;

  status: FinancialHealthComponentStatus;

  [key: string]: unknown;
};

export type FinancialHealthArea = {
  key: string;
  label: string;
  score_percent: number;
};

export type FinancialHealth = {
  score: number;

  status:
    | "Excellent"
    | "Healthy"
    | "Fair"
    | "Needs Attention"
    | "Critical"
    | string;

  savings_rate: number;

  breakdown: {
    savings: FinancialHealthComponent;
    cashflow: FinancialHealthComponent;
    stability: FinancialHealthComponent;
    recurring: FinancialHealthComponent;
    anomalies: FinancialHealthComponent;
    budgets: FinancialHealthComponent;
    goals: FinancialHealthComponent;
  };

  strengths: FinancialHealthArea[];

  concerns: FinancialHealthArea[];

  methodology: {
    savings_max: number;
    cashflow_max: number;
    stability_max: number;
    recurring_max: number;
    anomalies_max: number;
    budgets_max: number;
    goals_max: number;
    total_max: number;
  };
};

export type InsightSnapshotStatus =
  | "pending"
  | "generating"
  | "ready"
  | "failed";

export type InsightDashboard = {
  status: InsightSnapshotStatus;

  is_stale: boolean;

  period: InsightPeriod;

  generated_at: string;

  overview: InsightOverview;

  executive_summary: ExecutiveSummary;

  spending_trend: SpendingTrend;

  alerts: InsightItem[];

  categories: CategoryBreakdownItem[];

  top_merchants: TopMerchantItem[];

  monthly_spending: MonthlySpendingItem[];

  anomalies: InsightAnomalies;

  recurring: InsightRecurring;

  budgets: InsightBudgets;

  goals: InsightGoals;

  financial_health: FinancialHealth;

  insights: InsightItem[];
};

export type InsightStatusResponse = {
  insight_id: string;

  status: InsightSnapshotStatus;

  is_stale: boolean;

  has_data: boolean;

  generated_at: string | null;

  period: {
    start: string | null;
    end: string | null;
  };

  error?: string | null;
};

export type InsightRegenerateResponse = {
  detail: string;

  task_id: string;

  snapshot: InsightStatusResponse;
};