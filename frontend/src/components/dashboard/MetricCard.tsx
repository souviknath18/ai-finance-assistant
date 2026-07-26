import {
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
} from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  helper: string;
  trend: string;
  type: "positive" | "negative" | "neutral";
};

export default function MetricCard({
  label,
  value,
  helper,
  trend,
  type,
}: MetricCardProps) {
  const trendClass =
    type === "positive"
      ? "bg-emerald-50 text-emerald-700"
      : type === "negative"
      ? "bg-red-50 text-red-600"
      : "bg-emerald-50 text-emerald-700";

  const iconBoxClass =
  type === "positive"
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : type === "negative"
    ? "border-red-100 bg-red-50 text-red-600"
    : "border-emerald-100 bg-emerald-50 text-emerald-700";

  const TrendIcon =
    type === "positive"
      ? ArrowUpRight
      : type === "negative"
      ? ArrowDownRight
      : TrendingUp;

  const getMetricIcon = () => {
    switch (label) {
      case "Total Balance":
        return Wallet;
      case "Monthly Income":
        return ArrowDownToLine;
      case "Total Expenses":
        return ArrowUpFromLine;
      case "Monthly Savings":
        return PiggyBank;
      default:
        return Wallet;
    }
  };

  const MetricIcon = getMetricIcon();

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-emerald-300 hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase tracking-wide text-[#7c839b] sm:text-[11px]">
            {label}
          </p>

          <h2 className="mt-2 truncate text-xl font-bold tracking-tight text-black sm:text-2xl">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconBoxClass}`}
        >
          <MetricIcon size={20} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <p className="text-[12px] font-medium leading-5 text-[#565e74]">
          {helper}
        </p>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${trendClass}`}
        >
          <TrendIcon size={12} />
          {trend}
        </span>
      </div>
    </div>
  );
}