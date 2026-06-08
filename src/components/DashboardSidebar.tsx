import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/hooks/useAuth";
import { KronLogo } from "./KronLogo";
import { 
  Terminal, 
  Home, 
  LogOut, 
  Sparkles, 
  Award, 
  Crown, 
  Layers, 
  Compass,
  ArrowUpRight,
  TrendingUp,
  Bot,
  History,
  Eye,
  ShieldCheck,
  BookOpen
} from "lucide-react";

interface DashboardSidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    onClose?.();
    await signOut();
    navigate("/");
  };

  const navItems = [
    {
      name: "Workspace Suite",
      path: "/dashboard",
      icon: Layers,
      badge: "ACTIVE"
    },
    {
      name: "Kron AI Chat",
      path: "/dashboard/kron-ai",
      icon: Bot,
      badge: "NEW"
    },
    {
      name: "Kron Vision AI",
      path: "/dashboard/vision",
      icon: Eye,
      badge: "PRO"
    },
    {
      name: "Workspace History",
      path: "/dashboard/history",
      icon: History,
    },
    {
      name: "Upgrade License",
      path: "/dashboard/pricing",
      icon: Crown,
      badge: "PRO"
    },
    {
      name: "Kron AI Course",
      path: "/dashboard/course",
      icon: BookOpen,
      badge: "REFS"
    }
  ];

  const [isAdminFromDb, setIsAdminFromDb] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Dynamic import to check admin status
    import("@/src/lib/firebase").then(({ db }) => {
      import("firebase/firestore").then(({ doc, getDoc }) => {
        getDoc(doc(db, "user_coins", user.uid)).then((snap) => {
          if (snap.exists() && snap.data().is_admin) {
            setIsAdminFromDb(true);
          }
        }).catch(() => {});
      });
    });
  }, [user]);

  const showAdminRoute = user?.email === "starbruce91@gmail.com" || 
                         user?.email?.toLowerCase().includes("admin") || 
                         user?.email?.toLowerCase().includes("starbruce") || 
                         isAdminFromDb;

  if (showAdminRoute) {
    navItems.push({
      name: "Admin Control Room Lvl 5",
      path: "/dashboard/admin",
      icon: ShieldCheck,
      badge: "L5"
    });
  }

  return (
    <aside className="w-64 bg-background border-r border-border h-screen flex flex-col justify-between overflow-y-auto font-body z-30 shrink-0 select-none relative">
      
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center hover:scale-[1.01] transition-transform"
          >
            <KronLogo variant="combined" size="xs" glow={true} />
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5 pt-6 text-left">
          <span className="px-3 text-[9px] font-mono tracking-widest uppercase text-muted-foreground/80 font-bold block mb-3">OPERATIONAL CENTERS</span>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/15" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[8px] font-mono font-black tracking-widest px-1.5 py-0.5 rounded ${
                    isActive 
                      ? "bg-white/25 text-white" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & footer controls */}
      <div className="p-4 border-t border-border/80 space-y-1.5 bg-muted/15">
        
        {/* Profile indicator block */}
        <div className="flex items-center gap-3 px-3 py-2 border border-border/50 rounded-2xl bg-background/70 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-black text-xs uppercase">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : "CR"}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <span className="block text-[10px] font-mono uppercase text-muted-foreground font-bold tracking-tight">Active Creator</span>
            <span className="block text-xs font-semibold text-foreground truncate max-w-[130px]">{user?.email || "anonymous_lab"}</span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose?.();
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer text-left"
        >
          <Home className="h-4 w-4" />
          <span>Home Landing</span>
        </button>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Workspace</span>
        </button>
      </div>

    </aside>
  );
}
export default DashboardSidebar;
