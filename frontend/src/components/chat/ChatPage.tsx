"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import SuggestedQueries from "./SuggestedQueries";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { streamChatMessage } from "@/lib/api/chatApi";
import type { ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hello! I'm Aura, your personal finance assistant. Ask me about your spending, categories, subscriptions, or uploaded transactions.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, loading, scrollToBottom]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsgId = crypto.randomUUID();
    const aiMsgId = crypto.randomUUID();

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: messageText,
    };

    const initialAiMessage: ChatMessage = {
      id: aiMsgId,
      role: "ai",
      content: "",
      isStreaming: true,
      tools: [],
    };

    // Add user message and the placeholder AI message that will stream in place
    setMessages((prev) => [...prev, userMessage, initialAiMessage]);
    setLoading(true);

    abortControllerRef.current = new AbortController();

    await streamChatMessage(
      messageText,
      null, // Pass sessionId here if managing persistent session threads
      {
        onToken: (token: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: msg.content + token } : msg
            )
          );
        },
        onToolStart: (tool: string, input: Record<string, unknown>) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== aiMsgId) return msg;
              const currentTools = msg.tools || [];
              return {
                ...msg,
                tools: [...currentTools, { tool, status: "running", input }],
              };
            })
          );
        },
        onToolEnd: (tool: string, output: string) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== aiMsgId) return msg;
              const updatedTools = (msg.tools || []).map((t) =>
                t.tool === tool ? { ...t, status: "completed" as const, output } : t
              );
              return { ...msg, tools: updatedTools };
            })
          );
        },
        onError: (errorMsg: string) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? {
                    ...msg,
                    content: msg.content
                      ? msg.content + `\n\n[Error: ${errorMsg}]`
                      : "Sorry, I could not generate an answer right now. Please try again.",
                    isStreaming: false,
                  }
                : msg
            )
          );
          setLoading(false);
        },
        onDone: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
            )
          );
          setLoading(false);
        },
      },
      abortControllerRef.current.signal
    );
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setMessages((prev) =>
        prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg))
      );
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-5xl flex-col pb-[190px]">
      <div className="pointer-events-none fixed right-[-10%] top-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-emerald-100/40 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-[#dae2fd]/60 blur-[100px]" />

      <ChatHeader />

      <div className="mx-auto w-full max-w-5xl flex-1 space-y-6">
        {messages.map((message) =>
          message.role === "ai" ? (
            <AIMessage
              key={message.id}
              content={message.content}
              isStreaming={message.isStreaming}
              tools={message.tools}
            />
          ) : (
            <UserMessage key={message.id}>{message.content}</UserMessage>
          )
        )}

        {messages.length === 1 && (
          <SuggestedQueries onSelectAction={handleSendMessage} />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 right-0 z-30 border-t border-[#e5eeff] bg-white/85 px-4 pt-3 backdrop-blur-xl transition-all duration-300 left-0 md:left-[var(--sidebar-offset)] lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <ChatInput
            loading={loading}
            onSendAction={handleSendMessage}
            onStopAction={handleStop}
          />
        </div>
      </div>
    </div>
  );
}