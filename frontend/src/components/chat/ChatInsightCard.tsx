type ChatInsightCardProps = {
  icon: React.ReactNode;
  label: string;
  description: React.ReactNode;
  variant?: "glow";
};

export default function ChatInsightCard({
  icon,
  label,
  description,
  variant,
}: ChatInsightCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        variant === "glow"
          ? "border border-emerald-200 bg-gradient-to-br from-white to-emerald-50"
          : "border border-[#e5eeff] bg-white"
      }`}
    >
      <div
        className={`mb-2.5 flex items-center gap-2 ${
          variant === "glow" ? "text-emerald-700" : "text-[#7c839b]"
        }`}
      >
        {icon}

        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="text-[13px] leading-6 text-black">{description}</p>
    </div>
  );
}