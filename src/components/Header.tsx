import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/src/hooks/useAuth";
import { Menu, X, Rocket, Sparkles, User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SettingsMenu } from "./SettingsMenu";
import { KronLogo } from "./KronLogo";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 ${
        scrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-[0_4px_30px_rgba(139,92,246,0.03)]" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center group transition-transform hover:scale-[1.01]"
        >
          <KronLogo variant="combined" size="sm" glow={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border">
          <a 
            href="#features" 
            className="px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-tight"
          >
            Capabilities
          </a>
          <a 
            href="#toolkit" 
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-primary hover:text-primary bg-primary/5 transition-all uppercase tracking-tight flex items-center gap-1.2"
          >
            <Sparkles className="h-3 w-3" /> Creator Toolkit
          </a>
          <a 
            href="#pricing" 
            className="px-4 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-all uppercase tracking-tight"
          >
            Operational Tiers
          </a>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SettingsMenu />
          <ThemeToggle />

          {/* Desktop-only Auth controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Rocket className="h-3.5 w-3.5" /> Workspace
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/65 border border-border/80 rounded-xl transition-all cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/auth?signup=true"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-foreground text-background border border-foreground/10 hover:opacity-90 rounded-xl transition-all cursor-pointer shadow-sm shadow-foreground/5"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger (Mobile Toggle) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-background/50 dark:bg-background/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="absolute top-18 left-4 right-4 z-50 p-5 rounded-2xl glass-card border border-border flex flex-col gap-4 animate-in fade-in slide-in-from-top-6 duration-200 md:hidden">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 text-xs uppercase font-extrabold text-foreground border-b border-border/30"
          >
            Capabilities
          </a>
          <a
            href="#toolkit"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 text-xs uppercase font-extrabold text-primary border-b border-border/30 flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" /> Creator Toolkit
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 text-xs uppercase font-extrabold text-foreground border-b border-border/30"
          >
            Operational Tiers
          </a>

          {user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs uppercase font-black tracking-widest bg-primary text-white rounded-xl"
              >
                Workspace Dashboard
              </Link>
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await signOut();
                  navigate("/");
                }}
                className="w-full text-center py-3 text-xs uppercase font-black tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs uppercase font-black tracking-widest bg-muted/60 text-foreground rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/auth?signup=true"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs uppercase font-black tracking-widest bg-foreground text-background rounded-xl"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
export { Header };
