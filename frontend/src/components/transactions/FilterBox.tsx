type FilterBoxProps = {
  label: string;
  value: string;
  icon?: React.ReactNode;
};

export default function FilterBox({ label, value, icon }: FilterBoxProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </label>

      <button className="flex w-full items-center gap-3 rounded-xl border border-[#c6c6cd] bg-white px-4 py-3 text-left text-sm text-black">
        {icon}
        <span>{value}</span>
      </button>
    </div>
  );
}