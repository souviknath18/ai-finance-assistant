import { Image, Mic, Paperclip, Send } from "lucide-react";
import IconButton from "./IconButton";

export default function ChatInput() {
  return (
    <div className="sticky bottom-6 z-20">
      <div className="rounded-3xl border border-[#c6c6cd] bg-white p-2 shadow-[0_16px_45px_rgba(15,23,42,0.12)] transition focus-within:ring-2 focus-within:ring-emerald-100">
        <textarea
          className="min-h-[64px] max-h-[200px] w-full resize-none border-none bg-transparent p-4 text-sm outline-none"
          placeholder="Ask Aura about your wealth..."
          rows={1}
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <IconButton icon={<Paperclip size={18} />} />
            <IconButton icon={<Mic size={18} />} />
            <IconButton icon={<Image size={18} />} />
          </div>

          <button className="flex h-12 items-center gap-2 rounded-2xl bg-black px-5 text-sm font-bold text-white transition hover:opacity-90 active:scale-[0.98]">
            <span>Send Message</span>
            <Send size={17} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-semibold text-[#7c839b]">
        Aura may display inaccurate info. Please verify financial actions.
      </p>
    </div>
  );
}