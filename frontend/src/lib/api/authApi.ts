import {
  SignupPayload,
  LoginPayload,
  AuthResponse,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signupUser(
  payload: SignupPayload
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/accounts/signup/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function loginUser(
  payload: LoginPayload
): Promise<AuthResponse> {
  const response = await fetch(
    `${API_URL}/api/accounts/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}