import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { 
  Upload, 
  Camera, 
  Sparkles, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Terminal, 
  Tv, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  ArrowRight
} from "lucide-react";

interface ReversePromptResult {
  prompt: string;
  cameraAngle: string;
  lighting: string;
  aspectRatio: string;
  style: string;
}

interface ThumbnailResult {
  ctr: string;
  corrections: string[];
  analysis: string;
}

interface ScriptResult {
  script: string;
  caption: string;
}

export default function PlaygroundSection() {
  // Module 1: Reverse Prompt Extractor State
  const [extFile, setExtFile] = useState<string | null>(null);
  const [extFileName, setExtFileName] = useState<string>("");
  const [extFileType, setExtFileType] = useState<string>("");
  const [extUploading, setExtUploading] = useState(false);
  const [extResult, setExtResult] = useState<ReversePromptResult | null>(null);
  const [extDragActive, setExtDragActive] = useState(false);
  const [extCopied, setExtCopied] = useState(false);
  const fileInputRef1 = useRef<HTMLInputElement>(null);

  // Module 2: Thumbnail Tester State
  const [testFile, setTestFile] = useState<string | null>(null);
  const [testFileName, setTestFileName] = useState<string>("");
  const [testUploading, setTestUploading] = useState(false);
  const [testResult, setTestResult] = useState<ThumbnailResult | null>(null);
  const [testDragActive, setTestDragActive] = useState(false);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  // Module 3: Script & Caption State
  const [ideaText, setIdeaText] = useState("");
  const [archUploading, setArchUploading] = useState(false);
  const [archResult, setArchResult] = useState<ScriptResult | null>(null);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  // Helper: Read file contents to Base64
  const processMediaFile = (file: File, callback: (base64: string, name: string, type: string) => void) => {
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File exceeds premium limits. File bigger than 100mb not allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string, file.name, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Module 1 Handlers
  const handleExtDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setExtDragActive(true);
    } else if (e.type === "dragleave") {
      setExtDragActive(false);
    }
  };

  const handleExtDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExtDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processMediaFile(file, (base64, name, type) => {
        setExtFile(base64);
        setExtFileName(name);
        setExtFileType(type);
        triggerReversePromptAPI(base64, type);
      });
    }
  };

  const handleExtChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processMediaFile(file, (base64, name, type) => {
        setExtFile(base64);
        setExtFileName(name);
        setExtFileType(type);
        triggerReversePromptAPI(base64, type);
      });
    }
  };

  const triggerReversePromptAPI = async (base64Data: string, mimeType: string) => {
    setExtUploading(true);
    setExtResult(null);
    try {
      const resp = await fetch("/api/reverse-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media: base64Data, mimeType }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setExtResult(data);
      } else {
        throw new Error("API failure");
      }
    } catch (err) {
      console.warn("Error running landing page reverse prompt", err);
    } finally {
      setExtUploading(false);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setExtCopied(true);
    setTimeout(() => setExtCopied(false), 2000);
  };

  // Module 2 Handlers
  const handleTestDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setTestDragActive(true);
    } else if (e.type === "dragleave") {
      setTestDragActive(false);
    }
  };

  const handleTestDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTestDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processMediaFile(file, (base64, name, type) => {
        setTestFile(base64);
        setTestFileName(name);
        triggerTestThumbnailAPI(base64, type);
      });
    }
  };

  const handleTestChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processMediaFile(file, (base64, name, type) => {
        setTestFile(base64);
        setTestFileName(name);
        triggerTestThumbnailAPI(base64, type);
      });
    }
  };

  const triggerTestThumbnailAPI = async (base64Data: string, mimeType: string) => {
    setTestUploading(true);
    setTestResult(null);
    try {
      const resp = await fetch("/api/predictive-thumbnail-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media: base64Data, mimeType }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setTestResult(data);
      } else {
        throw new Error("API failure");
      }
    } catch (err) {
      console.warn("Error running landing page thumbnail tester", err);
    } finally {
      setTestUploading(false);
    }
  };

  // Module 3 Handlers
  const triggerScriptCaptionArchitect = async () => {
    if (!ideaText.trim()) return;
    setArchUploading(true);
    setArchResult(null);
    try {
      const resp = await fetch("/api/script-caption-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: ideaText }),
      });
      if (resp.ok) {
        const data = await resp.json();
        setArchResult(data);
      } else {
        throw new Error("API failure");
      }
    } catch (err) {
      console.warn("Error running landing page screenplay builder", err);
    } finally {
      setArchUploading(false);
    }
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  return (
    <section id="playground" className="py-24 bg-card/60 relative border-b-[3px] border-purple-600">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.02)_2px,transparent_2px),linear-gradient(90deg,rgba(147,51,234,0.02)_2px,transparent_2px)] [background-size:40px_40px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-3"
        >
          <div className="font-mono text-xs uppercase text-purple-600 font-extrabold tracking-widest bg-purple-50 inline-block px-3 py-1 border border-purple-200 rounded">
            Interactive Command Simulator
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
            LIVE LABS <span className="text-purple-600">ENGINE</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-mono text-xs md:text-sm">
            Launch actual visual decoders and text architects instantly. Drag, drop, style, and outline continuous feed components.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* ==================== POSITION 1: THE REVERSE PROMPT EXTRACTOR ==================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm">POS_01</span>
              <h3 className="text-lg font-display font-black uppercase tracking-wider text-foreground">
                The Reverse Prompt Extractor
              </h3>
            </div>

            <div className="bg-white/90 backdrop-blur-md border-[3px] border-purple-600 rounded-xl p-6 shadow-[5px_5px_0px_0px_rgba(147,51,234,1)] relative overflow-hidden transition-all text-left">
              <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 border border-purple-200">
                <Sparkles className="h-3 w-3" /> reverse-mode
              </div>

              <p className="text-xs font-mono text-muted-foreground mb-4 leading-relaxed">
                Reverse engineer reference story pieces to extract camera parameters and aspect ratio presets.
              </p>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleExtDrag}
                onDragOver={handleExtDrag}
                onDragLeave={handleExtDrag}
                onDrop={handleExtDrop}
                onClick={() => fileInputRef1.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                  extDragActive 
                    ? "border-purple-600 bg-purple-50/50" 
                    : "border-border bg-card hover:border-purple-600 hover:bg-white"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef1}
                  onChange={handleExtChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                {extFile ? (
                  <div className="flex flex-col items-center gap-3">
                    {extFileType.startsWith("video") ? (
                      <div className="relative w-40 aspect-[9/16] bg-black rounded-lg border-2 border-purple-600 flex items-center justify-center overflow-hidden">
                        <video src={extFile} className="w-full h-full object-cover" muted loop autoPlay />
                      </div>
                    ) : (
                      <img src={extFile} alt="Target frame mockup" className="w-40 aspect-[9/16] object-cover rounded-lg border-2 border-purple-600 shadow-sm" />
                    )}
                    <p className="text-xs font-mono text-muted-foreground truncate max-w-xs">{extFileName}</p>
                    <span className="text-[10px] uppercase font-mono text-purple-600 bg-purple-50 border border-purple-200 py-0.5 px-2">Click to replace</span>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <div className="mx-auto w-10 h-10 rounded-full border border-purple-200 flex items-center justify-center bg-purple-50">
                      <Upload className="h-4.5 w-4.5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold font-mono text-foreground">Drop visual draft, story card or vertical video</p>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Supports high-res storyteller panels & fast video loops</p>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {extUploading && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 border-t border-dashed border-border pt-4 flex flex-col items-center justify-center py-4"
                  >
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-[10px] font-mono text-purple-600 font-bold uppercase animate-pulse">Running Vision-Grid Decode...</p>
                  </motion.div>
                )}

                {extResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 border-t border-dashed border-border pt-6 space-y-6"
                  >
                    {/* Visual Presets list */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-purple-50/40 p-3 rounded-lg border border-purple-100 font-mono text-xs">
                        <span className="font-bold text-purple-600 block mb-0.5 uppercase text-[10px]">Camera Angle</span>
                        <p className="text-foreground">{extResult.cameraAngle}</p>
                      </div>
                      <div className="bg-purple-50/40 p-3 rounded-lg border border-purple-100 font-mono text-xs">
                        <span className="font-bold text-purple-600 block mb-0.5 uppercase text-[10px]">Lighting Level</span>
                        <p className="text-foreground">{extResult.lighting}</p>
                      </div>
                      <div className="bg-purple-50/40 p-3 rounded-lg border border-purple-100 font-mono text-xs">
                        <span className="font-bold text-purple-600 block mb-0.5 uppercase text-[10px]">Aspect Ratio</span>
                        <p className="text-foreground">{extResult.aspectRatio}</p>
                      </div>
                      <div className="bg-purple-50/40 p-3 rounded-lg border border-purple-100 font-mono text-xs">
                        <span className="font-bold text-purple-600 block mb-0.5 uppercase text-[10px]">Style Genre</span>
                        <p className="text-foreground">{extResult.style}</p>
                      </div>
                    </div>

                    {/* Extracted Output Textbox */}
                    <div className="bg-slate-900 border-2 border-purple-600 rounded-xl p-5 text-slate-100 relative">
                      <span className="absolute top-2 right-2 font-mono text-[9px] text-purple-400 font-bold uppercase tracking-widest bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">EXTRACTED</span>
                      <p className="font-mono text-xs leading-relaxed max-h-36 overflow-y-auto pr-2 select-all text-left">
                        {extResult.prompt}
                      </p>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleCopyPrompt(extResult.prompt)}
                          className="cursor-pointer font-mono text-[10px] font-extrabold uppercase bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 border border-purple-500"
                        >
                          {extCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {extCopied ? "Copied Prompt" : "Copy Extracted Prompt"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ==================== POSITION 2: PREDICTIVE THUMBNAIL & VIDEO TESTER ==================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm">POS_02</span>
              <h3 className="text-lg font-display font-black uppercase tracking-wider text-foreground">
                Predictive Thumbnail & Video Tester
              </h3>
            </div>

            <div className="bg-white/90 backdrop-blur-md border-[3px] border-purple-600 rounded-xl p-6 shadow-[5px_5px_0px_0px_rgba(147,51,234,1)] relative overflow-hidden transition-all text-left">
              <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 border border-purple-200">
                <TrendingUp className="h-3 w-3" /> analytics mode
              </div>

              <p className="text-xs font-mono text-muted-foreground mb-4 leading-relaxed">
                Harness Gemini Vision to index design layouts, contrast weights, and forecast anticipated viewers.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-5">
                  <div
                    onDragEnter={handleTestDrag}
                    onDragOver={handleTestDrag}
                    onDragLeave={handleTestDrag}
                    onDrop={handleTestDrop}
                    onClick={() => fileInputRef2.current?.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all min-h-[180px] ${
                      testDragActive 
                        ? "border-purple-600 bg-purple-50/50" 
                        : "border-border bg-card hover:border-purple-600 hover:bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef2}
                      onChange={handleTestChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {testFile ? (
                      <div className="space-y-2 text-center flex flex-col items-center">
                        <img src={testFile} alt="User Design draft" className="max-h-36 object-contain rounded border border-purple-600" />
                        <span className="text-[10px] uppercase font-mono font-bold text-purple-600">Change image</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="mx-auto w-10 h-10 rounded-full border border-purple-200 flex items-center justify-center bg-purple-50">
                          <ImageIcon className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-xs font-bold font-mono text-foreground">Click to upload mock thumbnail</p>
                        <p className="text-[9px] font-mono text-muted-foreground">Supported formats: JPEG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-7 bg-purple-50/30 border border-purple-100 p-4 rounded-xl min-h-[180px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {testUploading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center py-6"
                      >
                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <span className="text-[10px] font-mono text-purple-600 uppercase font-extrabold tracking-widest animate-pulse">Running visual testing loop...</span>
                      </motion.div>
                    ) : testResult ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                          <span className="text-[10px] font-mono uppercase font-bold text-purple-600 tracking-wider">Estimated performance metrics</span>
                          <span className="bg-purple-600 text-white font-mono text-xs font-black px-2.5 py-1 rounded">Predicted CTR: {testResult.ctr}</span>
                        </div>
                        <p className="text-[11px] font-mono text-foreground leading-relaxed">{testResult.analysis}</p>
                        <ul className="space-y-1 pl-0 list-none">
                          {testResult.corrections.slice(0, 2).map((c, i) => (
                            <li key={i} className="text-[10px] font-mono text-purple-700 flex items-start gap-1.5 font-bold">
                              <AlertTriangle className="h-3 w-3 inline text-purple-600 shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-muted-foreground font-mono text-[11px]">
                        <p className="font-bold">Awaiting Design Artifact</p>
                        <p className="max-w-xs mt-0.5 text-muted-foreground">Drop visual layouts on the left panel to test immediate click velocity vectors.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== POSITION 3: SCRIPT & CAPTION ARCHITECT ==================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-sm">POS_03</span>
              <h3 className="text-lg font-display font-black uppercase tracking-wider text-foreground">
                Script & Caption Architect
              </h3>
            </div>

            <div className="bg-white/90 backdrop-blur-md border-[3px] border-purple-600 rounded-xl p-6 shadow-[5px_5px_0px_0px_rgba(147,51,234,1)] relative overflow-hidden transition-all text-left">
              <div className="absolute top-2 right-2 flex items-center gap-1 font-mono text-[9px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 border border-purple-200">
                <Flame className="h-3 w-3" /> architect mode
              </div>

              <p className="text-xs font-mono text-muted-foreground mb-4 leading-relaxed">
                Take raw draft briefs and deploy immediate retention dialogue rules with continuous hashtag presets.
              </p>

              <div className="space-y-4">
                <div className="relative group rounded-xl">
                  {/* Purple hover-scribble shadow glow effect! */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
                  <textarea
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    placeholder="Enter your storyboard idea (e.g. '3 financial secrets that banks guard with monospaced brutalist visuals')..."
                    className="relative w-full min-h-[90px] bg-white border border-border rounded-xl p-4 font-mono text-xs focus:ring-1 focus:ring-purple-600 focus:outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={archUploading || !ideaText.trim()}
                    onClick={triggerScriptCaptionArchitect}
                    className="cursor-pointer font-mono text-xs uppercase tracking-wider font-black bg-purple-600 hover:bg-purple-700 text-white border-2 border-black px-5 py-2 rounded-lg shadow-[3px_3px_0px_0px_#000000] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000000] transition-all disabled:opacity-50"
                  >
                    {archUploading ? "Developing..." : "Build Script & Captions"}
                  </button>
                </div>

                <AnimatePresence>
                  {archResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                    >
                      {/* Script Panel */}
                      <div className="bg-slate-900 border-[2px] border-purple-600 rounded-xl p-4 text-slate-100 flex flex-col justify-between">
                        <span className="font-mono text-[9px] text-purple-400 block mb-2 font-bold uppercase">&gt; High-retention typewriter script</span>
                        <div className="bg-slate-950 p-3 border border-slate-800 rounded max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300">
                          {archResult.script}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleCopyScript(archResult.script)}
                            className="font-mono text-[10px] font-extrabold uppercase bg-purple-600 text-white px-3 py-1 rounded"
                          >
                            {scriptCopied ? "Copied" : "Copy Script"}
                          </button>
                        </div>
                      </div>

                      {/* Caption Panel */}
                      <div className="bg-slate-900 border-[2px] border-purple-600 rounded-xl p-4 text-slate-100 flex flex-col justify-between">
                        <span className="font-mono text-[9px] text-purple-400 block mb-2 font-bold uppercase">&gt; Social Media caption box</span>
                        <div className="bg-slate-950 p-3 border border-slate-800 rounded max-h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300">
                          {archResult.caption}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => handleCopyCaption(archResult.caption)}
                            className="font-mono text-[10px] font-extrabold uppercase bg-purple-600 text-white px-3 py-1 rounded"
                          >
                            {captionCopied ? "Copied" : "Copy Caption"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
