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
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm md:col-span-12 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5eeff] text-black">
          {icon}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-black">{title}</h3>
          <p className="text-sm text-[#565e74]">{subtitle}</p>
        </div>
      </div>

      <div className="hidden min-w-[220px] flex-col items-end md:flex">
        <span className="mb-2 text-sm text-black">{amount}</span>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onManageAction}
        className="rounded-xl border border-[#c6c6cd] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#e5eeff]"
      >
        Manage
      </button>
    </div>
  );
}