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
    <div className="flex flex-col gap-4 rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm md:col-span-12 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e5eeff] text-black">
          {icon}
        </div>

        <div>
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <p className="text-[13px] text-[#565e74]">{subtitle}</p>
        </div>
      </div>

      <div className="hidden min-w-[200px] flex-col items-end md:flex">
        <span className="mb-2 text-[13px] text-black">{amount}</span>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={onManageAction}
        className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#e5eeff]"
      >
        Manage
      </button>
    </div>
  );
}