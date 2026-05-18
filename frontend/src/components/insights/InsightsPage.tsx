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

export default function InsightsPage() {
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
        <HeroInsightCard />

        <div className="flex flex-col gap-6 md:col-span-4">
          <AlertInsightCard
            icon={<AlertTriangle size={20} />}
            tag="Critical"
            title="Budget Warning"
            description="'Entertainment' is at 94% of its monthly limit. Avoid new purchases until the 1st."
            tone="red"
          />

          <AlertInsightCard
            icon={<PiggyBank size={20} />}
            tag="Opportunity"
            title="Smart Saving"
            description="Transfer ₹45,000 to Emergency Fund to hit your Q3 goal 2 weeks early."
            tone="green"
          />
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <InsightMetricCard
          icon={<TrendingUp size={20} />}
          title="Spending Spikes"
          value="₹1,24,000"
          description="Unusual activity detected at Apple Store on Oct 14."
        >
          <MiniBars />
        </InsightMetricCard>

        <InsightMetricCard
          icon={<CircleAlert size={20} />}
          title="Unusual Activity"
          value="2 Alerts"
          description="International charge and possible duplicate transaction detected."
          tone="red"
        >
          <div className="space-y-4">
            <AlertRow title="International Charge" desc="London, UK • ₹1,250" />
            <div className="h-px bg-[#e5eeff]" />
            <AlertRow title="Double Charge" desc="Starbucks • ₹675" />
          </div>
        </InsightMetricCard>

        <InsightMetricCard
          icon={<RefreshCcw size={20} />}
          title="Recurring"
          value="₹42,800"
          description="Monthly subscriptions increased by ₹4,500 since last month."
        >
          <div className="rounded-2xl bg-[#eff4ff] p-4">
            <p className="text-sm italic leading-6 text-black">
              “You are paying for two streaming services with similar content.
              Consider cancelling one.”
            </p>
          </div>
        </InsightMetricCard>

        <CategoryBreakdownCard />

        <WealthTipCard
          icon={<Lightbulb size={20} />}
          title="Optimizing Cash Flow"
          description="We noticed ₹4,20,000 sitting in your checking account for over 30 days."
        />
      </section>

      <ObservationTable />
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