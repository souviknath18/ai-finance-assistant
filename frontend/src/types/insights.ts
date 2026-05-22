export type InsightObservation = {
  title: string;
  description: string;
  category: string;
  impact: string;
  action: string;
  tone: "neutral" | "warning" | "saving";
};

export type InsightDashboard = {
  executive_summary: {
    title: string;
    headline: string;
    description: string;
  };

  alerts: {
    budget_warning: {
      title: string;
      description: string;
    };

    saving_opportunity: {
      title: string;
      description: string;
    };
  };

  metrics: {
    spending_spikes: string;
    spending_spikes_description: string;
    unusual_activity_count: number;
    recurring_total: string;
    recurring_description: string;
    health_score: number;
    health_status: string;
    wealth_score: number;
  };

  anomalies: {
    alert_count: number;

    alerts: {
      title: string;
      description: string;
      amount_display: string;
      category: string;
    }[];
  };

  category_breakdown: {
    category: string;
    total_display: string;
    count: number;
  }[];

  monthly_spending: {
    month: string;
    amount: string;
    amount_display: string;
  }[];

  wealth_tip: {
    title: string;
    description: string;
    potential_earn: string;
    potential_description: string;
  };

  observations: InsightObservation[];
};