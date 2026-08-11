"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  GitMerge,
  X,
} from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";

import { Category } from "@/types/category";

import {
  mergeCategories,
} from "@/lib/api/categoryApi";

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
  const [
    destinationCategoryId,
    setDestinationCategoryId,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const destinationOptions =
    useMemo(
      () =>
        categories
          .filter(
            (category) =>
              category.is_active &&
              category.category_id !==
                sourceCategoryId
          )
          .map(
            (category) => ({
              label:
                category.name,
              value:
                category.category_id,
            })
          ),
      [
        categories,
        sourceCategoryId,
      ]
    );

  useEffect(() => {
    if (!open) {
      setDestinationCategoryId(
        ""
      );

      setError("");

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

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (loading) {
      return;
    }

    setDestinationCategoryId(
      ""
    );

    setError("");

    onCloseAction();
  };

  const handleMerge =
    async () => {
      if (
        !sourceCategoryId
      ) {
        setError(
          "The source category is unavailable."
        );

        return;
      }

      if (
        !destinationCategoryId
      ) {
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
      } catch (
        mergeError: any
      ) {
        setError(
          mergeError
            ?.destination_category_id?.[0] ||
            mergeError
              ?.source_category_id?.[0] ||
            mergeError
              ?.non_field_errors?.[0] ||
            mergeError?.detail ||
            "Failed to merge categories."
        );
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
                <GitMerge
                  size={17}
                />
              </div>

              <div>
                <h2 className="text-[16px] font-bold tracking-tight text-black">
                  Merge Category
                </h2>

                <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
                  Move transactions and
                  category rules into another
                  category.
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close merge modal"
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
            <div className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-[11px] font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* Source */}
              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
                  Source Category
                </label>

                <div className="flex h-11 w-full items-center rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3 text-[12px] font-bold text-black">
                  {sourceCategoryName}
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-1.5">
                <label className="ml-1 text-[11px] font-semibold text-[#565e74]">
                  Merge Into{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <CustomSelect
                  name="destinationCategoryId"
                  value={
                    destinationCategoryId
                  }
                  placeholder="Select destination category"
                  options={
                    destinationOptions
                  }
                  onChangeAction={(
                    _,
                    value
                  ) => {
                    setDestinationCategoryId(
                      value
                    );

                    setError(
                      ""
                    );
                  }}
                />
              </div>

              {/* Preview */}
              {destinationCategoryId && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                    Merge Preview
                  </p>

                  <p className="mt-1.5 text-[11px] leading-5 text-emerald-800">
                    <strong>
                      {
                        sourceCategoryName
                      }
                    </strong>{" "}
                    will be merged into{" "}
                    <strong>
                      {destinationOptions.find(
                        (
                          option
                        ) =>
                          option.value ===
                          destinationCategoryId
                      )
                        ?.label ||
                        "the selected category"}
                    </strong>
                    .
                  </p>
                </div>
              )}

              {/* Warning */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">
                  Important
                </p>

                <p className="mt-1.5 text-[11px] leading-5 text-amber-800">
                  All transactions using{" "}
                  <strong>
                    {
                      sourceCategoryName
                    }
                  </strong>{" "}
                  will move to the selected
                  destination category. Existing
                  keywords will also be combined,
                  and the source category will be
                  hidden.
                </p>
              </div>
            </div>
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
                handleMerge
              }
              disabled={
                loading ||
                !destinationCategoryId
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <GitMerge
                size={14}
              />

              {loading
                ? "Merging..."
                : "Merge Category"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}