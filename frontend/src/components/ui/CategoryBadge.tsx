import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type CategoryBadgeProps = {
  category: string;
};

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
        getCategoryStyles(category).badge
      }`}
    >
      {category}
    </span>
  );
}