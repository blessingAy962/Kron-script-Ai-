import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, User, BookOpen, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { db, collection, onSnapshot, doc, setDoc, serverTimestamp } from "@/src/lib/firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RORO_PREVIEW_TEXT, RORO_BLOG_TEXT } from "../data/roroBlogText";
import { PROMPTS_PREVIEW_TEXT } from "../data/promptsBlogText";
import InteractivePromptsViewer from "../components/InteractivePromptsViewer";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeBlogId = searchParams.get("id");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs in real-time from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blogs"), async (snapshot) => {
      const list: BlogPost[] = [];
      let roroPostExistsAndCorrect = false;
      let promptsPostExistsAndCorrect = false;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (docSnap.id === "roro-concept-trailer" && data.title && data.title.includes("Blessing Ay")) {
          roroPostExistsAndCorrect = true;
        }
        if (docSnap.id === "daily-realistic-prompts" && data.title && data.title.includes("Daily Realistic Prompt") && data.imageUrl === "https://lh3.googleusercontent.com/d/1ZGOBJtKYTXHHLLXIIiNr0bSgDtswOUJI") {
          promptsPostExistsAndCorrect = true;
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

      setBlogs(list);
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

      // Programmatic seeding of the Daily Realistic Prompts series blog post if missing or outdated
      if (!promptsPostExistsAndCorrect) {
        try {
          await setDoc(doc(db, "blogs", "daily-realistic-prompts"), {
            id: "daily-realistic-prompts",
            category: "AI PROMPT DESIGN",
            title: "Kron Script AI Daily Realistic Prompt Series: 10 Everyday Products Photorealism Blueprint",
            date: "August 14, 2026",
            readTime: "15 min read",
            author: "Kron Script AI Editorial Board",
            imageUrl: "https://lh3.googleusercontent.com/d/1ZGOBJtKYTXHHLLXIIiNr0bSgDtswOUJI",
            previewText: PROMPTS_PREVIEW_TEXT,
            expandedText: "INTERACTIVE",
            created_at: serverTimestamp(),
          });
        } catch (err) {
          console.error("Error seeding prompts blog post dynamically:", err);
        }
      }
    }, (error) => {
      console.error("Error reading customized blogs:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const activeBlog = blogs.find((b) => b.id === activeBlogId);

  // Dynamic SEO and meta details
  useEffect(() => {
    // Scroll to top on navigation or article select
    window.scrollTo({ top: 0, behavior: "smooth" });

    const existingScript = document.getElementById("roro-seo-jsonld");
    if (existingScript) existingScript.remove();

    if (activeBlog) {
      // Inject Dynamic Article-level Schema
      const script = document.createElement("script");
      script.id = "roro-seo-jsonld";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": activeBlog.title,
        "genre": "Cinematic AI & Tech Editorial",
        "keywords": `Kron Script AI, AuRA Tech, Blessing Ay, AI Video, ${activeBlog.category}`,
        "author": {
          "@type": "Person",
          "name": activeBlog.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "AuRA Tech"
        },
        "datePublished": activeBlog.date,
        "description": activeBlog.previewText.slice(0, 200),
      });
      document.head.appendChild(script);

      // Update Title & Meta Description dynamically
      document.title = `${activeBlog.title} | Kron Script AI`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", activeBlog.previewText.slice(0, 160));
      }
    } else {
      // General Directory Schema
      const script = document.createElement("script");
      script.id = "roro-seo-jsonld";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Kron Script AI News & Blogs",
        "description": "Unlock premium guides, deep neuroscience insights, and cinematic formulas crafted by No Camera Studio.",
      });
      document.head.appendChild(script);

      document.title = "News & Blog Archives | Kron Script AI";

      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "Explore custom editorials, tutorials, and breaking platform news directly from the AuRa Tech executive panel.");
      }
    }

    return () => {
      const scriptToRemove = document.getElementById("roro-seo-jsonld");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [activeBlog, loading]);

  // Featured article (first in list) and the rest
  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const secondaryBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-grow pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-indigo-500/2 rounded-full blur-[140px] pointer-events-none" />

        {/* =========================================================================
            STATE 1: Dedicated Article Reading View
            ========================================================================= */}
        {activeBlog ? (
          <div className="max-w-4xl mx-auto relative z-10 text-left">
            {/* Back to Blog Listing */}
            <button
              onClick={() => setSearchParams({})}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 bg-card/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer mb-10"
            >
              <ArrowLeft className="h-4 w-4 animate-pulse" /> BACK TO NEWS & ARTICLES
            </button>

            {/* Editorial Header */}
            <article className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg inline-block">
                  {activeBlog.category}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-foreground leading-[1.1] selection:bg-primary/30">
                  {activeBlog.title}
                </h1>
              </div>

              {/* Author and Date metadata */}
              <div className="flex items-center gap-4 py-6 border-y border-border/50">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white font-mono text-sm font-black shadow-lg shadow-primary/10">
                  {activeBlog.author ? activeBlog.author.split(" ").map(n => n[0]).join("") : "AT"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{activeBlog.author}</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono mt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {activeBlog.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {activeBlog.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Media and Content rendering */}
              {activeBlog.id === "daily-realistic-prompts" ? (
                <InteractivePromptsViewer />
              ) : (
                <>
                  {activeBlog.videoUrl ? (
                    <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden border border-border/80 bg-black shadow-2xl mb-12">
                      <iframe
                        src={activeBlog.videoUrl}
                        title={activeBlog.title}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[21/9] w-full rounded-[2rem] overflow-hidden border border-border/80 bg-black shadow-2xl mb-12">
                      <img
                        src={activeBlog.imageUrl}
                        alt={activeBlog.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Full Article Markdown Content with professional spacing & custom prose styling */}
                  <div className="max-w-3xl mx-auto">
                    <div className="text-base md:text-lg text-muted-foreground/90 font-sans leading-relaxed space-y-6 markdown-body text-left selection:bg-primary/20">
                      <ReactMarkdown>{activeBlog.expandedText || activeBlog.previewText || ""}</ReactMarkdown>
                    </div>
                  </div>
                </>
              )}
            </article>

            {/* Related Stories/Footer Recommendation inside Article Reading page */}
            {blogs.length > 1 && (
              <div className="border-t border-border/50 pt-16 mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest text-muted-foreground">
                    Continue Reading
                  </h3>
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-xs font-mono font-bold text-primary hover:underline"
                  >
                    All articles &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogs
                    .filter((b) => b.id !== activeBlog.id)
                    .slice(0, 2)
                    .map((related) => (
                      <div
                        key={related.id}
                        onClick={() => setSearchParams({ id: related.id })}
                        className="group p-6 rounded-[2rem] border border-border/60 bg-card/30 hover:bg-card/75 hover:border-primary/20 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className="aspect-[16/10] rounded-xl overflow-hidden bg-zinc-950 border border-border/40">
                            <img
                              src={related.imageUrl}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2">
                            <span className="text-[9px] font-mono font-bold text-primary tracking-wider uppercase">
                              {related.category}
                            </span>
                            <h4 className="text-base font-bold text-foreground font-display uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                              {related.title}
                            </h4>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 font-mono">
                          {related.readTime} &bull; Read Story
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              STATE 2: Premium Wide Editorial Blog Listing
              ========================================================================= */
          <div className="max-w-7xl mx-auto space-y-16 relative z-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-border/40 pb-10">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-mono font-bold">
                  PUBLICATIONS & ARCHIVE
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-foreground">
                  NEWS & <span className="text-primary">BLOG ARCHIVES</span>
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground max-w-xl font-sans leading-relaxed">
                  Explore custom editorials and breaking platform news directly from the AuRa Tech executive panel.
                </p>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/80 hover:border-primary/35 hover:bg-primary/5 text-xs font-mono font-bold text-muted-foreground hover:text-primary transition-all duration-300 max-w-max"
              >
                <ArrowLeft className="h-4 w-4" /> BACK TO HOME
              </Link>
            </div>

            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
                <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  Loading publications database...
                </span>
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
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed text-center">
                    Waiting for blogs to be published
                  </p>
                </div>
                <p className="text-xs text-zinc-500 max-w-sm leading-relaxed text-center">
                  When the administration posts news from the Level 5 Control Room, articles will dynamically populate right here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* 1. HERO FEATURED ARTICLE (Full Width Modern Layout) */}
                {featuredBlog && (
                  <div className="glass-card border border-border/80 rounded-[2.5rem] bg-card/60 overflow-hidden group transition-all hover:border-primary/20 hover:shadow-2xl hover:shadow-black/10 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Featured Image */}
                      <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[460px] overflow-hidden bg-black border-b lg:border-b-0 lg:border-r border-border/60">
                        <img
                          src={featuredBlog.imageUrl}
                          alt={featuredBlog.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                        <div className="absolute top-6 left-6 z-10">
                          <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-primary text-primary-foreground border border-primary/30 px-3.5 py-2 rounded-xl">
                            FEATURED STORY
                          </span>
                        </div>
                      </div>

                      {/* Featured Details */}
                      <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
                        <div className="space-y-6">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                            {featuredBlog.category}
                          </span>
                          <h2 className="text-2xl md:text-3xl xl:text-4xl font-display font-black uppercase tracking-tight text-foreground leading-[1.15] group-hover:text-primary transition-colors">
                            {featuredBlog.title}
                          </h2>
                          <p className="text-xs md:text-sm text-muted-foreground/90 font-sans leading-relaxed line-clamp-4">
                            {featuredBlog.previewText}
                          </p>
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground font-mono">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary" /> {featuredBlog.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-primary" /> {featuredBlog.readTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-primary" /> {featuredBlog.author}
                            </span>
                          </div>
                        </div>

                        <div className="pt-8">
                          <button
                            onClick={() => setSearchParams({ id: featuredBlog.id })}
                            className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 max-w-max shadow-lg shadow-primary/20 cursor-pointer hover:shadow-primary/30"
                          >
                            Read Full Article <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SECONDARY ARTICLES (spacious 2/3 column layout) */}
                {secondaryBlogs.length > 0 && (
                  <div className="space-y-8 text-left">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xs font-mono font-black uppercase tracking-widest text-muted-foreground">
                        Latest Publications
                      </h3>
                      <div className="h-px bg-border/40 flex-grow" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {secondaryBlogs.map((post) => (
                        <article
                          key={post.id}
                          onClick={() => setSearchParams({ id: post.id })}
                          className="glass-card border border-border/80 rounded-[2rem] bg-card/60 overflow-hidden group transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {/* Card Image Cover */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60 bg-black">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              <div className="absolute top-4 left-4 z-10">
                                <span className="text-[8px] font-mono font-bold uppercase tracking-widest bg-black/80 backdrop-blur-md text-primary border border-primary/20 px-2.5 py-1 rounded-md">
                                  {post.category}
                                </span>
                              </div>
                            </div>

                            {/* Info Block */}
                            <div className="p-6 md:p-8 space-y-4">
                              <h4 className="text-lg font-display font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                {post.title}
                              </h4>
                              <p className="text-xs md:text-sm text-muted-foreground/90 font-sans leading-relaxed line-clamp-3">
                                {post.previewText}
                              </p>
                            </div>
                          </div>

                          {/* Footer Meta Details */}
                          <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2 border-t border-border/40 flex flex-col gap-4">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-primary" /> {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-primary" /> {post.readTime}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchParams({ id: post.id });
                              }}
                              className="w-full text-center py-3 rounded-xl border border-border/80 bg-card/10 hover:border-primary/40 hover:bg-primary/5 text-xs font-mono font-bold text-foreground hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              Explore Article <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
