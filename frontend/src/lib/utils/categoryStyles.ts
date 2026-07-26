export type CategoryStyles = {
  badge: string;
  progress: string;
  amount: string;
  card: string;
};

export function getCategoryStyles(category: string): CategoryStyles {
  switch (category.trim().toLowerCase()) {
    case "food":
      return {
        badge: "bg-orange-100 text-orange-800",
        progress: "from-orange-600 via-orange-500 to-orange-300",
        amount: "border-orange-200 bg-orange-50 text-orange-700",
        card: "bg-orange-50/30",
      };

    case "groceries":
      return {
        badge: "bg-lime-100 text-lime-800",
        progress: "from-lime-600 via-lime-500 to-lime-300",
        amount: "border-lime-200 bg-lime-50 text-lime-700",
        card: "bg-lime-50/30",
      };

    case "transport":
      return {
        badge: "bg-sky-100 text-sky-800",
        progress: "from-sky-600 via-sky-500 to-sky-300",
        amount: "border-sky-200 bg-sky-50 text-sky-700",
        card: "bg-sky-50/30",
      };

    case "fuel":
      return {
        badge: "bg-amber-100 text-amber-800",
        progress: "from-amber-600 via-amber-500 to-amber-300",
        amount: "border-amber-200 bg-amber-50 text-amber-700",
        card: "bg-amber-50/30",
      };

    case "shopping":
      return {
        badge: "bg-indigo-100 text-indigo-800",
        progress: "from-indigo-600 via-indigo-500 to-indigo-300",
        amount: "border-indigo-200 bg-indigo-50 text-indigo-700",
        card: "bg-indigo-50/30",
      };

    case "rent":
      return {
        badge: "bg-violet-100 text-violet-800",
        progress: "from-violet-600 via-violet-500 to-violet-300",
        amount: "border-violet-200 bg-violet-50 text-violet-700",
        card: "bg-violet-50/30",
      };

    case "utilities":
      return {
        badge: "bg-yellow-100 text-yellow-800",
        progress: "from-yellow-600 via-yellow-500 to-yellow-300",
        amount: "border-yellow-200 bg-yellow-50 text-yellow-700",
        card: "bg-yellow-50/30",
      };

    case "subscriptions":
      return {
        badge: "bg-fuchsia-100 text-fuchsia-800",
        progress: "from-fuchsia-600 via-fuchsia-500 to-fuchsia-300",
        amount: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
        card: "bg-fuchsia-50/30",
      };

    case "salary":
      return {
        badge: "bg-emerald-100 text-emerald-800",
        progress: "from-emerald-600 via-emerald-500 to-emerald-300",
        amount: "border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "bg-emerald-50/30",
      };

    case "bank fees":
      return {
        badge: "bg-slate-200 text-slate-800",
        progress: "from-slate-600 via-slate-500 to-slate-300",
        amount: "border-slate-200 bg-slate-50 text-slate-700",
        card: "bg-slate-50/40",
      };

    case "healthcare":
      return {
        badge: "bg-red-100 text-red-800",
        progress: "from-red-600 via-red-500 to-red-300",
        amount: "border-red-200 bg-red-50 text-red-700",
        card: "bg-red-50/30",
      };

    case "insurance":
      return {
        badge: "bg-blue-100 text-blue-800",
        progress: "from-blue-600 via-blue-500 to-blue-300",
        amount: "border-blue-200 bg-blue-50 text-blue-700",
        card: "bg-blue-50/30",
      };

    case "investments":
      return {
        badge: "bg-teal-100 text-teal-800",
        progress: "from-teal-600 via-teal-500 to-teal-300",
        amount: "border-teal-200 bg-teal-50 text-teal-700",
        card: "bg-teal-50/30",
      };

    case "travel":
      return {
        badge: "bg-cyan-100 text-cyan-800",
        progress: "from-cyan-600 via-cyan-500 to-cyan-300",
        amount: "border-cyan-200 bg-cyan-50 text-cyan-700",
        card: "bg-cyan-50/30",
      };

    case "entertainment":
      return {
        badge: "bg-pink-100 text-pink-800",
        progress: "from-pink-600 via-pink-500 to-pink-300",
        amount: "border-pink-200 bg-pink-50 text-pink-700",
        card: "bg-pink-50/30",
      };

    case "education":
      return {
        badge: "bg-purple-100 text-purple-800",
        progress: "from-purple-600 via-purple-500 to-purple-300",
        amount: "border-purple-200 bg-purple-50 text-purple-700",
        card: "bg-purple-50/30",
      };

    case "household":
      return {
        badge: "bg-rose-100 text-rose-800",
        progress: "from-rose-600 via-rose-500 to-rose-300",
        amount: "border-rose-200 bg-rose-50 text-rose-700",
        card: "bg-rose-50/30",
      };

    case "income":
      return {
        badge: "bg-green-100 text-green-800",
        progress: "from-green-600 via-green-500 to-green-300",
        amount: "border-green-200 bg-green-50 text-green-700",
        card: "bg-green-50/30",
      };

    case "cash withdrawal":
      return {
        badge: "bg-zinc-200 text-zinc-800",
        progress: "from-zinc-600 via-zinc-500 to-zinc-300",
        amount: "border-zinc-200 bg-zinc-50 text-zinc-700",
        card: "bg-zinc-50/40",
      };

    default:
      return {
        badge: "bg-gray-100 text-gray-700",
        progress: "from-gray-600 via-gray-500 to-gray-300",
        amount: "border-gray-200 bg-gray-50 text-gray-700",
        card: "bg-gray-50/40",
      };
  }
}