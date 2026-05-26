export default function PrimaryGoalCard() {
  return (
    <div className="flex min-h-[330px] flex-col justify-between rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm md:col-span-8">
      <div className="flex justify-between gap-5">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
            Priority
          </span>

          <h2 className="mt-3 text-2xl font-bold text-black">
            Emergency Fund
          </h2>

          <p className="mt-1.5 text-[13px] text-[#565e74]">
            Target: ₹15,00,000
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-black">₹12,45,000</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            83% Achieved
          </p>
        </div>
      </div>

      <div className="py-9">
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div className="h-full w-[83%] rounded-full bg-emerald-700" />
        </div>

        <div className="mt-3 flex justify-between text-[11px] font-semibold text-[#565e74]">
          <span>Started: Jan 12, 2024</span>
          <span className="font-bold text-emerald-700">
            Estimated: June 24, 2024
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-[#c6c6cd] pt-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Monthly Avg
          </p>
          <p className="mt-1 text-base font-bold text-black">₹1,20,000</p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Remaining
          </p>
          <p className="mt-1 text-base font-bold text-red-600">₹2,55,000</p>
        </div>

        <div className="text-right">
          <button className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 hover:underline">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}