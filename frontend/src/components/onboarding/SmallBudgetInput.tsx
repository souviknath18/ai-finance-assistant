type SmallBudgetInputProps = {
  label: string;
  name: string;
  value: string;
  symbol: string;
  placeholder: string;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
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
    <div className="group rounded-2xl border border-[#e3eaf6] bg-[#fbfcff] p-3.5 transition-[border-color,background-color,box-shadow] duration-200 hover:border-[#d3def0] hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.04)] focus-within:border-emerald-200 focus-within:bg-white focus-within:shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
      {/* Label */}
      <label
        htmlFor={name}
        className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]"
      >
        {label}
      </label>

      {/* Amount */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="shrink-0 text-[13px] font-semibold text-[#7c839b]">
          {symbol}
        </span>

        <input
          id={name}
          name={name}
          type="number"
          min="0"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="min-w-0 flex-1 border-none bg-transparent p-0 text-[15px] font-bold tracking-tight text-black outline-none placeholder:font-medium placeholder:text-[#a1a8b8] focus:ring-0"
        />
      </div>

      {/* Helper */}
      <p className="mt-1.5 text-[9px] font-medium text-[#9aa1b2]">
        Monthly budget
      </p>
    </div>
  );
}