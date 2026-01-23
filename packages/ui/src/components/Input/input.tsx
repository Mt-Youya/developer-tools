import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@devtools/libs"
import type { INPUT } from "@devtools/shared"
import type { ComponentProps } from "react"

function Input({ className, type, ...props }: INPUT) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-9 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] aria-invalid:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function UnderlineInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "border-0 border-b-2 border-gray-300 rounded-none px-0 py-2 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 transition-colors",
        "no-spinner",
        className
      )}
      {...props}
    />
  )
}

UnderlineInput.displayName = "UnderlineInput"

export { Input, UnderlineInput }
