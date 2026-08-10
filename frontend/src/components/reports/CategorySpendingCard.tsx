type Category = {
  label: string;
  value: string;
  width: string;
};

type CategorySpendingCardProps = {
  categories: Category[];
};

const progressStyles = [
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-[#9fb7d7]",
  "bg-[#c8d8ef]",
];

export default function CategorySpendingCard({
  categories,
}: CategorySpendingCardProps) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Spending Analysis
        </p>

        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
          Spending by Category
        </h2>
      </div>

      {categories.length ===
      0 ? (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-5 text-center">
          <p className="text-[12px] text-[#565e74]">
            No category spending data available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(
            (
              category,
              index
            ) => (
              <div
                key={
                  category.label
                }
              >
                <div className="mb-2 flex justify-between gap-3">
                  <span className="text-[11px] font-bold text-black">
                    {
                      category.label
                    }
                  </span>

                  <span className="text-[11px] font-bold text-[#565e74]">
                    {
                      category.value
                    }
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
                  <div
                    className={`h-full rounded-full ${
                      progressStyles[
                        index %
                          progressStyles.length
                      ]
                    }`}
                    style={{
                      width:
                        category.width,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}