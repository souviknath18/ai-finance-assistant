type ProfileInfoCardProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  buttonText?: string;
  className?: string;
};

export default function ProfileInfoCard({
  label,
  value,
  icon,
  buttonText,
  className = "",
}: ProfileInfoCardProps) {
  return (
    <div
      className={`rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] ${className}`}
    >
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </p>

      <div className="flex items-center justify-between gap-4">
        <span className="truncate text-[12px] font-semibold text-black">
          {value}
        </span>

        {buttonText ? (
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#dfe9fb] bg-[#fbfcff] px-3.5 py-2 text-[10px] font-bold text-emerald-700 transition hover:border-emerald-200 hover:bg-emerald-50"
          >
            {buttonText}
          </button>
        ) : (
          <span className="shrink-0 text-[#565e74]">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}