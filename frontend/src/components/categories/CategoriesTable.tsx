"use client";

import { useMemo, useState } from "react";

import CategoryRow from "./CategoryRow";
import Pagination from "@/components/ui/Pagination";
import { CategorySummary } from "@/types/category";
import { getCategoryIcon } from "@/lib/utils/categoryIcons";

type CategoriesTableProps = {
  categories: CategorySummary[];
  loading: boolean;
};

function formatCurrency(value: string) {
  return `₹${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;
}

export default function CategoriesTable({
  categories,
  loading,
}: CategoriesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(categories.length / rowsPerPage);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return categories.slice(startIndex, startIndex + rowsPerPage);
  }, [categories, currentPage, rowsPerPage]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#dce9ff] bg-white p-6 text-[13px] font-semibold text-[#565e74] shadow-sm">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="overflow-visible rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#e5eeff] bg-[#f8f9ff] px-5 py-4">
        <h2 className="text-lg font-bold text-black">Active Categories</h2>

        <span className="text-[13px] text-[#565e74]">
          Show: <strong className="text-black">All ({categories.length})</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="bg-[#eff4ff]">
              <th className="w-12 px-5 py-3.5">
                <input type="checkbox" className="h-4 w-4 rounded" />
              </th>

              <TableHead>Category</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Total Spending</TableHead>
              <TableHead>Income</TableHead>
              <TableHead align="right">Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {paginatedCategories.map((category) => (
              <CategoryRow
                key={category.name}
                category={{
                  name: category.name,
                  icon: getCategoryIcon(category.name),
                  transactions: category.transactions,
                  spending: formatCurrency(category.spending),
                  income: formatCurrency(category.income),
                  highlighted: category.name !== "Uncategorized",
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        total={categories.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        itemLabel="categories"
        onPageChangeAction={setCurrentPage}
        onRowsPerPageChangeAction={handleRowsPerPageChange}
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
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}