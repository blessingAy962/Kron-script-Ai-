import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Users, Scale, FileText, ArrowLeft, Gem, Lock, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { KronLogo } from "../components/KronLogo";

export function Copyright() {
  return (
    <div className="min-h-screen bg-[#07050d] text-zinc-100 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Decorative ambient gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      
      {/* Dynamic star grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-border/40 backdrop-blur-md bg-zinc-950/45 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <KronLogo variant="combined" size="xs" />
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Studio
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 z-10 w-full flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Top Title Card */}
          <div className="text-center md:text-left space-y-3 pb-8 border-b border-zinc-800/60">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] font-black tracking-widest uppercase">
              <Scale className="h-3 w-3" /> Legal Information Center
            </div>
            <h1 className="text-3xl md:text-5xl font-mono font-black uppercase tracking-tight text-white leading-tight">
              Copyright Intellectual Property & Data Safety Oath
            </h1>
            <p className="text-zinc-400 text-sm md:text-md max-w-2xl font-light">
              Effective May 2026. This legal document outlines our absolute protection of user data, strict restrictions against illegal cloning, and warnings regarding impersonation.
            </p>
          </div>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="legal-quick-pills">
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between gap-3 backdrop-blur-xs">
              <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <EyeOff className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Zero Commercial Trading</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">We never sell, distribute, or monetize user creation logs or email lists.</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between gap-3 backdrop-blur-xs">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Lock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Script Confidentiality</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">Generative scripts are heavily encrypted and completely isolated in private silos.</p>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-500/10 rounded-2xl p-5 flex flex-col justify-between gap-3 backdrop-blur-xs shadow-[0_4px_24px_rgba(147,51,234,0.05)]">
              <div className="h-8 w-8 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 animate-pulse">
                <ShieldAlert className="h-4 w-4 text-red-400" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-500">Website Protection Rule</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">Unauthorised code copying, hosting under fake branding, or framing is strictly proscribed.</p>
              </div>
            </div>
          </div>

          {/* Detailed Legal Sections */}
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 md:p-8 space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <Gem className="h-5 w-5 text-purple-400" />
                <h2 className="text-md font-mono font-black uppercase tracking-wider">
                  1. Ownership of Brand, Assets & Design System
                </h2>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                All source code, stylesheets, asset packages, fonts, unique web soundscapes, touch physical mechanics, logos, dynamic UI dashboards, and trademark slogans associated with <span className="text-white font-mono font-bold">KRON AI</span> and its parent framework <span className="text-purple-400 font-mono font-bold">Auratech</span> are owned entirely. Every distinctive layout is handcrafted to embody cutting-edge digital craft. We do not grant standard copy licenses, templates, or redistribution approvals of these designs.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 md:p-8 space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <Scale className="h-5 w-5 text-yellow-500" />
                <h2 className="text-md font-mono font-black uppercase tracking-wider">
                  2. Strict Warnings Against Cloning & Sued Risks
                </h2>
              </div>
              <div className="text-xs md:text-sm text-zinc-400 space-y-3 leading-relaxed font-light">
                <p>
                  Any unauthorized cloning, copying, mirroring, structural replication, or commercial repurposing of our proprietary codebases, asset models, design structures, or user interfaces is strictly illegal. 
                </p>
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
                  <span className="font-bold uppercase tracking-widest block mb-1">⚠️ IMMEDIATE LITIGATION WARNING:</span>
                  Impersonating this application, running clone services mimicking auratech assets, or launching deceptive websites representing themselves as KRON AI is of immense legal liability. Violators who deceive our users or attempt brand hijacking will be relentlessly pursued in court, sued for copyright damages, and prosecuted to the fullest extent of local and global consumer safety laws.
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 md:p-8 space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5 text-emerald-400" />
                <h2 className="text-md font-mono font-black uppercase tracking-wider">
                  3. Our Uncompromising User Data Safety Pact
                </h2>
              </div>
              <div className="text-xs md:text-sm text-zinc-400 space-y-3 leading-relaxed font-light">
                <p>
                  We build highly polished digital services that prioritize data transparency and deep creative security. Your uploaded files, video scripts, movie ideas, prompt suggestions, and dynamic inputs are shielded with modern encryption protocols.
                </p>
                <p className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-medium leading-relaxed">
                  <span className="font-bold font-mono tracking-wider block mb-1 uppercase text-emerald-300">🔒 WE DO NOT SELL YOUR DATA OATH:</span>
                  We believe your creations are yours alone. KRON AI strictly oath-guarantees that we never have, nor will we ever, lease, barter, sell, or trade your scripts, creative outlines, preferences, email info, or workspace histories. No advertisement brokers or commercial scrapers will ever obtain access to your creative vault.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-zinc-900/20 border border-zinc-800/40 rounded-2xl p-6 md:p-8 space-y-3.5">
              <div className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                <h2 className="text-md font-mono font-black uppercase tracking-wider">
                  4. User Responsibility & Account Creation Privacy
                </h2>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-light">
                By making use of this professional scriptwriter application, you acknowledge that intellectual outputs (the stories, dialogues, outlines, and metrics you model inside our secure generative workspace) belong fully to your person or entity. We handle our cookie tracking ethically; session tokens and customization state logs are saved to guarantee zero-latency navigation.
              </p>
            </div>
          </div>

          {/* Fine Print disclaimer */}
          <div className="border-t border-zinc-800/60 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
            <span>© 2026 KRON AI & Auratech. Managed under rigorous data protection.</span>
            <div className="flex gap-4">
              <span className="hover:text-zinc-300 transition-colors">Term ID: KRN-202</span>
              <span className="hover:text-zinc-300 transition-colors">Privacy Shield Ver. 3.4</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-zinc-900/80 bg-zinc-950/80 p-6 text-center text-xs text-zinc-500 font-mono">
        <p>Auratech hand-designed with security and cinematic elegance.</p>
      </footer>
    </div>
  );
}

export default Copyright;
