import { motion } from "motion/react";

const steps = [
  { number: "01", title: "Feed reference images", description: "Upload a high-impact mockup design or story element. Gemini decodes detailed scene compositions." },
  { number: "02", title: "Review predicted velocity", description: "Evaluate critical visual readability indicators, contrast values, and forecasted CTR margins." },
  { number: "03", title: "Architect dialog loop", description: "Convert design synopsis variables into high-retention typewriter scripts with instant hashtag blocks." },
  { number: "04", title: "Dominate video feeds", description: "Bypass typical creator blockages using mathematically precise retention timing rules." },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background border-b-[3px] border-purple-600">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-3"
        >
          <div className="font-mono text-xs uppercase text-purple-600 font-extrabold tracking-widest bg-purple-50 inline-block px-3 py-1 border border-purple-200 rounded">
            Engineering Protocol
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
            THE PRODUCTION <span className="text-purple-600">PIPELINE</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-mono text-xs md:text-sm">Four clear operational stages to launch optimized, high-retention media.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border-[3px] border-purple-600 rounded-xl p-6 text-left shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] relative hover:bg-purple-50/35 transition-all"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-mono font-black text-sm mb-5 border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                {step.number}
              </div>
              <h3 className="text-base font-display font-black uppercase mb-2 text-foreground">{step.title}</h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export { HowItWorksSection };
