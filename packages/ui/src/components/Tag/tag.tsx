import { cn } from "@devtools/libs"
import { X } from "lucide-react"

// Tag 组件的变体类型
type TagVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline"

// Tag 组件的尺寸类型
type TagSize = "sm" | "md" | "lg"

// Tag 组件 Props 类型定义
interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: TagVariant
  size?: TagSize
  closable?: boolean
  onClose?: () => void
  className?: string
}

const tagVariants: Record<TagVariant, string> = {
  default: "bg-slate-100 text-slate-900 hover:bg-slate-200",
  primary: "bg-blue-100 text-blue-900 hover:bg-blue-200",
  success: "bg-green-100 text-green-900 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
  danger: "bg-red-100 text-red-900 hover:bg-red-200",
  outline: "border border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100",
}

const tagSizes: Record<TagSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2 py-1",
  lg: "text-base px-3 py-1.5",
}

export function Tag({
  children,
  variant = "default",
  size = "md",
  closable = false,
  onClose,
  className = "",
  ...props
}: TagProps) {
  "use memo"
  const baseStyles = "inline-flex items-center gap-1 rounded-md font-medium transition-colors px-2"
  const variantStyles = tagVariants[variant] || tagVariants.default
  const sizeStyles = tagSizes[size] || tagSizes.md

  return (
    <span className={cn(baseStyles, variantStyles, sizeStyles, className)} {...props}>
      {children}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-0.5 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          aria-label="关闭标签"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
