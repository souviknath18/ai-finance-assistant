export type InsightTone =
  | "neutral"
  | "warning"
  | "saving";

export type InsightSeverity =
  | "info"
  | "positive"
  | "warning"
  | "critical";

export type InsightObservation = {
  type?: string;
  severity?: InsightSeverity;
  priority?: number;

  title: string;
  description: string;

  category: string;
  impact: string;
  action: string;

  tone: InsightTone;

  evidence?: Record<string, unknown>;
};

export type ExecutiveSummary = {
  headline: string;
  description: string;
  recommendation: string;
  source: "ai" | "rule";
};

export type InsightAlert = {
  title: string;
  description: string;
};

export type InsightMetrics = {
  spending_spikes: string;
  spending_spikes_description: string;

  unusual_activity_count: number;

  recurring_total: string;
  recurring_description: string;

  health_score: number;
  health_status: string;
};

export type InsightPeriod = {
  start: string;
  end: string;

  comparison_start: string;
  comparison_end: string;
};

export type InsightOverview = {
  total_income: string;
  total_income_display: string;

  total_expense: string;
  total_expense_display: string;

  savings: string;
  savings_display: string;

  savings_rate: number;

  transaction_count: number;
  expense_count: number;
  income_count: number;
};

export type SpendingTrend = {
  current_amount: string | number;
  previous_amount: string | number;

  change_percent: number | null;

  direction:
    | "up"
    | "down"
    | "same"
    | "unknown";
};

export type CategoryTrend = {
  category: string;

  current_amount: string | number;
  previous_amount: string | number;

  current_display?: string;
  previous_display?: string;

  change_percent: number | null;

  direction:
    | "up"
    | "down"
    | "same"
    | "new";
};

export type InsightTrends = {
  spending: SpendingTrend;
  categories: CategoryTrend[];
  spikes: CategoryTrend[];
};

export type InsightAnomaly = {
  title: string;
  description: string;

  merchant?: string;

  amount: string;
  amount_display: string;

  category: string;

  transaction_id?: string;
  date?: string | null;

  score?: number;
  reason?: string;
};

export type InsightAnomalies = {
  alerts: InsightAnomaly[];

  alert_count: number;

  biggest_expense: InsightAnomaly | null;

  primary_alert: {
    title: string;
    description: string;
  };

  average_expense?: number;
};

export type CategoryBreakdownItem = {
  category: string;

  amount: string;
  total_display: string;

  count: number;
  percentage: number;
};

export type MonthlySpendingItem = {
  month: string;
  amount: string;
  amount_display: string;
};

export type RecurringSubscription = {
  merchant_name?: string;
  merchant?: string;
  average_amount?: number | string;
  frequency?: string;
  confidence?: number;

  [key: string]: unknown;
};

export type RecurringDuplicate = {
  group: string;
  count: number;
  services: string[];

  [key: string]: unknown;
};

export type RecurringBill = {
  [key: string]: unknown;
};

export type InsightRecurring = {
  subscriptions: RecurringSubscription[];

  duplicates: RecurringDuplicate[];

  upcoming_bills: RecurringBill[];

  monthly_total: string;
  monthly_total_display: string;

  subscription_count: number;
  duplicate_count: number;
  upcoming_count: number;

  recommendation: string;
};

export type FinancialHealthBreakdownItem = {
  score: number;
  max_score: number;
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
    savings: FinancialHealthBreakdownItem;
    cashflow: FinancialHealthBreakdownItem;
    stability: FinancialHealthBreakdownItem;
    recurring: FinancialHealthBreakdownItem;
    anomalies: FinancialHealthBreakdownItem;
  };
};

export type WealthTip = {
  title: string;
  description: string;
  potential_earn: string;
  potential_description: string;
};

export type InsightDashboard = {
  period: InsightPeriod;

  executive_summary: ExecutiveSummary;

  alerts: {
    budget_warning: InsightAlert;
    saving_opportunity: InsightAlert;
  };

  metrics: InsightMetrics;

  overview: InsightOverview;

  trends: InsightTrends;

  anomalies: InsightAnomalies;

  recurring: InsightRecurring;

  category_breakdown: CategoryBreakdownItem[];

  monthly_spending: MonthlySpendingItem[];

  health: FinancialHealth;

  wealth_tip: WealthTip;

  signals: InsightObservation[];

  observations: InsightObservation[];

  generated_at: string;
};