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
import { Category, CategorySummary } from "@/types/category";
import {
  deleteCategory,
  getCategories,
  getCategorySummary,
} from "@/lib/api/categoryApi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    categoryId: "",
  });

  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      const [summaryData, categoryData] = await Promise.all([
        getCategorySummary(),
        getCategories(),
      ]);

      setCategories(summaryData);
      setCustomCategories(categoryData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openDeleteModal = (categoryId: string) => {
    setDeleteModal({
      open: true,
      categoryId,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      categoryId: "",
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

  return (
    <>
      <CategoriesHeader
        onCreateCategoryAction={() => setCreateModalOpen(true)}
      />

      <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <MonthlyDistributionCard categories={categories} />
        <CategoryAIInsights categories={categories} />
      </section>

      <CategoriesTable categories={categories} loading={loading} />

      <CustomCategories
        categories={customCategories}
        onCreateCategoryAction={() => setCreateModalOpen(true)}
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
        message="This category will be hidden from your active categories, but historical transactions will remain unchanged."
        confirmText="Delete"
        loading={deleting}
        onCloseAction={closeDeleteModal}
        onConfirmAction={handleDeleteCategory}
      />
    </>
  );
}