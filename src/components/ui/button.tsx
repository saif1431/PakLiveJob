import * as React from "react";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "ghost" }
>(({ className, variant = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "bg-transparent hover:bg-muted",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
