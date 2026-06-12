import { Plus } from "lucide-react";

type GoalsHeaderProps = {
  onCreateGoalAction: () => void;
};

export default function GoalsHeader({ onCreateGoalAction }: GoalsHeaderProps) {
  return (
    <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Financial Goals
        </h1>

        <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#565e74]">
          Visualizing your future. Tracking your progress through intelligent
          insights and automated growth strategies.
        </p>
      </div>

      <button
        onClick={onCreateGoalAction}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 md:w-auto"
      >
        <Plus size={15} />
        Create New Goal
      </button>
    </section>
  );
}