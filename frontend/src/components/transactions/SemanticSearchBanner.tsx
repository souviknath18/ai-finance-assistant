import {
  Sparkles,
  X,
} from "lucide-react";

type SemanticSearchBannerProps = {
  query: string;
  count: number;
  onClearAction: () => void;
};

export default function SemanticSearchBanner({
  query,
  count,
  onClearAction,
}: SemanticSearchBannerProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
          <Sparkles size={15} />
        </div>

        <div className="min-w-0">
          <p className="text-[12px] font-bold text-emerald-800">
            AI semantic search active
          </p>

          <p className="mt-0.5 text-[11px] leading-5 text-emerald-700">
            Found{" "}
            <strong>{count}</strong>{" "}
            match{count === 1 ? "" : "es"} for{" "}
            <strong className="break-words">
              “{query}”
            </strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearAction}
        className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3.5 text-[11px] font-bold text-black transition-[background-color,border-color,color] duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      >
        <X size={14} />
        Clear Search
      </button>
    </div>
  );
}