import {
  TrendingUp,
  WalletCards,
} from "lucide-react";

export default function FinancialCoreSection() {
  return (
    <section className="mb-6">
      <div className="mb-3">
        <h2 className="text-[15px] font-bold text-black">
          Financial Core
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Configure how Aura
          calculates your wealth
          projections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] lg:col-span-2">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                Average Monthly Income
              </p>

              <h3 className="mt-2 text-[22px] font-bold tracking-tight text-black">
                $12,450.00
              </h3>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <WalletCards
                size={17}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
            <TrendingUp
              size={14}
            />
            4.2% higher than last
            quarter
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-[#e6edf9] bg-[#fbfcff] p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
            Default Currency
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-12 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[11px] font-bold text-black">
                USD
              </div>

              <span className="text-[12px] font-semibold text-black">
                United States Dollar
              </span>
            </div>

            <button
              type="button"
              className="h-10 w-full rounded-xl border border-[#dfe9fb] bg-white text-[11px] font-bold text-black transition hover:bg-[#eff4ff]"
            >
              Change Currency
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}