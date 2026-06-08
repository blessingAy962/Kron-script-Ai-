import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Terminal, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-[3px] border-purple-600 shadow-[0_4px_0_0_rgba(147,51,234,0.1)] py-4 px-6 md:px-12 flex items-center justify-between font-mono"
    >
      <div className="flex items-center gap-2">
        <Terminal className="h-6 w-6 text-purple-600 animate-pulse" />
        <span className="text-xl font-display font-black text-foreground uppercase tracking-tight">
          KRON SCRIPT <span className="text-purple-600">AI</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-semibold uppercase tracking-wider text-xs">
        <a href="#features" className="text-muted-foreground hover:text-purple-600 transition-colors">Features</a>
        <a href="#playground" className="text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
          <Zap className="h-3 w-3 inline fill-current" /> Live Labs
        </a>
        <a href="#how-it-works" className="text-muted-foreground hover:text-purple-600 transition-colors">How It Works</a>
        <a href="#pricing" className="text-muted-foreground hover:text-purple-600 transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-3">
        <Link 
          to="/auth" 
          className="font-mono text-xs uppercase tracking-wider font-bold text-foreground border-2 border-border hover:border-purple-600 px-4 py-2 rounded-lg transition-all"
        >
          Sign In
        </Link>
        <Link 
          to="/auth" 
          className="font-mono text-xs uppercase tracking-wider font-extrabold bg-purple-600 hover:bg-purple-700 text-white border-2 border-black px-4 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000000] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000000] transition-all"
        >
          Start Free
        </Link>
      </div>
    </motion.nav>
  );
}
export { Navbar };
