"use client";

import { useEffect, useState } from "react";
import {
  PiggyBank,
  X,
  Plus,
} from "lucide-react";

import { GoalItem } from "@/types/goal";
import { updateGoal } from "@/lib/api/goalsApi";

type AddFundsModalProps = {
  open: boolean;
  goal: GoalItem | null;
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

export default function AddFundsModal({
  open,
  goal,
  onCloseAction,
  onSuccessAction,
}: AddFundsModalProps) {
  const [amount, setAmount] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    setAmount("");
    setError("");

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement.style
        .overflow;

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

  if (!open || !goal) {
    return null;
  }

  const safeProgress = Math.min(
    Math.max(goal.progress, 0),
    100
  );

  const handleSubmit = async () => {
    const numericAmount =
      Number(amount);

    if (
      !amount ||
      numericAmount <= 0
    ) {
      setError(
        "Amount must be greater than 0."
      );
      return;
    }

    const updatedAmount =
      goal.current_amount +
      numericAmount;

    if (
      updatedAmount >
      goal.target_amount
    ) {
      setError(
        "Added funds cannot exceed the target amount."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateGoal(
        goal.goal_id,
        {
          current_amount:
            updatedAmount,
        }
      );

      await onSuccessAction();

      onCloseAction();
    } catch {
      setError(
        "Failed to add funds. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <PiggyBank size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black">
                  Add Funds
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Add money toward{" "}
                  <span className="font-semibold text-black">
                    {goal.title}
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseAction}
              disabled={loading}
              aria-label="Close add funds modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* Goal summary */}
            <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
              <div className="grid grid-cols-2 gap-3">
                <SummaryItem
                  label="Current"
                  value={
                    goal.current_amount_display
                  }
                />

                <SummaryItem
                  label="Target"
                  value={
                    goal.target_amount_display
                  }
                />
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
                    Goal Progress
                  </p>

                  <p className="text-[11px] font-bold text-emerald-700">
                    {Math.round(
                      safeProgress
                    )}
                    %
                  </p>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-[width] duration-500"
                    style={{
                      width: `${safeProgress}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] font-medium text-[#8a92a5]">
                  <span>
                    {
                      goal.current_amount_display
                    }
                  </span>

                  <span>
                    {
                      goal.target_amount_display
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Amount input */}
            <div className="mt-5">
              <label className="mb-2 block text-[11px] font-bold text-[#565e74]">
                Amount{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#565e74]">
                  ₹
                </span>

                <input
                  value={amount}
                  onChange={(event) => {
                    setAmount(
                      event.target.value
                    );

                    setError("");
                  }}
                  type="number"
                  min="0"
                  placeholder="10000"
                  disabled={loading}
                  className={`h-11 w-full rounded-xl border bg-[#fbfcff] pl-8 pr-3 text-[13px] font-medium text-black outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9aa2b4] ${
                    error
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-[#e6edf9] hover:border-[#d8e2f0] focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                />
              </div>

              {error && (
                <div className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2">
                  <p className="text-[11px] font-medium text-red-600">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Helpful note */}
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3">
              <p className="text-[11px] leading-5 text-emerald-800">
                You can add up to{" "}
                <span className="font-bold">
                  {
                    goal.remaining_amount_display
                  }
                </span>{" "}
                before reaching this goal&apos;s target.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse justify-end gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={onCloseAction}
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#d8e2f0] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !amount.trim()
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus
                  size={14}
                  className="shrink-0"
                />

                {loading
                  ? "Adding..."
                  : "Add Funds"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a92a5]">
        {label}
      </p>

      <p className="mt-1 text-[14px] font-bold text-black">
        {value}
      </p>
    </div>
  );
}