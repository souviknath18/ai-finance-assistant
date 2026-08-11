"use client";

import { useState } from "react";
import {
  Search,
  X,
} from "lucide-react";

import CustomSelect, {
  SelectOption,
} from "@/components/ui/CustomSelect";

import DateRangeFilter from "../ui/DateRangeFilter";

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
  onSearchQueryChangeAction: (
    value: string
  ) => void;
  onSemanticSearchAction: (
    query?: string
  ) => void;
  onQuickSearchAction: (
    query: string
  ) => void;
  onClearSearchAction: () => void;
  onClearFiltersAction: () => void;
  onFilterChangeAction: (
    name: string,
    value: string
  ) => void;
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
  onClearFiltersAction,
  onFilterChangeAction,
}: TransactionsFiltersProps) {
  const [
    openFilter,
    setOpenFilter,
  ] = useState<string | null>(
    null
  );

  const hasActiveFilters =
    Boolean(startDate) ||
    Boolean(endDate) ||
    category !== "all" ||
    transactionType !== "all" ||
    statusFilter !== "all";

  return (
    <div className="mb-6 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Search */}
      <div className="mb-4">
        <label className="ml-1 mb-1.5 block text-[11px] font-semibold text-[#565e74]">
          Semantic Search
        </label>

        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="flex h-11 w-full min-w-0 items-center rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3 transition hover:border-[#c9d9f3] focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100">
            <Search
              size={16}
              className="shrink-0 text-[#565e74]"
            />

            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchQueryChangeAction(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSemanticSearchAction();
                }
              }}
              placeholder='Try "bank fees", "subscriptions", "income deposits"...'
              className="ml-3 min-w-0 flex-1 bg-transparent text-[12px] text-[#0b1c30] outline-none placeholder:text-[#8a92a5]"
            />
          </div>

          <div className="flex w-full gap-2 sm:w-auto lg:shrink-0">
            <button
              type="button"
              onClick={() =>
                onSemanticSearchAction()
              }
              disabled={
                !searchQuery.trim() ||
                searching
              }
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {searching
                ? "Searching..."
                : "Smart Search"}
            </button>

            {semanticMode && (
              <button
                type="button"
                onClick={
                  onClearSearchAction
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#eff4ff] sm:flex-none"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick searches */}
      <div className="mb-5 flex flex-wrap gap-2">
        {quickSearches.map(
          (chip) => (
            <button
              key={chip}
              type="button"
              onClick={() =>
                onQuickSearchAction(
                  chip
                )
              }
              disabled={
                searching
              }
              className="rounded-full border border-[#e6edf9] bg-[#fbfcff] px-3 py-1.5 text-[10px] font-bold text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {chip}
            </button>
          )
        )}
      </div>

      {/* Filter heading */}
      <div className="mb-3 flex items-center justify-between gap-3 border-t border-[#edf2fb] pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Filters
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={
              onClearFiltersAction
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-red-600 transition hover:bg-red-50"
          >
            <X size={13} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <DateRangeFilter
          label="Start Date"
          name="startDate"
          value={startDate}
          onChangeAction={(
            name,
            value
          ) =>
            onFilterChangeAction(
              name,
              value
            )
          }
        />

        <DateRangeFilter
          label="End Date"
          name="endDate"
          value={endDate}
          onChangeAction={(
            name,
            value
          ) =>
            onFilterChangeAction(
              name,
              value
            )
          }
        />

        <div className="space-y-1.5">
          <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
            Category
          </label>

          <CustomSelect
            name="category"
            value={category}
            open={
              openFilter ===
              "category"
            }
            onOpenChangeAction={(
              open
            ) =>
              setOpenFilter(
                open
                  ? "category"
                  : null
              )
            }
            options={
              categoryOptions
            }
            onChangeAction={
              onFilterChangeAction
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
            Transaction Type
          </label>

          <CustomSelect
            name="transactionType"
            value={
              transactionType
            }
            open={
              openFilter ===
              "transactionType"
            }
            onOpenChangeAction={(
              open
            ) =>
              setOpenFilter(
                open
                  ? "transactionType"
                  : null
              )
            }
            options={[
              {
                label:
                  "All Types",
                value: "all",
              },
              {
                label: "Income",
                value: "income",
              },
              {
                label: "Expense",
                value: "expense",
              },
              {
                label: "Transfer",
                value: "transfer",
              },
            ]}
            onChangeAction={
              onFilterChangeAction
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
            Status
          </label>

          <CustomSelect
            name="statusFilter"
            value={
              statusFilter
            }
            open={
              openFilter ===
              "statusFilter"
            }
            onOpenChangeAction={(
              open
            ) =>
              setOpenFilter(
                open
                  ? "statusFilter"
                  : null
              )
            }
            options={[
              {
                label:
                  "All Status",
                value: "all",
              },
              {
                label:
                  "AI Verified",
                value:
                  "AI Verified",
              },
              {
                label:
                  "Rule Verified",
                value:
                  "Rule Verified",
              },
              {
                label:
                  "User Verified",
                value:
                  "User Verified",
              },
              {
                label:
                  "AI Review Needed",
                value:
                  "AI Review Needed",
              },
            ]}
            onChangeAction={
              onFilterChangeAction
            }
          />
        </div>
      </div>
    </div>
  );
}