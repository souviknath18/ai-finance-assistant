export type ChatRole = "user" | "ai";

export interface ToolExecutionState {
  tool: string;
  status: "running" | "completed" | "failed";
  input?: Record<string, unknown>;
  output?: string;
}

export type ChatMessage = {
  id: number | string;
  role: ChatRole;
  content: string;
  sources?: unknown[];
  source_type?: string;
  created_at?: string;
  isStreaming?: boolean;
  tools?: ToolExecutionState[];
  error?: string;
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

// Streaming & SSE Payload types
export interface StreamCallbacks {
  onToken: (token: string) => void;
  onToolStart: (toolName: string, input: Record<string, unknown>) => void;
  onToolEnd: (toolName: string, output: string) => void;
  onError: (errorMsg: string) => void;
  onDone: () => void;
}

export type SSEPayload =
  | { type: "token"; content: string }
  | { type: "tool_start"; tool: string; input: Record<string, unknown> }
  | { type: "tool_end"; tool: string; output: string }
  | { type: "error"; error: string }
  | { type: "done" };