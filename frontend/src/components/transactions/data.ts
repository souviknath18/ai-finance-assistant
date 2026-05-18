export type Transaction = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  status: "AI Verified" | "Manual" | "AI Review Needed";
  selected: boolean;
  ai: boolean;
  review?: boolean;
};

export const transactions: Transaction[] = [
  {
    id: "cloudscale-ai-services",
    date: "Oct 24, 2024",
    title: "CloudScale AI Services",
    subtitle: "Recurring Subscription",
    category: "Software",
    amount: "-$299.00",
    type: "expense",
    status: "AI Verified",
    selected: true,
    ai: true,
  },
  {
    id: "whole-foods-market",
    date: "Oct 23, 2024",
    title: "Whole Foods Market",
    subtitle: "Groceries & Household",
    category: "Food",
    amount: "-$142.18",
    type: "expense",
    status: "Manual",
    selected: false,
    ai: false,
  },
  {
    id: "vanguard-dividend-credit",
    date: "Oct 22, 2024",
    title: "Vanguard Dividend Credit",
    subtitle: "VTSAX Distribution",
    category: "Investment",
    amount: "+$1,205.50",
    type: "income",
    status: "AI Verified",
    selected: false,
    ai: true,
  },
  {
    id: "the-coffee-bean",
    date: "Oct 21, 2024",
    title: "The Coffee Bean",
    subtitle: "Awaiting Classification",
    category: "Select Category",
    amount: "-$5.75",
    type: "expense",
    status: "AI Review Needed",
    selected: true,
    ai: false,
    review: true,
  },
  {
    id: "coned-electric-bill",
    date: "Oct 20, 2024",
    title: "ConEd Electric Bill",
    subtitle: "Monthly Utility",
    category: "Utilities",
    amount: "-$88.42",
    type: "expense",
    status: "AI Verified",
    selected: true,
    ai: true,
  },
];