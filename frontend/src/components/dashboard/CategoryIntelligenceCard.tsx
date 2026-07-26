"use client";

import { useRouter } from "next/navigation";
import { Brain, ArrowRight, TrendingUp } from "lucide-react";
import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type CategoryIntelligenceCardProps = {
  spending: {
    label: string;
    amount: string;
    total: number;
  }[];
  hasData: boolean;
};

export default function CategoryIntelligenceCard({
  spending,
  hasData,
}: CategoryIntelligenceCardProps) {
  const router = useRouter();
  const topCategories = spending.slice(0, 4);
  const max = Math.max(...topCategories.map((item) => item.total), 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#edf2fb] p-5">
        {/* Top header row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={20} />
            </div>

            <div>
              <h3 className="text-[15px] font-bold text-black">
                Category Intelligence
              </h3>

              <p className="text-[12px] text-[#565e74]">
                AI-ranked spending categories and behavior signals.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/categories")}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 py-2 text-[12px] font-bold text-black transition-all duration-200 hover:bg-[#f8f9ff] hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
          >
            View Categories
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Summary statistics */}
        {hasData && topCategories.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4 sm:pl-[52px]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                Top Category
              </p>

              <p className="mt-1 text-[16px] font-bold text-black">
                {topCategories[0]?.label ?? "—"}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#e6edf9] sm:block" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                Categories
              </p>

              <p className="mt-1 text-[16px] font-bold text-black">
                {spending.length}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#e6edf9] sm:block" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                AI Confidence
              </p>

              <p className="mt-1 text-[16px] font-bold text-emerald-700">
                High
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        {!hasData || topCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#f8f9ff] p-6 text-center">
            <p className="text-[13px] font-bold text-black">
              No category intelligence yet.
            </p>

            <p className="mt-1 text-[13px] text-[#565e74]">
              Upload transactions to let Aura rank your spending categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topCategories.map((item, index) => {
              const width = `${Math.max((item.total / max) * 100, 8)}%`;
              const categoryStyles = getCategoryStyles(item.label);

              return (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-[#e8eefb] ${categoryStyles.card} p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)]`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-black">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#7c839b]">
                        Rank #{index + 1} spending category
                      </p>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${categoryStyles.amount}`}
                    >
                      {item.amount}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#edf2fb]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${categoryStyles.progress}`}
                      style={{ width }}
                    />
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white/80 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    <TrendingUp size={11} />
                    AI Confidence: High
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}