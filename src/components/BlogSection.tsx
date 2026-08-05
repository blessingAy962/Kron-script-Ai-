import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, ChevronDown, ChevronUp, BookOpen, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { db, doc, setDoc, serverTimestamp, collection, onSnapshot } from "@/src/lib/firebase";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  previewText: React.ReactNode;
  expandedText: React.ReactNode;
  isCustom?: boolean;
  videoUrl?: string;
}

const SEED_BLOGS = [
  {
    id: "africa-ai-lab",
    category: "TECH FUTURES",
    title: "Google’s Africa Applied AI Lab is Hunting for Unicorns (Here is How Creators Can Apply)",
    date: "July 8, 2026",
    readTime: "15 min read",
    author: "AuRa Tech Team",
    imageUrl: "https://lh3.googleusercontent.com/d/1BBxqvBMl-7dHN9YNA9rpY1ZmnJuSnb1E",
    previewText: "Africa is no longer just consuming global technology; we are building it. For digital creators, founders, and developers across the continent, the barrier to entry for building world-class artificial intelligence has always been access. Access to massive computing power, access to elite technical mentorship, and access to capital.\n\nThat barrier just collapsed.\n\nApplications are officially open for the 2026 Google Africa Applied AI Lab, a massive initiative built to propel Africa’s elite AI entrepreneurs and researchers. Announced on July 1, 2026, in Johannesburg, this zero-to-one commercialization platform is designed to bridge the gap between world-class foundational research and market-ready products. The initiative aims to help founders build AI solutions for real-world challenges across sectors, strengthening Africa's position in the global AI economy. It pairs an elite cohort of African founders and researchers directly with Google experts, jointly building AI solutions.\n\nIf you are a creator building the future of media, a developer optimizing software, or a founder solving uniquely African challenges, this is the exact room you need to be in. The Google Africa Applied AI Lab focuses on joint development of AI products and services meant to address critical gaps and challenges across the continent. Rapid prototyping will occur across five distinct technological futures, all of which will reshape Africa in the coming years: the future of work, knowledge, software development, creativity, and entertainment.\n\nBut what actually happens if you get selected?\n\nIt is not just a standard incubator. Selected startups receive early access to cutting-edge models from Google DeepMind (such as Gemini, Gemma, and Veo) to experiment with commercial use cases, before the models are released to the general market. This means while the rest of the world is waiting for the next big AI update, you are already building commercial use cases with it. Additionally, teams receive hands-on technical mentorship and go-to-market support from Google Research, other Google teams globally, and VCs including 4DX Ventures, Norrsken22, Novastar Ventures, and Ventures Platform. Some participants may also be eligible for funding from Google AI Futures Fund and these leading VCs. Below, we dive deep into the full 3000-word strategy to position your application for maximum success.",
    expandedText: "## The Ultimate Application Strategy: Building Africa's First AI Unicorns\n\nWelcome to the full, comprehensive strategy breakdown for the Google Africa Applied AI Lab. This program represents a monumental turning point in the continent's technology timeline. The ultimate goal of this program is helping to build Africa's very first generation of AI-native unicorn startups. If you are serious about getting into this lab, let’s look at the exact parameters, technological frameworks, and strategic positioning you need to master before the submission deadline.\n\n### 1. The Official Portal & Crucial Deadlines\n\nFirst things first, the application window is live right now. Applications open on July 1, 2026, and close on August 31, 2026. The initial co-development period runs from mid-September to early December, culminating in a demo day. You can submit your project directly through the official portal at: **labs.google/aifuturesfund/africaailab**.\n\nBecause the initial cohort is highly exclusive—expected to select only a small handful of innovators—it pays to submit your application early. Early submissions give the tracking teams more time to review your baseline infrastructure and schedule preliminary technical calls. Waiting until the absolute last minute on August 31 could mean your proposal gets buried under a mountain of last-minute entries. Focus on a clean, robust MVP demonstration and submit as soon as your core parameters are set.\n\n### 2. The Accra Advantage: A New Tech Epicenter\n\nThe program is based at the Accra AI Community Centre (AICC) in Ghana. Over the years, Accra has gradually developed a stronger position in AI research, with Google having opened its first African AI research centre there in 2019. This lab moves the focus closer to commercial product development.\n\nThe continent needs more companies that can identify local problems, develop products around those problems, and scale beyond small pilot programmes. While the cohort is drawn from across Africa and there is no requirement to be in-person at AICC throughout the co-development period, the program culminates in an in-person demo day in Accra. By basing the initiative in Ghana, Google is anchoring the future of African AI in a mature, collaborative research environment that fosters genuine cross-border engineering partnerships.\n\n### 3. Positioning Your AI Product for the 5 Futures\n\nGoogle is not looking for basic chatbot wrappers or surface-level API integrations. Participants are expected to use Google's AI models in a materially impactful way for the proposed product. You must align your product architecture with one of their five core pillars:\n\n*   **The Future of Creativity and Entertainment:** For platforms streamlining digital media production, script generation, and cinematic workflows. You need to demonstrate how models like DeepMind's Veo or Imagen 3 can fundamentally alter production workflows, lower costs, or optimize content delivery for African stories. Creators are using this to build localized animation assets, automated high-fidelity localized audio dubbing, and AI-assisted cinematic pre-visualizations.\n*   **The Future of Software Development:** For tools accelerating how local tech is built. This includes intelligent developer co-pilots fine-tuned for offline-first coding environments, low-bandwidth compilation managers, and AI systems designed to automatically translate legacy administrative software into highly optimized, modern React or Node.js frameworks.\n*   **The Future of Work:** Revolutionizing productivity and professional environments across Africa. Think localized speech-to-text systems that fluidly support indigenous regional languages (such as Swahili, Yoruba, Amharic, and Zulu) in high-stakes legal or financial documentation, automated micro-invoice auditing, and predictive supply chain management for localized informal markets.\n*   **The Future of Knowledge:** Enhancing access to structured information, learning databases, and agricultural intelligence. Startups are building smart crop-disease diagnostic tools powered by vision models, highly personalized local language curriculum tutors, and responsive community health diagnostic assistants capable of operating with zero continuous internet connectivity.\n*   **The Future of Immersive Systems:** Expanding spatial compute, localized interactive simulation engines, real-time logistics mapping, and adaptive digital twin systems designed for African city planners and logistics hubs to maximize throughput and cut down gridlock.\n\n### 4. The Heavyweight Venture Capital Partners\n\nBuilding advanced AI development may require expensive computing resources, access to high-quality data, specialist engineering talent, and continued model evaluation. That is why the lab has partnered with global financial heavyweights. Google has partnered with 4DX Ventures, Norrsken22, Novastar Ventures, and Ventures Platform along with Google AI Futures Fund to provide selected teams an opportunity to receive mentorship, guidance, and potential funding.\n\nNovastar Ventures, a Nairobi-headquartered investor, views this partnership as reflecting growing confidence that Africa is becoming an important market for practical AI innovation rather than simply a consumer of global technology. The involvement of these tier-one venture firms ensures that the technology built during this program isn't just an academic exercise—it is positioned to capture massive commercial market share and attract venture backing at the global scale.\n\n### 5. Who Is Eligible to Apply?\n\nThe program is seeking current full-time founders and/or top researchers who are looking to become startup founders. While preference is given to startups with funding and commercial traction (pre-seed to series A), they consider all founders and researchers with great ideas and a strong plan for how to build them. The program is actually open to all stages through Series C+. You do not need to be a massive enterprise to win a spot; you just need a resilient system that solves a real problem.\n\nIf you are an academic researcher with a groundbreaking paper on machine learning optimization or a solo developer who has built an organic user base with a lightweight AI tool, you are highly encouraged to apply. The criteria for selection focus strictly on technical depth, execution speed, and the potential to scale your solution to millions of citizens across the continent.\n\n### 6. The Demo Day: Your Ultimate Pitch\n\nIn addition to using Google AI in some material way, startups are asked to commit to participating in an in-person product demo day in early December at the Accra AI Community Centre in Ghana. The program will culminate in a demo day, where startups will present their work from their time in the program to Googlers, top investors, and partners, where they will have the opportunity to receive potential funding and further support.\n\nThe best part for early-stage founders? Teams are not giving up equity or ownership stake by simply participating in the program, though they may be approached with opportunities by Google AI Futures Fund or our VC partners. You retain full control of your intellectual property. This is a rare, pure acceleration opportunity that lets you scale without early dilution.\n\n### 7. Deep Technical Integration: Beyond the Wrapper\n\nTo stand out to the Google Engineering Review board, your application must detail how you intend to utilize Google’s foundational AI. Instead of just querying standard public APIs, you should demonstrate an understanding of downstream optimization. For example, explain how you will use Parameter-Efficient Fine-Tuning (PEFT) or Low-Rank Adaptation (LoRA) to adapt Gemini or Gemma models for local dialects or specific domain vocabularies.\n\nFurthermore, discuss how your solution tackles the infrastructure constraints common in many African regions. Solutions that leverage edge-AI, local model caching, and optimized quantization (e.g., 4-bit integer quantization of Gemma models running locally on mobile devices) will score exceptionally high. Show that your product can survive and deliver value even when the user experiences intermittent network dropouts.\n\n### 8. Detailed Application Roadmap and Checklist\n\nTo help you prepare your submission, here is a practical checklist based on successful applications to Google AI initiatives worldwide:\n\n1.  **Architectural Diagram:** Upload a clear, simplified system architecture illustrating how Google AI models (Gemini/Gemma/Veo) interface with your product database and end-user client.\n2.  **Local Dataset Strategy:** Detail how you source, clean, and protect your unique local datasets. Explain your data consent practices and how you ensure regional diversity in training data.\n3.  **Commercial Viability Plan:** Provide a realistic financial projection showing how the product achieves unit-level profitability within 18 months, highlighting how AI keeps your operating costs low.\n4.  **Team Composition:** Highlight the engineering capacity of your founding team. Mention any machine learning experience, full-stack capability, or deep industry-specific expertise in your target market.\n\n### 9. The Macroeconomic Impact of African AI\n\nWhen Google Research established its Accra center in 2019, it was a bet on the raw academic potential of African computer scientists. Seven years later, in 2026, that bet is paying dividends. Applied AI has the potential to add over $1.3 trillion to Africa's GDP by 2030 if fully harnessed. By focusing on practical, sector-specific application rather than theoretical model training, local founders can bypass decades of legacy industrial hurdles. This is the leapfrog moment—similar to how mobile money bypassed traditional credit card networks across East Africa, AI-native platforms will revolutionize legal, educational, and creative service distribution.\n\n### 10. Execution is Everything\n\nWe are stepping boldly into the age of artificial intelligence. The launch of this lab comes as global technology companies increase their investment in Africa's AI ecosystem. If you are building tools that allow African creators to tell locally rooted stories in new ways, or systems that automate complex workflows, the infrastructure is now available. Lock in your pitch deck, ensure your data pipelines are clean, and get your application submitted before the August 31 window closes."
  },
  {
    id: "neuroscience-pacing",
    category: "CREATIVE SCIENCE",
    title: "The Neuroscience of the First 3 Seconds: How to Edit for Viral Retention",
    date: "July 5, 2026",
    readTime: "10 min read",
    author: "AuRa Tech Team",
    imageUrl: "https://lh3.googleusercontent.com/d/1CdadpYPRT96-U19virLcErfWJ2SuzarL",
    previewText: "The modern human attention span is shorter than that of a goldfish. While that might sound like a tired marketing cliché, in 2026, it is a hard mathematical reality. For content creators on TikTok, Instagram Reels, and YouTube Shorts, the game is won or lost in the first three seconds. If you fail to trigger a dopamine spike immediately, the viewer's thumb will swipe up, and the platform’s algorithm will instantly mark your video as low-engagement.\n\nBut retention isn't just about loud jump scares or flashy graphics. It's about cognitive science.\n\nAccording to recent neuroscience studies, the human brain processes visual cues in under 13 milliseconds. To capture this subconscious attention, creators must master three core triggers: visual pattern interrupts, sonic anchors, and curiosity loops. By understanding how the brain categorizes incoming stimuli, you can design openings that physically prevent the user from scrolling away. Let's explore how elite creators use these principles to achieve 80%+ retention on their high-performing shorts.",
    expandedText: "## Engineering Unstoppable Stopping Power: The Science of High-Retention Video Editing\n\nWelcome to the ultimate guide on short-form video optimization. When we talk about viral videos in 2026, we are looking at a battleground defined by microseconds. It is no longer enough to have decent lighting or clear audio; you must understand the neural mechanics of the viewer's brain. In this 2000-word comprehensive breakdown, we will examine the exact psychological triggers, audio-visual editing patterns, and pacing models required to bypass conscious filtering and lock in viewer engagement.\n\n### 1. The Neurobiology of the Feed: Dopamine & Amygdala Hijack\n\nTo understand why a user swipes, we have to look at the brain's reward pathway—specifically, the mesolimbic dopamine system. Doomscrolling is essentially a search behavior. The user is hunting for a novel stimulus that triggers a burst of dopamine. When they swipe to a new video, the brain makes an instantaneous cost-benefit calculation. Does this look interesting? Will it make me laugh? Will it teach me something?\n\nThis decision is made in the amygdala and prefrontal cortex before the viewer is even consciously aware of what the video is about. If the first 100 milliseconds fail to signal high utility, high novelty, or immediate emotional resonance, the motor cortex is activated to swipe up. We call this the 'Instant Reject Reflex.' To overcome it, we must engineer a physical pattern interrupt.\n\n### 2. Visual Pattern Interrupts: Overcoming Cognitive Habituation\n\nHabituation is the brain's way of conserving energy by ignoring repetitive, predictable stimuli. If your video starts with a person sitting at a desk talking directly to a camera with a standard background, the brain instantly habituates. It has seen this visual template millions of times. It registers as zero-novelty and commands a swipe.\n\nTo break this cognitive habituation, you must insert an unexpected element in the absolute first frame:\n\n*   **Extreme Scale Changes:** Start with an extreme close-up of an object or an abstract macro shot, then quickly zoom out. This forces the brain to actively figure out what it is looking at, creating a micro-second delay that halts the swipe.\n*   **Chromatic Shifts:** Use a sudden black-and-white to color transition, high-contrast grading, or a flash of a solid primary color to over-stimulate the optic nerve and seize immediate attention.\n*   **Kinetic Incongruity:** Start with physical movement already in progress. Never start from static rest. Throw an item towards the lens, slide into the frame, or fall backward. Physical motion triggers the brain's motion-sensitive MT/V5 visual cortex area, forcing the eyes to track the subject.\n\n### 3. Sonic Anchors: Auditory Subliminal Priming\n\nDid you know that auditory signals reach the brain's temporal lobe faster than visual signals reach the occipital lobe? Sound is processed in approximately 10 milliseconds, while sight takes closer to 30 milliseconds. This means the viewer actually 'hears' your video before they truly see it.\n\nA fatal mistake made by amateur editors is leaving a silent gap of even 100 milliseconds at the start of their video. You must anchor the audio immediately. Introduce a sharp, texture-rich sound effect (SFX) at 0:00. High-frequency or highly tactile sounds work best: a crisp paper rip, a heavy metallic lock click, a physical match strike, or a deep sub-bass drop. This acts as a physical wake-up call, immediately priming the sensory cortex to focus on the incoming narrative.\n\n### 4. Curiosity Loops: The Zeigarnik Effect in Short-Form Editing\n\nOnce you've stopped the physical swipe with pattern interrupts and sonic anchors, you have about 1.5 seconds to build a bridge to the rest of the video. This is where you open a 'Curiosity Loop'—a psychological phenomenon where the brain experiences cognitive tension when presented with incomplete information (the Zeigarnik Effect).\n\nAn open story loop creates an immediate desire for resolution. Do not explain what your video is about or introduce yourself. Start mid-consequence. For example:\n\n> \"I spent 60 days analyzing why this exact subtitle font increased my video retention by 35%... and the secret comes down to a simple psychological color trick.\"\n\nBy stating the outcome (35% increase) and pointing to a hidden variable (a psychological color trick), you create an information gap. The human brain hates incomplete loops; it will actively stay tuned just to close the circle and receive the cognitive reward of knowing the answer.\n\n### 5. The Math of Pacing: The '2-Second Cut' Fallacy\n\nThere is a popular myth in the creator community that you must cut every 2 seconds to keep attention. In reality, predictable fast-pacing is just as habituating as slow-pacing. If your visual cuts occur at perfect, rhythmic 2-second intervals, the brain adapts to the rhythm, becomes bored, and swipes away.\n\nThe secret is **dynamic pacing syncopation**. You want to vary your cut intervals to mimic a natural musical beat. Have a fast sequence of cuts (0.5s, 0.8s, 0.4s) followed immediately by a longer, high-intensity visual shot (3.5s) where the subject explains a key concept. This constant contraction and expansion of visual time-density keeps the brain in a state of active anticipation.\n\n### 6. Captions, Typography, & Spatial Safe Zones\n\nUp to 80% of short-form videos on social platforms are consumed on mute, particularly in public spaces. If you do not have word-for-word, high-visibility, kinetic captions, your video is functionally invisible to a vast majority of the audience.\n\nBut subtitle placement is a precise art. Social media apps overlay user interface elements (like buttons, usernames, descriptions, and sound tracks) along the bottom, right, and top edges of the screen. This leaves a narrow center safe zone. Ensure all your captions are centered vertically and horizontally within the middle third of the screen. Keep text chunks to no more than 2-3 words per frame. Large paragraphs of text require cognitive effort to read; kinetic, single-word or dual-word pop-ups require zero effort, flowing naturally into the viewer's subconscious.\n\n### 7. Pacing Audit Checklist: The High-Performance Visual Audit\n\n#### KINETIC RETENTION QUALITY GATE:\n\n1.  **Frame 0:00 Anchor:** Verify that there is zero silent space. A high-contrast visual interrupt must align perfectly with a crisp tactile sound effect.\n2.  **The 3-Second Loop Check:** Ensure that by the third second, a clear narrative stake or question has been raised. The viewer must understand what they stand to gain or learn.\n3.  **Visual Scale Variation:** Audit your timeline. Do you cycle fluidly between extreme close-ups, medium shots, and graphic B-roll overlays? Avoid staying on a single focal distance for more than 4 seconds.\n4.  **Text Contrast & Speed:** Captions must contrast sharply against the background (utilize thick dark shadows or solid text-backing blocks) and should update dynamically to match the exact tempo of your speech.\n\n### 8. Leveraging AI Pacing Tools for Scalable Editing\n\nAnalyzing these micro-metrics manually for every single piece of content is exhausting and slow. This is where advanced AI models like those built into AuRa Tech platforms change the game. By running your raw edits through automatic pacing audit scripts, the AI can map your auditory peaks, detect visual dead-zones where no scale shifts occur, and instantly overlay safe-zone compliant kinetic subtitles.\n\nLet the machine handle the tedious structural alignment of your timelines, so you can focus on writing high-density scripts, staging creative hooks, and delivering elite-tier concepts to your audience."
  },
  {
    id: "prompt-engineering",
    category: "PROMPT ENGINEERING",
    title: "From Text Prompt to Box Office: Mastering Cinematic Prompt Engineering in 2026",
    date: "July 2, 2026",
    readTime: "5 min read",
    author: "AuRa Tech Team",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
    previewText: "The line between indie filmmakers and major studios has officially dissolved. With the release of advanced video generation models like Google Veo and Runway Gen-3, anyone with a laptop can produce cinematic-grade visuals that would have cost millions just five years ago. However, the difference between 'AI-looking slop' and a masterpiece lies entirely in your prompt engineering.\n\nWriting a prompt is no longer about throwing keywords like 'hyperrealistic' or '8k' at a model. It requires the language of a real director, director of photography (DP), and gaffer.\n\nTo build high-density storyboards that tell a cohesive emotional story, you must learn to communicate with AI using lighting coordinates, camera lens profiles, camera movement vectors, and film stock specifications. If you tell a model to generate 'a futuristic city,' you will get a generic, saturated cyberpunk rendering. But if you tell it to capture 'an anamorphic 35mm wide-angle tracking shot of Neo-Accra during golden hour,' the model will respond with depth, cinematic texture, and realistic lighting.",
    expandedText: "## The Director's Prompting Guidebook\n\n### 1. The Lens and Aspect Ratio Formula\n\nAlways specify the camera lens type. Anamorphic lenses create beautiful horizontal flares and a unique oval bokeh that instantly feels like a movie. Standard lenses like a 50mm prime offer realistic depth of field. For example, specify: `--ar 16:9` or `--ar 2.39:1` for that classic widescreen aspect ratio.\n\n### 2. Lighting and Mood Coordinates\n\nInstead of saying 'nice lighting,' specify the source and style. Use terms like 'high-key studio lighting,' 'chiaroscuro,' 'dramatic Rembrandt lighting,' or 'ambient twilight neon.' Mention the time of day and atmospheric conditions: 'misty morning haze, soft volumetric rays filtering through redwood trees.'\n\n### 3. Camera Movement Vectors\n\nStatic shots look robotic. Guide the camera's path: 'crane shot rising slowly,' 'low-angle tracking shot following the character,' or 'dynamic pan-left showing scale.' This adds kinetic energy and depth of field shifts that make the final video clip feel alive.\n\n### 4. Film Grain and Emulation\n\nTo avoid the glossy, plasticky texture typical of AI renders, prompt for realistic film stock. Mention 'Kodiak Portra 400 texture,' 'cinematic film grain,' or 'subtle motion blur.' This introduces micro-noise that tricks the brain into seeing real physical photography.\n\nBy mastering this cinematic syntax, your AI-generated assets will look hand-crafted, scalable, and of elite startup quality."
  }
];

export function BlogSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customBlogs, setCustomBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "blogs"), async (snapshot) => {
      // If collection is empty, trigger seeding of default blogs
      if (snapshot.empty) {
        setLoading(true);
        try {
          for (const blog of SEED_BLOGS) {
            await setDoc(doc(db, "blogs", blog.id), {
              ...blog,
              created_at: serverTimestamp()
            });
          }
        } catch (err) {
          console.error("Error seeding initial blogs:", err);
        }
        return;
      }

      const list: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          category: data.category || "TECH FUTURES",
          title: data.title || "",
          date: data.date || "",
          readTime: data.readTime || "",
          author: data.author || "",
          imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
          videoUrl: data.videoUrl || "",
          previewText: (
            <div className="space-y-4 markdown-body text-left">
              <ReactMarkdown>{data.previewText || ""}</ReactMarkdown>
            </div>
          ),
          expandedText: (
            <div className="space-y-6 pt-6 border-t border-dashed border-border/60 mt-6 markdown-body text-left">
              <ReactMarkdown>{data.expandedText || ""}</ReactMarkdown>
            </div>
          ),
          isCustom: true
        });
      });
      setCustomBlogs(list);
      setLoading(false);
    }, (error) => {
      console.error("Error reading blogs:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const allBlogPosts = customBlogs;

  return (
    <section id="blog" className="py-24 px-6 relative overflow-hidden bg-background scroll-mt-24">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-indigo-500/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-mono font-bold">
            AURA TECH JOURNAL & INSIGHTS
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-foreground">
            TRENDING <span className="text-primary">AI STORIES</span>
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto font-sans leading-relaxed">
            Stay ahead of the curve. Elite industry breakdowns, viral pacing science, and advanced video AI prompt formulas carefully curated by AuRa Tech.
          </p>
        </div>

        {/* Blog Post List */}
        <div className="space-y-12">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
              <span className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Loading active AuRa tech journal...</span>
            </div>
          ) : allBlogPosts.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-xs font-mono">
              Awaiting editorial publications...
            </div>
          ) : (
            allBlogPosts.map((post) => {
              const isExpanded = expandedId === post.id;
              return (
                <motion.article 
                  key={post.id}
                  layout="position"
                  className="glass-card border border-border/80 rounded-[2.5rem] bg-card/60 overflow-hidden group transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-black/5 text-left"
                >
                {/* Header Image or Playable Video Cover */}
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
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
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
                  <div className="text-sm md:text-base text-muted-foreground/90 font-sans leading-relaxed space-y-4 max-w-4xl">
                    {post.previewText}
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
                        <div className="text-sm md:text-base text-muted-foreground/90 font-sans leading-relaxed space-y-4 max-w-4xl">
                          {post.expandedText}
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
          })
          )}
        </div>

        {/* View More Blogs Button */}
        <div className="pt-8 text-center flex justify-center">
          <Link
            to="/more-blogs"
            className="px-8 py-4 rounded-2xl border border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/5 hover:shadow-primary/10"
          >
            View more blogs & news <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
