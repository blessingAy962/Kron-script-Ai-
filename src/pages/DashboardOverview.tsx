import { motion } from "motion/react";
import { CreatorToolkit } from "@/src/components/CreatorToolkit";
import { DashboardStatsSection } from "@/src/components/DashboardStatsSection";
import { Sparkles, Zap, Flame, Compass } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-8 text-left pb-16 font-body">
      
      {/* Premium Workspace Greeting Banner */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60 pb-8 overflow-hidden">
        {/* Soft elegant glowing background blur */}
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        
        <div className="relative space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-mono font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              Creator Hub v3.0
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase text-foreground pt-1">
            CREATOR WORKSPACE
          </h1>
          <p className="text-xs text-muted-foreground max-w-xl">
            Utilize advanced generative scriptwriting, AI reverse prompters, and rapid visual asset production suites directly below.
          </p>
        </div>

        {/* Feature quick badges for elegant design vibe */}
        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 border border-border/80 p-2 px-3 rounded-xl bg-card">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold tracking-tight text-foreground uppercase">Fast Render</span>
          </div>
          <div className="flex items-center gap-1.5 border border-border/80 p-2 px-3 rounded-xl bg-card">
            <Flame className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-[10px] font-mono font-bold tracking-tight text-foreground uppercase">High Engagement</span>
          </div>
          <div className="flex items-center gap-1.5 border border-border/80 p-2 px-3 rounded-xl bg-card">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono font-bold tracking-tight text-foreground uppercase">SEO Architect</span>
          </div>
        </div>
      </div>

      {/* Dynamic dashboard statistics deck */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <DashboardStatsSection />
      </motion.div>

      {/* Main Creator Lab multi-tool compiler block */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xs"
      >
        <CreatorToolkit />
      </motion.div>

    </div>
  );
}

export { DashboardOverview };
