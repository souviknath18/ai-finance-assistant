"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  Sparkles,
  X,
} from "lucide-react";

import {
  DetectedSubscription,
  DuplicateSubscriptionGroup,
} from "@/types/subscription";

type ReviewServicesModalProps = {
  open: boolean;
  duplicate: DuplicateSubscriptionGroup | null;
  subscriptions: DetectedSubscription[];
  onCloseAction: () => void;
};

export default function ReviewServicesModal({
  open,
  duplicate,
  subscriptions,
  onCloseAction,
}: ReviewServicesModalProps) {
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

  if (!open || !duplicate) {
    return null;
  }

  const matchedSubscriptions =
    subscriptions.filter(
      (subscription) =>
        duplicate.services.some(
          (service) =>
            service.toLowerCase() ===
            subscription.merchant.toLowerCase()
        )
    );

  const monthlyTotal =
    matchedSubscriptions.reduce(
      (total, item) =>
        total +
        Number(
          item.average_amount || 0
        ),
      0
    );

  const cheapest = [
    ...matchedSubscriptions,
  ].sort(
    (a, b) =>
      Number(
        a.average_amount || 0
      ) -
      Number(
        b.average_amount || 0
      )
  )[0];

  const potentialSavings =
    matchedSubscriptions
      .filter(
        (item) =>
          item.merchant !==
          cheapest?.merchant
      )
      .reduce(
        (total, item) =>
          total +
          Number(
            item.average_amount ||
              0
          ),
        0
      );

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
                <AlertTriangle
                  size={17}
                />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-black">
                  Review Similar Services
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Aura found overlapping
                  subscriptions in{" "}
                  <span className="font-bold text-black">
                    {duplicate.group}
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseAction}
              aria-label="Close review services modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Summary */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoBox
                label="Similar Services"
                value={`${duplicate.count}`}
              />

              <InfoBox
                label="Monthly Spend"
                value={`₹${monthlyTotal.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
              />

              <InfoBox
                label="Potential Savings"
                value={`₹${potentialSavings.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`}
                highlight
              />
            </div>

            {/* Aura Recommendation */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                  <Sparkles
                    size={15}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Aura Recommendation
                  </p>

                  <p className="mt-1.5 text-[12px] leading-6 text-[#565e74]">
                    You have{" "}
                    <strong className="text-black">
                      {
                        duplicate.count
                      }
                    </strong>{" "}
                    similar services:{" "}
                    <strong className="text-black">
                      {duplicate.services.join(
                        ", "
                      )}
                    </strong>
                    . Review whether all
                    of them are still
                    useful. Keeping only
                    the most valuable
                    service could reduce
                    recurring spend by
                    approximately{" "}
                    <strong className="text-emerald-700">
                      ₹
                      {potentialSavings.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                      /month
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Services heading */}
            <div className="mb-3 mt-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[14px] font-bold text-black">
                  Detected Services
                </h3>

                <p className="mt-0.5 text-[11px] text-[#7c839b]">
                  Compare recurring cost
                  before deciding what to
                  keep.
                </p>
              </div>

              {matchedSubscriptions.length >
                0 && (
                <span className="rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold text-[#565e74]">
                  {
                    matchedSubscriptions.length
                  }{" "}
                  matched
                </span>
              )}
            </div>

            {/* Services */}
            <div className="space-y-3">
              {matchedSubscriptions.length ===
              0 ? (
                <div className="rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600">
                    <AlertTriangle
                      size={16}
                    />
                  </div>

                  <p className="mt-3 text-[13px] font-bold text-black">
                    No matching
                    subscriptions found
                  </p>

                  <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-5 text-[#565e74]">
                    Aura detected a
                    duplicate group, but
                    the matching active
                    services are not
                    currently available
                    in this list.
                  </p>
                </div>
              ) : (
                matchedSubscriptions.map(
                  (subscription) => {
                    const isCheapest =
                      subscription.merchant ===
                      cheapest?.merchant;

                    const monthlyAmount =
                      Number(
                        subscription.average_amount ||
                          0
                      );

                    return (
                      <ServiceCard
                        key={
                          subscription.subscription_id ||
                          subscription.merchant
                        }
                        subscription={
                          subscription
                        }
                        monthlyAmount={
                          monthlyAmount
                        }
                        isCheapest={
                          isCheapest
                        }
                      />
                    );
                  }
                )
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={
                  onCloseAction
                }
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  subscription,
  monthlyAmount,
  isCheapest,
}: {
  subscription: DetectedSubscription;
  monthlyAmount: number;
  isCheapest: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e6edf9] bg-white p-4 shadow-[0_3px_12px_rgba(15,23,42,0.035)] transition-[border-color,box-shadow,background-color] duration-200 hover:border-[#dbe5f5] hover:bg-[#fbfcff] hover:shadow-[0_5px_16px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-[14px] font-bold ${
              subscription.preference_status ===
              "cancel_candidate"
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}
          >
            {subscription.merchant
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-[14px] font-bold text-black">
                {
                  subscription.merchant
                }
              </h3>

              {isCheapest && (
                <StatusBadge
                  label="Lowest Cost"
                  type="green"
                />
              )}

              {subscription.preference_status ===
                "confirmed" && (
                <StatusBadge
                  label="Confirmed"
                  type="default"
                />
              )}

              {subscription.preference_status ===
                "cancel_candidate" && (
                <StatusBadge
                  label="Not Needed"
                  type="red"
                />
              )}
            </div>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              {
                subscription.transactions_count
              }{" "}
              detected payment
              {subscription.transactions_count !==
              1
                ? "s"
                : ""}
              {" • "}
              Last paid{" "}
              {subscription.last_payment_date
                ? formatDate(
                    subscription.last_payment_date
                  )
                : "not available"}
            </p>
          </div>
        </div>

        {/* Cost */}
        <div className="shrink-0 sm:text-right">
          <p className="text-[15px] font-bold text-black">
            ₹
            {monthlyAmount.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
            /mo
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#7c839b]">
            ₹
            {(
              monthlyAmount * 12
            ).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
            /yr
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-3.5 ${
        highlight
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-[#edf2fb] bg-[#fbfcff]"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.1em] ${
          highlight
            ? "text-emerald-700"
            : "text-[#7c839b]"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-[16px] font-bold tracking-tight ${
          highlight
            ? "text-emerald-700"
            : "text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  label,
  type,
}: {
  label: string;
  type:
    | "green"
    | "red"
    | "default";
}) {
  const styles =
    type === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : type === "red"
      ? "border-red-100 bg-red-50 text-red-600"
      : "border-[#e6edf9] bg-[#f3f6fc] text-[#565e74]";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold ${styles}`}
    >
      {label}
    </span>
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