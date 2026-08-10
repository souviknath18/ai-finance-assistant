type OtherBudgetCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  progress: number;
  onManageAction: () => void;
};

export default function OtherBudgetCard({
  icon,
  title,
  subtitle,
  amount,
  progress,
  onManageAction,
}: OtherBudgetCardProps) {
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#d8e2f0] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:col-span-12 md:flex-row md:items-center md:justify-between">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e6edf9] bg-[#f7f9fd] text-black">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-[16px] font-bold tracking-tight text-black">
            {title}
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Usage */}
      <div className="w-full md:max-w-[260px]">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Active Budgets
          </span>

          <span className="text-[12px] font-bold text-black">
            {amount}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onManageAction}
        className="inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-5 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#cfd9e8] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
      >
        Manage
      </button>
    </div>
  );
}