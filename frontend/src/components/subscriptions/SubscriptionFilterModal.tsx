"use client";

import { useEffect, useState } from "react";
import {
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
  preference_status:
    | "all"
    | SubscriptionPreferenceStatus;
  billing_cycle:
    | "all"
    | SubscriptionBillingCycle;
  max_amount: number;
};

type SubscriptionFilterModalProps = {
  open: boolean;
  filters: SubscriptionFilters;
  onCloseAction: () => void;
  onApplyAction: (
    filters: SubscriptionFilters
  ) => void;
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
  const [
    localFilters,
    setLocalFilters,
  ] =
    useState<SubscriptionFilters>(
      filters
    );

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [filters, open]);

  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        originalBodyOverflow;

      document.documentElement.style.overflow =
        originalHtmlOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const updateFilter = <
    K extends keyof SubscriptionFilters,
  >(
    key: K,
    value: SubscriptionFilters[K]
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setLocalFilters(filters);
    onCloseAction();
  };

  const handleClear = () => {
    setLocalFilters(
      defaultFilters
    );

    onClearAction();
  };

  const handleApply = () => {
    onApplyAction(
      localFilters
    );

    onCloseAction();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Filter size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black">
                  Filter Subscriptions
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Narrow services by
                  category, source, status,
                  billing cycle, and amount.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleClose
              }
              aria-label="Close subscription filters"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-5">
              {/* Category */}
              <section>
                <SectionTitle>
                  Category
                </SectionTitle>

                <div className="flex flex-wrap gap-2">
                  {categories.map(
                    (category) => {
                      const active =
                        localFilters.category ===
                        category;

                      return (
                        <button
                          key={
                            category
                          }
                          type="button"
                          onClick={() =>
                            updateFilter(
                              "category",
                              category
                            )
                          }
                          className={`rounded-full border px-3.5 py-2 text-[11px] font-bold transition-[background-color,border-color,color,box-shadow] duration-200 ${
                            active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
                              : "border-[#e6edf9] bg-white text-[#565e74] hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    }
                  )}
                </div>
              </section>

              {/* Source */}
              <section>
                <SectionTitle>
                  Source
                </SectionTitle>

                <div className="grid grid-cols-3 gap-2.5">
                  <OptionBox
                    active={
                      localFilters.source ===
                      "all"
                    }
                    label="All"
                    onClick={() =>
                      updateFilter(
                        "source",
                        "all"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.source ===
                      "detected"
                    }
                    label="Detected"
                    onClick={() =>
                      updateFilter(
                        "source",
                        "detected"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.source ===
                      "manual"
                    }
                    label="Manual"
                    onClick={() =>
                      updateFilter(
                        "source",
                        "manual"
                      )
                    }
                  />
                </div>
              </section>

              {/* Tracking Status */}
              <section>
                <SectionTitle>
                  Tracking Status
                </SectionTitle>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <OptionBox
                    active={
                      localFilters.preference_status ===
                      "all"
                    }
                    label="All"
                    onClick={() =>
                      updateFilter(
                        "preference_status",
                        "all"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.preference_status ===
                      "active"
                    }
                    label="Active"
                    onClick={() =>
                      updateFilter(
                        "preference_status",
                        "active"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.preference_status ===
                      "confirmed"
                    }
                    label="Confirmed"
                    onClick={() =>
                      updateFilter(
                        "preference_status",
                        "confirmed"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.preference_status ===
                      "cancel_candidate"
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

              {/* Billing Cycle */}
              <section>
                <SectionTitle>
                  Billing Cycle
                </SectionTitle>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <OptionBox
                    active={
                      localFilters.billing_cycle ===
                      "all"
                    }
                    label="All"
                    onClick={() =>
                      updateFilter(
                        "billing_cycle",
                        "all"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.billing_cycle ===
                      "weekly"
                    }
                    label="Weekly"
                    onClick={() =>
                      updateFilter(
                        "billing_cycle",
                        "weekly"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.billing_cycle ===
                      "monthly"
                    }
                    label="Monthly"
                    onClick={() =>
                      updateFilter(
                        "billing_cycle",
                        "monthly"
                      )
                    }
                  />

                  <OptionBox
                    active={
                      localFilters.billing_cycle ===
                      "yearly"
                    }
                    label="Yearly"
                    onClick={() =>
                      updateFilter(
                        "billing_cycle",
                        "yearly"
                      )
                    }
                  />
                </div>
              </section>

              {/* Amount Range */}
              <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                      <Sparkles
                        size={15}
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                        Amount Range
                      </p>

                      <p className="mt-1 text-[11px] text-[#565e74]">
                        Maximum monthly
                        recurring amount.
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-[11px] font-bold text-black">
                    Up to ₹
                    {localFilters.max_amount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={
                    localFilters.max_amount
                  }
                  onChange={(
                    event
                  ) =>
                    updateFilter(
                      "max_amount",
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="h-1.5 w-full cursor-pointer accent-emerald-700"
                />

                <div className="mt-2 flex justify-between text-[10px] font-medium text-[#7c839b]">
                  <span>
                    ₹0
                  </span>

                  <span>
                    ₹10,000+
                  </span>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={
                  handleClear
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-[#565e74] transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-[#d8e2f0] hover:bg-[#f8faff] hover:text-black hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
              >
                <RotateCcw
                  size={14}
                />

                Clear Filters
              </button>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={
                    handleClose
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color] duration-200 hover:border-[#d8e2f0] hover:bg-[#f8faff]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleApply
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
                >
                  Apply Filters
                </button>
              </div>
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
    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
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
      className={`h-10 rounded-xl border px-3 text-[11px] font-bold transition-[background-color,border-color,color,box-shadow] duration-200 ${
        active
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
          : "border-[#e6edf9] bg-white text-[#565e74] hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
      }`}
    >
      {label}
    </button>
  );
}