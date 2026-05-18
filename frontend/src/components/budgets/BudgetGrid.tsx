import {
  Home,
  Plane,
  ShoppingBag,
  Repeat,
  MoreHorizontal,
} from "lucide-react";

import LargeBudgetCard from "./LargeBudgetCard";
import BudgetCard from "./BudgetCard";
import OtherBudgetCard from "./OtherBudgetCard";

export default function BudgetGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <LargeBudgetCard />

      <BudgetCard
        icon={<Home size={20} />}
        title="Rent & Housing"
        subtitle="Monthly fixed cost"
        amount="₹2,45,000"
        progress={100}
        badge="Fixed"
        className="md:col-span-4"
      />

      <BudgetCard
        icon={<Plane size={20} />}
        title="Travel"
        subtitle="Includes commute & leisure"
        amount="₹48,500"
        progress={97}
        badge="Critical"
        warning="You are ₹1,500 away from your limit."
        tone="red"
        className="md:col-span-4"
      />

      <BudgetCard
        icon={<ShoppingBag size={20} />}
        title="Shopping"
        subtitle="Lifestyle purchases"
        amount="₹12,000 / ₹40,000"
        progress={30}
        className="md:col-span-4"
      />

      <BudgetCard
        icon={<Repeat size={20} />}
        title="Subscriptions"
        subtitle="Recurring monthly services"
        amount="₹8,200 / ₹10,000"
        progress={82}
        className="md:col-span-4"
      />

      <OtherBudgetCard
        icon={<MoreHorizontal size={20} />}
        title="Other Categories"
        subtitle="Everything else not categorized above"
        amount="₹21,000 spent of ₹50,000"
        progress={42}
      />
    </div>
  );
}