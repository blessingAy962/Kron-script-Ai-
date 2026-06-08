import { motion } from "motion/react";
import { ArrowRight, Play, Sparkles, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-36 pb-16 bg-background px-6">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.12]" />

      <div className="relative z-10 container mx-auto text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-lg border-2 border-purple-600 bg-white px-4 py-1.5 mb-8 shadow-[3px_3px_0px_0px_rgba(147,51,234,1)]"
        >
          <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground font-mono">Gemini Vision Intelligence Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl md:text-7xl lg:text-8xl font-display font-black leading-[1] mb-6 tracking-tighter text-foreground uppercase text-left md:text-center"
        >
          REVERSE THE<br />
          <span className="text-white bg-purple-600 border-[3px] border-black px-4 inline-block font-black tracking-tighter shadow-[6px_6px_0px_0px_#000000] rotate-[-1deg] my-2">VIRAL FORMULA</span><br />
          IN 30 DAYS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground mb-10 leading-relaxed font-mono text-left md:text-center border-l-4 border-purple-500 pl-4 md:border-none md:pl-0"
        >
          An absolute command center for professional channel builders. Extract exact storyteller prompt blueprints, test predicted visual click-through rates, and architect high-retention screenplays on-demand.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => navigate("/auth")}
            className="cursor-pointer font-mono text-xs md:text-sm uppercase tracking-wider font-extrabold bg-purple-600 hover:bg-purple-700 text-white border-[3px] border-black px-8 py-4.5 rounded-xl shadow-[5px_5px_0px_0px_#000000] active:translate-y-[2px] active:shadow-[3px_3px_0px_0px_#000000] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Launch Free Lab-Core <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById("playground");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="cursor-pointer font-mono text-xs md:text-sm uppercase tracking-wider font-bold text-foreground bg-white hover:bg-purple-50 border-[3px] border-purple-600 px-8 py-4.5 rounded-xl shadow-[5px_5px_0px_0px_rgba(147,51,234,1)] active:translate-y-[2px] active:shadow-[3px_3px_0px_0px_rgba(147,51,234,1)] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-current text-purple-600" /> Test Live Playground
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-muted-foreground text-xs font-mono uppercase font-bold"
        >
          <span className="flex items-center gap-1.5"><Terminal className="h-4.5 w-4.5 text-purple-600" /> 10K+ STATIONS ONLINE</span>
          <span className="hidden sm:inline w-1 h-4 bg-purple-200" />
          <span>500K+ Blueprints Engineered</span>
          <span className="hidden sm:inline w-1 h-4 bg-purple-200" />
          <span className="text-purple-600 font-extrabold">+94 CTR VELOCITY ACCELERATION</span>
        </motion.div>
      </div>
    </section>
  );
}
export { HeroSection };
