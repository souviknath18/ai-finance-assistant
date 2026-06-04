"use client";

import { useRouter } from "next/navigation";
import { Search, Sparkles, Brain } from "lucide-react";

type SemanticSearchPreviewCardProps = {
  query: string;
  results: {
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

  const handleOpenSemanticSearch = () => {
    router.push(`/transactions?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
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
      </div>

      <div className="p-5 pb-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#e7edf8] bg-[#fafbfe] px-3 py-2.5">
          <Search size={16} className="shrink-0 text-indigo-600" />

          <p className="truncate text-[13px] font-medium italic text-[#565e74]">
            &quot;{query}&quot;
          </p>
        </div>

        <div className="mt-4 space-y-2">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fafbfe] p-5 text-center">
              <p className="text-[13px] font-bold text-black">
                No indexed transactions yet
              </p>

              <p className="mt-1 text-[12px] text-[#565e74]">
                Upload a statement to generate embeddings for semantic search.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={`${item.merchant}-${item.amount}`}
                className="flex items-center justify-between rounded-xl border border-transparent p-3 transition hover:border-indigo-100 hover:bg-[#fafbfe]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-black">
                    {item.merchant}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-[#7c839b]">
                    {item.category}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-bold text-black">
                    {item.amount}
                  </p>

                  <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {item.similarity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-[#edf2fb] bg-[#fafbfe] p-4">
        <button
          onClick={handleOpenSemanticSearch}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 text-[13px] font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          <Sparkles size={15} />
          Explore with AI Search
        </button>
      </div>
    </div>
  );
}