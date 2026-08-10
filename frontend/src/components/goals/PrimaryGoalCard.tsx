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
  const safeProgress = Math.min(
    Math.max(goal.progress, 0),
    100
  );

  const priorityStyles =
    getPriorityStyles(goal.priority);

  return (
    <div className="relative z-10 flex h-full flex-col rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)] md:col-span-8 sm:p-6">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-emerald-50 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {/* Priority */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${priorityStyles.badge}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${priorityStyles.dot}`}
            />

            {formatPriority(goal.priority)} Priority
          </div>

          {/* Goal title */}
          <h2 className="mt-3 text-[20px] font-bold tracking-tight text-black sm:text-[22px]">
            {goal.title}
          </h2>

          <p className="mt-1.5 text-[12px] font-medium text-[#565e74]">
            Target:{" "}
            <span className="font-bold text-black">
              {goal.target_amount_display}
            </span>
          </p>
        </div>

        {/* Menu */}
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

      {/* Progress section */}
      <div className="relative z-10 mt-7 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Current Progress
            </p>

            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-black">
                {goal.current_amount_display}
              </span>

              <span className="text-[12px] font-medium text-[#565e74]">
                saved
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-[17px] font-bold text-emerald-700">
              {Math.round(safeProgress)}%
            </p>

            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Achieved
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[#e7edf7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-[width] duration-700 ease-out"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        {/* Progress metadata */}
        <div className="mt-3 flex flex-col gap-2 text-[10px] font-medium text-[#7c839b] sm:flex-row sm:items-center sm:justify-between">
          <span className="capitalize">
            {goal.category_name ||
              formatGoalType(
                goal.goal_type
              )}
          </span>

          <span>
            {goal.target_date
              ? `Target: ${formatDate(
                  goal.target_date
                )}`
              : "No target date"}
          </span>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#edf2fb] bg-white p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Monthly Avg
          </p>

          <p className="mt-1.5 text-[14px] font-bold text-black">
            {
              goal.monthly_average_display
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[#edf2fb] bg-white p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Remaining
          </p>

          <p className="mt-1.5 text-[14px] font-bold text-black">
            {
              goal.remaining_amount_display
            }
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Goal Status
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <p className="text-[12px] font-bold text-emerald-700">
              {getGoalStatus(
                safeProgress
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Add funds */}
      {safeProgress < 100 && (
        <div className="relative z-10 mt-5 border-t border-[#edf2fb] pt-4">
          <button
            type="button"
            onClick={() =>
              onAddFundsAction(goal)
            }
            className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
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

function formatGoalType(
  goalType: string
) {
  return goalType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatDate(value: string) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function getGoalStatus(
  progress: number
) {
  if (progress >= 100) {
    return "Goal Completed";
  }

  if (progress >= 75) {
    return "Almost There";
  }

  if (progress >= 40) {
    return "Making Progress";
  }

  return "Building Momentum";
}