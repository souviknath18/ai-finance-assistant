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

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

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

  const updatePreference = async (
    status:
      | "confirmed"
      | "cancel_candidate"
      | "ignored"
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
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Settings size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold tracking-tight text-black">
                  Manage {subscription.merchant}
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Choose how Aura should track this recurring subscription.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              aria-label="Close manage subscription modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {apiError && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-[12px] font-semibold text-red-600">
                  {apiError}
                </p>
              </div>
            )}

            {/* Current Status */}
            <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Current Tracking Status
                  </p>

                  <h3 className="mt-1.5 text-[18px] font-bold capitalize text-black">
                    {formatStatus(
                      subscription.preference_status
                    )}
                  </h3>

                  <p className="mt-1.5 max-w-md text-[12px] leading-5 text-[#565e74]">
                    Aura uses this setting for future duplicate alerts,
                    optimization recommendations, and recurring-payment
                    insights.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                    Tracking Active
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <ActionCard
                icon={<CheckCircle2 size={17} />}
                title="Keep Tracking"
                description="Confirm this as an active subscription that Aura should continue monitoring."
                onClick={() =>
                  updatePreference("confirmed")
                }
                disabled={saving}
                variant="success"
              />

              <ActionCard
                icon={<AlertTriangle size={17} />}
                title="Mark as Not Needed"
                description="Flag this subscription as a possible cancellation candidate."
                onClick={() =>
                  updatePreference(
                    "cancel_candidate"
                  )
                }
                disabled={saving}
                variant="danger"
              />

              <ActionCard
                icon={<Trash2 size={17} />}
                title="Ignore Recommendation"
                description="Exclude this subscription from future optimization suggestions."
                onClick={() =>
                  updatePreference("ignored")
                }
                disabled={saving}
                variant="neutral"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="inline-flex h-10 min-w-[110px] items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Close"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
  disabled,
  variant = "neutral",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "success" | "danger" | "neutral";
}) {
  const styles = {
    success: {
      card:
        "border-emerald-100 bg-emerald-50/50 hover:border-emerald-200 hover:bg-emerald-50",

      icon:
        "border-emerald-100 bg-white text-emerald-700",

      title:
        "text-black",

      description:
        "text-[#565e74]",
    },

    danger: {
      card:
        "border-red-100 bg-red-50/50 hover:border-red-200 hover:bg-red-50",

      icon:
        "border-red-100 bg-white text-red-600",

      title:
        "text-red-600",

      description:
        "text-[#565e74]",
    },

    neutral: {
      card:
        "border-[#e6edf9] bg-white hover:border-[#dbe5f5] hover:bg-[#fbfcff]",

      icon:
        "border-[#e6edf9] bg-[#f3f6fc] text-black",

      title:
        "text-black",

      description:
        "text-[#565e74]",
    },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl border p-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-[background-color,border-color,box-shadow] duration-200 hover:shadow-[0_5px_16px_rgba(15,23,42,0.05)] disabled:cursor-not-allowed disabled:opacity-50 ${styles.card}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3
            className={`text-[14px] font-bold ${styles.title}`}
          >
            {title}
          </h3>

          <p
            className={`mt-1 text-[12px] leading-5 ${styles.description}`}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
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