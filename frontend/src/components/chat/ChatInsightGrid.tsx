import {
  CalendarDays,
  TrendingDown,
} from "lucide-react";

import ChatInsightCard from "./ChatInsightCard";

export default function ChatInsightGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChatInsightCard
        icon={<TrendingDown size={18} />}
        label="Spending Context"
        description={
          <>
            Your spending is{" "}
            <span className="font-bold text-emerald-700">
              12% lower
            </span>{" "}
            than your recent average this month.
          </>
        }
        variant="highlight"
      />

      <ChatInsightCard
        icon={<CalendarDays size={18} />}
        label="Upcoming Bills"
        description={
          <>
            3 recurring payments totaling{" "}
            <span className="font-bold">
              ₹8,450
            </span>{" "}
            are due within the next 5 days.
          </>
        }
      />
    </div>
  );
}