import { cn } from "@devtools/libs"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Activity, type ButtonHTMLAttributes, type ReactNode } from "react"
import { Spinner, type SpinnerProps, spinnerVariants } from "../Spinner"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        md: "h-7 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface Property extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  asChild?: boolean
  disabled?: boolean
  icon?: ReactNode
}

export type ButtonProps = Property & VariantProps<typeof buttonVariants>

function Button({
  loading = false,
  variant,
  size,
  children,
  className,
  disabled,
  asChild = false,
  icon,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  const spinnerVariant = {
    [variant!]: variant,
    default: "primary",
    destructive: "secondary",
    link: "ghost",
  }[variant!] as SpinnerProps["variant"]

  return (
    <Comp
      disabled={loading || disabled}
      className={cn(
        "rounded-lg font-medium transition-all duration-300 gap-2 disabled:cursor-not-allowed",
        "transform hover:scale-105 active:scale-95",
        "shadow-sm hover:shadow-md",
        loading && "pointer-events-none",
        buttonVariants({ variant, size, className })
      )}
      {...props}
    >
      <Activity mode={loading ? "visible" : "hidden"}>
        {icon ?? (
          <div
            className={cn(
              "flex items-center gap-2",
              "transition-all duration-300",
              loading ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            <Spinner
              className={cn(spinnerVariants({ variant: spinnerVariant, className: "rounded-full animate-spin" }))}
            />
          </div>
        )}
      </Activity>
      <span
        className={cn("transition-all duration-300 flex justify-center items-center gap-1", loading && "opacity-80")}
      >
        {children}
      </span>
    </Comp>
  )
}
export { Button, buttonVariants }
