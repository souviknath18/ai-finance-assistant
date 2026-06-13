import { CreditCard, Headphones, ShieldCheck } from "lucide-react";
import TrustCard from "./TrustCard";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Bank-Level Security",
    description: "Your data is protected with secure encryption practices.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Billing is handled with trusted payment infrastructure.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get faster help when you need billing or product support.",
  },
];

export default function TrustSection() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {trustItems.map((item) => (
        <TrustCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </section>
  );
}