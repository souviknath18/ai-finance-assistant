"use client";

import {
  ArrowRight,
  Brain,
  TrendingUp,
} from "lucide-react";

import { useRouter } from "next/navigation";

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

  const max = Math.max(
    ...topCategories.map((item) => item.total),
    1
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Category Intelligence
              </h3>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                AI-ranked spending categories and behavior signals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/categories")}
            className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06)]"
          >
            View Categories
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Summary */}
        {hasData && topCategories.length > 0 && (
          <div className="mt-5 flex flex-wrap items-start gap-x-6 gap-y-4 sm:pl-[52px]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                Top Category
              </p>

              <p className="mt-1.5 max-w-[150px] truncate text-[16px] font-bold text-black">
                {topCategories[0]?.label ?? "—"}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#e6edf9] sm:block" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                Categories
              </p>

              <p className="mt-1.5 text-[16px] font-bold text-black">
                {spending.length}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-[#e6edf9] sm:block" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                AI Confidence
              </p>

              <p className="mt-1.5 text-[16px] font-bold text-emerald-700">
                High
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {!hasData || topCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={17} />
            </div>

            <p className="text-[13px] font-bold text-black">
              No category intelligence yet
            </p>

            <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-[#565e74]">
              Upload transactions to let Aura identify and rank your
              spending categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topCategories.map((item, index) => {
              const width = `${Math.max(
                (item.total / max) * 100,
                8
              )}%`;

              const categoryStyles = getCategoryStyles(
                item.label
              );

              return (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-[#e8eefb] ${categoryStyles.card} p-4 transition-[border-color,box-shadow,transform] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_6px_16px_rgba(15,23,42,0.05)]`}
                >
                  {/* Category */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-black">
                        {item.label}
                      </p>

                      <p className="mt-1 text-[10px] font-medium text-[#7c839b]">
                        Rank #{index + 1}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${categoryStyles.amount}`}
                    >
                      {item.amount}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#edf2fb]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out ${categoryStyles.progress}`}
                      style={{
                        width,
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[10px] font-medium text-[#7c839b]">
                      Spending strength
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white/80 px-2 py-1 text-[9px] font-bold text-emerald-700">
                      <TrendingUp size={10} />
                      High Confidence
                    </span>
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