import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Upload, 
  Coins, 
  Trash2, 
  CheckCircle, 
  Tv, 
  Sliders, 
  Zap, 
  Image as ImageIcon, 
  Video, 
  Eye, 
  Download, 
  Maximize2,
  RefreshCw,
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  EyeOff,
  Sun,
  Flame,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { Link } from "react-router-dom";
import { db } from "@/src/lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  onSnapshot 
} from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";

interface EnhancementConfig {
  removeBlur: boolean;
  faceRestore: boolean;
  colorGrade: boolean;
  sharpnessBoost: boolean;
  resolution: "2k" | "4k" | "8k";
}

export default function DashboardVisionAI() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(100);
  const [userPlan, setUserPlan] = useState<string>("free");
  const isProCreator = userPlan === "pro_creator" || user?.email === "starbruce91@gmail.com";
  const [fileType, setFileType] = useState<"image" | "video">("image");
  
  // Upload and results states
  const [originalFile, setOriginalFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [enhancedFile, setEnhancedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  
  // Custom slider comparison offset (0 to 100)
  const [sliderOffset, setSliderOffset] = useState<number>(50);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configuration options
  const [config, setConfig] = useState<EnhancementConfig>({
    removeBlur: true,
    faceRestore: true,
    colorGrade: true,
    sharpnessBoost: true,
    resolution: "4k"
  });

  // Diagnostics and metadata returned
  const [report, setReport] = useState<{
    originalSize: string;
    enhancedSize: string;
    processingTime: string;
    sharpenRatio: string;
    noiseDecline: string;
    upscaleMatrix: string;
    facesCount: number;
    colorSpectrum: string;
    detailedLogs: string[];
  } | null>(null);

  // Sync user coins balance and plan in real-time
  useEffect(() => {
    if (!user) return;
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsubscribe = onSnapshot(coinsRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBalance(data.coins ?? 100);
        setUserPlan(data.plan ?? "free");
      }
    }, (err) => {
      console.warn("Could not load user coins data dynamically:", err);
    });
    return () => unsubscribe();
  }, [user]);

  // Calculate Coin costs strictly based on upscale
  const getDeductionCost = () => {
    if (config.resolution === "2k") return 2000;
    if (config.resolution === "4k") return 4000;
    if (config.resolution === "8k") return 8000;
    return 2000;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    const isVid = file.type.startsWith("video/");
    const isImg = file.type.startsWith("image/");
    
    if (!isImg && !isVid) {
      toast.error("Format rejected. Please upload an image or video file.");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error("File exceeds premium limits. File bigger than 100mb not allowed.");
      return;
    }

    setFileType(isVid ? "video" : "image");
    setFileName(file.name);
    setEnhancedFile(null);
    setReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalFile(event.target?.result as string);
      toast.success(`${isVid ? "Video" : "Photo"} loaded into Kron Vision Matrix.`);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setOriginalFile(null);
    setFileName("");
    setEnhancedFile(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Slider controls for comparison
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderOffset(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || e.type === "mousemove") {
      handleSliderMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  // Main compilation triggers backend enhancement + coin deduction
  const handleEnhance = async () => {
    if (!user) {
      toast.error("Please sign in to access premium features.");
      return;
    }

    const isProCreator = userPlan === "pro_creator" || user?.email === "starbruce91@gmail.com";
    if (!isProCreator) {
      toast.error("Kron Vision AI is restricted to Pro Creator plans. Please upgrade to unleash 2k, 4k, and 8k neural enhancements.");
      return;
    }

    if (!originalFile) {
      toast.error("No raw media provided.");
      return;
    }

    const cost = getDeductionCost();
    if (balance < cost) {
      toast.error("You have run out of Free credits. Move to a paid plan or wait for free credits to reset");
      return;
    }

    setIsProcessing(true);
    setEnhancedFile(null);
    setReport(null);

    const stages = [
      "Initializing high-depth Bilateral de-noising matrices...",
      "Interpolating grid sub-pixels via Gemini Super-Resolution...",
      "Enhancing edge contrast using local cubic-spline vectors...",
      "Running Fusiform facial restoration algorithms...",
      "Calibrating high-fidelity Dolby vision color-grade lattices...",
      "Synchronizing compiled high-resolution metadata streams..."
    ];

    // Trigger stage transitions in UI
    let stageIndex = 0;
    setProcessingStage(stages[0]);
    const stageTimer = setInterval(() => {
      stageIndex++;
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex]);
      }
    }, 1200);

    try {
      // 1. Deduct dynamic coins from firestore
      const coinsRef = doc(db, "user_coins", user.uid);
      const snapBalance = await getDoc(coinsRef);
      const currentVal = snapBalance.exists() ? (snapBalance.data().coins ?? 100) : 100;
      const updatedBalance = Math.max(0, currentVal - cost);
      
      await setDoc(coinsRef, {
        coins: updatedBalance
      }, { merge: true });
      setBalance(updatedBalance);

      // 2. Call backend /api/enhance-media with options
      const res = await fetch("/api/enhance-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media: originalFile,
          fileType,
          fileName,
          config,
          cost
        })
      });

      clearInterval(stageTimer);

      if (!res.ok) {
        throw new Error("Enhancement container offline or rate-limited.");
      }

      const data = await res.json();
      setEnhancedFile(data.enhancedUrl);
      setReport(data.report);

      // 3. Save to History Collections so it instantly registers in universal history tab
      const isImg = fileType === "image";
      const collectionName = isImg ? "images" : "videos";
      
      const payload: any = {
        user_id: user.uid,
        prompt: `Enhanced ${fileType === "image" ? "Photo" : "Video"} de-blurred & upscaled dynamically to ${config.resolution.toUpperCase()}`,
        created_at: new Date(),
        coins_deducted: cost,
      };

      if (isImg) {
        payload.image_url = data.enhancedUrl;
      } else {
        payload.video_url = data.enhancedUrl;
        payload.duration = 5;
        payload.aspect_ratio = "16:9";
      }

      await addDoc(collection(db, collectionName), payload);
      toast.success(`🎉 ${fileType === "image" ? "Photo" : "Video"} enhanced successfully! ${cost} Credits deducted.`);

    } catch (err: any) {
      clearInterval(stageTimer);
      console.error(err);
      
      // Auto bug report ticket
      try {
        await addDoc(collection(db, "reports"), {
          user_email: user?.email || "anonymous",
          user_id: user?.uid || "anonymous",
          issue: `Failed generation in Kron Vision AI: ${err?.message || String(err)}`,
          tool: "Kron Vision AI",
          status: "pending",
          created_at: new Date()
        });
      } catch (repErr) {
        console.warn("Failed to generate automated bug report ticket:", repErr);
      }

      // Safe refund on absolute crash
      try {
        const coinsRef = doc(db, "user_coins", user.uid);
        await setDoc(coinsRef, { coins: balance }, { merge: true });
        setBalance(balance);
      } catch (refundErr) {
        console.error("Refund syncing fault: ", refundErr);
      }
      
      // Dynamic high-demand user-facing warning
      toast.error("We are experiencing high demand right now. Wait a few minutes. If this issue keeps coming, Report for support.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 text-left pb-16 font-body">
      {/* Visual Header Banner */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8 overflow-hidden">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl pointer-events-none animate-pulse" />
        
        <div className="relative space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-mono font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              VISION HQ v4.0
            </span>
            <span className="p-1 px-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">
              PRO CREATOR EXCLUSIVE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase text-foreground pt-1">
            KRON VISION AI
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Upload your blurry, noisy, or low-resolution creative assets. Revitalize faces, grade color vectors, remove digital shake blur, and super-resolve instantly.
          </p>
        </div>

        {/* Dashboard Balance Tracker Card */}
        <div className="flex flex-col gap-2 bg-card border border-border mt-3 md:mt-0 p-4.5 rounded-2xl relative shadow-xs min-w-[200px] hover:border-primary/40 transition-colors">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-muted-foreground uppercase">
            <Coins className="h-4 w-4 text-amber-500" />
            <span>CREATOR FUEL WALLET</span>
          </div>
          <div className="text-xl font-display font-black tracking-tight mt-1 text-foreground">
            {balance} <span className="text-xs font-mono text-muted-foreground uppercase">Credits</span>
          </div>

        </div>
      </div>

      {true ? (
        <div id="vision_lockout" className="w-full bg-card border border-border rounded-3xl p-10 py-16 text-center max-w-2xl mx-auto space-y-6 shadow-xs relative overflow-hidden mt-6 animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-red-500" />
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-2">
            <Clock className="h-8 w-8 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div className="space-y-2">
            <span className="p-1 px-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">
              SYSTEM MAINTENANCE ACTIVE
            </span>
            <h2 className="text-xl md:text-2xl font-display font-black tracking-tight uppercase text-foreground">KRON VISION AI UNDER MAINTENANCE</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Our neural processing farms and high-throughput upscaling nodes are currently undergoing a scheduled system upgrade. Vision super-resolution, motion-deblurring, and face-restoration engines are temporarily locked for all users.
            </p>
          </div>
          <div className="border border-border/80 rounded-2xl p-6 bg-muted/20 text-left max-w-md mx-auto space-y-4">
            <span className="block text-[10px] uppercase font-mono tracking-widest text-amber-500 font-black">⚙️ PLANNED UPGRADES</span>
            <ul className="text-xs text-muted-foreground space-y-2.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Next-generation 16K ultra-fidelity tensor upscaler integration</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Real-time optical flow enhancement for dynamic footage</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Upgraded neural face-restoration filters with higher accuracy</span>
              </li>
            </ul>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/80 font-semibold italic">
            This module will remain locked until maintenance protocols are completely verified. We appreciate your patience.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Controls and Settings (5-cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border p-6 rounded-3xl space-y-6 relative overflow-hidden shadow-xs">
            {/* Header info */}
            <div className="flex items-center gap-2 pb-4 border-b border-border/80">
              <div className="p-2 bg-primary/10 border border-primary/20 text-primary rounded-xl">
                <Sliders className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-display font-extrabold uppercase tracking-tight text-foreground">ENHANCEMENT MATRIX</h2>
                <p className="text-[10px] text-muted-foreground font-mono">SPECIFY PHYSICAL FOCUS CONTROLS</p>
              </div>
            </div>

            {/* Config Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-muted/10">
                <div className="space-y-0.5 text-left">
                  <span className="block text-xs font-bold text-foreground uppercase tracking-tight font-display">Remove Digital Blur</span>
                  <span className="block text-[10px] text-muted-foreground font-sans">De-blur high-frequency motion artifacts.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.removeBlur}
                  onChange={(e) => setConfig({ ...config, removeBlur: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-muted/10">
                <div className="space-y-0.5 text-left">
                  <span className="block text-xs font-bold text-foreground uppercase tracking-tight font-display">Face Restoration</span>
                  <span className="block text-[10px] text-muted-foreground font-sans">Re-construct sub-pixel facial features cleanly.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.faceRestore}
                  onChange={(e) => setConfig({ ...config, faceRestore: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-muted/10">
                <div className="space-y-0.5 text-left">
                  <span className="block text-xs font-bold text-foreground uppercase tracking-tight font-display">Dolby Color Calibration</span>
                  <span className="block text-[10px] text-muted-foreground font-sans">Calibrate chrominance vector levels and saturation.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.colorGrade}
                  onChange={(e) => setConfig({ ...config, colorGrade: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary/40"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/80 bg-muted/10">
                <div className="space-y-0.5 text-left">
                  <span className="block text-xs font-bold text-foreground uppercase tracking-tight font-display">Sharpness & De-Noising</span>
                  <span className="block text-[10px] text-muted-foreground font-sans">Suppress sensor gain noise and emphasize outlines.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.sharpnessBoost}
                  onChange={(e) => setConfig({ ...config, sharpnessBoost: e.target.checked })}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="space-y-2.5">
              <span className="block text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">Target Resolution Dimensions</span>
              <div className="grid grid-cols-3 gap-2">
                {(["2k", "4k", "8k"] as const).map((res) => {
                  const isActive = config.resolution === res;
                  return (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setConfig({ ...config, resolution: res })}
                      className={`py-3.5 rounded-2xl border font-mono text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                        isActive 
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/10 font-bold" 
                          : "bg-muted/10 border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                      }`}
                    >
                      <div className="text-xs uppercase font-extrabold">{res}</div>
                      <div className="text-[8px] mt-0.5 opacity-80 min-w-0">
                        {res === "2k" ? "2048 x 1080" : res === "4k" ? "4096 x 2160" : "7680 x 4320"}
                      </div>
                      <div className="text-[8.5px] font-bold mt-1.5 px-2 py-0.5 rounded-md bg-secondary text-foreground dark:bg-black/40">
                        {res === "2k" ? "2,000 cr" : res === "4k" ? "4,000 cr" : "8,000 cr"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cost and Balance Check block */}
            <div className="pt-4 border-t border-border mt-4 flex items-center justify-between flex-wrap gap-2">
              <div className="text-left">
                <div className="text-[10px] font-mono text-muted-foreground uppercase font-black">Dynamic Energy Surcharge</div>
                <div className="text-base font-display font-black text-primary mt-0.5">
                  {getDeductionCost()} Credits
                </div>
              </div>
              
              <Button 
                onClick={handleEnhance}
                disabled={!originalFile || isProcessing}
                className="glow-primary font-display font-bold uppercase tracking-widest text-[10px] flex flex-col items-center justify-center py-5 h-auto"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin mb-1" />
                    SUPER-RESOLVING...
                  </>
                ) : (
                  <>
                    <span className="flex items-center">
                      <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                      TRIGGER ENHANCE
                    </span>
                    <span className="text-[7.5px] font-mono font-normal tracking-wide opacity-90 block mt-0.5 normal-case text-white/90">
                      deducts {getDeductionCost()} credits
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="p-5.5 rounded-3xl border border-border bg-muted/15 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase">
              <Shield className="h-4 w-4 text-primary" />
              <span>KRON COMPLIANCE POLICY</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal font-sans">
              Pro Creators with high coins balances are prioritize-routed to premium upscaling nodes. Video upscaling processes may draft frame grids sequentially; wait for compile completion before launching next sequences. Assets are archived in your private secured dashboard storage bounds.
            </p>
          </div>
        </div>

        {/* Right Column - Media Interactive Workspace Area (7-cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border rounded-3xl overflow-hidden relative min-h-[480px] flex flex-col justify-between shadow-xs">
            {/* Header toolbar */}
            <div className="p-4 border-b border-border/80 bg-muted/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-mono font-black tracking-widest uppercase text-slate-500">MEDIA ACTIVE DOCK</span>
              </div>
              
              {originalFile && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1 px-2 text-[9px] font-mono font-bold bg-muted hover:bg-red-550 hover:text-white rounded-lg transition-all text-destructive uppercase tracking-tighter"
                >
                  <Trash2 className="h-3 w-3 inline mr-1" /> Remove Draft
                </button>
              )}
            </div>

            {/* Big Interactive Workspace Viewer Block */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative min-h-[380px]">
              
              {/* Uploader Box if nothing is uploaded */}
              {!originalFile && (
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className="w-full max-w-lg border-2 border-dashed border-border/80 hover:border-primary/50 rounded-3xl p-10 text-center cursor-pointer bg-muted/5 hover:bg-primary/2 transition-all space-y-5"
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                    <Upload className="h-6 w-6 animate-bounce" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-black text-sm uppercase tracking-tight text-foreground">Upload Blurry Photo or Video</h3>
                    <p className="text-xs text-muted-foreground font-sans max-w-sm mx-auto">
                      Drag & drop your files directly here, or click to browse. Max size 100MB. Support jpeg, png, webp, mp4, mov models.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2 select-none">
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-muted rounded-full text-muted-foreground uppercase font-bold">Image Upscale</span>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-muted rounded-full text-muted-foreground uppercase font-bold">Video Restoration</span>
                    <span className="text-[10px] font-mono px-2.5 py-1 bg-muted rounded-full text-muted-foreground uppercase font-bold">Face De-blur</span>
                  </div>
                </div>
              )}

              {/* Loader overlay during Super-Resolution Processing */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-card/95 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30"
                  >
                    <div className="max-w-md space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto animate-spin duration-3000">
                          <RefreshCw className="h-8 w-8 text-primary" />
                        </div>
                        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 border border-card animate-ping" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">RUNNING KRON VISION CORE ENGINE</h4>
                        <p className="text-[10.5px] font-mono text-primary font-bold animate-pulse leading-normal max-w-sm mx-auto">
                          {processingStage}
                        </p>
                      </div>

                      {/* Technical visual code-logs simulated scroll line */}
                      <div className="w-full h-11 bg-muted/30 border border-border/65 rounded-xl font-mono text-[8px] text-muted-foreground/95 p-2 text-left overflow-hidden relative">
                        <div className="animate-pulse space-y-1 block leading-tight">
                          <div>&gt; _ENG: Deducted {getDeductionCost()} coins. Balance synced with credentials matrix.</div>
                          <div>&gt; _ENG: Initializing deep convolutional super-pixel layers...</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive After/Before slider comparison */}
              {originalFile && (
                <div className="w-full max-w-2xl select-none">
                  
                  {/* Results comparison slider block */}
                  <div 
                    ref={sliderContainerRef}
                    onMouseMove={handleMouseMove}
                    onTouchMove={handleTouchMove}
                    className="w-full relative aspect-video rounded-3xl overflow-hidden border border-border shadow-md bg-black relative select-none cursor-ew-resize"
                  >
                    
                    {/* ENHANCED/AFTER SIDEBAR LAYER - Shown on the right */}
                    <div className="absolute inset-0 z-10 select-none">
                      {fileType === "image" ? (
                        <img 
                          src={enhancedFile || originalFile} 
                          alt="Enhanced" 
                          className={`w-full h-full object-cover select-none pointer-events-none transition-all ${
                            !enhancedFile ? "filter blur-[6px] grayscale-[20%] brightness-90 saturate-50" : "filter brightness-105 saturate-110 contrast-105 shadow-2xl"
                          }`}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          <video 
                            src={enhancedFile || originalFile} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            preload="auto"
                            className={`w-full h-full object-cover select-none pointer-events-none ${
                              !enhancedFile ? "filter blur-[5px] grayscale-[15%] brightness-95" : ""
                            }`}
                          />
                        </div>
                      )}
                    </div>

                    {/* ORIGINAL/BEFORE BLURRY LAYER - Clipped on Left */}
                    <div 
                      className="absolute inset-0 z-20 select-none overflow-hidden"
                      style={{ width: `${sliderOffset}%` }}
                    >
                      <div className="absolute top-0 left-0 w-[400%] h-full aspect-video select-none pointer-events-none">
                        {fileType === "image" ? (
                          <img 
                            src={originalFile} 
                            alt="Original" 
                            className="w-full h-full object-cover select-none pointer-events-none filter blur-[8px] grayscale-[35%] brightness-90 saturate-[40%]"
                            style={{ width: sliderContainerRef.current?.getBoundingClientRect().width }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <video 
                            src={originalFile} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            preload="auto"
                            className="w-full h-full object-cover select-none pointer-events-none filter blur-[8px] grayscale-[25%] brightness-90"
                            style={{ width: sliderContainerRef.current?.getBoundingClientRect().width }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Draggable Vertical Border Separator */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white hover:bg-primary z-30 select-none flex items-center justify-center shadow-lg"
                      style={{ left: `${sliderOffset}%` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-white text-slate-800 border-2 border-border flex items-center justify-center shadow-md text-xs font-mono select-none pointer-events-none">
                        ↔
                      </div>
                    </div>

                    {/* Visual labels overlay */}
                    <div className="absolute left-4 top-4 z-40 bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/95 px-2 py-1 rounded border border-white/10 select-none">
                      BEFORE: BLURRY ORIGINAL
                    </div>
                    <div className="absolute right-4 top-4 z-40 bg-primary/80 backdrop-blur-xs text-[9px] font-mono text-white px-2 py-1 rounded border border-primary/20 select-none">
                      {enhancedFile ? `AFTER: ENHANCED ${config.resolution.toUpperCase()}` : "PREVIEW ESTIMATE"}
                    </div>
                  </div>

                  <div className="mt-3 text-center px-4">
                    <p className="text-[10px] text-muted-foreground font-mono flex items-center justify-center gap-1 leading-none select-none">
                      <Eye className="h-3 w-3 inline text-primary" /> Drag the visual center handle bar divider side-to-side to view live pixel enhancement comparison.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions inside dock */}
            <div className="p-4 border-t border-border/80 bg-muted/10 flex items-center justify-between select-none">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                {originalFile ? `${fileName} (${fileType === "image" ? "Photo Asset" : "Cinematic Clip"})` : "No raw inputs loaded."}
              </span>
              
              {enhancedFile && (
                <div className="flex gap-2">
                  <a
                    href={enhancedFile}
                    download={`enhanced_${config.resolution}_${fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 px-4.5 bg-primary hover:bg-primary/95 text-white font-display text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md shadow-primary/10 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Enhanced
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Forensic Upgrade Reports Grid */}
          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-card border border-border p-6 rounded-3xl space-y-6 text-left shadow-xs"
              >
                <div className="flex items-center gap-2 pb-4 border-b border-border/80">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <CheckCircle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-display font-extrabold uppercase tracking-tight text-foreground">FORENSIC UPGRADE REPORTS</h2>
                    <p className="text-[10px] text-muted-foreground font-mono">SPECIFIC PROCESSING RESULTS</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/10 border border-border/80 p-4 rounded-2xl relative space-y-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase block font-bold">Upscale Matrix</span>
                    <span className="text-sm font-display font-black text-foreground block">{report.upscaleMatrix}</span>
                    <span className="text-[8px] font-mono text-emerald-500 block">True interpolation</span>
                  </div>

                  <div className="bg-muted/10 border border-border/80 p-4 rounded-2xl relative space-y-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase block font-bold">Blur Removal</span>
                    <span className="text-sm font-display font-black text-foreground block">{report.noiseDecline}</span>
                    <span className="text-[8px] font-mono text-emerald-500 block">Bilateral de-artifacting</span>
                  </div>

                  <div className="bg-muted/10 border border-border/80 p-4 rounded-2xl relative space-y-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase block font-bold">Sharpen Factor</span>
                    <span className="text-sm font-display font-black text-foreground block">{report.sharpenRatio}</span>
                    <span className="text-[8px] font-mono text-emerald-500 block">Spline emphasis</span>
                  </div>

                  <div className="bg-muted/10 border border-border/80 p-4 rounded-2xl relative space-y-1">
                    <span className="text-[9px] font-mono text-muted-foreground uppercase block font-bold">Chronos Cycles</span>
                    <span className="text-sm font-display font-black text-foreground block">{report.processingTime}</span>
                    <span className="text-[8px] font-mono text-emerald-500 block">Render cycle complete</span>
                  </div>
                </div>

                {/* Processing Logs Console Terminal */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono uppercase font-black text-muted-foreground">Detailed Processing Steps Log</span>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl h-36 overflow-y-auto p-4 font-mono text-[10px] text-slate-300 leading-relaxed text-left space-y-1">
                    {report.detailedLogs.map((logStr, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-primary shrink-0">&gt;</span>
                        <p>{logStr}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )}
    </div>
  );
}
