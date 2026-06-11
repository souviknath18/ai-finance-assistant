import { GoalItem } from "@/types/goal";
import PrimaryGoalCard from "./PrimaryGoalCard";
import CircularGoalCard from "./CircularGoalCard";
import SmallGoalCard from "./SmallGoalCard";
import SmartAllocationCard from "./SmartAllocationCard";

type GoalsGridProps = {
  goals: GoalItem[];
  onAddFundsAction: (goal: GoalItem) => void;
  onEditAction: (goal: GoalItem) => void;
  onDeleteAction: (goal: GoalItem) => void;
};

export default function GoalsGrid({
  goals,
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: GoalsGridProps) {
  const priorityGoal =
    goals.find((goal) => goal.priority === "high") ||
    goals.find((goal) => goal.priority === "medium") ||
    goals[0];

  const remainingGoals = goals.filter(
    (goal) => goal.goal_id !== priorityGoal?.goal_id
  );

  const circularGoal = remainingGoals[0];
  const smallGoals = remainingGoals.slice(1);

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-12">
      {priorityGoal && (
        <PrimaryGoalCard
          goal={priorityGoal}
          onAddFundsAction={onAddFundsAction}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
        />
      )}

      {circularGoal && (
        <CircularGoalCard
          goal={circularGoal}
          onAddFundsAction={onAddFundsAction}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
        />
      )}

      {smallGoals.map((goal) => (
        <SmallGoalCard
          key={goal.goal_id}
          goal={goal}
          onAddFundsAction={onAddFundsAction}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
        />
      ))}

      <SmartAllocationCard goals={goals} />
    </section>
  );
}