import { cn } from "@devtools/libs"
import { cva, type VariantProps } from "class-variance-authority"
import { Activity, type HTMLAttributes } from "react"

interface Property extends HTMLAttributes<HTMLDivElement> {
  withRing?: boolean
}
export type SpinnerProps = Property & VariantProps<typeof spinnerVariants>

export const spinnerVariants = cva("border-blue-600 border-t-transparent", {
  variants: {
    variant: {
      primary: "border-blue-600 border-t-transparent",
      secondary: "border-gray-600 border-t-transparent",
      success: "border-green-600 border-t-transparent",
      danger: "border-red-600 border-t-transparent",
      warning: "border-yellow-600 border-t-transparent",
      outline: "border-yellow-600 border-t-transparent",
      ghost: "border-yellow-600 border-t-transparent",
    },
    size: {
      xs: "w-4 h-4 border-2",
      sm: "w-6 h-6 border-2",
      md: "w-11 h-11 border-4",
      lg: "w-16 h-16 border-4",
      xl: "w-24 h-24 border-[6px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})

export function Spinner({ size = "md", variant = "primary", className, withRing = false }: SpinnerProps) {
  "use memo"
  return (
    <div className="relative inline-flex items-center justify-center">
      <Activity mode={withRing ? "visible" : "hidden"}>
        <div
          className={cn(
            "absolute rounded-full animate-pulse-ring opacity-20",
            spinnerVariants({ variant, size, className }).replace("border-t-transparent", "").replace("border-", "bg-")
          )}
        />
      </Activity>
      <div className={cn("rounded-full animate-spin", spinnerVariants({ variant, size, className }))} />
    </div>
  )
}
