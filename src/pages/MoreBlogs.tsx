import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Calendar, Clock, User, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { db, collection, onSnapshot, doc, setDoc, serverTimestamp } from "@/src/lib/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RORO_PREVIEW_TEXT, RORO_BLOG_TEXT } from "../data/roroBlogText";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  previewText: string;
  expandedText: string;
  videoUrl?: string;
}

export default function MoreBlogs() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page mounts
    window.scrollTo(0, 0);

    const unsub = onSnapshot(collection(db, "blogs"), async (snapshot) => {
      const list: BlogPost[] = [];
      let roroPostExistsAndCorrect = false;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (docSnap.id === "roro-concept-trailer" && data.title && data.title.includes("Blessing Ay")) {
          roroPostExistsAndCorrect = true;
        }
        list.push({
          id: docSnap.id,
          category: data.category || "TECH FUTURES",
          title: data.title || "",
          date: data.date || "",
          readTime: data.readTime || "5 min read",
          author: data.author || "AuRa Tech Team",
          imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
          previewText: data.previewText || "",
          expandedText: data.expandedText || "",
          videoUrl: data.videoUrl || "",
        });
      });

      // Filter out the 3 initial seed blogs to only show custom-published blogs
      const seedIds = ["africa-ai-lab", "neuroscience-pacing", "prompt-engineering"];
      const customOnly = list.filter((post) => !seedIds.includes(post.id));

      setBlogs(customOnly);
      setLoading(false);

      // Programmatic seeding/update of the Roro blog if missing or outdated
      if (!roroPostExistsAndCorrect) {
        try {
          await setDoc(doc(db, "blogs", "roro-concept-trailer"), {
            id: "roro-concept-trailer",
            category: "CINEMATIC AI",
            title: "RORO — Bypassing Cameras: How Blessing Ay, Kron Script AI, and No Camera Studio Crafted 2026’s Most Hypnotic Cinematic AI Masterpiece",
            date: "August 5, 2026",
            readTime: "25 min read",
            author: "Blessing Ay",
            imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
            videoUrl: "https://www.youtube.com/embed/Ba78C7_xxp4",
            previewText: RORO_PREVIEW_TEXT,
            expandedText: RORO_BLOG_TEXT,
            created_at: serverTimestamp(),
          });
        } catch (err) {
          console.error("Error seeding Roro blog post dynamically:", err);
        }
      }
    }, (error) => {
      console.error("Error reading customized blogs:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Inject SEO tags dynamically to <head> for Google indexers & bots (completely invisible to users)
    const existingScript = document.getElementById("roro-seo-jsonld");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.id = "roro-seo-jsonld";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "RORO — Bypassing Cameras: How Blessing Ay, Kron Script AI, and No Camera Studio Crafted 2026's Most Hypnotic Cinematic AI Masterpiece",
      "alternativeHeadline": "An In-Depth Analytical Breakdown of the 2026 AI Movie Trailer RORO by Blessing Ay",
      "genre": "Cinematic AI & Tech Editorial",
      "keywords": "RORO, RORO Movie Trailer, Kron Script AI, No Camera Studio, AuRA Tech, Blessing Ay, AI Video Generation, Robot Dog Movie, Gemini Omni, ElevenLabs, Suno, CapCut",
      "wordCount": "4150",
      "author": {
        "@type": "Person",
        "name": "Blessing Ay"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AuRA Tech"
      },
      "datePublished": "2026-08-05",
      "description": "A comprehensive analysis of the groundbreaking RORO concept trailer. Discover how Blessing Ay used Kron Script AI, Gemini Omni, ElevenLabs, Suno, and CapCut to bypass cameras, crew, and physical sets, establishing a historic milestone in photorealistic synthetic storytelling under corporate parent AuRA Tech.",
      "about": [
        {
          "@type": "Thing",
          "name": "RORO Concept Trailer"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Kron Script AI"
        },
        {
          "@type": "CreativeWork",
          "name": "No Camera Studio YouTube Channel"
        }
      ]
    });
    document.head.appendChild(script);

    // Update document title for SEO
    const originalTitle = document.title;
    document.title = "RORO — How Blessing Ay, Kron Script AI & No Camera Studio Crafted Cinematic AI | AuRA Tech Blog";

    // Set meta tags
    let metaDesc = document.querySelector('meta[name="description"]');
    let originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Discover how Blessing Ay used Gemini Omni, CapCut, Suno, ElevenLabs, and Kron Script AI to craft the beautiful, hyper-realistic RORO trailer under parent company AuRA Tech.");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "RORO Movie Trailer, Kron Script AI, No Camera Studio, Cinematic AI, AuRA Tech, Blessing Ay, Gemini Omni, ElevenLabs, Suno, CapCut, AI Video Generation, Robot Dog Movie");

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById("roro-seo-jsonld");
      if (scriptToRemove) scriptToRemove.remove();
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      } else if (metaDesc) {
        metaDesc.remove();
      }
      if (metaKeywords) {
        metaKeywords.remove();
      }
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-grow pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Accent Gradients */}
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-indigo-500/2 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10 text-left">
          {/* Back button */}
          <div className="flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 hover:border-primary/35 hover:bg-primary/5 text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" /> BACK TO HOME
            </Link>
          </div>

          {/* Section Header */}
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-mono font-bold">
              PUBLICATIONS & ARCHIVE
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground">
              NEWS & <span className="text-primary">BLOG ARCHIVES</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl font-sans leading-relaxed">
              Explore custom editorials and breaking platform news directly from the AuRa Tech executive panel.
            </p>
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
              <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Loading publications database...</span>
            </div>
          ) : blogs.length === 0 ? (
            /* Empty State matching design constraints with exact request message */
            <div className="py-20 md:py-32 text-center flex flex-col items-center justify-center gap-6 glass-card border border-border/60 rounded-[2.5rem] bg-card/20 p-8 max-w-2xl mx-auto shadow-sm">
              <div className="h-16 w-16 rounded-2xl bg-muted/40 border border-border flex items-center justify-center text-muted-foreground">
                <BookOpen className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-display font-bold uppercase tracking-tight text-foreground">
                  Awaiting New Stream
                </h3>
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  Waiting for blogs to be published
                </p>
              </div>
              <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                When the administration posts news from the Level 5 Control Room, articles will dynamically populate right here in real-time.
              </p>
            </div>
          ) : (
            /* Blogs List layout matching main design */
            <div className="space-y-12">
              {blogs.map((post) => {
                const isExpanded = expandedId === post.id;
                return (
                  <motion.article
                    key={post.id}
                    layout="position"
                    className="glass-card border border-border/80 rounded-[2.5rem] bg-card/60 overflow-hidden group transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-black/5"
                  >
                    {/* Header Image or Full Playable Video Cover */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-black">
                      {post.videoUrl ? (
                        <iframe
                          src={post.videoUrl}
                          title={post.title}
                          className="w-full h-full border-0 absolute inset-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <>
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                        </>
                      )}
                      <div className="absolute top-6 left-6 z-10">
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-black/80 backdrop-blur-md text-primary border border-primary/30 px-3 py-1.5 rounded-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 md:p-12 space-y-6">
                      {/* Meta Tags & Title */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-primary" />
                            <span>{post.author}</span>
                          </div>
                        </div>

                        <h3 className="text-xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>
                      </div>

                      {/* Public Preview Text */}
                      <div className="text-sm md:text-base text-muted-foreground/90 font-sans leading-relaxed max-w-4xl">
                        <p>{post.previewText}</p>
                      </div>

                      {/* Expandable Section */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="text-sm md:text-base text-muted-foreground/90 font-sans leading-relaxed pt-6 border-t border-dashed border-border/60 mt-6 markdown-body text-left">
                              <ReactMarkdown>{post.expandedText || ""}</ReactMarkdown>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Interactive Trigger Button */}
                      <div className="pt-4 flex justify-start">
                        <button
                          onClick={() => toggleExpand(post.id)}
                          className="px-6 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-mono font-bold text-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="h-4 w-4 animate-bounce" />
                            </>
                          ) : (
                            <>
                              Read Full Story <ChevronDown className="h-4 w-4 animate-bounce" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
