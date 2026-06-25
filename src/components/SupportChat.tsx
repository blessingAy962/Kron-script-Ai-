import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Mail, Check, AlertCircle, Sparkles, RefreshCw, ArrowUpRight, ShieldAlert, Brain } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function isPromptUnsafe(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  
  const unsafePatterns = [
    "security key",
    "security-key",
    "private key",
    "private-key",
    "api key",
    "api-key",
    "secret key",
    "secret-key",
    "admin key",
    "admin-key",
    "security key for kron",
    "security key for kron script ai",
    "kron script ai security",
    "kron script security",
    "kron security key",
    "auratech security key",
    "system prompt",
    "system-prompt",
    "jailbreak",
    "bypass restrictions",
    "illegal question",
    "illegal activity",
    "illegal guidance",
    "hacking",
    "hacker",
    "exploit",
    "credentials",
    "passwords",
    "private information",
    "private info",
    "share other users",
    "other users data",
    "other user's data",
    "other users history",
    "other user's history",
    "users data",
    "users history",
    "read other people",
    "expose data",
    "expose history",
    "leak history",
    "leak data"
  ];

  return unsafePatterns.some(pattern => lower.includes(pattern));
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string>("free");
  const [activeSupportUsageCount, setActiveSupportUsageCount] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      setUserPlan("free");
      return;
    }
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsubscribe = onSnapshot(coinsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserPlan(data.plan ?? "free");
      }
    }, (err) => {
      console.warn("Could not load user plan dynamically in support chat:", err);
    });
    return () => unsubscribe();
  }, [user]);

  const getSupportChatUsageInfo = () => {
    const isPremium = user && userPlan && userPlan !== "free";
    const limit = isPremium ? 20 : 7;
    const timestampsKey = user 
      ? `auratech_support_chat_timestamps_${user.uid}` 
      : "auratech_support_chat_timestamps_anonymous";
    
    let savedTimestamps: number[] = [];
    try {
      savedTimestamps = JSON.parse(safeGetItem(timestampsKey, "[]"));
    } catch {}
    
    const nowMs = Date.now();
    const activeTimestamps = savedTimestamps.filter((t: number) => nowMs - t < 24 * 60 * 60 * 1000);
    
    return {
      count: activeTimestamps.length,
      limit,
      remaining: Math.max(0, limit - activeTimestamps.length),
      isLocked: activeTimestamps.length >= limit
    };
  };

  const recordSupportChatUsage = () => {
    const timestampsKey = user 
      ? `auratech_support_chat_timestamps_${user.uid}` 
      : "auratech_support_chat_timestamps_anonymous";
    
    let savedTimestamps: number[] = [];
    try {
      savedTimestamps = JSON.parse(safeGetItem(timestampsKey, "[]"));
    } catch {}
    
    const nowMs = Date.now();
    const updated = [...savedTimestamps, nowMs].filter((t: number) => nowMs - t < 24 * 60 * 60 * 1000);
    safeSetItem(timestampsKey, JSON.stringify(updated));
    setActiveSupportUsageCount(updated.length);
  };

  useEffect(() => {
    setActiveSupportUsageCount(getSupportChatUsageInfo().count);
    const interval = setInterval(() => {
      setActiveSupportUsageCount(getSupportChatUsageInfo().count);
    }, 10000);
    return () => clearInterval(interval);
  }, [user, userPlan]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "Hello! Welcome to the Kron Script AI and Auratech platform. What problems or issues can I help you report today? \n\nOur average response time is under 1 minute. If you require real human attention for accounts or customization, feel free to direct-email our team at auratech4444@gmail.com.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowNotificationBadge(false);
      // Autofocus input
      setTimeout(() => chatInputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const usage = getSupportChatUsageInfo();
    if (usage.isLocked) {
      toast.error(`Daily limit reached (${usage.limit} messages). Please upgrade to Premium or wait for 24-hour reset.`);
      return;
    }

    const userMsgId = Math.random().toString(36).substring(7);
    const newUserMessage: Message = {
      id: userMsgId,
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    recordSupportChatUsage();

    if (isPromptUnsafe(textToSend)) {
      setTimeout(() => {
        const botMsgId = Math.random().toString(36).substring(7);
        setMessages((prev) => [
          ...prev,
          {
            id: botMsgId,
            role: "assistant",
            content: "I can't do that. Is there anything I can do for you?",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const chatConversation = [...messages, newUserMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/support-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatConversation }),
      });

      if (!response.ok) {
        throw new Error("Support link dropped. Please retry.");
      }

      const data = await response.json();
      const botMsgId = Math.random().toString(36).substring(7);
      const botMessage: Message = {
        id: botMsgId,
        role: "assistant",
        content: data.message?.content || "I have noted down your report. Please email us at auratech4444@gmail.com for real human investigation.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsgId = Math.random().toString(36).substring(7);
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          role: "assistant",
          content: "I'm having difficulty syncing with centralized live support. You can report directly to our real human engineers at **auratech4444@gmail.com** for immediate support.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const selectQuickTopic = (topic: string) => {
    sendMessage(`I want to report an issue: ${topic}`);
  };

  // Basic paragraph formatting with mail bold headers
  const formatText = (text: string) => {
    return text.split("\n\n").map((paragraph, pIdx) => {
      // Bold bolding matching of **text**
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={pIdx} className="mb-2 last:mb-0 text-xs sm:text-[13px] leading-relaxed">
          {parts.map((part, partIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={partIdx} className="font-extrabold text-white bg-purple-500/10 px-1 rounded">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.includes("auratech4444@gmail.com")) {
              return (
                <a
                  key={partIdx}
                  href="mailto:auratech4444@gmail.com"
                  className="font-bold text-purple-400 hover:text-purple-300 underline underline-offset-2 break-all"
                >
                  auratech4444@gmail.com
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button is strictly accessible at bottom-right viewport */}
      <div className="fixed bottom-6 right-6 z-[25000]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="btn-support-launcher"
          className="relative group p-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_8px_32px_rgba(147,51,234,0.4)] hover:shadow-[0_8px_40px_rgba(147,51,234,0.6)] cursor-pointer transition-all duration-300 hover:scale-105 select-none"
          title="Open AI & Human Support Chatbot"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <X className="h-6 w-6" key="close-icon" />
            ) : (
              <MessageSquare className="h-6 w-6" key="msg-icon" />
            )}
          </AnimatePresence>

          {/* Unread Alert Indicator Badge */}
          {!isOpen && showNotificationBadge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-mono font-black text-white items-center justify-center">
                1
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Elegant, Modern slide-up Chat View Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="panel-support-box"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[400px] h-[520px] max-h-[80vh] rounded-2.5xl border border-purple-500/20 bg-[#0f0b18]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(109,40,217,0.3)] z-[25000] flex flex-col overflow-hidden font-sans select-none"
          >
            {/* Top header containing Auratech & support team identifiers */}
            <div className="p-4 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border-b border-purple-500/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-950/50 border border-purple-500/35 flex items-center justify-center text-purple-400">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-[#0f0b18] animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-display font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                    AURATECH SUPPORT
                  </h3>
                  <p className="text-[10px] font-mono font-medium text-zinc-400/90 leading-none mt-0.5">
                    AI Active • auratech4444@gmail.com
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800/40 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Inner Message Flow Canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-purple-950/25 border border-purple-500/10 text-zinc-300 rounded-bl-none"
                    } shadow-md`}
                  >
                    {/* Message content formatted cleanly */}
                    {formatText(msg.content)}
                    
                    <span className="block text-[8px] font-mono text-zinc-500 mt-1.5 text-right uppercase">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader response state */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-purple-950/25 border border-purple-500/10 text-zinc-400 rounded-2xl rounded-bl-none p-3 shadow-md flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-300">
                      Syncing Support Channel...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Prompt Helper Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 pt-1 border-t border-purple-500/5 bg-purple-950/5">
                <p className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-wider mb-2">
                  Report issues quickly:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => selectQuickTopic("Report a Bug 🐛")}
                    className="py-1 px-2 text-[10px] font-medium bg-zinc-900/60 border border-purple-500/10 hover:border-purple-500/30 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    🐛 Report Bug / Glitch
                  </button>
                  <button
                    onClick={() => selectQuickTopic("Billing/Credits Question 💳")}
                    className="py-1 px-2 text-[10px] font-medium bg-zinc-900/60 border border-purple-500/10 hover:border-purple-500/30 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    💳 Credits/Billing Problem
                  </button>
                  <button
                    onClick={() => selectQuickTopic("Trouble logging in 🔑")}
                    className="py-1 px-2 text-[10px] font-medium bg-zinc-900/60 border border-purple-500/10 hover:border-purple-500/30 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    🔑 Login / Auth Glitches
                  </button>
                </div>
              </div>
            )}

            {/* Daily limit tracker status */}
            <div className="px-4 py-2 bg-purple-950/20 border-t border-purple-500/10 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                <Brain className="h-3.5 w-3.5 text-purple-400" />
                Limits: {getSupportChatUsageInfo().remaining} / {getSupportChatUsageInfo().limit} remaining today
              </span>
              <span className="text-[9px] font-mono text-purple-450 font-bold uppercase tracking-wider">
                {user && userPlan !== "free" ? "PREMIUM PLAN (20 Max)" : "FREE USER (7 Max)"}
              </span>
            </div>

            {/* Bottom Form entry bar for user prompt */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 border-t border-purple-500/15 bg-purple-950/15 flex items-center gap-2"
            >
              <input
                ref={chatInputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={getSupportChatUsageInfo().isLocked ? "Daily limit reached. Refreshes in 24 hours." : "Describe your issue or ask a question..."}
                className="flex-1 bg-zinc-900/90 border border-purple-500/15 focus:border-purple-500/40 rounded-xl px-3 py-2 text-xs sm:text-[13px] text-white placeholder-zinc-500 outline-none transition-all font-sans"
                disabled={isLoading || getSupportChatUsageInfo().isLocked}
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                disabled={!inputMessage.trim() || isLoading || getSupportChatUsageInfo().isLocked}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Permanent direct email help bar footer */}
            <div className="bg-purple-950/40 px-4 py-2 flex items-center justify-between text-[9px] font-mono border-t border-purple-500/10">
              <span className="text-zinc-500 uppercase tracking-widest font-extrabold flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-purple-400" /> ESCALATE PROMPT
              </span>
              <a
                href="mailto:auratech4444@gmail.com"
                className="text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 font-bold"
              >
                <Mail className="h-3 w-3" /> auratech4444@gmail.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SupportChat;
