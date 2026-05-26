import { Info, AlertTriangle } from "lucide-react";

type RecommendationCardProps = {
  type: "warning" | "info";
  label: string;
  title: string;
  description: string;
  buttonText: string;
  onClickAction?: () => void;
};

export default function RecommendationCard({
  type,
  label,
  title,
  description,
  buttonText,
  onClickAction,
}: RecommendationCardProps) {
  const warning = type === "warning";

  return (
    <div
      className={`rounded-2xl border p-5 ${
        warning
          ? "border-red-100 bg-[#e5eeff]"
          : "border-[#c6c6cd] bg-[#eff4ff]"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 ${
          warning ? "text-red-600" : "text-[#7c839b]"
        }`}
      >
        {warning ? <AlertTriangle size={15} /> : <Info size={15} />}
        <span className="text-[11px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <h3 className="mb-1.5 text-[15px] font-bold text-black">{title}</h3>

      <p className="mb-4 text-[13px] leading-5 text-[#565e74]">
        {description}
      </p>

      <button
        onClick={onClickAction}
        className={`w-full rounded-xl py-2.5 text-[13px] font-bold ${
          warning
            ? "bg-red-600 text-white"
            : "border border-[#76777d] text-black"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}