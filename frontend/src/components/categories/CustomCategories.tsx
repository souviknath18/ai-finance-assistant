import {
  Edit,
  PlusCircle,
  Trash2,
} from "lucide-react";

import { Category } from "@/types/category";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";
import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type CustomCategoriesProps = {
  categories: Category[];

  onCreateCategoryAction: () => void;

  onDeleteCategoryAction: (
    categoryId: string,
    categoryName: string
  ) => void;

  onEditCategoryAction: (
    categoryId: string
  ) => void;
};

export default function CustomCategories({
  categories,
  onCreateCategoryAction,
  onEditCategoryAction,
  onDeleteCategoryAction,
}: CustomCategoriesProps) {
  return (
    <section className="mb-6">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-bold text-black">
            Custom Categories
          </h2>

          <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
            Create and manage your own spending classifications.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCategoryAction}
          className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 transition hover:opacity-70"
        >
          Add Category
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Add Card */}
        <button
          type="button"
          onClick={onCreateCategoryAction}
          className="group flex min-h-36 flex-col items-center justify-center gap-2.5 rounded-3xl border border-dashed border-[#c9d9f3] bg-[#fbfcff] p-5 shadow-[0_6px_24px_rgba(15,23,42,0.03)] transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_8px_26px_rgba(15,23,42,0.05)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e6edf9] bg-white text-[#7c839b] transition group-hover:border-emerald-100 group-hover:text-emerald-700">
            <PlusCircle size={17} />
          </div>

          <div className="text-center">
            <p className="text-[12px] font-bold text-black">
              Add Custom
            </p>

            <p className="mt-0.5 text-[10px] text-[#7c839b]">
              Create a new category
            </p>
          </div>
        </button>

        {/* Existing Categories */}
        {categories.map((category) => {
          const Icon =
            getCategoryIcon(
              category.name
            );

          const styles =
            getCategoryStyles(
              category.name
            );

          return (
            <div
              key={
                category.category_id
              }
              className="group flex min-h-36 flex-col justify-between rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] duration-200 hover:border-[#d5e2f3] hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${styles.badge}`}
                >
                  <Icon size={17} />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${category.name}`}
                    title={`Edit ${category.name}`}
                    onClick={() =>
                      onEditCategoryAction(
                        category.category_id
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a92a5] transition hover:bg-[#edf3ff] hover:text-black"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${category.name}`}
                    title={`Delete ${category.name}`}
                    onClick={() =>
                      onDeleteCategoryAction(
                        category.category_id,
                        category.name
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a92a5] transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-5">
                <div className="mb-1.5 flex min-w-0 items-center gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-[12px] font-bold text-black">
                    {category.name}
                  </h3>

                  <span className="shrink-0 rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#565e74]">
                    {
                      category.category_type
                    }
                  </span>
                </div>

                <p className="line-clamp-2 text-[11px] leading-5 text-[#565e74]">
                  {category.description ||
                    category.keywords ||
                    "Custom category"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}