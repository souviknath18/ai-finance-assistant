"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  CreditCard,
  Repeat,
  Sparkles,
  X,
} from "lucide-react";

import { updateSubscriptionPreference } from "@/lib/api/subscriptionApi";
import { DetectedSubscription } from "@/types/subscription";

type ReviewSubscriptionModalProps = {
  open: boolean;
  subscription: DetectedSubscription | null;
  onCloseAction: () => void;
  onPreferenceUpdatedAction: () => void;
};

export default function ReviewSubscriptionModal({
  open,
  subscription,
  onCloseAction,
  onPreferenceUpdatedAction,
}: ReviewSubscriptionModalProps) {
  const [saving, setSaving] =
    useState(false);

  const [apiError, setApiError] =
    useState("");

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

  const handleClose = () => {
    if (saving) return;

    setApiError("");
    onCloseAction();
  };

  const handlePreferenceUpdate =
    async (
      status:
        | "confirmed"
        | "cancel_candidate"
    ) => {
      setSaving(true);
      setApiError("");

      try {
        await updateSubscriptionPreference({
          subscription_id:
            subscription.subscription_id,

          status,

          note:
            status === "confirmed"
              ? "User confirmed this subscription should continue being tracked."
              : "User marked this subscription as not needed.",
        });

        onPreferenceUpdatedAction();
        onCloseAction();
      } catch (error: any) {
        setApiError(
          error?.detail ||
            error
              ?.non_field_errors?.[0] ||
            "Failed to update subscription preference."
        );
      } finally {
        setSaving(false);
      }
    };

  const monthlyAmount =
    Number(
      subscription.average_amount || 0
    );

  const yearlyAmount =
    monthlyAmount * 12;

  const lastAmount =
    Number(
      subscription.last_amount || 0
    );

  const lastPayment =
    subscription.last_payment_date
      ? formatDate(
          subscription.last_payment_date
        )
      : "No payment yet";

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
                  Review this detected recurring subscription.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              aria-label="Close review subscription modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Error */}
            {apiError && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-[12px] font-semibold text-red-600">
                  {apiError}
                </p>
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoBox
                icon={
                  <CreditCard size={15} />
                }
                label="Monthly Cost"
                value={`₹${monthlyAmount.toLocaleString(
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
                value={`₹${yearlyAmount.toLocaleString(
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
            </div>

            {/* Aura Analysis */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                  <Sparkles size={15} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Aura Analysis
                  </p>

                  <p className="mt-1.5 text-[12px] leading-6 text-[#565e74]">
                    Aura detected this service
                    from{" "}
                    <strong className="text-black">
                      {
                        subscription.transactions_count
                      }
                    </strong>{" "}
                    transaction
                    {subscription.transactions_count !==
                    1
                      ? "s"
                      : ""}
                    . The average recurring
                    amount is{" "}
                    <strong className="text-black">
                      ₹
                      {monthlyAmount.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>
                    . Review whether this
                    service is still useful,
                    especially if you have
                    similar subscriptions.
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow
                label="Category"
                value={
                  subscription.category ||
                  "Unknown"
                }
              />

              <DetailRow
                label="Status"
                value={formatStatus(
                  subscription.status
                )}
              />

              <DetailRow
                label="Last Amount"
                value={`₹${lastAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />

              <DetailRow
                label="Detection Confidence"
                value={
                  subscription.status ===
                  "recurring"
                    ? "High"
                    : "Needs more transactions"
                }
              />

              <DetailRow
                label="Billing Cycle"
                value={formatStatus(
                  subscription.billing_cycle
                )}
              />

              <DetailRow
                label="Source"
                value={formatStatus(
                  subscription.source
                )}
              />
            </div>

            {/* Current preference */}
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
                  Current Preference
                </p>

                <p className="mt-1 text-[13px] font-bold capitalize text-black">
                  {formatStatus(
                    subscription.preference_status
                  )}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${getPreferenceStyles(
                  subscription.preference_status
                )}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${getPreferenceDot(
                    subscription.preference_status
                  )}`}
                />

                {formatStatus(
                  subscription.preference_status
                )}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#d8e2f0] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  handlePreferenceUpdate(
                    "cancel_candidate"
                  )
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-[12px] font-bold text-red-600 transition-[background-color,border-color,box-shadow] duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Mark as Not Needed"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  handlePreferenceUpdate(
                    "confirmed"
                  )
                }
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Keep Tracking"}
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
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
          {label}
        </span>
      </div>

      <p className="break-words text-[13px] font-bold text-black">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
        {label}
      </p>

      <p className="mt-1.5 break-words text-[12px] font-bold capitalize text-black">
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

function getPreferenceStyles(
  status: DetectedSubscription["preference_status"]
) {
  if (
    status === "cancel_candidate"
  ) {
    return "border-red-100 bg-red-50 text-red-600";
  }

  if (status === "confirmed") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (status === "ignored") {
    return "border-[#e6edf9] bg-[#f3f6fc] text-[#565e74]";
  }

  return "border-emerald-100 bg-emerald-50 text-emerald-700";
}

function getPreferenceDot(
  status: DetectedSubscription["preference_status"]
) {
  if (
    status === "cancel_candidate"
  ) {
    return "bg-red-500";
  }

  if (status === "ignored") {
    return "bg-[#9aa2b4]";
  }

  return "bg-emerald-500";
}