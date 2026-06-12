import {
  ChatSession,
  ChatSessionListItem,
  SendChatMessageResponse,
} from "@/types/chat";

import { authFetch } from "@/lib/api/authFetch";

export async function sendChatMessage(
  message: string,
  sessionId?: number | null
) {
  const response = await authFetch("/api/chat/message/", {
    method: "POST",
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as SendChatMessageResponse;
}

export async function getChatSessions() {
  const response = await authFetch("/api/chat/sessions/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ChatSessionListItem[];
}

export async function getChatSession(sessionId: number) {
  const response = await authFetch(`/api/chat/sessions/${sessionId}/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ChatSession;
}

export async function deleteChatSession(sessionId: number) {
  const response = await authFetch(
    `/api/chat/sessions/${sessionId}/delete/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}