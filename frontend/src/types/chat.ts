export type ChatRole = "user" | "ai";

export type ChatMessage = {
  id: number | string;
  role: ChatRole;
  content: string;
  sources?: unknown[];
  source_type?: string;
  created_at?: string;
};

export type ChatSession = {
  id: number;
  chat_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
};

export type ChatSessionListItem = {
  id: number;
  chat_id: string;
  title: string;
  last_message: {
    role: ChatRole;
    content: string;
    created_at: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type SendChatMessageResponse = {
  session_id: number;
  chat_id: string;
  user_message: ChatMessage;
  ai_message: ChatMessage;
  answer: string;
  sources: unknown[];
  source_type: string;
};