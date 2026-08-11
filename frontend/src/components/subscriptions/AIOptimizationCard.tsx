import {
  Bolt,
  Sparkles,
} from "lucide-react";

import type {
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
  const duplicateCount =
    duplicates.reduce(
      (total, item) =>
        total + item.count,
      0
    );

  const estimatedSavings =
    duplicates.length > 0
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
    <div className="relative min-h-[145px] overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles
                size={11}
                className="text-emerald-700"
              />

              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                AI Optimization
              </p>
            </div>

            <h3 className="mt-2 text-[21px] font-bold tracking-tight text-black">
              Save ₹
              {estimatedSavings.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
              /mo
            </h3>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Bolt size={17} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-emerald-100 pt-3">
          <p className="text-[10px] font-semibold leading-5 text-[#565e74]">
            {duplicates.length > 0
              ? `Aura found ${duplicates.length} duplicate service ${
                  duplicates.length === 1
                    ? "group"
                    : "groups"
                } across ${duplicateCount} recurring services.`
              : "No duplicate subscription groups detected right now."}
          </p>
        </div>
      </div>
    </div>
  );
}