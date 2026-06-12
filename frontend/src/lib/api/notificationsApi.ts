import {
  AppNotification,
  NotificationResponse,
} from "@/types/notification";

import { authFetch } from "@/lib/api/authFetch";

export async function getNotifications(
  type = "all",
  search = ""
) {
  const response = await authFetch(
    `/api/notifications/?type=${type}&search=${search}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as NotificationResponse;
}

export async function markNotificationRead(id: number) {
  const response = await authFetch(
    `/api/notifications/${id}/read/`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function dismissNotification(id: number) {
  const response = await authFetch(
    `/api/notifications/${id}/dismiss/`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getNotificationUnreadCount() {
  const response = await authFetch(
    "/api/notifications/unread-count/",
    {
      method: "GET",
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Unread count API failed:", response.status, data);
    return 0;
  }

  return data?.unread_count || 0;
}