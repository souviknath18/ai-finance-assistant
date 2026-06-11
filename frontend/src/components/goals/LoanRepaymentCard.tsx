import { Landmark } from "lucide-react";
import { GoalItem } from "@/types/goal";

type LoanRepaymentCardProps = {
  goals: GoalItem[];
};

export default function LoanRepaymentCard({ goals }: LoanRepaymentCardProps) {
  const goal = goals[0];

  if (!goal) return null;

  return (
    <section className="rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
            <Landmark size={20} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-black">{goal.title}</h3>

            <p className="mt-1 text-[13px] text-[#565e74]">
              Debt-free target: {goal.target_date || "No target date"}
            </p>
          </div>
        </div>

        <div className="md:text-right">
          <p className="text-xl font-bold text-red-600">
            -{goal.remaining_amount_display}
          </p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            remaining of {goal.target_amount_display}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-black">{Math.round(goal.progress)}% Repaid</span>
          <span className="rounded bg-emerald-700 px-2 py-1 text-white">
            Accelerated Path
          </span>
        </div>

        <div className="flex h-5 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className="h-full bg-black"
            style={{ width: `${Math.min(goal.progress, 100)}%` }}
          />
          <div className="h-full w-[15%] border-l border-white/50 bg-black/20" />
        </div>
      </div>
    </section>
  );
}