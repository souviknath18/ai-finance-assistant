import {
  ShoppingCart,
  Repeat,
  BadgeDollarSign,
  WalletCards,
  ClipboardCheck,
} from "lucide-react";

export const suggestedQueries = [
  {
    label: "Where did I spend the most?",
    icon: ShoppingCart,
  },
  {
    label: "What changed from last month?",
    icon: Repeat,
  },
  {
    label: "List my recurring subscriptions",
    icon: BadgeDollarSign,
  },
  {
    label: "How can I save ₹5,000 more?",
    icon: WalletCards,
  },
  {
    label: "Am I staying within budget?",
    icon: ClipboardCheck,
  },
];

export const spendingBreakdown = [
  {
    label: "Dining",
    value: "₹4,200",
    trend: "↑ 12%",
    tone: "text-red-600",
  },
  {
    label: "Rent",
    value: "₹18,000",
    trend: "0%",
    tone: "text-[#565e74]",
  },
  {
    label: "Shopping",
    value: "₹3,100",
    trend: "↓ 45%",
    tone: "text-emerald-700",
  },
  {
    label: "Transport",
    value: "₹1,800",
    trend: "↓ 8%",
    tone: "text-emerald-700",
  },
];