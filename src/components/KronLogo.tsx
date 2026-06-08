import React from "react";

interface KronLogoProps {
  /**
   * The visual configuration of the branding:
   * - "symbol": Elegant geometric K symbol only (perfect for icon/avatar/button/badge)
   * - "wordmark": "KRON AI" premium typeface logo only
   * - "combined": The geometric K symbol followed by the "KRON AI" wordmark
   */
  variant?: "symbol" | "wordmark" | "combined";
  /**
   * Sizing presets or custom size
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  /**
   * Custom className to override styling
   */
  className?: string;
  /**
   * Hide the subtitle or change text orientation (only used in combined variant)
   */
  direction?: "row" | "col";
  /**
   * Toggle underlying ambient purple-violet soft aura glow (for true luxury product aesthetic)
   */
  glow?: boolean;
}

export function KronLogo({
  variant = "combined",
  size = "md",
  className = "",
  direction = "row",
  glow = false,
}: KronLogoProps) {
  
  // Responsive sizing map for visual precision
  const sizeMap = {
    xs: { symbol: "h-5 w-5", text: "text-[11px]", wordmarkH: "h-3.5", gap: "gap-1.5" },
    sm: { symbol: "h-7 w-7", text: "text-sm", wordmarkH: "h-4.5", gap: "gap-2" },
    md: { symbol: "h-9 w-9", text: "text-base", wordmarkH: "h-6", gap: "gap-2.5" },
    lg: { symbol: "h-12 w-12", text: "text-xl", wordmarkH: "h-8", gap: "gap-3" },
    xl: { symbol: "h-16 w-16", text: "text-2xl", wordmarkH: "h-10", gap: "gap-4" },
    xxl: { symbol: "h-24 w-24", text: "text-4xl", wordmarkH: "h-16", gap: "gap-6" },
  };

  const wordmarkStyles = {
    xs: { main: "text-xs sm:text-xs", pill: "text-[7.5px]", sub: "text-[6px]" },
    sm: { main: "text-xs sm:text-sm", pill: "text-[8.5px]", sub: "text-[7px]" },
    md: { main: "text-base sm:text-lg", pill: "text-[9.5px]", sub: "text-[8.5px]" },
    lg: { main: "text-xl sm:text-2xl", pill: "text-[11px]", sub: "text-[10px]" },
    xl: { main: "text-3xl sm:text-4xl", pill: "text-[14px]", sub: "text-[12px]" },
    xxl: { main: "text-5xl sm:text-6xl", pill: "text-[20px]", sub: "text-[16px]" },
  };

  const selectedSize = sizeMap[size];
  const currentWordmarkStyle = wordmarkStyles[size];

  // Modern geometric K Symbol custom SVG code with luxury purple-white frosted glass layers
  const renderSymbol = () => (
    <div className={`relative ${selectedSize.symbol} shrink-0`} id="kron-logo-symbol">
      {/* Background Soft Ambient Glow Spot */}
      {glow && (
        <div className="absolute inset-[-20%] bg-purple-500/30 dark:bg-purple-600/25 blur-[16px] rounded-full pointer-events-none animate-pulse duration-5000" />
      )}
      
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(168,85,247,0.08)]"
      >
        <defs>
          {/* Main vertical stem gradient: deep rich purple transition to bright white-violet */}
          <linearGradient id="kronStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" /> {/* Violet 600 */}
            <stop offset="50%" stopColor="#a855f7" /> {/* Purple 500 */}
            <stop offset="100%" stopColor="#e9d5ff" /> {/* Purple 200 */}
          </linearGradient>

          {/* Upper branch: premium cosmic purple to icy white */}
          <linearGradient id="kronUpperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" /> {/* Purple 500 */}
            <stop offset="100%" stopColor="#ffffff" /> {/* Pearl White */}
          </linearGradient>

          {/* Lower branch: crystal frosted white to glass translucency */}
          <linearGradient id="kronLowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.4" /> {/* Purple 400 translucency */}
          </linearGradient>

          {/* Frosted Glass Overlay Overlay Gradient */}
          <linearGradient id="kronGlassOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>

          {/* Outer stroke border for frosted realism */}
          <linearGradient id="kronGlassBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="40%" stopColor="#e9d5ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>

          {/* Subtle drop shadow drop key for glass dimensions */}
          <filter id="glassDepthShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="1" dy="2" stdDeviation="2.5" floodColor="#4b1d95" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. LAYER ONE: Elegant solid vertical pillar (The backbone of trust & structure) */}
        <rect
          x="18"
          y="14"
          width="13"
          height="72"
          rx="6.5"
          fill="url(#kronStemGrad)"
        />

        {/* 2. LAYER TWO: Upper branch (Linear-inspired forward thrust) */}
        <path
          d="M 28 47.5 L 61.5 14 C 64 11.5, 68 11.5, 70.5 14 C 73 16.5, 73 20.5, 70.5 23 L 41 52.5 Z"
          fill="url(#kronUpperGrad)"
        />

        {/* 3. LAYER THREE: Lower branch (Stable geometric anchor) */}
        <path
          d="M 33 50.5 L 65 82.5 C 67.5 85, 71.5 85, 74 82.5 C 76.5 80, 76.5 76, 74 73.5 L 45 44.5 Z"
          fill="url(#kronLowerGrad)"
        />

        {/* 4. LAYER FOUR: Semi-transparent frosted-glass ribbon overlay (Completing the geometric 'K' folds) */}
        <path
          d="M 31 42 L 56 17 C 58.5 14.5, 62.5 14.5, 65 17 C 67.5 19.5, 67.5 23.5, 65 26 L 43 48 C 39 52, 34 52, 30.5 48.5 L 24.5 42.5 C 22.5 40.5, 22.5 37.5, 24.5 35.5 C 26.5 33.5, 29.5 33.5, 31.5 35.5 Z"
          fill="url(#kronGlassOverlay)"
          stroke="url(#kronGlassBorder)"
          strokeWidth="1.2"
          filter="url(#glassDepthShadow)"
          style={{ mixBlendMode: "normal" }}
        />
      </svg>
    </div>
  );

  // Modern wordmark featuring luxurious minimalist letterforms
  const renderWordmark = () => (
    <div className="flex flex-col text-left select-none outline-none" id="kron-logo-wordmark">
      <div className="flex items-center">
        <span className={`font-display font-black tracking-[-0.04em] uppercase text-foreground leading-none ${currentWordmarkStyle.main} whitespace-nowrap`}>
          KRON SCRIPT
          <span className={`ml-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 ${currentWordmarkStyle.pill} font-mono font-black text-white uppercase tracking-wider align-middle shadow-md shadow-purple-500/10 dark:shadow-purple-700/5 relative overflow-hidden`}>
            AI
            <span className="absolute inset-0 bg-white/10 opacity-60 pointer-events-none" />
          </span>
        </span>
      </div>
      <span className={`font-mono ${currentWordmarkStyle.sub} font-semibold text-muted-foreground/75 mt-0.5 leading-none lowercase tracking-[0.1em]`}>
        powered by auratech
      </span>
    </div>
  );

  // Combined variant
  if (variant === "symbol") {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderSymbol()}</div>;
  }

  if (variant === "wordmark") {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderWordmark()}</div>;
  }

  return (
    <div
      className={`inline-flex ${direction === "row" ? "flex-row items-center" : "flex-col items-center text-center"} ${selectedSize.gap} ${className}`}
    >
      {renderSymbol()}
      {renderWordmark()}
    </div>
  );
}

export default KronLogo;
