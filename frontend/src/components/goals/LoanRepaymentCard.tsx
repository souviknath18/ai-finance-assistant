import { Landmark } from "lucide-react";

export default function LoanRepaymentCard() {
  return (
    <section className="rounded-3xl border border-[#c6c6cd] bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-5">
          <div className="rounded-xl bg-red-50 p-3 text-red-600">
            <Landmark size={24} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-black">
              Student Loan Repayment
            </h3>

            <p className="mt-1 text-sm text-[#565e74]">
              Debt-free target: Oct 2026
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-2xl font-bold text-red-600">-₹22,40,000</p>
          <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
            remaining of ₹45,00,000
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
          <span className="text-black">50% Repaid</span>
          <span className="rounded bg-emerald-700 px-2 py-1 text-white">
            Accelerated Path
          </span>
        </div>

        <div className="flex h-6 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div className="h-full w-[50%] bg-black" />
          <div className="h-full w-[15%] border-l border-white/50 bg-black/20" />
        </div>

        <div className="flex gap-6 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-black" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
              Paid Off
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-black/20" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}