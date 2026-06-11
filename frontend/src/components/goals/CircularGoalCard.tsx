import { GoalItem } from "@/types/goal";
import GoalCardMenu from "./GoalCardMenu";

type CircularGoalCardProps = {
  goal: GoalItem;
  onAddFundsAction: (goal: GoalItem) => void;
  onEditAction: (goal: GoalItem) => void;
  onDeleteAction: (goal: GoalItem) => void;
};

export default function CircularGoalCard({
  goal,
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: CircularGoalCardProps) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(goal.progress, 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col rounded-2xl border border-[#c6c6cd] bg-white p-5 text-center shadow-sm md:col-span-4">
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold capitalize text-emerald-800">
          {goal.priority}
        </span>

        <GoalCardMenu
          onAddFundsAction={() => onAddFundsAction(goal)}
          onEditAction={() => onEditAction(goal)}
          onDeleteAction={() => onDeleteAction(goal)}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative h-28 w-28">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              className="text-[#e5eeff]"
            />

            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-emerald-700"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-black">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <h3 className="mt-5 text-lg font-bold text-black">{goal.title}</h3>

        <p className="mt-1.5 text-[13px] text-[#565e74]">
          Target: {goal.target_amount_display}
        </p>

        <button
          onClick={() => onAddFundsAction(goal)}
          className="mt-5 w-full rounded-xl border border-[#76777d] py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
        >
          Add Funds
        </button>
      </div>
    </div>
  );
}