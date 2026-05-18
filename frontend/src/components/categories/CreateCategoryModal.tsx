"use client";

import { useState } from "react";
import { X, Plus, Tags } from "lucide-react";
import CustomSelect from "../ui/CustomSelect";
import { createCategory } from "@/lib/api/categoryApi";

type CreateCategoryModalProps = {
  open: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
};

export default function CreateCategoryModal({
  open,
  onCloseAction,
  onSuccessAction,
}: CreateCategoryModalProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "expense",
    keywords: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    api: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      type: "expense",
      keywords: "",
    });

    setErrors({
      name: "",
      api: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onCloseAction();
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    if (event.target.name === "name") {
      setErrors((prev) => ({ ...prev, name: "", api: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setErrors({
        name: "Category name is required.",
        api: "",
      });
      return;
    }

    setLoading(true);

    try {
      await createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
        category_type: form.type as "expense" | "income" | "both",
        keywords: form.keywords.trim(),
      });

      resetForm();
      onSuccessAction();
      onCloseAction();
    } catch (error: any) {
      setErrors({
        name: error?.name?.[0] || "",
        api: error?.detail || "Failed to create category.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Tags size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black">
                Create Category
              </h2>
              <p className="mt-1 text-sm text-[#565e74]">
                Add a custom category and matching keywords for future uploads.
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

        {errors.api && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {errors.api}
          </div>
        )}

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[#565e74]">
              Category Name <span className="text-red-500">*</span>
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Cloud Services"
              className={`h-[50px] w-full rounded-xl border bg-[#f8f9ff] px-4 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-[#c6c6cd] focus:border-emerald-600 focus:ring-emerald-100"
              }`}
            />

            {errors.name && (
              <p className="ml-1 mt-[-4px] text-xs font-semibold text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[#565e74]">
              Description{" "}
              <span className="font-normal text-[#76777d]">(optional)</span>
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Payments related to hosting, APIs, cloud tools, and infrastructure."
              rows={3}
              className="w-full resize-none rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-4 py-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[#565e74]">
                Category Type <span className="text-red-500">*</span>
              </label>

              <CustomSelect
                name="type"
                value={form.type}
                options={[
                  { label: "Expense", value: "expense" },
                  { label: "Income", value: "income" },
                  { label: "Both", value: "both" },
                ]}
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
                Auto-match Keywords{" "}
                <span className="font-normal text-[#76777d]">(optional)</span>
              </label>

              <input
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="aws, vercel, digitalocean"
                className="h-[50px] w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-4 text-sm text-[#0b1c30] outline-none transition placeholder:text-[#76777d] focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm leading-6 text-emerald-800">
              Keywords help Aura automatically categorize future transactions
              during document uploads.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              <Plus size={17} />
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}