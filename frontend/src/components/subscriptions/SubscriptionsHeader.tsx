import { Filter, Plus } from "lucide-react";

type SubscriptionsHeaderProps = {
  count: number;
  onAddManualAction: () => void;
  onFilterAction: () => void;
};

export default function SubscriptionsHeader({
  count,
  onAddManualAction,
  onFilterAction,
}: SubscriptionsHeaderProps) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Subscriptions
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          We&apos;ve identified {count} recurring payments from your accounts.
        </p>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onFilterAction}
          className="flex items-center gap-2 rounded-xl bg-[#dce9ff] px-4 py-2.5 text-[13px] font-bold text-black"
        >
          <Filter size={15} />
          Filter
        </button>

        <button
          onClick={onAddManualAction}
          className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white"
        >
          <Plus size={15} />
          Add Manual
        </button>
      </div>
    </header>
  );
}