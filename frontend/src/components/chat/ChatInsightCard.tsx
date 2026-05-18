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
      className={`rounded-3xl p-6 shadow-sm ${
        variant === "glow"
          ? "border border-emerald-200 bg-gradient-to-br from-white to-emerald-50"
          : "border border-[#e5eeff] bg-white"
      }`}
    >
      <div
        className={`mb-3 flex items-center gap-2 ${
          variant === "glow" ? "text-emerald-700" : "text-[#7c839b]"
        }`}
      >
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="text-sm leading-7 text-black">{description}</p>
    </div>
  );
}