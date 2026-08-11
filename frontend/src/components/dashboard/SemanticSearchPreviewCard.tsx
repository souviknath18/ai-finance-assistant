"use client";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Brain,
  CircleHelp,
  Search,
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
    router.push(
      `/transactions?search=${encodeURIComponent(query)}`
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                AI Semantic Search
              </h3>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Vector-based retrieval across your transaction history.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenSemanticSearch}
            disabled={!query.trim()}
            className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            View Search
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Query */}
        <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            Semantic Query
          </p>

          <div className="mt-2 flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
              <Search size={13} />
            </div>

            <p
              title={query}
              className="min-w-0 truncate text-[11px] font-semibold italic text-[#565e74]"
            >
              &quot;{query || "No search query available"}&quot;
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="mt-3 space-y-2.5">
          {previewResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e6edf9] bg-white text-[#7c839b]">
                <CircleHelp size={17} />
              </div>

              <p className="mt-3 text-[13px] font-bold text-black">
                No indexed transactions yet
              </p>

              <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-[#565e74]">
                Upload financial data to generate embeddings and enable
                semantic search.
              </p>
            </div>
          ) : (
            previewResults.map((item) => {
              const categoryStyles =
                getCategoryStyles(item.category);

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() =>
                    router.push(
                      `/transactions?search=${encodeURIComponent(
                        item.merchant
                      )}`
                    )
                  }
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 text-left transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-100 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]"
                >
                  {/* Left */}
                  <div className="min-w-0 flex-1">
                    <p
                      title={item.merchant}
                      className="truncate text-[12px] font-bold text-black"
                    >
                      {item.merchant}
                    </p>

                    <div className="mt-1.5">
                      <span
                        className={`inline-flex max-w-[160px] items-center truncate rounded-full border px-2.5 py-1 text-[9px] font-bold ${categoryStyles.badge}`}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="shrink-0 text-right">
                    <p className="whitespace-nowrap text-[12px] font-bold text-black">
                      {item.amount}
                    </p>

                    <span className="mt-1.5 inline-flex whitespace-nowrap rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      {item.similarity} Match
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {results.length > previewResults.length && (
          <p className="mt-3 text-center text-[10px] font-medium text-[#7c839b]">
            Showing top {previewResults.length} of {results.length} matches
          </p>
        )}
      </div>
    </section>
  );
}