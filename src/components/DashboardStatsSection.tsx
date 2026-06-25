import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Crown, 
  Coins, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  ArrowUpRight
} from "lucide-react";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "sonner";

export function DashboardStatsSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>("24:00:00");

  useEffect(() => {
    if (!user) return;
    const profileRef = doc(db, "user_coins", user.uid);
    const unsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        setProfile(snap.data());
      }
    });
    return () => unsub();
  }, [user]);

  // Real-time ticking 24h refresh timer calculator
  useEffect(() => {
    if (!profile) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const lastReset = profile.last_reset_time;
      if (!lastReset) {
        setTimeLeft("24:00:00");
        return;
      }
      
      const lastResetMs = typeof lastReset === "number" ? lastReset : (lastReset.toMillis ? lastReset.toMillis() : new Date(lastReset).getTime());
      const oneDayMs = 24 * 60 * 60 * 1000;
      const nextResetMs = lastResetMs + oneDayMs;
      const difference = nextResetMs - now;

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        // Trigger auto reload
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const fHours = String(hours).padStart(2, "0");
      const fMinutes = String(minutes).padStart(2, "0");
      const fSeconds = String(seconds).padStart(2, "0");

      setTimeLeft(`${fHours}h ${fMinutes}m ${fSeconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [profile]);

  if (!profile) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
        <div className="h-28 bg-muted/60 rounded-3xl" />
        <div className="h-28 bg-muted/60 rounded-3xl" />
        <div className="h-28 bg-muted/60 rounded-3xl" />
      </div>
    );
  }

  // Calculate plan descriptions
  const currentPlan = profile.plan || "free";
  const planName = currentPlan === "free" ? "Free Tier License" : 
                   currentPlan === "starter" ? "Starter Tier License" :
                   currentPlan === "creator" ? "Creator License" : "Pro Creator License";
  const planStatus = profile.plan_status || "active";

  // Calculate referrals progression
  const refsCount = profile.referral_count ?? 0;
  // Next milestone logic
  const nextMilestone = refsCount >= 50 ? 100 : 50;
  const milestoneBonus = nextMilestone === 50 ? 2500 : 5000;
  const progressPercent = Math.min(100, Math.floor((refsCount / nextMilestone) * 100));

  // Handle milestone claims if eligible and not already claimed
  const claimMilestoneBonus = async (milestone: number) => {
    if (!user) return;
    
    const is50Claimed = profile.bonus_2500_claimed === true;
    const is100Claimed = profile.bonus_5000_claimed === true;

    if (milestone === 50) {
      if (refsCount < 50) {
        toast.error("You need at least 50 referrals to unlock the 2,500 bonus credits.");
        return;
      }
      if (is50Claimed) {
        toast.info("You've already claimed your 50 referrals bonus!");
        return;
      }
      try {
        const pRef = doc(db, "user_coins", user.uid);
        await setDoc(pRef, {
          coins: (profile.coins ?? 150) + 2500,
          bonus_2500_claimed: true
        }, { merge: true });
        toast.success("🎉 Added 2,500 bonus credits to your account for the 50 referrals milestone!");
      } catch (e) {
        toast.error("Database connection failure.");
      }
    } else if (milestone === 100) {
      if (refsCount < 100) {
        toast.error("You need at least 100 referrals to unlock the 5,000 bonus credits.");
        return;
      }
      if (is100Claimed) {
        toast.info("You've already claimed your 100 referrals bonus!");
        return;
      }
      try {
        const pRef = doc(db, "user_coins", user.uid);
        await setDoc(pRef, {
          coins: (profile.coins ?? 150) + 5000,
          bonus_5000_claimed: true
        }, { merge: true });
        toast.success("🎉 Added 5,000 bonus credits to your account for the 100 referrals milestone!");
      } catch (e) {
        toast.error("Database connection failure.");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left font-sans">
      
      {/* 1. Subscription & License Overview */}
      <div className="md:col-span-4 glass-card border border-border/80 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase">LICENSE PROFILE</span>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${
              planStatus === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" : "bg-red-500/10 text-red-400 border border-red-500/25"
            }`}>
              {planStatus}
            </span>
          </div>
          <h3 className="text-base font-display font-black uppercase text-foreground">{planName}</h3>
          <p className="text-[10px] text-muted-foreground/80 font-sans mt-0.5">
            {currentPlan === "free" ? "150 daily credits reset tier" : "Paid operational developer license"}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-between text-[10px] font-mono border-t border-border/30 mt-3">
          <span className="text-muted-foreground">PREMIUM ACCESS</span>
          {currentPlan !== "free" ? (
            <a 
              href="https://whop.com/orders/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary hover:underline font-black uppercase flex items-center gap-1 cursor-pointer"
            >
              Manage Plan <ArrowUpRight className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-foreground font-black uppercase">
              STANDARD PREVIEW
            </span>
          )}
        </div>
      </div>

      {/* 2. Credits & Dynamic Resets Timer */}
      <div className="md:col-span-4 glass-card border border-border/80 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase">CREDIT RESOURCE</span>
            <Coins className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="text-xl font-display font-black uppercase text-foreground">
            {(profile.coins ?? 150).toLocaleString()} <span className="text-xs text-muted-foreground font-mono font-semibold">COINS</span>
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/90 font-sans mt-0.5">
            <Clock className="h-3 w-3 text-primary" />
            <span>Next daily recharge input: <b>{timeLeft}</b></span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between text-[10px] font-mono border-t border-border/30 mt-3">
          <span className="text-muted-foreground">RESET LEVEL</span>
          <span className="text-foreground font-black uppercase">
            {currentPlan === "free" ? "150 CR / 24H" : "PREMIUM BALANCE"}
          </span>
        </div>
      </div>

      {/* 3. Referral Milestones & Bonus Gauge */}
      <div className="md:col-span-4 glass-card border border-border/80 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase">AFFILIATE MILESTONES</span>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-mono font-bold text-foreground">{refsCount}</span>
            </div>
          </div>
          
          <div className="space-y-1.5 mt-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-muted-foreground uppercase font-bold">Goal to {nextMilestone} invitees</span>
              <span className="text-primary font-black">+{milestoneBonus} BONUS</span>
            </div>
            
            {/* Real Progress tracker */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/40 relative">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Claim actions directly inside overview */}
        <div className="pt-3 border-t border-border/30 mt-3 flex items-center justify-between">
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Milestone rewards</span>
          
          {refsCount >= nextMilestone ? (
            <button 
              onClick={() => claimMilestoneBonus(nextMilestone)}
              className="px-2.5 py-1 bg-primary text-white rounded-lg text-[9px] font-mono font-black uppercase hover:opacity-90 active:scale-95 cursor-pointer transition-all shadow-xs"
            >
              Claim +{milestoneBonus} Credits
            </button>
          ) : (
            <span className="text-[9px] font-mono text-muted-foreground lowercase">
              {nextMilestone - refsCount} referrals left
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
export default DashboardStatsSection;
