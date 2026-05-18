import { CalendarDays, TrendingDown } from "lucide-react";
import ChatInsightCard from "./ChatInsightCard";

export default function ChatInsightGrid() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <ChatInsightCard
        icon={<TrendingDown size={20} />}
        label="Market Context"
        description={
          <>
            Your spending is{" "}
            <span className="font-bold text-emerald-700">12% lower</span> than
            the average user in your income bracket this month.
          </>
        }
        variant="glow"
      />

      <ChatInsightCard
        icon={<CalendarDays size={20} />}
        label="Upcoming Bills"
        description={
          <>
            3 recurring subscriptions totaling{" "}
            <span className="font-bold">₹8,450</span> are due within the next 5
            days.
          </>
        }
      />
    </div>
  );
}