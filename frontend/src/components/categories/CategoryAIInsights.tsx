import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { CategorySummary } from "@/types/category";

type Props = {
  categories: CategorySummary[];
};

export default function CategoryAIInsights({
  categories,
}: Props) {
  const uncategorized =
    categories.find(
      (category) =>
        category.name ===
        "Uncategorized"
    );

  const topCategory =
    [...categories]
      .filter(
        (category) =>
          Number(
            category.spending
          ) > 0
      )
      .sort(
        (a, b) =>
          Number(
            b.spending
          ) -
          Number(
            a.spending
          )
      )[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] lg:col-span-5">
      {/* Soft decoration */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Sparkles size={17} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              Aura Intelligence
            </p>

            <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
              AI Insights
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Smart observations based on your category activity.
            </p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <InsightBox
            label="Needs Review"
            text={
              <>
                Found{" "}
                <strong className="text-black">
                  {uncategorized?.transactions || 0} uncategorized
                </strong>{" "}
                transaction
                {(uncategorized?.transactions || 0) === 1
                  ? ""
                  : "s"}{" "}
                needing review.
              </>
            }
            action="Review Transactions"
          />

          <InsightBox
            label="Top Spending"
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
    </div>
  );
}

function InsightBox({
  label,
  text,
  action,
}: {
  label: string;
  text: React.ReactNode;
  action: string;
}) {
  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
        {label}
      </p>

      <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
        {text}
      </p>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 transition-[opacity] duration-200 hover:opacity-70"
      >
        {action}

        <ArrowRight
          size={13}
          className="shrink-0"
        />
      </button>
    </div>
  );
}