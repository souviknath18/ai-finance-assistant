"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Filter,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import {
  SubscriptionBillingCycle,
  SubscriptionPreferenceStatus,
  SubscriptionSource,
} from "@/types/subscription";

export type SubscriptionFilters = {
  category: string;
  source: "all" | SubscriptionSource;
  preference_status: "all" | SubscriptionPreferenceStatus;
  billing_cycle: "all" | SubscriptionBillingCycle;
  max_amount: number;
};

type SubscriptionFilterModalProps = {
  open: boolean;
  filters: SubscriptionFilters;
  onCloseAction: () => void;
  onApplyAction: (filters: SubscriptionFilters) => void;
  onClearAction: () => void;
};

const categories = [
  "All",
  "Entertainment",
  "Software",
  "Cloud",
  "AI Tools",
  "Shopping",
  "Utilities",
  "Other",
];

const defaultFilters: SubscriptionFilters = {
  category: "All",
  source: "all",
  preference_status: "all",
  billing_cycle: "all",
  max_amount: 10000,
};

export default function SubscriptionFilterModal({
  open,
  filters,
  onCloseAction,
  onApplyAction,
  onClearAction,
}: SubscriptionFilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<SubscriptionFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const updateFilter = <K extends keyof SubscriptionFilters>(
    key: K,
    value: SubscriptionFilters[K]
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClear = () => {
    setLocalFilters(defaultFilters);
    onClearAction();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-black">
                <Filter size={18} />
              </div>

              <div>
                <h2 className="text-xl font-bold leading-tight text-black">
                  Filter Subscriptions
                </h2>

                <p className="mt-1 text-[13px] text-[#565e74]">
                  Narrow services by category, source, status, billing cycle,
                  and amount.
                </p>
              </div>
            </div>

            <button
              onClick={onCloseAction}
              className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
            >
              <X size={17} />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-5">
              <section>
                <SectionTitle>Category</SectionTitle>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = localFilters.category === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => updateFilter("category", category)}
                        className={`rounded-full border px-3.5 py-2 text-[13px] font-bold transition-all duration-200 ${
                          active
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-[#c6c6cd] bg-white text-[#565e74] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <SectionTitle>Source</SectionTitle>

                <div className="grid grid-cols-3 gap-2.5">
                  <OptionBox
                    active={localFilters.source === "all"}
                    label="All"
                    onClick={() => updateFilter("source", "all")}
                  />

                  <OptionBox
                    active={localFilters.source === "detected"}
                    label="Detected"
                    onClick={() => updateFilter("source", "detected")}
                  />

                  <OptionBox
                    active={localFilters.source === "manual"}
                    label="Manual"
                    onClick={() => updateFilter("source", "manual")}
                  />
                </div>
              </section>

              <section>
                <SectionTitle>Tracking Status</SectionTitle>

                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  <OptionBox
                    active={localFilters.preference_status === "all"}
                    label="All"
                    onClick={() => updateFilter("preference_status", "all")}
                  />

                  <OptionBox
                    active={localFilters.preference_status === "active"}
                    label="Active"
                    onClick={() =>
                      updateFilter("preference_status", "active")
                    }
                  />

                  <OptionBox
                    active={localFilters.preference_status === "confirmed"}
                    label="Confirmed"
                    onClick={() =>
                      updateFilter("preference_status", "confirmed")
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.preference_status === "cancel_candidate"
                    }
                    label="Not Needed"
                    onClick={() =>
                      updateFilter(
                        "preference_status",
                        "cancel_candidate"
                      )
                    }
                  />
                </div>
              </section>

              <section>
                <SectionTitle>Billing Cycle</SectionTitle>

                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
                  <OptionBox
                    active={localFilters.billing_cycle === "all"}
                    label="All"
                    onClick={() => updateFilter("billing_cycle", "all")}
                  />

                  <OptionBox
                    active={localFilters.billing_cycle === "weekly"}
                    label="Weekly"
                    onClick={() => updateFilter("billing_cycle", "weekly")}
                  />

                  <OptionBox
                    active={localFilters.billing_cycle === "monthly"}
                    label="Monthly"
                    onClick={() => updateFilter("billing_cycle", "monthly")}
                  />

                  <OptionBox
                    active={localFilters.billing_cycle === "yearly"}
                    label="Yearly"
                    onClick={() => updateFilter("billing_cycle", "yearly")}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Sparkles size={16} />

                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      Amount Range
                    </span>
                  </div>

                  <span className="text-[13px] font-bold text-black">
                    Up to ₹
                    {localFilters.max_amount.toLocaleString("en-IN")}
                    /mo
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={localFilters.max_amount}
                  onChange={(event) =>
                    updateFilter(
                      "max_amount",
                      Number(event.target.value)
                    )
                  }
                  className="w-full accent-emerald-600"
                />

                <div className="mt-2 flex justify-between text-[11px] font-semibold text-[#565e74]">
                  <span>₹0</span>
                  <span>₹10,000+</span>
                </div>
              </section>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2.5 border-t border-[#eef2ff] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <RotateCcw size={15} />
              Clear All
            </button>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onCloseAction}
                className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onApplyAction(localFilters);
                  onCloseAction();
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
              >
                <CheckCircle2 size={15} />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#7c839b]">
      {children}
    </p>
  );
}

function OptionBox({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-3 text-[13px] font-bold transition-all duration-200 ${
        active
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
          : "border-[#c6c6cd] bg-white text-[#565e74] hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
      }`}
    >
      <div
        className={`absolute inset-0 opacity-0 transition duration-300 ${
          active
            ? "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_70%)] opacity-100"
            : "group-hover:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.10),transparent_70%)] group-hover:opacity-100"
        }`}
      />

      <span className="relative z-10">{label}</span>
    </button>
  );
}