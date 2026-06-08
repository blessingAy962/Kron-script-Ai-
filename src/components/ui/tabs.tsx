import * as React from "react";
import { cn } from "@/src/lib/utils";

const TabsContext = React.createContext<{ value: string; onValueChange: (val: string) => void }>({ value: "", onValueChange: () => {} });

export const Tabs = ({ value, onValueChange, children, className }: { value: string; onValueChange: (val: string) => void; children: React.ReactNode; className?: string }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex gap-1 p-1 rounded-xl bg-secondary border border-border w-fit", className)}>{children}</div>
);

export const TabsTrigger = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const { value: activeVal, onValueChange } = React.useContext(TabsContext);
  const active = activeVal === value;
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer font-display",
        active
          ? "bg-primary text-primary-foreground shadow-sm border border-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const { value: activeVal } = React.useContext(TabsContext);
  if (value !== activeVal) return null;
  return <div className={cn("space-y-4 mt-2", className)}>{children}</div>;
};
