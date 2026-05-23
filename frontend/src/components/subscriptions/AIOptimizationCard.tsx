import { Bolt, Sparkles } from "lucide-react";
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
    (total, item) => total + item.count,
    0
  );

  const estimatedSavings = duplicates.length
    ? subscriptions
        .filter((sub) =>
          duplicates.some((group) =>
            group.services.some(
              (service) =>
                service.toLowerCase() === sub.merchant.toLowerCase()
            )
          )
        )
        .reduce((total, item) => total + Number(item.average_amount), 0)
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-6 shadow-sm md:col-span-2">
      <Sparkles size={70} className="absolute right-5 top-5 text-emerald-100" />

      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2 text-emerald-700">
          <Bolt size={18} />

          <span className="text-xs font-bold uppercase tracking-wider">
            AI Optimization Opportunity
          </span>
        </div>

        <h3 className="mb-2 text-2xl font-bold text-black">
          Save ₹{estimatedSavings.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
          /mo
        </h3>

        <p className="text-sm leading-6 text-[#565e74]">
          {duplicates.length > 0
            ? `We found ${duplicates.length} duplicate service group${
                duplicates.length > 1 ? "s" : ""
              } across ${duplicateCount} recurring services.`
            : "No duplicate subscription groups detected right now."}
        </p>
      </div>
    </div>
  );
}