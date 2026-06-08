import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Award, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Layers,
  Palette,
  Eye,
  Check,
  TrendingUp,
  FileText,
  Clock,
  Play,
  Zap,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { fullAcademyMasterData } from "../data/academy_part3";

interface AcademyViewerProps {
  onClose: () => void;
  userEmail?: string;
}

export default function AcademyViewer({ onClose, userEmail }: AcademyViewerProps) {
  const [activePage, setActivePage] = useState<number>(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificateName, setCertificateName] = useState("");
  
  // Dynamic Checklist states
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({});
  
  // Interactive Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, { selected: number; correct: boolean }>>({});

  // Initialize certificate name with email prefix as fallback
  useEffect(() => {
    if (userEmail) {
      const prefix = userEmail.split("@")[0].toUpperCase();
      setCertificateName(prefix);
    }
  }, [userEmail]);

  // Track visited pages for progress calculation
  const setPage = (idx: number) => {
    setActivePage(idx);
    setVisited(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setSidebarOpen(false);
    // Scroll to top
    const elem = document.getElementById("academy-scroll-container");
    if (elem) elem.scrollTop = 0;
  };

  const progressPct = Math.round((visited.size / 12) * 100);

  const toggleChecklist = (key: string) => {
    setCompletedChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleQuizAnswer = (quizId: number, optionIdx: number, isCorrect: boolean) => {
    if (quizAnswers[quizId] !== undefined) return; // locked once answered
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: {
        selected: optionIdx,
        correct: isCorrect
      }
    }));
    if (isCorrect) {
      toast.success("Correct answer! Stellar theoretical deduction.");
    } else {
      toast.error("Not quite! Study the module parameters closely.");
    }
  };

  const menuItems = [
    { label: "Welcome & Introduction", badge: "✦", idx: 0 },
    { label: "History of AI", badge: "01", idx: 1 },
    { label: "Prompt Engineering", badge: "02", idx: 2 },
    { label: "AI Filmmaking", badge: "03", idx: 3 },
    { label: "Script Writing Mastery", badge: "04", idx: 4 },
    { label: "Thumbnail Psychology", badge: "05", idx: 5 },
    { label: "Video Retention Science", badge: "06", idx: 6 },
    { label: "Caption Writing Mastery", badge: "07", idx: 7 },
    { label: "Creator Growth Systems", badge: "08", idx: 8 },
    { label: "AI Detection & Deepfakes", badge: "09", idx: 9 },
    { label: "Kron Script AI Workflow", badge: "10", idx: 10 },
    { label: "Certificate & Roadmap", badge: "★", idx: 11 },
  ];

  const pageData = fullAcademyMasterData[activePage];

  return (
    <div className="fixed inset-0 z-[80] grid grid-cols-1 lg:grid-cols-[290px_1fr] bg-zinc-950 text-zinc-100 font-sans outline-none overflow-hidden" id="academy-layout">
      
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden flex items-center justify-between border-b border-zinc-850 bg-zinc-900/90 p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 text-left">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-600 to-indigo-505 flex items-center justify-center text-xs font-bold font-display uppercase tracking-wider text-white shrink-0">
            A
          </div>
          <div className="text-left">
            <h3 className="text-xs font-bold leading-tight font-display text-white">Aura Tech Classroom</h3>
            <p className="text-[10px] text-zinc-400">Kron Script AI - Creator Mastery</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 transition-all rounded hover:bg-zinc-800 text-zinc-400"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 transition-all rounded hover:bg-zinc-800 text-purple-400 font-bold text-xs border border-purple-500/30 font-mono uppercase"
          >
            Exit
          </button>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 lg:static z-[90] w-[290px] bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Brand header */}
          <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-md font-bold font-display text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] shrink-0">
                A
              </div>
              <div className="text-left">
                <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 font-display">Aura Tech</h2>
                <p className="text-[10px] text-zinc-400 italic">Creator Mastery Program</p>
              </div>
            </div>
            {sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded bg-zinc-90 w-7 h-7 flex items-center justify-center border border-zinc-800 hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4 font-mono select-none" id="academy-sidebar-nav">
            <div className="space-y-1 text-left">
              <span className="px-3 text-[9px] uppercase tracking-widest font-black text-zinc-600 block mb-2 font-bold">START HERE</span>
              {menuItems.slice(0, 1).map((item) => (
                <button
                  key={item.idx}
                  onClick={() => setPage(item.idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs tracking-tight transition-all uppercase cursor-pointer ${
                    activePage === item.idx 
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/20 font-bold" 
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-zinc-900 text-[10px] font-black text-center flex items-center justify-center text-zinc-500 border border-zinc-800 shrink-0 select-none">
                    {item.badge}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2 text-left">
              <span className="px-3 text-[9px] uppercase tracking-widest font-black text-zinc-600 block mb-2 font-bold">CORE CURRICULUM</span>
              {menuItems.slice(1, 11).map((item) => (
                <button
                  key={item.idx}
                  onClick={() => setPage(item.idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs tracking-tight transition-all uppercase cursor-pointer ${
                    activePage === item.idx 
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/20 font-bold" 
                      : "text-zinc-400 hover:bg-zinc-900/65 hover:text-zinc-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-zinc-900 text-[10px] font-black text-center flex items-center justify-center text-zinc-500 border border-zinc-800 shrink-0 select-none">
                    {item.badge}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2 text-left">
              <span className="px-3 text-[9px] uppercase tracking-widest font-black text-zinc-600 block mb-2 font-bold">CREDENTIAL</span>
              {menuItems.slice(11).map((item) => (
                <button
                  key={item.idx}
                  onClick={() => setPage(item.idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg text-xs tracking-tight transition-all uppercase cursor-pointer ${
                    activePage === item.idx 
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/20 font-bold" 
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                  }`}
                >
                  <span className="w-5 h-5 rounded bg-zinc-900 text-[10px] font-black text-center flex items-center justify-center text-zinc-500 border border-zinc-800 shrink-0 select-none">
                    {item.badge}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer progress */}
        <div className="p-5 border-t border-zinc-900 bg-zinc-900/10 text-left">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500 uppercase mb-2">
            <span>CURRICULUM progress</span>
            <span className="text-purple-400 font-extrabold">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-[11px] font-mono font-bold uppercase tracking-widest rounded-xl border border-zinc-800 transition-colors cursor-pointer"
          >
            Exit Classroom
          </button>
        </div>
      </aside>

      {/* MAIN SCREEN CLASSROOM */}
      <main className="flex-1 overflow-y-auto select-text px-4 md:px-12 py-8 md:py-16 bg-zinc-950 relative" id="academy-scroll-container">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[760px] mx-auto text-left relative z-10 font-sans space-y-10">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              {/* PAGE TOP TITLE BOX */}
              <div className="space-y-4">
                {pageData.eyebrow && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[11px] font-mono font-bold uppercase border border-purple-500/25">
                    {pageData.eyebrow}
                  </div>
                )}
                <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-[1.1] text-white">
                  {pageData.title}
                </h1>
                {pageData.subtitle && (
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-serif pt-1">
                    {pageData.subtitle}
                  </p>
                )}
              </div>

              {/* WELCOME PAGE EXTRAS */}
              {activePage === 0 && (
                <>
                  {/* Stats Block */}
                  {pageData.stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {pageData.stats.map((st, sIdx) => (
                        <div key={sIdx} className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl text-center">
                          <span className="text-3xl font-display font-black text-purple-400 block leading-none">{st.number}</span>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block mt-2">{st.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* About Block */}
                  {pageData.infoBox && (
                    <div className="p-6 md:p-8 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/15 rounded-3xl space-y-3">
                      <h3 className="text-lg font-serif font-bold text-purple-300">{pageData.infoBox.title}</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {pageData.infoBox.body}
                      </p>
                    </div>
                  )}

                  {/* Letter Block */}
                  {pageData.letter && (
                    <div className="border border-zinc-800 hover:border-purple-500/20 transition-all rounded-3xl p-6 md:p-8 bg-zinc-950/80 border-l-4 border-l-purple-500 space-y-4">
                      <span className="text-sm font-serif italic text-zinc-200 font-bold block">{pageData.letter.greeting}</span>
                      {pageData.letter.body.map((para, pIdx) => (
                        <p key={pIdx} className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {para}
                        </p>
                      ))}
                      <div className="font-serif italic text-purple-400 text-sm text-right pt-2">{pageData.letter.sig}</div>
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setPage(1)}
                      className="px-6 py-3.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/20"
                    >
                      <span>Begin Module 1</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                    <button 
                      onClick={() => setPage(11)}
                      className="px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-purple-400 text-xs font-mono font-black border border-purple-500/25 uppercase tracking-widest rounded-2xl cursor-pointer"
                    >
                      View Certificate
                    </button>
                  </div>
                </>
              )}

              {/* CORE MODULES (PAGES 1-10) TIMELINE BLOCK */}
              {activePage === 1 && pageData.timeline && (
                <div className="space-y-6">
                  <h3 className="text-md font-serif font-bold text-purple-400 border-b border-zinc-900 pb-2">1.2 The Evolution of AI — A Complete Timeline</h3>
                  <div className="border border-zinc-900 rounded-3xl p-6 bg-zinc-950 relative space-y-6">
                    <div className="absolute left-[29px] top-8 bottom-8 w-0.5 bg-zinc-900" />
                    
                    {pageData.timeline.map((tm, tIdx) => (
                      <div key={tIdx} className="flex gap-4 relative z-10">
                        <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-zinc-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-purple-500/30 font-bold text-[10px]" />
                        <div className="text-left">
                          <strong className="text-purple-400 font-mono text-xs block">{tm.year}</strong>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-sans">{tm.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LESSON BLOCKS RENDERING ENGINE */}
              {pageData.lessons && pageData.lessons.map((les, lIdx) => (
                <div key={lIdx} className="border border-zinc-900 rounded-3xl p-6 md:p-8 bg-zinc-900/10 space-y-5 text-left">
                  <h3 className="text-md font-serif font-bold text-purple-400 flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-500">{les.num}</span>
                    {les.title}
                  </h3>

                  {les.body && les.body.map((para, pIdx) => (
                    <p key={pIdx} className="text-xs text-zinc-300 leading-relaxed font-sans">
                      {para}
                    </p>
                  ))}

                  {/* FRAMEWORK ACTIONS / STEPS */}
                  {les.fwBox && (
                    <div className="bg-zinc-950/60 rounded-2xl p-5 space-y-4 border border-zinc-900 text-left">
                      <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest block">{les.fwBox.title}</span>
                      <div className="space-y-3">
                        {les.fwBox.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex gap-3 text-xs leading-relaxed items-start">
                            <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-500/20 text-purple-400 font-mono text-[9px] font-black flex items-center justify-center shrink-0 mt-0.5 select-none">
                              {st.icon}
                            </span>
                            <span className="text-zinc-350 flex-1 font-sans">{st.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB SECTIONS */}
                  {les.subsections && les.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-2 pt-2 border-t border-zinc-900 border-dotted">
                      <strong className="text-xs font-mono uppercase text-zinc-400 tracking-wider block">{sub.title}</strong>
                      <div className="space-y-2">
                        {sub.body.map((p, pI) => (
                          <p key={pI} className="text-xs text-zinc-400 leading-relaxed pl-3 border-l border-zinc-800 font-sans">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* CALLOUT BLOCKS */}
                  {les.callouts && les.callouts.map((cl, cIdx) => {
                    const tint = cl.type === "tip" 
                      ? "bg-emerald-500/5 border-l-emerald-500/60 text-emerald-400 border-zinc-900"
                      : cl.type === "warn"
                        ? "bg-amber-500/5 border-l-amber-500/60 text-amber-550 border-zinc-900"
                        : cl.type === "example"
                          ? "bg-blue-500/5 border-l-blue-500/60 text-blue-400 border-zinc-900"
                          : "bg-purple-500/5 border-l-purple-500/60 text-purple-400 border-zinc-900";
                    
                    return (
                      <div key={cIdx} className={`p-4 rounded-xl border border-l-4 leading-relaxed space-y-1 block text-left ${tint}`}>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider">
                          {cl.type === "tip" && <Sparkles className="h-3.5 w-3.5" />}
                          {cl.type === "warn" && <ShieldAlert className="h-3.5 w-3.5" />}
                          {cl.type === "example" && <Terminal className="h-3.5 w-3.5" />}
                          {cl.type === "case" && <Award className="h-3.5 w-3.5" />}
                          <span>{cl.title}</span>
                        </div>
                        <p className="text-xs text-zinc-300 whitespace-pre-wrap font-sans font-light leading-relaxed">{cl.body}</p>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* THUMBNAIL COLOR BLOCKS (MODULE 5 SPECIAL) */}
              {activePage === 5 && pageData.colorGrid && (
                <div className="space-y-4 text-left">
                  <h3 className="text-xs font-mono font-black tracking-widest text-purple-400 uppercase">Neurological Color Psychology Mapping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    {pageData.colorGrid.map((cd, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="p-4 rounded-2xl border flex items-start gap-4 transition-all"
                        style={{ borderColor: cd.borderBg, backgroundColor: cd.bgBg }}
                      >
                        <span 
                          className="w-8 h-8 rounded-xl shrink-0 block mt-1" 
                          style={{ backgroundColor: cd.swatch }} 
                        />
                        <div className="space-y-1">
                          <strong className="text-xs uppercase tracking-wide font-black" style={{ color: cd.textColor }}>{cd.name}</strong>
                          <p className="text-[11px] text-zinc-405 leading-relaxed font-light text-zinc-400">{cd.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC COMPLETED CHECKLIST MODAL */}
              {pageData.checklist && (
                <div className="p-6 bg-zinc-900/25 border border-zinc-900 rounded-3xl space-y-4 text-left">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest font-black text-purple-400">
                    <Check className="h-4 w-4 text-purple-400 animate-pulse" />
                    <span>Quality Refinement Checklist</span>
                  </div>
                  <div className="space-y-2">
                    {pageData.checklist.map((item, idx) => {
                      const key = `p_${activePage}_c_${idx}`;
                      const isDone = completedChecklist[key];
                      return (
                        <div 
                          key={key} 
                          onClick={() => toggleChecklist(key)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 cursor-pointer transition-all select-none"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                            isDone ? "bg-purple-650 border-purple-500 text-white bg-purple-600" : "border-zinc-850"
                          }`}>
                            {isDone && <Check className="h-3 w-3" />}
                          </div>
                          <span className={`text-xs text-zinc-350 ${isDone ? "line-through text-zinc-555 text-zinc-500" : ""}`}>
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SCREENPLAY SPECIFIC MASTERPIECE (MODULE 4 SPECIAL EXAMPLE) */}
              {activePage === 4 && (
                <div className="p-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl space-y-4">
                  <div className="flex items-between justify-between border-b border-zinc-900 pb-2 flex-wrap gap-2">
                    <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase">FEATURED EXAMPLE SCREENPLAY</span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-black">TITLE: THE ALGORITHM</span>
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 font-mono text-[11px] text-zinc-350 leading-relaxed text-left space-y-4 h-80 overflow-y-auto custom-scrollbar">
                    <p className="text-purple-400 font-black uppercase">EXT. CITY — BEFORE DAWN — ESTABLISHING SHOT</p>
                    <p className="text-zinc-400 italic">A sleeping city breathing in the dark. A thousand lives suspended between yesterday and tomorrow.</p>
                    <p className="text-purple-400 font-black uppercase">INT. SMALL APARTMENT — CONTINUOUS</p>
                    <p className="text-zinc-400 italic">ELIAS (27, animator, possessing the specific exhaustion of someone who has been trying very hard) stares at his analytics.</p>
                    <div className="pl-6 pt-1">
                      <p className="font-extrabold text-zinc-350">JAY</p>
                      <p>Still watching the numbers?</p>
                    </div>
                    <div className="pl-6 pt-1">
                      <p className="font-extrabold text-zinc-350">ELIAS</p>
                      <p>The algorithm hates me.</p>
                    </div>
                    <div className="pl-6 pt-1">
                      <p className="font-extrabold text-zinc-350">JAY</p>
                      <p>The algorithm doesn’t know you exist. Which one’s worse?</p>
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE KNOWLEDGE CHECK / QUIZZES */}
              {pageData.quiz && (
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-4 text-left">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-black text-purple-400 uppercase tracking-widest">
                    <Zap className="h-4 w-4 text-purple-400 animate-pulse" />
                    <span>✦ GRADUATE ACADEMIC KNOWLEDGE CHECK</span>
                  </div>
                  <p className="text-xs font-serif font-bold text-zinc-200 leading-relaxed">{pageData.quiz.question}</p>
                  
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    {pageData.quiz.options.map((opt, oIdx) => {
                      const answered = quizAnswers[activePage];
                      const isSelected = answered?.selected === oIdx;
                      const butTint = answered 
                        ? opt.isCorrect 
                          ? "bg-emerald-500/10 border-emerald-505 text-emerald-450 border-emerald-500/40 text-emerald-400"
                          : isSelected 
                            ? "bg-rose-500/10 border-rose-505 text-rose-450 border-rose-500/40 text-rose-450"
                            : "bg-zinc-90 w-full text-zinc-500 border-zinc-900 opacity-40"
                        : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-purple-500/25 hover:text-zinc-200 cursor-pointer";

                      return (
                        <button 
                          key={oIdx}
                          onClick={() => handleQuizAnswer(activePage, oIdx, opt.isCorrect)}
                          disabled={answered !== undefined}
                          className={`w-full py-3.5 px-4 text-left rounded-xl border transition-all ${butTint}`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswers[activePage] && (
                    <p className={`text-xs p-3.5 rounded-xl border font-sans leading-relaxed ${
                      quizAnswers[activePage].correct 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                        : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                    }`}>
                      {quizAnswers[activePage].correct ? pageData.quiz.feedbackCorrect : pageData.quiz.feedbackWrong}
                    </p>
                  )}
                </div>
              )}

              {/* ASSIGNMENT CARDS */}
              {pageData.assignment && (
                <div className="border-2 border-dashed border-purple-500/20 bg-purple-500/5 rounded-3xl p-6 md:p-8 space-y-4 text-left">
                  <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase flex items-center gap-1.5 font-bold">
                    <FileText className="h-4 w-4" />
                    {pageData.assignment.title}
                  </span>
                  <div className="space-y-3 font-sans text-xs text-zinc-350 leading-relaxed pl-4 list-decimal marker:text-purple-400 marker:font-mono">
                    {pageData.assignment.tasks.map((tsk, tI) => (
                      <p key={tI} className="leading-relaxed">
                        {tsk}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* GRADUATION PAGE CREDENTIAL FRAME (PAGE 11 WELCOME) */}
              {activePage === 11 && (
                <div className="space-y-10">
                  {/* Gold bordered certificate */}
                  <div className="w-full max-w-2.5xl bg-gradient-to-br from-purple-950/20 via-zinc-900/40 to-black border-2 border-yellow-500/40 rounded-3xl p-8 md:p-12 relative text-center overflow-hidden">
                    <div className="absolute inset-2 border border-yellow-500/10 rounded-2xl pointer-events-none" />
                    
                    <span className="text-3xl text-yellow-500 block mb-3">✦</span>
                    <span className="text-[10px] font-mono tracking-widest text-yellow-500 block uppercase font-black mb-1">CERTIFICATE of graduation</span>
                    <h3 className="text-2xl md:text-3xl font-serif font-black text-white uppercase tracking-wide leading-tight font-bold">
                      Kron Script AI Creator Mastery
                    </h3>
                    
                    <div className="w-32 h-px bg-yellow-500/20 mx-auto my-6" />
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">This credentials diploma is proudly awarded to:</p>
                    
                    <input 
                      type="text"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value.toUpperCase())}
                      placeholder="ENTER YOUR FULL NAME"
                      className="bg-transparent border-b border-purple-500/30 focus:border-yellow-500 text-lg md:text-2xl font-serif font-black italic text-yellow-400 text-center uppercase py-2 outline-none mx-auto max-w-sm block mt-2 tracking-wide font-extrabold transition-all"
                    />

                    <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto mt-6 font-sans">
                      For successfully acquiring comprehensive, structured competence across artificial intelligence history, few-shot prompt formulation, advanced cinematic camera guidelines, script writing structures, and platform growth systems.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-850 text-left font-mono text-[10px]">
                      <div>
                        <span className="text-[8px] text-zinc-500 block uppercase leading-none">VERIFICATION ID</span>
                        <span className="text-zinc-300 font-bold uppercase font-mono">KR-{userEmail ? userEmail.substring(0, 5).toUpperCase() : "GUEST"}-99X</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-500 block uppercase leading-none font-mono">AUTHORIZER SIGNATURE</span>
                        <span className="text-purple-400 italic font-bold">Aura Tech Integration Hub</span>
                      </div>
                    </div>
                  </div>

                  {/* 12-Month Roadmap Grid */}
                  {pageData.roadmapGrid && (
                    <div className="space-y-4 text-left">
                      <h3 className="text-sm font-mono font-bold uppercase text-purple-400 tracking-wide border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                        <TrendingUp className="h-4.5 w-4.5" />
                        12-Month Post-Mastery Roadmap
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pageData.roadmapGrid.map((road, rIdx) => (
                          <div key={rIdx} className="p-5 bg-zinc-900/20 border border-zinc-900 rounded-2xl flex items-start gap-4 hover:border-purple-500/20 transition-all">
                            <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-purple-950 border border-purple-500/20 text-purple-400 rounded shrink-0">
                              {road.phase}
                            </span>
                            <div className="space-y-1">
                              <strong className="text-xs uppercase text-zinc-300 block font-bold leading-none">{road.title}</strong>
                              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{road.list}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resource Library Group */}
                  {pageData.resourceGrid && (
                    <div className="space-y-4 text-left">
                      <h3 className="text-sm font-mono font-bold uppercase text-zinc-400 tracking-wide border-b border-zinc-900 pb-2">Academics Resources Hub</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pageData.resourceGrid.map((res, reIdx) => (
                          <div key={reIdx} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/30 transition-all flex items-start gap-3">
                            <span className="text-lg block mt-0.5 select-none">{res.icon}</span>
                            <div>
                              <strong className="text-xs text-zinc-300 block font-serif font-bold">{res.name}</strong>
                              <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed font-sans">{res.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Graduation message */}
                  {pageData.letter && (
                    <div className="p-6 md:p-8 border border-zinc-900 rounded-3xl bg-zinc-950 relative text-left border-l-4 border-l-purple-500 space-y-4">
                      <span className="text-sm font-serif italic text-zinc-200 font-bold block">{pageData.letter.greeting}</span>
                      {pageData.letter.body.map((para, pIdx) => (
                        <p key={pIdx} className="text-xs text-zinc-400 leading-relaxed font-light font-sans">
                          {para}
                        </p>
                      ))}
                      <div className="font-serif italic text-purple-400 text-sm text-right pt-2">{pageData.letter.sig}</div>
                    </div>
                  )}

                  {/* Beta Launch Key Warning Box */}
                  {pageData.kronBox && (
                    <div className="p-6 md:p-8 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl text-left space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-15 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
                      <span className="text-[9px] font-mono text-yellow-500 uppercase font-black tracking-widest block">{pageData.kronBox.label}</span>
                      <h4 className="text-md font-serif font-black text-zinc-100">{pageData.kronBox.title}</h4>
                      <p className="text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap font-sans font-light">
                        {pageData.kronBox.body}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* PAGE NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-8 border-t border-zinc-900/60 font-mono text-xs">
            <button
              onClick={() => activePage > 0 && setPage(activePage - 1)}
              disabled={activePage === 0}
              className="px-4 py-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-805 text-zinc-400 rounded-xl flex items-center gap-1 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed select-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="text-zinc-500 text-[11px] font-bold">
              PAGE {activePage + 1} OF 12
            </span>

            <button
              onClick={() => activePage < 11 ? setPage(activePage + 1) : onClose()}
              className="px-4 py-2.5 bg-zinc-900/55 hover:bg-zinc-900 border border-zinc-800 text-purple-400 hover:text-purple-300 rounded-xl flex items-center gap-1 cursor-pointer transition-all select-none"
            >
              <span>{activePage === 11 ? "Complete & Exit" : "Next Module"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}
