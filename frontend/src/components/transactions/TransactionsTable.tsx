import { Fragment } from "react";
import TableHead from "./TableHead";
import TransactionRow from "./TransactionRow";
import UploadGroupRow from "./UploadGroupRow";
import TransactionTableSkeleton from "./TransactionTableSkeleton";
import { TransactionTableItem } from "@/types/transaction";

type TransactionsTableProps = {
  transactions: TransactionTableItem[];
  loading: boolean;
  error: string;
  selectedIds: string[];
  emptyMessage?: string;
  onToggleSelectAction: (id: string) => void;
  onToggleSelectAllAction: () => void;
  onDeleteAction: (id: string) => void;
  onCategoryChangeAction: (id: string, category: string) => void;
  onFindSimilarAction: (id: string) => void;
};

export default function TransactionsTable({
  transactions,
  loading,
  error,
  selectedIds,
  onToggleSelectAction,
  onToggleSelectAllAction,
  onDeleteAction,
  onCategoryChangeAction,
  onFindSimilarAction,
  emptyMessage = "No transactions found.",
}: TransactionsTableProps) {
  if (loading) {
    return <TransactionTableSkeleton />;
  }

  if (error) {
    return <div className="p-6 text-[13px] font-semibold text-red-600">{error}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-[13px] font-semibold text-[#565e74]">
        {emptyMessage}
      </div>
    );
  }

  const allVisibleSelected = transactions.length > 0 && transactions.every((transaction) =>
    selectedIds.includes(transaction.id)
  );

  const visibleUploadCounts = transactions.reduce<Record<string, number>>(
    (counts, transaction) => {
      counts[transaction.uploadId] =
        (counts[transaction.uploadId] || 0) + 1;

      return counts;
    },
    {}
  );

  return (
    <div className="overflow-hidden rounded-t-2xl bg-white">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full min-w-[950px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e8edf7] bg-[#f8f9ff]">
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={onToggleSelectAllAction}
                  className="h-4 w-4 rounded border-[#c6c6cd]"
                />
              </th>

              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead align="right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="center">Actions</TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {transactions.map((transaction, index) => {
              const previousTransaction = transactions[index - 1];

              const isFirstTransactionOfUpload =
                index === 0 ||
                previousTransaction.uploadId !== transaction.uploadId;

              return (
                <Fragment key={transaction.id}>
                  {isFirstTransactionOfUpload && (
                    <UploadGroupRow
                      uploadName={transaction.uploadName}
                      visibleCount={
                        visibleUploadCounts[transaction.uploadId] || 0
                      }
                      manual={transaction.uploadId === "manual"}
                    />
                  )}

                  <TransactionRow
                    transaction={transaction}
                    selected={selectedIds.includes(transaction.id)}
                    onToggleSelectAction={onToggleSelectAction}
                    onDeleteAction={onDeleteAction}
                    onCategoryChangeAction={onCategoryChangeAction}
                    onFindSimilarAction={onFindSimilarAction}
                    openDropdownUp={index >= transactions.length - 2}
                  />
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}