type UsageMetricProps = {
  label: string;
  value: string;
  progress: number;
  helper: string;
  color: string;
  helperColor?: string;
};

export default function UsageMetric({
  label,
  value,
  progress,
  helper,
  color,
  helperColor = "text-[#565e74]",
}: UsageMetricProps) {
  return (
    <div className="rounded-2xl bg-[#eff4ff] p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wide text-black">
          {label}
        </span>

        <span className="text-[11px] font-bold text-[#565e74]">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#dce9ff]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className={`mt-2 text-[11px] font-semibold ${helperColor}`}>
        {helper}
      </p>
    </div>
  );
}