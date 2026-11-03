import React from "react";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import type { ToolExecutionState } from "@/types/chat";

type AIMessageProps = {
  children?: React.ReactNode;
  content?: string;
  isStreaming?: boolean;
  tools?: ToolExecutionState[];
  time?: string;
};

const TOOL_LABELS: Record<string, string> = {
  search_transactions_semantic: "Searching Vector Records",
  query_transactions: "Querying Database Ledger",
  get_spending_velocity: "Computing Spending Velocity",
  get_budget_status: "Evaluating Budget Limits",
  get_active_subscriptions: "Auditing Subscriptions",
  get_goal_progress: "Checking Savings Targets",
};

export default function AIMessage({
  children,
  content,
  isStreaming = false,
  tools = [],
  time = "Just now",
}: AIMessageProps) {
  return (
    <div className="flex max-w-3xl items-start gap-3">
      {/* Aura Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#e6edf9] bg-[#f8faff] text-black shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <Sparkles size={15} />
      </div>

      {/* Message */}
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl rounded-tl-md border border-[#e6edf9] bg-white px-4 py-3.5 text-[13px] leading-6 text-black shadow-[0_4px_16px_rgba(15,23,42,0.05)]">
          {/* Tool Execution Status Chips */}
          {tools && tools.length > 0 && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {tools.map((t, idx) => {
                const isRunning = t.status === "running";
                const label = TOOL_LABELS[t.tool] || t.tool;
                return (
                  <span
                    key={`${t.tool}-${idx}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                      isRunning
                        ? "border border-amber-200 bg-amber-50/80 text-amber-800 animate-pulse"
                        : "border border-emerald-200 bg-emerald-50/80 text-emerald-800"
                    }`}
                  >
                    {isRunning ? (
                      <Loader2 size={12} className="animate-spin text-amber-600" />
                    ) : (
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    )}
                    <span>{label}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Message Content */}
          {content ? (
            <div className="whitespace-pre-wrap">
              {content}
              {isStreaming && (
                <span className="ml-0.5 inline-block h-3.5 w-1 translate-y-0.5 animate-pulse bg-emerald-600" />
              )}
            </div>
          ) : isStreaming ? (
            <span className="flex items-center gap-2 text-[#565e74]">
              <Loader2 size={13} className="animate-spin text-emerald-600" />
              Aura is analyzing your finances...
            </span>
          ) : (
            children
          )}
        </div>

        <span className="mt-1.5 block text-[10px] font-medium text-[#8a92a5]">
          Aura • {time}
        </span>
      </div>
    </div>
  );
}