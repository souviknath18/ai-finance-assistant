"use client";

import { useEffect, useState } from "react";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsFilters from "./TransactionsFilters";
import SelectedToolbar from "./SelectedToolbar";
import TransactionsTable from "./TransactionsTable";
import Pagination from "@/components/ui/Pagination";
import SpendingVelocityCard from "./SpendingVelocityCard";
import AIPulseCard from "./AIPulseCard";
import {
  TransactionTableItem,
  GetTransactionsParams,
} from "@/types/transaction";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  bulkDeleteTransactions,
  deleteTransaction,
  getTransactions,
  updateTransactionCategory,
} from "@/lib/api/transactionApi";
import { semanticSearchTransactions, findSimilarTransactions  } from "@/lib/api/searchApi";
import SemanticSearchBanner from "./SemanticSearchBanner";
import { getCategoryOptions } from "@/lib/api/categoryApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionTableItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [semanticMode, setSemanticMode] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
    transactionType: "all",
    statusFilter: "all",
  });
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Categories", value: "all" },
  ]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);

      try {
        const params: GetTransactionsParams = {
          page: currentPage,
          pageSize: rowsPerPage,
          category: filters.category,
          transactionType: filters.transactionType,
          statusFilter: filters.statusFilter,
          startDate: filters.startDate,
          endDate: filters.endDate,
        };

        if (!semanticMode && searchQuery.trim()) {
          params.search = searchQuery;
        }

        const data = await getTransactions(params);

        setTransactions(data.results);
        setTotalCount(data.count);
        setTotalPages(data.totalPages);

        const categories = await getCategoryOptions();

        setCategoryOptions([
          { label: "All Categories", value: "all" },
          ...categories.map((category) => ({
            label: category.name,
            value: category.name,
          })),
        ]);
      } catch {
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [
    currentPage,
    rowsPerPage,
    filters,
    semanticMode,
  ]);

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
    const visibleIds = transactions.map((transaction) => transaction.id);

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

  const handleSemanticSearch = async (queryOverride?: string) => {
    const query = queryOverride || searchQuery;

    if (!query.trim()) return;

    setSearching(true);

    try {
      const results = await semanticSearchTransactions(query);

      const matchedIds = results.map((result) => result.transaction_id);

      const matchedTransactions = transactions.filter((transaction) =>
        matchedIds.includes(transaction.id)
      );

      setTransactions(matchedTransactions);
      setSearchQuery(query);
      setSemanticMode(true);
      setCurrentPage(1);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSemanticMode(false);
    setCurrentPage(1);
  };

  const handleFindSimilar = async (transactionId: string) => {
    setSearching(true);

    try {
      const results = await findSimilarTransactions(transactionId);

      const matchedIds = results.map((result) => result.transaction_id);

      const matchedTransactions = transactions.filter((transaction) =>
        matchedIds.includes(transaction.id)
      );

      setTransactions(matchedTransactions);
      setSearchQuery("Similar transactions");
      setSemanticMode(true);
      setCurrentPage(1);
    } finally {
      setSearching(false);
    }
  };

  const handleQuickSearch = async (query: string) => {
    await handleSemanticSearch(query);
  };

  return (
    <>
      <TransactionsHeader />
      <TransactionsFilters
        searchQuery={searchQuery}
        semanticMode={semanticMode}
        searching={searching}
        startDate={filters.startDate}
        endDate={filters.endDate}
        category={filters.category}
        transactionType={filters.transactionType}
        statusFilter={filters.statusFilter}
        onSearchQueryChangeAction={setSearchQuery}
        onSemanticSearchAction={handleSemanticSearch}
        onQuickSearchAction={handleQuickSearch}
        onClearSearchAction={handleClearSearch}
        onFilterChangeAction={handleFilterChange}
        categoryOptions={categoryOptions}
      />

      {selectedIds.length > 0 && (
        <SelectedToolbar
          selectedCount={selectedIds.length}
          onClearAction={() => setSelectedIds([])}
          onDeleteSelectedAction={openBulkDeleteModal}
        />
      )}

      {semanticMode && (
        <SemanticSearchBanner
          query={searchQuery}
          count={transactions.length}
          onClearAction={handleClearSearch}
        />
      )}

      <div className="overflow-visible rounded-2xl border border-[#e5eeff] bg-white shadow-sm">
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          error={error}
          selectedIds={selectedIds}
          onToggleSelectAction={toggleSelect}
          onToggleSelectAllAction={toggleSelectAllVisible}
          onDeleteAction={openSingleDeleteModal}
          onCategoryChangeAction={handleCategoryChange}
          onFindSimilarAction={handleFindSimilar}
          emptyMessage={
            totalCount === 0
              ? "No transactions found. Upload a bank statement first."
              : semanticMode
              ? "No matching transactions found for your semantic search."
              : "No transactions found for the selected filters."
          }
        />
        
        <Pagination
          total={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChangeAction={setCurrentPage}
          onRowsPerPageChangeAction={handleRowsPerPageChange}
        />
      </div>

      <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
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