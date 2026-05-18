import {
  AlertTriangle,
  Repeat,
  TrendingUp,
  ShoppingCart,
  FileText,
} from "lucide-react";

import NotificationSection from "./NotificationSection";
import NotificationCard from "./NotificationCard";

export default function NotificationTimeline() {
  return (
    <div className="space-y-10">
      <NotificationSection title="Today">
        <NotificationCard
          icon={<AlertTriangle size={22} />}
          tone="red"
          title="Budget Warning: Dining Out"
          time="2h ago"
          description="You have reached 95% of your ₹40,000 dining budget for September. Consider choosing a home-cooked meal tonight."
          actions={["Adjust Budget", "Dismiss"]}
        />

        <NotificationCard
          icon={<Repeat size={22} />}
          tone="green"
          title="Subscription Increase"
          time="5h ago"
          description="Netflix has updated their monthly rate from ₹1,549 to ₹1,999 starting next billing cycle."
          actions={["Manage Subscriptions"]}
        />
      </NotificationSection>

      <NotificationSection title="Yesterday" muted>
        <NotificationCard
          icon={<TrendingUp size={22} />}
          tone="dark"
          title="Goal Milestone Reached!"
          time="Yesterday, 4:30 PM"
          description="Congratulations! You've saved ₹5,00,000 toward your European Summer goal. You are 50% of the way there."
          actions={["View Goal Details"]}
          progress={50}
        />

        <NotificationCard
          icon={<ShoppingCart size={22} />}
          tone="purple"
          title="Unusual Spending Detected"
          time="Yesterday, 10:15 AM"
          description="A transaction of ₹45,000 at TechWorld Retail is higher than your average shopping spend."
          actions={["Verify Transaction", "Report Issue"]}
          dangerAction="Report Issue"
        />
      </NotificationSection>

      <NotificationSection title="Earlier" faded>
        <NotificationCard
          icon={<FileText size={22} />}
          tone="muted"
          title="August Financial Report"
          time="Sept 1"
          description="Your comprehensive wealth report for August is now available for review."
          actions={["Download PDF"]}
        />
      </NotificationSection>
    </div>
  );
}