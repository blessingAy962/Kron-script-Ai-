import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  MessageSquare, 
  Cpu, 
  Plus, 
  Trash2, 
  Download, 
  Brain, 
  X, 
  Menu, 
  Check, 
  Search, 
  Pin, 
  Archive, 
  Copy, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  ArrowRight,
  Settings as SettingsIcon,
  Heart,
  Briefcase,
  Code,
  Sigma,
  BookOpen,
  Info,
  ExternalLink,
  Edit2,
  Bookmark,
  ChevronRight,
  HelpCircle,
  FileCheck2,
  Clock,
  LogOut,
  Sliders,
  Sparkle
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";
import { KronLogo } from "../components/KronLogo";
import { SettingsMenu } from "../components/SettingsMenu";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  content?: string; // Text content if text-based
  previewUrl?: string; // Image URL if image-based
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO date
  files?: AttachedFile[];
}

interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

interface ChatInputRef {
  setValue: (val: string) => void;
  getValue: () => string;
}

const ChatInputArea = forwardRef<
  ChatInputRef,
  {
    isLoading: boolean;
    attachedFiles: AttachedFile[];
    isListening: boolean;
    speechError: string;
    toggleSpeechRecognition: () => void;
    triggerFileClick: () => void;
    triggerImageClick: () => void;
    removeAttachedFile: (idx: number) => void;
    onSend: (text: string) => void;
  }
>(({
  isLoading,
  attachedFiles,
  isListening,
  speechError,
  toggleSpeechRecognition,
  triggerFileClick,
  triggerImageClick,
  removeAttachedFile,
  onSend,
}, ref) => {
  const [inputValue, setInputValue] = useState("");

  useImperativeHandle(ref, () => ({
    setValue: (val: string) => setInputValue(val),
    getValue: () => inputValue,
  }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(inputValue);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900 shrink-0">
      <div className="max-w-3xl md:max-w-4xl mx-auto flex flex-col gap-2">
        {/* Draft file attachment chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 py-1">
            {attachedFiles.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-foreground shrink-0 max-w-[200px]"
              >
                {file.type === "image" ? (
                  <img
                    src={file.previewUrl}
                    alt="preview"
                    className="w-5 h-5 rounded-md object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                )}
                <span className="truncate font-sans font-medium text-[10.5px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(idx)}
                  className="p-0.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  title="Remove file"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Standard text panel editor styled beautifully like ChatGPT / Claude */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-[#fafafa] dark:bg-slate-950/60 p-2 focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary/50 transition-all select-text">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Kron AI anything (coding query, research task, mathematical breakdown, essays)..."
            rows={2}
            className="w-full bg-transparent border-none outline-none ring-0 resize-none text-xs sm:text-sm py-2 px-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 leading-normal min-h-[44px] max-h-[160px] font-sans font-bold"
          />

          {/* Lower Action buttons */}
          <div className="flex items-center justify-between border-t border-slate-250 dark:border-slate-900 pt-2 px-2 select-none">
            {/* File attach shortcuts */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={triggerFileClick}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer flex items-center justify-center"
                title="Upload text-based document (.txt, .md, .py, etc.)"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={triggerImageClick}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer flex items-center justify-center"
                title="Upload image for context mapping (.jpg, .png, etc.)"
              >
                <ImageIcon className="h-4 w-4" />
              </button>

              {/* Microphone voice dictation */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  isListening
                    ? "bg-red-100 dark:bg-red-500/10 text-red-500 animate-pulse"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
                title="Dictate with Speech Input"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {speechError && (
                <span className="text-[9px] font-semibold text-red-500 text-left font-mono">Failed</span>
              )}
            </div>

            {/* Send CTA */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9, y: 1 }}
              whileHover={{ scale: 1.04 }}
              disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
              onClick={() => onSend(inputValue)}
              className="p-2.5 bg-primary hover:bg-primary/95 text-white shadow-sm shadow-primary/10 rounded-xl cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              title="Deliver instruction to Kron AI"
            >
              <Send className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Information disclaimer tag row */}
        <div className="flex justify-between items-center px-1 select-none">
          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold">Shift + Enter for new line</span>
          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1 leading-none">
            🔒 Kron AI Privacy Locked
          </span>
        </div>
      </div>
    </div>
  );
});

ChatInputArea.displayName = "ChatInputArea";

export function isPromptUnsafe(text: string): boolean {
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

export default function DashboardKronAI() {
  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string>("free");
  
  // Partition storage keys to prevent conversation leaking across user accounts
  const threadsKey = user ? `kron_premium_threads_${user.uid}` : "kron_premium_threads_anonymous";
  const lastActiveKey = user ? `kron_last_active_thread_${user.uid}` : "kron_last_active_thread_anonymous";
  const instructionsKey = user ? `kron_user_instructions_${user.uid}` : "kron_user_instructions_anonymous";
  
  // Sync user plan in real-time
  useEffect(() => {
    if (!user) return;
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsubscribe = onSnapshot(coinsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserPlan(data.plan ?? "free");
      }
    }, (err) => {
      console.warn("Could not load user plan dynamically in chat page:", err);
    });
    return () => unsubscribe();
  }, [user]);

  // -----------------------------------------
  // Chat Usage Limit Tracker (Sliding 24-Hour)
  // -----------------------------------------
  const [activeChatUsageCount, setActiveChatUsageCount] = useState<number>(0);

  const getChatUsageInfo = () => {
    if (!user) return { count: 0, limit: 8, remaining: 8, isLocked: false };
    const isProTier = userPlan === "pro_creator" || userPlan === "pro" || user?.email === "starbruce91@gmail.com";
    const limit = isProTier ? 30 : 8;
    const timestampsKey = `kron_chat_timestamps_${user.uid}`;
    let savedTimestamps: number[] = [];
    try {
      savedTimestamps = JSON.parse(localStorage.getItem(timestampsKey) || "[]");
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

  const recordChatMessageUsage = () => {
    if (!user) return;
    const timestampsKey = `kron_chat_timestamps_${user.uid}`;
    let savedTimestamps: number[] = [];
    try {
      savedTimestamps = JSON.parse(localStorage.getItem(timestampsKey) || "[]");
    } catch {}
    const nowMs = Date.now();
    const updated = [...savedTimestamps, nowMs].filter((t: number) => nowMs - t < 24 * 60 * 60 * 1000);
    localStorage.setItem(timestampsKey, JSON.stringify(updated));
    setActiveChatUsageCount(updated.length);
  };

  useEffect(() => {
    if (!user) return;
    setActiveChatUsageCount(getChatUsageInfo().count);
    const interval = setInterval(() => {
      setActiveChatUsageCount(getChatUsageInfo().count);
    }, 10000); // refresh every 10 seconds in background
    return () => clearInterval(interval);
  }, [user, userPlan]);
  
  // -----------------------------------------
  // Core AI State Managers
  // -----------------------------------------
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "pinned" | "archived">("all");
  
  // Settings & Tone Profile
  const [aiTone, setAiTone] = useState<"balanced" | "creative" | "precise">("balanced");
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState("");

  const [soundOn, setSoundOn] = useState(() => {
    return safeGetItem("auratech_touch_sound", "true") !== "false";
  });

  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.enabled === "boolean") {
        setSoundOn(customEvent.detail.enabled);
      }
    };
    window.addEventListener("auratech_audio_toggle", handleAudioChange);
    return () => window.removeEventListener("auratech_audio_toggle", handleAudioChange);
  }, []);

  const toggleLocalSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    safeSetItem("auratech_touch_sound", nextVal ? "true" : "false");
    window.dispatchEvent(new CustomEvent("auratech_audio_toggle", { detail: { enabled: nextVal } }));
  };

  // Speech and Attachment state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Chat stream state
  const inputAreaRef = useRef<ChatInputRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  
  // Layout states (Responsive & Panels)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // -----------------------------------------
  // Initial Loader from localStorage (User-isolated)
  // -----------------------------------------
  useEffect(() => {
    if (!user) {
      // Clear in-memory state cleanly when logged out or during transitions
      setThreads([]);
      setActiveThreadId("");
      setCustomInstructions([]);
      return;
    }

    // 1. Thread sync
    const savedThreads = localStorage.getItem(threadsKey);
    let parsedThreads: Thread[] = [];
    if (savedThreads) {
      try {
        parsedThreads = JSON.parse(savedThreads);
      } catch (err) {
        console.error("Local storage sync error", err);
      }
    }

    // Default welcoming thread
    if (parsedThreads.length === 0) {
      const defaultThreadId = `default-premier-session-${user.uid}`;
      const initialThread: Thread = {
        id: defaultThreadId,
        title: "Welcome to Kron AI",
        createdAt: new Date().toISOString(),
        isPinned: true,
        isArchived: false,
        messages: []
      };
      parsedThreads = [initialThread];
    }

    setThreads(parsedThreads);
    
    // Choose active session or default to first
    const lastActiveId = localStorage.getItem(lastActiveKey);
    if (lastActiveId && parsedThreads.some(t => t.id === lastActiveId)) {
      setActiveThreadId(lastActiveId);
    } else {
      setActiveThreadId(parsedThreads[0].id);
    }

    // 2. Custom persistent memories/instructions
    const savedInstructions = localStorage.getItem(instructionsKey);
    if (savedInstructions) {
      try {
        setCustomInstructions(JSON.parse(savedInstructions));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaults = [
        "Include actionable step-by-step points in answers",
        "Keep code explanations clean and easy to read",
        "Always respond with highly verified facts and structured markdown syntax"
      ];
      setCustomInstructions(defaults);
      localStorage.setItem(instructionsKey, JSON.stringify(defaults));
    }

    // Adapt sidebar initially based on window width
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [user, threadsKey, lastActiveKey, instructionsKey]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Auto Scroll viewport
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  // Synchronizer
  const syncAndSave = (updatedThreads: Thread[]) => {
    setThreads(updatedThreads);
    localStorage.setItem(threadsKey, JSON.stringify(updatedThreads));
  };

  // -----------------------------------------
  // Session Actions (Add, Delete, Pin, Archive, Rename)
  // -----------------------------------------
  const handleNewChat = () => {
    const threadId = `session-${Date.now()}`;
    const newThread: Thread = {
      id: threadId,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      messages: [],
      isPinned: false,
      isArchived: false
    };

    const nextThreads = [newThread, ...threads];
    syncAndSave(nextThreads);
    setActiveThreadId(threadId);
    localStorage.setItem(lastActiveKey, threadId);
    inputAreaRef.current?.setValue("");
    toast.success("Initialized a fresh conversation.");
    
    // close sidebar on small screens
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    localStorage.setItem(lastActiveKey, id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextThreads = threads.filter(t => t.id !== id);
    
    if (nextThreads.length === 0) {
      // Re-initialize default
      const defaultId = user ? `new-workspace-thread-${user.uid}` : "new-workspace-thread";
      const emptyThread: Thread = {
        id: defaultId,
        title: "Welcome to Kron AI",
        createdAt: new Date().toISOString(),
        messages: []
      };
      syncAndSave([emptyThread]);
      setActiveThreadId(defaultId);
      localStorage.setItem(lastActiveKey, defaultId);
    } else {
      syncAndSave(nextThreads);
      if (activeThreadId === id) {
        const firstUnarchived = nextThreads.find(t => !t.isArchived) || nextThreads[0];
        setActiveThreadId(firstUnarchived.id);
        localStorage.setItem(lastActiveKey, firstUnarchived.id);
      }
    }
    toast.success(`Deleted conversation thread.`);
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextThreads = threads.map(t => {
      if (t.id === id) {
        return { ...t, isPinned: !t.isPinned };
      }
      return t;
    });
    syncAndSave(nextThreads);
    const found = nextThreads.find(t => t.id === id);
    toast.success(found?.isPinned ? "Thread pinned to Favorites." : "Thread unpinned.");
  };

  const handleToggleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextThreads = threads.map(t => {
      if (t.id === id) {
        return { ...t, isArchived: !t.isArchived };
      }
      return t;
    });
    syncAndSave(nextThreads);
    const found = nextThreads.find(t => t.id === id);
    
    // If we archived active thread, switch to something else
    if (activeThreadId === id) {
      const remainingUnarchived = nextThreads.filter(t => !t.isArchived);
      if (remainingUnarchived.length > 0) {
        setActiveThreadId(remainingUnarchived[0].id);
        localStorage.setItem(lastActiveKey, remainingUnarchived[0].id);
      } else {
        setActiveThreadId(nextThreads[0].id);
        localStorage.setItem(lastActiveKey, nextThreads[0].id);
      }
    }
    
    toast.success(found?.isArchived ? "Thread moved to Archive." : "Thread retrieved from Archive.");
  };

  const handleStartRename = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(id);
    setEditingTitleValue(title);
  };

  const handleSaveRename = (id: string) => {
    if (!editingTitleValue.trim()) {
      setEditingThreadId(null);
      return;
    }
    const nextThreads = threads.map(t => {
      if (t.id === id) {
        return { ...t, title: editingTitleValue.trim() };
      }
      return t;
    });
    syncAndSave(nextThreads);
    setEditingThreadId(null);
    toast.success("Conversation renamed.");
  };

  // -----------------------------------------
  // Speech Voice Input Control
  // -----------------------------------------
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not natively support HTML5 Voice Input. Try Google Chrome or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      setSpeechError("");

      const r = new SpeechRecognition();
      r.continuous = false;
      r.interimResults = false;
      r.lang = "en-US";

      r.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          const currentVal = inputAreaRef.current?.getValue() || "";
          const spacing = currentVal ? " " : "";
          inputAreaRef.current?.setValue(currentVal + spacing + text);
          toast.success("Voice transcribed successfully.");
        }
      };

      r.onerror = (err: any) => {
        console.error("Speech Error", err);
        setSpeechError("Speech device processing error.");
        setIsListening(false);
      };

      r.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = r;
      r.start();
      toast.info("Listening... Speak clearly.");
    }
  };

  // -----------------------------------------
  // Simulated & Textual File Parsers
  // -----------------------------------------
  const triggerFileClick = () => {
    fileInputRef.current?.click();
  };

  const triggerImageClick = () => {
    imageInputRef.current?.click();
  };

  const processFileSelected = (file: File) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File exceeds premium limits. File bigger than 100mb not allowed.");
      return;
    }
    
    const isImage = file.type.startsWith("image/");
    const sizeStr = (file.size / 1024).toFixed(1) + " KB";

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target?.result as string;
        const attached: AttachedFile = {
          name: file.name,
          size: sizeStr,
          type: "image",
          previewUrl: base64Url
        };
        setAttachedFiles(prev => [...prev, attached]);
        toast.success(`Image "${file.name}" attached successfully.`);
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const textValue = e.target?.result as string;
        const attached: AttachedFile = {
          name: file.name,
          size: sizeStr,
          type: "text",
          content: textValue
        };
        setAttachedFiles(prev => [...prev, attached]);
        toast.success(`Document "${file.name}" uploaded. Premium context mapping active.`);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFileSelected(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFileSelected(files[0]);
    }
  };

  const removeAttachedFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
    toast.info("Attachment removed.");
  };

  // -----------------------------------------
  // Memory & Settings Panels Actions
  // -----------------------------------------
  const handleAddInstruction = () => {
    const text = newInstruction.trim();
    if (!text) return;
    if (customInstructions.includes(text)) {
      toast.error("Instruction already registered.");
      return;
    }
    const nextList = [...customInstructions, text];
    setCustomInstructions(nextList);
    localStorage.setItem(instructionsKey, JSON.stringify(nextList));
    setNewInstruction("");
    toast.success("Updated core instructions profile of Kron AI.");
  };

  const handleDeleteInstruction = (idx: number) => {
    const nextList = customInstructions.filter((_, i) => i !== idx);
    setCustomInstructions(nextList);
    localStorage.setItem(instructionsKey, JSON.stringify(nextList));
    toast.info("Instruction removed.");
  };

  // -----------------------------------------
  // Sending Messages & Triggering AI API Core
  // -----------------------------------------
  const handleSend = async (forcedText?: string) => {
    if (!activeThreadId) return;
    const currentVal = inputAreaRef.current?.getValue() || "";
    const text = (forcedText !== undefined ? forcedText : currentVal).trim();
    
    // Allow empty messages if there are attached files (like an image-only query)
    if (!text && attachedFiles.length === 0) return;

    // Enforce sliding chat message limit
    const usage = getChatUsageInfo();
    if (usage.isLocked) {
      toast.error("You have run out of Free credits. Move to a paid plan or wait for free credits to reset.");
      return;
    }

    // Reset current inputs immediately
    if (forcedText === undefined) {
      inputAreaRef.current?.setValue("");
    }
    const pendingAttachments = [...attachedFiles];
    setAttachedFiles([]);

    // Record usage
    recordChatMessageUsage();

    // Secure prompt interceptor checklist
    if (isPromptUnsafe(text)) {
      const newUserMessage: Message = {
        id: `usr-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: new Date().toISOString(),
        files: pendingAttachments
      };
      const currentThread = threads.find(t => t.id === activeThreadId);
      if (!currentThread) return;

      const updatedMessages = [...currentThread.messages, newUserMessage];
      const updatedThreads = threads.map(t => {
        if (t.id === activeThreadId) {
          const originalTitle = t.title === "New Conversation" || t.title === "Welcome to Kron AI" 
            ? (text.length > 25 ? text.substring(0, 25) + "..." : text)
            : t.title;

          return {
            ...t,
            title: originalTitle,
            messages: updatedMessages
          };
        }
        return t;
      });

      syncAndSave(updatedThreads);
      setIsLoading(true);

      setTimeout(() => {
        const finalThreads: Thread[] = updatedThreads.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `ast-${Date.now()}`,
                  role: "assistant",
                  content: "I can't do that. Is there anything I can do for you?",
                  timestamp: new Date().toISOString()
                }
              ]
            };
          }
          return t;
        });
        syncAndSave(finalThreads);
        setIsLoading(false);
      }, 400);
      return;
    }

    // construct raw prompt text containing uploaded file data context if applicable
    let queryBody = text;
    if (pendingAttachments.length > 0) {
      const documentsText = pendingAttachments
        .filter(f => f.type === "text" && f.content)
        .map(f => `=== FILE NAME: ${f.name} ===\n${f.content}\n==================\n`)
        .join("\n");
      
      const imagesInfoStr = pendingAttachments
        .filter(f => f.type === "image")
        .map(f => `[Attached Image: ${f.name} - Size: ${f.size}]`)
        .join(", ");

      if (documentsText) {
        queryBody += `\n\n[USER PROVIDED ATTACHED DIRECTIVE DOCUMENTATION]:\n${documentsText}`;
      }
      if (imagesInfoStr) {
        queryBody += `\n\n(Note: User also visually attached those image files: ${imagesInfoStr})`;
      }
    }

    const newUserMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text || (pendingAttachments.length > 0 ? "Analyzed raw uploaded files." : ""),
      timestamp: new Date().toISOString(),
      files: pendingAttachments
    };

    // Update state instantly and trigger call
    const currentThread = threads.find(t => t.id === activeThreadId);
    if (!currentThread) return;

    const updatedMessages = [...currentThread.messages, newUserMessage];
    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        // Auto update title from first message
        const originalTitle = t.title === "New Conversation" || t.title === "Welcome to Kron AI" 
          ? (text.length > 25 ? text.substring(0, 25) + "..." : text || "Uploaded Context Task")
          : t.title;

        return {
          ...t,
          title: originalTitle,
          messages: updatedMessages
        };
      }
      return t;
    });

    syncAndSave(updatedThreads);
    setIsLoading(true);

    try {
      // Build pure history message array for model context call with attached file support
      const historyPayload = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        files: msg.files
      }));

      // Injects prompt settings from the tone control
      let activeMemories = [...customInstructions];
      activeMemories.push(`Adopt a ${aiTone || "balanced"} response tone: balanced means concise but thorough, creative means more conversational and storytelling, precise means highly technical, academic, and dry.`);

      const response = await fetch("/api/kron-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          memories: activeMemories
        })
      });

      if (!response.ok) {
        throw new Error("API Route processing connection disrupted.");
      }

      const resJson = await response.json();
      const assistantContent = resJson.message?.content || "No operational text was returned. I'm completely ready once you are—please feel free to send another message.";

      const finalThreads: Thread[] = updatedThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `ast-${Date.now()}`,
                role: "assistant" as "assistant",
                content: assistantContent,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      });

      syncAndSave(finalThreads);

    } catch (err) {
      console.error(err);
      toast.error("Unable to connect to gateway network.");
      
      const errorFallback: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I encountered an error processing that request right now. I'm completely ready once you are—please feel free to send another message, or let me know how I can assist you with coding, writing, or analysis.",
        timestamp: new Date().toISOString()
      };

      const finalThreads = updatedThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, errorFallback]
          };
        }
        return t;
      });
      syncAndSave(finalThreads);
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    toast.success("Text successfully parsed and copied to clipboard.");
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Regenerate response
  const handleRegenerate = async (targetMsgIdx: number) => {
    if (!activeThread) return;
    
    // Slice off all messages after and including this assistant message
    const previousMessages = activeThread.messages.slice(0, targetMsgIdx);
    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: previousMessages
        };
      }
      return t;
    });

    syncAndSave(updatedThreads);
    setIsLoading(true);

    try {
      const historyPayload = previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        files: msg.files
      }));

      // Injects prompt settings from the tone control
      let activeMemories = [...customInstructions];
      activeMemories.push(`Adopt a ${aiTone || "balanced"} response tone.`);

      const response = await fetch("/api/kron-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historyPayload,
          memories: activeMemories
        })
      });

      if (!response.ok) {
        throw new Error("Cognitive link reset.");
      }

      const resJson = await response.json();
      const assistantContent = resJson.message?.content || "Connection lost. Please try again.";

      const finalThreads: Thread[] = updatedThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: `ast-${Date.now()}`,
                role: "assistant" as "assistant",
                content: assistantContent,
                timestamp: new Date().toISOString()
              }
            ]
          };
        }
        return t;
      });

      syncAndSave(finalThreads);
    } catch (e) {
      toast.error("Failed to generate sequence. Retaining context.");
    } finally {
      setIsLoading(false);
    }
  };

  // Continue writing
  const handleContinueWriting = () => {
    handleSend("Please continue writing logically where you left off.");
  };

  const clearAllHistory = () => {
    const confirmation = window.confirm("Are you absolutely sure you want to clear ALL conversation threads and history? This action is irreversible.");
    if (!confirmation) return;

    const defaultId = user ? `fresh-session-${user.uid}` : "fresh-session";
    const defaultThread: Thread = {
      id: defaultId,
      title: "Welcome to Kron AI",
      createdAt: new Date().toISOString(),
      messages: []
    };
    syncAndSave([defaultThread]);
    setActiveThreadId(defaultId);
    localStorage.setItem(lastActiveKey, defaultId);
    toast.success("All conversation grids flushed cleanly.");
  };

  // -----------------------------------------
  // Search & Filtering Selector
  // -----------------------------------------
  const filteredThreads = threads.filter(t => {
    const queryMatch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterMode === "pinned") return t.isPinned && !t.isArchived && queryMatch;
    if (filterMode === "archived") return t.isArchived && queryMatch;
    return !t.isArchived && queryMatch;
  });

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`max-w-none w-full flex flex-col h-[calc(100vh-4rem)] text-left font-body relative overflow-hidden bg-[#f8fafc] dark:bg-slate-950 border-0 rounded-none transition-colors duration-200 ${
        isDragOver ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
    >
      {/* Hidden file selectors */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.js,.ts,.py,.json,.css,.html,.md,.pdf,.csv"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/10 dark:bg-primary/5 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-50 pointer-events-none"
          >
            <div className="p-5 rounded-3xl bg-card border-2 border-dashed border-primary shadow-xl flex flex-col items-center gap-4 text-center">
              <Paperclip className="h-10 w-10 text-primary animate-bounce animate-duration-1000" />
              <div>
                <h3 className="font-display font-black text-foreground uppercase tracking-tight text-sm">Drop document or photo</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">Attach file and process context automatically with Kron AI.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -----------------------------------------
          Main Layout Matrix
          ----------------------------------------- */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* --- [A] Left Sidebar: Sessions Log --- */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="shrink-0 flex flex-col border-r border-slate-200/80 dark:border-slate-900 bg-[#f1f5f9] dark:bg-slate-900/60 overflow-hidden relative shadow-sm h-full"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-200/80 dark:border-slate-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-primary/10 border border-primary/20 text-primary">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-xs font-display font-black tracking-widest uppercase text-slate-800 dark:text-slate-100">Conversations</span>
                  </div>

                  {/* New Session Button */}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleNewChat}
                    className="p-1.8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/10 transition-all cursor-pointer flex items-center justify-center"
                    title="Start New Chat"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500">
                    <Search className="h-3.5 w-3.5" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside chats..."
                    className="w-full text-xs font-sans font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-primary/50"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Selector tabs */}
                <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-0.5 rounded-xl">
                  <button
                    onClick={() => setFilterMode("all")}
                    className={`py-1.5 text-[10px] uppercase font-bold rounded-lg transition-colors ${
                      filterMode === "all" 
                        ? "bg-[#f1f5f9] dark:bg-slate-800 text-foreground" 
                        : "text-slate-400 dark:text-slate-500 hover:text-foreground"
                    }`}
                  >
                    Recent
                  </button>
                  <button
                    onClick={() => setFilterMode("pinned")}
                    className={`py-1.5 text-[10px] uppercase font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      filterMode === "pinned" 
                        ? "bg-[#f1f5f9] dark:bg-slate-800 text-foreground" 
                        : "text-slate-400 dark:text-slate-500 hover:text-foreground"
                    }`}
                  >
                    <Heart className="h-2.5 w-2.5 fill-current" />
                    Starred
                  </button>
                  <button
                    onClick={() => setFilterMode("archived")}
                    className={`py-1.5 text-[10px] uppercase font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      filterMode === "archived" 
                        ? "bg-[#f1f5f9] dark:bg-slate-800 text-foreground" 
                        : "text-slate-400 dark:text-slate-500 hover:text-foreground"
                    }`}
                  >
                    <Archive className="h-2.5 w-2.5" />
                    Archive
                  </button>
                </div>
              </div>

              {/* Sidebar List Scroll */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500">
                    <MessageSquare className="h-7 w-7 mx-auto stroke-1 mb-1 opacity-40 animate-pulse" />
                    <p className="text-[10px] font-sans font-semibold">No chats matched filter request.</p>
                  </div>
                ) : (
                  filteredThreads.map(t => {
                    const isActive = t.id === activeThreadId;
                    const isEditing = editingThreadId === t.id;

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (!isEditing) handleSelectThread(t.id);
                        }}
                        className={`group cursor-pointer p-2.5 rounded-xl border transition-all flex items-center gap-2.5 select-none relative ${
                          isActive
                            ? "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        <span className="p-1 rounded-md bg-[#e2e8f0] dark:bg-slate-800 group-hover:text-primary transition-colors flex items-center justify-center">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </span>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingTitleValue}
                              onChange={(e) => setEditingTitleValue(e.target.value)}
                              onBlur={() => handleSaveRename(t.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(t.id);
                                if (e.key === "Escape") setEditingThreadId(null);
                              }}
                              autoFocus
                              className="w-full bg-[#f1f5f9] dark:bg-slate-900 text-xs font-medium font-sans px-1.5 py-0.5 rounded outline-none ring-1 ring-primary text-foreground"
                            />
                          ) : (
                            <p className="text-xs font-sans font-semibold truncate leading-tight pr-6">
                              {t.title}
                            </p>
                          )}
                          <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 mt-1 block">
                            {new Date(t.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        {/* Pinned badge */}
                        {t.isPinned && !isEditing && (
                          <span className="absolute right-2.5 top-3 text-red-500 self-center">
                            <Pin className="h-2.5 w-2.5 fill-current rotate-45" />
                          </span>
                        )}

                        {/* Quick controls Hover overlay */}
                        <div className="absolute right-1.5 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-slate-950 py-1.5 pl-1.5 pr-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                          <button
                            onClick={(e) => handleTogglePin(t.id, e)}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              t.isPinned 
                                ? "text-red-500 bg-red-50 dark:bg-red-500/10" 
                                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100"
                            }`}
                            title={t.isPinned ? "Unpin thread" : "Pin message"}
                          >
                            <Pin className="h-3 w-3" />
                          </button>
                          
                          <button
                            onClick={(e) => handleToggleArchive(t.id, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                            title={t.isArchived ? "Unarchive chat" : "Backup to Archive"}
                          >
                            <Archive className="h-3 w-3" />
                          </button>

                          {!isEditing && (
                            <button
                              onClick={(e) => handleStartRename(t.id, t.title, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                              title="Rename Thread"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}

                          <button
                            onClick={(e) => handleDeleteThread(t.id, e)}
                            className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                            title="Delete Chat Thread"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer account diagnostics */}
              <div className="p-4 border-t border-slate-200/80 dark:border-slate-900 bg-[#e2e8f0]/40 dark:bg-slate-900/90 gap-2 flex flex-col justify-end">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/25 font-bold text-xs flex items-center justify-center uppercase select-none font-sans shrink-0">
                    {user?.email ? user.email.substring(0, 2) : "AI"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 font-sans">{user?.email || "Pro Studio User"}</p>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-1">PRO ACCOUNT</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    onClick={clearAllHistory}
                    className="text-[9px] font-mono text-red-500/80 hover:text-red-500 font-bold hover:underline transition-colors cursor-pointer"
                  >
                    Clear All Memory
                  </button>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">v2.1 Stable</span>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* --- [B] Central Panel: Modern Premium Chat Interface --- */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 relative">
          
          {/* Header toolbar stats */}
          <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-900 flex items-center justify-between shrink-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md z-10 w-full">
            <div className="flex items-center gap-3">
              {/* Menu button toggles */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.8 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-[#f1f5f9] dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                title="Toggle Sidebar Logs"
              >
                <Menu className="h-4 w-4" />
              </motion.button>

              <div className="flex items-center gap-2 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs font-display font-medium text-slate-800 dark:text-slate-200">
                  {activeThread?.title || "Welcome to Kron AI"}
                </h2>
              </div>
            </div>

            {/* Quick configuration toggle icons */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-850">
                <button
                  onClick={() => setAiTone("balanced")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-colors ${
                    aiTone === "balanced" 
                      ? "bg-white dark:bg-slate-800 text-primary shadow-xs" 
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                  }`}
                  title="Balanced intelligent tone"
                >
                  Balanced
                </button>
                <button
                  onClick={() => setAiTone("creative")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-colors ${
                    aiTone === "creative" 
                      ? "bg-white dark:bg-slate-800 text-primary shadow-xs" 
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                  }`}
                  title="Creative writer tone"
                >
                  Creative
                </button>
                <button
                  onClick={() => setAiTone("precise")}
                  className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-colors ${
                    aiTone === "precise" 
                      ? "bg-white dark:bg-slate-800 text-primary shadow-xs" 
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
                  }`}
                  title="Structured expert tone"
                >
                  Precise
                </button>
              </div>

              {/* Instructions settings toggle */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsSystemSettingsOpen(true)}
                className="p-1.8 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-[#f1f5f9] dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                title="Configure Personas & System Prompts"
              >
                <Sliders className="h-4 w-4" />
              </motion.button>

              {/* Universal Settings Cog allowing turning off sounds */}
              <SettingsMenu />
            </div>
          </div>

          {/* Conversations Body */}
          <div className="flex-1 overflow-y-auto w-full select-text min-h-0 bg-[#fbfcfd] dark:bg-slate-950/20 relative">
            <div className="max-w-3xl md:max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6">
              
              {/* If empty chat history, show Gorgeous premium general welcome screen */}
              {!activeThread || activeThread.messages.length === 0 ? (
                <div className="py-8 md:py-12 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 flex flex-col items-center"
                  >
                    <KronLogo variant="symbol" size="xl" glow={true} />
                  </motion.div>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="max-w-xl px-4"
                  >
                    <h1 className="text-2xl md:text-3xl font-display font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      Hello, I'm KRON AI.
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-3 font-normal font-sans leading-relaxed">
                      I can help with coding, research, writing, mathematics, business, content creation, and everyday questions. How can I help you today?
                    </p>
                  </motion.div>

                  {/* Dynamic Category Tasks Cards Grid */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 md:mt-10 w-full max-w-2xl text-left px-2"
                  >
                    <div 
                      onClick={() => handleSend("Draft an advanced software architecture template in TypeScript using generic hooks and clean separation of concerns")}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer shadow-sm relative group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
                          <Code className="h-3.5 w-3.5" />
                        </span>
                        <h3 className="text-xs font-display font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Technical Coding</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">Design patterns, debugging, architectural structures & refactoring.</p>
                      <span className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div 
                      onClick={() => handleSend("Explain quantum mechanics, multi-world state theories and quantum entanglement like I am a 5 year old with elegant analogies")}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer shadow-sm relative group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
                          <BookOpen className="h-3.5 w-3.5" />
                        </span>
                        <h3 className="text-xs font-display font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Academic Research</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">Explain difficult science theories, analyze literature, or translate dialects.</p>
                      <span className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div 
                      onClick={() => handleSend("Solve the integration of root of (a^2 - x^2) with complete logical limits and steps")}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer shadow-sm relative group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1 rounded bg-purple-100 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
                          <Sigma className="h-3.5 w-3.5" />
                        </span>
                        <h3 className="text-xs font-display font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Mathematics</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">Calculus solutions, algebra formulations, and analytical breakdown.</p>
                      <span className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>

                    <div 
                      onClick={() => handleSend("I need a robust SaaS corporate business presentation elevator hook and standard metrics slide structure")}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer shadow-sm relative group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1 rounded bg-green-100 dark:bg-green-500/10 text-green-500 flex items-center justify-center">
                          <Briefcase className="h-3.5 w-3.5" />
                        </span>
                        <h3 className="text-xs font-display font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Business & Marketing</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">Copywriting, marketing strategy pitch formulas, and cold outreach drafts.</p>
                      <span className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* Active stream thread viewport bubbles */
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {activeThread.messages.map((msg, idx) => {
                      const isUser = msg.role === "user";
                      const bubbleId = msg.id;

                      return (
                        <motion.div
                          key={bubbleId}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          layout="position"
                          className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                        {/* Perfect Avatar Indicators */}
                        <div className="shrink-0 select-none">
                          {isUser ? (
                            <div className="w-9 h-9 rounded-xl border flex items-center justify-center text-white bg-slate-900 border-slate-800">
                              <User className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 flex items-center justify-center">
                              <KronLogo variant="symbol" size="sm" glow={true} />
                            </div>
                          )}
                        </div>

                        {/* Text bubble box */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          {/* Sender Identity & time */}
                          <div className={`flex items-center gap-2 flex-wrap ${isUser ? "justify-end" : "justify-start"}`}>
                            <span className="text-[11px] font-display font-black uppercase text-slate-700 dark:text-slate-300">
                              {isUser ? "You" : "Kron AI"}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Render uploaded attachments within the bubble */}
                          {msg.files && msg.files.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 justify-start">
                              {msg.files.map((file, fileIdx) => (
                                <div 
                                  key={fileIdx}
                                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shrink-0 max-w-[240px]"
                                >
                                  {file.type === "image" ? (
                                    <img 
                                      src={file.previewUrl} 
                                      alt="Attachment preview" 
                                      className="w-8 h-8 rounded-lg object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                      <FileText className="h-4 w-4" />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold truncate text-slate-700 dark:text-slate-300 pr-1">{file.name}</p>
                                    <p className="text-[9px] text-slate-400 font-mono font-bold uppercase">{file.size}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Markdown message body with perfect Light/Dark modes readable typography */}
                          <div className={`p-5 rounded-2xl leading-normal border text-slate-800 dark:text-slate-100 ${
                            isUser
                              ? "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 rounded-tr-none text-left"
                              : "bg-[#f8fafc]/50 dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-900 rounded-tl-none text-left"
                          }`}>
                            <div className="markdown-body font-sans text-[13.5px] leading-relaxed break-all space-y-2">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed font-normal">{children}</p>,
                                  code: ({ children, className }) => {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const isInline = !match;
                                    return isInline ? (
                                      <code className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded font-mono text-[11.5px] font-semibold">
                                        {children}
                                      </code>
                                    ) : (
                                      <div className="my-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-50">
                                        <div className="px-4 py-2 bg-slate-900 text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center justify-between select-none">
                                          <span>{match[1]}</span>
                                          <button
                                            onClick={() => {
                                              navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                                              toast.success("Code block copied to clipboard.");
                                            }}
                                            className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5 text-[9px]"
                                          >
                                            <Copy className="h-3 w-3" />
                                            <span>Copy Code</span>
                                          </button>
                                        </div>
                                        <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono">
                                          <code>{children}</code>
                                        </pre>
                                      </div>
                                    );
                                  },
                                  pre: ({ children }) => <>{children}</>,
                                  ul: ({ children }) => <ul className="list-disc pl-6 my-2 space-y-1.5 font-normal">{children}</ul>,
                                  ol: ({ children }) => <ol className="list-decimal pl-6 my-2 space-y-1.5 font-normal">{children}</ol>,
                                  li: ({ children }) => <li className="mb-0.5">{children}</li>,
                                  h1: ({ children }) => <h1 className="text-base font-black font-display uppercase tracking-tight my-3.5 text-slate-900 dark:text-white pb-1 border-b border-border/40">{children}</h1>,
                                  h2: ({ children }) => <h2 className="text-sm font-black font-display uppercase tracking-tight my-3 text-slate-900 dark:text-white">{children}</h2>,
                                  h3: ({ children }) => <h3 className="text-xs font-bold font-display my-2.5 text-slate-900 dark:text-white">{children}</h3>,
                                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/50 pl-4 py-1.5 my-3 bg-primary/5 rounded-r-xl text-xs text-slate-600 dark:text-slate-400 italic font-medium">{children}</blockquote>,
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>

                            {/* Actions bar for Assistant Bubbles */}
                            {!isUser && (
                              <div className="mt-4 pt-3.5 border-t border-slate-205 dark:border-slate-850 flex items-center gap-3.5 text-[10px] font-mono font-bold text-slate-400 select-none">
                                <button
                                  onClick={() => handleCopyText(msg.content, bubbleId)}
                                  className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Copy response"
                                >
                                  {copiedMessageId === bubbleId ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                                      <span className="text-emerald-500">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" />
                                      <span>Copy response</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleRegenerate(idx)}
                                  disabled={isLoading}
                                  className="hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-45 cursor-pointer"
                                  title="Regenerate this response"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  <span>Regenerate</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}

              {/* Loader response visual animation */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 flex items-center justify-center shrink-0">
                    <KronLogo variant="symbol" size="sm" glow={true} />
                  </div>
                  <div className="p-5 bg-slate-100/40 dark:bg-slate-900/20 border border-slate-200/60 dark:border-slate-900 rounded-2xl rounded-tl-none flex items-center gap-2 self-start select-none">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Assistant Action Ribbon (e.g. Continue prompt) when thread has history */}
          {activeThread && activeThread.messages.length > 0 && !isLoading && (
            <div className="px-4 py-1.5 shrink-0 bg-[#fbfcfd]/80 dark:bg-slate-950/80 border-t border-slate-200/40 dark:border-slate-900/40 flex items-center justify-center select-none">
              <button
                onClick={handleContinueWriting}
                className="text-[10px] uppercase font-bold text-primary hover:bg-primary/10 px-3.5 py-1.8 rounded-xl border border-primary/20 bg-background transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-3 w-3" />
                <span>Continue generation</span>
              </button>
            </div>
          )}

          {/* Daily message count visual tracker badge */}
          {user && (
            <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60">
              <span className="text-[9.5px] font-mono text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
                <Brain className="h-3.5 w-3.5 text-primary" />
                Kron Script AI Chat: {getChatUsageInfo().remaining} of {getChatUsageInfo().limit} messages free today (24h rolling)
              </span>
              <span className="text-[9px] font-mono text-indigo-500 font-extrabold uppercase tracking-widest">
                {userPlan === "pro_creator" || userPlan === "pro" ? "PRO CREATOR TIER" : "FREE PLAN TIER"}
              </span>
            </div>
          )}

          {/* Input text attachments container and editor */}
          <ChatInputArea
            ref={inputAreaRef}
            isLoading={isLoading}
            attachedFiles={attachedFiles}
            isListening={isListening}
            speechError={speechError}
            toggleSpeechRecognition={toggleSpeechRecognition}
            triggerFileClick={triggerFileClick}
            triggerImageClick={triggerImageClick}
            removeAttachedFile={removeAttachedFile}
            onSend={(val) => handleSend(val)}
          />

        </div>

      </div>

      {/* --- [C] Settings Instruction modal sidebar overlay --- */}
      <AnimatePresence>
        {isSystemSettingsOpen && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-primary/10 text-primary">
                    <Brain className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-display font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">System Prompts & Profile</h3>
                </div>
                <button
                  onClick={() => setIsSystemSettingsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto no-scrollbar">
                <div>
                  <h4 className="text-xs font-display font-black uppercase text-slate-800 dark:text-slate-300 tracking-wider">Custom Prompt Instructions</h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal mt-1">
                    Feed custom instructions or profile facts directly into Kron AI's instructions. These facts are synchronized with every transaction.
                  </p>
                </div>

                {/* Input Add */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddInstruction();
                    }}
                    placeholder="E.g., Adopt a professional educational tone..."
                    className="flex-1 text-xs bg-[#f8fafc] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 font-sans font-medium"
                  />
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleAddInstruction}
                    className="px-3.5 py-1.8 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Add
                  </motion.button>
                </div>

                {/* List instruction tags */}
                <div className="space-y-2 pt-2">
                  <h5 className="text-[10px] font-mono font-bold uppercase text-slate-400">ACTIVE PERSISTENT INSTRUCTIONS ({customInstructions.length})</h5>
                  {customInstructions.length === 0 ? (
                    <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 bg-slate-50">
                      <p className="text-xs font-medium font-sans">No instructions active. Kron AI operates on pure balanced defaults.</p>
                    </div>
                  ) : (
                    customInstructions.map((inst, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-xl text-xs flex items-start gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <p className="flex-1 text-xs leading-relaxed font-sans font-medium pr-2">{inst}</p>
                        <button
                          onClick={() => handleDeleteInstruction(idx)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded hover:bg-slate-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Audio and Click setting integration */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-display font-black uppercase text-slate-800 dark:text-slate-300 tracking-wider">Audio Settings</h4>
                  <div className="flex items-center justify-between bg-[#f8fafc] dark:bg-slate-950 p-3 rounded-xl border border-slate-250/60 dark:border-slate-850">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider block leading-none text-slate-800 dark:text-slate-200">
                        Interactive Click Sounds
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal mt-1 block">
                        Toggle bubble acoustic sound effects when typing & clicking elements.
                      </span>
                    </div>
                    <button
                      onClick={toggleLocalSound}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        soundOn ? "bg-purple-600" : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    >
                      <span className="sr-only">Toggle click sounds</span>
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          soundOn ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-end">
                <button
                  onClick={() => setIsSystemSettingsOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-all"
                >
                  Save & Apply Changes
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
export { DashboardKronAI };
