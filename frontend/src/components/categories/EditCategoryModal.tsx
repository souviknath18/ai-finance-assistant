"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Edit,
  Save,
  X,
} from "lucide-react";

import CustomSelect from "../ui/CustomSelect";

import { Category } from "@/types/category";

import {
  updateCategory,
} from "@/lib/api/categoryApi";

type EditCategoryModalProps = {
  open: boolean;
  category: Category | null;
  onCloseAction: () => void;
  onSuccessAction: () => Promise<void> | void;
};

type CategoryForm = {
  name: string;
  description: string;
  type:
    | "expense"
    | "income"
    | "both";
  keywords: string;
};

export default function EditCategoryModal({
  open,
  category,
  onCloseAction,
  onSuccessAction,
}: EditCategoryModalProps) {
  const [form, setForm] =
    useState<CategoryForm>({
      name: "",
      description: "",
      type: "expense",
      keywords: "",
    });

  const [errors, setErrors] =
    useState({
      name: "",
      api: "",
    });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!open || !category) {
      return;
    }

    setForm({
      name: category.name,
      description:
        category.description ||
        "",
      type:
        category.category_type,
      keywords:
        category.keywords ||
        "",
    });

    setErrors({
      name: "",
      api: "",
    });
  }, [
    open,
    category,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

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

  if (
    !open ||
    !category
  ) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    setErrors({
      name: "",
      api: "",
    });

    onCloseAction();
  };

  const handleChange = (
    event: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (name === "name") {
      setErrors(
        (previous) => ({
          ...previous,
          name: "",
          api: "",
        })
      );
    }
  };

  const handleSubmit =
    async () => {
      const cleanedName =
        form.name.trim();

      if (!cleanedName) {
        setErrors({
          name:
            "Category name is required.",
          api: "",
        });

        return;
      }

      setLoading(true);

      setErrors({
        name: "",
        api: "",
      });

      try {
        await updateCategory(
          category.category_id,
          {
            name:
              cleanedName,
            description:
              form.description.trim(),
            category_type:
              form.type,
            keywords:
              form.keywords.trim(),
          }
        );

        await onSuccessAction();

        onCloseAction();
      } catch (error: any) {
        setErrors({
          name:
            error?.name?.[0] ||
            "",
          api:
            error?.detail ||
            error
              ?.non_field_errors?.[0] ||
            "Failed to update category.",
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[9999] flex h-dvh items-center justify-center overflow-hidden bg-black/20 px-4 backdrop-blur-[4px]">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-[#edf2fb] bg-white px-5 pb-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                <Edit
                  size={17}
                />
              </div>

              <div>
                <h2 className="text-[16px] font-bold tracking-tight text-black">
                  Edit Category
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Update category
                  details and
                  matching keywords.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close edit category modal"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="flex h-8 w-8 items-center justify-center rounded-xl text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X
                size={16}
              />
            </button>
          </div>

          {/* Body */}
          <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-5">
            {errors.api && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-[11px] font-semibold text-red-600">
                {
                  errors.api
                }
              </div>
            )}

            <form
              className="space-y-4"
              onSubmit={(
                event
              ) => {
                event.preventDefault();

                handleSubmit();
              }}
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-category-name"
                  className="ml-1 text-[11px] font-semibold text-[#565e74]"
                >
                  Category Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="edit-category-name"
                  name="name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  className={`h-11 w-full rounded-xl border bg-[#f8f9ff] px-3 text-[12px] text-[#0b1c30] outline-none transition focus:ring-2 ${
                    errors.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-emerald-100"
                  }`}
                />

                {errors.name && (
                  <p className="ml-1 text-[10px] font-semibold text-red-600">
                    {
                      errors.name
                    }
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label
                  htmlFor="edit-category-description"
                  className="ml-1 text-[11px] font-semibold text-[#565e74]"
                >
                  Description{" "}
                  <span className="font-normal text-[#8a92a5]">
                    (optional)
                  </span>
                </label>

                <textarea
                  id="edit-category-description"
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3 py-2.5 text-[12px] text-[#0b1c30] outline-none transition hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Type + Keywords */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
                    Category Type{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <CustomSelect
                    name="type"
                    value={
                      form.type
                    }
                    options={[
                      {
                        label:
                          "Expense",
                        value:
                          "expense",
                      },
                      {
                        label:
                          "Income",
                        value:
                          "income",
                      },
                      {
                        label:
                          "Both",
                        value:
                          "both",
                      },
                    ]}
                    onChangeAction={(
                      _,
                      value
                    ) =>
                      setForm(
                        (
                          previous
                        ) => ({
                          ...previous,
                          type:
                            value as CategoryForm["type"],
                        })
                      )
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="edit-category-keywords"
                    className="ml-1 text-[11px] font-semibold text-[#565e74]"
                  >
                    Auto-match Keywords{" "}
                    <span className="font-normal text-[#8a92a5]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="edit-category-keywords"
                    name="keywords"
                    value={
                      form.keywords
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="aws, vercel, digitalocean"
                    className="h-11 w-full rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3 text-[12px] text-[#0b1c30] outline-none transition placeholder:text-[#8a92a5] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                <p className="text-[11px] leading-5 text-emerald-800">
                  Updating the
                  category name will
                  also update matching
                  transaction category
                  names.
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2.5 border-t border-[#edf2fb] bg-white px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={
                handleClose
              }
              disabled={
                loading
              }
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe9fb] bg-white px-4 text-[12px] font-bold text-black transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-60"
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
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save
                size={14}
              />

              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}