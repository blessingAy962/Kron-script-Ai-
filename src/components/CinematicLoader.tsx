import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { KronLogo } from "./KronLogo";

interface CinematicLoaderProps {
  onComplete: () => void;
}

export function CinematicLoader({ onComplete }: CinematicLoaderProps) {
  const [percent, setPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("INITIALIZING SECURE SYSTEMS");

  // Step-based loader message timeline corresponding to percentage targets
  useEffect(() => {
    let currentPercent = 0;
    const interval = setInterval(() => {
      currentPercent += 1;
      if (currentPercent >= 100) {
        currentPercent = 100;
        clearInterval(interval);
      }
      setPercent(currentPercent);

      // Dynamically update cinematic status labels to match progress
      if (currentPercent < 15) {
        setStatusMessage("INITIALIZING AURATECH COGNITIVE SHIELD...");
      } else if (currentPercent < 30) {
        setStatusMessage("RESONATING TACTILE SOUNDWAVES...");
      } else if (currentPercent < 45) {
        setStatusMessage("ORBITING SPATIAL DRIP PHYSICS...");
      } else if (currentPercent < 65) {
        setStatusMessage("ESTABLISHING INTEGRITY SYSTEM RULES...");
      } else if (currentPercent < 80) {
        setStatusMessage("COMPILING MOVIE & PROMPT ARCHITECTURE...");
      } else if (currentPercent < 95) {
        setStatusMessage("STABILIZING ULTRA-DENSITY INTERFACES...");
      } else {
        setStatusMessage("STUDIO READY. ENTERING KRON OS...");
      }
    }, 95); // (100 ticks * ~95ms = ~9.5 seconds + 0.5s buffer = 10 seconds total)

    return () => clearInterval(interval);
  }, []);

  // Guarantee complete event hook at exactly 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 10000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="dark fixed inset-0 bg-[#06040a] z-[30000] flex flex-col justify-between items-center p-8 select-none overflow-hidden font-sans text-white">
      {/* Cinematic grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Decorative vector flare beams */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-purple-600/[0.06] rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute top-12 left-12 w-48 h-48 bg-purple-500/[0.02] rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[90px] pointer-events-none" />

      {/* Spacer to keep middle graphics perfectly centered under flex-col justify-between */}
      <div className="h-4 sm:h-6" />

      {/* Middle Animated Graphic Cluster */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md relative">
        <div className="relative w-44 h-44 flex items-center justify-center mb-3" id="cinematic-core">
          
          {/* Outer glowing dynamic telemetry circle spinner */}
          <svg className="absolute w-[180px] h-[180px] rotate-[-90deg]">
            <circle
              cx="90"
              cy="90"
              r="84"
              className="stroke-zinc-900 fill-none"
              strokeWidth="2"
            />
            <motion.circle
              cx="90"
              cy="90"
              r="84"
              className="stroke-purple-600/60 fill-none"
              strokeWidth="2.5"
              strokeDasharray="527"
              animate={{ strokeDashoffset: 527 - (527 * percent) / 100 }}
              transition={{ ease: "easeInOut" }}
            />
            {/* Ambient ring glow */}
            <circle
              cx="90"
              cy="90"
              r="84"
              className="stroke-purple-500/10 fill-none blur-[4px]"
              strokeWidth="6"
              strokeDasharray="527"
              strokeDashoffset={527 - (527 * percent) / 100}
            />
          </svg>

          {/* Sequential Animated SVG Logo Layers */}
          <div className="w-24 h-24 relative z-10">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_0_15px_rgba(168,85,247,0.25)]"
            >
              <defs>
                <linearGradient id="loadStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#e9d5ff" />
                </linearGradient>

                <linearGradient id="loadUpperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>

                <linearGradient id="loadLowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="loadGlassOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                </linearGradient>
                
                <linearGradient id="loadGlassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Layer 1: Vertical Stem - Slides down at 0.5s */}
              <motion.rect
                x="18"
                y="14"
                width="13"
                height="72"
                rx="6.5"
                fill="url(#loadStemGrad)"
                initial={{ scaleY: 0, originY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 2: Upper Branch - Slides up diagonal at 1.8s */}
              <motion.path
                d="M 28 47.5 L 61.5 14 C 64 11.5, 68 11.5, 70.5 14 C 73 16.5, 73 20.5, 70.5 23 L 41 52.5 Z"
                fill="url(#loadUpperGrad)"
                initial={{ scale: 0, opacity: 0, originX: 0.2, originY: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 3: Lower Branch - Scales down diagonal at 2.8s */}
              <motion.path
                d="M 33 50.5 L 65 82.5 C 67.5 85, 71.5 85, 74 82.5 C 76.5 80, 76.5 76, 74 73.5 L 45 44.5 Z"
                fill="url(#loadLowerGrad)"
                initial={{ scale: 0, opacity: 0, originX: 0.3, originY: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Layer 4: Frosted Ribbon Completing K folds - Scales & fades at 4.2s */}
              <motion.path
                d="M 31 42 L 56 17 C 58.5 14.5, 62.5 14.5, 65 17 C 67.5 19.5, 67.5 23.5, 65 26 L 43 48 C 39 52, 34 52, 30.5 48.5 L 24.5 42.5 C 22.5 40.5, 22.5 37.5, 24.5 35.5 C 26.5 33.5, 29.5 33.5, 31.5 35.5 Z"
                fill="url(#loadGlassOverlay)"
                stroke="url(#loadGlassBorder)"
                strokeWidth="1.2"
                initial={{ opacity: 0, scale: 0.6, originX: 0.3, originY: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 4.2, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>

        {/* Text reveals - elegant brand identity fade-in */}
        <motion.div 
          className="text-center h-auto relative z-20 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <KronLogo variant="wordmark" size="md" glow={false} className="text-white [&_span]:text-white" />
        </motion.div>
      </div>

      {/* Bottom Progress Metrics */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 py-4 relative z-20">
        <div className="w-full h-[2px] bg-zinc-900 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-700 via-purple-500 to-indigo-500"
            animate={{ width: `${percent}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        <div className="w-full flex justify-between items-baseline text-zinc-400 font-mono">
          {/* Animated percent ticking */}
          <span className="text-xl sm:text-2xl font-black font-mono tracking-tight tabular-nums text-white">
            {percent.toString().padStart(3, "0")} <span className="text-[10px] font-bold text-zinc-500">%</span>
          </span>

          {/* Dynamic Telemetry Code String Status Label Info block */}
          <motion.span 
            key={statusMessage}
            className="text-[8.5px] font-bold tracking-widest text-purple-400/90 text-right uppercase"
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
          >
            {statusMessage}
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default CinematicLoader;
