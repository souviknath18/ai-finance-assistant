export default function PrimaryGoalCard() {
  return (
    <div className="flex min-h-[400px] flex-col justify-between rounded-3xl border border-[#c6c6cd] bg-white p-6 shadow-sm md:col-span-8">
      <div className="flex justify-between gap-6">
        <div>
          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-800">
            Priority
          </span>

          <h2 className="mt-4 text-3xl font-bold text-black">
            Emergency Fund
          </h2>

          <p className="mt-2 text-sm text-[#565e74]">
            Target: ₹15,00,000
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-black">₹12,45,000</p>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            83% Achieved
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="h-4 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div className="h-full w-[83%] rounded-full bg-emerald-700" />
        </div>

        <div className="mt-4 flex justify-between text-xs font-semibold text-[#565e74]">
          <span>Started: Jan 12, 2024</span>
          <span className="font-bold text-emerald-700">
            Estimated: June 24, 2024
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 border-t border-[#c6c6cd] pt-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Monthly Avg
          </p>
          <p className="mt-1 text-lg font-bold text-black">₹1,20,000</p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Remaining
          </p>
          <p className="mt-1 text-lg font-bold text-red-600">₹2,55,000</p>
        </div>

        <div className="text-right">
          <button className="text-xs font-bold uppercase tracking-wide text-emerald-700 hover:underline">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}