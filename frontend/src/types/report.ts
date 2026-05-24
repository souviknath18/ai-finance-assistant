export type ReportDashboard = {
  period: {
    title: string;
    range: string;
    status: string;
  };
  performance: {
    income: string;
    expenses: string;
    savings: string;
    chart: {
      month: string;
      income: number;
      expense: number;
    }[];
  };
  ai_insight: {
    summary: string;
    top_unusual_title: string;
    top_unusual_amount: string;
  };
  categories: {
    label: string;
    value: string;
    width: string;
    amount: number;
    count: number;
  }[];
  recurring_payments: {
    merchant: string;
    average_amount: string;
    next_billing_date?: string;
    billing_cycle?: string;
  }[];
  recurring_count: number;
};

export type GeneratedReportResponse = {
  report_id: string;
  report: ReportDashboard;
};