type SmallBudgetInputProps = {
  label: string;
  name: string;
  value: string;
  symbol: string;
  placeholder: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function SmallBudgetInput({
  label,
  name,
  value,
  symbol,
  placeholder,
  onChange,
}: SmallBudgetInputProps) {
  return (
    <div className="rounded-2xl border border-transparent bg-[#eff4ff] p-4 transition hover:border-emerald-200">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#565e74]">
        {label}
      </span>

      <div className="mt-2 flex items-center gap-1">
        <span className="text-sm text-[#565e74]">{symbol}</span>

        <input
          name={name}
          type="number"
          min="0"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full border-none bg-transparent p-0 text-lg font-bold text-black outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}