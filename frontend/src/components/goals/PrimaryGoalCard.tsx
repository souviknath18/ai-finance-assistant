import { GoalItem } from "@/types/goal";
import GoalCardMenu from "./GoalCardMenu";

type PrimaryGoalCardProps = {
  goal: GoalItem;
  onAddFundsAction: (goal: GoalItem) => void;
  onEditAction: (goal: GoalItem) => void;
  onDeleteAction: (goal: GoalItem) => void;
};

export default function PrimaryGoalCard({
  goal,
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: PrimaryGoalCardProps) {
  return (
    <div className="flex min-h-[330px] flex-col justify-between rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm md:col-span-8">
      <div className="flex justify-between gap-5">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold capitalize text-emerald-800">
            {goal.priority} Priority
          </span>

          <h2 className="mt-3 text-2xl font-bold text-black">{goal.title}</h2>

          <p className="mt-1.5 text-[13px] text-[#565e74]">
            Target: {goal.target_amount_display}
          </p>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-right">
            <p className="text-xl font-bold text-black">
              {goal.current_amount_display}
            </p>

            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              {Math.round(goal.progress)}% Achieved
            </p>
          </div>

          <GoalCardMenu
            onAddFundsAction={() => onAddFundsAction(goal)}
            onEditAction={() => onEditAction(goal)}
            onDeleteAction={() => onDeleteAction(goal)}
          />
        </div>
      </div>

      <div className="py-9">
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#e5eeff]">
          <div
            className="h-full rounded-full bg-emerald-700"
            style={{ width: `${Math.min(goal.progress, 100)}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-[11px] font-semibold text-[#565e74]">
          <span>{goal.category_name || goal.goal_type}</span>
          <span className="font-bold text-emerald-700">
            {goal.target_date ? `Target: ${goal.target_date}` : "No target date"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-[#c6c6cd] pt-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Monthly Avg
          </p>
          <p className="mt-1 text-base font-bold text-black">
            {goal.monthly_average_display}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Remaining
          </p>
          <p className="mt-1 text-base font-bold text-red-600">
            {goal.remaining_amount_display}
          </p>
        </div>

        <div className="text-right">
          <button className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 hover:underline">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}