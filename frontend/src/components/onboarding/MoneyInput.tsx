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
    <div className="space-y-1">
      <label className="ml-1 text-sm text-[#565e74]">{label}</label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565e74]">
          {symbol}
        </span>

        <input
          name={name}
          type="number"
          min="0"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-[50px] w-full rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] pl-10 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>
    </div>
  );
}