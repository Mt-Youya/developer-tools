import { cn } from "@devtools/libs"
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info, Loader2, XCircle } from "lucide-react"

enum Type {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
  pending = "pending",
  processing = "processing",
  default = "default",
}

type StatusType = keyof typeof Type

type StatusSize = "sm" | "md" | "lg"

interface StatusProps {
  type?: StatusType
  size?: StatusSize
  text?: string
  showIcon?: boolean
  dot?: boolean
  className?: string
}

// 状态配置
interface StatusConfig {
  icon: React.ComponentType<{ className?: string }>
  bgColor: string
  textColor: string
  dotColor: string
  borderColor: string
}

const statusConfig: Record<StatusType, StatusConfig> = {
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    dotColor: "bg-green-500",
    borderColor: "border-green-200",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    dotColor: "bg-red-500",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700",
    dotColor: "bg-yellow-500",
    borderColor: "border-yellow-200",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
  },
  pending: {
    icon: Clock,
    bgColor: "bg-slate-50",
    textColor: "text-slate-700",
    dotColor: "bg-slate-400",
    borderColor: "border-slate-200",
  },
  processing: {
    icon: Loader2,
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    dotColor: "bg-blue-500",
    borderColor: "border-blue-200",
  },
  default: {
    icon: AlertCircle,
    bgColor: "bg-slate-50",
    textColor: "text-slate-700",
    dotColor: "bg-slate-400",
    borderColor: "border-slate-200",
  },
}

const iconSizes: Record<StatusSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

const dotSizes: Record<StatusSize, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
}

const textSizes: Record<StatusSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function Status({
  type = "default",
  size = "md",
  text,
  showIcon = true,
  dot = false,
  className = "",
}: StatusProps) {
  const config = statusConfig[type]
  const Icon = config.icon
  const isProcessing = type === "processing"

  if (dot) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span className={cn(dotSizes[size], config.dotColor, "rounded-full", isProcessing && "animate-pulse")} />
        {text && <span className={`${textSizes[size]} ${config.textColor} font-medium`}>{text}</span>}
      </span>
    )
  }

  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium"
  return (
    <span className={cn(baseStyle, config.bgColor, config.textColor, config.borderColor, textSizes[size], className)}>
      {showIcon && <Icon className={cn(iconSizes[size], isProcessing && "animate-spin")} />}
      {text}
    </span>
  )
}
