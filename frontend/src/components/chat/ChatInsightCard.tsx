type ChatInsightCardProps = {
  icon: React.ReactNode;
  label: string;
  description: React.ReactNode;
  variant?: "default" | "highlight";
};

export default function ChatInsightCard({
  icon,
  label,
  description,
  variant = "default",
}: ChatInsightCardProps) {
  const highlighted =
    variant === "highlight";

  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-emerald-200 hover:shadow-[0_8px_26px_rgba(15,23,42,0.08)]">
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
            highlighted
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-[#edf2fb] bg-[#fbfcff] text-[#565e74]"
          }`}
        >
          {icon}
        </div>

        <p
          className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
            highlighted
              ? "text-emerald-700"
              : "text-[#7c839b]"
          }`}
        >
          {label}
        </p>
      </div>

      <p className="text-[13px] leading-6 text-black">
        {description}
      </p>
    </div>
  );
}