import { BarChart3 } from "lucide-react";

const bars = ["50%", "65%", "35%", "75%", "82%", "100%"];

export default function SpendingVelocityCard() {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
          <BarChart3 size={18} />
        </div>

        <h3 className="text-lg font-bold text-black">
          Monthly Spending Velocity
        </h3>
      </div>

      <div className="flex h-40 items-end gap-3 overflow-hidden px-3">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className={`w-full rounded-t-lg ${
              index === 5 ? "relative bg-emerald-700" : "bg-emerald-200"
            }`}
            style={{ height }}
          >
            {index === 5 && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold">
                Current
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#c6c6cd] pt-4 md:flex-row md:items-center">
        <p className="text-[13px] text-[#565e74]">
          Your spending is{" "}
          <span className="font-bold text-emerald-700">12% lower</span> than
          last month.
        </p>

        <button className="text-[13px] font-bold text-black hover:underline">
          View Detailed Report
        </button>
      </div>
    </div>
  );
}