type MetricCardProps = {
  label: string;
  value: string;
  trend: string;
  icon?: React.ReactNode;
  trendTone?: "green" | "muted";
};

export default function MetricCard({
  label,
  value,
  trend,
  icon,
  trendTone = "muted",
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </p>

      <h2 className="text-3xl font-bold text-black">{value}</h2>

      <p
        className={`mt-2 flex items-center gap-1 text-sm ${
          trendTone === "green" ? "text-emerald-700" : "text-[#565e74]"
        }`}
      >
        {icon}
        {trend}
      </p>
    </div>
  );
}