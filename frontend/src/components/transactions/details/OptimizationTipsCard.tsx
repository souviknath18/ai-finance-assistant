import {
  BellRing,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type OptimizationTipsCardProps = {
  tips: TransactionDetails["optimizationTips"];
};

export default function OptimizationTipsCard({
  tips,
}: OptimizationTipsCardProps) {
  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold tracking-tight text-black">
              Optimization Tips
            </h3>

            {tips.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                <Sparkles size={9} />
                Aura
              </span>
            )}
          </div>

          <p className="mt-1 text-[11px] leading-5 text-[#76777d]">
            Personalized suggestions based on this transaction.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-700">
          <Lightbulb size={16} />
        </div>
      </div>

      {tips.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <TipItem
              key={
                tip.id ??
                `${tip.type ?? "tip"}-${index}`
              }
              index={index}
              text={tip.text}
            />
          ))}
        </div>
      )}

      {tips.length > 0 && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
          <CheckCircle2
            size={13}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <p className="text-[10px] leading-5 text-emerald-800">
            These suggestions are generated from your transaction patterns
            and are intended to help identify potential savings opportunities.
          </p>
        </div>
      )}
    </section>
  );
}

function TipItem({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  const isPrimary =
    index === 0;

  return (
    <div className="group flex items-start gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5 transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dce9ff] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
          isPrimary
            ? "border-amber-100 bg-amber-50 text-amber-700"
            : "border-blue-100 bg-blue-50 text-blue-700"
        }`}
      >
        {isPrimary ? (
          <Lightbulb size={15} />
        ) : (
          <BellRing size={15} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a92a5]">
          {isPrimary
            ? "Smart Suggestion"
            : "Helpful Reminder"}
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#0b1c30]">
          {text}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] px-4 py-7 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#8a92a5]">
        <Lightbulb size={17} />
      </div>

      <p className="mt-3 text-[12px] font-bold text-black">
        No suggestions yet
      </p>

      <p className="mx-auto mt-1 max-w-[260px] text-[10px] leading-5 text-[#76777d]">
        Aura will surface optimization opportunities as it learns more from
        your transaction history.
      </p>
    </div>
  );
}