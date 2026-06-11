"use client";

import { useEffect, useState } from "react";
import {
  X,
  Rocket,
  Target,
  Plane,
  Landmark,
  ShoppingBag,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { createGoal, updateGoal } from "@/lib/api/goalsApi";
import { Category } from "@/types/category";
import CustomSelect from "../ui/CustomSelect";
import type { GoalItem, GoalType } from "@/types/goal";

type CreateGoalModalProps = {
  open: boolean;
  categories: Category[];
  editingGoal?: GoalItem | null;
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

type Priority = "low" | "medium" | "high";

export default function CreateGoalModal({
  open,
  categories,
  editingGoal = null,
  onCloseAction,
  onSuccessAction,
}: CreateGoalModalProps) {
  const isEditMode = Boolean(editingGoal);

  const [form, setForm] = useState({
    title: "",
    goal_type: "",
    category: "",
    target_amount: "",
    target_date: "",
    current_amount: "",
    priority: "medium" as Priority,
    ai_recommendations_enabled: true,
  });

  const [errors, setErrors] = useState({
    title: "",
    goal_type: "",
    target_amount: "",
    api: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingGoal) {
      setForm({
        title: editingGoal.title,
        goal_type: editingGoal.goal_type,
        category: editingGoal.category ? String(editingGoal.category) : "",
        target_amount: String(editingGoal.target_amount),
        target_date: editingGoal.target_date || "",
        current_amount: String(editingGoal.current_amount),
        priority: editingGoal.priority,
        ai_recommendations_enabled: editingGoal.ai_recommendations_enabled,
      });
    }
  }, [open, editingGoal]);

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
      title: "",
      goal_type: "",
      category: "",
      target_amount: "",
      target_date: "",
      current_amount: "",
      priority: "medium",
      ai_recommendations_enabled: true,
    });

    setErrors({
      title: "",
      goal_type: "",
      target_amount: "",
      api: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onCloseAction();
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setErrors((prev) => ({
        ...prev,
        title: "Goal name is required.",
      }));
      return;
    }

    if (!form.goal_type) {
      setErrors((prev) => ({
        ...prev,
        goal_type: "Goal type is required.",
      }));
      return;
    }

    if (!form.target_amount || Number(form.target_amount) <= 0) {
      setErrors((prev) => ({
        ...prev,
        target_amount: "Target amount must be greater than 0.",
      }));
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title.trim(),
        goal_type: form.goal_type as GoalType,
        category: form.category ? Number(form.category) : null,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount || 0),
        monthly_average: 0,
        target_date: form.target_date || null,
        priority: form.priority,
        is_active: true,
        ai_recommendations_enabled: form.ai_recommendations_enabled,
      };

      if (editingGoal) {
        await updateGoal(editingGoal.goal_id, payload);
      } else {
        await createGoal(payload);
      }

      resetForm();
      onSuccessAction();
      onCloseAction();
    } catch (error: any) {
      setErrors({
        title: error?.title?.[0] || "",
        goal_type: error?.goal_type?.[0] || "",
        target_amount: error?.target_amount?.[0] || "",
        api: error?.detail || `Failed to ${isEditMode ? "update" : "create"} goal.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const goalTypes = [
    { label: "Savings", value: "savings", icon: <PiggyBank size={15} /> },
    { label: "Debt", value: "debt", icon: <Landmark size={15} /> },
    { label: "Purchase", value: "purchase", icon: <ShoppingBag size={15} /> },
    { label: "Travel", value: "travel", icon: <Plane size={15} /> },
    { label: "Investment", value: "investment", icon: <PiggyBank size={15} /> },
    { label: "Other", value: "other", icon: <Target size={15} /> },
  ] as const;

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex max-h-[90dvh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-[#eef2ff] bg-white px-5 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Target size={18} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-black">
                  {isEditMode ? "Edit Goal" : "Create New Goal"}
                </h2>
                <p className="mt-1 text-[13px] text-[#565e74]">
                  {isEditMode
                    ? "Update your goal details and tracking preferences."
                    : "Define your financial milestone and set a timeline."}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-xl p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
            >
              <X size={17} />
            </button>
          </div>

          <div className="custom-scrollbar relative z-50 flex-1 overflow-y-auto overflow-x-visible px-5 py-4 pb-6">
            {errors.api && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
                {errors.api}
              </div>
            )}

            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
                    Goal Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    value={form.title}
                    onChange={(event) => {
                      setForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }));
                      setErrors((prev) => ({
                        ...prev,
                        title: "",
                        api: "",
                      }));
                    }}
                    placeholder="Emergency Fund"
                    type="text"
                    className={`h-11 w-full rounded-xl border bg-[#f8f9ff] px-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:ring-2 ${
                      errors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
                    }`}
                  />

                  {errors.title && (
                    <p className="ml-1 text-[11px] font-semibold text-red-600">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
                    Category{" "}
                    <span className="font-normal text-[#76777d]">
                      (optional)
                    </span>
                  </label>

                  <CustomSelect
                    name="category"
                    value={form.category}
                    options={categories.map((category) => ({
                      label: category.name,
                      value: String(category.id),
                    }))}
                    onChangeAction={(name, value) => {
                      setForm((prev) => ({
                        ...prev,
                        [name]: value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        api: "",
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AmountInput
                  label="Target Amount"
                  value={form.target_amount}
                  placeholder="1500000"
                  error={errors.target_amount}
                  required
                  onChange={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      target_amount: value,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      target_amount: "",
                      api: "",
                    }));
                  }}
                />

                <div className="space-y-1.5">
                  <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
                    Target Date{" "}
                    <span className="font-normal text-[#76777d]">
                      (optional)
                    </span>
                  </label>

                  <input
                    value={form.target_date}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        target_date: event.target.value,
                      }))
                    }
                    type="date"
                    className="h-11 w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-[13px] text-[#0b1c30] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
                Goal Type <span className="text-red-500">*</span>
              </label>

              <div className="mt-1 flex flex-wrap gap-2.5">
                {goalTypes.map((type) => {
                  const active = form.goal_type === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          goal_type: type.value,
                        }));

                        setErrors((prev) => ({
                          ...prev,
                          goal_type: "",
                          api: "",
                        }));
                      }}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition active:scale-95 ${
                        active
                          ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                          : "border-[#c6c6cd] text-[#565e74] hover:border-emerald-600 hover:bg-[#eff4ff] hover:text-black"
                      }`}
                    >
                      {type.icon}
                      {type.label}
                    </button>
                  );
                })}
              </div>

              {errors.goal_type && (
                <p className="ml-1 text-[11px] font-semibold text-red-600">
                  {errors.goal_type}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AmountInput
                  label="Initial Deposit"
                  value={form.current_amount}
                  placeholder="Optional"
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      current_amount: value,
                    }))
                  }
                />

                <div className="space-y-1.5">
                  <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
                    Goal Priority
                  </label>

                  <div className="flex rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] p-1">
                    {(["low", "medium", "high"] as Priority[]).map(
                      (priority) => {
                        const active = form.priority === priority;

                        return (
                          <button
                            key={priority}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                priority,
                              }))
                            }
                            className={`flex-1 rounded-lg py-2 text-center text-[12px] font-bold capitalize transition ${
                              active
                                ? "bg-emerald-700 text-white shadow-sm"
                                : "text-[#565e74] hover:bg-[#e5eeff] hover:text-black"
                            }`}
                          >
                            {priority}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                      <Sparkles size={17} />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-emerald-900">
                        Enable AI Recommendations
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-emerald-800">
                        Aura will suggest optimal weekly savings and goal
                        strategies.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        ai_recommendations_enabled:
                          !prev.ai_recommendations_enabled,
                      }))
                    }
                    className={`relative h-6 w-10 rounded-full transition ${
                      form.ai_recommendations_enabled
                        ? "bg-emerald-700"
                        : "bg-[#c6c6cd]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.ai_recommendations_enabled ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="sticky bottom-0 z-0 flex flex-col-reverse gap-2.5 border-t border-[#eef2ff] bg-white px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <Rocket size={15} />
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create Goal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AmountInput({
  label,
  value,
  placeholder,
  onChange,
  error,
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[13px] font-semibold text-[#565e74]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#565e74]">
          ₹
        </span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="number"
          min="0"
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
  );
}