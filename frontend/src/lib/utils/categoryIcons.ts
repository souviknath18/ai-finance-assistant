import {
  CircleDollarSign,
  Plane,
  ReceiptText,
  ShoppingBag,
  Utensils,
  Wallet,
  Home,
  Car,
  HeartPulse,
  GraduationCap,
  Dumbbell,
  Clapperboard,
  Repeat,
  TrendingUp,
  Briefcase,
  Wifi,
  Shield,
} from "lucide-react";

const CATEGORY_ICON_MAP = [
  {
    keywords: ["food", "restaurant", "coffee", "dining"],
    icon: Utensils,
  },
  {
    keywords: ["travel", "flight", "hotel"],
    icon: Plane,
  },
  {
    keywords: ["shopping", "amazon", "store"],
    icon: ShoppingBag,
  },
  {
    keywords: ["bill", "utility", "fee"],
    icon: ReceiptText,
  },
  {
    keywords: ["salary", "income", "payroll"],
    icon: CircleDollarSign,
  },
  {
    keywords: ["investment", "stock", "crypto"],
    icon: TrendingUp,
  },
  {
    keywords: ["subscription", "recurring"],
    icon: Repeat,
  },
  {
    keywords: ["rent", "housing", "home"],
    icon: Home,
  },
  {
    keywords: ["fuel", "car", "transport"],
    icon: Car,
  },
  {
    keywords: ["health", "medical"],
    icon: HeartPulse,
  },
  {
    keywords: ["education", "course"],
    icon: GraduationCap,
  },
  {
    keywords: ["gym", "fitness"],
    icon: Dumbbell,
  },
  {
    keywords: ["movie", "entertainment"],
    icon: Clapperboard,
  },
  {
    keywords: ["business", "office"],
    icon: Briefcase,
  },
  {
    keywords: ["internet", "wifi"],
    icon: Wifi,
  },
  {
    keywords: ["insurance"],
    icon: Shield,
  },
];

export function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();

  const match = CATEGORY_ICON_MAP.find((item) =>
    item.keywords.some((keyword) => lower.includes(keyword))
  );

  return match?.icon || Wallet;
}