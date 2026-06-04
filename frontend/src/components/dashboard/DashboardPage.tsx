"use client";

import { useEffect, useState } from "react";
import PageLoader from "@/components/ui/PageLoader";
import { getDashboardData } from "@/lib/api/dashboardApi";
import { DashboardData } from "@/types/dashboard";

import DashboardHero from "./DashboardHero";
import MetricCard from "./MetricCard";
import BalanceChart from "./BalanceChart";
import CategoryIntelligenceCard from "./CategoryIntelligenceCard";
import AIInsightsCard from "./AIInsightsCard";
import RecentStatementUploadsCard from "./RecentStatementUploadsCard";
import SubscriptionsOverviewCard from "./SubscriptionsOverviewCard";
import BudgetHealthCard from "./BudgetHealthCard";
import SemanticSearchPreviewCard from "./SemanticSearchPreviewCard";
import RecentTransactionsTable from "./RecentTransactionsTable";
import FloatingAuraButton from "./FloatingAuraButton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const result = await getDashboardData();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <PageLoader message="Loading dashboard..." />;

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-[13px] font-semibold text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const hasData =
    data.recent_transactions.length > 0 ||
    data.top_spending.length > 0 ||
    data.chart.some((item) => item.income > 0 || item.expense > 0);

  return (
    <>
      <DashboardHero hasData={hasData} />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Balance"
          value={data.metrics.balance}
          helper={hasData ? "Calculated from uploaded data" : "Waiting for upload"}
          trend="+2.4%"
          type="positive"
        />

        <MetricCard
          label="Monthly Income"
          value={data.metrics.income}
          helper={hasData ? "Income detected this month" : "No income data yet"}
          trend="+12.1%"
          type="positive"
        />

        <MetricCard
          label="Total Expenses"
          value={data.metrics.expenses}
          helper={hasData ? "Expenses detected this month" : "No expenses yet"}
          trend={hasData ? "Review" : "Pending"}
          type={hasData ? "negative" : "neutral"}
        />

        <MetricCard
          label="Monthly Savings"
          value={data.metrics.savings}
          helper={hasData ? "Income minus expenses" : "Savings will appear here"}
          trend="AI tracked"
          type="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="space-y-5 xl:col-span-8">
          <AIInsightsCard insights={data.ai_insights} hasData={hasData} />

          <BalanceChart data={data.chart} hasData={hasData} />

          <CategoryIntelligenceCard
            spending={data.top_spending}
            hasData={hasData}
          />

          <RecentTransactionsTable
            transactions={data.recent_transactions}
            hasData={hasData}
          />
        </section>

        <aside className="space-y-5 xl:col-span-4">
          <RecentStatementUploadsCard uploads={data.recent_uploads} />

          <SubscriptionsOverviewCard
            subscriptions={data.subscriptions}
            monthlyTotal={data.subscriptions_monthly_total}
          />

          <BudgetHealthCard
            budgets={data.budgets}
            healthyCount={data.budget_healthy_count}
            recommendation={data.budget_recommendation}
          />

          <SemanticSearchPreviewCard
            query={data.semantic_preview_query}
            results={data.semantic_preview}
          />
        </aside>
      </div>

      <FloatingAuraButton />
    </>
  );
}