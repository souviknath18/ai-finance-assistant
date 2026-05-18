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
      className={`rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm ${className}`}
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-black">{value}</span>

        {buttonText ? (
          <button className="rounded-xl bg-[#e5eeff] px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100">
            {buttonText}
          </button>
        ) : (
          <span className="text-[#565e74]">{icon}</span>
        )}
      </div>
    </div>
  );
}