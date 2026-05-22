import {
  ChatSession,
  ChatSessionListItem,
  SendChatMessageResponse,
} from "@/types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function sendChatMessage(
  message: string,
  sessionId?: number | null
) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/chat/message/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/chat/sessions/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ChatSessionListItem[];
}

export async function getChatSession(sessionId: number) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data as ChatSession;
}

export async function deleteChatSession(sessionId: number) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/chat/sessions/${sessionId}/delete/`,
    {
      method: "DELETE",
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