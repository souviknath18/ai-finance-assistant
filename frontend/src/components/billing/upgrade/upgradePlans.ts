import { CheckCircle2, Rocket, Sparkles, XCircle } from "lucide-react";

export const upgradePlans = [
  {
    title: "Aura Pro",
    badge: "Current Plan",
    monthlyPrice: 29,
    yearlyPrice: 23,
    description: "Essential intelligence for personal finance tracking.",
    buttonText: "Active Subscription",
    disabled: true,
    recommended: false,
    features: [
      {
        label: "Advanced AI Finance Chat",
        icon: CheckCircle2,
      },
      {
        label: "Daily Spending Insights",
        icon: CheckCircle2,
      },
      {
        label: "1,000 Monthly Document Uploads",
        icon: CheckCircle2,
      },
    ],
    missingFeatures: [
      {
        label: "Real-time Market Prediction",
        icon: XCircle,
      },
    ],
  },
  {
    title: "Aura Elite",
    badge: "Recommended",
    monthlyPrice: 59,
    yearlyPrice: 47,
    description: "Hyper-optimized financial intelligence with predictive AI.",
    buttonText: "Select Elite",
    disabled: false,
    recommended: true,
    badgeIcon: Sparkles,
    features: [
      {
        label: "Everything in Aura Pro",
        icon: CheckCircle2,
      },
      {
        label: "Real-time Market Prediction",
        icon: Rocket,
        highlight: true,
      },
      {
        label: "Priority 24/7 AI Support",
        icon: CheckCircle2,
      },
      {
        label: "Unlimited Document Uploads",
        icon: CheckCircle2,
      },
      {
        label: "Advanced Tax Optimization Tools",
        icon: CheckCircle2,
      },
    ],
    missingFeatures: [],
  },
];