import { Plane } from "lucide-react";
import PrimaryGoalCard from "./PrimaryGoalCard";
import CircularGoalCard from "./CircularGoalCard";
import SmallGoalCard from "./SmallGoalCard";
import SmartAllocationCard from "./SmartAllocationCard";

export default function GoalsGrid() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
      <PrimaryGoalCard />

      <CircularGoalCard />

      <SmallGoalCard
        icon={<Plane size={20} />}
        title="Japan Trip"
        current="₹3,20,000"
        target="₹5,00,000"
        progress={64}
        note="8 months until departure"
      />

      <SmartAllocationCard />
    </section>
  );
}