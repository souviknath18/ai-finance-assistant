import { BadgeCheck, Edit, Flag, Trash2 } from "lucide-react";

export default function DetailsHeader() {
  return (
    <section className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
          <BadgeCheck size={16} />
          AI Verified Transaction
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl">
          CloudScale AI Services
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton icon={<Edit size={17} />} label="Edit Details" />
        <ActionButton icon={<Flag size={17} />} label="Flag for Review" />

        <button className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
          <Trash2 size={17} />
          Delete
        </button>
      </div>
    </section>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 rounded-xl border border-[#c6c6cd] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]">
      {icon}
      {label}
    </button>
  );
}