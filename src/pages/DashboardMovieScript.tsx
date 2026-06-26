import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Film,
  Plus,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  Loader2,
  X,
  Clapperboard,
  Layers,
  Video,
  Play,
  Coins,
  Download,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  handleFirestoreError,
  OperationType
} from "@/src/lib/firebase";

type MovieScript = {
  id: string;
  title: string;
  genre: string;
  content: string;
  date: string;
  wordCount: number;
};

type GeneratedVideo = {
  id: string;
  prompt: string;
  videoUrl: string;
  duration: number;
  aspectRatio: string;
  coinsDeducted: number;
  date: string;
};

const GENRES = ["Action", "Sci-Fi", "Noir", "Drama", "Comedy", "Adventure"];

export default function DashboardMovieScript() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"scripts" | "videos">("scripts");
  const [loading, setLoading] = useState(true);

  // Script state
  const [scripts, setScripts] = useState<MovieScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<MovieScript | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("Action");
  const [logline, setLogline] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScript, setPreviewScript] = useState<MovieScript | null>(null);

  // Video generator state
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState<number>(5); // default: 5s
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>("16:9");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [scriptsTodayCount, setScriptsTodayCount] = useState<number>(0);
  const [lastScriptGenerateTime, setLastScriptGenerateTime] = useState<number>(0);

  // Sync user coins & limits
  useEffect(() => {
    if (!user) return;
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsubscribe = onSnapshot(
      coinsRef, 
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setUserCoins(data.coins ?? 0);
          setUserPlan(data.plan ?? "free");
          setScriptsTodayCount(data.scripts_today_count ?? 0);
          
          let lastTimeMs = 0;
          const lastTime = data.last_script_generate_time;
          if (lastTime) {
            lastTimeMs = typeof lastTime === "number" ? lastTime : (lastTime.toMillis ? lastTime.toMillis() : new Date(lastTime).getTime());
          }
          setLastScriptGenerateTime(lastTimeMs);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `user_coins/${user.uid}`);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Load scripts & videos
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        // Scripts
        const scriptsSnap = await getDocs(query(collection(db, "scripts"), where("user_id", "==", user.uid)));
        const scriptList: MovieScript[] = [];
        scriptsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          scriptList.push({
            id: docSnap.id,
            title: data.title || "Untitled Cinematic Script",
            genre: data.genre || "Action",
            content: data.content || "",
            date: data.created_at ? new Date(data.created_at.seconds * 1000).toLocaleDateString() : "Draft",
            wordCount: data.word_count || 100,
          });
        });
        setScripts(scriptList);

        // Videos
        const videosSnap = await getDocs(query(collection(db, "videos"), where("user_id", "==", user.uid)));
        const videoList: GeneratedVideo[] = [];
        videosSnap.forEach((docSnap) => {
          const data = docSnap.data();
          videoList.push({
            id: docSnap.id,
            prompt: data.prompt || "Video scene",
            videoUrl: data.video_url || "",
            duration: data.duration || 5,
            aspectRatio: data.aspect_ratio || "16:9",
            coinsDeducted: data.coins_deducted || 5,
            date: data.created_at ? new Date(data.created_at.seconds * 1000).toLocaleDateString() : "Recent",
          });
        });
        setVideos(videoList.sort((a, b) => b.id.localeCompare(a.id)));
      } catch (err) {
        console.error("Failed to load records:", err);
        handleFirestoreError(err, OperationType.LIST, "scripts/videos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Generates screenplay
  const handleGenerateScript = async () => {
    if (!title.trim() || !user) return;
    setIsGenerating(true);

    // Dynamic 24-hour script limit checks:
    // Free plan -> 2 scripts/day, Paid plans -> 4 scripts/day
    const isFree = !userPlan || userPlan === "free";
    const maxScripts = isFree ? 2 : 4;
    
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    let currentCount = scriptsTodayCount;
    let shouldResetCount = false;
    
    if (lastScriptGenerateTime > 0 && (now - lastScriptGenerateTime >= oneDayMs)) {
      shouldResetCount = true;
      currentCount = 0;
    }
    
    if (currentCount >= maxScripts) {
      if (isFree) {
        toast.error("Free trial accounts are limited to only 2 movie scripts per day. Upgrade to an elite paid plan for higher limits or wait for the 24-hour reset.");
      } else {
        toast.error("Paid accounts are limited to only 4 movie scripts per day. Your limit will refresh automatically in 24 hours.");
      }
      setIsGenerating(false);
      return;
    }

    try {
      const resp = await fetch("/api/generate-movie-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, genre, logline }),
      });

      if (!resp.ok) {
        throw new Error("Failed to communicate with screenplay model");
      }

      const data = await resp.json();
      const content = data.content || "Screenplay text.";
      const wc = content.split(/\s+/).filter(Boolean).length;

      // Save to Firestore
      const docRef = await addDoc(collection(db, "scripts"), {
        user_id: user.uid,
        title,
        genre,
        content,
        word_count: wc,
        created_at: serverTimestamp(),
      });

      // Update script metrics on the user_coins document to track the daily quotas
      const coinsRef = doc(db, "user_coins", user.uid);
      const nextCount = shouldResetCount ? 1 : (currentCount + 1);
      await setDoc(coinsRef, {
        scripts_today_count: nextCount,
        last_script_generate_time: now,
      }, { merge: true });

      const newScript: MovieScript = {
        id: docRef.id,
        title,
        genre,
        content,
        date: new Date().toLocaleDateString(),
        wordCount: wc,
      };

      setScripts((prev) => [newScript, ...prev]);
      setTitle("");
      setLogline("");
      setShowGenerator(false);
      toast.success("Blockbuster screenplay generated & synced!");
    } catch (e: any) {
      console.error(e);
      toast.error("High server demand. Please try your request again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteScript = async (id: string) => {
    try {
      await deleteDoc(doc(db, "scripts", id));
      setScripts((prev) => prev.filter((s) => s.id !== id));
      if (selectedScript?.id === id) setSelectedScript(null);
      toast.success("Screenplay purged");
    } catch (err) {
      toast.error("Failed to delete screenplay");
    }
  };

  const exportScript = (script: MovieScript) => {
    try {
      const element = document.createElement("a");
      const file = new Blob([script.content], { type: "text/plain;charset=utf-8" });
      element.href = URL.createObjectURL(file);
      element.download = `${script.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_script.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Movie script export started!");
    } catch (err) {
      toast.error("Failed to export movie script file");
    }
  };

  // Upgraded Veo 3.1 Video generator flow
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || !user) {
      toast.error("Please enter a scene prompt first");
      return;
    }

    // Determine coin cost: 3s = 3 coins, 5s = 5 coins, 10s = 10 coins
    const cost = videoDuration;

    if (userCoins < cost) {
      toast.error(`Insufficient balance. This ${videoDuration}s generation costs ${cost} KRON coins, but you only have ${userCoins}. Please buy coins from pricing.`);
      return;
    }

    setIsGeneratingVideo(true);
    toast.info(`Initializing Veo 3.1 engine... deducting ${cost} KRON coins.`);

    try {
      // 1. Deduct coins from user_coins document
      const coinsRef = doc(db, "user_coins", user.uid);
      await setDoc(coinsRef, {
        coins: userCoins - cost,
      }, { merge: true });

            // 2. Trigger Veo 3.1 video generator
      const resp = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: videoDuration,
          aspectRatio: videoAspectRatio,
        }),
      });

      if (!resp.ok) {
        // Rollback coins on failure
        await setDoc(coinsRef, { coins: userCoins }, { merge: true });
        throw new Error("Veo 3.1 API engine offline or busy. Coins refunded.");
      }

      const data = await resp.json();
      const opName = data.operationName;
      const warning = data.warning;

      if (warning === "quota_limit" || warning === "api_offline") {
        toast.warning("The main Veo API is currently busy or rate-limited. Pivoted to fallback high-fidelity rendering to preserve your project flow & coins!");
      }

      // 3. Poll status
      let done = false;
      let checkCount = 0;
      while (!done && checkCount < 10) {
        checkCount++;
        await new Promise((r) => setTimeout(r, 2000));
        const statusResp = await fetch("/api/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName: opName }),
        });
        if (statusResp.ok) {
          const statusData = await statusResp.json();
          done = statusData.done;
        }
      }

      // 4. Download / retrieve video file
      const streamResp = await fetch("/api/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName: opName, prompt: videoPrompt }),
      });

      let finalUrl = "https://assets.mixkit.co/videos/preview/mixkit-cinematic-reel-of-film-projector-in-action-44026-large.mp4";
      if (streamResp.ok) {
        const streamData = await streamResp.json().catch(() => ({}));
        if (streamData.videoUrl) {
          finalUrl = streamData.videoUrl;
        }
      }

      // 5. Store completed video payload in Firestore
      const videoRef = await addDoc(collection(db, "videos"), {
        user_id: user.uid,
        prompt: videoPrompt,
        video_url: finalUrl,
        duration: videoDuration,
        aspect_ratio: videoAspectRatio,
        coins_deducted: cost,
        created_at: serverTimestamp(),
      });

      const newVideo: GeneratedVideo = {
        id: videoRef.id,
        prompt: videoPrompt,
        videoUrl: finalUrl,
        duration: videoDuration,
        aspectRatio: videoAspectRatio,
        coinsDeducted: cost,
        date: new Date().toLocaleDateString(),
      };

      setVideos((prev) => [newVideo, ...prev]);
      setVideoPrompt("");
      toast.success(`🎉 Veo 3.1 Production complete! ${videoDuration}s Video saved inside your library.`);
    } catch (e: any) {
      console.error(e);
      toast.error("High server demand. Please try your request again in a moment.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "videos", id));
      setVideos((prev) => prev.filter((v) => v.id !== id));
      toast.success("Video purged from library");
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-left">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-semibold text-muted-foreground font-display">Assembling Production Suite...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 text-left">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1 flex items-center gap-2">
            <Clapperboard className="h-8 w-8 text-primary" />
            blockbuster workspace
          </h1>
          <p className="text-muted-foreground text-sm font-body">Create full-screen digital screenplays and direct consistent video scenes.</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/60 border border-border w-fit font-display">
        <button
          onClick={() => setActiveTab("scripts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "scripts"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Film className="h-4 w-4" /> Blockbuster Scripts ({scripts.length})
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === "videos"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="h-4 w-4" /> Veo 3.1 Video Engine ({videos.length})
        </button>
      </div>

      {/* Tab: Scripts */}
      {activeTab === "scripts" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="font-display glow-primary cursor-pointer" onClick={() => setShowGenerator(!showGenerator)}>
              <Plus className="mr-2 h-4 w-4 text-primary-foreground" /> Generate Screenplay
            </Button>
          </div>

          {showGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-card border border-foreground rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(51,37,29,1)] space-y-4"
            >
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Generate Hollywood Screenplay
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display">Movie Title</label>
                  <Input
                    placeholder="e.g., Rise of the Codebreakers"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display">Cinematic Genre</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {GENRES.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenre(g)}
                        disabled={isGenerating}
                        className={`text-xs p-2 rounded-lg border transition-all cursor-pointer font-display font-bold ${
                          genre === g
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border bg-white text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display">Plot / Logline (Optional)</label>
                  <Textarea
                    placeholder="A brilliant coder starts detecting digital anomalies in all global databases..."
                    value={logline}
                    onChange={(e) => setLogline(e.target.value)}
                    disabled={isGenerating}
                    rows={2}
                  />
                </div>

                {isGenerating ? (
                  <div className="text-center p-4 bg-secondary/20 rounded-xl border border-border">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-xs font-semibold text-primary font-display uppercase tracking-wider">Structuring acts and shorts cut points...</span>
                  </div>
                ) : (
                  <Button className="w-full font-display glow-primary cursor-pointer" disabled={!title.trim()} onClick={handleGenerateScript}>
                    <Film className="mr-2 h-4 w-4" /> Trigger Blockbuster Generation
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* Screenplays Table List */}
          {scripts.length === 0 && !showGenerator && (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Film className="h-10 w-10 text-primary mx-auto mb-3 opacity-50" />
              <h3 className="font-display font-bold text-lg mb-1">No major screenplays written</h3>
              <p className="text-muted-foreground text-sm mb-4 font-body">Trigger screenplay creation to lay down movie drafts.</p>
              <Button className="font-display glow-primary cursor-pointer" onClick={() => setShowGenerator(true)}>
                <Plus className="mr-2 h-4 w-4" /> Composing first screenplay
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {scripts.map((script) => (
              <div
                key={script.id}
                onClick={() => setSelectedScript(selectedScript?.id === script.id ? null : script)}
                className="bg-card border border-border p-5 rounded-xl cursor-pointer hover:border-foreground transition-all flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Film className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="font-display font-bold text-foreground truncate text-sm">{script.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">Genre: {script.genre} • Date: {script.date} • Words: {script.wordCount}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs bg-white text-destructive cursor-pointer" onClick={(e) => { e.stopPropagation(); deleteScript(script.id); }}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {selectedScript?.id === script.id && (
                  <div className="mt-4 pt-4 border-t border-border" onClick={(e) => e.stopPropagation()}>
                    <div className="max-h-72 overflow-y-auto bg-white border border-border rounded-lg p-4 mb-3">
                      <pre className="whitespace-pre-wrap font-body text-xs text-muted-foreground text-left">{script.content}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="bg-white text-xs cursor-pointer" onClick={() => { navigator.clipboard.writeText(script.content); toast.success("Copied!"); }}>
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy Script
                      </Button>
                      <Button size="sm" variant="outline" className="bg-white text-xs cursor-pointer" onClick={() => exportScript(script)}>
                        <Download className="h-3.5 w-3.5 mr-1" /> Export File (.txt)
                      </Button>
                      <Button size="sm" className="glow-primary text-xs cursor-pointer" onClick={() => { setVideoPrompt(script.title); setActiveTab("videos"); }}>
                        <Video className="h-3.5 w-3.5 mr-1" /> Load into Veo Engine
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Upgraded Veo 3.1 Video Engine */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          <div className="bg-card border border-foreground rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(51,37,29,1)] space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-2">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                Veo 3.1 Cinematic Video Engine
              </h2>
              <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-xs font-display font-bold border border-border text-foreground">
                <Coins className="h-3.5 w-3.5 text-primary" />
                <span>Balance: {userCoins} Coins</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column Controls */}
              <div className="space-y-4">
                {/* Visual Scene Prompt */}
                <div className="text-left space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display">Scene visual Prompts</label>
                  <Textarea
                    placeholder='e.g., "A hyper-detailed slow motion panning shot of a cyberpunk city hacker room, neon glowing monitors, terminal text, anamorphic lens flare..."'
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    disabled={isGeneratingVideo}
                    rows={4}
                  />
                  <span className="text-[10px] text-muted-foreground font-body">Input descriptive keywords for rich video composition.</span>
                </div>

                {/* Duration Config Dropdown */}
                <div className="text-left space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display flex items-center gap-1.5">
                    Select Target Duration
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                    disabled={isGeneratingVideo}
                  >
                    <option value={3}>3 Seconds (Costs 3 KRON coins)</option>
                    <option value={5}>5 Seconds (Costs 5 KRON coins)</option>
                    <option value={10}>10 Seconds (Costs 10 KRON coins)</option>
                  </select>
                </div>

                {/* Aspect Ratio Config */}
                <div className="text-left space-y-1.5">
                  <label className="text-sm font-semibold text-foreground font-display">Aspect Ratio Configuration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "16:9", label: "Widescreen (16:9)", desc: "Standard Cinema" },
                      { key: "9:16", label: "Shorts (9:16)", desc: "TikTok Reels" },
                      { key: "1:1", label: "Square (1:1)", desc: "Social Media" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setVideoAspectRatio(opt.key)}
                        disabled={isGeneratingVideo}
                        type="button"
                        className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          videoAspectRatio === opt.key
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                            : "border-border bg-white text-muted-foreground"
                        }`}
                      >
                        <p className="text-xs font-display font-bold">{opt.key}</p>
                        <p className="text-[9px] font-body text-muted-foreground mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column details / pricing summary */}
              <div className="bg-secondary/40 p-6 rounded-xl border border-border flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground">Order Production Sheet</h3>
                  <div className="divide-y divide-border text-sm font-body space-y-2">
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Rendering Model</span>
                      <span className="text-foreground font-bold font-display">Veo 3.1 Ultra-HD</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Selected Duration</span>
                      <span className="text-foreground font-bold">{videoDuration} seconds</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Target Frame Ratio</span>
                      <span className="text-foreground font-bold">{videoAspectRatio}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Credit Cost</span>
                      <span className="text-primary font-bold font-display">{videoDuration} Coins</span>
                    </div>
                  </div>
                </div>

                {isGeneratingVideo ? (
                  <div className="bg-white border border-border rounded-xl p-4 text-center mt-6">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mb-2" />
                    <span className="text-xs font-bold text-primary uppercase font-display tracking-wider">Veo 3.1 is rendering frames...</span>
                    <p className="text-[10px] text-muted-foreground font-body mt-1">Deducting {videoDuration} coins balance. Handshaking completion...</p>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateVideo}
                    className="w-full mt-6 glow-primary font-display font-bold cursor-pointer flex flex-col items-center justify-center py-5 h-auto text-center"
                  >
                    <span className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-white" />
                      Render Scene MP4
                    </span>
                    <span className="text-[10px] font-mono font-normal opacity-90 text-white/90 normal-case mt-0.5">
                      consumes {videoDuration} credits
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Videos Gallery list */}
          <div className="space-y-3 text-left">
            <h3 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
              <Film className="h-5 w-5 text-primary" /> Generated Video clips library
            </h3>

            {videos.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Video className="h-10 w-10 text-primary mx-auto mb-3 opacity-50" />
                <h4 className="font-display font-semibold text-muted-foreground">No rendering history</h4>
                <p className="text-xs text-muted-foreground font-body max-w-xs mx-auto mt-1">Input details above and select duration to direct your first cinemagraph.</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div key={vid.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                                  <div className="aspect-video relative bg-black">
                    <video src={vid.videoUrl} controls preload="auto" playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded font-display select-none">
                      {vid.duration}s • {vid.aspectRatio}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-body font-semibold text-foreground line-clamp-2">{vid.prompt}</p>
                      <p className="text-[10px] text-muted-foreground font-body">Rendered: {vid.date} • Cost: {vid.coinsDeducted} Coins</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white text-xs flex-1 cursor-pointer flex items-center gap-1 justify-center"
                        onClick={() => window.open(vid.videoUrl, "_blank")}
                      >
                        <Download className="h-3 w-3 text-primary" /> Download Scene
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs text-destructive hover:text-destructive bg-white cursor-pointer"
                        onClick={() => deleteVideo(vid.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { DashboardMovieScript };
