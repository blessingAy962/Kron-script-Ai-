import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, ChevronLeft, ChevronRight, Sparkles, Layers, Info, Compass, Cpu, HelpCircle } from "lucide-react";
import { PRODUCT_PROMPTS_LIST, ProductPrompt } from "../data/promptsBlogText";

export default function InteractivePromptsViewer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeProduct = PRODUCT_PROMPTS_LIST[activeIdx];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy prompt to clipboard:", err);
    }
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PRODUCT_PROMPTS_LIST.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + PRODUCT_PROMPTS_LIST.length) % PRODUCT_PROMPTS_LIST.length);
  };

  return (
    <div className="space-y-12 relative z-10">
      {/* Introduction Banner */}
      <div className="glass-card border border-border/80 rounded-[2rem] bg-card/40 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-left max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
              PLATFORM EXCLUSIVE BLUEPRINT
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-foreground">
            How to Use the Daily Realistic Prompts
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Select an everyday product below. Click <span className="text-primary font-bold">Copy Prompt</span> to instantly copy the exact positive seed text. Feed this directly into your preferred image model generator for pixel-perfect commercial results.
          </p>
        </div>
        <div className="flex items-center gap-4 border-l border-border/40 pl-0 md:pl-6 pt-4 md:pt-0 w-full md:w-auto">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-mono font-bold text-muted-foreground">SERIES TOTAL</span>
            <span className="text-base font-display font-black text-foreground">10 HIGH-FIDELITY BLUEPRINTS</span>
          </div>
        </div>
      </div>

      {/* Main Dual Layout: Sidebar Selector and Active Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar Selector (Desktop: sticky list, Mobile: slider tabs) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-left pl-2 hidden lg:block">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-muted-foreground">
              PRODUCT DIRECTORY
            </h3>
          </div>

          {/* Mobile horizontal pill layout */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-none snap-x -mx-2 px-2">
            {PRODUCT_PROMPTS_LIST.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setCopied(false);
                }}
                className={`snap-start shrink-0 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all duration-200 ${
                  activeIdx === idx
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/15"
                    : "bg-card/40 border-border/60 text-muted-foreground hover:border-primary/20"
                }`}
              >
                {idx + 1}. {prod.name}
              </button>
            ))}
          </div>

          {/* Desktop vertical sidebar navigation */}
          <div className="hidden lg:flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
            {PRODUCT_PROMPTS_LIST.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setCopied(false);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 group cursor-pointer ${
                  activeIdx === idx
                    ? "bg-card border-primary/30 shadow-lg shadow-black/5"
                    : "bg-card/20 border-border/50 hover:bg-card/50 hover:border-primary/20"
                }`}
              >
                {/* Index circle */}
                <div
                  className={`h-8 w-8 rounded-xl font-mono text-xs font-black flex items-center justify-center transition-all ${
                    activeIdx === idx
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
                      : "bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-[9px] font-mono font-bold tracking-wider uppercase transition-colors ${
                      activeIdx === idx ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {prod.type}
                  </span>
                  <span
                    className={`block text-xs font-bold font-display uppercase tracking-tight truncate transition-colors ${
                      activeIdx === idx ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {prod.name}
                  </span>
                </div>
                
                {activeIdx === idx && (
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Presentation Card with Animations */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="glass-card border border-border/80 bg-card rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col justify-between min-h-[640px] text-left"
            >
              {/* Product Visual Top Banner / Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-border/50 bg-black/10">
                {/* Image panel */}
                <div className="relative aspect-[4/3] md:aspect-auto min-h-[260px] md:min-h-[340px] overflow-hidden bg-black border-b md:border-b-0 md:border-r border-border/50">
                  <img
                    src={activeProduct.imageUrl}
                    alt={activeProduct.name}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Category/Style pill */}
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1.5 rounded-lg shadow-md border border-primary/20">
                      {activeProduct.variation} AESTHETIC
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">
                      {activeProduct.type}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight leading-none">
                      {activeProduct.name}
                    </h3>
                  </div>
                </div>

                {/* Specification Table Panel */}
                <div className="p-6 md:p-8 flex flex-col justify-center space-y-4 bg-card/65">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-foreground">
                      MATERIAL & DESIGN MATRIX
                    </span>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30">
                      <span className="text-muted-foreground shrink-0 font-medium">Color Palette:</span>
                      <span className="text-foreground font-semibold text-right">{activeProduct.color}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30">
                      <span className="text-muted-foreground shrink-0 font-medium">Materiality:</span>
                      <span className="text-foreground font-semibold text-right">{activeProduct.material}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/30">
                      <span className="text-muted-foreground shrink-0 font-medium">Environmental Stage:</span>
                      <span className="text-foreground font-semibold text-right leading-relaxed">{activeProduct.environment}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt & Copy Panel */}
              <div className="p-6 md:p-8 space-y-6 flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4.5 w-4.5 text-primary" />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-foreground">
                      PHOTOREALISTIC GENERATIVE SEED
                    </span>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(activeProduct.prompt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
                      copied
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500"
                        : "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 animate-scale" /> COPIED!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> COPY PROMPT
                      </>
                    )}
                  </button>
                </div>

                {/* Copiable Code Block */}
                <div className="relative group/prompt rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 p-5 font-mono text-xs leading-relaxed text-zinc-300 select-all">
                  <p>{activeProduct.prompt}</p>
                </div>

                {/* AI Model Advisor Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl border border-primary/10 bg-primary/2">
                  <div className="md:col-span-4 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2 border-b md:border-b-0 md:border-r border-primary/10 pb-3 md:pb-0 pr-0 md:pr-4">
                    <div className="flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-primary" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-muted-foreground">
                        RECOMMENDED MODEL
                      </span>
                    </div>
                    <span className="text-xs font-mono font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-md mt-1">
                      {activeProduct.generator}
                    </span>
                  </div>

                  <div className="md:col-span-8 text-left flex items-start gap-3">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono font-black uppercase tracking-wider text-foreground">
                        Expert Integration Analysis
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                        {activeProduct.whySuitable}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Pagination controls footer */}
              <div className="px-6 md:px-8 py-5 border-t border-border/50 bg-card/65 flex items-center justify-between gap-4">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl border border-border/80 hover:border-primary/30 bg-card/10 hover:bg-primary/5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> PREV
                </button>

                <span className="text-xs font-mono text-muted-foreground font-bold">
                  {String(activeIdx + 1).padStart(2, "0")} <span className="text-zinc-500 font-normal">/</span> 10
                </span>

                <button
                  onClick={handleNext}
                  className="px-4 py-2.5 rounded-xl border border-border/80 hover:border-primary/30 bg-card/10 hover:bg-primary/5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  NEXT <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
