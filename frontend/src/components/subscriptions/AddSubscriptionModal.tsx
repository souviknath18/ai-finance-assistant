"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CreditCard,
  Plus,
  Repeat,
  X,
} from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import { createManualSubscription } from "@/lib/api/subscriptionApi";

type AddSubscriptionModalProps = {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction?: () => void;
};

type FormErrors = {
  merchant?: string;
  amount?: string;
  next_billing_date?: string;
  api?: string;
};

const categoryOptions = [
  {
    label: "Streaming",
    value: "Streaming",
  },
  {
    label: "SaaS",
    value: "SaaS",
  },
  {
    label: "Utilities",
    value: "Utilities",
  },
  {
    label: "Fitness",
    value: "Fitness",
  },
  {
    label: "Cloud / AI Tools",
    value: "Cloud / AI Tools",
  },
  {
    label: "Design Tools",
    value: "Design Tools",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const billingCycleOptions = [
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
];

export default function AddSubscriptionModal({
  open,
  onCloseAction,
  onSuccessAction,
}: AddSubscriptionModalProps) {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      merchant: "",
      category: "Streaming",
      billing_cycle: "monthly",
      next_billing_date: "",
      amount: "",
      smart_reminder: true,
    });

  const [errors, setErrors] =
    useState<FormErrors>({});

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

  if (!open) {
    return null;
  }

  const resetForm = () => {
    setForm({
      merchant: "",
      category: "Streaming",
      billing_cycle: "monthly",
      next_billing_date: "",
      amount: "",
      smart_reminder: true,
    });

    setErrors({});
  };

  const handleClose = () => {
    if (saving) return;

    resetForm();
    onCloseAction();
  };

  const validateForm = () => {
    const newErrors: FormErrors =
      {};

    if (!form.merchant.trim()) {
      newErrors.merchant =
        "Service name is required.";
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      newErrors.amount =
        "Amount must be greater than 0.";
    }

    if (!form.next_billing_date) {
      newErrors.next_billing_date =
        "Next billing date is required.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length ===
      0
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setErrors({});

    try {
      await createManualSubscription({
        merchant:
          form.merchant.trim(),

        category:
          form.category,

        billing_cycle:
          form.billing_cycle as
            | "weekly"
            | "monthly"
            | "yearly",

        next_billing_date:
          form.next_billing_date,

        amount:
          form.amount,

        smart_reminder:
          form.smart_reminder,
      });

      resetForm();

      onSuccessAction?.();
      onCloseAction();
    } catch (error: any) {
      setErrors({
        merchant:
          error?.merchant?.[0] ||
          "",

        amount:
          error?.amount?.[0] ||
          "",

        next_billing_date:
          error
            ?.next_billing_date?.[0] ||
          "",

        api:
          error
            ?.non_field_errors?.[0] ||
          error?.detail ||
          "Failed to add subscription.",
      });
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Plus size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black">
                  Add Subscription
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Manually track a recurring expense Aura could not detect.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              aria-label="Close add subscription modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="space-y-5">
              {/* Service Name */}
              <Field
                label="Service Name"
                required
                error={errors.merchant}
              >
                <input
                  value={form.merchant}
                  onChange={(event) => {
                    setForm(
                      (prev) => ({
                        ...prev,
                        merchant:
                          event.target.value,
                      })
                    );

                    setErrors(
                      (prev) => ({
                        ...prev,
                        merchant: "",
                        api: "",
                      })
                    );
                  }}
                  placeholder="e.g. Netflix, Adobe Creative Cloud"
                  className={`h-11 w-full rounded-xl border bg-[#f8f9ff] px-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] ${
                    errors.merchant
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  }`}
                />
              </Field>

              {/* Category + Billing Cycle */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <CustomSelect
                    name="category"
                    value={form.category}
                    options={categoryOptions}
                    onChangeAction={(
                      name,
                      value
                    ) => {
                      setForm(
                        (prev) => ({
                          ...prev,
                          [name]: value,
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

                <Field label="Billing Cycle">
                  <CustomSelect
                    name="billing_cycle"
                    value={
                      form.billing_cycle
                    }
                    options={
                      billingCycleOptions
                    }
                    onChangeAction={(
                      name,
                      value
                    ) => {
                      setForm(
                        (prev) => ({
                          ...prev,
                          [name]: value,
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
              </div>

              {/* Date + Amount */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <CustomDatePicker
                    label="Next Billing Date"
                    name="next_billing_date"
                    value={form.next_billing_date}
                    onChangeAction={(name, value) => {
                      setForm((prev) => ({
                        ...prev,
                        [name]: value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        next_billing_date: "",
                        api: "",
                      }));
                    }}
                  />

                  {errors.next_billing_date && (
                    <p className="mt-1.5 text-[11px] font-semibold text-red-600">
                      {errors.next_billing_date}
                    </p>
                  )}
                </div>

                <Field
                  label="Amount"
                  required
                  error={errors.amount}
                >
                  <div className="relative">
                    <CreditCard
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#565e74]"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(
                        event
                      ) => {
                        setForm(
                          (prev) => ({
                            ...prev,
                            amount:
                              event.target
                                .value,
                          })
                        );

                        setErrors(
                          (prev) => ({
                            ...prev,
                            amount: "",
                            api: "",
                          })
                        );
                      }}
                      placeholder="0.00"
                      className={`h-11 w-full rounded-xl border bg-[#f8f9ff] py-2.5 pl-9 pr-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] ${
                        errors.amount
                          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                      }`}
                    />
                  </div>
                </Field>
              </div>

              {/* Smart Reminder */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                    <Bell size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-black">
                      Smart Reminders
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                      Notify before the next payment date.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      smart_reminder:
                        !prev.smart_reminder,
                    }))
                  }
                  aria-pressed={
                    form.smart_reminder
                  }
                  className={`relative mt-1 h-6 w-10 shrink-0 rounded-full transition ${
                    form.smart_reminder
                      ? "bg-emerald-700"
                      : "bg-[#c6c6cd]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                      form.smart_reminder
                        ? "right-1"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#f8f9ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Repeat size={14} />

                {saving
                  ? "Adding..."
                  : "Add Subscription"}
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