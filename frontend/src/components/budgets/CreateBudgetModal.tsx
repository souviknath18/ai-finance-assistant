"use client";

import { useState, useEffect } from "react";
import { X, Plus, WalletCards, Sparkles } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { BudgetItem } from "@/types/budget";
import { createBudget, updateBudget } from "@/lib/api/budgetApi";

type CreateBudgetModalProps = {
  open: boolean;
  mode?: "create" | "edit";
  budget?: BudgetItem | null;
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

const categoryOptions = [
  { label: "Food", value: "Food" },
  { label: "Groceries", value: "Groceries" },
  { label: "Transport", value: "Transport" },
  { label: "Fuel", value: "Fuel" },
  { label: "Shopping", value: "Shopping" },
  { label: "Rent", value: "Rent" },
  { label: "Utilities", value: "Utilities" },
  { label: "Subscriptions", value: "Subscriptions" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Insurance", value: "Insurance" },
  { label: "Travel", value: "Travel" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Education", value: "Education" },
];

export default function CreateBudgetModal({
  open,
  onCloseAction,
  onSuccessAction,
  mode = "create",
  budget = null,
}: CreateBudgetModalProps) {
  const [form, setForm] = useState({
    category: "Food",
    limit_amount: "",
    period: "monthly",
    ai_dynamic_limits: false,
    smart_notifications: true,
  });

  const [errors, setErrors] = useState({
    limit_amount: "",
    api: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && budget) {
      setForm({
        category: budget.category,
        limit_amount: budget.limit_amount,
        period: budget.period,
        ai_dynamic_limits: false,
        smart_notifications: true,
      });
    }
  }, [mode, budget]);

  if (!open) return null;

  const resetForm = () => {
    setForm({
      category: "Food",
      limit_amount: "",
      period: "monthly",
      ai_dynamic_limits: false,
      smart_notifications: true,
    });

    setErrors({
      limit_amount: "",
      api: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onCloseAction();
  };

  const handleSubmit = async () => {
    if (!form.limit_amount || Number(form.limit_amount) <= 0) {
      setErrors({
        limit_amount: `${
          form.period === "weekly" ? "Weekly" : "Monthly"
        } limit must be greater than 0.`,
        api: "",
      });

      return;
    }

    setLoading(true);
    setErrors({ limit_amount: "", api: "" });

    try {
      if (mode === "edit" && budget) {
        await updateBudget(budget.budget_id, {
          category: form.category,
          limit_amount: form.limit_amount,
          period: form.period as "monthly" | "weekly",
          is_active: true,
        });
      } else {
        await createBudget({
          category: form.category,
          limit_amount: form.limit_amount,
          period: form.period as "monthly" | "weekly",
          is_active: true,
        });
      }

      resetForm();
      onSuccessAction();
      onCloseAction();
    } catch (error: any) {
      setErrors({
        limit_amount: error?.limit_amount?.[0] || "",
        api:
          error?.non_field_errors?.[0] ||
          error?.detail ||
          "Failed to create budget.",
      });
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition ${
        enabled ? "bg-emerald-600" : "bg-[#c6c6cd]"
      }`}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-white shadow-sm transition ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#e5eeff] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <WalletCards size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black">
                {mode === "edit" ? "Edit Budget" : "Create Budget"}
              </h2>
              <p className="mt-1 text-sm text-[#565e74]">
                Set a monthly spending limit and let Aura track it.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-xl p-2 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {errors.api && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {errors.api}
            </div>
          )}

          <form className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[#565e74]">
                  Select Category <span className="text-red-500">*</span>
                </label>

                <CustomSelect
                  name="category"
                  value={form.category}
                  options={categoryOptions}
                  onChangeAction={(name, value) =>
                    setForm({
                      ...form,
                      [name]: value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[#565e74]">
                  Budget Period
                </label>

                <div className="flex h-[50px] rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        period: "monthly",
                      })
                    }
                    className={`flex-1 rounded-lg text-sm font-bold transition ${
                      form.period === "monthly"
                        ? "bg-white text-black shadow-sm"
                        : "text-[#7c839b] hover:text-black"
                    }`}
                  >
                    Monthly
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        period: "weekly",
                      })
                    }
                    className={`flex-1 rounded-lg text-sm font-bold transition ${
                      form.period === "weekly"
                        ? "bg-white text-black shadow-sm"
                        : "text-[#7c839b] hover:text-black"
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[#565e74]">
                {form.period === "weekly" ? "Weekly Limit" : "Monthly Limit"}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#565e74]">
                  ₹
                </span>

                <input
                  type="number"
                  value={form.limit_amount}
                  onChange={(event) => {
                    setForm({
                      ...form,
                      limit_amount: event.target.value,
                    });

                    setErrors({ limit_amount: "", api: "" });
                  }}
                  placeholder="15000"
                  className={`h-[50px] w-full rounded-xl border bg-[#f8f9ff] pl-9 pr-4 text-sm font-semibold text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:ring-2 ${
                    errors.limit_amount
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
                  }`}
                />
              </div>

              {errors.limit_amount && (
                <p className="ml-1 mt-[-4px] text-xs font-semibold text-red-600">
                  {errors.limit_amount}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="mb-4 flex items-center gap-2 text-emerald-700">
                <Sparkles size={18} />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  AI Enhancements
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-black">
                      AI-Dynamic Limits
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#565e74]">
                      Let Aura suggest better limits from your spending pattern.
                    </p>
                  </div>

                  <Toggle
                    enabled={form.ai_dynamic_limits}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        ai_dynamic_limits: !prev.ai_dynamic_limits,
                      }))
                    }
                  />
                </div>

                <div className="h-px bg-emerald-100" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-black">
                      Smart Notifications
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#565e74]">
                      Get alerts when usage reaches 50%, 80%, and 100%.
                    </p>
                  </div>

                  <Toggle
                    enabled={form.smart_notifications}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        smart_notifications: !prev.smart_notifications,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col justify-end gap-3 border-t border-[#e5eeff] bg-[#f8f9ff] px-6 py-5 sm:flex-row">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-[#c6c6cd] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            <Plus size={17} />
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update Budget"
              : "Create Budget"}
          </button>
        </div>
      </div>
    </div>
  );
}