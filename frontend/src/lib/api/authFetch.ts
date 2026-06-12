import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  clearAuthData,
} from "@/lib/auth/tokenStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  let accessToken = getAccessToken();

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthData();
    window.location.href = "/auth/login";
    return response;
  }

  const refreshResponse = await fetch(`${API_URL}/api/accounts/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!refreshResponse.ok) {
    clearAuthData();
    window.location.href = "/auth/login";
    return response;
  }

  const refreshData = await refreshResponse.json();
  saveAccessToken(refreshData.access);

  response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshData.access}`,
      ...(options.headers || {}),
    },
  });

  return response;
}