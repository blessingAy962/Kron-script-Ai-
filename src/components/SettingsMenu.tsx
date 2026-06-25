import React, { useState, useEffect, useRef } from "react";
import { Settings, Volume2, VolumeX, Sparkles, HelpCircle, Gauge, Flame, CircleDot, Lock } from "lucide-react";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sound Effect Switch
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_touch_sound", "true");
    return saved !== "false"; // Default to enabled
  });

  // Glass Bubbles Switch
  const [bubblesEnabled, setBubblesEnabled] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_glass_bubbles", "true");
    return saved !== "false"; // Default to enabled
  });

  // Cinematic Floating Switch
  const [floatEnabled, setFloatEnabled] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_cinematic_float", "false");
    return saved === "true"; // Default to off, can be toggled on!
  });

  // Kinetic Floating Intensity Selector: "gentle" | "cinematic" | "orbit"
  const [floatIntensity, setFloatIntensity] = useState<string>(() => {
    return safeGetItem("auratech_float_intensity", "cinematic");
  });

  const { user } = useAuth();
  const [userPlan, setUserPlan] = useState<string>("free");

  // Sync user plan in real-time
  const [hideHelper, setHideHelper] = useState<boolean>(false);

  // Automatically hide the sounds helper after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideHelper(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const dismissHelper = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHideHelper(true);
  };

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
      console.warn("Could not load user plan dynamically in SettingsMenu:", err);
    });
    return () => unsubscribe();
  }, [user]);

  const isPro = userPlan === "pro" || userPlan === "pro_creator" || user?.email === "starbruce91@gmail.com";

  // If the user's pro status changes to free (e.g. unsubscribed or not logged in), force-disable floating text.
  useEffect(() => {
    if (!isPro && floatEnabled) {
      setFloatEnabled(false);
      safeSetItem("auratech_cinematic_float", "false");
      const root = document.documentElement;
      root.classList.remove("cinematic-floating");
      root.removeAttribute("data-float-intensity");
    }
  }, [isPro, floatEnabled]);

  const handleToggleFloat = () => {
    if (!isPro) {
      toast.error("Floating Text is a Premium PRO feature. Purchase a paid plan to unlock visual drift dynamic effects!");
      return;
    }
    setFloatEnabled(!floatEnabled);
  };

  // Update Tactile Audio settings globally using Custom Events or LocalStorage sync
  useEffect(() => {
    safeSetItem("auratech_touch_sound", soundEnabled ? "true" : "false");
    // Fire a custom event to immediately notify the TouchPhysicsCanvas component
    const event = new CustomEvent("auratech_audio_toggle", { detail: { enabled: soundEnabled } });
    window.dispatchEvent(event);
  }, [soundEnabled]);

  // Update Glass Bubbles settings globally using Custom Events or LocalStorage sync
  useEffect(() => {
    safeSetItem("auratech_glass_bubbles", bubblesEnabled ? "true" : "false");
    // Fire a custom event to immediately notify the TouchPhysicsCanvas component
    const event = new CustomEvent("auratech_bubbles_toggle", { detail: { enabled: bubblesEnabled } });
    window.dispatchEvent(event);
  }, [bubblesEnabled]);

  // Update Cinematic Floating settings globally on the HTML element
  useEffect(() => {
    const root = document.documentElement;
    safeSetItem("auratech_cinematic_float", floatEnabled ? "true" : "false");
    
    if (floatEnabled) {
      root.classList.add("cinematic-floating");
      root.setAttribute("data-float-intensity", floatIntensity);
    } else {
      root.classList.remove("cinematic-floating");
      root.removeAttribute("data-float-intensity");
    }
  }, [floatEnabled, floatIntensity]);

  // Click outside listener to collapse settings panel automatically
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left" id="auratech-universal-settings-wrapper">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        id="header-settings-toggle-button"
        title="Applet customization panel"
        className={`w-10 h-10 flex items-center justify-center rounded-xl border bg-background/50 dark:bg-background/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer ${
          isOpen ? "border-primary/50 scale-105 bg-muted" : "border-border"
        } ${
          soundEnabled && !hideHelper && !isOpen
            ? "animate-pulse ring-2 ring-purple-500 shadow-[0_0_18px_rgba(168,85,247,0.8)] border-purple-400"
            : ""
        }`}
      >
        <Settings className={`h-4.5 w-4.5 ${isOpen ? "animate-spin" : "hover:rotate-45 transition-transform duration-300"} ${soundEnabled && !hideHelper && !isOpen ? "text-purple-500 animate-pulse" : ""}`} />
      </button>
 
      {/* Pulsing floating helper balloon specifically pointing out how to quiet bubble clicks */}
      {soundEnabled && !hideHelper && !isOpen && (
        <div 
          onClick={dismissHelper}
          className="absolute top-11 -right-4 bg-purple-600 text-white text-[9.5px] font-mono font-black uppercase tracking-wider whitespace-nowrap px-3 py-2 rounded-xl shadow-[0_4px_22px_rgba(168,85,247,0.5)] animate-bounce z-[2100] flex items-center gap-1.5 border border-purple-400 cursor-pointer hover:bg-purple-750 transition-colors"
          title="Click to dismiss hint"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          👉 Click Cog to Turn Off Sounds!
          <div className="absolute -top-1.5 right-6 w-3 h-3 bg-purple-600 rotate-45 border-t border-l border-purple-400" />
        </div>
      )}

      {/* Cinematic dimming & blurring backdrop between settings page and content */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1999] cursor-pointer animate-in fade-in duration-300" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Settings Dropdown Panel - premium dark/light glassmorphic construct */}
      {isOpen && (
        <div 
          className="fixed md:absolute top-20 right-4 left-4 md:left-auto md:top-auto md:right-0 md:mt-3 w-[calc(100vw-32px)] md:w-76 origin-top-right rounded-2xl border border-purple-500/20 bg-background/98 md:bg-background/95 backdrop-blur-xl p-4 shadow-[0_12px_40px_rgba(139,92,246,0.22)] z-[2000] animate-in fade-in slide-in-from-top-4 duration-200"
          id="auratech-settings-overlay"
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-border/40 mb-3.5">
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <h4 className="text-[11px] font-mono font-black uppercase tracking-widest text-foreground">
              App Settings
            </h4>
          </div>

          {/* Section 1: Tactile & Physics Controls */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block leading-none">
                    Click Sounds
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none">
                    Play sound when you click buttons
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  soundEnabled ? "bg-purple-600" : "bg-muted"
                }`}
              >
                <span className="sr-only">Toggle click sounds</span>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Bubble Physics Element Switch Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-border/10">
              <div className="flex items-center gap-2">
                <CircleDot className={`h-4 w-4 ${bubblesEnabled ? "text-purple-500 animate-pulse" : "text-muted-foreground"}`} />
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block leading-none">
                    Visual Bubbles
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none">
                    Floating bubbles on screen touch
                  </span>
                </div>
              </div>
              <button
                onClick={() => setBubblesEnabled(!bubblesEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  bubblesEnabled ? "bg-purple-600" : "bg-muted"
                }`}
              >
                <span className="sr-only">Toggle bubbles</span>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    bubblesEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Cinematic Floating Words */}
          <div className="space-y-3.5 pt-2 border-t border-border/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`h-4 w-4 ${floatEnabled ? "text-purple-500 animate-bounce" : "text-muted-foreground"}`} />
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    Floating Text
                    {!isPro && (
                      <span className="inline-flex items-center gap-0.5 text-[7px] font-sans font-black bg-purple-500/10 text-purple-700 dark:text-purple-400 px-1 py-0.5 rounded uppercase tracking-wide border border-purple-500/15 text-center leading-none select-none ml-1">
                        <Lock className="h-2 w-2 text-purple-600 dark:text-purple-400" /> PRO
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] text-muted-foreground leading-none">
                    Float random words on your screen
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleFloat}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  floatEnabled ? "bg-purple-600" : "bg-muted"
                } ${!isPro ? "opacity-65 cursor-not-allowed" : ""}`}
              >
                <span className="sr-only">Toggle floating text</span>
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    floatEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Float Intensity Control Selector */}
            {floatEnabled && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-1">
                  <Gauge className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground">
                    Float Speed:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/60 border border-border/50">
                  {["gentle", "cinematic", "orbit"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFloatIntensity(mode)}
                      className={`text-[8.5px] py-1 rounded-lg font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        floatIntensity === mode
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {mode === "gentle" ? "Slow" : mode === "cinematic" ? "Medium" : "Fast"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Guide Infotip */}
          <div className="mt-3.5 pt-2.5 border-t border-border/30 space-y-2 text-[9px] text-muted-foreground leading-snug">
            <div className="flex items-start gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
              <p>
                Turn on <span className="font-bold text-foreground">Floating Text</span> to see ideas float across your screen in the background.
              </p>
            </div>
            {userPlan !== "free" && (
              <div className="pt-2 border-t border-border/10 flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-wide">License: <b>{userPlan.replace("_", " ")}</b></span>
                <a 
                  href="https://whop.com/orders/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-500 hover:underline font-mono text-[8px] uppercase font-bold cursor-pointer"
                >
                  Manage Plan ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsMenu;
