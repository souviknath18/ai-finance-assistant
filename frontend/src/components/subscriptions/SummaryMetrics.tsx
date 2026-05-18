import { TrendingDown } from "lucide-react";
import MetricCard from "./MetricCard";
import AIOptimizationCard from "./AIOptimizationCard";

export default function SummaryMetrics() {
  return (
    <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-4">
      <MetricCard
        label="Monthly Spend"
        value="$214.50"
        trend="4% vs last month"
        icon={<TrendingDown size={16} />}
        trendTone="green"
      />

      <MetricCard
        label="Yearly Forecast"
        value="$2,574.00"
        trend="Based on current active plans"
      />

      <AIOptimizationCard />
    </section>
  );
}