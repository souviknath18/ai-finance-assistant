import { TrendingUp, Verified } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  status: string;
  statusType: "positive" | "negative" | "neutral";
};

export default function MetricCard({
  label,
  value,
  status,
  statusType,
}: MetricCardProps) {
  const statusClass =
    statusType === "positive"
      ? "text-emerald-700"
      : statusType === "negative"
      ? "text-red-600"
      : "text-[#565e74]";

  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <h2 className="text-xl font-bold tracking-tight text-black">
        {value}
      </h2>

      <div className={`mt-2 flex items-center gap-1 text-[11px] font-semibold ${statusClass}`}>
        {statusType === "positive" ? <Verified size={14} /> : <TrendingUp size={14} />}
        <span>{status}</span>
      </div>
    </div>
  );
}