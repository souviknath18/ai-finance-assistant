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
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
          {label}
        </p>

        <span className="text-[11px] font-bold text-black">
          {value}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#edf2fb]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${color}`}
          style={{
            width: `${safeProgress}%`,
          }}
        />
      </div>

      <p className={`mt-2 text-[10px] font-medium ${helperColor}`}>
        {helper}
      </p>
    </div>
  );
}