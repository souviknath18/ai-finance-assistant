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
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </p>

      <h2 className="text-2xl font-bold text-black">{value}</h2>

      <p
        className={`mt-2 flex items-center gap-1 text-[13px] ${
          trendTone === "green" ? "text-emerald-700" : "text-[#565e74]"
        }`}
      >
        {icon}
        {trend}
      </p>
    </div>
  );
}