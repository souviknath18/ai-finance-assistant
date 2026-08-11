import {
  CalendarRange,
  TrendingDown,
} from "lucide-react";

import MetricCard from "./MetricCard";
import AIOptimizationCard from "./AIOptimizationCard";

import type {
  DetectedSubscription,
  DuplicateSubscriptionGroup,
} from "@/types/subscription";

type SummaryMetricsProps = {
  subscriptions: DetectedSubscription[];
  duplicates: DuplicateSubscriptionGroup[];
};

export default function SummaryMetrics({
  subscriptions,
  duplicates,
}: SummaryMetricsProps) {
  const monthlySpend = subscriptions.reduce(
    (total, item) =>
      total + Number(item.average_amount),
    0
  );

  const yearlyForecast =
    monthlySpend * 12;

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        label="Monthly Spend"
        value={`₹${monthlySpend.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`}
        trend={`${subscriptions.length} active recurring ${
          subscriptions.length === 1
            ? "service"
            : "services"
        }`}
        icon={
          <TrendingDown size={17} />
        }
        trendTone="green"
      />

      <MetricCard
        label="Yearly Forecast"
        value={`₹${yearlyForecast.toLocaleString(
          "en-IN",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`}
        trend="Projected from current recurring spend"
        icon={
          <CalendarRange size={17} />
        }
      />

      <AIOptimizationCard
        subscriptions={subscriptions}
        duplicates={duplicates}
      />
    </section>
  );
}