import React from "react";
import { cn } from "../../lib/utils"; // optional utility for className merging

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", className, children, ...props }) => {
  const base = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
