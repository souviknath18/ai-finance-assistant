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
};

function formatCurrency(value: string) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
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
}: CategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e5eeff] bg-[#f8f9ff] px-5 py-4">
        <h2 className="text-lg font-bold text-black">
          Active Categories
        </h2>

        <span className="text-[13px] text-[#565e74]">
          Show:{" "}
          <strong className="text-black">
            All ({totalCount})
          </strong>
        </span>
      </div>

      {loading ? (
        <CategoryTableSkeleton rowsPerPage={rowsPerPage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-[#eff4ff]">
                <th className="w-12 px-5 py-3.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                  />
                </th>

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
                    colSpan={6}
                    className="px-5 py-8 text-center text-[13px] font-semibold text-[#565e74]"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <CategoryRow
                    key={category.name}
                    category={{
                      name: category.name,
                      icon: getCategoryIcon(category.name),
                      transactions: category.transactions,
                      spending: formatCurrency(category.spending),
                      income: formatCurrency(category.income),
                      highlighted:
                        category.name !== "Uncategorized",
                    }}
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