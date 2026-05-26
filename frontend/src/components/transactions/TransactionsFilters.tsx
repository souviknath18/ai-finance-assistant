"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import DateRangeFilter from "../ui/DateRangeFilter";
import { SelectOption } from "@/components/ui/CustomSelect";

type TransactionsFiltersProps = {
  searchQuery: string;
  semanticMode: boolean;
  searching: boolean;
  startDate: string;
  endDate: string;
  category: string;
  transactionType: string;
  statusFilter: string;
  categoryOptions: SelectOption[];
  onSearchQueryChangeAction: (value: string) => void;
  onSemanticSearchAction: (query?: string) => void;
  onQuickSearchAction: (query: string) => void;
  onClearSearchAction: () => void;
  onFilterChangeAction: (name: string, value: string) => void;
};

const quickSearches = [
  "Bank Fees",
  "Subscriptions",
  "Income Deposits",
  "Food Delivery",
  "Travel",
  "Unusual Charges",
];

export default function TransactionsFilters({
  searchQuery,
  semanticMode,
  searching,
  startDate,
  endDate,
  category,
  transactionType,
  statusFilter,
  categoryOptions,
  onSearchQueryChangeAction,
  onSemanticSearchAction,
  onQuickSearchAction,
  onClearSearchAction,
  onFilterChangeAction,
}: TransactionsFiltersProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  return (
    <div className="mb-5 overflow-visible rounded-2xl border border-[#e5eeff] bg-white p-4 shadow-sm">
      {/* SEARCH SECTION */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl bg-[#eff4ff] p-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center rounded-xl bg-white px-3 py-2.5">
          <Search size={16} className="text-[#76777d]" />

          <input
            value={searchQuery}
            onChange={(event) =>
              onSearchQueryChangeAction(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSemanticSearchAction();
              }
            }}
            placeholder='Try "bank fees", "subscriptions", "income deposits"...'
            className="ml-3 w-full bg-transparent text-[13px] outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSemanticSearchAction()}
            disabled={!searchQuery.trim() || searching}
            className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching ? "Searching..." : "Smart Search"}
          </button>

          {semanticMode && (
            <button
              type="button"
              onClick={onClearSearchAction}
              className="flex items-center gap-2 rounded-xl border border-[#c6c6cd] bg-white px-3 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* QUICK SEARCH CHIPS */}
      <div className="mb-4 flex flex-wrap gap-2">
        {quickSearches.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onQuickSearchAction(chip)}
            disabled={searching}
            className="rounded-full border border-[#dce9ff] bg-white px-3 py-1.5 text-[11px] font-bold text-[#565e74] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DateRangeFilter
          label="Start Date"
          name="startDate"
          value={startDate}
          onChangeAction={(name, value) =>
            onFilterChangeAction(name, value)
          }
        />

        <DateRangeFilter
          label="End Date"
          name="endDate"
          value={endDate}
          onChangeAction={(name, value) =>
            onFilterChangeAction(name, value)
          }
        />

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Category
          </label>

          <CustomSelect
            name="category"
            value={category}
            open={openFilter === "category"}
            onOpenChangeAction={(open) =>
              setOpenFilter(open ? "category" : null)
            }
            options={categoryOptions}
            onChangeAction={onFilterChangeAction}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Transaction Type
          </label>

          <CustomSelect
            name="transactionType"
            value={transactionType}
            open={openFilter === "transactionType"}
            onOpenChangeAction={(open) =>
              setOpenFilter(open ? "transactionType" : null)
            }
            options={[
              { label: "All Types", value: "all" },
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
              { label: "Transfer", value: "transfer" },
            ]}
            onChangeAction={onFilterChangeAction}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Status
          </label>

          <CustomSelect
            name="statusFilter"
            value={statusFilter}
            open={openFilter === "statusFilter"}
            onOpenChangeAction={(open) =>
              setOpenFilter(open ? "statusFilter" : null)
            }
            options={[
              { label: "All Status", value: "all" },
              { label: "AI Verified", value: "AI Verified" },
              { label: "Rule Verified", value: "Rule Verified" },
              { label: "User Verified", value: "User Verified" },
              { label: "AI Review Needed", value: "AI Review Needed" },
            ]}
            onChangeAction={onFilterChangeAction}
          />
        </div>
      </div>
    </div>
  );
}