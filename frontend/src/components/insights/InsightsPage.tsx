"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Lightbulb,
  PiggyBank,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import HeroInsightCard from "./HeroInsightCard";
import AlertInsightCard from "./AlertInsightCard";
import InsightMetricCard from "./InsightMetricCard";
import CategoryBreakdownCard from "./CategoryBreakdownCard";
import FinancialHealthCard from "./FinancialHealthCard";
import ObservationTable from "./ObservationTable";
import MiniBars from "./MiniBars";

import PageLoader from "@/components/ui/PageLoader";

import { getInsightsDashboard } from "@/lib/api/insightsApi";
import { InsightDashboard } from "@/types/insights";

export default function InsightsPage() {
  const [data, setData] = useState<InsightDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = useCallback(async (showRefresh = false) => {
    try {
      setError(null);

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await getInsightsDashboard();

      setData(result);
    } catch (err) {
      console.error("Failed to load insights:", err);

      setError(
        "We couldn't load your financial insights right now. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  if (loading) {
    return <PageLoader />;
  }

  if (error && !data) {
    return (
      <main className="min-h-screen">
        <section className="rounded-2xl border border-[#e5eeff] bg-white p-8 shadow-sm">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-700">
              <CircleAlert size={20} />
            </div>

            <h2 className="text-lg font-bold text-black">
              Unable to load insights
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadInsights()}
              className="mt-5 flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
            >
              <RefreshCcw size={15} />
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  const biggestExpense = data.anomalies?.alerts?.[0];

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Insights
          </h1>

          <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#565e74]">
            Intelligent observations about your spending, recurring expenses,
            financial health, and saving opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadInsights(true)}
          disabled={refreshing}
          className="flex w-fit items-center gap-2 rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[12px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            size={15}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh Insights"}
        </button>
      </section>

      {/* Non-blocking error */}
      {error && data && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <CircleAlert size={17} className="shrink-0 text-red-700" />

          <p className="text-[12px] font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Executive Summary + Alerts */}
      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
        <HeroInsightCard
          headline={data.executive_summary.headline}
          description={data.executive_summary.description}
        />

        <div className="flex flex-col gap-4 md:col-span-4">
          <AlertInsightCard
            icon={<AlertTriangle size={18} />}
            tag="Important"
            title={
              data.alerts.budget_warning.title ||
              "No major financial warning"
            }
            description={
              data.alerts.budget_warning.description ||
              "Your spending currently looks stable."
            }
            tone="red"
          />

          <AlertInsightCard
            icon={<PiggyBank size={18} />}
            tag="Opportunity"
            title={
              data.alerts.saving_opportunity.title ||
              "Saving Opportunity"
            }
            description={
              data.alerts.saving_opportunity.description ||
              "Keep tracking your expenses to discover more saving opportunities."
            }
            tone="green"
          />
        </div>
      </section>

      {/* Main Insight Metrics */}
      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InsightMetricCard
          icon={<TrendingUp size={18} />}
          title="Spending Trend"
          value={data.metrics.spending_spikes}
          description={data.metrics.spending_spikes_description}
        >
          <MiniBars items={data.monthly_spending || []} />
        </InsightMetricCard>

        <InsightMetricCard
          icon={<CircleAlert size={18} />}
          title="Unusual Activity"
          value={`${data.metrics.unusual_activity_count} ${
            data.metrics.unusual_activity_count === 1 ? "Alert" : "Alerts"
          }`}
          description="Transactions that stand out from your normal spending behaviour."
          tone="red"
        >
          <div className="space-y-3">
            {!data.anomalies?.alerts?.length ? (
              <div className="rounded-xl bg-[#f8faff] px-3.5 py-3">
                <p className="text-[13px] leading-5 text-[#565e74]">
                  No unusual transactions detected.
                </p>
              </div>
            ) : (
              data.anomalies.alerts.slice(0, 2).map((alert, index) => (
                <div key={`${alert.title}-${index}`}>
                  <AlertRow
                    title={alert.title}
                    desc={`${alert.category} • ${alert.amount_display}`}
                  />

                  {index !==
                    data.anomalies.alerts.slice(0, 2).length - 1 && (
                    <div className="mt-3 h-px bg-[#e5eeff]" />
                  )}
                </div>
              ))
            )}
          </div>
        </InsightMetricCard>

        <InsightMetricCard
          icon={<RefreshCcw size={18} />}
          title="Recurring Expenses"
          value={data.metrics.recurring_total}
          description={data.metrics.recurring_description}
          tone="purple"
        >
          <div className="rounded-xl border border-[#e5eeff] bg-[#f8faff] p-3.5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#565e74]">
              Aura Analysis
            </p>

            <p className="mt-1.5 text-[13px] leading-5 text-black">
              {data.alerts.saving_opportunity.description}
            </p>
          </div>
        </InsightMetricCard>

        {/* Category */}
        <CategoryBreakdownCard items={data.category_breakdown || []} />

        {/* Financial Health */}
        <FinancialHealthCard
          icon={<Lightbulb size={18} />}
          score={data.metrics.health_score}
          status={data.metrics.health_status}
          description={data.wealth_tip.description}
        />
      </section>

      {/* Observations */}
      <ObservationTable observations={data.observations || []} />

      {/* Temporary debugging-safe reference */}
      {biggestExpense && (
        <span className="hidden">{biggestExpense.title}</span>
      )}
    </main>
  );
}

function AlertRow({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div>
      <p className="text-[13px] font-bold leading-5 text-black">{title}</p>

      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">{desc}</p>
    </div>
  );
}