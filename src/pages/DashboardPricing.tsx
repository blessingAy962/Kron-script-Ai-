import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Coins, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  Globe, 
  Wallet,
  Compass,
  Zap,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/src/hooks/useAuth";

interface PlanSchema {
  id: string;
  title: string;
  desc: string;
  coins: number;
  usdPrice: number;
  perks: string[];
  tag?: string;
  popular?: boolean;
}

const PLANS: PlanSchema[] = [
  {
    id: "starter",
    title: "Starter Plan",
    desc: "Great for light creators looking to augment their rapid asset development pipeline.",
    coins: 5000,
    usdPrice: 3,
    perks: [
      "5,000 KRON workspace credits",
      "Standard script generator",
      "100MB file size limits",
      "Standard prompt reverse lookup"
    ],
    tag: "Entry"
  },
  {
    id: "creator",
    title: "Creator Plan",
    desc: "Optimized for active creators seeking significant weekly storytelling output channels.",
    coins: 25000,
    usdPrice: 6,
    perks: [
      "25,000 KRON workspace credits",
      "High-priority script generation speeds",
      "100MB file size limits",
      "Standard support desk response",
      "Unlimited screenplay draft memory"
    ],
    tag: "Best Value",
    popular: true
  },
  {
    id: "pro_creator",
    title: "Pro Creator Plan",
    desc: "Full comprehensive scale suite for professional publishing operations and media hubs.",
    coins: 100000,
    usdPrice: 12,
    perks: [
      "100,000 KRON workspace credits",
      "Unrestricted access to all tools",
      "Maximum workspace production priority",
      "100MB file size limits",
      "Premium support & 1-on-1 analytics",
      "Continuous system optimizations and filters"
    ],
    tag: "High Flyer"
  }
];

interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
}

export default function DashboardPricing() {
  const { user } = useAuth();
  
  // Real time state metrics
  const [balance, setBalance] = useState<number>(150);
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  
  // Geolocation currency conversions
  const [detectedCountry, setDetectedCountry] = useState<string>("United States");
  const [currency, setCurrency] = useState<CurrencyConfig>({ code: "USD", symbol: "$", rate: 1.0 });
  const [detectingLocation, setDetectingLocation] = useState(true);

  // Dynamically listen to remaining balance
  useEffect(() => {
    if (!user) return;
    const coinsRef = doc(db, "user_coins", user.uid);
    const unsub = onSnapshot(coinsRef, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setBalance(d.coins ?? 150);
        setCurrentPlan(d.plan ?? "free");
      }
    });
    return () => unsub();
  }, [user]);

  // Geolocation automatic country detection and rate conversion
  useEffect(() => {
    async function locateAndConvert() {
      try {
        const response = await fetch("/api/geolocation");
        if (!response.ok) throw new Error("Location feed failure");
        const data = await response.json();
        
        const country = data.country_name || "United States";
        const curCode = data.currency || "USD";
        setDetectedCountry(country);

        // Approximate real-time major currency exchange mappings relative to USD
        const rates: { [key: string]: { symbol: string; rate: number } } = {
          GBP: { symbol: "£", rate: 0.79 },
          EUR: { symbol: "€", rate: 0.92 },
          NGN: { symbol: "₦", rate: 1510 },
          CAD: { symbol: "C$", rate: 1.37 },
          AUD: { symbol: "A$", rate: 1.51 },
          INR: { symbol: "₹", rate: 83.5 },
          JPY: { symbol: "¥", rate: 156.2 },
          BRL: { symbol: "R$", rate: 5.25 },
          ZAR: { symbol: "R", rate: 18.5 },
          GHS: { symbol: "GH₵", rate: 15.0 },
          KES: { symbol: "KSh", rate: 130.0 },
          NONE: { symbol: "$", rate: 1.0 }
        };

        const chosen = rates[curCode] || { symbol: rates[curCode]?.symbol || "$", rate: rates[curCode]?.rate || 1.0 };
        setCurrency({
          code: curCode,
          symbol: chosen.symbol,
          rate: chosen.rate
        });
      } catch (err) {
        console.warn("Pricing geolocation auto-detection failed, defaulting to USD base currency: ", err);
        setDetectedCountry("Fallback Location");
        setCurrency({ code: "USD", symbol: "$", rate: 1.0 });
      } finally {
        setDetectingLocation(false);
      }
    }
    locateAndConvert();
  }, []);

  const triggerCheckout = (plan: PlanSchema) => {
    if (!user) {
      toast.error("Please login/register to purchase KRON operating licenses.");
      return;
    }

    const whopPlanId = plan.id === "pro_creator" ? "pro-creator" : plan.id;
    const checkoutUrl = `https://whop.com/auratech-9e22/kron-script-ai?plan=${whopPlanId}&uid=${user.uid}`;

    toast.info(`Redirecting securely to Whop checkout under ${plan.title}...`, {
      duration: 3500
    });

    setTimeout(() => {
      window.open(checkoutUrl, "_blank");
    }, 1000);
  };

  // Convert USD cost dynamic to local balance
  const formatLocalPrice = (usdPrice: number) => {
    const converted = usdPrice * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency.code}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-left pb-16 font-body">
      
      {/* Upper Title banner block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4 border-b border-border/60 pb-6"
      >
        <div>
          <h1 className="text-2.5xl md:text-3.5xl font-display font-black tracking-tight uppercase text-foreground">
            License & Fuel Pricing
          </h1>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>
              Detected country: <b>{detectedCountry}</b>. Prices converted dynamically dynamically to local value.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-primary/10 border border-primary/25 px-4 py-2 rounded-xl font-mono text-xs text-primary">
          <Coins className="h-4 w-4 animate-pulse" />
          <span className="font-extrabold uppercase">WORKSPACE BALANCE: {balance.toLocaleString()} CR</span>
        </div>
      </motion.div>

      {/* Plans layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {PLANS.map((plan, i) => {
          const isCurrentPlan = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all duration-300 ${
                plan.popular 
                  ? "bg-background/90 border-2 border-primary shadow-xl shadow-primary/5 scale-[1.01] z-10" 
                  : "glass-card border border-border/80 hover:border-primary/50"
              }`}
            >
              {plan.tag && (
                <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full bg-primary text-white font-mono">
                  {plan.tag}
                </span>
              )}

              <div className="space-y-4 text-left">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">KRON OPERATING LICENSE</span>
                <h3 className="font-display font-black uppercase text-base tracking-tight text-foreground">{plan.title}</h3>
                
                <div className="space-y-1 my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2.5xl font-display font-black text-foreground">
                      {formatLocalPrice(plan.usdPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono uppercase block">
                    Equivalent to ${plan.usdPrice} USD
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground/85 font-sans leading-relaxed">{plan.desc}</p>
                
                {/* Credit bundle highlights */}
                <div className="bg-muted/40 border border-border/60 p-3 rounded-2xl flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-foreground uppercase tracking-tight">
                    Includes <b>{plan.coins.toLocaleString()} workspace credits</b>
                  </span>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-2 pt-4">
                  {plan.perks.map((perk, pi) => (
                    <li key={pi} className="flex items-start gap-2 text-xs text-foreground font-sans">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-border/40 space-y-2">
                <button
                  onClick={() => triggerCheckout(plan)}
                  className={`w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer text-center ${
                    isCurrentPlan 
                      ? "bg-muted text-foreground border border-border/80" 
                      : "bg-primary text-white hover:opacity-95 shadow-sm"
                  }`}
                >
                  {isCurrentPlan ? "Active License" : `Acquire ${plan.title}`}
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Geolocation exchange indicators footer */}
      <div className="p-4 border border-border/60 bg-muted/10 rounded-2xl text-[10px] font-sans text-muted-foreground/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>Dynamic pricing calculated perfectly across global currencies based on secure locale indexes.</span>
        </div>
        <span className="font-mono text-right"><b>1 USD = {currency.rate} {currency.code}</b></span>
      </div>

    </div>
  );
}
export { DashboardPricing };
