import { BellRing, Lightbulb } from "lucide-react";
import type { TransactionDetails } from "@/types/transaction";

type OptimizationTipsCardProps = {
  tips: TransactionDetails["optimizationTips"];
};

export default function OptimizationTipsCard({
  tips,
}: OptimizationTipsCardProps) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#565e74]">
        Optimization Tips
      </h3>

      {tips.length === 0 ? (
        <div className="rounded-xl bg-[#f8f9ff] p-4 text-[13px] leading-6 text-[#565e74]">
          No optimization suggestions are available for this transaction yet.
        </div>
      ) : (
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <Tip
              key={tip.id ?? `${tip.type ?? "tip"}-${index}`}
              icon={
                index % 2 === 0 ? (
                  <Lightbulb size={18} />
                ) : (
                  <BellRing size={18} />
                )
              }
              text={tip.text}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Tip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#f8f9ff] p-3">
      <span className="mt-0.5 shrink-0 text-emerald-700">
        {icon}
      </span>

      <p className="text-[13px] leading-6 text-black">
        {text}
      </p>
    </div>
  );
}