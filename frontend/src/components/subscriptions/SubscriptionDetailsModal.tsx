"use client";

import { useEffect } from "react";
import { X, CalendarDays, CreditCard, Repeat, Tag, Sparkles } from "lucide-react";
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
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-5 border-b border-[#eef2ff] bg-white px-6 pb-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-lg font-black text-black">
                {subscription.merchant.charAt(0)}
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-black">
                  {subscription.merchant}
                </h2>
                <p className="mt-2 text-sm text-[#565e74]">
                  Subscription details and billing summary.
                </p>
              </div>
            </div>

            <button
              onClick={onCloseAction}
              className="rounded-xl p-2 text-[#565e74] hover:bg-[#eff4ff] hover:text-black"
            >
              <X size={20} />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox icon={<CreditCard size={18} />} label="Monthly Cost" value={`₹${monthly.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
              <InfoBox icon={<Repeat size={18} />} label="Yearly Forecast" value={`₹${yearly.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`} />
              <InfoBox icon={<CalendarDays size={18} />} label="Last Payment" value={lastPayment} />
              <InfoBox icon={<CalendarDays size={18} />} label="Next Billing" value={nextBilling} />
              <InfoBox icon={<Tag size={18} />} label="Category" value={subscription.category || "Unknown"} />
              <InfoBox icon={<Sparkles size={18} />} label="Source" value={subscription.source} />
            </div>
          </div>

          <div className="border-t border-[#eef2ff] bg-white px-6 py-5">
            <button
              onClick={onCloseAction}
              className="w-full rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:opacity-90"
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
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-[#565e74]">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold capitalize text-black">{value}</p>
    </div>
  );
}