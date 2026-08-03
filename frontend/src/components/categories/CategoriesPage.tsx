"use client";

import { useEffect, useState } from "react";

import CategoriesHeader from "./CategoriesHeader";
import MonthlyDistributionCard from "./MonthlyDistributionCard";
import CategoryAIInsights from "./CategoryAIInsights";
import CategoriesTable from "./CategoriesTable";
import CustomCategories from "./CustomCategories";
import MergeWorkflowCard from "./MergeWorkflowCard";
import CreateCategoryModal from "./CreateCategoryModal";
import ConfirmModal from "../ui/ConfirmModal";
import MergeCategoryModal from "./MergeCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { Category, CategoryDistributionItem, CategorySummary } from "@/types/category";
import {
  deleteCategory,
  getCategories,
  getCategoryDistribution,
  getCategoryOptions,
  getCategorySummary,
} from "@/lib/api/categoryApi";
import PageLoader from "@/components/ui/PageLoader";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistributionItem[]>([]);
  const [distributionMonth, setDistributionMonth] = useState("");
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    categoryId: "",
    categoryName: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [mergeModal, setMergeModal] = useState({
    open: false,
    categoryId: "",
    categoryName: "",
  });
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    const isFirstLoad = pageLoading;
    setTableLoading(!isFirstLoad);

    try {
      const [
        summaryData,
        categoryData,
        distributionData,
        categoryOptionsData,
      ] = await Promise.all([
        getCategorySummary({
          page,
          pageSize: rowsPerPage,
        }),
        getCategories(),
        getCategoryDistribution(5),
        getCategoryOptions(),
      ]);

      setCategories(
        summaryData.results
      );

      setTotalCount(
        summaryData.count
      );

      setTotalPages(
        summaryData.total_pages
      );

      setCustomCategories(
        categoryData
      );

      setCategoryDistribution(
        distributionData.results
      );

      setCategoryOptions(
        categoryOptionsData
      );

      setDistributionMonth(
        distributionData.month_label
      );
    } finally {
      setPageLoading(false);
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, rowsPerPage]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const openDeleteModal = (
    categoryId: string,
    categoryName: string
  ) => {
    setDeleteModal({
      open: true,
      categoryId,
      categoryName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      categoryId: "",
      categoryName: "",
    });
  };

  const handleDeleteCategory = async () => {
    setDeleting(true);

    try {
      await deleteCategory(deleteModal.categoryId);

      setCustomCategories((prev) =>
        prev.filter(
          (category) => category.category_id !== deleteModal.categoryId
        )
      );

      closeDeleteModal();
    } finally {
      setDeleting(false);
    }
  };

  const openMergeModal = (
    categoryId: string,
    categoryName: string
  ) => {
    if (!categoryId) {
      return;
    }

    setMergeModal({
      open: true,
      categoryId,
      categoryName,
    });
  };

  const closeMergeModal = () => {
    setMergeModal({
      open: false,
      categoryId: "",
      categoryName: "",
    });
  };

  const handleMergeSuccess = async () => {
    closeMergeModal();
    await loadCategories();
  };

  const openEditModal = (
    categoryId: string
  ) => {
    const selectedCategory =
      customCategories.find(
        (category) =>
          category.category_id ===
          categoryId
      );

    if (!selectedCategory) {
      return;
    }

    setEditCategory(
      selectedCategory
    );
  };

  const closeEditModal = () => {
    setEditCategory(null);
  };

  const handleEditSuccess = async () => {
    await loadCategories();
  };

  if (pageLoading) {
    return <PageLoader message="Loading categories..." />;
  }

  return (
    <>
      <CategoriesHeader
        onCreateCategoryAction={() => setCreateModalOpen(true)}
      />

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <MonthlyDistributionCard
          categories={categoryDistribution}
          monthLabel={distributionMonth}
        />
        <CategoryAIInsights categories={categories} />
      </section>

      <CategoriesTable
        categories={categories}
        loading={tableLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChangeAction={setPage}
        onRowsPerPageChangeAction={
          handleRowsPerPageChange
        }
        onMergeCategoryAction={
          openMergeModal
        }
        onDeleteCategoryAction={
          openDeleteModal
        }
      />

      <CustomCategories
        categories={customCategories}
        onCreateCategoryAction={() =>
          setCreateModalOpen(true)
        }
        onEditCategoryAction={openEditModal}
        // onMergeCategoryAction={openMergeModal}
        onDeleteCategoryAction={openDeleteModal}
      />

      <MergeWorkflowCard />

      <CreateCategoryModal
        open={createModalOpen}
        onCloseAction={() => setCreateModalOpen(false)}
        onSuccessAction={loadCategories}
      />

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Category?"
        message={`"${deleteModal.categoryName}" will be hidden from active categories. Historical transactions will remain unchanged.`}
        confirmText="Delete Category"
        loading={deleting}
        onCloseAction={closeDeleteModal}
        onConfirmAction={handleDeleteCategory}
      />

      <MergeCategoryModal
        open={mergeModal.open}
        sourceCategoryId={
          mergeModal.categoryId
        }
        sourceCategoryName={
          mergeModal.categoryName
        }
        categories={categoryOptions}
        onCloseAction={closeMergeModal}
        onSuccessAction={handleMergeSuccess}
      />

      <EditCategoryModal
        open={Boolean(editCategory)}
        category={editCategory}
        onCloseAction={closeEditModal}
        onSuccessAction={handleEditSuccess}
      />
    </>
  );
}