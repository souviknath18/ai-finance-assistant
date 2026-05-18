import { Plus } from "lucide-react";

export default function BudgetHeader() {
  return (
    <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Monthly Budgets
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Optimize your spending habits with AI-driven limits and real-time
          tracking.
        </p>
      </div>

      <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98]">
        <Plus size={17} />
        Create New Budget
      </button>
    </section>
  );
}