import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  ReceiptIndianRupee,
  Wallet,
} from "lucide-react";

import { InsightOverview } from "@/types/insights";


type OverviewMetricsProps = {
  overview: InsightOverview;
};


export default function OverviewMetrics({
  overview,
}: OverviewMetricsProps) {
  const savingsPositive =
    Number(overview.savings) >= 0;

  const savingsRatePositive =
    overview.savings_rate >= 0;

  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <OverviewMetricCard
        icon={<Wallet size={17} />}
        label="Income"
        value={overview.income_display}
        description={`${overview.income_count} ${
          overview.income_count === 1
            ? "income transaction"
            : "income transactions"
        }`}
        tone="green"
      />

      <OverviewMetricCard
        icon={
          <ReceiptIndianRupee
            size={17}
          />
        }
        label="Expenses"
        value={overview.expenses_display}
        description={`${overview.expense_count} ${
          overview.expense_count === 1
            ? "expense transaction"
            : "expense transactions"
        }`}
        tone="default"
      />

      <OverviewMetricCard
        icon={<PiggyBank size={17} />}
        label="Savings"
        value={overview.savings_display}
        description="Income minus expenses"
        tone={
          savingsPositive
            ? "green"
            : "red"
        }
      />

      <OverviewMetricCard
        icon={
          savingsRatePositive ? (
            <ArrowUpRight size={17} />
          ) : (
            <ArrowDownRight size={17} />
          )
        }
        label="Savings Rate"
        value={`${overview.savings_rate.toFixed(
          1
        )}%`}
        description={`${overview.transaction_count} ${
          overview.transaction_count === 1
            ? "transaction analyzed"
            : "transactions analyzed"
        }`}
        tone={
          savingsRatePositive
            ? "green"
            : "red"
        }
      />
    </section>
  );
}


type OverviewMetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: "default" | "green" | "red";
};


function OverviewMetricCard({
  icon,
  label,
  value,
  description,
  tone = "default",
}: OverviewMetricCardProps) {
  const iconClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "red"
      ? "bg-red-50 text-red-700"
      : "bg-[#eff4ff] text-black";

  const valueClass =
    tone === "red"
      ? "text-red-700"
      : "text-black";

  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a92a5]">
            {label}
          </p>

          <p
            className={`mt-2 text-xl font-bold tracking-tight ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-5 text-[#565e74]">
        {description}
      </p>
    </div>
  );
}