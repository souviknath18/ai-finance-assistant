export default function CircularGoalCard() {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = 60;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#c6c6cd] bg-white p-6 text-center shadow-sm md:col-span-4">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-[#e5eeff]"
          />

          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-emerald-700"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-black">60%</span>
        </div>
      </div>

      <h3 className="mt-6 text-2xl font-bold text-black">MacBook Pro</h3>

      <p className="mt-2 text-sm text-[#565e74]">Target: ₹2,40,000</p>

      <button className="mt-6 w-full rounded-xl border border-[#76777d] py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]">
        Add Funds
      </button>
    </div>
  );
}