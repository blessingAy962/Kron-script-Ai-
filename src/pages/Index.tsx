import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CinematicLoader } from "@/src/components/CinematicLoader";
import { SupportChat } from "@/src/components/SupportChat";
import { Link } from "react-router-dom";
import { useAuth } from "@/src/hooks/useAuth";
import { Header } from "@/src/components/Header";
import { PricingSection } from "@/src/components/PricingSection";
import { Footer } from "@/src/components/Footer";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";
import { HeroPromoGrid } from "@/src/components/HeroPromoGrid";
import { toast } from "sonner";
import { 
  Sparkles, 
  Terminal, 
  Film, 
  TrendingUp, 
  Video, 
  FileText, 
  Play, 
  Check, 
  ArrowRight, 
  Layers, 
  Globe, 
  ThumbsUp, 
  Zap, 
  Users,
  Compass,
  Tv,
  Clapperboard,
  Smartphone,
  Volume2,
  VolumeX,
  X,
  Bot,
  Fingerprint,
  Eye,
  Lock,
  Flame,
  MessageSquare,
  ShieldCheck,
  Sliders,
  Maximize2,
  PenTool
} from "lucide-react";

// Platform highlights for the prompt architecture
const platformBadges = [
  "Midjourney v6", "Google Veo 3.1", "Runway Gen-3", "Kling AI", "Sora Film", "Flux Dev"
];

function WorkspaceTeaser() {
  const [activeTab, setActiveTab] = useState<"prompt" | "script" | "diagnostics" | "deepfake" | "upscaler">("prompt");

  // State in Mockup 1 (Prompt Studio)
  const [promptInput, setPromptInput] = useState("A film close up of an astronaut reaching a neon portal, deep cosmos color");
  const [isPromptGenerating, setIsPromptGenerating] = useState(false);
  const [promptProgress, setPromptProgress] = useState(0);
  const [promptResult, setPromptResult] = useState("");

  // State in Mockup 2 (Script Arch)
  const [isPlayingScript, setIsPlayingScript] = useState(false);
  const [scriptProgress, setScriptProgress] = useState(0);
  const [scriptActiveLine, setScriptActiveLine] = useState(0);

  // State in Mockup 3 (Thumbnail Tester)
  const [thumbnailOverlay, setThumbnailOverlay] = useState<"clean" | "heatmap" | "safezone">("heatmap");

  // State in Mockup 4 (Deepfake Inspector)
  const [jitter, setJitter] = useState(85);
  const [meshDeviation, setMeshDeviation] = useState(74);

  // State in Mockup 5 (UHD Image slider)
  const [splitRatio, setSplitRatio] = useState(50);
  const upscalerRef = useRef<HTMLDivElement>(null);

  // sound state local mirroring
  const [soundOn, setSoundOn] = useState(() => {
    return safeGetItem("auratech_touch_sound", "true") !== "false";
  });

  // Check state changes to progress tour
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

  // Walkthrough Interactive Tutorial State (The "Text Interactive Demo")
  const [tourStep, setTourStep] = useState<number | null>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (tourStep !== null) {
      safeSetItem("auratech_tour_step", String(tourStep));
    } else {
      safeSetItem("auratech_tour_step", "0");
    }
    window.dispatchEvent(new CustomEvent("auratech_tour_step_change", { detail: { step: tourStep } }));
  }, [tourStep]);

  // Automatically progress tour when user does corresponding action
  const handleAction = (stepId: number) => {
    if (tourStep === stepId) {
      setCompletedSteps(prev => [...prev, stepId]);
      setTourStep(prev => (prev && prev < 5 ? prev + 1 : null));
    }
  };

  // Run mockup 1 generate progress simulation
  const startPromptGen = () => {
    if (isPromptGenerating) return;
    setIsPromptGenerating(true);
    setPromptProgress(0);
    setPromptResult("");
    
    const interval = setInterval(() => {
      setPromptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPromptGenerating(false);
          setPromptResult(
            "An anamorphic cinematically graded extreme close-up shot of a space biomechanical explorer gaze reflecting a glowing neon event horizon, stars and stellar systems warping, film grain --ar 16:9 --v 6.1"
          );
          handleAction(2); // Progress prompt task
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Timeline script simulated play ticker
  useEffect(() => {
    let interval: any;
    if (isPlayingScript) {
      interval = setInterval(() => {
        setScriptProgress(prev => {
          const next = prev + 5;
          if (next >= 100) {
            setIsPlayingScript(false);
            return 0;
          }
          if (next < 35) setScriptActiveLine(0);
          else if (next < 70) setScriptActiveLine(1);
          else setScriptActiveLine(2);
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlayingScript]);

  const computedDeepfakeRisk = ((jitter * 0.65) + (meshDeviation * 0.35)).toFixed(1);

  return (
    <div className="w-full space-y-10" id="interactive-demo-suite">
      
      {/* ==========================================
          INTERACTIVE CO-PILOT WALKTHROUGH BUBBLE
         ========================================== */}
      <AnimatePresence>
        {tourStep && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-indigo-500/5 border border-primary/25 rounded-3xl p-6.5 text-left relative overflow-hidden shadow-lg shadow-primary/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all"
            id="glowing-tour-coachmark"
          >
            <div className="space-y-2 flex-1 max-w-3xl">
              <span className="text-[10px] font-mono tracking-widest bg-primary/20 text-primary border border-primary/25 px-2.5 py-1 rounded-full font-black inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                INTERACTIVE DEMO TOUR // STEP {tourStep} OF 4
              </span>
              
              {tourStep === 1 && (
                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground flex items-center gap-1.5">
                    🔊 Hearing background bubble sounds when clicking?
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Don't worry! This page generates touch sounds as you interact. To prove how easy it is to use our toolkit, you can turn off the click pop acoustic sounds immediately inside the <strong className="text-foreground">Settings menu in the top right header</strong>, or simply press the quick-action button right here to keep it perfectly silent!
                  </p>
                </div>
              )}

              {tourStep === 2 && (
                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">
                    ✍️ Let's write! Try the interactive Prompt Studio below
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Make sure you're on the <strong className="text-foreground font-semibold">Prompt Studio</strong> tab below, then tap the <strong className="text-primary">"AI Optimize Prompt"</strong> button. Watch our generator parse rough ideas into pristine photographic prompts!
                  </p>
                </div>
              )}

              {tourStep === 3 && (
                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">
                    🔥 Visual Attention Heatmaps & TikTok Caption Safe-Zones
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Select the <strong className="text-black dark:text-white font-semibold">Pacing & Hook</strong> tab below. Toggle between the <strong className="text-foreground">Heatmap View</strong> and <strong className="text-foreground">Safe-Zone Overlay</strong> to test caption placements to keep overlays safe from cuts!
                  </p>
                </div>
              )}

              {tourStep === 4 && (
                <div className="space-y-1">
                  <h4 className="font-display font-black text-sm uppercase tracking-tight text-foreground">
                    ⚡ Move Sliders & Compare crystal-clear 4K resolution side-by-side
                  </h4>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Go to the <strong className="text-indigo-500 font-semibold">UHD Upscaling</strong> tab and grab/drag the handle over the Earth shot horizontally, or play with the synthetic risk sliders in the <strong className="text-indigo-500 font-semibold">Deepfake Inspector</strong> to complete your tour!
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {tourStep === 1 && (
                <button
                  onClick={() => {
                    toggleLocalSound();
                    handleAction(1);
                  }}
                  className={`px-4.5 py-2.5 rounded-xl text-[10px] font-display font-black uppercase tracking-wider border transition-all flex items-center gap-2 cursor-pointer ${
                    soundOn 
                      ? "bg-rose-500/15 border-rose-500/35 text-rose-500 hover:bg-rose-500/25" 
                      : "bg-emerald-500/15 border-emerald-500/35 text-emerald-500 hover:bg-emerald-500/25"
                  }`}
                >
                  {soundOn ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {soundOn ? "Mute Click sounds" : "Unmute Click sounds"}
                </button>
              )}

              {tourStep > 1 && (
                <button
                  onClick={() => setTourStep(tourStep < 4 ? tourStep + 1 : null)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border text-[9.5px] font-mono font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Skip Step
                </button>
              )}

              <button
                onClick={() => {
                  setTourStep(null);
                }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-xl transition-all cursor-pointer"
                title="Dismiss Tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full rounded-[2.5rem] border border-border/85 bg-card/60 backdrop-blur-md overflow-hidden shadow-2xl relative min-h-[580px] flex flex-col justify-between">
        
        {/* Mockup Header: Fully interactive multi tabs selector */}
        <div className="p-6 md:p-8 border-b border-border/50 flex flex-wrap items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-[7px] text-rose-600 font-bold">1</span>
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[7px] text-amber-600 font-bold">2</span>
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[7px] text-emerald-600 font-bold">3</span>
            <span className="text-xs font-mono text-muted-foreground ml-2 font-bold uppercase tracking-wide">SYSTEM PREVIEW: 5 COMPREHENSIVE AI TOOLS</span>
          </div>
          
          <div className="flex flex-wrap bg-muted/70 p-1.5 rounded-2xl border border-border/70 gap-1 sm:gap-1.5 max-w-full overflow-x-auto">
            {[
              { id: "prompt", label: "Prompt Studio", tag: 2 },
              { id: "script", label: "Script Architect", tag: null },
              { id: "diagnostics", label: "Pacing & Hook", tag: 3 },
              { id: "deepfake", label: "Deepfake Inspector", tag: 4 },
              { id: "upscaler", label: "UHD Upscaling", tag: 4 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.tag) {
                    // Check if they skipped step 1
                    if (tourStep === 1) {
                      setTourStep(2);
                    } else if (tourStep && tab.id === "diagnostics") {
                      setTourStep(3);
                    } else if (tourStep && (tab.id === "deepfake" || tab.id === "upscaler")) {
                      setTourStep(4);
                    }
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-display font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-card text-foreground shadow-sm border border-border/40 font-black" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Mock Content Display Screen */}
        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* ====== TAB 1: PROMPT STUDIO ====== */}
            {activeTab === "prompt" && (
              <motion.div
                key="prompt-tab-live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch"
              >
                <div className="lg:col-span-5 space-y-5 flex flex-col justify-between bg-muted/30 p-6 rounded-2xl border border-border/60">
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-primary uppercase font-black tracking-widest block">AI-OPTIMIZED PROMPT MAKER</span>
                    <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">PROMPT ENHANCER</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Type your basic concept. Our system injects proper cinema styles, lens ratios, render triggers, and color scopes.
                    </p>
                    
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      className="w-full text-xs font-sans font-medium text-foreground bg-background border border-border rounded-xl p-3 focus:ring-1 focus:ring-primary focus:outline-none min-h-[80px] resize-none leading-relaxed"
                      placeholder="Input what you see in your head..."
                    />
                  </div>

                  <button
                    onClick={startPromptGen}
                    disabled={isPromptGenerating}
                    className="w-full py-3 px-4 rounded-xl bg-foreground text-background text-[10px] font-display font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isPromptGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        GENERATING SYNTEX: {promptProgress}%
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Optimize Prompt (4K)
                      </>
                    )}
                  </button>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex-1 flex flex-col justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10">
                      <span className="text-[9px] font-mono text-primary uppercase font-black block">COMPLIED HIGH-FIDELITY SYNTAX</span>
                      <div className="rounded-xl overflow-hidden bg-background/95 p-4 border border-primary/15 font-mono text-[10.5px] leading-relaxed select-text min-h-[85px]">
                        {isPromptGenerating ? (
                          <span className="text-slate-400 animate-pulse block">Computing Midjourney and Sora parameters...</span>
                        ) : promptResult ? (
                          <span className="text-slate-800 dark:text-slate-200 block font-semibold">{promptResult}</span>
                        ) : (
                          <span className="text-muted-foreground block italic">Press the left button to compile a hyperrealistic prompt.</span>
                        )}
                      </div>
                    </div>

                    <div className="relative group border border-border/80 rounded-xl overflow-hidden aspect-video w-full bg-zinc-950">
                      <img 
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" 
                        alt="Cyber astronaut cosmic mockup"
                        className="w-full h-full object-cover transition-transform duration-[12s] ease-out leading-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex justify-between items-center text-[10px] text-white/90 font-mono">
                        <span>4K AI-GENERATED PREVIEW</span>
                        <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> COMPILED
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ====== TAB 2: SCRIPT ARCHITECT ====== */}
            {activeTab === "script" && (
              <motion.div
                key="script-tab-live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left max-w-4xl mx-auto w-full"
              >
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-indigo-500 uppercase font-black tracking-widest block">CREATIVE STORYBOARD DIALOGUE EDITOR</span>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">TIMELINE SCREENPLAY ARCHITECT</h3>
                  <p className="text-xs text-muted-foreground">
                    Align your dialogues, voiceovers, and visual suggestions along an interactive layout to control viewer retention pace.
                  </p>
                </div>

                <div className="bg-muted/40 p-6 rounded-2xl border border-border/85 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setIsPlayingScript(!isPlayingScript);
                        setScriptProgress(0);
                        handleAction(4);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-display font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors active:scale-95 duration-150"
                    >
                      {isPlayingScript ? (
                        <>
                          <span className="w-2.5 h-2.5 bg-white rounded-xs animate-pulse" /> Stop Live Playback
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" /> Play Script Ticker
                        </>
                      )}
                    </button>
                    
                    <div className="text-[10px] font-mono text-muted-foreground font-black uppercase flex items-center gap-4">
                      <span>Timeline Head: <span className="text-indigo-500 font-extrabold">{scriptProgress}%</span></span>
                      <span>Active Block: <span className="text-foreground">Act {scriptActiveLine + 1}</span></span>
                    </div>
                  </div>

                  {/* Interactive tracking slider */}
                  <div 
                    className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/60 relative cursor-pointer" 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const offset = ((e.clientX - rect.left) / rect.width) * 100;
                      setScriptProgress(Math.round(offset));
                      if (offset < 35) setScriptActiveLine(0);
                      else if (offset < 70) setScriptActiveLine(1);
                      else setScriptActiveLine(2);
                    }}
                  >
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${scriptProgress}%` }} />
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow" style={{ left: `${scriptProgress}%` }} />
                  </div>

                  {/* Act scripts lists */}
                  <div className="space-y-3 pt-2">
                    {[
                      { 
                        scene: "INT. CO-PILOT DECK - NIGHT (0.0s - 1.5s)", 
                        body: "A cosmic spacecraft core hums silently. The captain looks up, speaking with deep resonance: 'Is anyone listening?'", 
                        advice: "AUDIO DESIGN CUE: Embed a mechanical wind chime loop here to suggest cold space." 
                      },
                      { 
                        scene: "EXT. WARPING TIME PORTAL - SPACE (1.5s - 3.5s)", 
                        body: "The warp engine sparks. Colored ribbons of light stretch and distort the scene as a heavy bass frequency hits.", 
                        advice: "RETENTION HOOK: Trigger 3 quick flash camera cuts to regain attention." 
                      },
                      { 
                        scene: "INT. ALIEN SYSTEM CONTROL - IMMEDIATE (3.5s - 5.5s)", 
                        body: "Sirens blare in red. Alarm prompts reveal they've lost coordinate sync. 'Diverting system immediately!'", 
                        advice: "SFX CUE: Play intense tension sweep." 
                      }
                    ].map((act, idx) => {
                      const isSelected = scriptActiveLine === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setScriptActiveLine(idx);
                            setScriptProgress(idx === 0 ? 15 : idx === 1 ? 55 : 85);
                            handleAction(4);
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected 
                              ? "bg-indigo-500/10 border-indigo-400/80 shadow-inner text-foreground scale-[1.005]" 
                              : "bg-background/50 hover:bg-background/80 border-border/60 text-muted-foreground"
                          }`}
                        >
                          <span className="text-[9px] font-mono uppercase font-black tracking-wider block text-indigo-500">
                            {act.scene}
                          </span>
                          <p className="text-xs font-sans mt-1.5 leading-relaxed font-semibold">
                            {act.body}
                          </p>
                          {isSelected && (
                            <span className="text-[9.5px] font-mono text-emerald-500 font-extrabold mt-2 block animate-fade-in">
                              💡 {act.advice}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ====== TAB 3: PACING & HOOK CHECKER ====== */}
            {activeTab === "diagnostics" && (
              <motion.div
                key="diagnostics-tab-live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-center"
              >
                <div className="lg:col-span-4 space-y-5">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-pink-500 uppercase font-black tracking-widest block">EYE FOCUS HEAT TEST</span>
                    <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">THUMBNAIL HEATMAP SCANS</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Optimize placement of headlines and figures. Toggle layers simulated below to ensure your viewers actually focus on the right parts first.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {[
                      { id: "clean", label: "Original Thumbnail", desc: "No diagnostic overlay" },
                      { id: "heatmap", label: "Attention Heatmap View", desc: "Highlights where human eyes look" },
                      { id: "safezone", label: "Caption Safe Zones", desc: "TikTok / Reels caption guide check" }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setThumbnailOverlay(mode.id as any);
                          handleAction(3); // Progress step 3
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          thumbnailOverlay === mode.id
                            ? "bg-pink-500/10 border-pink-500/40 text-foreground"
                            : "bg-muted/40 hover:bg-muted/70 border-border/80 text-muted-foreground"
                        }`}
                      >
                        <span className="text-[10px] font-mono font-black uppercase tracking-wider block">
                          {mode.label}
                        </span>
                        <span className="text-[9px] text-muted-foreground block leading-relaxed font-sans font-medium">
                          {mode.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-pink-500/5 p-4 rounded-xl border border-pink-500/15 space-y-1">
                    <span className="text-[8.5px] font-mono text-pink-500 uppercase font-black block">ATTENTION SCORE</span>
                    <div className="text-2xl font-display font-black text-foreground">96.4 / 100</div>
                    <span className="text-[9.5px] font-mono text-emerald-500 block font-bold">✨ READY FOR FEED: EXCELLENT CLICK THROUGH RATE</span>
                  </div>
                </div>

                <div className="lg:col-span-8 flex justify-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[9/16] rounded-[2.2rem] border border-border shadow-2xl overflow-hidden bg-zinc-950 group">
                    <img
                      src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
                      alt="Thumbnail high fidelity creator studio view"
                      className="w-full h-full object-cover select-none pointer-events-none transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Attention Heatmap Mask filter layers */}
                    {thumbnailOverlay === "heatmap" && (
                      <div className="absolute inset-0 z-10 pointer-events-none bg-indigo-900/10 mix-blend-color-burn animate-fade-in block">
                        {/* High Interest centers */}
                        <div className="absolute top-[25%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-red-500/40 filter blur-3xl animate-pulse" />
                        <div className="absolute top-[25%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-yellow-400/50 filter blur-2xl animate-pulse" />
                        
                        <div className="absolute top-[60%] left-[30%] w-32 h-32 rounded-full bg-teal-500/35 filter blur-3xl" />
                        <div className="absolute bottom-[15%] right-[25%] w-24 h-24 rounded-full bg-blue-500/45 filter blur-2xl" />
                      </div>
                    )}

                    {/* Safe zones layout mockup */}
                    {thumbnailOverlay === "safezone" && (
                      <div className="absolute inset-0 z-20 flex flex-col justify-between p-4.5 bg-black/35 pointer-events-none animate-fade-in block">
                        <div className="flex items-center justify-between text-white text-[10px] font-mono drop-shadow font-extrabold pr-4 pt-2">
                          <span>Following</span>
                          <span className="underline decoration-2 underline-offset-4 text-emerald-400">For You</span>
                          <span>🔍</span>
                        </div>

                        {/* TikTok like and comments widgets */}
                        <div className="absolute right-3.5 bottom-24 flex flex-col items-center gap-4.5 text-white/95 text-[10.5px] drop-shadow">
                          <div className="w-8.5 h-8.5 rounded-full border border-white/80 bg-slate-400/80 flex items-center justify-center font-bold text-slate-900 text-[10px]">YOU</div>
                          <div className="flex flex-col items-center"><span className="text-sm">❤️</span><span className="text-[9.5px]">142.8K</span></div>
                          <div className="flex flex-col items-center"><span className="text-sm">💬</span><span className="text-[9.5px]">9.4K</span></div>
                          <div className="flex flex-col items-center"><span className="text-sm">🔖</span><span className="text-[9.5px]">12.5K</span></div>
                          <div className="flex flex-col items-center"><span className="text-sm">↩️</span><span className="text-[9.5px]">Share</span></div>
                        </div>

                        {/* Captain details */}
                        <div className="text-white/95 max-w-[210px] font-sans text-left space-y-1 drop-shadow mt-auto ml-2 mb-2 leading-relaxed">
                          <span className="font-extrabold text-[11px] block text-emerald-400">@KronScriptAI</span>
                          <p className="text-[10px]">This captioned text stays directly in the safe grid window. Zero text cuts here! #shorts #grow</p>
                        </div>
                      </div>
                    )}

                    {/* Scanner laser bar */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-scan z-30" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ====== TAB 4: DEEPFAKE INSPECTOR ====== */}
            {activeTab === "deepfake" && (
              <motion.div
                key="deepfake-tab-live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch"
              >
                <div className="lg:col-span-5 flex flex-col justify-between bg-muted/40 p-6 rounded-2xl border border-border/80">
                  <div className="space-y-4">
                    <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 uppercase font-black block">SPECTRUM INTEGRITY VERIFICATION</span>
                    <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">AI DEEPFAKE DETECTOR</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Analyze facial node meshes and vocal jitter levels to block generative digital clones. Adjust parameters below to see threshold outputs.
                    </p>

                    <div className="space-y-3 pt-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground">Voice Waveform Jitter:</span>
                          <span className="font-black text-purple-500">{jitter} Hz</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="160"
                          value={jitter}
                          onChange={(e) => {
                            setJitter(parseInt(e.target.value));
                            handleAction(4);
                          }}
                          className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/10">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground">Facial Node Mesh Deviation:</span>
                          <span className="font-black text-indigo-500">{meshDeviation}%</span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="100"
                          value={meshDeviation}
                          onChange={(e) => {
                            setMeshDeviation(parseInt(e.target.value));
                            handleAction(4);
                          }}
                          className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-background text-center space-y-1.5 border border-dashed border-border mt-6">
                    <span className="text-[9px] font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider block font-black">CALCULATED CLONE RISK RATIO</span>
                    <div className={`text-xl font-display font-black tracking-tight ${parseFloat(computedDeepfakeRisk) > 75 ? "text-red-500 animate-pulse" : "text-emerald-500"}`}>
                      {parseFloat(computedDeepfakeRisk) > 75 ? "⚠️ HIGH SYNTHETIC CLONE RISK" : "✅ VALID HUMAN SENDER"}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      Combined Neural Jitter Score: <strong className="text-foreground">{computedDeepfakeRisk}%</strong>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-zinc-950 rounded-2xl border border-border overflow-hidden relative flex items-center justify-center p-6 min-h-[300px]">
                  <div className="absolute inset-0 opacity-40">
                    <img
                      src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80"
                      className="w-full h-full object-cover grayscale select-none pointer-events-none"
                      alt="Biometrics visual concept sketch artwork"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Wireframe grids overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border border-purple-500/50 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-32 h-32 border border-dashed border-indigo-400/40 rounded-full flex items-center justify-center">
                        <Fingerprint className="h-10 w-10 text-purple-400" />
                      </div>
                    </div>
                  </div>

                  {/* Laser effect */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_cyan] animate-scan z-10 pointer-events-none" />

                  <div className="relative z-10 mt-auto w-full bg-black/95 p-4 rounded-xl font-mono text-[9px] text-slate-350 border border-purple-500/25 leading-normal space-y-1">
                    <p className="text-purple-400 font-extrabold">[BIOMETRIC SCAN SECURE PROCESS]</p>
                    <p>Detecting nodes: <span className="text-white font-bold">OK (312 node checkpoints validated)</span></p>
                    <p>Vocal alignment status: <span className={parseFloat(computedDeepfakeRisk) > 75 ? "text-red-400" : "text-emerald-400"}>{parseFloat(computedDeepfakeRisk) > 75 ? "WARNING CLONED" : "NOMINAL"}</span></p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ====== TAB 5: UHD UPSCALER ====== */}
            {activeTab === "upscaler" && (
              <motion.div
                key="upscaler-tab-live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-emerald-500 uppercase font-black block tracking-widest">RESOLUTION COMPARISON SLIDER</span>
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-foreground">AI-POWERED ULTRA-HD RENDERER</h3>
                  <p className="text-xs text-muted-foreground">
                    Grab the white central handle over our Earth model shot and drag left or right to compare blurry 1080p source grain with pristine, crystal-clear upscaled 4K AI details!
                  </p>
                </div>

                <div 
                  ref={upscalerRef}
                  className="relative w-full h-[340px] rounded-[2rem] border border-border shadow-2xl overflow-hidden bg-zinc-950 cursor-ew-resize select-none"
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      const rect = upscalerRef.current?.getBoundingClientRect();
                      if (rect) {
                        const offset = ((e.clientX - rect.left) / rect.width) * 100;
                        setSplitRatio(Math.max(5, Math.min(95, offset)));
                        handleAction(4);
                      }
                    }
                  }}
                  onTouchMove={(e) => {
                    if (e.touches && e.touches[0]) {
                      const rect = upscalerRef.current?.getBoundingClientRect();
                      if (rect) {
                        const offset = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
                        setSplitRatio(Math.max(5, Math.min(95, offset)));
                        handleAction(4);
                      }
                    }
                  }}
                >
                  {/* Clean 4K Earth images base layer */}
                  <div className="absolute inset-0">
                    <img
                      src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      alt="4K crystal clear upscale earth render"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Low resolution blurry Earth left overlay */}
                  <div 
                    className="absolute inset-y-0 left-0 overflow-hidden border-r border-white/60 pointer-events-none z-10"
                    style={{ width: `${splitRatio}%` }}
                  >
                    <div className="absolute top-0 left-0 w-[1200px] h-[340px] max-w-none">
                      <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                        className="w-full h-full object-cover filter blur-[4.5px] contrast-90 brightness-90 saturate-[65%] select-none pointer-events-none"
                        alt="1080p source earth blurry"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 border border-white/10 text-white font-mono text-[9px] font-bold py-1 px-2.5 rounded uppercase block tracking-wider">
                        GRAINY 1080P OUTLINE
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-500/85 backdrop-blur-sm text-white font-mono text-[9px] font-black py-1 px-2.5 rounded uppercase block tracking-wider pointer-events-none z-20">
                    PRISTINE DETAILED COMPLIED 4K AI
                  </div>

                  {/* Handle line split dividers */}
                  <div 
                    className="absolute inset-y-0 z-20 w-0.5 bg-white cursor-ew-resize mix-blend-difference pointer-events-none"
                    style={{ left: `${splitRatio}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 border border-border flex items-center justify-center font-bold text-xs shadow-xl pointer-events-auto cursor-ew-resize">
                      ↔
                    </div>
                  </div>

                  <p className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono leading-none py-1.5 px-3 rounded-full font-extrabold uppercase tracking-widest pointer-events-none">
                    ↔ GRAB SLIDER AND DRAG TO RESOLVE HIGH RESOLUTION DETAIL
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What AI models does Kron Script use?",
      a: "We use Google Gemini to write video scripts, caption ideas, and simple prompts for other image generators like Midjourney and Runway."
    },
    {
      q: "How does the Video Pacing and Hook Checker work?",
      a: "When you upload a short video, our tool reads the first 5 seconds to check how eye-catching it is. It gives you a score and tells you exactly where to add sound effects or subtitles to help keep people watching."
    },
    {
      q: "Is my personal data safe here?",
      a: "Yes, absolutely. Your account is private and safe. All your uploaded drafts, scripts, and details are protected using secure databases."
    },
    {
      q: "Does this work for TikTok, Reels, and YouTube Shorts?",
      a: "Yes! The safe-zone guide checks your video layout for all major platforms. This ensures your text and captions won't be hidden by user options, comments, or like buttons."
    }
  ];

  return (
    <div className="space-y-4 max-w-3xl mx-auto text-left">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div 
            key={i} 
            className="border border-border/80 bg-card rounded-2xl overflow-hidden shadow-xs transition-colors hover:border-border"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 select-none focus:outline-none focus:ring-0 active:bg-transparent"
            >
              <span className="font-display font-bold text-sm uppercase tracking-tight text-foreground">
                {faq.q}
              </span>
              <span className={`text-lg font-mono text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45 text-primary" : ""}`}>
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-border/40"
                >
                  <p className="p-6 text-xs text-muted-foreground leading-relaxed font-sans bg-muted/10">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function Index() {
  const { user } = useAuth();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState<number | null>(null);

  const handleTemplateClick = (id: number) => {
    toast.info("Log in to view the prompt", {
      id: `prompt-login-${id}`,
      duration: 2000
    });
    setShowLoginPrompt(id);
    setTimeout(() => {
      setShowLoginPrompt(old => old === id ? null : old);
    }, 2000);
  };

  return (
    <AnimatePresence mode="wait">
      {!loadingComplete ? (
        <motion.div
          key="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[29000]"
        >
          <CinematicLoader onComplete={() => setLoadingComplete(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="landing-content"
          initial={{ opacity: 0, scale: 0.99, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="min-h-screen bg-background text-foreground overflow-x-hidden font-body relative"
        >
          <Header />

      {/* ==========================================
          HERO SECTION: A24 & APPLE STYLE IMMERSIVE ENTRY
         ========================================== */}
      <section className="relative pt-24 md:pt-36 pb-8 md:pb-20 px-6 min-h-[92vh] flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-primary/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-80 left-10 w-72 h-72 bg-indigo-500/4 rounded-full blur-3xl pointer-events-none" />

        {/* Parallax/Floating absolute design rings */}
        <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10 flex flex-col items-center">
          
          {/* Tagline Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[10px] uppercase font-black tracking-widest text-center"
          >
            The Easy AI Platform for Content Creators
          </motion.div>

          {/* Epic Header Wordings */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4 max-w-4xl"
          >
            <h1 className="text-4.5xl sm:text-6xl md:text-7.5xl font-display font-black tracking-tight leading-[1.05] uppercase text-foreground">
              Make Better Videos,<br className="hidden sm:inline" />
              Scripts & Prompts <span className="text-primary tracking-tight">10x Faster.</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground/90 font-sans max-w-2xl mx-auto leading-relaxed">
              Write highly engaging short video scripts, get clean image prompts, and test your videos to keep viewers watching longer.
            </p>
          </motion.div>

          {/* Dual Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md pt-4"
          >
            {user ? (
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.01 }} className="w-full sm:w-auto">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto block px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground border border-primary/25 font-display text-xs font-black uppercase tracking-widest hover:bg-primary/95 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Go to Workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.01 }} className="w-full sm:w-auto">
                  <Link
                    to="/auth?signup=true"
                    className="w-full sm:w-auto block px-8 py-3.5 rounded-2xl bg-foreground text-background font-display text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Start Pro Studio <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.01 }} className="w-full sm:w-auto">
                  <a
                    href="#toolkit"
                    className="w-full sm:w-auto block px-8 py-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 text-foreground border border-border/80 font-display text-xs font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Try Creator Tools
                  </a>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Creative Platform Trust loop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="pt-12 space-y-3"
          >
            <span className="text-[10px] font-mono uppercase text-muted-foreground/75 tracking-wider font-extrabold block">Works with Your Favorite AI Tools</span>
            <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-2xl mx-auto">
              {platformBadges.map((plat) => (
                <span 
                  key={plat} 
                  className="text-[10px] font-mono px-3 py-1 bg-muted/30 hover:bg-muted/50 transition-all border border-border/60 text-muted-foreground rounded-full select-none"
                >
                  {plat}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Official Trailer Video Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="pt-16 md:pt-28 pb-16 flex flex-col items-center justify-center relative w-full px-4"
          >
            {/* Ambient Background Aura */}
            <div className="absolute w-[350px] sm:w-[600px] h-[350px] sm:h-[400px] rounded-full bg-gradient-to-tr from-purple-500/10 via-indigo-500/10 to-transparent blur-[80px] pointer-events-none" />
            
            {/* Video Container */}
            <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(124,58,237,0.15)] z-10 bg-zinc-950/50 backdrop-blur-sm">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/bQfKVFKQrhI?si=xpANK5zrD1xpiz4k" 
                title="KRON SCRIPT AI Official Trailer" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            </div>

            {/* Showcase collage grid of core platforms */}
            <div className="mt-24 md:mt-32 w-full flex justify-center">
              <HeroPromoGrid />
            </div>

            {/* 2x2 Aspect 9:16 Template Placeholders (realtouch.app reference style) */}
            <div className="mt-32 md:mt-40 w-full max-w-5xl mx-auto space-y-10 px-4">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="text-[10px] uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-bold">
                  KRON STUDIO
                </span>
                <h3 className="text-2xl md:text-3.5xl font-display font-black tracking-tight uppercase">
                  TEMPLATES
                </h3>
                <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                  Premium high-fidelity vertical aesthetics. Click on any template to view its underlying creative parameters and prompts.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                {/* Placeholder 1 (First Real Image) */}
                <div 
                  onClick={() => handleTemplateClick(1)}
                  className="relative aspect-[9/16] bg-zinc-950/40 border border-white/5 hover:border-purple-500/30 transition-all rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-4 group shadow-lg shadow-black/30 cursor-pointer"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1LsXjbA1rJ35xiZNyMyIjTLQ4mwk6QaSh" 
                    alt="Template style portrait" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem] z-0 transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
                  
                  {/* Subtle inner dashed frame */}
                  <div className="absolute inset-2 border border-dashed border-zinc-800/60 group-hover:border-purple-500/20 rounded-[1.2rem] pointer-events-none transition-colors duration-300 z-10" />

                  {/* Centered Graphic Icon - hidden or minimized on active images unless hovered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom Text Reference Style */}
                  <div className="relative z-20 w-full mt-auto">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-2 backdrop-blur-md text-center text-[8px] text-zinc-300 font-mono">
                      CLICK FOR PROMPT
                    </div>
                  </div>

                  {/* Disappear / Reappear Login overlay inside the card */}
                  <AnimatePresence>
                    {showLoginPrompt === 1 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-3 text-center rounded-[1.5rem]"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 5 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 5 }}
                          className="space-y-2"
                        >
                          <Lock className="h-4 w-4 text-purple-400 mx-auto" />
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400">RESTRICTED</p>
                          <p className="text-[10px] text-zinc-300 font-sans font-medium">Log in to view the prompt</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Placeholder 2 */}
                <div 
                  onClick={() => handleTemplateClick(2)}
                  className="relative aspect-[9/16] bg-zinc-950/40 border border-white/5 hover:border-purple-500/30 transition-all rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-4 group shadow-lg shadow-black/30 cursor-pointer"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1t0x8I2-7JLXXIz3iGAuPZJhFt8D9AniT" 
                    alt="Template style portrait 2" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem] z-0 transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
                  
                  {/* Subtle inner dashed frame */}
                  <div className="absolute inset-2 border border-dashed border-zinc-800/60 group-hover:border-purple-500/20 rounded-[1.2rem] pointer-events-none transition-colors duration-300 z-10" />

                  {/* Centered Graphic Icon - hidden or minimized on active images unless hovered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom Text Reference Style */}
                  <div className="relative z-20 w-full mt-auto">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-2 backdrop-blur-md text-center text-[8px] text-zinc-300 font-mono">
                      CLICK FOR PROMPT
                    </div>
                  </div>

                  {/* Disappear / Reappear Login overlay inside the card */}
                  <AnimatePresence>
                    {showLoginPrompt === 2 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-3 text-center rounded-[1.5rem]"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 5 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 5 }}
                          className="space-y-2"
                        >
                          <Lock className="h-4 w-4 text-purple-400 mx-auto" />
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400">RESTRICTED</p>
                          <p className="text-[10px] text-zinc-300 font-sans font-medium">Log in to view the prompt</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Placeholder 3 */}
                <div 
                  onClick={() => handleTemplateClick(3)}
                  className="relative aspect-[9/16] bg-zinc-950/40 border border-white/5 hover:border-purple-500/30 transition-all rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-4 group shadow-lg shadow-black/30 cursor-pointer"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1J8bxFMaOYaXBrWOSZxSRA8hVDOzgoiT8" 
                    alt="Template style portrait 3" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem] z-0 transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
                  
                  {/* Subtle inner dashed frame */}
                  <div className="absolute inset-2 border border-dashed border-zinc-800/60 group-hover:border-purple-500/20 rounded-[1.2rem] pointer-events-none transition-colors duration-300 z-10" />

                  {/* Centered Graphic Icon - hidden or minimized on active images unless hovered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom Text Reference Style */}
                  <div className="relative z-20 w-full mt-auto">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-2 backdrop-blur-md text-center text-[8px] text-zinc-300 font-mono">
                      CLICK FOR PROMPT
                    </div>
                  </div>

                  {/* Disappear / Reappear Login overlay inside the card */}
                  <AnimatePresence>
                    {showLoginPrompt === 3 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-3 text-center rounded-[1.5rem]"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 5 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 5 }}
                          className="space-y-2"
                        >
                          <Lock className="h-4 w-4 text-purple-400 mx-auto" />
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400">RESTRICTED</p>
                          <p className="text-[10px] text-zinc-300 font-sans font-medium">Log in to view the prompt</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Placeholder 4 */}
                <div 
                  onClick={() => handleTemplateClick(4)}
                  className="relative aspect-[9/16] bg-zinc-950/40 border border-white/5 hover:border-purple-500/30 transition-all rounded-[1.5rem] overflow-hidden flex flex-col justify-between p-4 group shadow-lg shadow-black/30 cursor-pointer"
                >
                  <img 
                    src="https://lh3.googleusercontent.com/d/1ce5RJ5-Q8FQHhXChzx6whaDv73O_0i-T" 
                    alt="Template style portrait 4" 
                    className="absolute inset-0 w-full h-full object-cover rounded-[1.5rem] z-0 transition-transform duration-500 group-hover:scale-105" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10" />
                  
                  {/* Subtle inner dashed frame */}
                  <div className="absolute inset-2 border border-dashed border-zinc-800/60 group-hover:border-purple-500/20 rounded-[1.2rem] pointer-events-none transition-colors duration-300 z-10" />

                  {/* Centered Graphic Icon - hidden or minimized on active images unless hovered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-purple-500/30 flex items-center justify-center backdrop-blur-md">
                      <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Bottom Text Reference Style */}
                  <div className="relative z-20 w-full mt-auto">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-2 backdrop-blur-md text-center text-[8px] text-zinc-300 font-mono">
                      CLICK FOR PROMPT
                    </div>
                  </div>

                  {/* Disappear / Reappear Login overlay inside the card */}
                  <AnimatePresence>
                    {showLoginPrompt === 4 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-3 text-center rounded-[1.5rem]"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 5 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 5 }}
                          className="space-y-2"
                        >
                          <Lock className="h-4 w-4 text-purple-400 mx-auto" />
                          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-400">RESTRICTED</p>
                          <p className="text-[10px] text-zinc-300 font-sans font-medium">Log in to view the prompt</p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ==========================================
          CAPABILITIES BLOCK: FLOATING INTERACTIVE CARDS
         ========================================== */}
      <section id="features" className="py-10 md:py-24 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-bold">
              Powerful Features
            </span>
            <h2 className="text-3.5xl md:text-5xl font-display font-black tracking-tight uppercase">
              Built for <span className="text-primary">Higher Views</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Stop guessing what works. Use simple tools to write scripts and check your videos before you post them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
                <PenTool className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Prompt Studio</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Transform rough drafts, photos, or reference clips into exquisite, highly optimized prompts. Access perfectly formatted styles and configurations built for Midjourney, Veo, Sora, and Kling AI.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-primary font-bold">
                PLATFORMS: PHOTO, GIF & VIDEO SUPPORT
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clapperboard className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Movie Script Architect</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Plan multi-act cinematic screenplays, epic dialogues, and detailed voiceover timings up to 10,000 words. Completely styled block by block with copy-ready formatting guides.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-indigo-500 dark:text-indigo-400 font-bold">
                FORMAT: HIGH-STRETCH CINEMATIC SCREENPLAYS
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Sliders className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Thumbnail Analysis Console</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Check if your video cover is eye-catching. Analyze colors, focus points, layout contrast, and text readability to stand out in viewer feeds.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                METRICS: VIEW ATTENTION & QUALITY SCORES
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Production Dialect Companion</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Unlock our proprietary creator-aligned chat engine. Get custom script outlines, storyboard suggestions, character formatting, and active script feedback synced directly with your creative profile.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                CONVERSATION: PRO CHAT ENGINE & MEMORIES
              </div>
            </motion.div>

            {/* Card 5 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Media Integrity Authenticator</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Check if any video or audio is organic or synthetically generated. Instantly scan faces, voices, and clip edits to detect digital clones or synthetic changes.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                INTEGRITY: DETECTION & RISK SCORES
              </div>
            </motion.div>

            {/* Card 6 */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl p-6.5 text-left bg-background/50 border border-border/85 shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Maximize2 className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-base uppercase tracking-tight text-foreground">Ultra-HD Resolution Scaler</h3>
                <p className="text-xs text-muted-foreground/90 font-sans leading-relaxed">
                  Enhance your video frames and image assets to pristine 2K, 4K, and 8K visual resolutions. Instantly upgrade detail levels, eliminate pixelation, and optimize clarity for your screens.
                </p>
              </div>
              <div className="pt-2 border-t border-dashed border-border/40 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                VISION: ULTRA-HD VISUAL ENHANCEMENT
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==========================================
          BENTO GRID: SPECIFIC PRO CAPABILITIES
         ========================================== */}
      <section className="py-24 px-6 relative bg-background">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-3 py-1 rounded-full font-bold">
              Smart Features
            </span>
            <h2 className="text-3xl md:text-4.5xl font-display font-black tracking-tight uppercase">
              Simple Yet Powerful <span className="text-primary">Tools</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mr-auto ml-auto">
              Our dashboard makes it very easy to make vertical video content that grabs viewer attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Part 1: Wide */}
            <div className="md:col-span-2 rounded-[2rem] border border-border/80 bg-card p-8 flex flex-col justify-between space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight text-foreground">Video Pacing Checker</h3>
                <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans max-w-xl">
                  Upload your video to check the critical first 5 seconds. Learn exactly where to insert sound effect cues or subtitles so that people do not scroll away from your video.
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-500 uppercase border-t border-dashed border-border/50 pt-4">
                <span>Saves Time & Boosts Views</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Instant Analysis</span>
              </div>
            </div>

            {/* Bento Part 2: Small */}
            <div className="rounded-[2rem] border border-border/80 bg-card p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight text-foreground">Safe-Zone Overlay Checks</h3>
                <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans">
                  Test your video titles and subtitles against TikTok and Instagram screen sizes. This ensures your text won't be hidden by platform buttons, like hearts, or descriptions.
                </p>
              </div>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                PLATFORMS: IG / TIKTOK / SHORTS
              </div>
            </div>

            {/* Bento Part 3: Small */}
            <div className="rounded-[2rem] border border-border/80 bg-card p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-600/15 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Volume2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight text-foreground">Sound Suggestions</h3>
                <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans">
                  If your video opening feels slow, add recommended sound effects. Get guides on where to drop a 'swoosh' or audio trigger so viewers stay interested from the start.
                </p>
              </div>
              <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                FORMATS: STANDARD SOUND TIPS
              </div>
            </div>

            {/* Bento Part 4: Wide */}
            <div className="md:col-span-2 rounded-[2rem] border border-border/88 bg-card p-8 flex flex-col justify-between space-y-8 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center text-amber-500">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight text-foreground">Caption Writer</h3>
                <p className="text-xs text-muted-foreground/90 leading-relaxed font-sans max-w-xl">
                  Generate professional social captions, viral descriptions, and smart targeted hashtags custom-crafted for maximum discoverability and viewer interaction on TikTok, Instagram, and YouTube Shorts.
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-500 uppercase border-t border-dashed border-border/50 pt-4">
                <span>Output: Premium Viral Captions</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Custom platform formats</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          FAQ ACCORDION SECTION
         ========================================== */}
      <section className="py-24 px-6 bg-muted/5 border-t border-border/40">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-bold">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4.5xl font-display font-black uppercase tracking-tight">
              FREQUENTLY ASKED <span className="text-primary">ANSWERS</span>
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground mr-auto ml-auto">
              Everything you need to know about the Kron Script AI platform, capabilities, and system specifications.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* ==========================================
          PRICING SECTORS
         ========================================== */}
      <PricingSection />

      {/* ==========================================
          CTA CALL-TO-ACTION REVOLUTION BANNER
         ========================================== */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto glass-card border border-primary/20 p-8 md:p-12 rounded-[2.5rem] text-center relative overflow-hidden space-y-6">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl" />
          
          <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-bold">
            Instant Access
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-foreground max-w-2xl mx-auto">
            Ready to Make Better Content?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Join creators, marketers, and filmmakers who use our tools to reach more views and save hours of work.
          </p>

          <div className="pt-4 flex justify-center">
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
              <Link
                to="/auth?signup=true"
                className="px-8 py-3.5 rounded-2xl bg-foreground text-background font-display text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/5"
              >
                Create Your Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <SupportChat />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export { Index };


