import CategoryRow from "./CategoryRow";
import Pagination from "@/components/ui/Pagination";
import CategoryTableSkeleton from "./CategoryTableSkeleton";
import { CategorySummary } from "@/types/category";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";

type CategoriesTableProps = {
  categories: CategorySummary[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
  onRowsPerPageChangeAction: (value: number) => void;
  onMergeCategoryAction: (
    categoryId: string,
    categoryName: string
  ) => void;
  onDeleteCategoryAction: (
    categoryId: string,
    categoryName: string
  ) => void;
};

function formatCurrency(value: string) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0.00";
  }

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CategoriesTable({
  categories,
  loading,
  page,
  rowsPerPage,
  totalCount,
  totalPages,
  onPageChangeAction,
  onRowsPerPageChangeAction,
  onMergeCategoryAction,
  onDeleteCategoryAction,
}: CategoriesTableProps) {
  return (
    <div className="overflow-visible rounded-2xl border border-[#dfe9fb] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-2 rounded-t-2xl border-b border-[#e5eeff] bg-[#f8f9ff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-black">
            Category Summary
          </h2>

          <p className="mt-1 text-[12px] text-[#76777d]">
            Spending and income grouped by transaction category.
          </p>
        </div>

        <span className="text-[13px] text-[#565e74]">
          <strong className="text-black">
            {totalCount}
          </strong>{" "}
          categor{totalCount === 1 ? "y" : "ies"} with transactions
        </span>
      </div>

      {loading ? (
        <CategoryTableSkeleton rowsPerPage={rowsPerPage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#eff4ff]">
                <TableHead>Category</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Total Spending</TableHead>
                <TableHead>Income</TableHead>
                <TableHead align="right">Actions</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5eeff]">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-[13px] font-semibold text-[#565e74]"
                  >
                    No category summary is available yet.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <CategoryRow
                    key={category.name}
                    category={{
                      categoryId:
                        category.category_id ||
                        undefined,
                      isSystem:
                        category.is_system,
                      name: category.name,
                      icon: getCategoryIcon(
                        category.name
                      ),
                      transactions:
                        category.transactions,
                      spending: formatCurrency(
                        category.spending
                      ),
                      income: formatCurrency(
                        category.income
                      ),
                    }}
                    onMergeCategoryAction={
                      onMergeCategoryAction
                    }
                    onDeleteCategoryAction={
                      onDeleteCategoryAction
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        total={totalCount}
        currentPage={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        itemLabel="categories"
        onPageChangeAction={onPageChangeAction}
        onRowsPerPageChangeAction={onRowsPerPageChangeAction}
      />
    </div>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}