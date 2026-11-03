import {
  ChatSession,
  ChatSessionListItem,
  SendChatMessageResponse,
  StreamCallbacks,
  SSEPayload,
} from "@/types/chat";

import { authFetch } from "@/lib/api/authFetch";

export async function streamChatMessage(
  message: string,
  sessionId: number | null | undefined,
  callbacks: StreamCallbacks,
  signal?: AbortSignal
): Promise<void> {
  let response: Response;

  try {
    response = await authFetch("/api/chat/stream/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        session_id: sessionId ?? null,
        thread_id: sessionId ? `session_${sessionId}` : undefined,
      }),
      signal,
    });
  } catch (err: unknown) {
    if ((err as Error)?.name === "AbortError") {
      console.info("Chat stream aborted by user.");
      return;
    }
    callbacks.onError((err as Error)?.message || "Failed to establish stream connection");
    return;
  }

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "");
    callbacks.onError(errorText || `Request failed with status ${response.status}`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      // Keep any trailing incomplete event in the buffer
      buffer = events.pop() || "";

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith("data:")) continue;

        const dataStr = line.replace(/^data:\s*/, "");
        if (!dataStr) continue;

        try {
          const payload: SSEPayload = JSON.parse(dataStr);

          switch (payload.type) {
            case "token":
              callbacks.onToken(payload.content);
              break;
            case "tool_start":
              callbacks.onToolStart(payload.tool, payload.input);
              break;
            case "tool_end":
              callbacks.onToolEnd(payload.tool, payload.output);
              break;
            case "error":
              callbacks.onError(payload.error || "Streaming execution failed");
              break;
            case "done":
              callbacks.onDone();
              return;
          }
        } catch (err) {
          console.warn("Failed to parse SSE payload:", dataStr, err);
        }
      }
    }
    callbacks.onDone();
  } catch (err: unknown) {
    if ((err as Error)?.name === "AbortError") {
      console.info("Aura chat stream aborted by user.");
    } else {
      callbacks.onError((err as Error)?.message || "Stream interrupted");
    }
  } finally {
    reader.releaseLock();
  }
}

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