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
      className={`rounded-2xl border p-4 ${
        analyzing
          ? "border-emerald-100 bg-emerald-50"
          : "border-[#c6c6cd] bg-[#f8f9ff]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[#565e74]">{icon}</span>
          <span className="text-sm font-semibold text-black">{title}</span>
        </div>

        <span
          className={`text-xs font-bold ${
            analyzing ? "text-emerald-700" : "text-black"
          }`}
        >
          {analyzing && (
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-700" />
          )}
          {progress}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#c6c6cd]">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}