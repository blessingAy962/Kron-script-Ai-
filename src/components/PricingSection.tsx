import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Sparkles, Zap, Crown, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    key: "starter",
    name: "Starter Plan",
    usdPrice: 3,
    coins: 5000,
    icon: Zap,
    features: [
      "5,000 KRON workspace credits",
      "Standard script generator",
      "100MB file size limits",
      "Standard prompt reverse lookup"
    ],
    popular: false,
  },
  {
    key: "creator",
    name: "Creator Plan",
    usdPrice: 6,
    coins: 25000,
    icon: Sparkles,
    features: [
      "25,000 KRON workspace credits",
      "High-priority generation speeds",
      "100MB file size limits",
      "Standard support response",
      "Unlimited screenplay draft memory"
    ],
    popular: true,
  },
  {
    key: "pro_creator",
    name: "Pro Creator",
    usdPrice: 12,
    coins: 100000,
    icon: Crown,
    features: [
      "100,000 KRON workspace credits",
      "Unrestricted access to all tools",
      "Maximum workspace generation priority",
      "100MB file size limits",
      "Premium support & 1-on-1 analytics",
      "Continuous system optimizations"
    ],
    popular: false,
  },
];

interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
}

export default function PricingSection() {
  const navigate = useNavigate();
  const [detectedCountry, setDetectedCountry] = useState<string>("United States");
  const [currency, setCurrency] = useState<CurrencyConfig>({ code: "USD", symbol: "$", rate: 1.0 });

  useEffect(() => {
    async function locateAndConvert() {
      try {
        const response = await fetch("/api/geolocation");
        if (!response.ok) throw new Error("Location feed failure");
        const data = await response.json();
        
        const country = data.country_name || "United States";
        const curCode = data.currency || "USD";
        setDetectedCountry(country);

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
        console.warn("Geolocation auto-detection failed inside PricingSection, defaulting to USD", err);
        setCurrency({ code: "USD", symbol: "$", rate: 1.0 });
      }
    }
    locateAndConvert();
  }, []);

  const formatLocalPrice = (usdPrice: number) => {
    const converted = usdPrice * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency.code}`;
  };

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Dynamic ambient backing grid */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-3.5"
        >
          <span className="text-[10px] uppercase tracking-widest bg-primary/10 border border-primary/25 text-primary px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5">
            <Globe className="h-3 w-3" /> pricing configured dynamically to {detectedCountry}
          </span>
          <h2 className="text-3.5xl md:text-5xl font-display font-extrabold uppercase tracking-tight text-foreground">
            Simple, Flexible <span className="text-primary">Plans</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-xs md:text-sm">
            Unlock professional workspace credit reserves to power all script editing, image rendering, and audio generators instantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch pt-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-3xl p-7 flex flex-col relative transition-all duration-300 ${
                plan.popular 
                  ? "bg-card border-2 border-primary shadow-xl shadow-primary/5 scale-[1.03] z-10" 
                  : "glass-card border border-border/70 hover:border-border hover:shadow-lg hover:shadow-primary/2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary text-white text-[9px] uppercase font-mono font-black tracking-widest border border-white/25 shadow-md">
                  MOST VIRAL
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-5 text-left">
                <div className={`p-2 rounded-xl border ${plan.popular ? "bg-primary text-white border-primary/10" : "bg-muted text-foreground border-border/40"}`}>
                  <plan.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-display font-extrabold uppercase text-sm tracking-tight text-foreground">{plan.name}</h3>
              </div>

              <div className="mb-6 text-left border-b border-border/40 pb-5">
                <span className="text-3xl font-display font-black text-foreground">{formatLocalPrice(plan.usdPrice)}</span>
                <span className="text-muted-foreground text-[10px] font-mono block uppercase mt-1">Equivalent to ${plan.usdPrice} USD</span>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1 text-left font-body text-xs">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-foreground/90">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/auth")}
                className={`w-full py-3 rounded-2xl font-display text-xs uppercase tracking-wider font-extrabold transition-all cursor-pointer border ${
                  plan.popular
                    ? "bg-primary text-white border-primary/20 hover:opacity-95 shadow-md shadow-primary/10"
                    : "bg-foreground text-background border-foreground/15 hover:opacity-90"
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
export { PricingSection };
