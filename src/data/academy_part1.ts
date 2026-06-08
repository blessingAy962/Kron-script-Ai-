import { AcademyPage } from "./academyTypes";

export const academyPart1: AcademyPage[] = [
  {
    idx: 0,
    badge: "✦",
    menuLabel: "Welcome & Introduction",
    eyebrow: "✦ Aura Tech — Premium Creator Program",
    title: "The Kron Script AI Creator Mastery Program",
    subtitle: "The world's most complete AI creator education — built by Aura Tech, the AI intelligence hub that teaches, promotes, and builds the future of artificial intelligence. From understanding AI's origins to producing cinematic content with Kron Script AI, everything you need is here.",
    stats: [
      { number: "10", label: "Core Modules" },
      { number: "100+", label: "Pages of Depth" },
      { number: "50+", label: "Tools & Templates" },
      { number: "∞", label: "Your Potential" }
    ],
    infoBox: {
      title: "About Aura Tech",
      body: "Aura Tech is an AI Intelligence Hub on a mission to democratise the knowledge and power of artificial intelligence for creators worldwide. Every day, Aura Tech delivers cutting-edge AI knowledge, promotes the latest in AI technology, and builds real AI-powered tools — from AI movies and AI ads, to AI apps and AI websites.\n\nOur flagship product, Kron Script AI, is Aura Tech's most ambitious creation yet — a dedicated AI platform engineered specifically to write professional-grade movie scripts, short film scripts, ad scripts, and content frameworks. Kron Script AI is currently in final development and launching soon. This course is your complete preparation for mastering it from day one."
    },
    letter: {
      greeting: "Dear Creator,",
      body: [
        "Welcome to the Kron Script AI Creator Mastery Program — the most comprehensive AI creator education ever assembled. You have made a decision today that separates you from the vast majority of content creators who will spend years figuring out what you are about to learn in weeks.",
        "We built Kron Script AI because we believe the future of content creation belongs to those who understand the tools of tomorrow — today. This is not just a course. This is a complete transformation of how you think, create, and build your brand in the age of artificial intelligence.",
        "Inside these modules you will discover the science behind viral thumbnails, the psychology of audience retention, the art of AI filmmaking, and the exact systems used by the world's top creators. Every lesson is immediately actionable — not theory for theory's sake, but knowledge you can deploy from day one.",
        "The world is changing faster than ever. AI is not replacing creators — it is replacing creators who do not use AI. You now belong to the group that does.",
        "Study hard. Create boldly. Build something the world remembers."
      ],
      sig: "— The Aura Tech Team ✦"
    }
  },
  {
    idx: 1,
    badge: "01",
    menuLabel: "History of AI",
    eyebrow: "Module 01",
    title: "The Complete History of Artificial Intelligence",
    subtitle: "Before you can master AI tools, you must understand where they came from, how they think, and where they are going. This foundation separates true AI creators from button-pushers.",
    lessons: [
      {
        num: "1.1",
        title: "What is Artificial Intelligence?",
        body: [
          "Artificial Intelligence is the science and engineering of creating computer systems that perform tasks which normally require human intelligence — learning from experience, understanding language, recognising patterns, making decisions, and solving complex problems.",
          "The word 'intelligence' is the key distinction. Natural intelligence evolved over millions of years through biological processes. Artificial intelligence is engineered — deliberately built by humans to simulate, replicate, and in specific domains, surpass human cognitive ability."
        ],
        fwBox: {
          title: "The Three Levels of AI",
          steps: [
            { icon: "N", text: "Narrow AI (Where We Are Now): Designed for one specific task. A chess engine, a spam filter, an image generator, a script writer. Extraordinarily powerful within its domain, but unable to transfer knowledge outside it. Every AI tool you use today is Narrow AI." },
            { icon: "G", text: "General AI (AGI — Where We Are Heading): Hypothetical human-level intelligence across all cognitive domains simultaneously. AGI could learn any skill, reason across disciplines, and operate with human-like understanding. Most researchers believe AGI is 5–20 years away." },
            { icon: "S", text: "Super AI (The Horizon): Hypothetical intelligence that surpasses all human capability in every domain simultaneously. Currently theoretical, but the subject of intense debate among the world's leading technologists." }
          ]
        },
        callouts: [
          {
            type: "tip",
            title: "Creator Insight",
            body: "Every AI tool you use — ChatGPT, Midjourney, Runway, ElevenLabs, and soon Kron Script AI — is Narrow AI. It is astonishingly capable within its specific domain, but zero capability outside it. This is precisely why human creative direction, taste, and strategy remain irreplaceable — and why the best AI output always comes from the most skilled human prompt engineer."
          }
        ],
        subsections: [
          {
            title: "The Four Pillars of AI Capability — The LPRD Framework",
            body: [
              "Learning: The ability to improve performance through exposure to data. Every AI model has been trained on billions of examples — text, images, video, audio — and has developed statistical patterns from that training.",
              "Perception: The ability to interpret input from the world — images, text, sound, video, and data. Modern AI can analyse a photograph and describe every element of it in 50 languages in under a second.",
              "Reasoning: The ability to draw logical conclusions from information and solve multi-step problems. Large Language Models reason through complex questions step by step, often arriving at sophisticated and nuanced answers.",
              "Decision-Making: The ability to select actions based on context and goals. AI recommendation engines on YouTube, TikTok, and Instagram decide what billions of people see every second — optimising for the platform's engagement metrics."
            ]
          }
        ]
      },
      {
        num: "1.2",
        title: "The Evolution of AI — A Complete Timeline",
        body: [
          "Understanding AI history is not academic nostalgia — it is strategic intelligence. Knowing how we arrived here reveals exactly where we are going, and positions you to adopt tomorrow's tools faster than anyone else."
        ]
      },
      {
        num: "1.3",
        title: "How Neural Networks Work",
        body: [
          "A neural network is the computational engine inside virtually every powerful AI tool you use today. Understanding how it works gives you irreplaceable insight into why AI behaves as it does — and how to work with it more effectively as a creator.",
          "The human brain contains roughly 86 billion neurons, each connected to thousands of others. When you learn something new, the synaptic connections between neurons strengthen — a process called neuroplasticity. Artificial neural networks are mathematical imitations of this biological mechanism.",
          "An artificial neural network consists of layers of mathematical nodes — artificial neurons. The input layer receives raw data: a photograph, a sentence, a video frame. Multiple hidden layers transform that data through millions of weighted mathematical operations. The output layer produces the result: a generated image, a written script, a synthesised voice."
        ],
        callouts: [
          {
            type: "example",
            title: "Concrete Example — How Midjourney Generates Your Image",
            body: "When you prompt 'a cinematic shot of a lone astronaut standing at the edge of a neon-lit city on Mars,' the model passes your text through a language encoder that converts words into numerical vectors. These vectors activate patterns across billions of training images. The diffusion model then iteratively refines random noise into coherent pixel values that statistically match those patterns. The 'creativity' is sophisticated statistical mathematics — guided entirely by the quality of your prompt."
          }
        ],
        fwBox: {
          title: "Key AI Architectures Every Creator Must Know",
          steps: [
            { icon: "T", text: "Transformers: The dominant architecture today. Uses 'attention mechanisms' to weigh the relationship of every token against every other. Powers ChatGPT, Claude, Gemini, and all modern LLMs including Kron Script AI's language engine." },
            { icon: "D", text: "Diffusion Models: Start with random noise and progressively 'denoise' it toward a coherent image or video. Powers Midjourney, Stable Diffusion, DALL-E 3, and Sora. Understanding diffusion explains why AI images improve with more generation steps." },
            { icon: "G", text: "GANs (Generative Adversarial Networks): Two competing networks — a generator creates content, a discriminator judges it. The adversarial tension produces increasingly realistic output. Powers many face-synthesis and style-transfer applications." },
            { icon: "C", text: "CNNs (Convolutional Neural Networks): Specialised for visual data. Detect edges, textures, and objects in images. Power image recognition, AI upscaling, and visual analysis tools." }
          ]
        }
      },
      {
        num: "1.4",
        title: "Generative AI — The Creator's Era",
        body: [
          "Generative AI is the category of artificial intelligence that creates new content — images, text, video, audio, code — rather than merely analysing existing content. This is the AI revolution that has fundamentally transformed what a solo creator can produce.",
          "Before generative AI, creating professional video content required a camera crew, director of photography, production designer, editor, sound designer, graphic designer, and months of post-production time. Today, a single creator with the right tools and the right skills can produce a cinematic short film in 48 hours.",
          "The economic implications are profound. Production costs that once required tens of thousands of dollars now cost tens of dollars. The question is no longer whether you can afford to create great content — it is whether you understand how to direct AI to produce it at the standard your audience expects."
        ],
        callouts: [
          {
            type: "case",
            title: "Real-World Impact",
            body: "Corridor Crew, a VFX YouTube channel, demonstrated that a two-person team using AI generation tools could recreate scenes from major Hollywood films — including large-scale action sequences and historically complex environments — in under a week. What previously required a full studio production unit and a budget of millions can now be achieved by a skilled creator who understands AI tools deeply."
          }
        ]
      },
      {
        num: "1.5",
        title: "The Future of AI — What Creators Must Prepare For",
        body: [
          "By 2030, AI researchers project capabilities that read as science fiction from the perspective of five years ago. As a creator, your competitive advantage is not simply using today's tools — it is positioning yourself to adopt tomorrow's tools faster than everyone else in your niche."
        ],
        fwBox: {
          title: "The Next 5 Years — What's Coming",
          steps: [
            { icon: "→", text: "Real-Time AI Video Production: Live streaming with AI-generated environments, effects, and overlays at zero latency. Your studio becomes entirely virtual — any backdrop, any world, any visual environment on demand." },
            { icon: "→", text: "Autonomous AI Creator Channels: Fully autonomous AI personas that script, film, edit, and publish content continuously. Human creators shift from production to creative direction and strategy." },
            { icon: "→", text: "Hyper-Personalised Content: One video personalised into millions of simultaneous versions — different presenters, different languages, different cultural contexts — for each individual viewer segment, automatically." },
            { icon: "→", text: "Multimodal AI Criticism: AI that simultaneously understands your video, its audio, its captions, and its historical performance data — then provides a predictive performance score before you publish. Early versions of this exist. Full capability is imminent." },
            { icon: "→", text: "AI Script Specialisation (Kron Script AI): Dedicated AI systems trained specifically on screenplay structure, narrative architecture, dialogue craft, and platform-specific content formats — delivering professional-grade scripts that general AI tools cannot match." }
          ]
        }
      }
    ],
    timeline: [
      { year: "1950 — The Turing Test", text: "Alan Turing publishes 'Computing Machinery and Intelligence,' proposing the foundational question: 'Can machines think?' He designs the Turing Test — if a machine holds a conversation indistinguishable from a human, it demonstrates machine intelligence. This paper launches the entire field." },
      { year: "1956 — The Dartmouth Conference", text: "John McCarthy coins the term 'Artificial Intelligence' at a landmark New Hampshire conference. The field is formally born. Early optimism runs high — researchers predict human-level AI within 20 years. They were off by approximately 70 years, and counting." },
      { year: "1966–1986 — The AI Winters", text: "Two periods of funding collapse and disillusionment as AI repeatedly fails to meet inflated expectations. Rule-based systems hit hard cognitive limits. The lesson history records: intelligence is vastly more complex than early researchers imagined." },
      { year: "1997 — Deep Blue Defeats Kasparov", text: "IBM's chess computer defeats reigning world champion Garry Kasparov. The world is stunned. Narrow AI proves it can surpass human performance in specific cognitive domains. The modern AI race begins in earnest." },
      { year: "2012 — The Deep Learning Revolution", text: "AlexNet, a deep convolutional neural network, obliterates all competitors at the ImageNet image recognition challenge. The era of deep learning begins. This moment is the Big Bang of modern AI — the point from which everything else accelerates." },
      { year: "2017 — The Transformer Architecture", text: "Google publishes 'Attention Is All You Need,' introducing the Transformer. This architecture becomes the foundation of every major AI language model: GPT, Claude, Gemini, Llama. Without this single paper, none of the AI tools that exist today would be possible." },
      { year: "2022 — ChatGPT Changes Everything", text: "OpenAI releases ChatGPT to the public. It reaches 100 million users in two months — the fastest product adoption in human history. AI moves from university research labs to everyday life. The creator economy is changed permanently and irreversibly." },
      { year: "2023–2025 — The Generative AI Explosion", text: "Midjourney, Runway Gen-2 and Gen-3, Sora, ElevenLabs, HeyGen, Kling, Luma — a wave of generative AI tools for images, video, voice, and music reaches creators worldwide. A single creator with the right tools can now produce Hollywood-quality content alone." },
      { year: "2026 and Beyond — The Agentic Era", text: "AI agents begin autonomously completing complex, multi-step tasks. AI does not just assist creators — it becomes a co-creator, a production assistant, a strategy partner. Platforms like Kron Script AI emerge to make specialised AI capability accessible to every creator on the planet. Those who master this era will own the next decade of content." }
    ],
    assignment: {
      title: "Module 1 Assignment",
      tasks: [
        "Write a 300-word essay: 'How Understanding AI History Will Shape My Creator Strategy.' Post it as a blog, LinkedIn article, or in your creator journal.",
        "Research and list 10 AI tools that did not exist three years ago and are now relevant to your content niche. For each, write what it does and one specific way you could use it in your next piece of content.",
        "Create your personal AI Timeline — overlay your own content journey onto the AI history timeline. Where were you in 2022 when ChatGPT launched? What changed? What would you have created if you had the knowledge you now have?"
      ]
    },
    quiz: {
      question: "Which 2017 research paper introduced the Transformer architecture that became the foundation of all modern AI language models?",
      options: [
        { text: "'Deep Learning' — Goodfellow, Bengio & Courville", isCorrect: false },
        { text: "'Attention Is All You Need' — Google Brain", isCorrect: true },
        { text: "'ImageNet Classification with Deep CNNs' — AlexNet", isCorrect: false },
        { text: "'Computing Machinery and Intelligence' — Alan Turing", isCorrect: false }
      ],
      feedbackCorrect: "✓ Correct! 'Attention Is All You Need' (2017) by the Google Brain team introduced the Transformer architecture — the foundation of every modern language model including ChatGPT, Claude, Gemini, and Kron Script AI.",
      feedbackWrong: "✗ Not quite. The correct answer is 'Attention Is All You Need' (2017) — published by Vaswani et al. at Google Brain. This single paper enabled the entire modern AI era."
    }
  },
  {
    idx: 2,
    badge: "02",
    menuLabel: "Prompt Engineering",
    eyebrow: "Module 02",
    title: "Prompt Engineering Mastery",
    subtitle: "Prompting is the new coding. The difference between a mediocre AI output and a breathtaking one is 95% prompt quality. This module teaches you to speak the language of AI — fluently, precisely, and powerfully.",
    lessons: [
      {
        num: "2.1",
        title: "The Anatomy of a Perfect Prompt",
        body: [
          "Most people treat AI prompts like search engine queries — short, vague, and hopeful. Professional prompt engineers treat them like creative briefs given to world-class creative teams: specific, structured, multi-layered, and precisely calibrated to produce a defined output.",
          "Every powerful prompt contains six essential elements. Miss any single one, and the AI must guess your intent — and its statistical best guess is rarely what you envisioned."
        ],
        fwBox: {
          title: "The 6-Layer Prompt Architecture — RCATEF",
          steps: [
            { icon: "R", text: "Role: Define who the AI is. 'You are a world-class documentary filmmaker with 25 years of experience directing for the BBC and National Geographic.' A precisely defined role activates the entire relevant knowledge domain." },
            { icon: "C", text: "Context: Provide essential background. 'I am creating a 5-minute short film for YouTube about climate change, targeting a global Gen Z audience aged 16–24.'" },
            { icon: "A", text: "Action: State the task with precision. 'Write a compelling 60-second opening monologue spoken by a 20-year-old engineering student who has just survived a category 5 hurricane.'" },
            { icon: "T", text: "Tone: Specify the emotional register exactly. 'Urgent but ultimately hopeful. Personal and specific, never preachy. Poetic without being pretentious. The voice of someone who has just found clarity through catastrophe.'" },
            { icon: "E", text: "Examples: Reference known works as style anchors. 'In the structural style of Chimamanda Ngozi Adichie's 2009 TED Talk — a disarming personal story in the first 20 seconds, before expanding to the universal idea.'" },
            { icon: "F", text: "Format: Define the exact output structure. 'Numbered script format with director notes in brackets. Maximum 150 words. End on an unresolved rhetorical question that lingers.'" }
          ]
        }
      },
      {
        num: "2.2",
        title: "The Three Levels of Prompting",
        body: [
          "Understanding the prompt tiers changes how you collaborate with machine neural paths. Let's compare beginner commands to intermediate specs to advanced masterpiece templates."
        ]
      },
      {
        num: "2.3",
        title: "Image Prompting Mastery",
        body: [
          "Image prompting is a distinct discipline from text prompting. AI image models respond to specific technical vocabulary and visual description structures that text models do not require. Mastering this vocabulary is the difference between amateur and cinematic AI imagery."
        ],
        callouts: [
          {
            type: "tip",
            title: "Universal Image Prompt Formula",
            body: "Subject + Style + Lighting + Camera + Colour + Mood + Quality Tags"
          }
        ]
      },
      {
        num: "2.4",
        title: "Video Prompting for AI Generation",
        body: [
          "Video prompting adds the dimension of time and motion. You are not describing a static scene — you are choreographing a living moment in space. The best AI video prompts read like director's shot notes from a professional production package."
        ],
        callouts: [
          {
            type: "example",
            title: "Universal Video Prompt Formula",
            body: "Scene + Camera Movement + Subject Action + Duration + Atmosphere + Technical Specs — for Runway, Kling, Sora, Luma"
          }
        ]
      },
      {
        num: "2.5",
        title: "Chatbot Prompting for Maximum Output",
        body: [
          "Chatbot prompting — for tools like ChatGPT, Claude, and the AI engine inside Kron Script AI — follows different principles from image and video prompting. Here you are directing a thinking partner, not generating a visual asset. The quality of your conversation structure determines the quality of the output."
        ],
        fwBox: {
          title: "The 7 Laws of Chatbot Prompting",
          steps: [
            { icon: "1", text: "Assign a Role First: Before any instruction, define who the AI is. 'You are an Emmy Award-winning television writer specialising in one-hour drama.' This primes all subsequent responses." },
            { icon: "2", text: "Give Context Before Task: Background before instruction. Share your audience, your platform, your goal, and your constraints before asking for output." },
            { icon: "3", text: "Be Specific About Length: 'Write a 90-second script (approximately 225 words)' produces exactly what you need." },
            { icon: "4", text: "Use Negative Constraints: Tell the AI what NOT to do. 'Do not use clichéd phrases. Do not open with a question. Do not include statistics.'" },
            { icon: "5", text: "Request Multiple Versions: 'Give me 3 different versions of this hook — one bold and provocative, one warm and personal, one data-driven and analytical.'" },
            { icon: "6", text: "Iterate, Never Restart: 'Take version 2's opening, combine it with version 3's closing, and rewrite the middle in a more urgent tone.' Build on what works." },
            { icon: "7", text: "Close with Refinement Instructions: After the first output, always say: 'Now make it 20% shorter, elevate the first line, and make the final sentence more unexpected.'" }
          ]
        }
      },
      {
        num: "2.6",
        title: "Reverse Prompt Engineering",
        body: [
          "Reverse prompt engineering is the skill of analysing existing AI-generated content — an image, a video, a piece of writing — and deconstructing the prompt that most likely produced it. This is how elite creators learn from excellence without imitation."
        ],
        fwBox: {
          title: "The 5-Step Reverse Engineering Process",
          steps: [
            { icon: "1", text: "Identify the Style Tradition: What visual or literary tradition does this content belong to? (Cinematic realism? Dark academia? Editorial minimalism?)" },
            { icon: "2", text: "Extract Subject Elements: List every describable element — subjects, objects, environment, actions, and expressions." },
            { icon: "3", text: "Identify Technical Parameters: Lighting type, camera angle, lens characteristics, depth of field, colour palette, aspect ratio, and post-processing effects." },
            { icon: "4", text: "Name the Emotional Atmosphere: What feeling does the content create? Name it precisely — longing, triumph, dread, wonder, nostalgia." },
            { icon: "5", text: "Reconstruct, Generate, and Compare: Write your best-guess prompt, generate, compare side by side, and refine. Most professionals arrive at a strong reconstruction in 3–5 iterations." }
          ]
        }
      },
      {
        num: "2.7",
        title: "Prompt Psychology",
        body: [
          "AI language models are trained on human text, and human text is saturated with psychological associations. Certain words, authority signals, and framing structures activate fundamentally different response patterns. Understanding this is the difference between good and extraordinary AI output."
        ],
        callouts: [
          {
            type: "tip",
            title: "The Authority Principle",
            body: "Prompts that establish high-status creative contexts produce higher-quality output. 'Write a script' gives you a statistically average script. 'You are the head writer on Christopher Nolan's most ambitious film yet. Write the opening scene' activates entirely different statistical patterns."
          },
          {
            type: "example",
            title: "The Specificity Principle",
            body: "Vague prompts produce average outputs — the statistical centre of all relevant training examples. Specific prompts produce outlier outputs. 'A scene where a 64-year-old architect finds her life's most important blueprint — for a building that was never built — while clearing out her late husband's studio' is so specific it can only produce something original."
          },
          {
            type: "warn",
            title: "The Constraint Paradox",
            body: "Counter-intuitively, the most creatively constrained prompts often produce the most original output. Complete freedom gives AI too many options and it regresses to the mean. Tight constraints — unusual combinations, contradictory tones, unexpected formats — force the AI to find paths it would never take unprompted."
          }
        ]
      }
    ],
    assignment: {
      title: "Module 2 Assignment — The Prompt Portfolio",
      tasks: [
        "Build 5 Text prompts using the full RCATEF framework — scripts, captions, descriptions",
        "Build 5 Image prompts using the complete quality modifier checklist",
        "Build 5 Video prompts using the director's shot description format",
        "Build 3 System prompts that create specialised AI personas for your brand voice",
        "Build 2 Reverse-engineered prompts deconstructed from content you deeply admire",
        "Document every output produced, a quality rating (1–10), and one specific refinement you would make next time."
      ]
    },
    quiz: {
      question: "What psychological phenomenon explains why thumbnails that withhold information receive more clicks than thumbnails that show everything?",
      options: [
        { text: "The Dunning-Kruger Effect", isCorrect: false },
        { text: "The Zeigarnik Effect — the brain fixates on incomplete patterns", isCorrect: true },
        { text: "The Baader-Meinhof Effect — frequency illusion of recent exposure", isCorrect: false },
        { text: "The Halo Effect — positive attributes of one transferring to another", isCorrect: false }
      ],
      feedbackCorrect: "✓ Correct! The Zeigarnik Effect holds that the human mind stays recursively focused on incomplete sequences until mental closure is achieved.",
      feedbackWrong: "✗ Incorrect. The Zeigarnik Effect explains curiosity-driven pattern-matching closure mechanisms."
    }
  },
  {
    idx: 3,
    badge: "03",
    menuLabel: "AI Filmmaking",
    eyebrow: "Module 03",
    title: "AI Filmmaking Masterclass",
    subtitle: "Cinema is the most powerful form of visual storytelling humanity has ever created. This module transforms you from a content creator into a filmmaker — one who commands AI tools as a full production studio, and story as the engine behind everything.",
    lessons: [
      {
        num: "3.1",
        title: "Story Development — The Foundation",
        body: [
          "Great AI films are not made inside the AI tool. They are made before you open it. Story is the skeleton — AI is the skin. A weak story with stunning AI visuals is a beautiful corpse. A strong story with average AI visuals is a living film that moves people.",
          "Professional filmmakers invest 60–70% of their total project time in development — before a single frame is shot. The best AI filmmakers apply the same discipline. Story development is your pre-production. It is where your project is either won or lost."
        ],
        fwBox: {
          title: "The 7-Stage Story Development Process",
          steps: [
            { icon: "1", text: "Core Idea (Logline): Your entire story in one sentence. 'A street photographer discovers that every photo he takes predicts a death in the next 24 hours — and must decide whether knowing the future is a gift or a curse.'" },
            { icon: "2", text: "Theme: What does your story say about the human condition? 'Does knowing the future liberate us or imprison us?'" },
            { icon: "3", text: "Character Architecture: Who is your protagonist? What do they want externally (the goal)? What do they need internally (the truth)?" },
            { icon: "4", text: "World-Building: What are the rules of your world? Keep color grade, architectural context, and period detail consistent." },
            { icon: "5", text: "Story Spine: Map your structural beats — inciting incident, rising action, midpoint reversal, all is lost, climax, resolution." },
            { icon: "6", text: "Visual Language: What does your film look, feel, and sound like? Extract color grades and editing rhythms from reference films." },
            { icon: "7", text: "Shot List: Decompose your story into individual shots. For AI filmmaking, each shot is a prompt. A 5-minute short film requires 60 to 120 shots." }
          ]
        },
        callouts: [
          {
            type: "case",
            title: "Case Study — 'Everything Everywhere All at Once' (2022)",
            body: "This film won 7 Academy Awards on a $14.3M budget. Directors Daniel Kwan and Daniel Scheinert (the Daniels) built the entire film around a single thematic core: 'A mother discovers that caring — even in a meaningless multiverse — is the only worthwhile act.' Thematic clarity is what separates award-winning films from merely entertaining ones."
          }
        ]
      },
      {
        num: "3.2",
        title: "Character Creation & Visual Consistency",
        body: [
          "In AI filmmaking, character consistency across shots is your greatest technical challenge. Unlike human actors who look identical in every scene by nature, AI-generated characters can shift appearance significantly between shots if your prompts lack precise character documentation."
        ]
      },
      {
        num: "3.3",
        title: "Camera Language & Cinematic Prompting",
        body: [
          "Every shot in cinema is a language with grammar, vocabulary, and meaning. Directors and cinematographers spend careers mastering this grammar. AI filmmakers must internalise it to give their tools precise visual instructions."
        ],
        fwBox: {
          title: "The Complete Camera Language Reference",
          steps: [
            { icon: "EWS", text: "Extreme Wide Shot: Character tiny within a vast environment. Communicates: isolation, scale, the smallness of the individual." },
            { icon: "WS", text: "Wide Shot: Full body visible, environment contextualised. Communicates: the character's relationship to their world." },
            { icon: "MS", text: "Medium Shot: Waist up. The neutral, conversational shot. Standard for dialogue scenes." },
            { icon: "CU", text: "Close-Up: Face only. High emotional intensity. Forces the audience to feel what the character feels." },
            { icon: "ECU", text: "Extreme Close-Up: Eyes, mouth, hands, a single object. Maximum intimacy or tension. 'This detail contains everything.'" },
            { icon: "LA", text: "Low Angle: Camera below subject, pointing up. Makes subject appear powerful, threatening, god-like." },
            { icon: "HA", text: "High Angle: Camera above, pointing down. Makes subject appear small, vulnerable, trapped, or overwhelmed." },
            { icon: "DA", text: "Dutch Angle (Canted): Camera tilted off horizontal axis. Communicates: psychological instability, moral wrongness." }
          ]
        }
      },
      {
        num: "3.4",
        title: "Cinematic Lighting Vocabulary",
        body: [
          "Lighting is the cinematographer's most powerful tool. Understanding lighting terminology allows you to prompt AI video and image tools with the precision of a director of photography."
        ],
        fwBox: {
          title: "Essential Cinematic Lighting Terms",
          steps: [
            { icon: "⚡", text: "Chiaroscuro: Extreme contrast between light and deep shadow. Creates dramatic tension and psychological depth." },
            { icon: "☀️", text: "Golden Hour: 20–40 minutes after sunrise or before sunset. Warm, low, directional light rendering beautifully." },
            { icon: "🌙", text: "Blue Hour: Brief twilight period after sunset. Cool, diffused, atmospheric blue-purple light. Melancholic and ethereal." },
            { icon: "🎭", text: "Rembrandt Lighting: Three-quarter portrait lighting setup creating a distinctive triangle of light on the shadowed cheek." },
            { icon: "🌫️", text: "Motivated Lighting: Light that appears to come from a source visible or implied within the scene — a window, fireplace, or lamp." }
          ]
        }
      },
      {
        num: "3.5",
        title: "The Complete AI Video Production Workflow",
        body: [
          "Managing generative timelines requires coordinating inputs. The end-to-end pipeline operates in seven sequential phases, scaling script details to final exports smoothly."
        ],
        fwBox: {
          title: "End-to-End AI Film Production Pipeline — Aura Tech Method",
          steps: [
            { icon: "01", text: "Script → Kron Script AI: Generate, develop, and format your complete screenplay based on structural story arcs." },
            { icon: "02", text: "Storyboard → Midjourney / Flux: Generate one key image per scene using your Character Bible and style guide." },
            { icon: "03", text: "Shot Generation → Runway Gen-3 / Kling / Sora: Animate storyboard images using video prompt formulas." },
            { icon: "04", text: "Voiceover → ElevenLabs: Generate character voices or narration with ElevenLabs' voice cloning." },
            { icon: "05", text: "Music → Suno / Udio: Generate original score or use AI to select music matching emotional arcs." },
            { icon: "06", text: "Edit → CapCut / DaVinci Resolve: Assemble, color grade, add sound design, and export in multi-platform formats." },
            { icon: "07", text: "Distribution → Kron Script AI Platform: Generate platform-optimised titles, hashtags, descriptions, and capture audience insights." }
          ]
        }
      }
    ],
    assignment: {
      title: "Module 3 Assignment — Your First AI Short Film",
      tasks: [
        "Write a logline, theme statement, and 5-beat story outline.",
        "Create a full Character Bible for at least one character.",
        "Generate a 12-shot storyboard using Midjourney or Flux.",
        "Animate at least 6 shots using Runway, Kling, or Luma.",
        "Add voiceover (your voice or ElevenLabs), original music (Suno), and captions.",
        "Export and publish to at least one platform with a Kron-generated description.",
        "Document every step with screenshots. Note what worked and what failed. This is your flagship portfolio piece."
      ]
    }
  },
  {
    idx: 4,
    badge: "04",
    menuLabel: "Script Writing Mastery",
    eyebrow: "Module 04",
    title: "Script Writing Mastery",
    subtitle: "Hollywood screenwriting is a 100-year-old discipline with refined, tested techniques. This module teaches the complete system — from story structure to dialogue craft to the emotional architecture that makes audiences feel everything.",
    lessons: [
      {
        num: "4.1",
        title: "The Three-Act Structure",
        body: [
          "Every commercially successful film ever made — from Citizen Kane (1941) to Parasite (2019) to Everything Everywhere All at Once (2022) — adheres to some version of three-act structure. It is not a formula that limits creativity. It is the architecture that makes creativity intelligible to an audience."
        ],
        fwBox: {
          title: "Three-Act Structure — The Blueprint",
          steps: [
            { icon: "I", text: "Act One — The Setup (25% of total runtime): Establish the ordinary world, the protagonist's flaw, relationships, and status quo. Inciting Incident disrupts this." },
            { icon: "II", text: "Act Two — The Confrontation (50% of total runtime): Protagonist pursues goal and faces obstacles. Midpoint revs up action. Ends on 'All Is Lost'." },
            { icon: "III", text: "Act Three — The Resolution (25% of total runtime): Transformed protagonist confronts final obstacles. Climax resolves central conflict." }
          ]
        }
      },
      {
        num: "4.2",
        title: "The Hero's Journey — The Universal Story",
        body: [
          "Mythologist Joseph Campbell identified a universal narrative pattern across the world's stories — a template he called the Monomyth, or Hero's Journey. George Lucas used it as the explicit structural blueprint for Star Wars. Christopher Vogler's adaptation in 'The Writer's Journey' has shaped virtually every major studio film since 1992."
        ],
        fwBox: {
          title: "The 12 Stages of the Hero's Journey",
          steps: [
            { icon: "1", text: "Ordinary World: The hero's life before the adventure. Establish characters before threatening what they love." },
            { icon: "2", text: "Call to Adventure: Challenge or opportunity disrupts status quo." },
            { icon: "3", text: "Refusal of the Call: Hesitation from fear or duty increases stakes." },
            { icon: "4", text: "Meeting the Mentor: Guide equips hero with wisdom, training, tools." },
            { icon: "5", text: "Crossing the Threshold: Hero commits to Special World. No return." },
            { icon: "6", text: "Tests, Allies, Enemies: Learning rules, facing challenges, earning trust." },
            { icon: "7", text: "Approach to Inmost Cave: Prep for ultimate confrontation." },
            { icon: "8", text: "The Ordeal: Facing greatest fear. Structural heart of story." },
            { icon: "9", text: "Reward: Claim of prize, critical wisdom, or powerful tools." },
            { icon: "10", text: "Road Back: Consequence of storming Special World follows home." },
            { icon: "11", text: "Resurrection: Final Climax. Ultimate test of inner transformation." },
            { icon: "12", text: "Return with Elixir: Transform community with achieved treasure." }
          ]
        }
      },
      {
        num: "4.3",
        title: "The Art of Screenplay Dialogue",
        body: [
          "Screenplay dialogue is not transcribed conversation. Real-world conversation is redundant and circular. Screenplay dialogue is conversation with everything irrelevant removed — every line simultaneously accomplishing two or more narrative functions."
        ],
        subsections: [
          {
            title: "The 5 Functions Great Dialogue Must Perform",
            body: [
              "1. Reveal Character: What they say and how they say it reveals who they are.",
              "2. Advance Plot: Each line must move story forward or reveal changing parameters.",
              "3. Convey Subtext: Dialogue is about what is NOT said explicitly. Let viewers read between details.",
              "4. Establish Relationship: Dynamic weights must establish who holds conversational control.",
              "5. Create Rhythm: Short sentences raise visual pacing. Long blocks exhaust conversational space."
            ]
          }
        ]
      },
      {
        num: "4.4",
        title: "Plot Twists & Emotional Architecture",
        body: [
          "The most memorable films are defined by moments that reframe everything. Great plot twists are planted invisibly in Act One and revealed unexpectedly in Act Three."
        ],
        fwBox: {
          title: "The 5 Types of Plot Twist",
          steps: [
            { icon: "1", text: "Identity Reversal: A character is not who we thought. (Sixth Sense, Fight Club)" },
            { icon: "2", text: "Allegiance Shift: Trusted ally reveals they are antagonist. (Parasite, Saltburn)" },
            { icon: "3", text: "World Reframe: The physical setting holds different laws entirely. (Matrix, Truman Show)" },
            { icon: "4", text: "Moral Reversal: Target goal is revealed as wrong or dangerous." },
            { icon: "5", text: "Timeframe Reveal: Events thought sequential are actually non-linear. (Memento, Westworld)" }
          ]
        }
      }
    ],
    assignment: {
      title: "Module 4 Assignment — Write Your Screenplay",
      tasks: [
        "Write a complete 5–10 page short screenplay (or full outline).",
        "Define your one-sentence logline and three-sentence premise.",
        "Map your timeline onto the 12 stages of the Monomyth.",
        "Analyse dialogue: list what plot info it delivers and its physical subtext details."
      ]
    }
  }
];
