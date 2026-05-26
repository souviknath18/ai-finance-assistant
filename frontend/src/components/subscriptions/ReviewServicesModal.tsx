"use client";

import { useEffect } from "react";
import { X, AlertTriangle, Sparkles } from "lucide-react";
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
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !duplicate) return null;

  const matchedSubscriptions = subscriptions.filter((subscription) =>
    duplicate.services.some(
      (service) =>
        service.toLowerCase() === subscription.merchant.toLowerCase()
    )
  );

  const monthlyTotal = matchedSubscriptions.reduce(
    (total, item) => total + Number(item.average_amount),
    0
  );

  const cheapest = [...matchedSubscriptions].sort(
    (a, b) => Number(a.average_amount) - Number(b.average_amount)
  )[0];

  const potentialSavings = matchedSubscriptions
    .filter((item) => item.merchant !== cheapest?.merchant)
    .reduce((total, item) => total + Number(item.average_amount), 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-red-50 p-2.5 text-red-600">
                <AlertTriangle size={18} />
              </div>

              <div>
                <h2 className="text-xl font-bold leading-tight text-black">
                  Review Similar Services
                </h2>

                <p className="mt-1 text-[13px] text-[#565e74]">
                  Aura found overlapping subscriptions in {duplicate.group}.
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
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <InfoBox label="Similar Services" value={`${duplicate.count}`} />

              <InfoBox
                label="Monthly Spend"
                value={`₹${monthlyTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              />

              <InfoBox
                label="Potential Savings"
                value={`₹${potentialSavings.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
                highlight
              />
            </div>

            <div className="mb-4 rounded-2xl bg-[#eff4ff] p-4">
              <div className="mb-2.5 flex items-center gap-2 text-emerald-700">
                <Sparkles size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aura Recommendation
                </span>
              </div>

              <p className="text-[13px] leading-6 text-[#565e74]">
                You have {duplicate.count} similar services:{" "}
                <strong className="text-black">
                  {duplicate.services.join(", ")}
                </strong>
                . Review whether all of them are still useful. Keeping only the
                most valuable service could reduce recurring spend by
                approximately{" "}
                <strong className="text-black">
                  ₹
                  {potentialSavings.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                  /month
                </strong>
                .
              </p>
            </div>

            <div className="space-y-3">
              {matchedSubscriptions.map((subscription) => {
                const isCheapest =
                  subscription.merchant === cheapest?.merchant;

                return (
                  <div
                    key={subscription.merchant}
                    className="rounded-2xl border border-[#e5eeff] bg-white p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-base font-black text-black">
                          {subscription.merchant.charAt(0)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[15px] font-bold text-black">
                              {subscription.merchant}
                            </h3>

                            {isCheapest && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                Lowest Cost
                              </span>
                            )}

                            {subscription.preference_status ===
                              "confirmed" && (
                              <span className="rounded-full bg-[#dce9ff] px-2.5 py-1 text-[11px] font-bold text-black">
                                Confirmed
                              </span>
                            )}

                            {subscription.preference_status ===
                              "cancel_candidate" && (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                                Not Needed
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-[13px] text-[#565e74]">
                            {subscription.transactions_count} detected payment
                            {subscription.transactions_count !== 1 ? "s" : ""}{" "}
                            • Last paid on{" "}
                            {subscription.last_payment_date
                              ? new Date(
                                  subscription.last_payment_date
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "No payment yet"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-base font-bold text-black">
                          ₹
                          {Number(subscription.average_amount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                          /mo
                        </p>

                        <p className="text-[11px] font-semibold text-[#7c839b]">
                          ₹
                          {(
                            Number(subscription.average_amount) * 12
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                          /yr
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-2.5 border-t border-[#eef2ff] bg-white px-5 py-4 sm:flex-row sm:justify-end">
            <button
              onClick={onCloseAction}
              className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
            >
              Close
            </button>

            <button className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
              Keep Reviewing
            </button>
          </div>
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
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-3.5">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </p>

      <p
        className={`text-lg font-bold ${
          highlight ? "text-emerald-700" : "text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}