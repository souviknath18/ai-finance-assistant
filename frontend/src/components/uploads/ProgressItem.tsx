type ProgressItemProps = {
  icon: React.ReactNode;
  title: string;
  progress: string;
  width: string;
  color: string;
  analyzing?: boolean;
};

export default function ProgressItem({
  icon,
  title,
  progress,
  width,
  color,
  analyzing = false,
}: ProgressItemProps) {
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        analyzing
          ? "border-emerald-100 bg-emerald-50"
          : "border-[#c6c6cd] bg-[#f8f9ff]"
      }`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[#565e74]">{icon}</span>
          <span className="text-[13px] font-semibold text-black">{title}</span>
        </div>

        <span
          className={`text-[11px] font-bold ${
            analyzing ? "text-emerald-700" : "text-black"
          }`}
        >
          {analyzing && (
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-700" />
          )}
          {progress}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-[#c6c6cd]">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}