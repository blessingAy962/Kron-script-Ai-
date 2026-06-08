import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, CheckCircle2, Play, GraduationCap, X } from "lucide-react";

interface CelebrationConfettiProps {
  onClose: () => void;
}

interface ConfettiPart {
  id: number;
  x: number; // percent width
  y: number; // start height offset
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star";
  delay: number;
  duration: number;
  angle: number;
  spinSpeed: number;
  driftX: number;
}

const COLORS = [
  "#a855f7", // purple-500
  "#c084fc", // purple-400
  "#8b5cf6", // violet-500
  "#eab308", // gold/amber-500
  "#facc15", // gold-400
  "#10b981", // emerald-500
  "#f43f5e", // rose-500
  "#06b6d4", // cyan-500
];

export default function CelebrationConfetti({ onClose }: CelebrationConfettiProps) {
  const [particles, setParticles] = useState<ConfettiPart[]>([]);

  useEffect(() => {
    // Generate 120 premium confetti particles
    const list: ConfettiPart[] = [];
    const shapes: ("circle" | "square" | "triangle" | "star")[] = ["circle", "square", "triangle", "star"];
    
    for (let i = 0; i < 125; i++) {
      list.push({
        id: i,
        x: Math.random() * 100, // random horizontal start width percentage
        y: -10 - Math.random() * 20, // start above the screen
        size: 6 + Math.random() * 12, // size between 6px and 18px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        delay: Math.random() * 2.5, // staggered falling delays
        duration: 3.5 + Math.random() * 3, // fall speed
        angle: Math.random() * 360,
        spinSpeed: 360 + Math.random() * 1440, // degrees of rotation
        driftX: -30 + Math.random() * 60, // sway horizontal coordinates left/right
      });
    }
    setParticles(list);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden pointer-events-none">
      {/* Dark Ambient Backdrop Blur Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/85 backdrop-blur-md pointer-events-auto"
        onClick={onClose}
        id="celebration-backdrop"
      />

      {/* Confetti Particle Sheet */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => {
          return (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: `${p.y}vh`,
                rotate: p.angle,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                x: `${p.x + p.driftX / 2}vw`,
                rotate: p.angle + p.spinSpeed,
                opacity: [1, 1, 0.8, 0], // fade out near the bottom
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "linear",
                repeat: 0,
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.shape === "triangle" ? 0 : p.size,
                backgroundColor: p.shape === "triangle" ? "transparent" : p.color,
                borderRadius: p.shape === "circle" ? "50%" : p.shape === "star" ? "30% 70%" : "2px",
                borderStyle: p.shape === "triangle" ? "solid" : "none",
                borderWidth: p.shape === "triangle" ? `0 ${p.size / 2}px ${p.size}px ${p.size / 2}px` : 0,
                borderColor: p.shape === "triangle" ? `transparent transparent ${p.color} transparent` : "transparent",
                filter: p.size > 12 ? "drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Celebratory Congratulatory Popover Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="w-full max-w-lg bg-zinc-950 border-2 border-purple-500/50 rounded-[2.5rem] p-6 md:p-8 text-center shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] pointer-events-auto relative overflow-hidden flex flex-col items-center justify-between gap-6"
        id="celebration-card"
      >
        {/* Subtle decorative glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-zinc-900 hover:bg-zinc-800 p-2.5 rounded-full border border-border/40 transition-all cursor-pointer"
          title="Close overlay"
          id="celebration-close-btn"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebration Trophy/Visual Header */}
        <div className="relative mt-2">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-amber-400 rounded-[2rem] flex items-center justify-center shadow-glow-purple"
          >
            <GraduationCap className="h-10 w-10 text-zinc-950 font-black animate-pulse" />
          </motion.div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-purple-400/30 rounded-[2.5rem] pointer-events-none"
          />
          <Sparkles className="absolute -top-1 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
          <Award className="absolute -bottom-2 -left-3 h-7 w-7 text-purple-400 animate-pulse" />
        </div>

        {/* Messaging Block */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase block">ACCREDITATION ACHIEVED</span>
          <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
            Kron Academy Unlocked!
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Astounding progression! You have registered <b className="text-purple-400 font-bold">20 verified affiliate partners</b>. The restricted curriculum, interactive coordinate challenges, and professional workflow storyboards are now permanently accessible.
          </p>
        </div>

        {/* Highlights/Trophy milestones */}
        <div className="w-full bg-zinc-900/40 border border-border/40 p-4 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            <span className="text-[11px] font-mono text-zinc-300 font-bold uppercase">10 Elite Master Class Modules Activated</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            <span className="text-[11px] font-mono text-zinc-300 font-bold uppercase">Unlimited Prompt & Script Challenges Loaded</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-4.5 w-4.5 text-purple-400 shrink-0" />
            <span className="text-[11px] font-mono text-zinc-300 font-bold uppercase">Creator Accreditation Badge Earned</span>
          </div>
        </div>

        {/* Begin CTA */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white text-xs font-display font-black uppercase tracking-widest py-4 px-6 rounded-2xl shadow-lg hover:shadow-purple-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          id="celebration-cta-btn"
        >
          <Play className="h-4 w-4 fill-white" />
          Enter Academy Classroom
        </button>
      </motion.div>
    </div>
  );
}
