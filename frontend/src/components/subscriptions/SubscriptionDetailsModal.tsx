"use client";

import { useEffect } from "react";
import {
  X,
  CalendarDays,
  CreditCard,
  Repeat,
  Tag,
  Sparkles,
} from "lucide-react";

import { DetectedSubscription } from "@/types/subscription";

type SubscriptionDetailsModalProps = {
  open: boolean;
  subscription: DetectedSubscription | null;
  onCloseAction: () => void;
};

export default function SubscriptionDetailsModal({
  open,
  subscription,
  onCloseAction,
}: SubscriptionDetailsModalProps) {
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

  if (!open || !subscription) {
    return null;
  }

  const monthly =
    Number(
      subscription.average_amount || 0
    );

  const yearly =
    monthly * 12;

  const lastPayment =
    subscription.last_payment_date
      ? formatDate(
          subscription.last_payment_date
        )
      : "No payment yet";

  const nextBilling =
    subscription.next_billing_date
      ? formatDate(
          subscription.next_billing_date
        )
      : "Not available";

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-[15px] font-bold text-emerald-700">
                {subscription.merchant
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-black">
                  {subscription.merchant}
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Subscription details and billing summary.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseAction}
              aria-label="Close subscription details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Status summary */}
            <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Tracking Status
                  </p>

                  <p className="mt-1 text-[14px] font-bold capitalize text-black">
                    {formatStatus(
                      subscription.preference_status
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                    Aura Tracking Active
                  </span>
                </div>
              </div>
            </div>

            {/* Main information */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoBox
                icon={
                  <CreditCard size={15} />
                }
                label="Monthly Cost"
                value={`₹${monthly.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />

              <InfoBox
                icon={<Repeat size={15} />}
                label="Yearly Forecast"
                value={`₹${yearly.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />

              <InfoBox
                icon={
                  <CalendarDays size={15} />
                }
                label="Last Payment"
                value={lastPayment}
              />

              <InfoBox
                icon={
                  <CalendarDays size={15} />
                }
                label="Next Billing"
                value={nextBilling}
              />

              <InfoBox
                icon={<Tag size={15} />}
                label="Category"
                value={
                  subscription.category ||
                  "Unknown"
                }
              />

              <InfoBox
                icon={
                  <Sparkles size={15} />
                }
                label="Source"
                value={
                  subscription.source ||
                  "Unknown"
                }
              />
            </div>

            {/* Extra details */}
            <div className="mt-5 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                Detection Summary
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <MiniMetric
                  label="Recurring Payments"
                  value={String(
                    subscription.transactions_count
                  )}
                />

                <MiniMetric
                  label="Billing Cycle"
                  value={formatStatus(
                    subscription.billing_cycle
                  )}
                />

                <MiniMetric
                  label="Subscription Status"
                  value={formatStatus(
                    subscription.status
                  )}
                />

                <MiniMetric
                  label="Last Amount"
                  value={`₹${Number(
                    subscription.last_amount || 0
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCloseAction}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          {label}
        </span>
      </div>

      <p className="break-words text-[13px] font-bold capitalize text-black">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#8a92a5]">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-bold capitalize text-black">
        {value}
      </p>
    </div>
  );
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatStatus(
  value: string
) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}