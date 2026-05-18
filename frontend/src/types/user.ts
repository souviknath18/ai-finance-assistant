export type User = {
  id: string;
  user_code: string;
  email: string;
  full_name: string;
  profile_picture?: string | null;
  currency: string;
  monthly_income?: string | null;
  is_verified: boolean;
  is_onboarded: boolean;
  created_at: string;
};