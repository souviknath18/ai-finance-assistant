"use client";

import { useEffect, useMemo, useState } from "react";
import { GitMerge, X } from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";
import { Category } from "@/types/category";
import { mergeCategories } from "@/lib/api/categoryApi";

type MergeCategoryModalProps = {
  open: boolean;
  sourceCategoryId: string;
  sourceCategoryName: string;
  categories: Category[];
  onCloseAction: () => void;
  onSuccessAction: () => Promise<void> | void;
};

export default function MergeCategoryModal({
  open,
  sourceCategoryId,
  sourceCategoryName,
  categories,
  onCloseAction,
  onSuccessAction,
}: MergeCategoryModalProps) {
  const [destinationCategoryId, setDestinationCategoryId] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const destinationOptions = useMemo(
    () =>
      categories
        .filter(
          (category) =>
            category.is_active &&
            category.category_id !== sourceCategoryId
        )
        .map((category) => ({
          label: category.name,
          value: category.category_id,
        })),
    [categories, sourceCategoryId]
  );

  useEffect(() => {
    if (!open) {
      setDestinationCategoryId("");
      setError("");
      return;
    }

    const originalBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalBodyOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    setDestinationCategoryId("");
    setError("");
    onCloseAction();
  };

  const handleMerge = async () => {
    if (!sourceCategoryId) {
      setError(
        "The source category is unavailable."
      );
      return;
    }

    if (!destinationCategoryId) {
      setError(
        "Select a destination category."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await mergeCategories({
        source_category_id:
          sourceCategoryId,
        destination_category_id:
          destinationCategoryId,
      });

      await onSuccessAction();
      handleClose();
    } catch (mergeError: any) {
      setError(
        mergeError?.destination_category_id?.[0] ||
          mergeError?.source_category_id?.[0] ||
          mergeError?.non_field_errors?.[0] ||
          mergeError?.detail ||
          "Failed to merge categories."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md rounded-2xl border border-[#dfe9fb] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-[#e5eeff] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce9ff] text-black">
              <GitMerge size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-black">
                Merge Category
              </h2>

              <p className="mt-1 text-[12px] text-[#565e74]">
                Move transactions and rules into another category.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close merge modal"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">
              {error}
            </div>
          )}

          <div>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Source category
            </p>

            <div className="rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3 py-3 text-[13px] font-bold text-black">
              {sourceCategoryName}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
              Merge into
            </label>

            <CustomSelect
              name="destinationCategoryId"
              value={destinationCategoryId}
              placeholder="Select destination category"
              options={destinationOptions}
              onChangeAction={(_, value) => {
                setDestinationCategoryId(
                  value
                );
                setError("");
              }}
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-[13px] leading-5 text-amber-800">
              All transactions using{" "}
              <strong>
                {sourceCategoryName}
              </strong>{" "}
              will move to the selected category. Its keywords will also
              be combined, and the source category will be hidden.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2.5 border-t border-[#e5eeff] px-5 py-4 sm:flex-row sm:justify-end">
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
            onClick={handleMerge}
            disabled={
              loading ||
              !destinationCategoryId
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GitMerge size={15} />

            {loading
              ? "Merging..."
              : "Merge Category"}
          </button>
        </div>
      </div>
    </div>
  );
}