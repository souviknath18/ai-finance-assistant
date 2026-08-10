"use client";

import {
  Plane,
  Landmark,
  ShoppingBag,
  PiggyBank,
  Target,
} from "lucide-react";

import { GoalItem } from "@/types/goal";
import GoalCardMenu from "./GoalCardMenu";

type SmallGoalCardProps = {
  goal: GoalItem;
  onAddFundsAction: (goal: GoalItem) => void;
  onEditAction: (goal: GoalItem) => void;
  onDeleteAction: (goal: GoalItem) => void;
};

function getGoalIcon(
  goalType: GoalItem["goal_type"]
) {
  if (goalType === "travel") {
    return <Plane size={17} />;
  }

  if (goalType === "debt") {
    return <Landmark size={17} />;
  }

  if (goalType === "purchase") {
    return <ShoppingBag size={17} />;
  }

  if (goalType === "investment") {
    return <PiggyBank size={17} />;
  }

  return <Target size={17} />;
}

export default function SmallGoalCard({
  goal,
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: SmallGoalCardProps) {
  const safeProgress = Math.min(
    Math.max(goal.progress, 0),
    100
  );

  const priorityStyles =
    getPriorityStyles(goal.priority);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)] md:col-span-4">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          {getGoalIcon(goal.goal_type)}
        </div>

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

      {/* Priority */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${priorityStyles.badge}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${priorityStyles.dot}`}
          />

          {formatPriority(goal.priority)} Priority
        </span>
      </div>

      {/* Goal */}
      <h3 className="mt-3 text-[16px] font-bold tracking-tight text-black">
        {goal.title}
      </h3>

      <p className="mt-1 text-[11px] font-medium capitalize text-[#7c839b]">
        {goal.category_name ||
          formatGoalType(goal.goal_type)}
      </p>

      {/* Amount */}
      <div className="mt-5 flex flex-wrap items-baseline gap-1.5">
        <span className="text-[16px] font-bold text-black">
          {goal.current_amount_display}
        </span>

        <span className="text-[11px] text-[#565e74]">
          of {goal.target_amount_display}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
            Progress
          </span>

          <span className="text-[11px] font-bold text-emerald-700">
            {Math.round(safeProgress)}%
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-[width] duration-600"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Remaining
            </p>

            <p className="mt-1 text-[11px] font-bold text-black">
              {goal.remaining_amount_display}
            </p>
          </div>

          <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3">
            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
              Target Date
            </p>

            <p className="mt-1 text-[11px] font-bold text-black">
              {goal.target_date
                ? formatDate(goal.target_date)
                : "Not set"}
            </p>
          </div>
        </div>

        {/* Action */}
        {safeProgress < 100 && (
          <button
            type="button"
            onClick={() =>
              onAddFundsAction(goal)
            }
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            Add Funds
          </button>
        )}
      </div>
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