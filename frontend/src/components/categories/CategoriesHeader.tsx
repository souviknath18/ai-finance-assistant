"use client";

import { GitMerge, Plus } from "lucide-react";

type CategoriesHeaderProps = {
  onCreateCategoryAction: () => void;
};

export default function CategoriesHeader({
  onCreateCategoryAction,
}: CategoriesHeaderProps) {
  return (
    <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          Categories
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Manage and organize your spending classifications.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-[#dce9ff] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d3e4fe]">
          <GitMerge size={17} />
          Merge Categories
        </button>

        <button
          onClick={onCreateCategoryAction}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          <Plus size={17} />
          Create Category
        </button>
      </div>
    </section>
  );
}