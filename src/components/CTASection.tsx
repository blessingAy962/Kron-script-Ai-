import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-24 bg-background px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-xl p-12 text-center shadow-[4px_4px_0px_0px_rgba(51,37,29,1)]"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 tracking-tight text-foreground">
            Ready to <span className="text-primary font-bold">Grow Your Creative Channels?</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-body">
            Gain immediate access to premium screenplays, AI thumbnail design, voice conversion blocks, and the Veo 3.1 video gen suite.
          </p>
          <Button size="lg" className="font-display font-bold text-base px-10 glow-primary cursor-pointer" asChild>
            <Link to="/auth">Start Creating Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4 font-body">No credit card details required • Instantly loaded with 100 free KRON coins • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}
export { CTASection };
