import { Plus } from "lucide-react";

type BudgetHeaderProps = {
  onCreateAction: () => void;
};

export default function BudgetHeader({ onCreateAction }: BudgetHeaderProps) {
  return (
    <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Monthly Budgets
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Optimize your spending habits with AI-driven limits and real-time tracking.
        </p>
      </div>

      <button
        onClick={onCreateAction}
        className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
      >
        <Plus size={15} />
        Create New Budget
      </button>
    </section>
  );
}