"use client";

import { useEffect, useState } from "react";
import { PiggyBank, X } from "lucide-react";
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
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setAmount("");
    setError("");

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [open]);

  if (!open || !goal) return null;

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (!amount || numericAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const updatedAmount = goal.current_amount + numericAmount;

    if (updatedAmount > goal.target_amount) {
      setError("Added funds cannot exceed the target amount.");
      return;
    }

    setLoading(true);

    try {
      await updateGoal(goal.goal_id, {
        current_amount: updatedAmount,
      });

      await onSuccessAction();
      onCloseAction();
    } catch {
      setError("Failed to add funds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center bg-black/30 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-md rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
              <PiggyBank size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-black">Add Funds</h2>
              <p className="mt-1 text-[13px] text-[#565e74]">
                Add money toward {goal.title}.
              </p>
            </div>
          </div>

          <button
            onClick={onCloseAction}
            disabled={loading}
            className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black disabled:opacity-60"
          >
            <X size={17} />
          </button>
        </div>

        <div className="rounded-xl border border-[#e5eeff] bg-[#f8f9ff] p-3.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#565e74]">Current</span>
            <span className="font-bold text-black">
              {goal.current_amount_display}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#565e74]">Target</span>
            <span className="font-bold text-black">
              {goal.target_amount_display}
            </span>
          </div>

          <div className="mt-3 h-1.5 rounded-full bg-[#e5eeff]">
            <div
              className="h-full rounded-full bg-emerald-700"
              style={{ width: `${Math.min(goal.progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-1.5">
          <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
            Amount <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#565e74]">
              ₹
            </span>

            <input
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setError("");
              }}
              type="number"
              min="0"
              placeholder="10000"
              className={`h-11 w-full rounded-xl border bg-[#f8f9ff] pl-8 pr-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:ring-2 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
              }`}
            />
          </div>

          {error && (
            <p className="ml-1 text-[11px] font-semibold text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCloseAction}
            disabled={loading}
            className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}