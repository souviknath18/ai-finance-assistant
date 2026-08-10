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

import type {
  GoalItem,
  GoalType,
} from "@/types/goal";

import CustomSelect from "../ui/CustomSelect";
import CustomDatePicker from "../ui/CustomDatePicker";

type CreateGoalModalProps = {
  open: boolean;
  categories: Category[];
  editingGoal?: GoalItem | null;
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

type Priority =
  | "low"
  | "medium"
  | "high";

export default function CreateGoalModal({
  open,
  categories,
  editingGoal = null,
  onCloseAction,
  onSuccessAction,
}: CreateGoalModalProps) {
  const isEditMode =
    Boolean(editingGoal);

  const [form, setForm] =
    useState({
      title: "",
      goal_type: "",
      category: "",
      target_amount: "",
      target_date: "",
      current_amount: "",
      priority:
        "medium" as Priority,
      ai_recommendations_enabled:
        true,
    });

  const [errors, setErrors] =
    useState({
      title: "",
      goal_type: "",
      target_amount: "",
      api: "",
    });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    if (editingGoal) {
      setForm({
        title:
          editingGoal.title,

        goal_type:
          editingGoal.goal_type,

        category:
          editingGoal.category
            ? String(
                editingGoal.category
              )
            : "",

        target_amount:
          String(
            editingGoal.target_amount
          ),

        target_date:
          editingGoal.target_date ||
          "",

        current_amount:
          String(
            editingGoal.current_amount
          ),

        priority:
          editingGoal.priority,

        ai_recommendations_enabled:
          editingGoal.ai_recommendations_enabled,
      });
    }
  }, [
    open,
    editingGoal,
  ]);

  useEffect(() => {
    if (!open) return;

    const originalBodyOverflow =
      document.body.style.overflow;

    const originalHtmlOverflow =
      document.documentElement
        .style.overflow;

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
      title: "",
      goal_type: "",
      category: "",
      target_amount: "",
      target_date: "",
      current_amount: "",
      priority: "medium",
      ai_recommendations_enabled:
        true,
    });

    setErrors({
      title: "",
      goal_type: "",
      target_amount: "",
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
      if (!form.title.trim()) {
        setErrors((prev) => ({
          ...prev,
          title:
            "Goal name is required.",
        }));

        return;
      }

      if (!form.goal_type) {
        setErrors((prev) => ({
          ...prev,
          goal_type:
            "Goal type is required.",
        }));

        return;
      }

      if (
        !form.target_amount ||
        Number(
          form.target_amount
        ) <= 0
      ) {
        setErrors((prev) => ({
          ...prev,
          target_amount:
            "Target amount must be greater than 0.",
        }));

        return;
      }

      setLoading(true);

      try {
        const payload = {
          title:
            form.title.trim(),

          goal_type:
            form.goal_type as GoalType,

          category:
            form.category
              ? Number(
                  form.category
                )
              : null,

          target_amount:
            Number(
              form.target_amount
            ),

          current_amount:
            Number(
              form.current_amount ||
                0
            ),

          monthly_average: 0,

          target_date:
            form.target_date ||
            null,

          priority:
            form.priority,

          is_active: true,

          ai_recommendations_enabled:
            form.ai_recommendations_enabled,
        };

        if (editingGoal) {
          await updateGoal(
            editingGoal.goal_id,
            payload
          );
        } else {
          await createGoal(
            payload
          );
        }

        resetForm();

        await onSuccessAction();

        onCloseAction();
      } catch (error: any) {
        setErrors({
          title:
            error?.title?.[0] ||
            "",

          goal_type:
            error
              ?.goal_type?.[0] ||
            "",

          target_amount:
            error
              ?.target_amount?.[0] ||
            "",

          api:
            error?.detail ||
            `Failed to ${
              isEditMode
                ? "update"
                : "create"
            } goal.`,
        });
      } finally {
        setLoading(false);
      }
    };

  const goalTypes = [
    {
      label: "Savings",
      value: "savings",
      icon: (
        <PiggyBank
          size={15}
        />
      ),
    },

    {
      label: "Debt",
      value: "debt",
      icon: (
        <Landmark
          size={15}
        />
      ),
    },

    {
      label: "Purchase",
      value: "purchase",
      icon: (
        <ShoppingBag
          size={15}
        />
      ),
    },

    {
      label: "Travel",
      value: "travel",
      icon: (
        <Plane size={15} />
      ),
    },

    {
      label: "Investment",
      value: "investment",
      icon: (
        <PiggyBank
          size={15}
        />
      ),
    },

    {
      label: "Other",
      value: "other",
      icon: (
        <Target size={15} />
      ),
    },
  ] as const;

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.20)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Target
                  size={17}
                />
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-black">
                  {isEditMode
                    ? "Edit Goal"
                    : "Create New Goal"}
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  {isEditMode
                    ? "Update your goal details and tracking preferences."
                    : "Define your financial milestone and set a timeline."}
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
              aria-label="Close goal modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="custom-scrollbar relative flex-1 overflow-y-auto overflow-x-visible px-5 py-5 sm:px-6">
            {/* API Error */}
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
              {/* Goal Name + Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Goal Name"
                  required
                  error={
                    errors.title
                  }
                >
                  <input
                    value={
                      form.title
                    }
                    onChange={(
                      event
                    ) => {
                      setForm(
                        (prev) => ({
                          ...prev,
                          title:
                            event
                              .target
                              .value,
                        })
                      );

                      setErrors(
                        (prev) => ({
                          ...prev,
                          title: "",
                          api: "",
                        })
                      );
                    }}
                    placeholder="Emergency Fund"
                    type="text"
                    className={`h-11 w-full rounded-xl border bg-[#f8f9ff] px-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] ${
                      errors.title
                        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                    }`}
                  />
                </Field>

                <Field
                  label="Category"
                  optional
                >
                  <CustomSelect
                    name="category"
                    value={
                      form.category
                    }
                    placeholder="Select category"
                    options={categories.map(
                      (
                        category
                      ) => ({
                        label:
                          category.name,

                        value:
                          String(
                            category.id
                          ),
                      })
                    )}
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
              </div>

              {/* Target Amount + Target Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AmountInput
                  label="Target Amount"
                  value={
                    form.target_amount
                  }
                  placeholder="1500000"
                  error={
                    errors.target_amount
                  }
                  required
                  onChange={(
                    value
                  ) => {
                    setForm(
                      (prev) => ({
                        ...prev,
                        target_amount:
                          value,
                      })
                    );

                    setErrors(
                      (prev) => ({
                        ...prev,
                        target_amount:
                          "",
                        api: "",
                      })
                    );
                  }}
                />

                <CustomDatePicker
                  label="Target Date"
                  name="target_date"
                  value={
                    form.target_date
                  }
                  optional
                  onChangeAction={(
                    name,
                    value
                  ) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        [name]:
                          value,
                      })
                    )
                  }
                />
              </div>

              {/* Goal Type */}
              <div>
                <FieldLabel
                  required
                >
                  Goal Type
                </FieldLabel>

                <div className="flex flex-wrap gap-2">
                  {goalTypes.map(
                    (type) => {
                      const active =
                        form.goal_type ===
                        type.value;

                      return (
                        <button
                          key={
                            type.value
                          }
                          type="button"
                          onClick={() => {
                            setForm(
                              (
                                prev
                              ) => ({
                                ...prev,
                                goal_type:
                                  type.value,
                              })
                            );

                            setErrors(
                              (
                                prev
                              ) => ({
                                ...prev,
                                goal_type:
                                  "",
                                api: "",
                              })
                            );
                          }}
                          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3.5 text-[11px] font-bold transition-[background-color,border-color,color,box-shadow] duration-200 ${
                            active
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_3px_10px_rgba(15,23,42,0.04)]"
                              : "border-[#e6edf9] bg-white text-[#565e74] hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
                          }`}
                        >
                          {
                            type.icon
                          }

                          {
                            type.label
                          }
                        </button>
                      );
                    }
                  )}
                </div>

                {errors.goal_type && (
                  <p className="mt-1.5 text-[11px] font-semibold text-red-600">
                    {
                      errors.goal_type
                    }
                  </p>
                )}
              </div>

              {/* Initial Deposit + Priority */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AmountInput
                  label="Initial Deposit"
                  value={
                    form.current_amount
                  }
                  placeholder="Optional"
                  onChange={(
                    value
                  ) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        current_amount:
                          value,
                      })
                    )
                  }
                />

                <div>
                  <FieldLabel>
                    Goal Priority
                  </FieldLabel>

                  <div className="flex h-11 rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] p-1">
                    {(
                      [
                        "low",
                        "medium",
                        "high",
                      ] as Priority[]
                    ).map(
                      (
                        priority
                      ) => {
                        const active =
                          form.priority ===
                          priority;

                        return (
                          <button
                            key={
                              priority
                            }
                            type="button"
                            onClick={() =>
                              setForm(
                                (
                                  prev
                                ) => ({
                                  ...prev,
                                  priority,
                                })
                              )
                            }
                            className={`flex-1 rounded-lg text-center text-[11px] font-bold capitalize transition-[background-color,color,box-shadow] duration-200 ${
                              active
                                ? "bg-emerald-700 text-white shadow-sm"
                                : "text-[#565e74] hover:bg-white hover:text-black"
                            }`}
                          >
                            {
                              priority
                            }
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                      <Sparkles
                        size={16}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-black">
                        Enable AI Recommendations
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                        Aura will suggest optimal weekly savings and goal strategies.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setForm(
                        (prev) => ({
                          ...prev,
                          ai_recommendations_enabled:
                            !prev.ai_recommendations_enabled,
                        })
                      )
                    }
                    aria-pressed={
                      form.ai_recommendations_enabled
                    }
                    className={`relative mt-1 h-6 w-10 shrink-0 rounded-full transition ${
                      form.ai_recommendations_enabled
                        ? "bg-emerald-700"
                        : "bg-[#c6c6cd]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                        form.ai_recommendations_enabled
                          ? "right-1"
                          : "left-1"
                      }`}
                    />
                  </button>
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
                <Rocket
                  size={14}
                />

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
    </div>
  );
}

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel
        required={required}
        optional={optional}
      >
        {label}
      </FieldLabel>

      {children}

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldLabel({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}

      {optional && (
        <span className="ml-1 font-medium normal-case tracking-normal text-[#9aa2b4]">
          (optional)
        </span>
      )}
    </label>
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
  onChange: (
    value: string
  ) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel
        required={required}
      >
        {label}
      </FieldLabel>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[#565e74]">
          ₹
        </span>

        <input
          value={value}
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
          placeholder={
            placeholder
          }
          type="number"
          min="0"
          className={`h-11 w-full rounded-xl border bg-[#f8f9ff] pl-8 pr-3 text-[13px] text-[#0b1c30] outline-none transition placeholder:text-[#76777d] ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}