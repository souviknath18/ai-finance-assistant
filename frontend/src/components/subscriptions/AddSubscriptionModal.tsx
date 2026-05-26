"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarDays, CreditCard, Plus, Repeat, X } from "lucide-react";
import { createManualSubscription } from "@/lib/api/subscriptionApi";

type AddSubscriptionModalProps = {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction?: () => void;
};

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleSubmit = async () => {
    if (!form.merchant.trim() || !form.amount || !form.next_billing_date) {
      return;
    }

    setSaving(true);

    try {
      await createManualSubscription({
        merchant: form.merchant.trim(),
        category: form.category,
        billing_cycle: form.billing_cycle as "weekly" | "monthly" | "yearly",
        next_billing_date: form.next_billing_date,
        amount: form.amount,
        smart_reminder: form.smart_reminder,
      });

      onSuccessAction?.();
      onCloseAction();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.25)]">
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-black">
                <Plus size={18} />
              </div>

              <div>
                <h2 className="text-xl font-bold leading-tight text-black">
                  Add Subscription
                </h2>
                <p className="mt-1 text-[13px] text-[#565e74]">
                  Manually track a recurring expense Aura could not detect.
                </p>
              </div>
            </div>

            <button
              onClick={onCloseAction}
              className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
            >
              <X size={17} />
            </button>
          </div>

          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
            <div className="space-y-4">
              <Field label="Service Name">
                <input
                  value={form.merchant}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, merchant: e.target.value }))
                  }
                  placeholder="e.g. Netflix, Adobe Creative Cloud"
                  className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-2.5 text-[13px] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-2.5 text-[13px] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option>Streaming</option>
                    <option>SaaS</option>
                    <option>Utilities</option>
                    <option>Fitness</option>
                    <option>Cloud / AI Tools</option>
                    <option>Design Tools</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Billing Cycle">
                  <select
                    value={form.billing_cycle}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        billing_cycle: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 py-2.5 text-[13px] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Next Billing Date">
                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565e74]"
                    />
                    <input
                      type="date"
                      value={form.next_billing_date}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          next_billing_date: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] py-2.5 pl-9 pr-3 text-[13px] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </Field>

                <Field label="Amount">
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
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, amount: e.target.value }))
                      }
                      placeholder="0.00"
                      className="w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] py-2.5 pl-9 pr-3 text-[13px] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                    <p className="text-[13px] text-[#565e74]">
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
                  className={`relative h-6 w-11 rounded-full transition ${
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

          <div className="flex flex-col-reverse gap-2.5 border-t border-[#eef2ff] bg-white px-5 py-4 sm:flex-row sm:justify-end">
            <button
              onClick={onCloseAction}
              className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <Repeat size={15} />
              {saving ? "Adding..." : "Add Subscription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}
      </label>
      {children}
    </div>
  );
}