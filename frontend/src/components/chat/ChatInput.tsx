"use client";

import { useState } from "react";
import { Image, Mic, Paperclip, Send } from "lucide-react";
import IconButton from "./IconButton";

type ChatInputProps = {
  loading: boolean;
  onSendAction: (message: string) => void;
};

export default function ChatInput({ loading, onSendAction }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || loading) return;

    onSendAction(message.trim());
    setMessage("");
  };

  return (
    <div className="pb-3">
      <div className="rounded-2xl border border-[#c6c6cd] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.12)] transition focus-within:ring-2 focus-within:ring-emerald-100">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[52px] max-h-[120px] w-full resize-none border-none bg-transparent p-3 text-[13px] outline-none"
          placeholder="Ask Aura about your transactions..."
          rows={1}
        />

        <div className="flex items-center justify-between px-2.5 pb-2.5">
          <div className="flex items-center gap-1">
            <IconButton icon={<Paperclip size={16} />} />
            <IconButton icon={<Mic size={16} />} />
            <IconButton icon={<Image size={16} />} />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{loading ? "Thinking..." : "Send Message"}</span>
            <Send size={15} />
          </button>
        </div>
      </div>

      <p className="mt-2.5 text-center text-[11px] font-semibold text-[#7c839b]">
        Aura uses your transaction data, but please verify financial actions.
      </p>
    </div>
  );
}