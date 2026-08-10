"use client";

import { useState } from "react";
import {
  Image,
  Mic,
  Paperclip,
  Send,
} from "lucide-react";

import IconButton from "./IconButton";

type ChatInputProps = {
  loading: boolean;
  onSendAction: (
    message: string
  ) => void;
};

export default function ChatInput({
  loading,
  onSendAction,
}: ChatInputProps) {
  const [message, setMessage] =
    useState("");

  const handleSend = () => {
    if (
      !message.trim() ||
      loading
    ) {
      return;
    }

    onSendAction(message.trim());
    setMessage("");
  };

  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-[#dfe7f3] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.10)] transition focus-within:border-emerald-200 focus-within:shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              handleSend();
            }
          }}
          className="min-h-[56px] max-h-[130px] w-full resize-none border-none bg-transparent px-4 pt-4 text-[13px] leading-6 text-black outline-none placeholder:text-[#9aa2b4]"
          placeholder="Ask Aura about your finances..."
          rows={1}
        />

        <div className="flex items-center justify-between border-t border-[#edf2fb] px-3 py-2.5">
          <div className="flex items-center gap-1">
            <IconButton
              icon={<Paperclip size={16} />}
            />

            <IconButton
              icon={<Mic size={16} />}
            />

            <IconButton
              icon={<Image size={16} />}
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={
              !message.trim() ||
              loading
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[12px] font-bold text-white transition-[opacity,transform,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.14)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>
              {loading
                ? "Thinking..."
                : "Send"}
            </span>

            <Send size={14} />
          </button>
        </div>
      </div>

      <p className="mt-2 mb-2 text-center text-[10px] font-medium text-[#8a92a5]">
        Aura uses your financial data to answer questions. Verify important
        financial decisions independently.
      </p>
    </div>
  );
}