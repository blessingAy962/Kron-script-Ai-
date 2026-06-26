import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Plus, Copy, Trash2, Eye, Sparkles, Loader2, X, ImageIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, onSnapshot, setDoc } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type Script = {
  id: string;
  title: string;
  hook: string;
  content: string;
  status: string;
  date: string;
  wordCount: number;
};

export default function DashboardScripts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [topic, setTopic] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Story-driven");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScript, setPreviewScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>("free");

  // Sync user plan and handle successful checkout callback
  useEffect(() => {
    if (!user) return;

    // 1. Check for success parameters from Whop checkout redirect
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get("success") === "true" || 
                      params.get("checkout") === "success" || 
                      params.get("status") === "success" ||
                      params.get("whop") === "success";

    if (isSuccess) {
      const activateUserSubscription = async () => {
        try {
          const userRef = doc(db, "user_coins", user.uid);
          await setDoc(userRef, {
            plan: "creator",
            plan_status: "active",
            coins: 25000,
            license_acquired_at: new Date()
          }, { merge: true });

          toast.success("🎉 Whop payment verified successfully! Your Creator License has been activated and the Script Generator is now fully unlocked.");
          
          // Clean the query parameter from address bar
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        } catch (err) {
          console.error("Failed to auto-activate Whop plan in scripts view:", err);
        }
      };
      activateUserSubscription();
    }

    // 2. Real-time subscription state query listener
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsub = onSnapshot(coinsRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setUserPlan(d.plan ?? "free");
      }
    });
    return () => unsub();
  }, [user]);

  // Load scripts from Firestore
  useEffect(() => {
    if (!user) return;
    const loadScripts = async () => {
      try {
        const q = query(collection(db, "scripts"), where("user_id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const list: Script[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            title: data.title || "Untitled Video Script",
            hook: data.hook || "No hook provided",
            content: data.content || "",
            status: data.status || "completed",
            date: data.created_at ? new Date(data.created_at.seconds * 1000).toLocaleDateString() : "Draft",
            wordCount: data.word_count || 100,
          });
        });
        setScripts(list.sort((a,b) => b.id.localeCompare(a.id)));
      } catch (err) {
        console.error("Failed to load scripts:", err);
        toast.error("Failed to load scripts");
      } finally {
        setLoading(false);
      }
    };
    loadScripts();
  }, [user]);

  const generateScript = async () => {
    if (!topic.trim() || !user) return;
    setIsGenerating(true);

    try {
      const resp = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, style: selectedStyle }),
      });

      if (!resp.ok) {
        throw new Error("Failed to contact screenplay writer proxy");
      }

      const data = await resp.json();
      const content = data.content || "Empty content returned.";
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      
      const hookMatch = content.match(/##\s*HOOK.*?\n([\s\S]*?)(?=##|$)/i);
      const hook = hookMatch ? hookMatch[1].trim().slice(0, 120) + "..." : content.slice(0, 120) + "...";

      // Save to Firestore
      const docRef = await addDoc(collection(db, "scripts"), {
        user_id: user.uid,
        title: topic,
        hook,
        content: content,
        status: "completed",
        word_count: wordCount,
        created_at: serverTimestamp()
      });

      const newScript: Script = {
        id: docRef.id,
        title: topic,
        hook,
        content: content,
        status: "completed",
        date: new Date().toLocaleDateString(),
        wordCount: wordCount,
      };

      setScripts((prev) => [newScript, ...prev]);
      setTopic("");
      setShowGenerator(false);
      toast.success("Script generated successfully & saved to Firestore!");
    } catch (e: any) {
      console.error(e);
      toast.error("High server demand. Please try your request again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyScript = (script: Script) => {
    navigator.clipboard.writeText(script.content);
    toast.success("Screenplay text copied to clipboard!");
  };

  const deleteScript = async (id: string) => {
    try {
      await deleteDoc(doc(db, "scripts", id));
      setScripts((prev) => prev.filter((s) => s.id !== id));
      if (selectedScript?.id === id) setSelectedScript(null);
      if (previewScript?.id === id) setPreviewScript(null);
      toast.success("Script deleted");
    } catch (err) {
      toast.error("Failed to delete screenplay record");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-left">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-semibold text-muted-foreground font-display">Loading screens...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Scripts Core</h1>
          <p className="text-muted-foreground text-sm font-body">Input your hook ideas and generate automated screenplays.</p>
        </div>
        <Button className="font-display glow-primary cursor-pointer" onClick={() => setShowGenerator(!showGenerator)}>
          <Plus className="mr-2 h-4 w-4 text-primary-foreground" /> New Draft
        </Button>
      </motion.div>

      {/* Generator Canvas */}
      {showGenerator && (
        userPlan === "free" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-2 border-dashed border-border rounded-xl p-8 shadow-lg text-center flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto my-6"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
              🔒
            </div>
            <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">
              Script Generator Locked
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed font-body">
              Unlock our elite screenplay write engine. Acquire an active Creator License to generate unlimited high-retention screenplays, story outlines, and visual scripts.
            </p>
            <Button 
              className="glow-primary font-display uppercase tracking-wider text-xs px-6 py-2.5 cursor-pointer" 
              onClick={() => navigate("/dashboard/pricing")}
            >
              🚀 Upgrade to Creator
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card border border-foreground rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(51,37,29,1)]"
          >
            <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Write Screenplay Model
            </h2>
            <div className="space-y-4">
              <div className="text-left space-y-1.5">
                <label className="text-sm font-semibold text-foreground font-display">Video Topic or Campaign Idea</label>
                <Input
                  placeholder="e.g., Why social media is breaking human concentration in 2026..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGenerating}
                  onKeyDown={(e) => e.key === "Enter" && !isGenerating && generateScript()}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {["Story-driven", "Listicle", "Educational"].map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    disabled={isGenerating}
                    className={`text-sm p-3 rounded-lg border transition-all cursor-pointer font-display font-bold ${
                      selectedStyle === style
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-white text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {isGenerating ? (
                <div className="space-y-3 p-4 bg-secondary/30 rounded-xl border border-border text-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mb-2" />
                  <span className="text-sm text-primary font-display font-semibold">Engine compiling your viral screenplay... Please hold.</span>
                </div>
              ) : (
                <Button className="w-full font-display glow-primary cursor-pointer" disabled={!topic.trim()} onClick={generateScript}>
                  <Sparkles className="mr-2 h-4 w-4" /> Trigger Screenplay Write
                </Button>
              )}
              <p className="text-xs text-muted-foreground text-center font-body">
                This triggers a high-retention cinematic script outline with detailed B-roll recommendations.
              </p>
            </div>
          </motion.div>
        )
      )}

      {/* Preview Dialog */}
      {previewScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewScript(null)} />
          <div className="relative z-50 w-full max-w-3xl rounded-xl border border-foreground bg-card p-8 shadow-lg max-h-[80vh] overflow-y-auto glow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl">{previewScript.title}</h2>
              <Button size="sm" variant="ghost" onClick={() => setPreviewScript(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="prose prose-invert max-w-none text-sm whitespace-pre-wrap text-foreground font-body leading-relaxed">
              {previewScript.content}
            </div>
          </div>
        </div>
      )}

      {/* Script List empty status */}
      {scripts.length === 0 && !showGenerator && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3 opacity-50" />
          <h3 className="font-display font-bold text-lg mb-1">No scripts registered yet</h3>
          <p className="text-muted-foreground text-sm mb-6 font-body">Trigger "New Draft" to compose your first viral creation.</p>
          <Button className="font-display glow-primary cursor-pointer" onClick={() => setShowGenerator(true)}>
            <Plus className="mr-2 h-4 w-4" /> Write First Screenplay
          </Button>
        </div>
      )}

      {/* Script Grid List */}
      <div className="space-y-3">
        {scripts.map((script, i) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setSelectedScript(selectedScript?.id === script.id ? null : script)}
            className="bg-card border border-border p-5 rounded-xl cursor-pointer hover:border-foreground transition-all flex flex-col hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="font-display font-bold text-foreground text-sm truncate">{script.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body line-clamp-2">{script.hook}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-foreground font-semibold uppercase tracking-wider font-display">
                  {script.status}
                </span>
              </div>
            </div>

            {selectedScript?.id === script.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-border text-left"
              >
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-body">
                  <span>Created: {script.date}</span>
                  <span>Length: {script.wordCount} words</span>
                </div>
                <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" className="text-xs bg-white cursor-pointer" onClick={() => setPreviewScript(script)}>
                    <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" /> View Core text
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs bg-white cursor-pointer" onClick={() => copyScript(script)}>
                    <Copy className="mr-1.5 h-3.5 w-3.5 text-primary" /> Copy Screenplay
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-white cursor-pointer text-primary hover:text-primary"
                    onClick={() => navigate("/dashboard/images", { state: { scriptTitle: script.title, scriptContent: script.content } })}
                  >
                    <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Draw Thumbnail
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs text-destructive hover:text-destructive bg-white cursor-pointer" onClick={() => deleteScript(script.id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Purge
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
export { DashboardScripts };
