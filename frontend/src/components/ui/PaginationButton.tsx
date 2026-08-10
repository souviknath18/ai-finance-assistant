type PaginationButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function PaginationButton({
  children,
  disabled = false,
  onClick,
  ariaLabel,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#dfe9fb] bg-white px-2.5 text-[11px] font-bold text-black transition-[background-color,border-color] hover:border-[#c9d9f3] hover:bg-[#f8f9ff] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}