import { Edit, GitMerge, Trash2 } from "lucide-react";
import { getCategoryStyles } from "@/lib/utils/categoryStyles";

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
  const styles = getCategoryStyles(category.name);

  const actionsDisabled =
    category.isSystem || !category.categoryId;

  return (
    <tr className="group transition hover:bg-[#eff4ff]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.badge}`}
          >
            <Icon size={18} />
          </div>

          <div>
            <span className="text-[13px] font-bold text-black">
              {category.name}
            </span>

            {category.isSystem && (
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#76777d]">
                System category
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 text-[13px] text-[#565e74]">
        {category.transactions}
      </td>

      <td className="px-5 py-4 text-[13px] font-bold text-black">
        {category.spending}
      </td>

      <td className="px-5 py-4 text-[13px] font-bold text-emerald-700">
        {category.income}
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2 opacity-70 transition group-hover:opacity-100">
          <ActionButton
            icon={<Edit size={15} />}
            ariaLabel={`Edit ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be edited"
                : `Edit ${category.name}`
            }
            disabled={actionsDisabled}
          />

          <ActionButton
            icon={<GitMerge size={15} />}
            ariaLabel={`Merge ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be merged"
                : `Merge ${category.name}`
            }
            disabled={actionsDisabled}
            onClick={() => {
              if (!category.categoryId) return;

              onMergeCategoryAction(
                category.categoryId,
                category.name
              );
            }}
          />

          <ActionButton
            icon={<Trash2 size={15} />}
            ariaLabel={`Delete ${category.name}`}
            title={
              category.isSystem
                ? "System categories cannot be deleted"
                : `Delete ${category.name}`
            }
            danger
            disabled={actionsDisabled}
            onClick={() => {
              if (!category.categoryId) return;

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
      className={`rounded-lg p-1.5 transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#565e74] hover:bg-[#dce9ff] hover:text-black"
      } disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-inherit`}
    >
      {icon}
    </button>
  );
}