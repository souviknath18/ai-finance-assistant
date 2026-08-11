import {
  ArrowDownRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  Wallet,
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
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : type === "negative"
        ? "border-red-100 bg-red-50 text-red-600"
        : "border-[#e6edf9] bg-[#f8f9ff] text-[#565e74]";

  const iconBoxClass =
    type === "positive"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : type === "negative"
        ? "border-red-100 bg-red-50 text-red-600"
        : "border-[#e6edf9] bg-[#f8f9ff] text-[#565e74]";

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
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Top */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            {label}
          </p>

          <h2
            title={value}
            className="mt-2 truncate text-[21px] font-bold tracking-tight text-black sm:text-[22px]"
          >
            {value}
          </h2>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconBoxClass}`}
        >
          <MetricIcon size={18} />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between gap-3">
        <p className="min-w-0 text-[11px] font-medium leading-4 text-[#565e74]">
          {helper}
        </p>

        <span
          className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold ${trendClass}`}
        >
          <TrendIcon size={10} />

          {trend}
        </span>
      </div>
    </div>
  );
}