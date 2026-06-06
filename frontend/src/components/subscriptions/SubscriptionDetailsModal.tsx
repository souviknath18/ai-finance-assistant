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

type Props = {
  open: boolean;
  subscription: DetectedSubscription | null;
  onCloseAction: () => void;
};

export default function SubscriptionDetailsModal({
  open,
  subscription,
  onCloseAction,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [open]);

  if (!open || !subscription) return null;

  const monthly = Number(subscription.average_amount || 0);
  const yearly = monthly * 12;

  const lastPayment = subscription.last_payment_date
    ? new Date(subscription.last_payment_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No payment yet";

  const nextBilling = subscription.next_billing_date
    ? new Date(subscription.next_billing_date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90dvh] flex-col">
          <div className="shrink-0 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-base font-black text-emerald-700">
                  {subscription.merchant.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold leading-tight text-black">
                    {subscription.merchant}
                  </h2>

                  <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
                    Subscription details and billing summary.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseAction}
                className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoBox
                icon={<CreditCard size={16} />}
                label="Monthly Cost"
                value={`₹${monthly.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />

              <InfoBox
                icon={<Repeat size={16} />}
                label="Yearly Forecast"
                value={`₹${yearly.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
              />

              <InfoBox
                icon={<CalendarDays size={16} />}
                label="Last Payment"
                value={lastPayment}
              />

              <InfoBox
                icon={<CalendarDays size={16} />}
                label="Next Billing"
                value={nextBilling}
              />

              <InfoBox
                icon={<Tag size={16} />}
                label="Category"
                value={subscription.category || "Unknown"}
              />

              <InfoBox
                icon={<Sparkles size={16} />}
                label="Source"
                value={subscription.source || "Unknown"}
              />
            </div>
          </div>

          <div className="shrink-0 border-t border-[#eef2ff] bg-white px-5 py-4">
            <button
              type="button"
              onClick={onCloseAction}
              className="w-full rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]"
            >
              Done
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
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-3.5 transition hover:bg-[#f8f9ff]">
      <div className="mb-2.5 flex items-center gap-2 text-emerald-700">
        {icon}

        <span className="text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
          {label}
        </span>
      </div>

      <p className="break-words text-[13px] font-bold capitalize text-black">
        {value}
      </p>
    </div>
  );
}