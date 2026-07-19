import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { LuSparkles, LuSend, LuUser } from "react-icons/lu";
import PageHeader from "../../components/app/PageHeader";
import GlassCard from "../../components/ui/GlassCard";
import { getAssistantResponse, suggestedPrompts } from "../../data/assistantResponses";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm your SkyShield Cloud Operations Copilot. Ask me why a score changed, which resources need attention, how to fix a finding, or what to prioritize next — I have context on your findings, compliance posture, infrastructure, and pipelines.",
};

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: getAssistantResponse(text),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 900 + Math.random() * 500);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <PageHeader title="AI Security Assistant" description="Your Cloud Operations Copilot — ask questions about your environment in plain English." />

      <GlassCard hover={false} className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "assistant" ? "gradient-accent" : "bg-white/10"
                }`}
              >
                {message.role === "assistant" ? (
                  <LuSparkles size={15} className="text-white" aria-hidden="true" />
                ) : (
                  <LuUser size={15} className="text-text" aria-hidden="true" />
                )}
              </div>
              <div
                className={`max-w-[80%] sm:max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-white/[0.04] border border-white/10 text-text"
                    : "gradient-accent text-white"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center shrink-0">
                <LuSparkles size={15} className="text-white" aria-hidden="true" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/[0.04] border border-white/10 flex items-center gap-1.5">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="px-5 sm:px-6 pb-3 flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="text-xs text-text-muted border border-white/10 rounded-full px-3.5 py-1.5 hover:border-accent/40 hover:text-text transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 sm:p-5 border-t border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about findings, compliance, infrastructure..."
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-accent/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center shrink-0 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
            aria-label="Send message"
          >
            <LuSend size={16} className="text-white" aria-hidden="true" />
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
