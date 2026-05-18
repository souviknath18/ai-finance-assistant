export type OnboardingPayload = {
  currency: string;
  monthly_income: string;
  monthly_savings_target: string;
  spending_limit: string;
  housing_budget?: string;
  groceries_budget?: string;
  entertainment_budget?: string;
  priorities: string[];
};