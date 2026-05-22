"use client";

import { useState } from "react";

import ChatHeader from "./ChatHeader";
import ChatInsightGrid from "./ChatInsightGrid";
import SuggestedQueries from "./SuggestedQueries";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import ChatInput from "./ChatInput";
import { sendChatMessage } from "@/lib/api/chatApi";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

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

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await sendChatMessage(message);

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        content: data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          content:
            "Sorry, I could not generate an answer right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-5xl flex-col pb-[220px]">
      <div className="pointer-events-none fixed right-[-10%] top-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-emerald-100/40 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-[#dae2fd]/60 blur-[100px]" />

      <ChatHeader />

      <div className="flex-1 space-y-8">
        <ChatInsightGrid />

        {messages.map((message) =>
          message.role === "ai" ? (
            <AIMessage key={message.id}>{message.content}</AIMessage>
          ) : (
            <UserMessage key={message.id}>{message.content}</UserMessage>
          )
        )}

        {messages.length === 1 && (
          <SuggestedQueries onSelectAction={handleSendMessage} />
        )}

        {loading && (
          <AIMessage>
            <span className="text-[#565e74]">
              Aura is analyzing your transactions...
            </span>
          </AIMessage>
        )}
      </div>

      <div className="fixed bottom-0 right-0 z-30 border-t border-[#e5eeff] bg-white/85 px-6 pt-4 backdrop-blur-xl transition-all duration-300 left-0 md:left-[var(--sidebar-offset)] lg:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <ChatInput loading={loading} onSendAction={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}