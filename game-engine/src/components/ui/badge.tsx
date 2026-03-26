import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border/80 bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-secondary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
