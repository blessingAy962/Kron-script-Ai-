import { motion } from "motion/react";

interface PromoCardProps {
  imageSrc: string;
  badgeText: string;
  id: string;
}

function PromoCard({ imageSrc, badgeText, id }: PromoCardProps) {
  return (
    <motion.div
      id={`promo-${id}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group rounded-[2.5rem] overflow-hidden aspect-[4/3] sm:aspect-[16/10] border border-border/80 bg-zinc-950 shadow-lg shadow-black/30 flex flex-col justify-end p-5 cursor-pointer max-w-full"
    >
      {/* Background Image with hover zoom effect */}
      <img
        src={imageSrc}
        alt={badgeText}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700 ease-out"
      />

      {/* Dark premium overlay for maximum text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5 pointer-events-none" />

      {/* Light subtle glow in the top-right */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none" />

      {/* Rounded graphic caption pill modeled precisely after user's image */}
      <div className="relative z-10 w-full flex justify-center mb-1">
        <span className="w-full text-center px-4 py-3 bg-violet-100/95 dark:bg-violet-950/95 text-violet-900 dark:text-violet-200 border border-violet-200/50 dark:border-violet-800/50 rounded-2xl text-[10.5px] sm:text-[11.5px] font-display font-black tracking-normal uppercase shadow-[0_4px_12px_rgba(124,58,237,0.15)] select-none">
          {badgeText}
        </span>
      </div>
    </motion.div>
  );
}

export function HeroPromoGrid() {
  const cards = [
    {
      id: "creator",
      imageSrc: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80",
      badgeText: "Content Creator: Perfect AI Prompts",
    },
    {
      id: "writer",
      imageSrc: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
      badgeText: "Movie Writer: Create Viral Scripts",
    },
    {
      id: "youtuber",
      imageSrc: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?auto=format&fit=crop&w=800&q=80",
      badgeText: "YouTuber: 10X Faster Success!",
    },
    {
      id: "logo",
      imageSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
      badgeText: "KRON SCRIPT AI powered by Auratech.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-2 md:mt-12 md:mb-6 px-4 md:px-0 z-10 relative" id="hero-promo-grid-container">
      {/* Background glow behind the entire collage */}
      <div className="absolute inset-0 bg-indigo-500/5 rounded-[4rem] filter blur-3xl pointer-events-none" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
        {cards.map((card) => (
          <PromoCard
            key={card.id}
            id={card.id}
            imageSrc={card.imageSrc}
            badgeText={card.badgeText}
          />
        ))}
      </div>
    </div>
  );
}
