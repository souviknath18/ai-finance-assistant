const chartData = [
  { month: "Jan", height: "40%", opacity: "opacity-20" },
  { month: "Feb", height: "55%", opacity: "opacity-40" },
  { month: "Mar", height: "45%", opacity: "opacity-60" },
  { month: "Apr", height: "70%", opacity: "opacity-80" },
  { month: "May", height: "85%", opacity: "opacity-100" },
  { month: "Jun", height: "60%", opacity: "opacity-50" },
];

export default function BalanceChart() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <div className="mb-10 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">
          Monthly Balance
        </h3>

        <div className="flex gap-2">
          <button className="rounded-xl bg-[#e5eeff] px-4 py-1.5 text-xs font-semibold text-[#565e74]">
            6M
          </button>

          <button className="rounded-xl bg-black px-4 py-1.5 text-xs font-semibold text-white">
            1Y
          </button>
        </div>
      </div>

      <div className="relative h-72 w-full">
        <div className="absolute inset-0 flex items-end gap-6">
          {chartData.map((item) => (
            <div
              key={item.month}
              className={`flex-1 rounded-t-2xl bg-emerald-700 ${item.opacity}`}
              style={{ height: item.height }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 flex w-full justify-between border-t border-[#c6c6cd] pt-3 text-xs font-semibold text-[#565e74]">
          {chartData.map((item) => (
            <span key={item.month}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}