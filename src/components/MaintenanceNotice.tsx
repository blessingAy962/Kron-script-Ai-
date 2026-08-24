import { motion } from "motion/react";
import { Wrench, Clock, ShieldAlert } from "lucide-react";

interface MaintenanceNoticeProps {
  featureName: string;
}

export function MaintenanceNotice({ featureName }: MaintenanceNoticeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-3xl p-8 py-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
      
      {/* Animated gear/wrench icon */}
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
        <Wrench className="h-8 w-8 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 p-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold text-primary uppercase tracking-widest">
          <Clock className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} />
          <span>System Update in Progress</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-foreground uppercase">
          {featureName} Under Maintenance
        </h2>
        
        <div className="text-sm text-muted-foreground/90 max-w-lg mx-auto leading-relaxed font-body space-y-4">
          <p>
            Dear users,
          </p>
          <p>
            We are currently performing a system update, and some features are temporarily unavailable while they undergo maintenance. Please bear with us—we expect everything to be back to normal soon.
          </p>
          <p>
            Thank you for your patience and understanding.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50 max-w-md mx-auto">
        <p className="text-[10px] font-mono text-muted-foreground/70 font-semibold italic flex items-center justify-center gap-1">
          <ShieldAlert className="h-3 w-3 text-primary/80" />
          Securely managed by AuRa Tech core systems.
        </p>
      </div>
    </motion.div>
  );
}
