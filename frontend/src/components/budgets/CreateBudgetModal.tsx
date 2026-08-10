"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";

import { BudgetItem } from "@/types/budget";

import {
  createBudget,
  updateBudget,
} from "@/lib/api/budgetApi";

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
  {
    label: "Subscriptions",
    value: "Subscriptions",
  },
  {
    label: "Healthcare",
    value: "Healthcare",
  },
  {
    label: "Insurance",
    value: "Insurance",
  },
  { label: "Travel", value: "Travel" },
  {
    label: "Entertainment",
    value: "Entertainment",
  },
  {
    label: "Education",
    value: "Education",
  },
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

  const [loading, setLoading] =
    useState(false);

  // Lock page scroll while modal is open.
  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;

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

  // Populate fields when editing.
  // Keep this dependency array the same size.
  useEffect(() => {
    if (
      mode === "edit" &&
      budget
    ) {
      setForm({
        category: budget.category,
        limit_amount:
          budget.limit_amount,
        period: budget.period,
        ai_dynamic_limits: false,
        smart_notifications: true,
      });

      setErrors({
        limit_amount: "",
        api: "",
      });
    }
  }, [mode, budget]);

  if (!open) {
    return null;
  }

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
    if (loading) return;

    resetForm();
    onCloseAction();
  };

  const handleSubmit =
    async () => {
      if (
        !form.limit_amount ||
        Number(
          form.limit_amount
        ) <= 0
      ) {
        setErrors({
          limit_amount: `${
            form.period ===
            "weekly"
              ? "Weekly"
              : "Monthly"
          } limit must be greater than 0.`,
          api: "",
        });

        return;
      }

      setLoading(true);

      setErrors({
        limit_amount: "",
        api: "",
      });

      try {
        if (
          mode === "edit" &&
          budget
        ) {
          await updateBudget(
            budget.budget_id,
            {
              category:
                form.category,

              limit_amount:
                form.limit_amount,

              period:
                form.period as
                  | "monthly"
                  | "weekly",

              is_active: true,
            }
          );
        } else {
          await createBudget({
            category:
              form.category,

            limit_amount:
              form.limit_amount,

            period:
              form.period as
                | "monthly"
                | "weekly",

            is_active: true,
          });
        }

        resetForm();

        await onSuccessAction();

        onCloseAction();
      } catch (error: any) {
        setErrors({
          limit_amount:
            error
              ?.limit_amount?.[0] ||
            "",

          api:
            error
              ?.non_field_errors?.[0] ||
            error?.detail ||
            "Failed to save budget.",
        });
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
                <WalletCards
                  size={17}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black">
                  {mode === "edit"
                    ? "Edit Budget"
                    : "Create Budget"}
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Set spending limits and let Aura monitor your budget usage.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              aria-label="Close budget modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {errors.api && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-[12px] font-semibold text-red-600">
                  {errors.api}
                </p>
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={(
                event
              ) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              {/* Category + Period */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Select Category"
                  required
                >
                  <CustomSelect
                    name="category"
                    value={
                      form.category
                    }
                    options={
                      categoryOptions
                    }
                    onChangeAction={(
                      name,
                      value
                    ) => {
                      setForm(
                        (prev) => ({
                          ...prev,
                          [name]:
                            value,
                        })
                      );

                      setErrors(
                        (prev) => ({
                          ...prev,
                          api: "",
                        })
                      );
                    }}
                  />
                </Field>

                <Field label="Budget Period">
                  <div className="flex h-11 rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            period:
                              "monthly",
                          })
                        )
                      }
                      className={`flex-1 rounded-lg text-[11px] font-bold transition-[background-color,color,box-shadow] duration-200 ${
                        form.period ===
                        "monthly"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-[#565e74] hover:bg-white hover:text-black"
                      }`}
                    >
                      Monthly
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            period:
                              "weekly",
                          })
                        )
                      }
                      className={`flex-1 rounded-lg text-[11px] font-bold transition-[background-color,color,box-shadow] duration-200 ${
                        form.period ===
                        "weekly"
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-[#565e74] hover:bg-white hover:text-black"
                      }`}
                    >
                      Weekly
                    </button>
                  </div>
                </Field>
              </div>

              {/* Limit */}
              <Field
                label={
                  form.period ===
                  "weekly"
                    ? "Weekly Limit"
                    : "Monthly Limit"
                }
                required
                error={
                  errors.limit_amount
                }
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#565e74]">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={
                      form.limit_amount
                    }
                    onChange={(
                      event
                    ) => {
                      setForm(
                        (prev) => ({
                          ...prev,
                          limit_amount:
                            event.target
                              .value,
                        })
                      );

                      setErrors({
                        limit_amount:
                          "",
                        api: "",
                      });
                    }}
                    placeholder="15000"
                    className={`h-11 w-full rounded-xl border bg-[#f8f9ff] pl-8 pr-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] ${
                      errors.limit_amount
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  />
                </div>
              </Field>

              {/* AI Enhancements */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                    <Sparkles
                      size={16}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      AI Enhancements
                    </p>

                    <p className="mt-1 text-[11px] text-[#565e74]">
                      Personalize how Aura monitors this budget.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* AI Dynamic Limits */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-black">
                        AI-Dynamic Limits
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                        Let Aura suggest better limits from your spending pattern.
                      </p>
                    </div>

                    <Toggle
                      enabled={
                        form.ai_dynamic_limits
                      }
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            ai_dynamic_limits:
                              !prev.ai_dynamic_limits,
                          })
                        )
                      }
                    />
                  </div>

                  <div className="h-px bg-emerald-100" />

                  {/* Smart Notifications */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-black">
                        Smart Notifications
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                        Get alerts when usage reaches 50%, 80%, and 100%.
                      </p>
                    </div>

                    <Toggle
                      enabled={
                        form.smart_notifications
                      }
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            smart_notifications:
                              !prev.smart_notifications,
                          })
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  handleClose
                }
                disabled={
                  loading
                }
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#c9d9f3] hover:bg-[#f8f9ff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSubmit
                }
                disabled={
                  loading
                }
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} />

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
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Toggle({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`relative mt-1 h-6 w-10 shrink-0 rounded-full transition ${
        enabled
          ? "bg-emerald-700"
          : "bg-[#c6c6cd]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          enabled
            ? "right-1"
            : "left-1"
        }`}
      />
    </button>
  );
}