export default function SmartAllocationCard() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-[#c6c6cd] bg-[#eff4ff] p-6 md:col-span-8 md:flex-row">
      <div className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 to-[#dce9ff] shadow-sm md:w-48">
        <div className="text-center">
          <p className="text-4xl font-bold text-emerald-700">70%</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Smart Split
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-black">Smart Allocations</h3>

        <p className="mt-3 text-sm leading-7 text-[#565e74]">
          Our AI analyzed your recent ₹40,000 bonus. We suggest splitting it
          across your <strong className="text-black">Emergency Fund</strong>{" "}
          70% and <strong className="text-black">Japan Trip</strong> 30% to
          maintain peak momentum.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
            Execute Split
          </button>

          <button className="rounded-xl px-6 py-3 text-sm font-bold text-[#565e74] transition hover:bg-[#dce9ff] hover:text-black">
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}