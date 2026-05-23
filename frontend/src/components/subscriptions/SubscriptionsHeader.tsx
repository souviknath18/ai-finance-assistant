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
    <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Subscriptions
        </h1>

        <p className="mt-2 text-base leading-7 text-[#565e74]">
          We&apos;ve identified {count} recurring payments from your accounts.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onFilterAction}
          className="flex items-center gap-2 rounded-xl bg-[#dce9ff] px-5 py-3 text-sm font-bold text-black"
        >
          <Filter size={17} />
          Filter
        </button>

        <button
          onClick={onAddManualAction}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
        >
          <Plus size={17} />
          Add Manual
        </button>
      </div>
    </header>
  );
}