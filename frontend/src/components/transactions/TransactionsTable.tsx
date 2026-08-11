import { Fragment } from "react";
import {
  AlertCircle,
  ReceiptText,
} from "lucide-react";

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
  rowsPerPage?: number;
  emptyMessage?: string;

  onToggleSelectAction: (id: string) => void;
  onToggleSelectAllAction: () => void;
  onDeleteAction: (id: string) => void;
  onCategoryChangeAction: (
    id: string,
    category: string
  ) => void;
  onFindSimilarAction: (id: string) => void;
};

export default function TransactionsTable({
  transactions,
  loading,
  error,
  selectedIds,
  rowsPerPage = 5,
  emptyMessage = "No transactions found.",
  onToggleSelectAction,
  onToggleSelectAllAction,
  onDeleteAction,
  onCategoryChangeAction,
  onFindSimilarAction,
}: TransactionsTableProps) {
  if (loading) {
    return (
      <TransactionTableSkeleton
        rowsPerPage={rowsPerPage}
      />
    );
  }

  if (error) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertCircle size={18} />
        </div>

        <p className="mt-3 text-[13px] font-bold text-red-700">
          Unable to load transactions
        </p>

        <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="px-5 py-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#eff4ff] text-[#565e74]">
          <ReceiptText size={19} />
        </div>

        <p className="mt-3 text-[13px] font-bold text-black">
          No transactions found
        </p>

        <p className="mx-auto mt-1 max-w-sm text-[12px] leading-5 text-[#76777d]">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const allVisibleSelected =
    transactions.length > 0 &&
    transactions.every(
      (transaction) =>
        selectedIds.includes(
          transaction.id
        )
    );

  const visibleUploadCounts =
    transactions.reduce<
      Record<string, number>
    >(
      (
        counts,
        transaction
      ) => {
        counts[
          transaction.uploadId
        ] =
          (counts[
            transaction.uploadId
          ] || 0) + 1;

        return counts;
      },
      {}
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#dfe9ff] bg-[#eff4ff]">
            <th className="w-[52px] p-4">
              <input
                type="checkbox"
                aria-label="Select all visible transactions"
                checked={
                  allVisibleSelected
                }
                onChange={
                  onToggleSelectAllAction
                }
                className="h-4 w-4 cursor-pointer rounded border-[#c6c6cd] accent-emerald-700"
              />
            </th>

            <TableHead>
              Date
            </TableHead>

            <TableHead>
              Description
            </TableHead>

            <TableHead>
              Category
            </TableHead>

            <TableHead align="right">
              Amount
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead align="center">
              Actions
            </TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#e5eeff]">
          {transactions.map(
            (
              transaction,
              index
            ) => {
              const previousTransaction =
                transactions[
                  index - 1
                ];

              const isFirstTransactionOfUpload =
                index === 0 ||
                previousTransaction
                  .uploadId !==
                  transaction.uploadId;

              const visibleCount =
                visibleUploadCounts[
                  transaction
                    .uploadId
                ] || 0;

              return (
                <Fragment
                  key={
                    transaction.id
                  }
                >
                  {isFirstTransactionOfUpload && (
                    <UploadGroupRow
                      uploadName={
                        transaction.uploadName
                      }
                      visibleCount={
                        visibleCount
                      }
                      manual={
                        transaction.uploadId ===
                        "manual"
                      }
                    />
                  )}

                  <TransactionRow
                    transaction={
                      transaction
                    }
                    selected={selectedIds.includes(
                      transaction.id
                    )}
                    onToggleSelectAction={
                      onToggleSelectAction
                    }
                    onDeleteAction={
                      onDeleteAction
                    }
                    onCategoryChangeAction={
                      onCategoryChangeAction
                    }
                    onFindSimilarAction={
                      onFindSimilarAction
                    }
                    openDropdownUp={
                      index >=
                      transactions.length -
                        2
                    }
                  />
                </Fragment>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}