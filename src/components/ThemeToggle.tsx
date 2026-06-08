import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = safeGetItem("cron-theme", "");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined") {
      try {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch (e) {
        return "dark";
      }
    }
    return "dark"; // Default to premium dark mode as specified
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    safeSetItem("cron-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10 flex items-center justify-center rounded-xl border border-border bg-background/50 dark:bg-background/40 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all hover:scale-105 active:scale-95 shadow-sm shrink-0 cursor-pointer"
      title={theme === "light" ? "Switch to cinematic dark" : "Switch to elegant light"}
    >
      {theme === "light" ? (
        <Moon className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
      ) : (
        <Sun className="h-4.5 w-4.5 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
      )}
    </button>
  );
}
export { ThemeToggle };
