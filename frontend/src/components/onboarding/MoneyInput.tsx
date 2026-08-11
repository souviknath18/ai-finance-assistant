type MoneyInputProps = {
  label: string;
  name: string;
  value: string;
  symbol: string;
  placeholder: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function MoneyInput({
  label,
  name,
  value,
  symbol,
  placeholder,
  onChange,
}: MoneyInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="ml-0.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b]">
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-[#565e74]">
          {symbol}
        </span>

        <input
          name={name}
          type="number"
          min="0"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-[#dfe9fb] bg-white pl-8 pr-3 text-[13px] font-medium text-[#0b1c30] outline-none transition-[border-color,box-shadow] placeholder:text-[#8a92a5] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
    </div>
  );
}