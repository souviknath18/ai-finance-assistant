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
      className={`rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm ${className}`}
    >
      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <div className="flex items-center justify-between gap-4">
        <span className="truncate text-[13px] font-semibold text-black">
          {value}
        </span>

        {buttonText ? (
          <button className="shrink-0 rounded-xl bg-[#e5eeff] px-3.5 py-2 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100">
            {buttonText}
          </button>
        ) : (
          <span className="shrink-0 text-[#565e74]">{icon}</span>
        )}
      </div>
    </div>
  );
}