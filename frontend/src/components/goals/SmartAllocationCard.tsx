import {
  Sparkles,
  Target,
} from "lucide-react";

import { GoalItem } from "@/types/goal";

type SmartAllocationCardProps = {
  goals: GoalItem[];
};

export default function SmartAllocationCard({
  goals,
}: SmartAllocationCardProps) {
  const firstGoal = goals[0];
  const secondGoal = goals[1];

  if (!firstGoal) {
    return null;
  }

  const firstProgress = Math.min(
    Math.max(firstGoal.progress, 0),
    100
  );

  const secondProgress = secondGoal
    ? Math.min(
        Math.max(secondGoal.progress, 0),
        100
      )
    : 0;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)] md:col-span-4">
      {/* Soft background */}
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-emerald-50 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <Sparkles size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Aura Recommendation
          </p>

          <h3 className="mt-1 text-[16px] font-bold tracking-tight text-black">
            Smart Allocation
          </h3>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            Aura highlights which goals may deserve more attention based on
            your current progress.
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="relative z-10 mt-5 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-black">
            <Target size={14} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Suggested Focus
            </p>

            <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
              Prioritize{" "}
              <span className="font-bold text-black">
                {firstGoal.title}
              </span>

              {secondGoal && (
                <>
                  {" "}
                  while maintaining steady progress toward{" "}
                  <span className="font-bold text-black">
                    {secondGoal.title}
                  </span>
                  .
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Goal comparison */}
      <div className="relative z-10 mt-5 space-y-4">
        <GoalAllocationRow
          title={firstGoal.title}
          progress={firstProgress}
          priority={firstGoal.priority}
          primary
        />

        {secondGoal && (
          <GoalAllocationRow
            title={secondGoal.title}
            progress={secondProgress}
            priority={secondGoal.priority}
          />
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-5">
        <div className="border-t border-[#edf2fb] pt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            Allocation Guidance Active
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalAllocationRow({
  title,
  progress,
  priority,
  primary = false,
}: {
  title: string;
  progress: number;
  priority: GoalItem["priority"];
  primary?: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold text-black">
            {title}
          </p>

          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a92a5]">
            {formatPriority(priority)} Priority
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p
            className={`text-[12px] font-bold ${
              primary
                ? "text-emerald-700"
                : "text-[#565e74]"
            }`}
          >
            {Math.round(progress)}%
          </p>

          <p className="text-[8px] font-bold uppercase tracking-wide text-[#8a92a5]">
            Complete
          </p>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            primary
              ? "bg-emerald-600"
              : "bg-[#9fb7d7]"
          }`}
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
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