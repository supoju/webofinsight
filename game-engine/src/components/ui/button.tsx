import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_16px_35px_-24px_rgba(8,47,73,0.75)] hover:-translate-y-0.5 hover:bg-primary/90",
        outline:
          "border border-border bg-card text-card-foreground shadow-[0_16px_35px_-28px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "min-h-11 px-4 py-2.5",
        lg: "min-h-13 px-5 py-3.5 text-base",
        pill: "min-h-10 rounded-full px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
