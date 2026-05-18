import { Edit, Utensils } from "lucide-react";

export default function LargeBudgetCard() {
  return (
    <div className="flex flex-col rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm md:col-span-8">
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e5eeff] text-black">
            <Utensils size={22} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-black">
              Food & Dining
            </h3>

            <p className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
              Active Monthly Budget
            </p>
          </div>
        </div>

        <button className="rounded-full p-2 text-[#565e74] transition hover:bg-[#e5eeff] hover:text-black">
          <Edit size={18} />
        </button>
      </div>

      <div className="mt-auto">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <span className="text-3xl font-bold text-black">
              ₹84,250
            </span>

            <span className="ml-2 text-sm text-[#565e74]">
              of ₹1,20,000 spent
            </span>
          </div>

          <span className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
            70% used
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div className="h-full w-[70%] rounded-full bg-emerald-700" />
        </div>
      </div>
    </div>
  );
}