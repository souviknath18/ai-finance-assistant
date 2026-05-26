type PaginationButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
};

export default function PaginationButton({
  children,
  disabled = false,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-[#c6c6cd] px-2.5 py-1.5 text-[11px] font-bold text-black transition hover:bg-[#e5eeff] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}