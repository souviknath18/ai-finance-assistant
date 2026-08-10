"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Lightbulb,
  PiggyBank,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import InsightsHeader from "./InsightsHeader";
import AlertInsightCard from "./AlertInsightCard";
import CategoryBreakdownCard from "./CategoryBreakdownCard";
import FinancialHealthCard from "./FinancialHealthCard";
import HeroInsightCard from "./HeroInsightCard";
import InsightMetricCard from "./InsightMetricCard";
import MiniBars from "./MiniBars";
import ObservationTable from "./ObservationTable";
import { InsightPeriod } from "./PeriodSelector";
import PeriodSelector from "./PeriodSelector";
import OverviewMetrics from "./OverviewMetrics";
import DomainSummaryCard from "./DomainSummaryCard";
import InsightsSkeleton from "./InsightsSkeleton";
import PageLoader from "@/components/ui/PageLoader";
import ErrorScreen from "@/components/ui/ErrorScreen";

import {
  getInsightsDashboard,
  regenerateAndFetchInsights,
} from "@/lib/api/insightsApi";

import {
  InsightDashboard,
  InsightItem,
} from "@/types/insights";


export default function InsightsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [periodLoading, setPeriodLoading] = useState(false);
  const hasLoadedRef = useRef(false);
  const [data, setData] = useState<InsightDashboard | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<InsightPeriod>("this_month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // -------------------------------------------------------------------
  // Initial dashboard loading
  // -------------------------------------------------------------------

  const loadInsights = useCallback(async () => {
    if (
      period === "custom" &&
      (!startDate || !endDate)
    ) {
      return;
    }

    try {
      setError(null);

      if (hasLoadedRef.current) {
        setPeriodLoading(true);
      } else {
        setLoading(true);
      }

      const result = await getInsightsDashboard({
        period,
        startDate,
        endDate,
      });

      setData(result);
      hasLoadedRef.current = true;
    } catch (err) {
      console.error(
        "Failed to load insights:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "We couldn't load your financial insights."
      );
    } finally {
      setLoading(false);
      setPeriodLoading(false);
    }
  }, [
    period,
    startDate,
    endDate,
  ]);


  // -------------------------------------------------------------------
  // Manual AI / analytics regeneration
  // -------------------------------------------------------------------

  const refreshInsights =
    useCallback(async () => {
      if (
        period === "custom" &&
        (!startDate || !endDate)
      ) {
        setError(
          "Please select both start and end dates."
        );
        return;
      }

      try {
        setError(null);
        setRefreshing(true);

        const result =
          await regenerateAndFetchInsights({
            period,
            startDate,
            endDate,
          });

        setData(result);
      } catch (err) {
        console.error(
          "Failed to refresh insights:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "We couldn't refresh your financial insights."
        );
      } finally {
        setRefreshing(false);
      }
    }, [
      period,
      startDate,
      endDate,
    ]);


  useEffect(() => {
    loadInsights();
  }, [loadInsights]);


  // -------------------------------------------------------------------
  // Derived display data
  // -------------------------------------------------------------------

  const spendingTrendValue =
    useMemo(() => {
      if (!data) {
        return "No comparison";
      }

      const change =
        data.spending_trend.change_percent;

      if (change === null) {
        return "No comparison";
      }

      if (change > 0) {
        return `+${change.toFixed(1)}%`;
      }

      if (change < 0) {
        return `-${Math.abs(change).toFixed(
          1
        )}%`;
      }

      return "0%";
    }, [data]);


  const spendingTrendDescription =
    useMemo(() => {
      if (!data) {
        return "";
      }

      const change =
        data.spending_trend.change_percent;

      if (change === null) {
        return (
          "More historical data is needed " +
          "to calculate a reliable spending trend."
        );
      }

      if (change > 0) {
        return (
          `Spending increased ${change.toFixed(
            1
          )}% compared with the previous period.`
        );
      }

      if (change < 0) {
        return (
          `Spending decreased ${Math.abs(
            change
          ).toFixed(
            1
          )}% compared with the previous period.`
        );
      }

      return (
        "Spending is unchanged compared " +
        "with the previous period."
      );
    }, [data]);


  const topAlerts =
    useMemo(() => {
      if (!data) {
        return [];
      }

      return data.alerts.slice(0, 2);
    }, [data]);


  // -------------------------------------------------------------------
  // Loading
  // -------------------------------------------------------------------

  if (loading) {
    return <PageLoader />;
  }


  // -------------------------------------------------------------------
  // Blocking error
  // -------------------------------------------------------------------

  if (error && !data) {
    return (
      <ErrorScreen
        title="Unable to load insights"
        message={error}
        retryText="Try Again"
        backText="Back to Dashboard"
        isRetrying={loading}
        onRetryAction={loadInsights}
        onBackAction={() =>
          router.push("/dashboard")
        }
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* Page Header */}
      {/* ------------------------------------------------------------- */}

      <InsightsHeader
        startDate={data.period.start}
        endDate={data.period.end}
        generatedAt={data.generated_at}
        isStale={data.is_stale}
        refreshing={refreshing}
        onRefresh={refreshInsights}
      />

      {/* ------------------------------------------------------------- */}
      {/* Period Selector */}
      {/* ------------------------------------------------------------- */}

      <section className="mb-6">
        <PeriodSelector
          value={period}
          onChange={setPeriod}
          startDate={startDate}
          endDate={endDate}
          onCustomDateChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />
      </section>


      {/* ------------------------------------------------------------- */}
      {/* Non-blocking refresh error */}
      {/* ------------------------------------------------------------- */}

      {error && data && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <CircleAlert
            size={17}
            className="shrink-0 text-red-700"
          />

          <p className="text-[12px] font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {periodLoading ? (
        <InsightsSkeleton />
      ) : (
        <>

          {/* ------------------------------------------------------------- */}
          {/* Overview */}
          {/* ------------------------------------------------------------- */}

          <OverviewMetrics
            overview={data.overview}
          />


          {/* ------------------------------------------------------------- */}
          {/* Executive Summary + Alerts */}
          {/* ------------------------------------------------------------- */}

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
            <HeroInsightCard
              summary={data.executive_summary}
            />

            <div className="flex flex-col gap-4 md:col-span-4">
              {topAlerts.length > 0 ? (
                topAlerts.map((alert) => (
                  <AlertInsightCard
                    key={alert.id}
                    title={getInsightTitle(alert)}
                    description={getInsightDescription(alert)}
                    severity={alert.severity}
                  />
                ))
              ) : (
                <AlertInsightCard
                  icon={<PiggyBank size={18} />}
                  tag="Stable"
                  title="No major financial alerts"
                  description="Aura did not detect any high-priority financial risks for this period."
                  severity="positive"
                />
              )}

              {topAlerts.length === 1 && (
                <AlertInsightCard
                  icon={<Lightbulb size={18} />}
                  tag="Recommendation"
                  title="Aura Recommendation"
                  description={
                    data.executive_summary.recommendation
                  }
                  severity="info"
                />
              )}
            </div>
          </section>


          {/* ------------------------------------------------------------- */}
          {/* Main Metrics */}
          {/* ------------------------------------------------------------- */}

          <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Spending trend */}
            <InsightMetricCard
              icon={
                data.spending_trend.direction === "down" ? (
                  <TrendingDown size={18} />
                ) : (
                  <TrendingUp size={18} />
                )
              }
              title="Spending Trend"
              value={spendingTrendValue}
              description={spendingTrendDescription}
              tone={
                data.spending_trend.direction === "up"
                  ? "red"
                  : data.spending_trend.direction === "down"
                  ? "green"
                  : "default"
              }
            >
              <MiniBars items={data.monthly_spending || []} />
            </InsightMetricCard>

            {/* Unusual activity */}
            <InsightMetricCard
              icon={<CircleAlert size={18} />}
              title="Unusual Activity"
              value={`${data.anomalies.count} ${
                data.anomalies.count === 1 ? "Alert" : "Alerts"
              }`}
              description="Transactions that differ significantly from your historical spending patterns."
              tone={data.anomalies.count > 0 ? "red" : "green"}
            >
              <div className="space-y-3">
                {data.anomalies.items.length === 0 ? (
                  <div className="rounded-xl border border-[#edf2fb] bg-[#fbfcff] px-3.5 py-3">
                    <p className="text-[13px] leading-5 text-[#565e74]">
                      No unusual transactions were detected for this period.
                    </p>
                  </div>
                ) : (
                  data.anomalies.items
                    .slice(0, 2)
                    .map((anomaly, index) => (
                      <div
                        key={
                          anomaly.transaction_id ??
                          `${anomaly.merchant}-${index}`
                        }
                      >
                        <AlertRow
                          title={anomaly.merchant}
                          desc={`${anomaly.category} • ${anomaly.amount_display}`}
                        />

                        {index !==
                          Math.min(data.anomalies.items.length, 2) - 1 && (
                          <div className="mt-3 h-px bg-[#edf2fb]" />
                        )}
                      </div>
                    ))
                )}
              </div>
            </InsightMetricCard>

            {/* Recurring expenses */}
            <InsightMetricCard
              icon={<RefreshCcw size={18} />}
              title="Recurring Expenses"
              value={data.recurring.monthly_total_display}
              description={
                data.recurring.subscription_count > 0
                  ? `${data.recurring.subscription_count} recurring payment${
                      data.recurring.subscription_count === 1 ? "" : "s"
                    } detected.`
                  : "No active recurring expenses detected."
              }
              tone="purple"
            >
              <div className="rounded-xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                  Aura Analysis
                </p>

                <p className="mt-1.5 text-[13px] leading-5 text-black">
                  {data.recurring.recommendation}
                </p>
              </div>
            </InsightMetricCard>
          </section>

          {/* ------------------------------------------------------------- */}
          {/* Category + Financial Health */}
          {/* ------------------------------------------------------------- */}

          <section className="mb-8 grid grid-cols-1 items-stretch gap-5 xl:grid-cols-12">
            <div className="h-full xl:col-span-4">
              <CategoryBreakdownCard
                items={data.categories}
              />
            </div>

            <div className="h-full xl:col-span-8">
              <FinancialHealthCard
                health={data.financial_health}
              />
            </div>
          </section>


          {/* ------------------------------------------------------------- */}
          {/* Budget / Goal Intelligence */}
          {/* ------------------------------------------------------------- */}

          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <DomainSummaryCard
              icon={
                <WalletCards size={18} />
              }
              title="Budget Intelligence"
              primaryValue={
                data.budgets.summary
                  .active_budgets > 0
                  ? `${data.budgets.summary.overall_usage_percent.toFixed(
                      0
                    )}% used`
                  : "No budgets"
              }
              description={
                data.budgets.recommendation
                  .description
              }
              supportingText={
                data.budgets.summary
                  .active_budgets > 0
                  ? `${data.budgets.summary.at_risk_count} at risk • ${data.budgets.summary.exceeded_count} exceeded`
                  : "Create budgets to unlock proactive spending alerts."
              }
            />

            <DomainSummaryCard
              icon={
                <PiggyBank size={18} />
              }
              title="Goal Progress"
              primaryValue={
                data.goals.summary
                  .active_goals > 0
                  ? `${data.goals.summary.overall_progress_percent.toFixed(
                      0
                    )}% complete`
                  : "No active goals"
              }
              description={
                data.goals.recommendation
                  .description
              }
              supportingText={
                data.goals.summary.active_goals >
                0
                  ? `${data.goals.summary.on_track_count} on track • ${data.goals.summary.at_risk_count} at risk`
                  : "Create a financial goal so Aura can track your progress."
              }
            />
          </section>


          {/* ------------------------------------------------------------- */}
          {/* Insights */}
          {/* ------------------------------------------------------------- */}

          <ObservationTable
            observations={
              data.insights || []
            }
          />
        </>
      )}
    </main>
  );
}


// ---------------------------------------------------------------------
// Local display helpers
// ---------------------------------------------------------------------


function AlertRow({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div>
      <p className="text-[13px] font-bold leading-5 text-black">
        {title}
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
        {desc}
      </p>
    </div>
  );
}


function getInsightTitle(
  insight: InsightItem
) {
  return (
    insight.ai?.title ??
    insight.title
  );
}


function getInsightDescription(
  insight: InsightItem
) {
  return (
    insight.ai?.description ??
    insight.description
  );
}


function formatPeriod(
  start: string,
  end: string
) {
  const startDate = new Date(
    `${start}T00:00:00`
  );

  const endDate = new Date(
    `${end}T00:00:00`
  );

  return `${startDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )} – ${endDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )}`;
}