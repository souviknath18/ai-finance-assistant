"use client";

import { useState, useEffect } from "react";
import { updateSubscriptionPreference } from "@/lib/api/subscriptionApi";
import { X, CalendarDays, CreditCard, Repeat, Sparkles } from "lucide-react";
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
  const [saving, setSaving] = useState(false);

  const handlePreferenceUpdate = async (
    status: "confirmed" | "cancel_candidate"
  ) => {
    if (!subscription) return;

    setSaving(true);

    try {
      await updateSubscriptionPreference({
        subscription_id: subscription.subscription_id,
        status,
        note:
          status === "confirmed"
            ? "User confirmed this subscription should continue being tracked."
            : "User marked this subscription as not needed.",
      });

      onPreferenceUpdatedAction();
      onCloseAction();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !subscription) return null;

  const monthlyAmount = Number(subscription.average_amount);
  const yearlyAmount = monthlyAmount * 12;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-base font-black text-black">
                {subscription.merchant.charAt(0)}
              </div>

              <div>
                <h2 className="text-xl font-bold leading-tight text-black">
                  {subscription.merchant}
                </h2>

                <p className="mt-1 text-[13px] text-[#565e74]">
                  Detected recurring subscription
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
              <InfoBox
                icon={<CreditCard size={16} />}
                label="Monthly Cost"
                value={`₹${monthlyAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              />

              <InfoBox
                icon={<Repeat size={16} />}
                label="Yearly Forecast"
                value={`₹${yearlyAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}`}
              />

              <InfoBox
                icon={<CalendarDays size={16} />}
                label="Last Payment"
                value={
                  subscription.last_payment_date
                    ? new Date(subscription.last_payment_date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "No payment yet"
                }
              />
            </div>

            <div className="mb-4 rounded-2xl bg-[#eff4ff] p-4">
              <div className="mb-2.5 flex items-center gap-2 text-emerald-700">
                <Sparkles size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aura Analysis
                </span>
              </div>

              <p className="text-[13px] leading-6 text-[#565e74]">
                Aura detected this service from{" "}
                <strong className="text-black">
                  {subscription.transactions_count}
                </strong>{" "}
                transaction
                {subscription.transactions_count !== 1 ? "s" : ""}. The average
                recurring amount is{" "}
                <strong className="text-black">
                  ₹
                  {monthlyAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                . Review whether this service is still useful, especially if you
                have similar subscriptions.
              </p>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <DetailRow label="Category" value={subscription.category || "Unknown"} />
              <DetailRow label="Status" value={subscription.status.replace("_", " ")} />
              <DetailRow
                label="Last Amount"
                value={`₹${Number(subscription.last_amount).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
              />
              <DetailRow
                label="Detection Confidence"
                value={
                  subscription.status === "recurring"
                    ? "High"
                    : "Needs more transactions"
                }
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-2.5 border-t border-[#eef2ff] bg-white px-5 py-4 sm:flex-row sm:justify-end">
            <button
              onClick={onCloseAction}
              className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
            >
              Close
            </button>

            <button
              disabled={saving}
              onClick={() => handlePreferenceUpdate("cancel_candidate")}
              className="rounded-xl border border-red-200 px-4 py-2.5 text-[13px] font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Mark as Not Needed"}
            </button>

            <button
              disabled={saving}
              onClick={() => handlePreferenceUpdate("confirmed")}
              className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Keep Tracking"}
            </button>
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
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-3.5">
      <div className="mb-2.5 flex items-center gap-2 text-[#565e74]">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="text-[15px] font-bold text-black">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] p-3.5">
      <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </p>
      <p className="text-[13px] font-bold capitalize text-black">{value}</p>
    </div>
  );
}