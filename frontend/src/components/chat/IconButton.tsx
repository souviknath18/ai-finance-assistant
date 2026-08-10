type IconButtonProps = {
  icon: React.ReactNode;
};

export default function IconButton({
  icon,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-xl text-[#7c839b] transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      {icon}
    </button>
  );
}