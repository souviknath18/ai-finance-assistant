import {
  AlertTriangle,
  Info,
} from "lucide-react";

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
      className={`rounded-3xl border bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)] ${
        warning
          ? "border-red-100 hover:border-red-200"
          : "border-[#e6edf9] hover:border-[#dbe5f5]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
            warning
              ? "border-red-100 bg-red-50 text-red-600"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {warning ? (
            <AlertTriangle size={15} />
          ) : (
            <Info size={15} />
          )}
        </div>

        <div className="min-w-0">
          <p
            className={`text-[9px] font-bold uppercase tracking-[0.12em] ${
              warning
                ? "text-red-600"
                : "text-emerald-700"
            }`}
          >
            {label}
          </p>

          <h3 className="mt-1 text-[15px] font-bold tracking-tight text-black">
            {title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] leading-5 text-[#565e74]">
        {description}
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={onClickAction}
        className={`mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl text-[12px] font-bold transition-[background-color,border-color,color,box-shadow,opacity] duration-200 ${
          warning
            ? "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50"
            : "border border-[#e6edf9] bg-white text-black hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}