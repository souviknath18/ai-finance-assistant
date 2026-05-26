import { Edit, GitMerge, Trash2 } from "lucide-react";

type CategoryRowProps = {
  category: {
    name: string;
    icon: React.ElementType;
    transactions: number;
    spending: string;
    income: string;
    highlighted?: boolean;
  };
};

export default function CategoryRow({ category }: CategoryRowProps) {
  const Icon = category.icon;

  return (
    <tr className="group transition hover:bg-[#eff4ff]">
      <td className="px-5 py-4">
        <input type="checkbox" className="h-4 w-4 rounded" />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              category.highlighted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-[#e5eeff] text-[#565e74]"
            }`}
          >
            <Icon size={18} />
          </div>

          <span className="text-[13px] font-bold text-black">
            {category.name}
          </span>
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
          <ActionButton icon={<Edit size={15} />} />
          <ActionButton icon={<GitMerge size={15} />} />
          <ActionButton icon={<Trash2 size={15} />} danger />
        </div>
      </td>
    </tr>
  );
}

function ActionButton({
  icon,
  danger = false,
}: {
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      className={`rounded-lg p-1.5 transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#565e74] hover:bg-[#dce9ff] hover:text-black"
      }`}
    >
      {icon}
    </button>
  );
}