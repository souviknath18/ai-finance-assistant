import { Search } from "lucide-react";

type NotificationsHeaderProps = {
  search: string;
  onSearchAction: (value: string) => void;
};

export default function NotificationsHeader({
  search,
  onSearchAction,
}: NotificationsHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-black">
          Notifications
        </h1>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Stay updated on your financial pulse.
        </p>
      </div>

      <div className="hidden h-10 items-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-3.5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100 md:flex">
        <Search size={15} className="shrink-0 text-[#565e74]" />

        <input
          value={search}
          onChange={(event) =>
            onSearchAction(event.target.value)
          }
          placeholder="Search alerts..."
          className="w-48 bg-transparent text-[12px] text-black outline-none placeholder:text-[#8a92a5]"
        />
      </div>
    </header>
  );
}