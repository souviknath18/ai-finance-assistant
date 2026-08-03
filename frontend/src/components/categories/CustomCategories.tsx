import { Edit, PlusCircle, Trash2 } from "lucide-react";
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
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">
          Custom Categories
        </h2>

        <button
          type="button"
          className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 hover:underline"
        >
          Edit All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={onCreateCategoryAction}
          className="group flex h-32 flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-[#dfe9fb] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-black hover:bg-[#eff4ff] hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
        >
          <PlusCircle
            size={28}
            className="text-[#76777d] transition group-hover:text-black"
          />

          <span className="text-[13px] font-bold text-[#565e74] group-hover:text-black">
            Add Custom
          </span>
        </button>

        {categories.map((category) => {
          const Icon = getCategoryIcon(
            category.name
          );

          const styles = getCategoryStyles(
            category.name
          );

          return (
            <div
              key={category.category_id}
              className="group flex h-32 flex-col justify-between rounded-2xl border border-[#dfe9fb] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] duration-200 hover:border-[#c7d8f7] hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.badge}`}
                >
                  <Icon size={18} />
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
                    className="rounded-lg p-1.5 text-[#76777d] transition hover:bg-[#eff4ff] hover:text-black"
                  >
                    <Edit size={15} />
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
                    className="rounded-lg p-1.5 text-[#76777d] transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <h3 className="truncate text-[13px] font-bold text-black">
                    {category.name}
                  </h3>

                  <span className="shrink-0 rounded-full bg-[#e5eeff] px-2 py-0.5 text-[10px] font-bold uppercase text-[#565e74]">
                    {category.category_type}
                  </span>
                </div>

                <p className="line-clamp-2 text-[13px] leading-5 text-[#565e74]">
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