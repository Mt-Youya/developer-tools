"use client"

import { cn } from "@devtools/libs"
import type { LABEL } from "@devtools/shared"

function Label({ className, ...props }: LABEL) {
  return (
    // biome-ignore lint: single component ui
    <label
      data-slot="label"
      className={cn(
        "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}
export { Label }
