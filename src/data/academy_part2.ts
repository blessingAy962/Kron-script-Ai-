import { AcademyPage } from "./academyTypes";

export const academyPart2: AcademyPage[] = [
  {
    idx: 5,
    badge: "05",
    menuLabel: "Thumbnail Psychology",
    eyebrow: "Module 05",
    title: "Thumbnail Psychology",
    subtitle: "Your thumbnail is the most consequential frame in your entire video. More people will see it than will ever watch a single second of your content. Master this, and you multiply the return on every other investment you make as a creator.",
    lessons: [
      {
        num: "5.1",
        title: "How the Human Brain Processes Thumbnails",
        body: [
          "The human brain processes visual information in approximately 13 milliseconds — 60,000 times faster than it processes text. A viewer's decision to click your thumbnail occurs before they can consciously think about it. You are not convincing their rational mind. You are triggering their nervous system.",
          "This distinction is fundamental. It means that thumbnail design is not graphic design — it is applied neuroscience. Every colour choice, compositional decision, and facial expression must be evaluated not by aesthetics but by neurological impact."
        ],
        callouts: [
          {
            type: "tip",
            title: "The Scroll-Stop Principle",
            body: "On YouTube, a viewer sees your thumbnail for an average of 0.3 seconds before deciding to engage or continue scrolling. Your thumbnail must do its entire job in less than one-third of a second."
          }
        ],
        fwBox: {
          title: "The 6 Universal Neurological Attention Triggers",
          steps: [
            { icon: "👁", text: "Face + Direct Eye Contact: The brain has a dedicated circuit for facial processing (fusiform face area). Direct eye contact creates an involuntary orienting reflex." },
            { icon: "🔴", text: "High-Contrast Colour: The retina responds more powerfully to contrast variations than to raw hues. Bright accents against deep shadow fields command spatial authority." },
            { icon: "❓", text: "Pattern Interruption: The brain filtres out the familiar — it tracks novelty. Visual paradoxes or anomalies force immediate analytical scrutiny." },
            { icon: "😱", text: "Emotional Intensity: Intense facial expressions evoke mirror neuron responses, causing viewers to subconsciously feel the emotion depicted." },
            { icon: "🔢", text: "Specific Numbers: Specific numbers (e.g., $47,382) establish analytical credibility in a pattern-hungry brain far better than rounded sums." },
            { icon: "🧩", text: "The Curiosity Gap: The Zeigarnik Effect asserts that incomplete patterns create an irresistible psychological drive to achieve mental closure." }
          ]
        }
      },
      {
        num: "5.2",
        title: "Colour Psychology for Thumbnails",
        body: [
          "Colour is direct neural communication. Choose colours systematically to guide emotions, establish platform consistency, and command notice in crowded Feeds."
        ]
      },
      {
        num: "5.3",
        title: "The Curiosity Gap — Deep Dive",
        body: [
          "A great curiosity gap has three parts: it must establish categoric relevance (the viewer cares), it must withhold the actual resolution (forces the click), and it must promise an high pay off (worth the attention spend)."
        ],
        callouts: [
          {
            type: "example",
            title: "Curiosity Gap Examples (Strong vs Weak)",
            body: "WEAK: 'I Tried Something New' — too vague, establishes no relevance.\nSTRONG: 'I Deleted My Most Viral Video — Here's Why' — creates direct friction (why delete?), withholds explanation, promises extreme insight."
          }
        ]
      },
      {
        num: "5.4",
        title: "Viral Thumbnail Analysis — Case Studies",
        body: [
          "Dissecting what works at scale provides direct technical blueprints. Let's study how top creators apply visual architecture to control click-through statistics."
        ],
        callouts: [
          {
            type: "case",
            title: "Case Study — MrBeast",
            body: "MrBeast's thumbnails follow a strict formula: 1) extreme emotional face expressions, 2) prominent prizes clearly visible, 3) max 3 dominant colours, 4) readable high-contrast texts under 4 words, 5) extreme tension between subject and goal."
          },
          {
            type: "case",
            title: "Case Study — Veritasium",
            body: "Derek Muller relies entirely on the intellectual curiosity gap. His thumbnails present counterintuitive physics anomalies ('The Fastest Maze-Solving Competition Ever') to stimulate high visual intrigue without needing human faces."
          }
        ]
      },
      {
        num: "5.5",
        title: "The Thumbnail Scoring Framework",
        body: [
          "Every asset must meet strict parameters before deployment. Use the AECRT system to objectively grade layout stopping power."
        ],
        fwBox: {
          title: "AECRT Thumbnail Scoring System — 100 Points Total",
          steps: [
            { icon: "A", text: "Attention (25 pts): Standout checking. Test by shrinking to 50px. Does it still pop and convey structure among competitors?" },
            { icon: "E", text: "Emotion (20 pts): Intensity calibration. Does the face or visual element register an instant, unambiguous feeling?" },
            { icon: "C", text: "Curiosity (20 pts): Gap inspection. Is a critical focal detail omitted or unresolved, requesting a click to solve?" },
            { icon: "R", text: "Relevance (20 pts): Expectation alignment. Avoid clickbait. Does the design accurately represent what's in the video?" },
            { icon: "T", text: "Technical (15 pts): Text legibility at 120px, crisp edges, balanced shadow contrast, appropriate color profile." }
          ]
        }
      }
    ],
    colorGrid: [
      { swatch: "#dc2626", name: "Red", bgBg: "rgba(220,38,38,0.08)", borderBg: "rgba(220,38,38,0.2)", textColor: "#fca5a5", meaning: "Urgency, danger, excitement, passion. Highest stopping power of any colour. Differentiate by pairing with cooler contrast accents." },
      { swatch: "#d97706", name: "Orange / Yellow", bgBg: "rgba(217,119,6,0.08)", borderBg: "rgba(217,119,6,0.2)", textColor: "#fcd34d", meaning: "Energy, optimism, warmth, action. Extreme legibility on dark themes and night-mode interface layouts." },
      { swatch: "#1d4ed8", name: "Blue", bgBg: "rgba(29,78,216,0.08)", borderBg: "rgba(29,78,216,0.2)", textColor: "#93c5fd", meaning: "Trust, authority, calm. Strongly preferred for tech, financial and academic channels targeting high-value professional demographics." },
      { swatch: "#16a34a", name: "Green", bgBg: "rgba(22,163,74,0.08)", borderBg: "rgba(22,163,74,0.2)", textColor: "#86efac", meaning: "Growth, money, permission, nature. Associated with finance and wellness content. High contrast when paired with warm complementary tints." },
      { swatch: "#7c3aed", name: "Purple", bgBg: "rgba(124,58,237,0.1)", borderBg: "rgba(124,58,237,0.25)", textColor: "#c4b5fd", meaning: "Luxury, mystery, exclusivity, royalty. Rare feed signature that instantly elevates premium and boutique creator profiles." },
      { swatch: "#111118", name: "Black / Dark Slate", bgBg: "rgba(255,255,255,0.04)", borderBg: "rgba(255,255,255,0.1)", textColor: "#e5e5e5", meaning: "Power, absolute sophistication, authority. Highest premium luxury expression when paired with sharp white text highlights." }
    ],
    checklist: [
      { text: "Face making direct eye contact with the viewport (if using a human subject)" },
      { text: "Maximum 3 words of text — completely readable at 120px thumbnail dimensions" },
      { text: "Background provides extreme contrast against foreground focal points" },
      { text: "Single dominant focal center — no clutter or competing graphic fields" },
      { text: "Curiosity gap present — key visual explanation is omitted" },
      { text: "Tested side-by-side against five top competitor streams" },
      { text: "Verified to score 70+ on the AECRT scoring parameters before publication" }
    ],
    quiz: {
      question: "What psychological phenomenon explains why thumbnails that withhold information receive more clicks than thumbnails that show everything?",
      options: [
        { text: "The Dunning-Kruger Effect", isCorrect: false },
        { text: "The Zeigarnik Effect — the brain fixates on incomplete patterns until resolved", isCorrect: true },
        { text: "The Baader-Meinhof Effect — frequency illusion from recent exposure", isCorrect: false },
        { text: "The Halo Effect — positive attributes of one element transferring to another", isCorrect: false }
      ],
      feedbackCorrect: "✓ Correct! The Zeigarnik Effect explains why the human brain experiences persistent tension and recall for incomplete patterns until resolved.",
      feedbackWrong: "✗ Not quite. The classical answer is the Zeigarnik Effect, which maps visual curiosity closures."
    }
  },
  {
    idx: 6,
    badge: "06",
    menuLabel: "Video Retention Science",
    eyebrow: "Module 06",
    title: "Video Retention Science",
    subtitle: "Getting the click is half the battle. Keeping viewers watching is what builds the algorithmic relationship that compounds into channel growth. This module teaches the neuroscience of sustained attention and how to engineer it into every video you produce.",
    lessons: [
      {
        num: "6.1",
        title: "The Attention Economy — Understanding the Battlefield",
        body: [
          "The average human attention span is not 8 seconds — that widely-cited statistic was methodologically flawed. Cognitive science actually demonstrates that human attention is highly selective: people sustain deep attention for hours on content they find rewarding, and have near-zero tolerance for content that fails to justify its cost.",
          "The problem is never your viewer's attention span. The problem is always your reward-to-cost ratio. Every single second of your video must justify the viewer's choice to stay."
        ],
        callouts: [
          {
            type: "tip",
            title: "The Retention Equation",
            body: "High average view duration (60%+) signals extreme quality to platforms, trigger exponential recommended impressions. Watch-time is the primary economic driver of creator businesses."
          }
        ],
        fwBox: {
          title: "How Major Platforms Use Retention Data",
          steps: [
            { icon: "YT", text: "YouTube: Search and Browse algorithms weight AVD (average view duration) above click counts. A steady 60% line beats volatile early clicks over long-tail distribution cycles." },
            { icon: "TT", text: "TikTok: Focuses heavily on watch-through rate and loop-count (replay frequency). Short loops heavily compound indexing weight within the 'For You' system." },
            { icon: "IG", text: "Reels: Save rate and completed loop counts govern reach expansion. Visual hooks must land within the first two frames." }
          ]
        }
      },
      {
        num: "6.2",
        title: "The Hook System — Engineering the First 30 Seconds",
        body: [
          "The hook is where videos are won or lost. Treat it as a sacred visual contract — make a bold, undeniable promise of what's to come, keeping visual introductions and channel logos entirely offline."
        ],
        fwBox: {
          title: "The 5 Proven Hook Formulas",
          steps: [
            { icon: "1", text: "The Bold Claim: Surprise with a counterintuitive thesis. 'Everything you've heard about platform scale is a complete lie — and I have the raw data to prove it.'" },
            { icon: "2", text: "The Story-In-Progress: Start mid-action. 'I'm standing in the studio I built from scratch. Exactly 18 months ago, I was sleeping on a friend's floor. Here's what changed.'" },
            { icon: "3", text: "The Burning Question: Tap a desperate curiosity. 'What happens if you post every single day for a year? I did it, so you don't have to.'" },
            { icon: "4", text: "The Shocking Statistic: Open with destabilizing values. 'The top 1% of creators earn 86% of all platform revenue. Here is how the algorithm selects them.'" },
            { icon: "5", text: "The Pain Point Mirror: Deeply acknowledge their specific obstacle. 'If you've been posting for six months and are still stuck under 100 views — stop everything and watch this.'" }
          ]
        }
      },
      {
        num: "6.3",
        title: "Pattern Interrupts — Resetting the Attention Clock",
        body: [
          "The human brain is a predictive machine. When its predictions are continuously correct, attention disengages and drifts. You must systematically disrupt this prediction model by inserting a pattern interrupt every 60–90 seconds.",
          "Pattern interrupts include: visual scale zooms, sound effect stings, B-roll transitions, text overlays, tone or volume shifts, or physical stage moves. Each re-triggers active cognitive processing."
        ]
      },
      {
        num: "6.4",
        title: "Story Loops — The Retention Mechanism",
        body: [
          "Use open narrative threads (Story Loops) to maintain steady watch-time tracking, keeping viewers waiting to achieve resolution."
        ],
        fwBox: {
          title: "Story Loop Architecture",
          steps: [
            { icon: "O", text: "Open a Loop Early: Promise a specific, unprecedented payoff at the exact end of the timeline." },
            { icon: "R", text: "Reference Mid-Timeline: Remind viewers of the upcoming resolution before introducing subsequent technical context." },
            { icon: "N", text: "Nest Multiple Loops: Multi-layered arcs prevent easy drop-offs by staggered resolutions." }
          ]
        }
      },
      {
        num: "6.5",
        title: "The Viral Video Structure — 10-Minute Blueprint",
        body: [
          "Combine these strategies into a persistent visual system. Follow the 8-Phase Retention structure designed for high average view duration."
        ],
        fwBox: {
          title: "8-Phase Retention Timeline Architecture",
          steps: [
            { icon: "01", text: "0:00–0:30 (The Hook): Bold claim, instant visual entry, establish target prize. No intro slides." },
            { icon: "02", text: "0:30–1:30 (The Promise): Formally sign the visual contract. Detail exact learnings." },
            { icon: "03", text: "1:30–3:00 (The Context): Minimal contextual stakes. Why it matters, your validated authority." },
            { icon: "04", text: "3:00–6:00 (Core Content A): Staggered insights, first pattern interrupts, open intermediate loops." },
            { icon: "05", text: "6:00–9:00 (Core Content B): Escalate complexity and payoff. Close initial loops." },
            { icon: "06", text: "9:00–10:30 (The Surprise): Unannounced value explosion. Rewarding viewers who stayed." },
            { icon: "07", text: "10:30–12:00 (The Synthesis): Re-affirm their mental growth. Map their transformation." },
            { icon: "08", text: "12:00–End (CTA & Forward Tease): Redirect viewers to next relevant chronicle seamlessly." }
          ]
        }
      }
    ]
  },
  {
    idx: 7,
    badge: "07",
    menuLabel: "Caption Mastery",
    eyebrow: "Module 07",
    title: "Caption Writing Mastery",
    subtitle: "In the age of short-form video, captions are the bridge between a scroll-stopper and a community builder. Great captions drive comments, shares, saves, and follows — the four highest-value signals across every major platform's algorithm.",
    lessons: [
      {
        num: "7.1",
        title: "Platform-Specific Caption Psychology",
        body: [
          "Never copy-paste identical captions. Each platform holds a distinctive user psychology and optimization standard. Calibrate your words for each demographic's mindset."
        ],
        fwBox: {
          title: "The Platform Mindset Map",
          steps: [
            { icon: "TT", text: "TikTok (Dopamine Discovery): Casual exploration mindset. Keep first lines tight (under 150 chars), trigger comments spontaneously." },
            { icon: "IG", text: "Instagram (Aspiration & Identity): Tap into self-expression. First sentence must earn the 'More' tap. Utility-driven lists work." },
            { icon: "YT", text: "YouTube (Search & Value SEO): Long-tail search intent. Front-load keywords in first sentences, leverage timestamps." },
            { icon: "LI", text: "LinkedIn (Career Authority): Professional pain points, actionable business cases, and structural formatting." },
            { icon: "X", text: "X (Real-Time Contrarian): Sharp wit, controversial topics, threaded lists rewarding completed reads." }
          ]
        }
      },
      {
        num: "7.2",
        title: "Viral Caption Formula Library",
        body: [
          "Leverage proven copy structures. These modular layouts are engineered specifically to provoke comments, saves and platform sharing actions."
        ],
        callouts: [
          {
            type: "example",
            title: "Formula 1 — The Controversial Truth",
            body: "'[Widely believed idea] is a damaging lie. Here is what eighteen months of raw testing data actually proved: [insight]. Bookmark this before it gets buried. Drop your thoughts below 👇'"
          },
          {
            type: "example",
            title: "Formula 2 — The Value List",
            body: "'[N] details top [niche masters] know that most creators never figure out:\n1. [Specific point]\n2. [Specific point]...\nWhich one surprised you? Drop it below.'"
          }
        ]
      },
      {
        num: "7.3",
        title: "The 3-Tier Hashtag Strategy",
        body: [
          "Structure hashtags as discovery pathways. Distribute tagging fields into three distinct categorization brackets."
        ],
        fwBox: {
          title: "The 3-Tier Hashtag Brackets",
          steps: [
            { icon: "T1", text: "Niche specific (50% of tags): Low search competition (10K–500K posts). Highly targetted visual categorization fields." },
            { icon: "T2", text: "Mid-tier broad (35% of tags): Solid volume (500K-5M posts). Broad creator audience mapping." },
            { icon: "T3", text: "High broad scale (15% of tags): Giant feeds (5M+ posts). Serves as reach amplifiers." }
          ]
        }
      },
      {
        num: "7.4",
        title: "CTA Optimisation — Engineering Engagement",
        body: [
          "A CTA (Call to Action) is the single most important line of a caption. Choose one primary metric and structure your words around it."
        ],
        fwBox: {
          title: "CTA Hierarchy by Algorithmic Weight",
          steps: [
            { icon: "★★★", text: "Share (Highest Value): Broadcasts content across new user nodes. Direct validation." },
            { icon: "★★★", text: "Save (High Value): Indicates lasting utility weight. Deep indexing boost on Instagram." },
            { icon: "★★", text: "Comment (Medium-High): Propels active discussion trails. Social validation indicators." },
            { icon: "★", text: "Like (Low-Medium): Low friction indicator. Valued for baseline social proof." }
          ]
        }
      }
    ]
  },
  {
    idx: 8,
    badge: "08",
    menuLabel: "Creator Growth Systems",
    eyebrow: "Module 08",
    title: "Creator Growth Systems",
    subtitle: "Talent without a system produces occasional success. A system without talent produces sustainable growth. This module gives you the exact growth architectures used by the world's most successful creator businesses — adaptable to any niche.",
    lessons: [
      {
        num: "8.1",
        title: "YouTube Growth Architecture",
        body: [
          "YouTube acts simultaneously as a social ecosystem and a powerful search engine. Channels must strategically optimize for both browse algorithmic feeds and evergreen search intent traffic."
        ],
        fwBox: {
          title: "The YouTube Growth Triangle",
          steps: [
            { icon: "S", text: "Search Optimization: Target high-volume, low-competition queries. Build evergreen traffic lines compounding value in the background." },
            { icon: "A", text: "Algorithm Browse: High CTR and high average view duration are required to earn recommended indexing." },
            { icon: "C", text: "Community Optimization: Establish subscriber relationships, reply to early comments, and use Community Posts." }
          ]
        },
        callouts: [
          {
            type: "case",
            title: "Case Study — Mrwhosetheboss",
            body: "Arun Maini scales reviews by a 80/20 formulation. 80% search-optimized tech analyses generating evergreen monetization lines, combined with 20% highly clickable browse visual challenges. First-hour comment involvement is used systematically."
          }
        ]
      },
      {
        num: "8.2",
        title: "TikTok & Reels Growth Blueprint",
        body: [
          "Short-form networks operate on high velocity loop metrics. Focus on series-based architectures and immediate trend positioning to convert transient viewers into permanent followers."
        ]
      },
      {
        num: "8.3",
        title: "The Content Pillar System",
        body: [
          "Professional content production requires systemic categorisation. Organize your monthly production schedule into 4 strategic content pillars."
        ],
        callouts: [
          {
            type: "tip",
            title: "The Four Core Pillars",
            body: "Education (40% - authority), Inspiration (25% - emotional connection), Entertainment (20% - novelty reach), Community (15% - loyalty verification)."
          }
        ]
      },
      {
        num: "8.4",
        title: "Creator Monetisation Blueprint",
        body: [
          "Diversified streams guarantee resilience against changing algorithm policies. Create a business plan that spans multiple independent revenue channels."
        ],
        fwBox: {
          title: "The 7 Creator Business Revenue Streams",
          steps: [
            { icon: "$1", text: "Ad Revenue (AdSense): Essential baseline, takes longest to scale to substantial size." },
            { icon: "$2", text: "Brand Partnerships: High single transactions. Pitch proactively using professional media packages." },
            { icon: "$3", text: "Digital Products: Courses, prompt parameters, e-books. Infinite scale, extreme margins." },
            { icon: "$4", text: "Consulting & Coaching: Live customized validation. Immediate high ticket returns." },
            { icon: "$5", text: "Affiliate Income: Recommend tools realistically. Build dedicated showcase tutorials." },
            { icon: "$6", text: "Recurring memberships: Build predictable income bases via exclusive access models." },
            { icon: "$7", text: "Creator Services Agency: Commercialise your production pipeline for corporate brands." }
          ]
        }
      }
    ]
  }
];
