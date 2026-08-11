import {
  Edit,
  GitMerge,
  Trash2,
} from "lucide-react";

import {
  getCategoryStyles,
} from "@/lib/utils/categoryStyles";

type CategoryRowProps = {
  category: {
    categoryId?: string;
    isSystem: boolean;
    name: string;
    icon: React.ElementType;
    transactions: number;
    spending: string;
    income: string;
  };
  onMergeCategoryAction: (
    categoryId: string,
    categoryName: string
  ) => void;
  onDeleteCategoryAction: (
    categoryId: string,
    categoryName: string
  ) => void;
};

export default function CategoryRow({
  category,
  onMergeCategoryAction,
  onDeleteCategoryAction,
}: CategoryRowProps) {
  const Icon = category.icon;

  const styles = getCategoryStyles(
    category.name
  );

  const actionsDisabled =
    category.isSystem ||
    !category.categoryId;

  return (
    <tr className="group transition-colors duration-200 hover:bg-[#fbfcff]">
      {/* Category */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.badge}`}
          >
            <Icon size={16} />
          </div>

          <div className="min-w-0">
            <span className="block truncate text-[12px] font-bold text-black">
              {category.name}
            </span>

            {category.isSystem && (
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#8a92a5]">
                System Category
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Transactions */}
      <td className="px-5 py-3.5">
        <span className="text-[12px] font-medium text-[#565e74]">
          {category.transactions}
        </span>
      </td>

      {/* Spending */}
      <td className="px-5 py-3.5">
        <span className="text-[12px] font-bold text-black">
          {category.spending}
        </span>
      </td>

      {/* Income */}
      <td className="px-5 py-3.5">
        <span className="text-[12px] font-bold text-emerald-700">
          {category.income}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            icon={<Edit size={14} />}
            ariaLabel={`Edit ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be edited"
                : `Edit ${category.name}`
            }
            disabled={actionsDisabled}
          />

          <ActionButton
            icon={<GitMerge size={14} />}
            ariaLabel={`Merge ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be merged"
                : `Merge ${category.name}`
            }
            disabled={actionsDisabled}
            onClick={() => {
              if (!category.categoryId) {
                return;
              }

              onMergeCategoryAction(
                category.categoryId,
                category.name
              );
            }}
          />

          <ActionButton
            icon={<Trash2 size={14} />}
            ariaLabel={`Delete ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be deleted"
                : `Delete ${category.name}`
            }
            danger
            disabled={actionsDisabled}
            onClick={() => {
              if (!category.categoryId) {
                return;
              }

              onDeleteCategoryAction(
                category.categoryId,
                category.name
              );
            }}
          />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  icon,
  danger = false,
  ariaLabel,
  title,
  disabled = false,
  onClick,
}: {
  icon: React.ReactNode;
  danger?: boolean;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-[background-color,color,opacity] duration-200 ${
        danger
          ? "text-[#8a92a5] hover:bg-red-50 hover:text-red-600"
          : "text-[#8a92a5] hover:bg-[#edf3ff] hover:text-black"
      } disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8a92a5]`}
    >
      {icon}
    </button>
  );
}