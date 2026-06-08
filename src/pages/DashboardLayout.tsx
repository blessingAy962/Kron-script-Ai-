import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/src/components/DashboardSidebar";
import { Outlet, useLocation } from "react-router-dom";
import { Terminal, Menu, X, Sparkles, Coins, HelpCircle } from "lucide-react";
import ThemeToggle from "@/src/components/ThemeToggle";
import { SettingsMenu } from "@/src/components/SettingsMenu";
import { useAuth } from "@/src/hooks/useAuth";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(100);
  const location = useLocation();

  const isChat = location.pathname === "/dashboard/kron-ai";

  useEffect(() => {
    if (!user) return;
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsub = onSnapshot(coinsRef, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const coinsVal = data.coins ?? 150;
        setBalance(coinsVal);

        // Core 24-hour Auto Reset logic for free credits
        const lastReset = data.last_reset_time;
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        let shouldReset = false;

        if (!lastReset) {
          shouldReset = true;
        } else {
          const lastResetMs = typeof lastReset === "number" ? lastReset : (lastReset.toMillis ? lastReset.toMillis() : new Date(lastReset).getTime());
          if (now - lastResetMs >= oneDayMs) {
            shouldReset = true;
          }
        }

        if (shouldReset) {
          const isFreePlan = !data.plan || data.plan === "free";
          const updatePayload: any = {
            last_reset_time: now
          };
          if (isFreePlan) {
            updatePayload.coins = 150; // resets standard free balance to exactly 150
            updatePayload.plan = "free";
            updatePayload.plan_status = "active";
          }
          try {
            await setDoc(coinsRef, updatePayload, { merge: true });
          } catch (resetErr) {
            console.warn("Failed to reset daily coins automatically:", resetErr);
          }
        }
      } else {
        // Bootstrap missing user coin profiles
        try {
          const isAdminEmail = user.email === "starbruce91@gmail.com";
          await setDoc(coinsRef, {
            id: user.uid,
            user_id: user.uid,
            coins: isAdminEmail ? 150000 : 150,
            plan: isAdminEmail ? "pro_creator" : "free",
            plan_status: "active",
            last_reset_time: Date.now(),
            referral_count: 0,
            referred_emails: [],
            is_admin: isAdminEmail,
            created_at: new Date()
          });
        } catch (bootErr) {
          console.warn("Failed to bootstrap user_coins document");
        }
      }
    }, (err) => {
      console.warn("Layout coins balance dynamic query error: ", err);
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic ambient backing grid */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Backdrop for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Panel - responsive positioning */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${
        isSidebarOpen 
          ? "translate-x-0 opacity-100" 
          : "-translate-x-full opacity-0 md:translate-x-0 md:opacity-100"
      } md:static transition-all duration-300 ease-in-out`}>
        <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between border-b border-border/70 bg-background/50 backdrop-blur-md px-6 md:px-8 shrink-0 relative z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 -ml-2 rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground md:hidden focus:outline-none cursor-pointer border border-border/50"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">WORKSPACE VERIFIED</span>
            </div>
          </div>

          {/* Quick controls on header */}
          <div className="flex items-center gap-3">
            {/* Credits Counter badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/65 text-foreground shrink-0 select-none">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-[10px] font-mono font-black tracking-tight">{balance} CREDITS</span>
            </div>

            <SettingsMenu />
            <ThemeToggle />
          </div>
        </header>

        {/* Overflow Content Viewport with responsive padding */}
        <main className={`flex-1 ${isChat ? "p-0 overflow-hidden h-[calc(100vh-4rem)]" : "p-4 md:p-8 overflow-y-auto"} bg-background relative z-10`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export { DashboardLayout };
