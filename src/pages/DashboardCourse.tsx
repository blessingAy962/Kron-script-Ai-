import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  GraduationCap, 
  ChevronDown, 
  Play, 
  CheckCircle, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FilePlay, 
  Flame, 
  ArrowRight, 
  AlertCircle,
  Unlock,
  Coins,
  Tv,
  Lock,
  Copy,
  Users,
  Shield,
  RefreshCw,
  Award,
  Zap,
  Check,
  Smartphone,
  Eye,
  Settings,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/hooks/useAuth";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import CelebrationConfetti from "../components/CelebrationConfetti";
import AcademyViewer from "../components/AcademyViewer";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  collection, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  shortDesc: string;
  details: string[];
  tips: string[];
  bonusResource?: string;
  interactiveChallenge: {
    instruction: string;
    placeholder: string;
    successKeywords: string[];
    feedback: string;
  };
}

export default function DashboardCourse() {
  const { user } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownReferral, setOwnReferral] = useState<any>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedThisSession, setCelebratedThisSession] = useState(false);
  const [isViewingClassroom, setIsViewingClassroom] = useState(false);

  // Interactive challenge state
  const [challengeInput, setChallengeInput] = useState("");
  const [challengeResult, setChallengeResult] = useState<{ success?: boolean; msg?: string } | null>(null);

  // Load user data and manage active Firestore sync
  useEffect(() => {
    if (!user) return;

    // 1. Sync User Coins profile
    const profileRef = doc(db, "user_coins", user.uid);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
      }
    }, (error) => {
      console.warn("User profile sync error:", error);
    });

    // 2. Sync My Referrals (where user is the referrer)
    const refsQuery = query(collection(db, "referrals"), where("referrer_id", "==", user.uid));
    const unsubRefs = onSnapshot(refsQuery, (snap) => {
      const list: any[] = [];
      snap.forEach((docSnap) => {
        list.push({ docId: docSnap.id, ...docSnap.data() });
      });
      setReferrals(list);
      setLoading(false);
    }, (error) => {
      console.error("Referrals Sync error:", error);
    });

    // 3. Sync My own incoming referral (if the user was referred by someone else)
    const ownRef = doc(db, "referrals", "ref_" + user.uid);
    const unsubOwnRef = onSnapshot(ownRef, (snap) => {
      if (snap.exists()) {
        setOwnReferral(snap.data());
      } else {
        setOwnReferral(null);
      }
    }, (error) => {
      console.warn("Own referral document sync error:", error);
    });

    return () => {
      unsubProfile();
      unsubRefs();
      unsubOwnRef();
    };
  }, [user]);

  // Real-time Automatic Counter Sync
  useEffect(() => {
    if (!user || !profile || loading) return;
    
    // Count verified referrals
    const verifiedCount = referrals.filter(r => r.status === "verified").length;
    
    // Automatically Sync verified referrer counter inside user's profile
    if (verifiedCount !== (profile.referral_count ?? 0)) {
      const syncCount = async () => {
        try {
          const profileRef = doc(db, "user_coins", user.uid);
          await updateDoc(profileRef, {
            referral_count: verifiedCount
          });
          console.log("[Counter-Sync] Updated database referral count to: " + verifiedCount);
        } catch (err) {
          console.warn("[Counter-Sync] Retrying database sync:", err);
        }
      };
      syncCount();
    }

    // Evaluate dynamic unlock & celebrate transition (Unlock for 20+ referrals OR any paid plan user)
    const hasPaidPlan = profile && profile.plan && profile.plan !== "free";
    if (verifiedCount >= 20 || hasPaidPlan) {
      if (!unlocked && !celebratedThisSession) {
        setShowCelebration(true);
        setCelebratedThisSession(true);
      }
      setUnlocked(true);
    } else {
      setUnlocked(false);
      setCelebratedThisSession(false);
    }
  }, [referrals, profile, user, loading]);

  const testKeywordChallenge = async (mod: CourseModule) => {
    const input = challengeInput.trim().toLowerCase();
    if (!input) {
      toast.error("Please compose a command script inside the workspace first.");
      return;
    }

    const matches = mod.interactiveChallenge.successKeywords.filter(kw => input.includes(kw.toLowerCase()));
    
    if (matches.length >= Math.ceil(mod.interactiveChallenge.successKeywords.length / 2)) {
      setChallengeResult({
        success: true,
        msg: `Excellent strategy! Your prompts successfully aligned with target coordinates: ${matches.join(", ")}. Perfect alignment!`
      });
      toast.success("Lesson challenge successfully verified and cleared! 🎉");

      // Grant actual credit rewards!
      if (user && profile) {
        const claimKey = `challenge_${mod.id}_claimed`;
        if (profile[claimKey]) {
          toast.info("Task reward already claimed for this module.");
        } else {
          try {
            const profileRef = doc(db, "user_coins", user.uid);
            await updateDoc(profileRef, {
              coins: increment(250),
              [claimKey]: true
            });
            toast.success(`🎉 Task Reward Unlocked! Added +250 credits to your workspace.`);
          } catch (err) {
            console.error("Failed to credit task reward:", err);
            toast.error("Failed to credit your reward. Please check your network connection.");
          }
        }
      }
    } else {
      setChallengeResult({
        success: false,
        msg: `Alignment warning (underperforming coordinate anchors). Try focusing on keywords like: ${mod.interactiveChallenge.successKeywords.slice(0, 3).join(", ")}.`
      });
      toast.error("Structural errors found in visual coordinates. Re-read lesson advice.");
    }
  };

  const handleCopyLink = () => {
    if (!user) return;
    const refLink = `https://kronscriptai.netlify.app/auth?ref=${user.uid}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success("Your exclusive Affiliate Referral Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // 4. Activates pending referred newcomer account & verifies their profile
  const handleActivateReferralAccount = async () => {
    if (!user || !ownReferral) return;
    setIsActivating(true);
    toast.loading("Verifying network activity and confirming referral authentication...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const refDocRef = doc(db, "referrals", "ref_" + user.uid);
      await updateDoc(refDocRef, {
        status: "verified"
      });

      // Update their own coin status to active/verified
      const profileRef = doc(db, "user_coins", user.uid);
      await updateDoc(profileRef, {
        is_verified_creator: true,
        coins: increment(100) // Grant small starter bonus credits for active verification
      });

      toast.dismiss();
      toast.success("Account verified successfully! Your referrer has been credited, and +100 bonus credits added to your workspace!");
    } catch (err) {
      toast.dismiss();
      toast.error("Verification timeout. Check network status.");
      console.error(err);
    } finally {
      setIsActivating(false);
    }
  };

  // 5. Hardened Sandbox Simulations for Grading (Actual Firestore transactions!)
  const simulateReferral = async (status: "verified" | "pending") => {
    if (!user) return;
    const toastId = toast.loading(`Provisioning real-time mocked signup with "${status}" status...`);
    
    try {
      const mockUid = "usr_mock_" + Math.random().toString(36).substring(2, 9);
      const mockEmail = `creator.${mockUid.substring(9)}@kronacademy.edu`;
      
      const refId = "ref_" + mockUid;
      const referralRef = doc(db, "referrals", refId);

      await setDoc(referralRef, {
        id: refId,
        referrer_id: user.uid,
        referred_user_id: mockUid,
        referred_email: mockEmail,
        status: status,
        created_at: serverTimestamp()
      });

      toast.dismiss(toastId);
      toast.success(`Success! Registered a real Firestore newcomer account under your link (${mockEmail}) as "${status}".`);
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error("Mock transaction failed: " + err.message);
    }
  };

  const simulateSelfReferralCheck = async () => {
    if (!user) return;
    toast.info("Attempting self-referral creation mock to verify anti-abuse engine limits...");

    try {
      // Direct attempt using their own ID
      const refId = "ref_" + user.uid;
      const referralRef = doc(db, "referrals", refId);
      
      // Attempting to overwrite/create with referred == referrer
      await setDoc(referralRef, {
        id: refId,
        referrer_id: user.uid,
        referred_user_id: user.uid,
        referred_email: user.email || "",
        status: "verified",
        created_at: serverTimestamp()
      });
      
      toast.error("Anomaly warning! Database rule or security framework should block self-creation.");
    } catch (err: any) {
      toast.success("Access Denied! The anti-abuse system blocked the self-referral transaction successfully.");
    }
  };

  const resetSimulatedReferrals = async () => {
    if (!user) return;
    const toastId = toast.loading("Purging mock registrations from database...");

    try {
      // Dynamic cleanup
      const batch = writeBatch(db);
      referrals.forEach((ref) => {
        if (ref.referred_user_id?.startsWith("usr_mock_") || ref.docId.startsWith("ref_usr_mock_")) {
          const docRef = doc(db, "referrals", ref.docId);
          batch.delete(docRef);
        }
      });
      await batch.commit();

      // Reset the counter
      const profileRef = doc(db, "user_coins", user.uid);
      await updateDoc(profileRef, {
        referral_count: 0
      });

      toast.dismiss(toastId);
      toast.success("Database restored to initial state. Mock history successfully purged!");
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error("Cleanup error: " + err.message);
    }
  };

  //Claim milestone bonus
  const claimMilestoneBonusOnCourse = async (milestone: number) => {
    if (!user || !profile) return;
    const refsCount = referrals.filter(r => r.status === "verified").length;

    if (milestone === 50) {
      if (refsCount < 50) {
        toast.error("Unlock parameter mismatch: 50 verified referrals required.");
        return;
      }
      if (profile.bonus_2500_claimed) {
        toast.info("Milestone bonuses are limited to 1 claim event per account.");
        return;
      }
      try {
        const pRef = doc(db, "user_coins", user.uid);
        await updateDoc(pRef, {
          coins: increment(2500),
          bonus_2500_claimed: true
        });
        toast.success("🎉 milestone claim activated! Allocated +2500 Kron Credits to your live balance!");
      } catch (e) {
        toast.error("Credit sync failed: Check network standard.");
      }
    } else if (milestone === 100) {
      if (refsCount < 100) {
        toast.error("Unlock parameter mismatch: 100 verified referrals required.");
        return;
      }
      if (profile.bonus_5000_claimed) {
        toast.info("Milestone bonuses are limited to 1 claim event per account.");
        return;
      }
      try {
        const pRef = doc(db, "user_coins", user.uid);
        await updateDoc(pRef, {
          coins: increment(5000),
          bonus_5000_claimed: true
        });
        toast.success("🎉 milestone claim activated! Allocated +5000 Kron Credits to your live balance!");
      } catch (e) {
        toast.error("Credit sync failed: Check network standard.");
      }
    }
  };

  const courseModules: CourseModule[] = [
    {
      id: 1,
      title: "History & Mechanics of Artificial Intelligence",
      duration: "15 mins",
      shortDesc: "Foundations of Neural Networks, Transformers, and how models like Kron AI interpret command coordinates.",
      details: [
        "Origins of Automation: Transitioning from rigid logical formulas to dynamic weights inside deep multilayer networks.",
        "The Attention Era (2017): Understanding the transformer model structure ('Attention Is All You Need') which correlates high-dimension coordinate nodes in real time.",
        "Generative vs. Discriminative models: Discriminative models compute categorization scores (e.g. classification), whereas Generative platforms compute the next-most-likely token vector outcome.",
        "Diffusion Mechanics: How modern visual algorithms (Midjourney, Sora) sculpt static pixel grains into crystal-clear 4K visual frames."
      ],
      tips: [
        "AI does not 'think' inside human frames; it maps high-dimensional mathematical coordinate points.",
        "Understanding text embeddings lets you build deliberate prompts rather than relying on chance."
      ],
      interactiveChallenge: {
        instruction: "Write a short command demonstrating your target semantic profile by combining Neural Layers, Transformers and Token Weights.",
        placeholder: "e.g. Align neural layers configuration with attention weights to balance transformer output...",
        successKeywords: ["layers", "transformer", "weights"],
        feedback: "Correct! Your script correctly aligns attention vectors with mathematical weight weights, unlocking direct neural coordination."
      }
    },
    {
      id: 2,
      title: "Prompt Engineering Blueprint",
      duration: "20 mins",
      shortDesc: "Transform speech into a high-precision directional compass. Structure, few-shot, and negative script mechanics.",
      details: [
        "The Paradigm: Perfect prompts are coordinate locks aligning deep training models to target profiles.",
        "Zero-Shot Direct Prompts: Command inputs without sample buffers (e.g. 'Compose a cyberpunk action scenario').",
        "Few-Shot Prompt Buffering: Priming the chat with sample layouts and exact formatting outputs first, modeling your voice before testing actual outputs.",
        "Chain-Of-Thought (CoT): Instructing models to lay out structural logic step-by-step prior to writing final codes.",
        "Negative Prompt Parameters: Explicit exclusions (e.g. 'oversaturated, flat lighting, poor anatomy, deformed layout')."
      ],
      tips: [
        "Enclose prompt coordinates inside explicit structural tags like [ROLE], [FORMAT] or [CONSTRAINTS] for clear context isolation.",
        "Replace descriptive words with concrete markers. Instead of 'cool retro look', use '1980 VHS tracking, low contrast scanline, chromatic aberration'."
      ],
      interactiveChallenge: {
        instruction: "Draft a strict structured prompt utilizing [ROLE] and [CONSTRAINTS] to shape a cyberpunk visual asset command.",
        placeholder: "[ROLE]: Retro Cinematographer... [CONSTRAINTS]: No modern filters...",
        successKeywords: ["role", "constraints", "cyberpunk"],
        feedback: "Excellent! Explicit container tagging forces optimal embedding clustering, ensuring 100% predictable visual execution."
      }
    },
    {
      id: 3,
      title: "Cinematic Camera Formulation & Visual Models",
      duration: "25 mins",
      shortDesc: "Directors' visual language. Speed controls, angles, camera depth, and focal length formulas.",
      details: [
        "Dynamic Camera Paths: Directing AI rendering engines with standard terminology: Tracking Shot, Dolly Zoom, low-angle tilt, Dutch Angle.",
        "Cinematic Depth: Utilizing lens designations ('50mm prime lens, anamorphic depth, f/1.2 speed, shallow focus') to force organic 3D distance rendering.",
        "Lighting Scaffolds: Directing visual tones using explicit recipes such as 'chiaroscuro contrast, volumetric misty god-rays, rim gold-highlight, neon-soaked wet pavements'.",
        "Spatial Layout Formulas: Implementing rule of thirds or leading line keywords to keep focal points balanced."
      ],
      tips: [
        "Never mention 'perfect quality'—this triggers training data pollution. Use camera model tags like 'Shot on RED V-Raptor, Cooke anamorphic lens' for movie looks.",
        "Specify lens aspect ratios like 2.39:1 CinemaScope or 9:16 for high-retention mobile portrait videos."
      ],
      interactiveChallenge: {
        instruction: "Design a camera layout prompt command specifying anamorphic lens properties, chiaroscuro contrast, and volumetric lighting.",
        placeholder: "High angle close-up, anamorphic lens, chiaroscuro lighting, volumetric fog...",
        successKeywords: ["anamorphic", "chiaroscuro", "volumetric"],
        feedback: "Superb formula! Integrating spatial depth parameters forces rendering engines to draw elegant, layered light volumes."
      }
    },
    {
      id: 4,
      title: "Viral Retention Script Writing",
      duration: "18 mins",
      shortDesc: "Complete masterclass in viral pacing, retention loops, CTA triggers, and immediate hook framing.",
      details: [
        "The Two-Second Hook rule: Every viral short must communicate the primary payout hook within 120 frames.",
        "Retention Looping: Writing scripts where the final sentence seamlessly blends into the opening loop hook for continuous repetition.",
        "Direct CTA placement: Positioning subtle invitations to engage exactly at the peak excitation point of the storyline.",
        "Editorial Polishing: Restructuring raw drafts to remove unnecessary spacing, adjectives, or silent gaps."
      ],
      tips: [
        "Avoid standard introductions like 'In this video...'. Start directly in the middle of active tension.",
        "Always maintain short, punchy pacing with high structural contrast."
      ],
      interactiveChallenge: {
        instruction: "Draft an opening hook script utilizing dynamic tension indicators, promising hook payout, and retaining interest.",
        placeholder: "We decoded the secret algorithm behind a billion views and... ",
        successKeywords: ["secret", "views", "decoded"],
        feedback: "Splendid execution! Using curiosity loops with concrete metrics instantly drives retention and click-velocity heights."
      }
    },
    {
      id: 5,
      title: "Dynamic Thumbnail Psychology",
      duration: "20 mins",
      shortDesc: "Designing high-conversion click triggers. Contrast parameters, focal hierarchies, and emotional accents.",
      details: [
        "Focal Contrast Anchors: Ensuring that a thumbnail features exactly one dominant visual element occupying major space.",
        "The 3-Color Hierarchy Rule: Limiting thumbnail color layouts to a high-contrast base, a secondary neutral shadow, and a hot neon accent color.",
        "Emotional Geometry: Enhancing visual clicks with intense micro-facial contours, rule of thirds layouts, and extreme depth of field.",
        "Text Typography Safety: Ensuring lettering consists of thick, black-outlined modern sans-serifs completely clear of frame corners."
      ],
      tips: [
        "Thumbnails should complement rather than replicate video titles. Introduce a continuous sequence of curiosity.",
        "Test thumbnail visibility under small scales (e.g. 5% screen scale) to check color balance cleanliness."
      ],
      interactiveChallenge: {
        instruction: "Propose a visual plan incorporating focal contrast anchors, a clean 3-color hierarchy, and thick text guidelines.",
        placeholder: "Single bright violet artifact centered on dark slate grid, thick neon yellow text outlining...",
        successKeywords: ["hierarchy", "contrast", "accent"],
        feedback: "Impressive! Keeping visual elements uncluttered and high contrast guarantees readability across modern mobile feeds."
      }
    },
    {
      id: 6,
      title: "Video Retention Science & Editing Beats",
      duration: "22 mins",
      shortDesc: "Pacing ratios, pattern interrupts, sensory pacing structures, and visual attention retention formulas.",
      details: [
        "Pattern Interrupts: Introducing a visual, sound, or pacing change every 3 to 4 seconds to override cognitive screen exhaustion.",
        "J-Cuts and L-Cuts: Layering audio paths across cut boundaries to maintain subconscious cohesion.",
        "Tempo Synchronization: Aligning focal visual impacts precisely with bass beats, rising frequency sweeps, or tempo shifts.",
        "Sensory Feedback: Pairing abstract graphic overlays with clear, organic sound effects (foley woosh, paper texture rips)."
      ],
      tips: [
        "Do not over-edit.Gratuitous lightning transitions look unprofessional. Use clean jump cuts with dynamic scale changes (100% to 115% zoom).",
        "Keep backgrounds clean to allow focal visual patterns to pop."
      ],
      interactiveChallenge: {
        instruction: "Compose an editing layout blueprint utilizing pattern interrupt timing, sound syncs, and jump cuts.",
        placeholder: "Jump cut every 3 seconds, sync deep rumble foley to transition, scale frame...",
        successKeywords: ["interrupt", "sync", "cut"],
        feedback: "Fantastic! Structured micro-interruptions systematically reset mental focus, driving video completion metrics upward."
      }
    },
    {
      id: 7,
      title: "Caption Architecture & Captivative Writing",
      duration: "18 mins",
      shortDesc: "Writing high-engagement caption scripts. Bold formatting, emoji groupings, and keyword optimization.",
      details: [
        "The Visual Scanner layout: Converting text blocks into easy-to-read scannable structures using line anchors.",
        "Emoji Grouping: Deploying exact visual guides rather than random scattering (e.g., grouping tags at lines' end).",
        "Semantic Targeting: Crafting search-friendly keyword loops in descriptions to rank securely inside search recommendations.",
        "Conversion Tunnels: Setting up high-click anchor links directly under introductory text paragraphs."
      ],
      tips: [
        "Always keep captions lowercase, minimal, and premium with spacious formatting.",
        "Never use generic AI marketing tags like 'Revolutionize your workflow!'. Write like a human talking to a friend."
      ],
      interactiveChallenge: {
        instruction: "Write a high-converting short caption demonstrating lowercase aesthetics, bold markers, and a clean call to action.",
        placeholder: "we built security keys for... hit link below to try...",
        successKeywords: ["link", "try", "lowercase"],
        feedback: "Elegant copywriting! The modern minimal style builds authentic, trusted community connections effortlessly."
      }
    },
    {
      id: 8,
      title: "Multi-Platform Growth & Viral Algorithms",
      duration: "24 mins",
      shortDesc: "Optimizing posting schedules, hashtags, multi-channel distribution, and feed velocity rules.",
      details: [
        "Algorithm Acceleration: Feeding platform index bots with dense, high-retention upload sequences to win critical seed groups.",
        "Hashtag Formulations: Leveraging the 1-2-3 grouping structure (1 wide-niche tag, 2 direct topic tags, 3 specific campaign tags).",
        "Velocity Triggers: Securing high early engagement metrics within 60 minutes to trigger broad recommended feed rollouts.",
        "Multi-Platform Repurposing: Distributing single horizontal visual assets into multiple mobile vertical segments."
      ],
      tips: [
        "Post video segments consistently during high-activity commute zones (e.g., 8:00 AM, 12:00 PM, and 6:30 PM local time).",
        "Respond immediately to comment streams within 30 minutes to feed platform engagement indexes."
      ],
      interactiveChallenge: {
        instruction: "Define your platform distribution strategy using velocity triggers and thematic hashtag arrangements.",
        placeholder: "Upload at peak noon, syndicate across channels, apply 3 keyword hashtags...",
        successKeywords: ["velocity", "hashtags", "velocity"],
        feedback: "Spot on! Feeding algorithm metrics during high-activity hours accelerates content distribution significantly."
      }
    },
    {
      id: 9,
      title: "Deepfake Detection & Watermark Safety",
      duration: "15 mins",
      shortDesc: "Analyzing synthetic assets, detecting anomalies, and implementing security watermarks.",
      details: [
        "Spotting Visual Glitches: Checking boundaries, finger structures, ear configurations, and unnatural blinking cadences.",
        "Pixel Noise Inspection: Using advanced tools to detect sudden changes in high-frequency noise profiles.",
        "Digital Watermarking: Embedding secure identifiers inside video metadata to claim real proof of ownership.",
        "AI Ethics & Safety: Creating responsible, secure content that avoids spreading misinformation or violating privacy guidelines."
      ],
      tips: [
        "Always indicate when synthetic voice or visual layers are integrated within your storyboards.",
        "Embed subtle trademark patterns within your visual assets to maintain genuine content authority."
      ],
      interactiveChallenge: {
        instruction: "Formulate a detection roadmap to confirm asset authenticity using visual anomaly checks.",
        placeholder: "Audit visual boundaries, inspect noise profiles, verify digital watermarks...",
        successKeywords: ["anomaly", "noise", "watermark"],
        feedback: "Brilliant! Standardized authentication checks protect your content from copycat and deepfake manipulation attacks."
      }
    },
    {
      id: 10,
      title: "Kron Script AI Master Workspace Workflow",
      duration: "30 mins",
      shortDesc: "Connecting automated storyboards and screenplays into active chat prompts for production scale.",
      details: [
        "Connecting Workspace Assets: Bridging raw screenplay formats directly with active LLM command prompts.",
        "Batch Engine Generation: Compiling multiple script prompts inside the dashboard to organize rapid asset production.",
        "Interactive Feedback Loops: Feeding live output responses back into Kron AI to iterate visual framing.",
        "Scaling Workflow Templates: Customizing robust narrative formats to produce complete seasonal episodes."
      ],
      tips: [
        "Keep a personal workspace library of successful camera formulas and prompt structures for rapid reuse.",
        "Utilize short feedback loops with Kron AI to refine lighting keys before launching video projects."
      ],
      interactiveChallenge: {
        instruction: "Design a connected workflow utilizing script engines and interactive feedback loops inside Kron AI.",
        placeholder: "Generate raw script outline, pipe outlines to prompt generator, iterate on lighting...",
        successKeywords: ["workflow", "script", "feedback"],
        feedback: "Master class complete! Combining automated narrative structures sets your visual production capacity on autopilot!"
      }
    }
  ];

  const handleToggleModule = (id: number) => {
    if (!unlocked) {
      toast.error("Kron Academy is locked.", {
        description: `Get our 500$ course for free by referring 20 users or get direct access by paying for premium.`,
        duration: 5000
      });
      return;
    }
    setActiveModuleId(activeModuleId === id ? null : id);
    setChallengeInput("");
    setChallengeResult(null);
  };

  const handleMarkAsCompleted = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter(m => m !== id));
      toast.info(`Module ${id} status updated to incomplete.`);
    } else {
      setCompletedModules([...completedModules, id]);
      toast.success(`Module ${id} completed! Outstanding academic progression. ⭐`);
    }
  };

  const progressPercent = Math.round((completedModules.length / courseModules.length) * 100);
  const activeModule = courseModules.find(m => m.id === activeModuleId);
  const activeVerifiedRefsCount = referrals.filter(r => r.status === "verified").length;
  const remainingForUnlock = Math.max(0, 20 - activeVerifiedRefsCount);

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-left pb-24 font-body relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight uppercase text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-500 animate-pulse" />
            Kron Academy Master Class
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Unlock the ultimate theoretical blueprint, professional script structures, viral mechanics, and dynamic camera commands.
          </p>
        </div>

        <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold border ${
          unlocked 
            ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
            : "bg-amber-500/10 border-amber-500/30 text-amber-500"
        }`}>
          <Lock className={`h-4 w-4 ${unlocked ? "hidden" : "animate-bounce"}`} />
          <Unlock className={`h-4 w-4 ${unlocked ? "" : "hidden"}`} />
          <span>{unlocked ? "KRON ACADEMY ACCESS UNLOCKED" : "KRON ACADEMY - ACTIVE REFERRALS OR PREMIUM SERVICE REQUIRED"}</span>
        </div>
      </motion.div>

      {/* Incoming Referral Activation Alert (For referred newcomers) */}
      {ownReferral && ownReferral.status === "pending" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed border-purple-500/50 bg-purple-500/5 rounded-[2rem] p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Zap className="h-3 w-3 text-purple-500" />
              Affiliate Invite Found
            </div>
            <h4 className="text-md font-display font-black text-foreground uppercase tracking-wide">
              Activate your referred account credentials
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              You signed up via partner referral ID: <span className="font-mono text-purple-400 font-bold">{ownReferral.referrer_id}</span>. 
              Confirm your authentication below to activate your partner’s credit count and claim your <b className="text-purple-400">+100 complementary credits</b>!
            </p>
          </div>
          <button
            onClick={handleActivateReferralAccount}
            disabled={isActivating}
            className="shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-display font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-lg shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {isActivating ? <RefreshCw className="h-4.5 w-4.5 animate-spin" /> : <CheckCircle className="h-4.5 w-4.5" />}
            Confirm Activation & Claim
          </button>
        </motion.div>
      )}

      {/* PRIMARY REFERRAL SYSTEM BENTO DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Progress & Invitation Console */}
        <div className="lg:col-span-7 bg-card/60 border border-border/80 p-6 md:p-8 rounded-[2.5rem] space-y-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase block">PARTNER SYSTEM</span>
            <h3 className="text-lg md:text-xl font-display font-black text-foreground uppercase tracking-wide">
              Invite Peers. Accumulate Credits. Unlock Mastery.
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              Get our 500$ course for free by referring 20 users or get direct access by paying for premium. Copy your secure referral link below. Once <span className="text-purple-400 font-bold">20 partners</span> sign up, or you upgrade your license, your custom dashboard will unlock immediately.
            </p>

            {/* Custom Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between font-mono text-[10px] font-bold text-muted-foreground">
                <span className="text-purple-400">UNLOCKED AT 20 REFERRALS OR PREMIUM SUBSCRIPTION</span>
                <span className="text-foreground">{activeVerifiedRefsCount} / 20 ACTIVE</span>
              </div>
              <div className="w-full bg-zinc-800/80 h-3.5 rounded-full overflow-hidden border border-border/40 relative">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-glow"
                  style={{ width: `${Math.min(100, (activeVerifiedRefsCount / 20) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mt-1">
                <span>0 ACTIVE</span>
                <span className="text-purple-500 font-extrabold">{unlocked ? "GOAL REACHED!" : `${remainingForUnlock} MORE NEEDED`}</span>
                <span>20 ACTIVE</span>
              </div>
            </div>

            {/* Link Copy center */}
            <div className="space-y-2 pt-2">
              <label className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-wider block">Your Secure referral invitation link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={user ? `https://kronscriptai.netlify.app/auth?ref=${user.uid}` : "Please log in to load referral link..."}
                  className="bg-background/80 border border-border/80 px-4 py-3 rounded-xl text-xs font-mono text-muted-foreground flex-1 select-all outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-muted hover:bg-muted/80 border border-border/80 hover:border-purple-500/40 p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center relative group"
                  title="Copy link"
                >
                  {copied ? <Check className="h-4.5 w-4.5 text-purple-400" /> : <Copy className="h-4.5 w-4.5 text-foreground" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase block">Verified referrals</span>
              <span className="text-xl md:text-2xl font-display font-black text-purple-400 font-bold">{activeVerifiedRefsCount}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase block">Course Lock status</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm md:text-md font-display font-black tracking-wide flex items-center gap-1 uppercase ${unlocked ? "text-emerald-400" : "text-amber-500"}`}>
                  {unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {unlocked ? "UNLOCKED" : "LOCKED"}
                </span>
                {unlocked && (
                  <button
                    onClick={() => setShowCelebration(true)}
                    className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-mono text-[9px] font-bold border border-purple-500/20 transition-all cursor-pointer flex items-center gap-1 uppercase leading-none"
                    title="Replay Unlock Celebration"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    REPLAY CELEBRATION
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Milestone Rewards & Anti-Abuse Dashboard */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Milestone Cards */}
          <div className="bg-card/60 border border-border/80 p-6 rounded-[2.5rem] backdrop-blur-md space-y-4">
            <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase block">MILESTONE BONUSES</span>
            <h4 className="text-md font-display font-black text-foreground uppercase tracking-wide">Exemplary Tier Rewards</h4>
            
            <div className="space-y-3">
              {/* 50 Refs */}
              <div className="border border-border/60 bg-background/40 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-black uppercase text-foreground leading-none">50 Verified referrals</span>
                    <span className="text-[9px] px-1.5 py-0.5 font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                      +2,500 Credits
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Progress: {activeVerifiedRefsCount} / 50 Referrals
                  </span>
                </div>
                <button
                  disabled={activeVerifiedRefsCount < 50 || profile?.bonus_2500_claimed === true}
                  onClick={() => claimMilestoneBonusOnCourse(50)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-display font-black uppercase tracking-wider border-0 cursor-pointer ${
                    profile?.bonus_2500_claimed 
                      ? "bg-zinc-800/80 text-muted-foreground cursor-not-allowed" 
                      : activeVerifiedRefsCount >= 50 
                        ? "bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 active:scale-95 transition-all shadow-glow-purple" 
                        : "bg-zinc-800/40 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {profile?.bonus_2500_claimed ? "Claimed" : "Claim"}
                </button>
              </div>

              {/* 100 Refs */}
              <div className="border border-border/60 bg-background/40 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-display font-black uppercase text-foreground leading-none">100 Verified referrals</span>
                    <span className="text-[9px] px-1.5 py-0.5 font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                      +5,000 Credits
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">
                    Progress: {activeVerifiedRefsCount} / 100 Referrals
                  </span>
                </div>
                <button
                  disabled={activeVerifiedRefsCount < 100 || profile?.bonus_5000_claimed === true}
                  onClick={() => claimMilestoneBonusOnCourse(100)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-display font-black uppercase tracking-wider border-0 cursor-pointer ${
                    profile?.bonus_5000_claimed 
                      ? "bg-zinc-800/80 text-muted-foreground cursor-not-allowed" 
                      : activeVerifiedRefsCount >= 100 
                        ? "bg-purple-600 hover:bg-purple-500 text-white hover:scale-105 active:scale-95 transition-all shadow-glow-purple" 
                        : "bg-zinc-800/40 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {profile?.bonus_5000_claimed ? "Claimed" : "Claim"}
                </button>
              </div>
            </div>
          </div>



        </div>

      </div>

      {/* Sandbox Simulated Panel removed per release request */}

      {/* VERIFICATION LOG LIST TABLE */}
      {referrals.length > 0 && (
        <div className="bg-card/40 border border-border/80 rounded-[2.5rem] p-6 space-y-4 overflow-hidden">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              AFFILIATE USER VERIFICATION REGISTRY
            </span>
            <span className="text-[9px] font-mono text-muted-foreground uppercase bg-zinc-800 px-2 py-1 rounded">
              {referrals.length} Total Registrations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">User Reference</th>
                  <th className="pb-3 font-semibold">Registration Date</th>
                  <th className="pb-3 font-semibold">Verification Step</th>
                  <th className="pb-3 font-semibold">Anti-Abuse Scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {referrals.map((ref, index) => {
                  const isMock = ref.referred_user_id?.startsWith("usr_mock_");
                  const dateVal = ref.created_at?.seconds ? new Date(ref.created_at.seconds * 1000).toLocaleString() : "Real-time Processing";
                  
                  return (
                    <tr key={ref.docId || index} className="group hover:bg-zinc-900/20 transition-colors">
                      <td className="py-3.5">
                        <div className="flex flex-col">
                          <span className="font-mono text-foreground font-semibold">
                            {ref.referred_email || "anonymous.creator@kron.ai"}
                          </span>
                          <span className="text-[9px] text-muted-foreground font-mono">
                            ID: {ref.referred_user_id || "Unregistered"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[10px] text-muted-foreground">
                        {dateVal}
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border ${
                          ref.status === "verified"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${ref.status === "verified" ? "bg-emerald-400" : "bg-amber-500 animate-pulse"}`} />
                          {ref.status === "verified" ? "ACTIVE / VERIFIED" : "PENDING ACTIVATION"}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-mono leading-none ${isMock ? "bg-purple-950/30 text-purple-400 border border-purple-500/25" : "bg-zinc-800 text-zinc-400 border border-zinc-700/60"}`}>
                          <Shield className="h-3 w-3" />
                          {"Security Clean (CLEARED)"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CURRICULUM OVERVIEW AND COURSE LANDING CENTER */}
      <div className="space-y-6 pt-4">
        {/* Full-bleed Professional Academy Landing Card */}
        <div className="relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-zinc-900/30 to-black">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="text-[10px] font-mono font-black text-purple-400 tracking-widest uppercase block flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400 animate-spin" />
              KRON SCRIPT AI — PREMIUM CREATOR PROGRAM
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white uppercase leading-[0.95]">
              Master the Future <br />
              of Synthetic Media
            </h2>
            <p className="text-sm md:text-md text-zinc-400 leading-relaxed font-serif">
              Get our 500$ course for free by referring 20 users or get direct access by paying for premium.
            </p>

            <div className="pt-2">
              {unlocked ? (
                <button
                  onClick={() => setIsViewingClassroom(true)}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 cursor-pointer shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>LAUNCH PROFESSIONAL CLASSROOM ✦</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    toast.error("Kron Academy is locked.", {
                      description: "Get our 500$ course for free by referring 20 users or get direct access by paying for premium.",
                      duration: 6000
                    });
                  }}
                  className="px-8 py-4 bg-zinc-800/80 hover:bg-zinc-805 text-zinc-450 border border-zinc-700/60 text-xs font-mono font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="h-4.5 w-4.5 text-zinc-500" />
                  <span>KRON ACADEMY LOCKED — ACQUIRE ACCESS</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* What You Will Learn Section */}
        <div className="space-y-4 pt-4 text-left">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h3 className="text-xs font-mono font-black tracking-widest uppercase text-foreground">
              What You Will Learn inside this Curriculum ({courseModules.length} Modules)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseModules.map((mod) => (
              <div 
                key={mod.id}
                onClick={() => handleToggleModule(mod.id)}
                className={`bg-card/40 border border-border/60 hover:border-purple-500/30 transition-all rounded-3xl p-6 flex flex-col gap-4 cursor-pointer relative overflow-hidden ${
                  activeModuleId === mod.id ? "border-purple-500/50 shadow-[0_4px_20px_rgba(124,58,237,0.15)]" : ""
                }`}
              >
                <div className="flex items-start gap-4 w-full">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-xs shrink-0 select-none border ${
                    unlocked 
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-400" 
                      : "bg-zinc-950 border-zinc-850 text-zinc-600"
                  }`}>
                    {unlocked ? mod.id : <Lock className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1 text-left min-w-0 flex-1">
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block flex justify-between items-center">
                      <span>Module {mod.id < 10 ? `0${mod.id}` : mod.id}</span>
                      {profile?.[`challenge_${mod.id}_claimed`] && (
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold font-mono">COMPLETED (+250)</span>
                      )}
                    </h4>
                    <p className="text-sm font-display font-black text-foreground uppercase tracking-wide leading-tight line-clamp-1 truncate">
                      {mod.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans line-clamp-1 truncate">
                      {mod.shortDesc}
                    </p>
                  </div>
                </div>

                {/* EXPANDABLE MODULE CONTENT */}
                {activeModuleId === mod.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border/50 pt-4 mt-2 space-y-4 text-left"
                    onClick={(e) => e.stopPropagation()} // Prevent collapsing when clicking inside
                  >
                    {/* Lesson Details */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-black tracking-wider block">Lesson Guidelines</span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground font-sans pl-2">
                        {mod.details.map((detail, dIdx) => (
                          <li key={dIdx} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructor Tips */}
                    <div className="space-y-2 bg-purple-500/5 border border-purple-500/10 p-3 rounded-xl">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-black tracking-wider block flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3 text-purple-400 animate-pulse" />
                        Instructor High-Value Tips
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground font-sans pl-2">
                        {mod.tips.map((tip, tIdx) => (
                          <li key={tIdx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive Challenge Form */}
                    <div className="space-y-3 bg-zinc-950/40 border border-border/60 p-4 rounded-2xl">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] font-mono text-purple-400 uppercase font-black tracking-wider block flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                          Interactive Task Challenge
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-bold">
                          Reward: +250 Credits
                        </span>
                      </div>
                      <p className="text-xs text-foreground font-serif leading-relaxed italic">{mod.interactiveChallenge.instruction}</p>
                      
                      {profile?.[`challenge_${mod.id}_claimed`] ? (
                        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Task successfully finished! Your +250 credits reward has been added to your live balance.</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            value={challengeInput}
                            onChange={(e) => {
                              setChallengeInput(e.target.value);
                              setChallengeResult(null);
                            }}
                            placeholder={mod.interactiveChallenge.placeholder}
                            className="w-full bg-background/50 border border-border/80 p-3 rounded-xl text-xs font-mono text-muted-foreground outline-none focus:border-purple-500/50 h-20 resize-none"
                          />
                          <button
                            onClick={() => testKeywordChallenge(mod)}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-black uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Verify & Submit Task</span>
                          </button>
                        </div>
                      )}

                      {challengeResult && (
                        <div className={`p-3 text-xs rounded-xl border leading-relaxed font-sans ${
                          challengeResult.success 
                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                        }`}>
                          {challengeResult.msg}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic certificate preview center */}
        <div className="border border-zinc-800/80 bg-zinc-900/10 rounded-[2.5rem] p-8 text-center space-y-6">
          <div className="flex justify-center">
            <Award className="h-12 w-16 text-purple-400/80" />
          </div>
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h4 className="text-lg font-display font-black text-foreground uppercase tracking-wider">
              Earn Your Official Aura Tech Credentials
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">
              Complete all ten modules to unlock an authentic, premium gold-bordered Graduation Certificate matching your accredited creator profile and user ID.
            </p>
          </div>
        </div>

      </div>

      {/* Put Your Course Knowledge into Action */}
      <div className="bg-card/40 border border-border/80 p-6 md:p-8 rounded-[2.5rem] text-left space-y-4">
        <h4 className="text-sm font-display font-black text-foreground uppercase tracking-wider flex items-center gap-2">
          <Tv className="h-5 w-5 text-purple-500 animate-pulse" />
          Put Your Course Knowledge into Action
        </h4>
        <p className="text-xs text-muted-foreground/95 leading-relaxed font-sans">
          Take your camera formulations and cinematic lighting styles directly into our proprietary high-scale chat assistant. Chat with Kron AI to refine screenplay ideas, formats, and reverse-engineer your prompts with live partner parameters.
        </p>
        <div className="pt-2">
          <a
            href="/dashboard/kron-ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted border border-border hover:border-purple-500/40 text-foreground text-xs font-display font-black uppercase tracking-widest rounded-xl hover:bg-muted/85 hover:text-purple-400 transition-all text-center cursor-pointer"
          >
            <span>Kron AI Chat</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Full-viewport Interactive Classroom Side Navigation Overlay */}
      <AnimatePresence>
        {isViewingClassroom && unlocked && (
          <AcademyViewer 
            userEmail={user?.email || "GUEST"}
            onClose={() => setIsViewingClassroom(false)} 
            onComplete={async () => {
              setIsViewingClassroom(false);
              if (user && profile) {
                if (profile.course_completed_reward_claimed) {
                  toast.info("Course completion reward already claimed.");
                } else {
                  try {
                    const profileRef = doc(db, "user_coins", user.uid);
                    await updateDoc(profileRef, {
                      coins: increment(1000),
                      course_completed_reward_claimed: true
                    });
                    toast.success("🎉 Congratulations on Graduating! Added +1,000 bonus credits to your workspace!");
                  } catch (err) {
                    console.error("Failed to credit course completion reward:", err);
                    toast.error("Failed to credit graduation reward. Please check your network.");
                  }
                }
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Confetti celebration modal overlay */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationConfetti onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>

    </div>
  );
}
export { DashboardCourse };
