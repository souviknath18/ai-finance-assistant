export type GoalType =
  | "savings"
  | "debt"
  | "purchase"
  | "travel"
  | "investment"
  | "other";

export type GoalItem = {
  id: number;
  goal_id: string;
  title: string;
  goal_type: GoalType;
  category: number | null;
  category_name: string | null;
  target_amount: number;
  current_amount: number;
  remaining_amount: number;
  target_amount_display: string;
  current_amount_display: string;
  remaining_amount_display: string;
  target_date: string | null;
  priority: "high" | "medium" | "low";
  ai_recommendations_enabled: boolean;
  monthly_average_display: string;
  progress: number;
  created_at: string;
};

export type GoalsDashboard = {
  ai_momentum: {
    message: string;
    action_label: string;
  };
  goals: GoalItem[];
};

export type CreateGoalPayload = {
  title: string;
  goal_type: GoalType;
  category: number | null;
  target_amount: number;
  current_amount: number;
  monthly_average: number;
  target_date: string | null;
  priority: "high" | "medium" | "low";
  is_active: boolean;
  ai_recommendations_enabled: boolean;
};