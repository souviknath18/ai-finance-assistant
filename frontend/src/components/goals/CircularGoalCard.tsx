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

  const circumference =
    2 * Math.PI * radius;

  const progress = Math.min(
    Math.max(goal.progress, 0),
    100
  );

  const offset =
    circumference -
    (progress / 100) * circumference;

  const priorityStyles =
    getPriorityStyles(goal.priority);

  return (
    <div className="relative z-10 flex h-full flex-col rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)] md:col-span-4">
      {/* Clipped decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${priorityStyles.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityStyles.dot}`}
          />

          {formatPriority(goal.priority)} Priority
        </span>

        {/* Menu wrapper with high stacking */}
        <div className="relative z-[100] shrink-0">
          <GoalCardMenu
            onAddFundsAction={() =>
              onAddFundsAction(goal)
            }
            onEditAction={() =>
              onEditAction(goal)
            }
            onDeleteAction={() =>
              onDeleteAction(goal)
            }
          />
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-6">
        {/* Progress Circle */}
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 112 112"
            aria-label={`${goal.title} progress ${Math.round(progress)}%`}
          >
            {/* Track */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              className="text-[#edf2fb]"
            />

            {/* Progress */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-emerald-700 transition-[stroke-dashoffset] duration-700"
            />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-bold tracking-tight text-black">
              {Math.round(progress)}%
            </span>

            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Complete
            </span>
          </div>
        </div>

        {/* Goal */}
        <h3 className="mt-5 text-center text-[16px] font-bold tracking-tight text-black">
          {goal.title}
        </h3>

        <p className="mt-1 text-center text-[12px] text-[#565e74]">
          Target:{" "}
          <span className="font-bold text-black">
            {goal.target_amount_display}
          </span>
        </p>

        {/* Current / Remaining */}
        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Saved
            </p>

            <p className="mt-1 text-[12px] font-bold text-black">
              {goal.current_amount_display}
            </p>
          </div>

          <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3 text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Remaining
            </p>

            <p className="mt-1 text-[12px] font-bold text-black">
              {goal.remaining_amount_display}
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      {progress < 100 && (
        <div className="relative z-10 border-t border-[#edf2fb] pt-4">
          <button
            type="button"
            onClick={() =>
              onAddFundsAction(goal)
            }
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            Add Funds
          </button>
        </div>
      )}
    </div>
  );
}

function getPriorityStyles(
  priority: GoalItem["priority"]
) {
  if (priority === "high") {
    return {
      badge:
        "border-red-100 bg-red-50 text-red-600",
      dot: "bg-red-500",
    };
  }

  if (priority === "medium") {
    return {
      badge:
        "border-amber-100 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    };
  }

  return {
    badge:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  };
}

function formatPriority(
  priority: GoalItem["priority"]
) {
  if (!priority) {
    return "Normal";
  }

  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1)
  );
}