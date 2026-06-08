import * as React from "react";
import { cn } from "@/src/lib/utils";
import { motion } from "motion/react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium font-display transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-opacity-95 shadow-sm active:translate-y-[1px] shadow-[2px_2px_0px_0px_rgba(51,37,29,1)] border border-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-opacity-90 shadow-sm shadow-[2px_2px_0px_0px_rgba(51,37,29,1)] border border-foreground",
      outline: "border border-border bg-white text-foreground hover:bg-secondary/40 hover:text-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-secondary hover:text-secondary-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8 text-base",
      icon: "h-9 w-9",
    };

    return (
      <motion.button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref as any}
        whileTap={{ scale: 0.95, y: 1 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
