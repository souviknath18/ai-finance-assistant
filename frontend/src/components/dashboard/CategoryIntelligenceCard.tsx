import { Brain, ArrowRight, TrendingUp } from "lucide-react";

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
  const topCategories = spending.slice(0, 4);
  const max = Math.max(...topCategories.map((item) => item.total), 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
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

        <button className="inline-flex w-fit items-center gap-1 rounded-xl bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-700 transition hover:bg-emerald-100">
          View Categories
          <ArrowRight size={13} />
        </button>
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

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#edf2fb] bg-[#fafbfe] p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-bold text-black">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[11px] text-[#7c839b]">
                        Rank #{index + 1} spending category
                      </p>
                    </div>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-sm">
                      {item.amount}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#e7edf8]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-400"
                      style={{ width }}
                    />
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
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