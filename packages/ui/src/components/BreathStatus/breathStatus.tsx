import { cn } from "@devtools/libs"
import { cva, type VariantProps } from "class-variance-authority"
import type { ReactNode } from "react"

type StatusType = "online" | "offline" | "busy" | "away" | "idle" | "warning" | "error" | "success"
type SizeType = "sm" | "md" | "lg"

const breathingStatusVariants = cva("rounded-full", {
  variants: {
    status: {
      online: "bg-green-500",
      success: "bg-emerald-500",
      busy: "bg-red-500",
      away: "bg-yellow-500",
      idle: "bg-orange-400",
      warning: "bg-amber-500",
      error: "bg-rose-500",
      offline: "bg-gray-400",
    },
    size: {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    },
  },
  defaultVariants: {
    status: "online",
    size: "md",
  },
})

const statusShadows: Record<StatusType, string> = {
  online: "shadow-green-500/50",
  success: "shadow-emerald-500/50",
  busy: "shadow-red-500/50",
  away: "shadow-yellow-500/50",
  idle: "shadow-orange-400/50",
  warning: "shadow-amber-500/50",
  error: "shadow-rose-500/50",
  offline: "shadow-gray-400/30",
}

const statusAnimateConfig: Record<StatusType, boolean> = {
  online: true,
  success: true,
  busy: true,
  away: true,
  idle: true,
  warning: true,
  error: true,
  offline: false,
}

interface BreathingStatusProps extends VariantProps<typeof breathingStatusVariants> {
  status?: StatusType
  size?: SizeType
  label?: string | ReactNode
  className?: string
}

function BreathingStatus({ status = "online", label = "在线", size = "md", className }: BreathingStatusProps) {
  "use memo"
  const shouldAnimate = statusAnimateConfig[status]
  const classWrapper = breathingStatusVariants({ status, size })

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        {shouldAnimate && (
          <>
            {/* 外圈呼吸效果 - 仅在活跃状态显示 */}
            <div className={cn("absolute opacity-75 animate-ping", classWrapper)} />
            {/* 中圈脉动效果 - 仅在活跃状态显示 */}
            <div
              className={cn("absolute shadow-lg", statusShadows[status], classWrapper)}
              style={{
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </>
        )}
        {/* 核心圆点 - 离线状态添加边框 */}
        <div className={cn("relative", classWrapper, !shouldAnimate && "ring-2 ring-gray-300 dark:ring-gray-600")} />
      </div>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </div>
  )
}

function BreathingStatusDemo() {
  const [currentStatus, setCurrentStatus] = useState<StatusType>("online")

  const statuses: Array<{ value: StatusType; label: string; description: string }> = [
    { value: "online", label: "在线", description: "用户当前在线活跃" },
    { value: "offline", label: "离线", description: "用户已离线或断开连接" },
    { value: "busy", label: "忙碌", description: "正在忙碌,请勿打扰" },
    { value: "away", label: "离开", description: "暂时离开,稍后回来" },
    { value: "idle", label: "闲置", description: "长时间无活动" },
    { value: "warning", label: "警告", description: "需要注意的状态" },
    { value: "error", label: "错误", description: "发生错误或异常" },
    { value: "success", label: "成功", description: "操作成功完成" },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">呼吸状态组件</h1>
          <p className="text-gray-600 dark:text-gray-400">shadcn/ui 风格的动态状态指示器 (使用 CVA + cn)</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <div className="flex items-center justify-center p-12 bg-gray-50 dark:bg-gray-900 rounded-md">
            <BreathingStatus
              status={currentStatus}
              label={statuses.find((s) => s.value === currentStatus)?.label}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statuses.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => {
                  setCurrentStatus(s.value)
                }}
                className={cn(
                  "px-4 py-2 rounded-md font-medium transition-all",
                  currentStatus === s.value
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 shadow-md"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">尺寸变体</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <BreathingStatus status="online" label="小尺寸" size="sm" />
              <BreathingStatus status="online" label="中尺寸" size="md" />
              <BreathingStatus status="online" label="大尺寸" size="lg" />
            </div>
            <div className="flex items-center gap-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
              <BreathingStatus status="offline" label="小尺寸" size="sm" />
              <BreathingStatus status="offline" label="中尺寸" size="md" />
              <BreathingStatus status="offline" label="大尺寸" size="lg" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">所有状态类型</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statuses.map((s) => (
              <div
                key={s.value}
                className={cn(
                  "flex flex-col gap-2 p-4 rounded-md border transition-colors",
                  "bg-gray-50 dark:bg-gray-900",
                  "border-gray-200 dark:border-gray-700",
                  "hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{s.label}</span>
                  <BreathingStatus status={s.value} label={s.label} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">实际应用场景</h2>
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">用户 Alice</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">alice@example.com</div>
                </div>
              </div>
              <BreathingStatus status="online" label="在线" />
            </div>

            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  B
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">用户 Bob</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">bob@example.com</div>
                </div>
              </div>
              <BreathingStatus status="away" label="离开" />
            </div>

            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">用户 Carol</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">carol@example.com</div>
                </div>
              </div>
              <BreathingStatus status="busy" label="忙碌" />
            </div>

            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">用户 David</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">david@example.com</div>
                </div>
              </div>
              <BreathingStatus status="offline" label="离线" />
            </div>

            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700",
                "bg-red-50 dark:bg-red-950/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">API 服务器</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">api.example.com</div>
                </div>
              </div>
              <BreathingStatus status="error" label="错误" />
            </div>

            <div
              className={cn(
                "flex items-center justify-between p-3 rounded-md",
                "border border-gray-200 dark:border-gray-700",
                "bg-amber-50 dark:bg-amber-950/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  D
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">数据库服务</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">db.example.com</div>
                </div>
              </div>
              <BreathingStatus status="warning" label="高负载" />
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">使用方法</h2>
          <div className="bg-gray-900 dark:bg-gray-950 rounded-md p-4 overflow-x-auto">
            <pre className="text-sm text-white">
              <code>{`// 基础使用
<BreathingStatus status="online" label="在线" />

// 自定义尺寸
<BreathingStatus status="busy" label="忙碌" size="lg" />

// 不显示标签
<BreathingStatus status="away" />

// 自定义类名
<BreathingStatus 
  status="offline" 
  label="离线" 
  className="my-custom-class"
/>`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export { BreathingStatus, BreathingStatusDemo }
