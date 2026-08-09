"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CircleAlert,
  Lightbulb,
  PiggyBank,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";

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

import PageLoader from "@/components/ui/PageLoader";

import {
  getInsightsDashboard,
  regenerateAndFetchInsights,
} from "@/lib/api/insightsApi";

import {
  InsightDashboard,
  InsightItem,
} from "@/types/insights";


export default function InsightsPage() {
  const [data, setData] =
    useState<InsightDashboard | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [period, setPeriod] =
    useState<InsightPeriod>("this_month");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");


  // -------------------------------------------------------------------
  // Initial dashboard loading
  // -------------------------------------------------------------------

  const loadInsights = useCallback(
    async () => {
      if (
        period === "custom" &&
        (!startDate || !endDate)
      ) {
        return;
      }

      try {
        setError(null);
        setLoading(true);

        const result =
          await getInsightsDashboard({
            period,
            startDate,
            endDate,
          });

        setData(result);
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
      }
    },
    [
      period,
      startDate,
      endDate,
    ]
  );


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
              onClick={loadInsights}
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


  return (
    <main className="min-h-screen">
      {/* ------------------------------------------------------------- */}
      {/* Page Header */}
      {/* ------------------------------------------------------------- */}

      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Insights
          </h1>

          <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#565e74]">
            AI-assisted analysis of your spending,
            budgets, recurring expenses, goals, and
            financial health.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8a92a5]">
            <span>
              {formatPeriod(
                data.period.start,
                data.period.end
              )}
            </span>

            {data.generated_at && (
              <>
                <span>•</span>

                <span>
                  Updated{" "}
                  {new Date(
                    data.generated_at
                  ).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </>
            )}

            {data.is_stale && (
              <>
                <span>•</span>

                <span className="font-semibold text-amber-600">
                  Newer financial data available
                </span>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={refreshInsights}
          disabled={refreshing}
          className="flex w-fit items-center gap-2 rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[12px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            size={15}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Insights"}
        </button>
      </section>

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

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Spending trend */}

        <InsightMetricCard
          icon={
            data.spending_trend.direction ===
            "down" ? (
              <TrendingDown size={18} />
            ) : (
              <TrendingUp size={18} />
            )
          }
          title="Spending Trend"
          value={spendingTrendValue}
          description={
            spendingTrendDescription
          }
          tone={
            data.spending_trend.direction ===
            "up"
              ? "red"
              : data.spending_trend.direction ===
                "down"
              ? "green"
              : "default"
          }
        >
          <MiniBars
            items={
              data.monthly_spending || []
            }
          />
        </InsightMetricCard>


        {/* Unusual activity */}

        <InsightMetricCard
          icon={<CircleAlert size={18} />}
          title="Unusual Activity"
          value={`${data.anomalies.count} ${
            data.anomalies.count === 1
              ? "Alert"
              : "Alerts"
          }`}
          description="Transactions that differ significantly from your historical spending patterns."
          tone={
            data.anomalies.count > 0
              ? "red"
              : "green"
          }
        >
          <div className="space-y-3">
            {data.anomalies.items.length ===
            0 ? (
              <div className="rounded-xl bg-[#f8faff] px-3.5 py-3">
                <p className="text-[13px] leading-5 text-[#565e74]">
                  No unusual transactions were
                  detected for this period.
                </p>
              </div>
            ) : (
              data.anomalies.items
                .slice(0, 2)
                .map(
                  (
                    anomaly,
                    index
                  ) => (
                    <div
                      key={
                        anomaly.transaction_id ??
                        `${anomaly.merchant}-${index}`
                      }
                    >
                      <AlertRow
                        title={
                          anomaly.merchant
                        }
                        desc={`${anomaly.category} • ${anomaly.amount_display}`}
                      />

                      {index !==
                        Math.min(
                          data.anomalies
                            .items.length,
                          2
                        ) -
                          1 && (
                        <div className="mt-3 h-px bg-[#e5eeff]" />
                      )}
                    </div>
                  )
                )
            )}
          </div>
        </InsightMetricCard>


        {/* Recurring expenses */}

        <InsightMetricCard
          icon={
            <RefreshCcw size={18} />
          }
          title="Recurring Expenses"
          value={
            data.recurring
              .monthly_total_display
          }
          description={
            data.recurring
              .subscription_count > 0
              ? `${data.recurring.subscription_count} recurring payment${
                  data.recurring
                    .subscription_count === 1
                    ? ""
                    : "s"
                } detected.`
              : "No active recurring expenses detected."
          }
          tone="purple"
        >
          <div className="rounded-xl border border-[#e5eeff] bg-[#f8faff] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Aura Analysis
            </p>

            <p className="mt-1.5 text-[13px] leading-5 text-black">
              {
                data.recurring
                  .recommendation
              }
            </p>
          </div>
        </InsightMetricCard>


        {/* Category breakdown */}

        <CategoryBreakdownCard
          items={data.categories}
        />

        {/* Financial Health */}

        <FinancialHealthCard
          icon={<Lightbulb size={18} />}
          health={data.financial_health}
        />
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
    </main>
  );
}


// ---------------------------------------------------------------------
// Local display helpers
// ---------------------------------------------------------------------


function DomainSummaryCard({
  icon,
  title,
  primaryValue,
  description,
  supportingText,
}: {
  icon: React.ReactNode;
  title: string;
  primaryValue: string;
  description: string;
  supportingText: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce9ff] text-black">
          {icon}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
          {title}
        </p>
      </div>

      <p className="text-xl font-bold text-black">
        {primaryValue}
      </p>

      <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
        {description}
      </p>

      <div className="mt-4 border-t border-[#e5eeff] pt-3">
        <p className="text-[11px] font-semibold text-[#8a92a5]">
          {supportingText}
        </p>
      </div>
    </div>
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
      <p className="text-[13px] font-bold leading-5 text-black">
        {title}
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
        {desc}
      </p>
    </div>
  );
}


function getAlertIcon(
  severity: InsightItem["severity"]
) {
  if (
    severity === "critical" ||
    severity === "warning"
  ) {
    return (
      <AlertTriangle size={18} />
    );
  }

  return <PiggyBank size={18} />;
}


function getAlertTag(
  severity: InsightItem["severity"]
) {
  if (severity === "critical") {
    return "Critical";
  }

  if (severity === "warning") {
    return "Important";
  }

  if (severity === "positive") {
    return "Opportunity";
  }

  return "Insight";
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


function buildHealthDescription(
  data: InsightDashboard
) {
  const health =
    data.financial_health;

  const concern =
    health.concerns?.[0];

  const strength =
    health.strengths?.[0];

  if (concern && strength) {
    return (
      `Your savings rate is ${health.savings_rate.toFixed(
        1
      )}%. ` +
      `${strength.label} is currently a strength, while ${concern.label.toLowerCase()} needs the most attention.`
    );
  }

  if (concern) {
    return (
      `Your savings rate is ${health.savings_rate.toFixed(
        1
      )}%. ` +
      `${concern.label} currently needs the most attention.`
    );
  }

  if (strength) {
    return (
      `Your savings rate is ${health.savings_rate.toFixed(
        1
      )}%. ` +
      `${strength.label} is one of your strongest financial areas.`
    );
  }

  return (
    `Your savings rate is ${health.savings_rate.toFixed(
      1
    )}%. ` +
    "Aura evaluates savings, cash flow, spending stability, recurring costs, budgets, goals, and unusual activity."
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