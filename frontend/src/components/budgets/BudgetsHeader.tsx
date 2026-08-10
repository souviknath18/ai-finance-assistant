import { Plus } from "lucide-react";

type BudgetHeaderProps = {
  onCreateAction: () => void;
};

export default function BudgetHeader({
  onCreateAction,
}: BudgetHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          Budgets
        </h1>

        <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
          Optimize your spending habits with AI-driven limits,
          real-time tracking, and proactive budget monitoring.
        </p>
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onCreateAction}
        className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)] active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus
          size={15}
          className="shrink-0"
        />

        Create New Budget
      </button>
    </section>
  );
}