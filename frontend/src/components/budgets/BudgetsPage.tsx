import BudgetHeader from "./BudgetsHeader";
import AIRecommendationCard from "./AIRecommendationCard";
import BudgetGrid from "./BudgetGrid";
import QuickEditSection from "./QuickEditSection";

export default function BudgetsPage() {
  return (
    <>
      <BudgetHeader />
      <AIRecommendationCard />
      <BudgetGrid />
      <QuickEditSection />
    </>
  );
}