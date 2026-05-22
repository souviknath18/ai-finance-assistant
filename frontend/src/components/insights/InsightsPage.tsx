"use client";

import { useEffect, useState } from "react";
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
import WealthTipCard from "./WealthTipCard";
import ObservationTable from "./ObservationTable";
import MiniBars from "./MiniBars";

import { getInsightsDashboard } from "@/lib/api/insightsApi";
import { InsightDashboard } from "@/types/insights";

export default function InsightsPage() {
  const [data, setData] = useState<InsightDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const result = await getInsightsDashboard();
        setData(result);
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  if (loading) {
    return <div className="text-sm font-semibold text-[#565e74]">Loading insights...</div>;
  }

  if (!data) {
    return <div className="text-sm font-semibold text-red-600">Failed to load insights.</div>;
  }

  return (
    <>
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Insights
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Intelligent observations about your spending, budgets, subscriptions,
          and saving opportunities.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        <HeroInsightCard
          headline={data.executive_summary.headline}
          description={data.executive_summary.description}
        />

        <div className="flex flex-col gap-6 md:col-span-4">
          <AlertInsightCard
            icon={<AlertTriangle size={20} />}
            tag="Critical"
            title={data.alerts.budget_warning.title}
            description={data.alerts.budget_warning.description}
            tone="red"
          />

          <AlertInsightCard
            icon={<PiggyBank size={20} />}
            tag="Opportunity"
            title={data.alerts.saving_opportunity.title}
            description={data.alerts.saving_opportunity.description}
            tone="green"
          />
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InsightMetricCard
          icon={<TrendingUp size={20} />}
          title="Spending Spikes"
          value={data.metrics.spending_spikes}
          description={data.metrics.spending_spikes_description}
        >
          <MiniBars items={data.monthly_spending || []} />
        </InsightMetricCard>

        <InsightMetricCard
          icon={<CircleAlert size={20} />}
          title="Unusual Activity"
          value={`${data.metrics.unusual_activity_count} Alerts`}
          description="High-value or unusual transactions detected from your financial records."
          tone="red"
        >
          <div className="space-y-4">
            {data.anomalies.alerts.length === 0 ? (
              <p className="text-sm text-[#565e74]">No unusual transactions detected.</p>
            ) : (
              data.anomalies.alerts.slice(0, 2).map((alert, index) => (
                <div key={index}>
                  <AlertRow
                    title={alert.title}
                    desc={`${alert.category} • ${alert.amount_display}`}
                  />
                  {index !== data.anomalies.alerts.slice(0, 2).length - 1 && (
                    <div className="h-px bg-[#e5eeff]" />
                  )}
                </div>
              ))
            )}
          </div>
        </InsightMetricCard>

        <InsightMetricCard
          icon={<RefreshCcw size={20} />}
          title="Recurring"
          value={data.metrics.recurring_total}
          description={data.metrics.recurring_description}
        >
          <div className="rounded-2xl bg-[#eff4ff] p-4">
            <p className="text-sm italic leading-6 text-black">
              “{data.alerts.saving_opportunity.description}”
            </p>
          </div>
        </InsightMetricCard>

        <CategoryBreakdownCard items={data.category_breakdown} />

        <WealthTipCard
          icon={<Lightbulb size={20} />}
          title={data.wealth_tip.title}
          description={data.wealth_tip.description}
          potentialEarn={data.wealth_tip.potential_earn}
          potentialDescription={data.wealth_tip.potential_description}
        />
      </section>

      <ObservationTable observations={data.observations} />
    </>
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
      <p className="text-xs font-bold uppercase tracking-wide text-black">
        {title}
      </p>
      <p className="mt-1 text-sm text-[#565e74]">{desc}</p>
    </div>
  );
}