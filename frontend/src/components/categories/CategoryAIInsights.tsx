import { ArrowRight, Sparkles } from "lucide-react";
import { CategorySummary } from "@/types/category";

type Props = {
  categories: CategorySummary[];
};

export default function CategoryAIInsights({ categories }: Props) {
  const uncategorized = categories.find(
    (category) => category.name === "Uncategorized"
  );

  const topCategory = categories
    .filter((category) => Number(category.spending) > 0)
    .sort((a, b) => Number(b.spending) - Number(a.spending))[0];

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm lg:col-span-4">
      <div className="mb-4 flex items-center gap-2 text-emerald-700">
        <Sparkles size={18} />
        <h2 className="text-lg font-bold text-black">AI Insights</h2>
      </div>

      <div className="space-y-3">
        <InsightBox
          text={
            <>
              Found{" "}
              <strong className="text-black">
                {uncategorized?.transactions || 0} uncategorized
              </strong>{" "}
              transactions needing review.
            </>
          }
          action="Review Transactions"
        />

        <InsightBox
          text={
            <>
              Highest spending category is{" "}
              <strong className="text-black">
                {topCategory?.name || "Not available"}
              </strong>
              .
            </>
          }
          action="View Category Details"
        />
      </div>
    </div>
  );
}

function InsightBox({
  text,
  action,
}: {
  text: React.ReactNode;
  action: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-[#eff4ff] p-3.5">
      <p className="text-[13px] leading-5 text-[#565e74]">{text}</p>

      <button className="mt-3 flex items-center gap-2 text-[13px] font-bold text-emerald-700 transition hover:gap-3">
        {action}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}