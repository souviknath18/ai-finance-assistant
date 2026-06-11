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

function getGoalIcon(goalType: GoalItem["goal_type"]) {
  if (goalType === "travel") return <Plane size={18} />;
  if (goalType === "debt") return <Landmark size={18} />;
  if (goalType === "purchase") return <ShoppingBag size={18} />;
  if (goalType === "investment") return <PiggyBank size={18} />;
  return <Target size={18} />;
}

export default function SmallGoalCard({
  goal,
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: SmallGoalCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#c6c6cd] bg-white p-5 shadow-sm md:col-span-4">
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-xl bg-[#e5eeff] p-2.5 text-black">
          {getGoalIcon(goal.goal_type)}
        </div>

        <GoalCardMenu
          onAddFundsAction={() => onAddFundsAction(goal)}
          onEditAction={() => onEditAction(goal)}
          onDeleteAction={() => onDeleteAction(goal)}
        />
      </div>

      <h3 className="text-lg font-bold text-black">{goal.title}</h3>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-base font-bold text-black">
          {goal.current_amount_display}
        </span>

        <span className="text-[13px] text-[#565e74]">
          / {goal.target_amount_display}
        </span>
      </div>

      <div className="mt-5 h-1.5 w-full rounded-full bg-[#e5eeff]">
        <div
          className="h-full rounded-full bg-indigo-700 transition-all"
          style={{
            width: `${Math.min(goal.progress, 100)}%`,
          }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
          {goal.category_name || goal.goal_type}
        </p>

        <p className="text-[11px] font-bold text-indigo-700">
          {goal.progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
}