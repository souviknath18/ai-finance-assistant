type FilterBoxProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClickAction?: () => void;
  active?: boolean;
};

export default function FilterBox({
  label,
  value,
  icon,
  onClickAction,
  active = false,
}: FilterBoxProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </label>

      <button
        type="button"
        onClick={onClickAction}
        className={`flex h-11 w-full items-center gap-3 rounded-xl border px-3.5 text-left text-[13px] font-medium transition ${
          active
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : "border-[#c6c6cd] bg-white text-black hover:border-[#aeb8cc] hover:bg-[#f8faff]"
        }`}
      >
        {icon && (
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-[#eff4ff] text-[#565e74]"
            }`}
          >
            {icon}
          </span>
        )}

        <span className="min-w-0 flex-1 truncate">
          {value}
        </span>
      </button>
    </div>
  );
}