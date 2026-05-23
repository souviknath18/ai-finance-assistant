"use client";

import { useEffect, useState } from "react";
import { X, Settings, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { DetectedSubscription } from "@/types/subscription";
import { updateSubscriptionPreference } from "@/lib/api/subscriptionApi";

type Props = {
  open: boolean;
  subscription: DetectedSubscription | null;
  onCloseAction: () => void;
  onUpdatedAction: () => void;
};

export default function ManageSubscriptionModal({
  open,
  subscription,
  onCloseAction,
  onUpdatedAction,
}: Props) {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !subscription) return null;

  const updatePreference = async (
    status: "confirmed" | "cancel_candidate" | "ignored"
  ) => {
    setSaving(true);

    try {
      await updateSubscriptionPreference({
        subscription_id: subscription.subscription_id,
        status,
        note:
          status === "confirmed"
            ? "User confirmed this subscription."
            : status === "cancel_candidate"
            ? "User marked this subscription as not needed."
            : "User ignored this subscription recommendation.",
      });

      onUpdatedAction();
      onCloseAction();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-5 border-b border-[#eef2ff] bg-white px-6 pb-4 pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-[#dce9ff] p-3 text-black">
                <Settings size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-bold leading-tight text-black">
                  Manage {subscription.merchant}
                </h2>
                <p className="mt-2 text-sm text-[#565e74]">
                  Choose how Aura should track this subscription.
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
            <div className="mb-5 rounded-3xl bg-[#eff4ff] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Current Tracking Status
              </p>
              <h3 className="mt-2 text-2xl font-bold capitalize text-black">
                {subscription.preference_status?.replace("_", " ") || "Active"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#565e74]">
                Aura uses this status to personalize future subscription insights,
                duplicate warnings, and savings recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <ActionCard
                icon={<CheckCircle2 size={20} />}
                title="Keep Tracking"
                desc="Confirm this is an important active subscription."
                onClick={() => updatePreference("confirmed")}
                disabled={saving}
              />

              <ActionCard
                icon={<AlertTriangle size={20} />}
                title="Mark as Not Needed"
                desc="Tell Aura this subscription may be a cancellation candidate."
                onClick={() => updatePreference("cancel_candidate")}
                disabled={saving}
                danger
              />

              <ActionCard
                icon={<Trash2 size={20} />}
                title="Ignore Recommendation"
                desc="Hide this subscription from future optimization suggestions."
                onClick={() => updatePreference("ignored")}
                disabled={saving}
              />
            </div>
          </div>

          <div className="border-t border-[#eef2ff] bg-white px-6 py-5">
            <button
              onClick={onCloseAction}
              disabled={saving}
              className="w-full rounded-xl border border-[#c6c6cd] px-5 py-3 text-sm font-bold text-black hover:bg-[#eff4ff] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  desc,
  onClick,
  disabled,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-3xl border p-5 text-left transition hover:shadow-sm disabled:opacity-60 ${
        danger
          ? "border-red-100 bg-red-50 text-red-600"
          : "border-[#e5eeff] bg-white text-black hover:bg-[#f8f9ff]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`rounded-xl p-3 ${
            danger ? "bg-white text-red-600" : "bg-[#dce9ff] text-black"
          }`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-base font-bold">{title}</h3>
          <p className={`mt-1 text-sm leading-6 ${danger ? "text-red-700" : "text-[#565e74]"}`}>
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}