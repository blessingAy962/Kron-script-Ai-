import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  History, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  Loader2, 
  ChevronRight,
  Sparkles,
  Sliders,
  Quote,
  MessageSquare,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from "firebase/firestore";

type HistoryItem = {
  id: string;
  type: "script" | "prompt" | "caption";
  title: string;
  previewText: string;
  metadata: string;
  createdAt: string;
  originalData: any;
};

export default function DashboardHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "script" | "prompt" | "caption">("all");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Set up real-time snapshots to listen strictly to user-owned scripts, prompts & captions
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // ZERO-TRUST QUERY: Strictly scope by user.uid to guarantee privacy at the query layer
    const scriptsQuery = query(
      collection(db, "scripts"), 
      where("user_id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(scriptsQuery, (snap) => {
      const parsedItems: HistoryItem[] = snap.docs.map((d) => {
        const data = d.data();
        const seconds = data.created_at?.seconds || 0;
        
        // Determine type based on status attribute (script, prompt, caption)
        let normalizedType: "script" | "prompt" | "caption" = "script";
        if (data.status === "prompt") {
          normalizedType = "prompt";
        } else if (data.status === "caption") {
          normalizedType = "caption";
        }

        const textContent = data.content || "";
        const previewText = textContent 
          ? (textContent.length > 250 ? textContent.slice(0, 250) + "..." : textContent) 
          : "No content available";

        return {
          id: d.id,
          type: normalizedType,
          title: data.title || (normalizedType === "prompt" ? "Compiled Prompts" : normalizedType === "caption" ? "Viral Caption Pack" : "Untitled Screenplay"),
          previewText: previewText,
          metadata: data.hook || `Type: ${normalizedType.toUpperCase()} • ${data.word_count || 0} words`,
          createdAt: seconds ? new Date(seconds * 1000).toISOString() : new Date().toISOString(),
          originalData: data
        };
      });

      // Sort with newest creations first
      parsedItems.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setItems(parsedItems);
      setLoading(false);
    }, (err) => {
      console.error("Secure subscription failed:", err);
      toast.error("Security sync failed. Please check network logs.");
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Content copied successfully");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteItem = async (item: HistoryItem) => {
    try {
      await deleteDoc(doc(db, "scripts", item.id));
      toast.success(`${item.type.toUpperCase()} removed from workspace`);
    } catch (err) {
      toast.error("Failed to delete record");
    }
  };

  const handleExportTxt = (item: HistoryItem) => {
    try {
      const element = document.createElement("a");
      let fileContent = `TITLE: ${item.title}\nMETADATA: ${item.metadata}\nDATE: ${new Date(item.createdAt).toLocaleString()}\n\n-- GENERATED BODY --\n\n${item.originalData.content || ""}`;
      
      const fileName = `${item.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_export.txt`;
      const file = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast.success(`Export file initialized for ${item.type}!`);
    } catch (err) {
      toast.error("Failed to download export file");
    }
  };

  const handleClearAllHistory = async () => {
    try {
      const filtered = items.filter(
        (it) => activeFilter === "all" || it.type === activeFilter
      );
      
      toast.loading(`Purging ${filtered.length} workspace entries...`);
      for (const item of filtered) {
        await deleteDoc(doc(db, "scripts", item.id));
      }
      toast.dismiss();
      toast.success("Selected workspace history deleted permanently!");
      setShowClearConfirm(false);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to clear history entries");
    }
  };

  const filteredItems = items
    .filter((it) => activeFilter === "all" || it.type === activeFilter)
    .filter(
      (it) =>
        it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.previewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.metadata.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getIcon = (type: string) => {
    switch (type) {
      case "script": 
        return <FileText className="h-4 w-4 text-primary shrink-0" />;
      case "prompt": 
        return <Sliders className="h-4 w-4 text-amber-500 shrink-0" />;
      case "caption": 
        return <MessageSquare className="h-4 w-4 text-purple-400 shrink-0" />;
      default: 
        return <History className="h-4 w-4 text-primary shrink-0" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-left pb-16 font-body">
      
      {/* Upper header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-6"
      >
        <div>
          <h1 className="text-2.5xl md:text-3.5xl font-display font-black tracking-tight uppercase text-foreground">
            Workspace History
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Access, view, search, export and clear your compiled screenplay scripts, viral captions, and engineered prompts.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/25 px-4 py-2 rounded-xl text-xs font-mono font-bold text-primary">
            <History className="h-4 w-4 text-primary animate-pulse" />
            <span>REALTIME ARCHIVE Sync</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground font-semibold">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>End-to-End Privacy Hardened</span>
          </div>
        </div>
      </motion.div>

      {/* Control Panel: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prompt, script content or category keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/20 border border-border/80 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium placeholder-muted-foreground/80 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-left"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/30 border border-border/60 rounded-2xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "script", label: "Scripts" },
            { id: "prompt", label: "Prompts" },
            { id: "caption", label: "Captions" }
          ].map((filt) => (
            <button
              key={filt.id}
              onClick={() => setActiveFilter(filt.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-tight transition-all uppercase cursor-pointer whitespace-nowrap ${
                activeFilter === filt.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filt.label}
            </button>
          ))}
        </div>

      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-left">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <span className="text-xs font-medium text-muted-foreground font-mono">Synchronizing workspace snaps securely...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card border border-border/70 p-12 text-center rounded-3xl space-y-4">
          <div className="h-12 w-12 bg-muted/45 rounded-2xl flex items-center justify-center mx-auto border border-border">
            <History className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground uppercase font-mono tracking-widest font-black">No matching logs found</p>
          <p className="text-sm font-medium text-foreground max-w-sm mx-auto">
            You haven't generated any {activeFilter === "all" ? "items" : activeFilter + "s"} satisfying this search query yet. Submit concepts in the Workspace Suite to compile data logs.
          </p>
        </div>
      ) : (
        <div className="space-y-6 text-left">
          
          {/* Header containing quick stats & Purge action */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-extrabold tracking-widest text-muted-foreground/80">
              Showing {filteredItems.length} Workspace Asset{filteredItems.length !== 1 ? "s" : ""}
            </span>

            {/* Clear confirm wrapper */}
            <div className="relative">
              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 text-red-500 text-[10px] font-bold font-mono tracking-tight transition-all uppercase cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Purge {activeFilter === "all" ? "A" : activeFilter.slice(0,1).toUpperCase() + activeFilter.slice(1)}ll History
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border/80">
                  <span className="text-[9px] font-mono tracking-tight text-red-400 font-bold px-2">Are you sure?</span>
                  <button
                    onClick={handleClearAllHistory}
                    className="px-2.5 py-1 text-[9px] font-mono font-extrabold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all uppercase cursor-pointer"
                  >
                    Confirm purge
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 text-[9px] font-mono font-bold hover:bg-muted text-foreground rounded-lg transition-all uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid system rendering high-fidelity glass cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card border border-border/80 p-5 rounded-2xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group overflow-hidden bg-muted/5 min-h-[220px]"
                >
                  {/* Glass ambient color block according to item type */}
                  <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-300 ${
                    item.type === "script" ? "bg-primary" : item.type === "prompt" ? "bg-amber-500" : "bg-purple-500"
                  }`} />

                  {/* Header info */}
                  <div className="space-y-3.5 relative z-10 w-full">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl border ${
                          item.type === "script" 
                            ? "bg-primary/10 border-primary/20 text-primary" 
                            : item.type === "prompt" 
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                              : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        }`}>
                          {getIcon(item.type)}
                        </div>
                        <div className="text-left font-mono">
                          <span className="block text-[8px] uppercase font-extrabold text-muted-foreground/80 tracking-widest">{item.type}</span>
                          <span className="block text-[10px] text-muted-foreground font-black">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Operational tools */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleCopy(item.id, item.originalData.content || item.previewText)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-border/40"
                          title="Copy details"
                        >
                          {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleExportTxt(item)}
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-border/40"
                          title="Download item (.txt)"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-muted-foreground transition-all cursor-pointer border border-border/40"
                          title="Remove from history"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta description text */}
                    <div className="space-y-2 mt-2 w-full">
                      <h4 className="text-xs font-bold text-foreground line-clamp-1 truncate font-display uppercase tracking-wide">
                        {item.title}
                      </h4>
                      
                      {/* Generous pre/mono scroll styled view box for actual generated code */}
                      <div className="text-[11px] text-muted-foreground bg-muted/35 hover:bg-muted/40 border border-border/50 p-2.5 rounded-xl font-mono text-left max-h-[140px] overflow-y-auto w-full leading-relaxed select-text whitespace-pre-wrap">
                        {item.originalData.content || item.previewText}
                      </div>
                    </div>
                  </div>

                  {/* Actions / bottom statistics card footer */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-4 select-none">
                    <span className="font-bold tracking-tight uppercase text-[9px] text-muted-foreground/75 truncate max-w-[70%]">
                      {item.metadata}
                    </span>
                    <button
                      onClick={() => handleCopy(item.id, item.originalData.content || item.previewText)}
                      className="text-primary hover:text-primary/80 font-bold tracking-wider inline-flex items-center gap-0.5 group/link cursor-pointer hover:underline"
                    >
                      Copy Content
                      <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      )}

    </div>
  );
}

export { DashboardHistory };
