import { Sparkles, X } from "lucide-react";

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
    <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 md:flex-row md:items-center">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Sparkles size={16} />
        </div>

        <div>
          <p className="text-sm font-bold text-emerald-800">
            Showing AI semantic results
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Found <strong>{count}</strong> match{count === 1 ? "" : "es"} for{" "}
            <strong>“{query}”</strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClearAction}
        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-[#eff4ff]"
      >
        <X size={16} />
        Clear Search
      </button>
    </div>
  );
}