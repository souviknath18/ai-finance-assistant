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

export function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();

  if (
    lower.includes("food") ||
    lower.includes("restaurant") ||
    lower.includes("coffee") ||
    lower.includes("dining")
  ) {
    return Utensils;
  }

  if (
    lower.includes("travel") ||
    lower.includes("flight") ||
    lower.includes("hotel")
  ) {
    return Plane;
  }

  if (
    lower.includes("shopping") ||
    lower.includes("amazon") ||
    lower.includes("store")
  ) {
    return ShoppingBag;
  }

  if (
    lower.includes("bill") ||
    lower.includes("utility") ||
    lower.includes("fee")
  ) {
    return ReceiptText;
  }

  if (
    lower.includes("salary") ||
    lower.includes("income") ||
    lower.includes("payroll")
  ) {
    return CircleDollarSign;
  }

  if (
    lower.includes("investment") ||
    lower.includes("stock") ||
    lower.includes("crypto")
  ) {
    return TrendingUp;
  }

  if (
    lower.includes("subscription") ||
    lower.includes("recurring")
  ) {
    return Repeat;
  }

  if (
    lower.includes("rent") ||
    lower.includes("housing") ||
    lower.includes("home")
  ) {
    return Home;
  }

  if (
    lower.includes("fuel") ||
    lower.includes("car") ||
    lower.includes("transport")
  ) {
    return Car;
  }

  if (
    lower.includes("health") ||
    lower.includes("medical")
  ) {
    return HeartPulse;
  }

  if (
    lower.includes("education") ||
    lower.includes("course")
  ) {
    return GraduationCap;
  }

  if (
    lower.includes("gym") ||
    lower.includes("fitness")
  ) {
    return Dumbbell;
  }

  if (
    lower.includes("movie") ||
    lower.includes("entertainment")
  ) {
    return Clapperboard;
  }

  if (
    lower.includes("business") ||
    lower.includes("office")
  ) {
    return Briefcase;
  }

  if (
    lower.includes("internet") ||
    lower.includes("wifi")
  ) {
    return Wifi;
  }

  if (
    lower.includes("insurance")
  ) {
    return Shield;
  }

  return Wallet;
}