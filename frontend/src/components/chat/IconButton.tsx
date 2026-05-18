type IconButtonProps = {
  icon: React.ReactNode;
};

export default function IconButton({ icon }: IconButtonProps) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#565e74] transition hover:bg-[#e5eeff] hover:text-black">
      {icon}
    </button>
  );
}