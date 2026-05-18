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
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <h2 className="text-2xl font-bold tracking-tight text-black">
        {value}
      </h2>

      <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${statusClass}`}>
        {statusType === "positive" ? <Verified size={15} /> : <TrendingUp size={15} />}
        <span>{status}</span>
      </div>
    </div>
  );
}