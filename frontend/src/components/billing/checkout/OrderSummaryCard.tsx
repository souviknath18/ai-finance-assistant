import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Real-time Market Prediction",
  "Priority 24/7 AI Support",
  "Unlimited Document Uploads",
  "Advanced Tax Optimization",
];

export default function OrderSummaryCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
            Elite Plan
          </span>

          <h2 className="mt-3 text-[20px] font-bold tracking-tight text-black">
            Aura Elite
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[24px] font-bold tracking-tight text-black">
            $59
            <span className="ml-1 text-[11px] font-medium text-[#565e74]">
              /mo
            </span>
          </p>

          <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#7c839b]">
            Billed Monthly
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-[#edf2fb] pt-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2.5">
            <CheckCircle2
              size={16}
              className="shrink-0 text-emerald-700"
            />

            <span className="text-[12px] font-medium text-[#45464d]">
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}