import {
  AppNotification,
  NotificationResponse,
} from "@/types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getNotifications(
  type = "all",
  search = ""
) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/notifications/?type=${type}&search=${search}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as NotificationResponse;
}

export async function markNotificationRead(id: number) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/notifications/${id}/read/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function dismissNotification(id: number) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/notifications/${id}/dismiss/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getNotificationUnreadCount() {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/notifications/unread-count/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Unread count API failed:", response.status, data);
    return 0;
  }

  return data?.unread_count || 0;
}