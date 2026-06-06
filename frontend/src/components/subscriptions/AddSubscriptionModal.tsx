"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CreditCard,
  Plus,
  Repeat,
  X,
} from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
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
  { label: "Streaming", value: "Streaming" },
  { label: "SaaS", value: "SaaS" },
  { label: "Utilities", value: "Utilities" },
  { label: "Fitness", value: "Fitness" },
  { label: "Cloud / AI Tools", value: "Cloud / AI Tools" },
  { label: "Design Tools", value: "Design Tools" },
  { label: "Other", value: "Other" },
];

const billingCycleOptions = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export default function AddSubscriptionModal({
  open,
  onCloseAction,
  onSuccessAction,
}: AddSubscriptionModalProps) {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    merchant: "",
    category: "Streaming",
    billing_cycle: "monthly",
    next_billing_date: "",
    amount: "",
    smart_reminder: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

  if (!open) return null;

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
    resetForm();
    onCloseAction();
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.merchant.trim()) {
      newErrors.merchant = "Service name is required.";
    }

    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!form.next_billing_date) {
      newErrors.next_billing_date = "Next billing date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setErrors({});

    try {
      await createManualSubscription({
        merchant: form.merchant.trim(),
        category: form.category,
        billing_cycle: form.billing_cycle as "weekly" | "monthly" | "yearly",
        next_billing_date: form.next_billing_date,
        amount: form.amount,
        smart_reminder: form.smart_reminder,
      });

      resetForm();
      onSuccessAction?.();
      onCloseAction();
    } catch (error: any) {
      setErrors({
        merchant: error?.merchant?.[0] || "",
        amount: error?.amount?.[0] || "",
        next_billing_date: error?.next_billing_date?.[0] || "",
        api:
          error?.non_field_errors?.[0] ||
          error?.detail ||
          "Failed to add subscription.",
      });
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
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Plus size={18} />
                </div>

                <div>
                  <h2 className="text-xl font-bold leading-tight text-black">
                    Add Subscription
                  </h2>

                  <p className="mt-1 text-[13px] leading-5 text-[#565e74]">
                    Manually track a recurring expense Aura could not detect.
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                disabled={saving}
                className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black disabled:opacity-60"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            {errors.api && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
                {errors.api}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Service Name" required error={errors.merchant}>
                <input
                  value={form.merchant}
                  onChange={(event) => {
                    setForm((prev) => ({
                      ...prev,
                      merchant: event.target.value,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      merchant: "",
                      api: "",
                    }));
                  }}
                  placeholder="e.g. Netflix, Adobe Creative Cloud"
                  className={`h-11 w-full rounded-xl border bg-[#f8f9ff] px-3 text-[13px] outline-none transition focus:ring-2 ${
                    errors.merchant
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
                  }`}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Category">
                  <CustomSelect
                    name="category"
                    value={form.category}
                    options={categoryOptions}
                    onChangeAction={(name, value) =>
                      setForm((prev) => ({
                        ...prev,
                        [name]: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Billing Cycle">
                  <CustomSelect
                    name="billing_cycle"
                    value={form.billing_cycle}
                    options={billingCycleOptions}
                    onChangeAction={(name, value) =>
                      setForm((prev) => ({
                        ...prev,
                        [name]: value,
                      }))
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Next Billing Date"
                  required
                  error={errors.next_billing_date}
                >
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565e74]"
                    />

                    <input
                      type="date"
                      value={form.next_billing_date}
                      onChange={(event) => {
                        setForm((prev) => ({
                          ...prev,
                          next_billing_date: event.target.value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          next_billing_date: "",
                          api: "",
                        }));
                      }}
                      className={`h-11 w-full rounded-xl border bg-[#f8f9ff] py-2.5 pl-9 pr-3 text-[13px] outline-none transition focus:ring-2 ${
                        errors.next_billing_date
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
                      }`}
                    />
                  </div>
                </Field>

                <Field label="Amount" required error={errors.amount}>
                  <div className="relative">
                    <CreditCard
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565e74]"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) => {
                        setForm((prev) => ({
                          ...prev,
                          amount: event.target.value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          amount: "",
                          api: "",
                        }));
                      }}
                      placeholder="0.00"
                      className={`h-11 w-full rounded-xl border bg-[#f8f9ff] py-2.5 pl-9 pr-3 text-[13px] outline-none transition focus:ring-2 ${
                        errors.amount
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
                      }`}
                    />
                  </div>
                </Field>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2.5 text-emerald-700">
                    <Bell size={18} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                      Smart Reminders
                    </p>

                    <p className="text-[13px] leading-5 text-[#565e74]">
                      Notify before the next payment date.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      smart_reminder: !prev.smart_reminder,
                    }))
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    form.smart_reminder ? "bg-emerald-600" : "bg-[#c6c6cd]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                      form.smart_reminder ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#eef2ff] bg-white px-5 py-4">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                onClick={handleClose}
                disabled={saving}
                className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleSubmit}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
              >
                <Repeat size={15} />
                {saving ? "Adding..." : "Add Subscription"}
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
        {label} {required && <span className="text-red-500">*</span>}
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