import { GitMerge } from "lucide-react";

export default function MergeWorkflowCard() {
  return (
    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-black p-6 text-white md:flex-row">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
          <GitMerge size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">Merge Workflow</h2>

          <p className="mt-1.5 text-[13px] leading-5 text-[#bec6e0]">
            Select two categories from the list above to consolidate their
            history and future rules into one.
          </p>
        </div>
      </div>

      <button className="whitespace-nowrap rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-black transition hover:opacity-90">
        Start Merge Process
      </button>
    </div>
  );
}