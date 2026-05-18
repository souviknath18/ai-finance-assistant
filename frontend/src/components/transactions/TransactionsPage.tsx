"use client";

import { useEffect, useMemo, useState } from "react";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsFilters from "./TransactionsFilters";
import SelectedToolbar from "./SelectedToolbar";
import TransactionsTable from "./TransactionsTable";
import Pagination from "@/components/ui/Pagination";
import SpendingVelocityCard from "./SpendingVelocityCard";
import AIPulseCard from "./AIPulseCard";
import { TransactionTableItem } from "@/types/transaction";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  bulkDeleteTransactions,
  deleteTransaction,
  getTransactions,
  updateTransactionCategory,
} from "@/lib/api/transactionApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionTableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    mode: "single" as "single" | "bulk",
    transactionId: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch {
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage, rowsPerPage]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = paginatedTransactions.map((transaction) => transaction.id);

    const allVisibleSelected = visibleIds.every((id) => selectedIds.includes(id));

    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const openSingleDeleteModal = (id: string) => {
    setDeleteModal({
      open: true,
      mode: "single",
      transactionId: id,
    });
  };

  const openBulkDeleteModal = () => {
    setDeleteModal({
      open: true,
      mode: "bulk",
      transactionId: "",
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      mode: "single",
      transactionId: "",
    });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      if (deleteModal.mode === "single") {
        await deleteTransaction(deleteModal.transactionId);

        setTransactions((prev) =>
          prev.filter((transaction) => transaction.id !== deleteModal.transactionId)
        );

        setSelectedIds((prev) =>
          prev.filter((id) => id !== deleteModal.transactionId)
        );
      } else {
        await bulkDeleteTransactions(selectedIds);

        setTransactions((prev) =>
          prev.filter((transaction) => !selectedIds.includes(transaction.id))
        );

        setSelectedIds([]);
      }

      closeDeleteModal();
    } finally {
      setDeleting(false);
    }
  };

  const handleCategoryChange = async (
    transactionId: string,
    category: string
  ) => {
    const updatedTransaction = await updateTransactionCategory(
      transactionId,
      category
    );

    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === transactionId ? updatedTransaction : transaction
      )
    );
  };

  return (
    <>
      <TransactionsHeader />
      <TransactionsFilters />

      {selectedIds.length > 0 && (
        <SelectedToolbar
          selectedCount={selectedIds.length}
          onClearAction={() => setSelectedIds([])}
          onDeleteSelectedAction={openBulkDeleteModal}
        />
      )}

      <div className="overflow-visible rounded-3xl border border-[#e5eeff] bg-white shadow-sm">
        <TransactionsTable
          transactions={paginatedTransactions}
          loading={loading}
          error={error}
          selectedIds={selectedIds}
          onToggleSelectAction={toggleSelect}
          onToggleSelectAllAction={toggleSelectAllVisible}
          onDeleteAction={openSingleDeleteModal}
          onCategoryChangeAction={handleCategoryChange}
        />

        <Pagination
          total={transactions.length}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChangeAction={setCurrentPage}
          onRowsPerPageChangeAction={handleRowsPerPageChange}
        />
      </div>

      <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SpendingVelocityCard />
        <AIPulseCard />
      </section>

      <ConfirmModal
        open={deleteModal.open}
        title={
          deleteModal.mode === "single"
            ? "Delete Transaction?"
            : "Delete Selected Transactions?"
        }
        message={
          deleteModal.mode === "single"
            ? "This transaction will be permanently deleted from your database."
            : `${selectedIds.length} selected transactions will be permanently deleted from your database.`
        }
        confirmText="Delete"
        loading={deleting}
        onCloseAction={closeDeleteModal}
        onConfirmAction={handleConfirmDelete}
      />
    </>
  );
}