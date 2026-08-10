import { Plus } from "lucide-react";

type GoalsHeaderProps = {
  onCreateGoalAction: () => void;
};

export default function GoalsHeader({
  onCreateGoalAction,
}: GoalsHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          Financial Goals
        </h1>

        <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
          Visualize your financial milestones, track progress, and use Aura
          insights to stay on course.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateGoalAction}
        className="inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={15} className="shrink-0" />
        Create New Goal
      </button>
    </section>
  );
}