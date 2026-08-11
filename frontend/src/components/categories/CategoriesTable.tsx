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
    <div className="mb-6 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#edf2fb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-black">
            Category Summary
          </h2>

          <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
            Spending and income grouped by transaction category.
          </p>
        </div>

        <span className="text-[11px] text-[#565e74]">
          <strong className="font-bold text-black">
            {totalCount}
          </strong>{" "}
          categor{totalCount === 1 ? "y" : "ies"} with transactions
        </span>
      </div>

      {loading ? (
        <CategoryTableSkeleton
          rowsPerPage={rowsPerPage}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#fbfcff]">
                <TableHead>
                  Category
                </TableHead>

                <TableHead>
                  Transactions
                </TableHead>

                <TableHead>
                  Total Spending
                </TableHead>

                <TableHead>
                  Income
                </TableHead>

                <TableHead align="right">
                  Actions
                </TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#edf2fb]">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-bold text-black">
                      No category summary
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                      Category totals will appear here once transactions are available.
                    </p>
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
                      name:
                        category.name,
                      icon:
                        getCategoryIcon(
                          category.name
                        ),
                      transactions:
                        category.transactions,
                      spending:
                        formatCurrency(
                          category.spending
                        ),
                      income:
                        formatCurrency(
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

      {/* Pagination */}
      <div className="border-t border-[#edf2fb] bg-[#fbfcff]">
        <Pagination
          total={totalCount}
          currentPage={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          itemLabel="categories"
          onPageChangeAction={
            onPageChangeAction
          }
          onRowsPerPageChangeAction={
            onRowsPerPageChangeAction
          }
        />
      </div>
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
      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}