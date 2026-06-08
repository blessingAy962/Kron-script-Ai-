import { Link } from "react-router-dom";
import { KronLogo } from "./KronLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border/80 py-12 bg-background font-body relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Brand */}
        <div className="flex items-center">
          <KronLogo variant="combined" size="xs" />
        </div>

        {/* Links / Operational status */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center">
          <Link 
            to="/copyright" 
            className="group flex flex-col items-center md:items-end text-right transition-colors hover:opacity-90 max-w-md cursor-pointer"
            title="Read our IP protections, Anti-Cloning alerts, and we do not sell your data guarantees."
          >
            <p className="text-[11px] text-muted-foreground uppercase font-mono font-bold tracking-tight group-hover:text-purple-400 transition-colors">
              © 2026 KRON AI & Auratech. All Rights Protected.
            </p>
            <p className="text-[9px] text-zinc-500 font-mono scale-95 origin-center md:origin-right mt-0.5 group-hover:text-purple-500 transition-colors leading-relaxed">
              Data protection guarantee (We never sell data). Click here for full cloning laws & impersonation warning.
            </p>
          </Link>
          <span className="hidden md:inline text-muted-foreground/30">•</span>
          <span className="text-[10px] font-mono text-primary font-bold tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/15 animate-pulse uppercase">
            Platform Online
          </span>
        </div>
      </div>
    </footer>
  );
}
export { Footer };
