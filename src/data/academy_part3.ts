import { AcademyPage } from "./academyTypes";
import { academyPart1 } from "./academy_part1";
import { academyPart2 } from "./academy_part2";

export const academyPart3: AcademyPage[] = [
  {
    idx: 9,
    badge: "09",
    menuLabel: "AI Detection & Deepfakes",
    eyebrow: "Module 09",
    title: "AI Detection & Deepfake Analysis",
    subtitle: "As synthetic assets become indistinguishable from documented photos, verification and digital safety metrics form a pivotal security posture. This module equips you with the visual forensic skills to identify AI generation and navigate the ethical landscape of digital media.",
    lessons: [
      {
        num: "9.1",
        title: "Forensic Analysis of AI Images",
        body: [
          "While AI image generators (Midjourney, DALL-E, Flux) have achieved breathtaking photorealism, they still leave mathematical and structural signatures of their synthetic origin. By looking at specific details, you can identify AI images with a high degree of certainty.",
          "These visual anomalies are the product of how diffusion models process pixel clusters — optimizing for overall scene statistics rather than the logical rules of physical objects."
        ],
        fwBox: {
          title: "Visual Anomalies Forensic Checklist",
          steps: [
            { icon: "👁", text: "Asymmetrical Iris Reflections: Real eyes capture a matching miniature image of their surrounding lighting environment. AI often generates asymmetrical or unrelated reflection shapes in each eye." },
            { icon: "✋", text: "Hand & Extremity Deformations: Standard AI struggle points. Look for extra fingers, missing joints, unnatural finger spacing, merged fingernails, or hand planes that defy skeletal architecture." },
            { icon: "🔤", text: "Text & Background Noise: AI text is often mirrored or nonsensical on closer examination. Background items like lamps, patterns in wallpapers, or window frames often melt into one another." },
            { icon: "👂", text: "Ear and Jewelry Patterns: AI often fails to match ear geometries between left and right structures, or mixes mismatched earring patterns on opposing earlobes." },
            { icon: "💇", text: "Hair-to-Skin Transitions: Watch the soft borders where synthetic hair strands meet skin planes. AI frequently merges hair roots directly into forehead lines or blurs boundaries unnaturally." }
          ]
        }
      },
      {
        num: "9.2",
        title: "Deepfake Video Verification Protocol",
        body: [
          "As video generation technology advances to near-perfection, identifying deepfakes requires an active detection protocol that goes beyond surface visuals."
        ],
        fwBox: {
          title: "The 5-Step Deepfake Verification Process",
          steps: [
            { icon: "①", text: "Spatial Coherence: Track object boundaries across multiple frames. Unnatural flickering or warping on face edges under movement is a major AI signature." },
            { icon: "②", text: "Audio-Sync lip alignment: Look closely at lip matching on hard consonants (B, M, P). AI voices and generated lip movements often mismatch by 2-3 visual frames." },
            { icon: "③", text: "Biological Micro-Expressions: Count involuntary blinks. AI often fails to generate normal human blinking frequencies, or generates asymmetrical eye shutting patterns." },
            { icon: "④", text: "Physics Anomalies: Track falling objects, gravity interactions, water flows, clothing movements, or wind. Real-world physics simulations are extremely difficult for AI video models to compute logically." },
            { icon: "⑤", text: "Metadata & Provenance Check: Use tools like Content Authenticity Initiative (CAI) structures to review cryptographic capture provenance certificates embedded inside video files." }
          ]
        }
      },
      {
        num: "9.3",
        title: "The Ethical Creator Framework",
        body: [
          "As an AI creator, trust is your ultimate currency. When audiences discover they have been misled or manipulated by synthetic media without notice, their relationship with your brand is destroyed permanently.",
          "We advocate a posture of absolute transparency. Establish your brand on truth, taste, and exceptional creative direction — never on deception."
        ],
        callouts: [
          {
            type: "warn",
            title: "The AI Creator Oath",
            body: "1. I will never use AI to propagate malicious, harmful, or false information.\n2. I will transparently label synthetic assets where user expectation assumes real-life context.\n3. I will respect creator copyrights by utilizing authorized training bases and fair-use guidelines."
          },
          {
            type: "tip",
            title: "Caption Watermarking Custom",
            body: "Use simple unobtrusive labeling indicators in your descriptions: 'Visuals generated via Kron Script AI' or 'Cinematics by Aura Tech Systems'."
          }
        ]
      }
    ]
  },
  {
    idx: 10,
    badge: "10",
    menuLabel: "Kron Script AI Workflow",
    eyebrow: "Module 10",
    title: "Kron Script AI Master Workflow",
    subtitle: "Connecting automated storyboards and screenplays into active chat prompts for production scale.",
    lessons: [
      {
        num: "10.1",
        title: "Aura Tech's Flagship Script Engine",
        body: [
          "Kron Script AI is presently in final development. By mastering this complete creator program, you have equipped yourself with the exact structural frameworks, camera techniques, hook systems, and audience retention metrics required to command the platform's advanced functionalities from day one.",
          "Our custom script engine is designed specifically to output professional-standard formatted screenplays, character bibles, scene-by-scene storyboard prompts, and optimized caption banks based on simple, human-directed story ideas."
        ]
      },
      {
        num: "10.2",
        title: "The 7-Phase Creator Pipeline",
        body: [
          "Scale requires systemization. The complete end-to-end AI film production workflow operates in seven sequential phases, from seed ideas to multi-platform distribution."
        ],
        fwBox: {
          title: "The 7-Phase Content Pipeline",
          steps: [
            { icon: "①", text: "Seed Idea & Logline: Formulate the core concept and theme of your piece in a single sentence using prompt principles." },
            { icon: "②", text: "Screenplay: Pass Logline to Kron Script AI to output a structured three-act screenplay complete with character definitions." },
            { icon: "③", text: "Visual Prompts: Exclude redundant details. Kron translates scenes into precise cinematic prompts based on the character bible." },
            { icon: "④", text: "Asset Generation: Generate images and video frames using Midjourney, Flux, Kling, Sora, and Runway systems." },
            { icon: "⑤", text: "Audio Production: Clean, clone, and generate high-fidelity vocal tracks in ElevenLabs, synced with Suno music scoring." },
            { icon: "⑥", text: "Editing & Post: Assemble layers inside CapCut or DaVinci, applying color presets, transitions, and audio sound effects." },
            { icon: "⑦", text: "Optimization: Pass final outputs into Kron's publishing module to generate headlines, caption formulas, and hashtags." }
          ]
        }
      },
      {
        num: "10.3",
        title: "Content Verticals Application Map",
        body: [
          "This production pipeline adapts to virtually any media discipline, giving solo creators the capacity of a full-scale corporate production studio."
        ],
        fwBox: {
          title: "The 5 Content Verticals",
          steps: [
            { icon: "🎬", text: "Cinematic Shorts: Low cost, high-fidelity film generation for YouTube and festival submissions." },
            { icon: "📣", text: "Social Advertising: Dynamic ad variations produced in minutes for targeted e-commerce promotions." },
            { icon: "📺", text: "YouTube Content: Rapid evergreen and browse video scaling with high-retention hook systems." },
            { icon: "📱", text: "Short-Form (TikTok/Reels): High-volume vertical short content utilizing loop story design." },
            { icon: "🎓", text: "Educational Materials: Polished structured presentation slide assets and video guides." }
          ]
        }
      },
      {
        num: "10.4",
        title: "The Scale Model",
        body: [
          "How to go from a solo operator to a scaled creator enterprise using automated pipelines."
        ],
        subsections: [
          {
            title: "The 4 Phases of Scale",
            body: [
              "Phase 1 - Solo Execution (Month 1-3): Do everything manually. Master every node of your production pipeline personally. Complete 10 short films.",
              "Phase 2 - Automation (Month 4-6): Leverage Kron Script AI's bulk script and caption assets to automate creation administrative overhead.",
              "Phase 3 - Outsource (Month 7-9): Hire video editors and project managers to manage visual generations. Focus entirely on creative directing.",
              "Phase 4 - AI Agency Hub (Month 10+): Position your pipeline as an elite B2B creative service. Acquire commercial retainer sponsorships."
            ]
          }
        ]
      },
      {
        num: "10.5",
        title: "AI Production Agency Architecture",
        body: [
          "Corporate brands are desperate for high-volume content, yet lack the technical competence to use modern AI generation pipelines effectively. You can productise your mastery as an elite, high-margin B2B service agency."
        ],
        fwBox: {
          title: "Agency Operational Blueprint",
          steps: [
            { icon: "📥", text: "Onboarding: Extract brand values, aesthetic boundaries, visual references, and primary communication goals." },
            { icon: "⚙️", text: "Strategy: Create 3 core content pillars aligning with their target customer demographics." },
            { icon: "🛠️", text: "Production: Use Kron Script AI to script and storyboard a 30-day content calendar in hours." },
            { icon: "🚀", text: "Delivery: Supply 12 high-retention short videos and 4 polished long-form pieces monthly." },
            { icon: "💳", text: "Retainer: Bill transparently using value-based packaging. A basic setup starts at $3,500/month." }
          ]
        }
      },
      {
        num: "10.6",
        title: "Final Capstone Assignment",
        body: [
          "Your Graduation credential requires practical validation. Complete your Professional Creator Portfolio to present to future brand clients."
        ]
      }
    ],
    assignment: {
      title: "The Premium Creator Portfolio",
      tasks: [
        "Submit 3 complete high-retention short-form scripts formatted beautifully.",
        "Submit 1 fully-rendered AI cinematic short film (under 2 minutes) with original score.",
        "Prepare a written AI Agency Business Proposal outlining onboarding packages for a target brand.",
        "Record a 2-minute video walk-through demonstrating your mastery of prompt engineering schemas."
      ]
    }
  },
  {
    idx: 11,
    badge: "★",
    menuLabel: "Certificate & Roadmap",
    eyebrow: "Graduation and Next Horizons",
    title: "Mastery Certification and the Future",
    subtitle: "You have completed the structural curriculum of the Kron Script AI Creator Mastery Program. Your academic journey is finished, but your creative journey is just beginning.",
    roadmapGrid: [
      { phase: "Month 1-3", title: "Asset Mastery", list: "Perfect the RCATEF prompting framework. Master Midjourney, Flux, and Runway vector paths. Output clean, reliable single assets." },
      { phase: "Month 4-6", title: "Short-Form Automation", list: "Deploy Kron Script AI to script, outline and write short stories in bulk. Publish 3 times weekly. Build high loop metrics." },
      { phase: "Month 7-9", title: "Cinematic Shorts", list: "Develop character bibles and story spines. Produce 3 comprehensive cinematic shorts. Submit to digital festivals." },
      { phase: "Month 10-12", title: "Enterprise Scaling", list: "Launch your AI Content Production Agency. Onboard corporate clients on monthly recurring retainers." }
    ],
    resourceGrid: [
      { icon: "🔑", name: "Aura Tech Discord Circle", desc: "Connect with certified creators, trade visual styling prompts, and access developer pipelines." },
      { icon: "🎬", name: "Master Screenplay Templates", desc: "Industry standard Holly-wood screenplay boundaries formatted for instant drafting." },
      { icon: "🛡️", name: "AI Ethics Framework Guides", desc: "Transparent labeling and licensing parameters to build permanent brand credentials." },
      { icon: "🚀", name: "Kron Launch Exclusive Keys", desc: "Private access tokens granting prioritized server resources when the platform launches." }
    ],
    kronBox: {
      label: "EXCLUSIVELY FOR KRON GRADUATES",
      title: "Unlock Your Kron Beta Invitation keys",
      body: "Our custom platform, Kron Script AI, goes live on the main server soon. As an accredited graduate, your academy profile has been registered in our integration queue. Check your email regularly for your unique alpha-access credentials to begin writing professional screenplays on autopilot."
    },
    letter: {
      greeting: "A Final Message to Our Graduates,",
      body: [
        "You have completed the most comprehensive training of its kind. You now possess a deep, structural understanding of artificial intelligence, prompting psychology, cinematic camera composition, screenwriting architecture, and digital growth metrics.",
        "These skills are not merely technical mechanics — they are the languages of the modern creator. The world of media has changed, and you are positioned to lead it.",
        "Your credential has been validated across our servers. Maintain your dedication to truth, creative taste, and permanent design excellence. We cannot wait to see what you build next.",
        "Welcome to the elite rank of Aura Tech Certified Creators."
      ],
      sig: "— The Aura Tech Engineering Team ✦"
    }
  }
];

export const fullAcademyMasterData = [...academyPart1, ...academyPart2, ...academyPart3];
