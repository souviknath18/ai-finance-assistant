export default function SmartAllocationCard() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-[#c6c6cd] bg-[#eff4ff] p-5 md:col-span-8 md:flex-row">
      <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-[#dce9ff] shadow-sm md:w-40">
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-700">70%</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Smart Split
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-black">Smart Allocations</h3>

        <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
          Our AI analyzed your recent ₹40,000 bonus. We suggest splitting it
          across your <strong className="text-black">Emergency Fund</strong>{" "}
          70% and <strong className="text-black">Japan Trip</strong> 30% to
          maintain peak momentum.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
            Execute Split
          </button>

          <button className="rounded-xl px-4 py-2.5 text-[13px] font-bold text-[#565e74] transition hover:bg-[#dce9ff] hover:text-black">
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}