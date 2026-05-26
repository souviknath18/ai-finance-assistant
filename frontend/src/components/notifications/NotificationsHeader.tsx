import { Search } from "lucide-react";

export default function NotificationsHeader() {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Notifications
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Stay updated on your financial pulse.
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-[#c6c6cd] bg-white px-3.5 py-2 md:flex">
        <Search size={16} className="text-[#565e74]" />

        <input
          placeholder="Search alerts..."
          className="w-48 bg-transparent text-[13px] outline-none"
        />
      </div>
    </header>
  );
}