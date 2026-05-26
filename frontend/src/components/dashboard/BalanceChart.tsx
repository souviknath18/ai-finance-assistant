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
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">
          Monthly Balance
        </h3>

        <div className="flex gap-2">
          <button className="rounded-lg bg-[#e5eeff] px-3 py-1 text-[11px] font-semibold text-[#565e74]">
            6M
          </button>

          <button className="rounded-lg bg-black px-3 py-1 text-[11px] font-semibold text-white">
            1Y
          </button>
        </div>
      </div>

      <div className="relative h-56 w-full">
        <div className="absolute inset-0 flex items-end gap-4">
          {chartData.map((item) => (
            <div
              key={item.month}
              className={`flex-1 rounded-t-2xl bg-emerald-700 ${item.opacity}`}
              style={{ height: item.height }}
            />
          ))}
        </div>

        <div className="absolute bottom-0 flex w-full justify-between border-t border-[#c6c6cd] pt-2 text-[11px] font-semibold text-[#565e74]">
          {chartData.map((item) => (
            <span key={item.month}>{item.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}