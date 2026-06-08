import { motion } from "motion/react";
import { FileText, ImageIcon, TrendingUp, Sparkles, Camera, Play } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Reverse prompt extraction",
    description: "Gemini Vision reads your reference story or visual elements & decodes precise camera angles, prompts, lighting structures and styles.",
  },
  {
    icon: TrendingUp,
    title: "PREDICTIVE CTR TESTER",
    description: "Submit video thumbnails or design drafts. Evaluated by Gemini heuristic vision logic to forecast engagement CTR and outline brutal revisions.",
  },
  {
    icon: FileText,
    title: "High-retention screenwriting",
    description: "Instant script architect output tailored for continuous user retention, paired with fully optimized marketing captions and hashtags.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative bg-card border-y-[3px] border-purple-600">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-3"
        >
          <div className="font-mono text-xs uppercase text-purple-600 font-extrabold tracking-widest bg-purple-50 inline-block px-3 py-1 border border-purple-200 rounded">
            Tactical Feature Modules
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
            DECODE THE CHANNEL <span className="text-purple-600 tracking-tight font-extrabold underline decoration-solid decoration-[3px] decoration-black underline-offset-4">BLUEPRINT</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-mono text-xs md:text-sm">
            Harness premium visual modeling metrics and dialog formulas to bypass feed clutter.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={item}
              className="group bg-white border-[3px] border-purple-600 p-7 rounded-xl hover:shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] transition-all duration-300 text-left relative"
            >
              <span className="absolute top-2 right-2 text-xs font-mono font-bold text-slate-300">
                0{i + 1}
              </span>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-50 text-purple-600 mb-5 border-2 border-purple-600 shadow-[2px_2px_0px_0px_#000000]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-display font-black uppercase mb-2 text-foreground">{f.title}</h3>
              <p className="text-xs font-mono text-muted-foreground leading-relaxed leading-[1.6]">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export { FeaturesSection };
