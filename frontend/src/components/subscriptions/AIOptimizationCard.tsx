import { Bolt } from "lucide-react";

import {
  DetectedSubscription,
  DuplicateSubscriptionGroup,
} from "@/types/subscription";

type AIOptimizationCardProps = {
  subscriptions: DetectedSubscription[];
  duplicates: DuplicateSubscriptionGroup[];
};

export default function AIOptimizationCard({
  subscriptions,
  duplicates,
}: AIOptimizationCardProps) {
  const duplicateCount = duplicates.reduce(
    (total, item) =>
      total + item.count,
    0
  );

  const estimatedSavings = duplicates.length
    ? subscriptions
        .filter((subscription) =>
          duplicates.some((group) =>
            group.services.some(
              (service) =>
                service.toLowerCase() ===
                subscription.merchant.toLowerCase()
            )
          )
        )
        .reduce(
          (total, item) =>
            total +
            Number(
              item.average_amount
            ),
          0
        )
    : 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)]">
      {/* Soft decoration */}
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-2 text-emerald-700">
          <Bolt size={15} />

          <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
            AI Optimization Opportunity
          </span>
        </div>

        <h3 className="mt-2 text-2xl font-bold tracking-tight text-black">
          Save ₹
          {estimatedSavings.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
            }
          )}
          /mo
        </h3>

        <p className="mt-auto pt-3 text-[12px] leading-5 text-[#565e74]">
          {duplicates.length > 0
            ? `We found ${
                duplicates.length
              } duplicate service group${
                duplicates.length > 1
                  ? "s"
                  : ""
              } across ${duplicateCount} recurring services.`
            : "No duplicate subscription groups detected right now."}
        </p>
      </div>
    </div>
  );
}