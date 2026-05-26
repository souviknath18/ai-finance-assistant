import { Landmark } from "lucide-react";

export default function LoanRepaymentCard() {
  return (
    <section className="rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
            <Landmark size={20} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-black">
              Student Loan Repayment
            </h3>

            <p className="mt-1 text-[13px] text-[#565e74]">
              Debt-free target: Oct 2026
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-xl font-bold text-red-600">-₹22,40,000</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            remaining of ₹45,00,000
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-black">50% Repaid</span>
          <span className="rounded bg-emerald-700 px-2 py-1 text-white">
            Accelerated Path
          </span>
        </div>

        <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div className="h-full w-[50%] bg-black" />
          <div className="h-full w-[15%] border-l border-white/50 bg-black/20" />
        </div>

        <div className="flex gap-5 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-black" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Paid Off
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-black/20" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}