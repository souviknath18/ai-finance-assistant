import {
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Sparkles,
  WalletCards,
} from "lucide-react";

type AIInsightsCardProps = {
  insights: {
    title: string;
    description: string;
  }[];
  hasData: boolean;
};

export default function AIInsightsCard({
  insights,
  hasData,
}: AIInsightsCardProps) {
  const emptyInsights = [
    {
      title: "Upload Your First Document",
      description:
        "Add a bank statement, CSV, invoice, or salary slip to unlock AI insights.",
    },
    {
      title: "Categorize Automatically",
      description:
        "Aura will classify income, expenses, subscriptions, and unusual spending.",
    },
    {
      title: "Ask Financial Questions",
      description:
        "Once transactions are added, chat with Aura about your spending behavior.",
    },
    {
      title: "Semantic Search Ready",
      description:
        "Search your financial data naturally using AI-powered vector retrieval.",
    },
  ];

  const fallbackInsights = [
    {
      title: "Budget Opportunity",
      description:
        "Create budgets for your top spending categories to improve monthly control.",
    },
    {
      title: "Subscription Review",
      description:
        "Aura can help identify recurring payments and possible unused services.",
    },
  ];

  const visibleInsights = hasData
    ? [...insights, ...fallbackInsights].slice(0, 4)
    : emptyInsights;

  const iconMap = [
    AlertTriangle,
    WalletCards,
    Lightbulb,
    MessageCircle,
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Sparkles size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              AI Financial Insights
            </h3>

            <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
              Personalized recommendations generated from your financial
              activity.
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          AI Active
        </span>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
        {visibleInsights.map((insight, index) => {
          const Icon = iconMap[index] ?? Lightbulb;

          return (
            <div
              key={`${insight.title}-${index}`}
              className="group rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4 transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-[0_5px_16px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="min-w-0 text-[11px] font-bold uppercase leading-5 tracking-wide text-black">
                  {insight.title}
                </p>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
                  <Icon size={14} />
                </div>
              </div>

              <p className="text-[12px] leading-5 text-[#565e74]">
                {insight.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-medium text-[#7c839b]">
          {hasData
            ? "Based on your latest financial activity"
            : "Waiting for your first financial document"}
        </p>

        <button
          type="button"
          className="w-fit text-[11px] font-bold text-black transition-colors hover:text-emerald-700"
        >
          View all insights
        </button>
      </div>
    </div>
  );
}