import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ImageIcon, Plus, Trash2, Download, Sparkles, Loader2, Copy } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";
import { db } from "@/src/lib/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";

type GeneratedImage = {
  id: string;
  prompt: string;
  imageUrl: string;
  date: string;
};

export default function DashboardImages() {
  const { user } = useAuth();
  const location = useLocation();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-fill prompt from route state if forwarded from script
  useEffect(() => {
    if (location.state?.scriptTitle) {
      setPrompt(`A viral cinematic thumbnail for a video titled "${location.state.scriptTitle}", high contrast, vibrant cinematic lighting, clickable composition`);
    }
  }, [location]);

  // Load from Firestore
  useEffect(() => {
    if (!user) return;
    const loadImages = async () => {
      try {
        const q = query(collection(db, "images"), where("user_id", "==", user.uid));
        const snap = await getDocs(q);
        const list: GeneratedImage[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            prompt: data.prompt || "Generated Art",
            imageUrl: data.image_url || "",
            date: data.created_at ? new Date(data.created_at.seconds * 1000).toLocaleDateString() : "Recent",
          });
        });
        setImages(list.sort((a,b) => b.id.localeCompare(a.id)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [user]);

  const generateThumbnail = async () => {
    if (!prompt.trim() || !user) return;
    setIsGenerating(true);
    toast.info("Powering up drawing canvas...");

    try {
      const resp = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, imageType: aspectRatio }),
      });

      if (!resp.ok) {
        throw new Error("Failed to contact image synthesis proxy");
      }

      const data = await resp.json();
      const imageUrl = data.imageUrl;

      if (data.warning === "quota_fallback") {
        toast.info("The main illustration API is currently rate-limited. Rendered high-fidelity cinematic storyboard matching your prompt!");
      }

      // Save database entry
      const ref = await addDoc(collection(db, "images"), {
        user_id: user.uid,
        prompt: prompt,
        image_url: imageUrl,
        created_at: serverTimestamp()
      });

      const newImg: GeneratedImage = {
        id: ref.id,
        prompt: prompt,
        imageUrl: imageUrl,
        date: new Date().toLocaleDateString()
      };

      setImages((prev) => [newImg, ...prev]);
      setPrompt("");
      toast.success("Thumbnail compiled & synced!");
    } catch (e: any) {
      toast.error("We are experiencing high demand. Please wait a minute and try again, or report this issue if it keeps coming up.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "images", id));
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Art purged");
    } catch (err) {
      toast.error("Failed to delete artwork");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-left">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span className="text-sm font-semibold text-muted-foreground font-display">Assembling artwork table...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 text-left">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Visual Storyboard</h1>
          <p className="text-muted-foreground text-sm font-body">Structure and model automated clickable thumbnails and cinematic visuals.</p>
        </div>
      </motion.div>

      {/* Generator Canvas card */}
      <div className="bg-card border border-foreground rounded-xl p-6 shadow-[3px_3px_0px_0px_rgba(51,37,29,1)] space-y-4">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Imagine Picture Art
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-sm font-semibold font-display text-foreground">Thumbnail prompt or visual details</label>
            <Input
              placeholder="e.g., A professional young businessman looking shocked holding a phone, neon 3D elements, hyper-detailed, 8k..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              onKeyDown={(e) => e.key === "Enter" && !isGenerating && generateThumbnail()}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {["16:9", "9:16", "1:1"].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                disabled={isGenerating}
                className={`px-4 py-2 text-xs rounded-lg border font-display font-bold cursor-pointer transition-all ${
                  aspectRatio === ratio
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-muted-foreground hover:border-primary/50"
                }`}
              >
                {ratio === "16:9" ? "Widescreen (16:9)" : ratio === "9:16" ? "Shorts vertical (9:16)" : "Square (1:1)"}
              </button>
            ))}
          </div>

          {isGenerating ? (
            <div className="text-center p-4 bg-secondary/20 rounded-xl border border-border">
              <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto mb-2" />
              <span className="text-xs font-semibold text-primary font-display uppercase tracking-wider">Compiling visual layers... please hold.</span>
            </div>
          ) : (
            <Button className="w-full font-display glow-primary cursor-pointer" disabled={!prompt.trim()} onClick={generateThumbnail}>
              <Sparkles className="mr-2 h-4 w-4" /> Draw Artwork
            </Button>
          )}
        </div>
      </div>

      {/* Grid gallery list */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" /> Drawn Elements Library
        </h3>

        {images.length === 0 && (
          <div className="border border-border bg-card p-12 rounded-xl text-center">
            <ImageIcon className="h-10 w-10 text-primary opacity-50 mx-auto mb-2" />
            <h4 className="font-display font-bold">No visual assets compiled yet</h4>
            <p className="text-xs text-muted-foreground font-body max-w-xs mx-auto mt-1">Specify layout details above and generate beautiful High-Definition assets.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-card border border-border rounded-xl spill-hidden p-3 flex flex-col justify-between hover:border-foreground transition-colors group">
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden border border-border mb-3 relative">
                <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-2 text-left">
                <p className="text-xs font-body font-semibold line-clamp-2 text-foreground">{img.prompt}</p>
                <p className="text-[10px] text-muted-foreground font-body">Created: {img.date}</p>
                <div className="flex gap-1 pt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs bg-white cursor-pointer"
                    onClick={() => { navigator.clipboard.writeText(img.prompt); toast.success("Prompt copied!"); }}
                  >
                    <Copy className="h-3 w-3 mr-1 text-primary" /> Copy prompt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-destructive hover:text-destructive bg-white cursor-pointer"
                    onClick={() => deleteImage(img.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export { DashboardImages };
