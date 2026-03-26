import * as React from "react";

import { cn } from "@/lib/utils";

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase", className)}
      {...props}
    />
  );
}

export function DisplayTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-4xl font-semibold tracking-tight text-card-foreground sm:text-6xl",
        className,
      )}
      {...props}
    />
  );
}

export function HeroScore({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-display text-[4.5rem] leading-none font-semibold tracking-[-0.06em] text-card-foreground sm:text-[6rem] dark:text-white",
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("font-display text-3xl font-semibold tracking-tight text-card-foreground", className)}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-lg leading-8 text-muted-foreground", className)} {...props} />;
}
