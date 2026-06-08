import { useState } from "react";
import { motion } from "motion/react";
import { Mic, Play, Sparkles, Loader2, Volume2, Save, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";

type VoiceActor = {
  id: string;
  name: string;
  accent: string;
  gender: string;
  previewUrl: string;
};

const ACTORS: VoiceActor[] = [
  { id: "v1", name: "Kore", accent: "American Deep", gender: "Male", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "v2", name: "Zephyr", accent: "British Crisp", gender: "Female", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "v3", name: "Puck", accent: "Australian Wild", gender: "Male", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "v4", name: "Charon", accent: "Cinematic Overlord", gender: "Male", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

export default function DashboardVoices() {
  const [text, setText] = useState("");
  const [selectedActor, setSelectedActor] = useState(ACTORS[0]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const synthesizeSpeech = async () => {
    if (!text.trim()) {
      toast.error("Please enter narration text");
      return;
    }

    setIsSynthesizing(true);
    setAudioUrl(null);

    // Synthesizing simulation hook
    setTimeout(() => {
      setIsSynthesizing(false);
      // High fidelity sample preview
      setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      toast.success("Vocal synthesis complete!");
    }, 2500);
  };

  return (
    <div className="max-w-6xl space-y-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold mb-1">AI Voices Lab</h1>
        <p className="text-muted-foreground text-sm font-body">Synthesize authentic speech voiceovers from written shorts screenplays.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column configuration */}
        <div className="md:col-span-1 space-y-4 text-left">
          <label className="text-sm font-semibold font-display text-foreground">Select Voice Actor</label>
          <div className="space-y-2">
            {ACTORS.map((actor) => (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedActor.id === actor.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                <div>
                  <h3 className="font-display font-bold text-sm text-foreground">{actor.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-body">{actor.accent} • {actor.gender}</p>
                </div>
                <Volume2 className={`h-4 w-4 ${selectedActor.id === actor.id ? "text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right column prompt */}
        <div className="md:col-span-2 space-y-4 text-left bg-card border border-border p-6 rounded-xl shadow-sm">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" /> Vocal Narrator Editor
          </h2>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold font-display text-muted-foreground">Text to Synthesize</label>
            <Textarea
              placeholder="e.g., Read this part in a slow dramatic whisper: This is the moment everything changed. No one expected the computer grid to turn itself back on..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSynthesizing}
              rows={5}
            />
          </div>

          {isSynthesizing ? (
            <div className="p-4 bg-secondary/20 rounded-xl border border-border text-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mb-2" />
              <span className="text-sm font-semibold font-display text-primary">Modulating vocal cords...</span>
            </div>
          ) : (
            <Button className="w-full font-display glow-primary cursor-pointer" disabled={!text.trim()} onClick={synthesizeSpeech}>
              <Sparkles className="mr-2 h-4 w-4" /> Synthesize Audio File
            </Button>
          )}

          {audioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary p-4 rounded-xl border border-primary/30 flex items-center justify-between flex-wrap gap-4 mt-4"
            >
              <div className="flex items-center gap-3">
                <Play className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <span className="text-xs font-semibold text-foreground font-display uppercase tracking-wider block">Generated Track</span>
                  <span className="text-[10px] text-muted-foreground font-body">Synthesized using {selectedActor.name} voiceover</span>
                </div>
              </div>
              <audio src={audioUrl} controls className="h-10 grow max-w-xs shrink" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
export { DashboardVoices };
