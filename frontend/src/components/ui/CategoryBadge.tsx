import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type CategoryBadgeProps = {
  category: string;
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  const styles = getCategoryStyles(category);

  return (
    <span
      className={`inline-flex max-w-full items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold leading-none ${styles.badge}`}
    >
      {category}
    </span>
  );
}