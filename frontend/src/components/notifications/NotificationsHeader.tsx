import { Search } from "lucide-react";

export default function NotificationsHeader() {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Notifications
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Stay updated on your financial pulse.
        </p>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-[#c6c6cd] bg-white px-4 py-3 md:flex">
        <Search size={18} className="text-[#565e74]" />

        <input
          placeholder="Search alerts..."
          className="w-52 bg-transparent text-sm outline-none"
        />
      </div>
    </header>
  );
}