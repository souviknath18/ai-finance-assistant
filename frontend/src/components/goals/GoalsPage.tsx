"use client";

import { useEffect, useState } from "react";

import GoalsHeader from "./GoalsHeader";
import AIMomentumCard from "./AIMomentumCard";
import GoalsGrid from "./GoalsGrid";
import LoanRepaymentCard from "./LoanRepaymentCard";
import CreateGoalModal from "./CreateGoalModal";
import PageLoader from "@/components/ui/PageLoader";

import { GoalItem, GoalsDashboard } from "@/types/goal";
import { Category } from "@/types/category";
import { deleteGoal, getGoalsDashboard } from "@/lib/api/goalsApi";
import { getCategoryOptions } from "@/lib/api/categoryApi";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AddFundsModal from "./AddFundsModal";

export default function GoalsPage() {
  const [data, setData] = useState<GoalsDashboard | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    goal: GoalItem | null;
  }>({
    open: false,
    goal: null,
  });

  const [deleting, setDeleting] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [addFundsGoal, setAddFundsGoal] = useState<GoalItem | null>(null);

  const goals = data?.goals || [];
  const debtGoals = goals.filter((goal) => goal.goal_type === "debt");

  const loadGoals = async () => {
    const result = await getGoalsDashboard();
    setData(result);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const [goalsData, categoriesData] = await Promise.all([
          getGoalsDashboard(),
          getCategoryOptions(),
        ]);

        setData(goalsData);
        setCategoryOptions(categoriesData);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleAddFunds = (goal: GoalItem) => {
    setAddFundsGoal(goal);
  };

  const handleEditGoal = (goal: GoalItem) => {
    setEditingGoal(goal);
    setCreateModalOpen(true);
  };

  const handleDeleteGoal = (goal: GoalItem) => {
    setDeleteModal({
      open: true,
      goal,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      goal: null,
    });
  };

  const confirmDeleteGoal = async () => {
    if (!deleteModal.goal) return;

    setDeleting(true);

    try {
      await deleteGoal(deleteModal.goal.goal_id);
      await loadGoals();
      closeDeleteModal();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading goals..." />;
  }

  return (
    <>
      <GoalsHeader
        onCreateGoalAction={() => {
          setEditingGoal(null);
          setCreateModalOpen(true);
        }}
      />

      <AIMomentumCard
        message={data?.ai_momentum.message}
        actionLabel={data?.ai_momentum.action_label}
      />

      {goals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c6c6cd] bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-black">No goals created yet</h3>

          <p className="mt-2 text-[13px] text-[#565e74]">
            Create your first financial goal to start tracking progress with Aura.
          </p>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-5 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
          >
            Create Goal
          </button>
        </div>
      ) : (
        <>
          <GoalsGrid
            goals={goals}
            onAddFundsAction={handleAddFunds}
            onEditAction={handleEditGoal}
            onDeleteAction={handleDeleteGoal}
          />

          {debtGoals.length > 0 && <LoanRepaymentCard goals={debtGoals} />}
        </>
      )}

      <CreateGoalModal
        open={createModalOpen}
        categories={categoryOptions}
        editingGoal={editingGoal}
        onCloseAction={() => {
          setCreateModalOpen(false);
          setEditingGoal(null);
        }}
        onSuccessAction={loadGoals}
      />

      <ConfirmModal
        open={deleteModal.open}
        title="Delete Goal?"
        message={`Are you sure you want to delete "${
          deleteModal.goal?.title || "this goal"
        }"? This action cannot be undone.`}
        confirmText="Delete Goal"
        loading={deleting}
        onCloseAction={closeDeleteModal}
        onConfirmAction={confirmDeleteGoal}
      />

      <AddFundsModal
        open={!!addFundsGoal}
        goal={addFundsGoal}
        onCloseAction={() => setAddFundsGoal(null)}
        onSuccessAction={loadGoals}
      />
    </>
  );
}