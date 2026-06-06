"use client";

import { useEffect, useState } from "react";
import {
  X,
  Settings,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
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
  const [apiError, setApiError] = useState("");

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

  const handleClose = () => {
    if (saving) return;

    setApiError("");
    onCloseAction();
  };

  const updatePreference = async (
    status: "confirmed" | "cancel_candidate" | "ignored"
  ) => {
    setSaving(true);
    setApiError("");

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
    } catch (error: any) {
      setApiError(
        error?.detail ||
          error?.non_field_errors?.[0] ||
          "Failed to update subscription preference."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90dvh] flex-col">
          <div className="shrink-0 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Settings size={18} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold leading-tight text-black">
                    Manage {subscription.merchant}
                  </h2>

                  <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
                    Choose how Aura should track this subscription.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                disabled={saving}
                className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            {apiError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
                {apiError}
              </div>
            )}

            <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                Current Tracking Status
              </p>

              <h3 className="mt-1.5 text-xl font-bold capitalize text-black">
                {subscription.preference_status?.replace("_", " ") || "Active"}
              </h3>

              <p className="mt-1.5 text-[13px] leading-5 text-[#565e74]">
                Aura uses this status to personalize future subscription
                insights, duplicate warnings, and savings recommendations.
              </p>
            </div>

            <div className="space-y-3">
              <ActionCard
                icon={<CheckCircle2 size={18} />}
                title="Keep Tracking"
                desc="Confirm this is an important active subscription."
                onClick={() => updatePreference("confirmed")}
                disabled={saving}
                variant="success"
              />

              <ActionCard
                icon={<AlertTriangle size={18} />}
                title="Mark as Not Needed"
                desc="Tell Aura this subscription may be a cancellation candidate."
                onClick={() => updatePreference("cancel_candidate")}
                disabled={saving}
                variant="danger"
              />

              <ActionCard
                icon={<Trash2 size={18} />}
                title="Ignore Recommendation"
                desc="Hide this subscription from future optimization suggestions."
                onClick={() => updatePreference("ignored")}
                disabled={saving}
                variant="neutral"
              />
            </div>
          </div>

          <div className="shrink-0 border-t border-[#eef2ff] bg-white px-5 py-4">
            <button
              onClick={handleClose}
              disabled={saving}
              className="w-full rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-60"
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
  variant = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "success" | "danger" | "neutral";
}) {
  const styles = {
    success: {
      card: "border-emerald-100 bg-emerald-50/60 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50",
      icon: "bg-white text-emerald-700",
      desc: "text-[#565e74]",
    },
    danger: {
      card: "border-red-100 bg-red-50 text-red-600 hover:border-red-200 hover:bg-red-50/80",
      icon: "bg-white text-red-600",
      desc: "text-red-700",
    },
    neutral: {
      card: "border-[#e5eeff] bg-white text-black hover:bg-[#f8f9ff]",
      icon: "bg-[#dce9ff] text-black",
      desc: "text-[#565e74]",
    },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 ${styles.card}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2.5 ${styles.icon}`}>{icon}</div>

        <div>
          <h3 className="text-[15px] font-bold">{title}</h3>

          <p className={`mt-1 text-[13px] leading-5 ${styles.desc}`}>
            {desc}
          </p>
        </div>
      </div>
    </button>
  );
}