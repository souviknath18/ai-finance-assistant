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

  const visibleInsights = hasData
    ? insights.length >= 4
      ? insights.slice(0, 4)
      : [
          ...insights,
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
        ].slice(0, 4)
    : emptyInsights;

  const iconMap = [AlertTriangle, WalletCards, Lightbulb, MessageCircle];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/10 blur-3xl" />

      <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
            <Sparkles size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-black sm:text-lg">
              AI Financial Insights
            </h3>

            <p className="mt-0.5 text-[12px] font-medium leading-5 text-[#565e74]">
              Personalized recommendations from Aura.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
          AI Active
        </span>
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visibleInsights.map((insight, index) => {
          const Icon = iconMap[index] || Lightbulb;

          return (
            <div
              key={`${insight.title}-${index}`}
              className="rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-sm sm:p-4"
            >
              <div className="mb-2.5 flex items-start justify-between gap-3">
                <p className="text-[11px] font-bold uppercase leading-5 tracking-wide text-black sm:text-[12px]">
                  {insight.title}
                </p>

                <Icon size={16} className="shrink-0 text-emerald-600" />
              </div>

              <p className="text-[12px] leading-5 text-[#565e74] sm:text-[13px]">
                {insight.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}