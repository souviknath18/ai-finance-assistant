import { Search, CalendarDays } from "lucide-react";
import FilterBox from "./FilterBox";

export default function TransactionsFilters() {
  return (
    <div className="mb-6 rounded-3xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center rounded-xl bg-[#eff4ff] px-4 py-3 lg:hidden">
        <Search size={18} className="text-[#76777d]" />

        <input
          placeholder="Search transactions..."
          className="ml-3 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <FilterBox
          icon={<CalendarDays size={17} />}
          label="Date Range"
          value="Last 30 Days"
        />

        <FilterBox label="Category" value="All Categories" />

        <FilterBox label="Transaction Type" value="All Types" />

        <FilterBox label="Account" value="All Accounts" />
      </div>
    </div>
  );
}