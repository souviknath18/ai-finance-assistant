"use client";

import { useRouter } from "next/navigation";
import {
  Search,
  Brain,
  ArrowRight,
  CircleHelp,
} from "lucide-react";

import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type SemanticSearchPreviewCardProps = {
  query: string;
  results: {
    id: string;
    merchant: string;
    amount: string;
    category: string;
    similarity: string;
  }[];
};

export default function SemanticSearchPreviewCard({
  query,
  results,
}: SemanticSearchPreviewCardProps) {
  const router = useRouter();

  const previewResults = results.slice(0, 3);

  const handleOpenSemanticSearch = () => {
    router.push(`/transactions?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={20} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                AI Semantic Search
              </h3>

              <p className="text-[12px] text-[#565e74]">
                Vector-indexed transaction retrieval
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSemanticSearch}
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 py-2 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] active:translate-y-px"
          >
            View Search
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Query preview */}
        <div className="rounded-2xl border border-[#e8eefb] bg-[#fbfcff] p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
            Semantic Query
          </p>

          <div className="mt-2 flex min-w-0 items-center gap-2">
            <Search
              size={16}
              className="shrink-0 text-emerald-600"
            />

            <p className="truncate text-[13px] font-medium italic text-[#565e74]">
              &quot;{query}&quot;
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="mt-4 space-y-2">
          {previewResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#f8f9ff] p-6 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#edf2fb] bg-white text-[#7c839b]">
                <CircleHelp size={18} />
              </div>

              <p className="text-[13px] font-bold text-black">
                No indexed transactions yet
              </p>

              <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                Upload a statement to generate embeddings for semantic search.
              </p>
            </div>
          ) : (
            previewResults.map((item) => {
              const categoryStyles = getCategoryStyles(item.category);

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() =>
                    router.push(
                      `/transactions?search=${encodeURIComponent(
                        item.merchant,
                      )}`,
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#e8eefb] bg-white p-3 text-left shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)] active:translate-y-px"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-black">
                      {item.merchant}
                    </p>

                    <div className="mt-1.5">
                      <span
                        className={`inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-1 text-[10px] font-bold ${categoryStyles.badge}`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="whitespace-nowrap text-[13px] font-bold text-black">
                      {item.amount}
                    </p>

                    <span className="mt-1 inline-flex whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {item.similarity} Match
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Additional results count */}
        {results.length > previewResults.length && (
          <p className="mt-4 text-center text-[11px] font-medium text-[#7c839b]">
            Showing top {previewResults.length} of {results.length} matches
          </p>
        )}
      </div>
    </div>
  );
}