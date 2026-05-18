import { TrendingUp, WalletCards } from "lucide-react";

export default function FinancialCoreSection() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-black">Financial Core</h2>
        <p className="mt-1 text-sm text-[#565e74]">
          Configure how Aura calculates your wealth projections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm md:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
                Average Monthly Income
              </p>

              <h3 className="mt-2 text-3xl font-bold text-black">
                $12,450.00
              </h3>
            </div>

            <div className="rounded-full bg-emerald-100 p-3 text-emerald-700">
              <WalletCards size={22} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
            <TrendingUp size={16} />
            4.2% higher than last quarter
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-[#dce9ff] bg-[#dce9ff] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Default Currency
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
                USD
              </div>

              <span className="text-sm font-semibold text-black">
                United States Dollar
              </span>
            </div>

            <button className="w-full rounded-xl border border-[#76777d] py-2.5 text-xs font-bold text-black transition hover:bg-white">
              Change Currency
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}