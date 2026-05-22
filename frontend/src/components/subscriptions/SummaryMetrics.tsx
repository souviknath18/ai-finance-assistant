import { TrendingDown } from "lucide-react";
import MetricCard from "./MetricCard";
import AIOptimizationCard from "./AIOptimizationCard";
import { DetectedSubscription } from "@/types/subscription";

type SummaryMetricsProps = {
  subscriptions: DetectedSubscription[];
};

export default function SummaryMetrics({ subscriptions }: SummaryMetricsProps) {
  const monthlySpend = subscriptions.reduce(
    (total, item) => total + Number(item.average_amount),
    0
  );

  const yearlyForecast = monthlySpend * 12;

  return (
    <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
      <MetricCard
        label="Monthly Spend"
        value={`₹${monthlySpend.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`}
        trend={`${subscriptions.length} active recurring services`}
        icon={<TrendingDown size={16} />}
        trendTone="green"
      />

      <MetricCard
        label="Yearly Forecast"
        value={`₹${yearlyForecast.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })}`}
        trend="Based on detected subscriptions"
      />

      <AIOptimizationCard />
    </section>
  );
}