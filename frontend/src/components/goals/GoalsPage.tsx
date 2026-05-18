import GoalsHeader from "./GoalsHeader";
import AIMomentumCard from "./AIMomentumCard";
import GoalsGrid from "./GoalsGrid";
import LoanRepaymentCard from "./LoanRepaymentCard";

export default function GoalsPage() {
  return (
    <>
      <GoalsHeader />
      <AIMomentumCard />
      <GoalsGrid />
      <LoanRepaymentCard />
    </>
  );
}