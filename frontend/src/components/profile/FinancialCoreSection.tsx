import { TrendingUp, WalletCards } from "lucide-react";

export default function FinancialCoreSection() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-black">Financial Core</h2>
        <p className="mt-1 text-[13px] leading-6 text-[#565e74]">
          Configure how Aura calculates your wealth projections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Average Monthly Income
              </p>

              <h3 className="mt-2 text-2xl font-bold text-black">
                $12,450.00
              </h3>
            </div>

            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <WalletCards size={20} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-700">
            <TrendingUp size={15} />
            4.2% higher than last quarter
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[#dce9ff] bg-[#dce9ff] p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Default Currency
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white text-[12px] font-bold text-black">
                USD
              </div>

              <span className="text-[13px] font-semibold text-black">
                United States Dollar
              </span>
            </div>

            <button className="w-full rounded-xl border border-[#76777d] py-2.5 text-[12px] font-bold text-black transition hover:bg-white">
              Change Currency
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}