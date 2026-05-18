import ChatHeader from "./ChatHeader";
import ChatInsightGrid from "./ChatInsightGrid";
import SuggestedQueries from "./SuggestedQueries";
import AIMessage from "./AIMessage";
import UserMessage from "./UserMessage";
import SpendingBreakdown from "./SpendingBreakdown";
import ChatInput from "./ChatInput";

export default function ChatPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-5xl flex-col">
      <div className="pointer-events-none fixed right-[-10%] top-[-10%] -z-10 h-[50%] w-[50%] rounded-full bg-emerald-100/40 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-10%] -z-10 h-[40%] w-[40%] rounded-full bg-[#dae2fd]/60 blur-[100px]" />

      <ChatHeader />

      <ChatInsightGrid />

      <div className="flex-1 space-y-8 pb-40">
        <AIMessage>
          Hello! I&apos;m Aura, your personal wealth assistant. I have analyzed
          your recent transactions and budget goals. How can I help you optimize
          your finances today?
        </AIMessage>

        <SuggestedQueries />

        <UserMessage>
          Show me a breakdown of my spending for this month compared to the
          last.
        </UserMessage>

        <AIMessage time="1 minute ago">
          <div className="space-y-5">
            <p>
              Based on your transaction history, your total spending this month
              is <strong>₹32,400</strong>, which is{" "}
              <strong>5.4% lower</strong> than last month. Here is the primary
              breakdown:
            </p>

            <SpendingBreakdown />

            <p>
              You significantly reduced your shopping expenses, which is the
              main driver for your savings this month. Would you like me to
              suggest a new savings goal based on this trend?
            </p>
          </div>
        </AIMessage>
      </div>

      <ChatInput />
    </div>
  );
}