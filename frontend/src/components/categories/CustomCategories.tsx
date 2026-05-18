import { PlusCircle, Trash2 } from "lucide-react";
import { Category } from "@/types/category";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";

type CustomCategoriesProps = {
  categories: Category[];
  onCreateCategoryAction: () => void;
  onDeleteCategoryAction: (categoryId: string) => void;
};

export default function CustomCategories({
  categories,
  onCreateCategoryAction,
  onDeleteCategoryAction,
}: CustomCategoriesProps) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Custom Categories</h2>

        <button className="text-xs font-bold uppercase tracking-wide text-emerald-700 hover:underline">
          Edit All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={onCreateCategoryAction}
          className="group flex h-40 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#c6c6cd] transition hover:border-black hover:bg-[#eff4ff]"
        >
          <PlusCircle
            size={34}
            className="text-[#76777d] transition group-hover:text-black"
          />
          <span className="text-sm font-bold text-[#565e74] group-hover:text-black">
            Add Custom
          </span>
        </button>

        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);

          return (
            <div
              key={category.category_id}
              className="group flex h-40 flex-col justify-between rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce9ff] text-black">
                  <Icon size={20} />
                </div>

                <button
                  onClick={() => onDeleteCategoryAction(category.category_id)}
                  className="rounded-lg p-2 text-[#76777d] transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-sm font-bold text-black">
                    {category.name}
                  </h3>

                  <span className="rounded-full bg-[#e5eeff] px-2.5 py-1 text-[10px] font-bold uppercase text-[#565e74]">
                    {category.category_type}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-[#565e74]">
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