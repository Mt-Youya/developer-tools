import { cn } from "@devtools/libs"
import { cva, type VariantProps } from "class-variance-authority"
import type { HTMLAttributes } from "react"
import { Button } from "../Button"
import { SkeletonAvatar, SkeletonCard } from "../Skeleton"
import { Spinner } from "../Spinner"
import "./style.css"

interface Property extends HTMLAttributes<HTMLDivElement> {
  message?: string
  overlay?: boolean
  fullscreen?: boolean
}
export type LoaderProps = Property & VariantProps<typeof loaderVariants>

const loaderVariants = cva("", {
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

export function Loader({
  size = "md",
  variant = "primary",
  message,
  overlay = false,
  fullscreen = false,
  className,
}: LoaderProps) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center",
    overlay && "fixed inset-0 bg-black/50 z-[9999] animate-fade-in backdrop-blur-sm",
    !overlay && "p-5",
    fullscreen && "min-h-screen",
    className
  )

  const textColor = overlay ? "text-white" : "text-gray-900"

  return (
    <div className={containerClasses}>
      <div className="animate-scale-in">
        <Spinner size={size} variant={variant} withRing={overlay} />
      </div>
      {message && <div className={cn("mt-4 text-sm font-medium animate-slide-up", textColor)}>{message}</div>}
    </div>
  )
}

// Demo 应用
export function LoaderDemo() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(true)

  function handleButtonClick() {
    setButtonLoading(true)
    setTimeout(() => setButtonLoading(false), 2000)
  }

  function handleOverlayClick() {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  function handleSkeletonToggle() {
    setShowSkeleton(false)
    setTimeout(() => setShowSkeleton(true), 500)
  }

  return (
    <div className="max-w-5xl mx-auto p-10 font-sans">
      <h1 className="mb-8 text-4xl font-bold text-gray-900 animate-slide-up">React 19 + TypeScript 丝滑 Loader 组件</h1>

      {/* Spinner 尺寸 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Spinner 尺寸 & 脉冲环效果</h2>
        <div className="flex flex-wrap gap-8 p-6 bg-gray-50 rounded-lg items-center transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col items-center gap-2 group">
            <Spinner size="xs" withRing />
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">XS</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Spinner size="sm" withRing />
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">SM</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Spinner size="md" withRing />
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">MD</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Spinner size="lg" withRing />
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">LG</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
            <Spinner size="xl" withRing />
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors">XL</span>
          </div>
        </div>
      </section>

      {/* Spinner 颜色 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Spinner 颜色变体</h2>
        <div className="flex flex-wrap gap-8 p-6 bg-gray-50 rounded-lg items-center transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="primary" />
            <span className="text-xs text-gray-600">Primary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="secondary" />
            <span className="text-xs text-gray-600">Secondary</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="success" />
            <span className="text-xs text-gray-600">Success</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="danger" />
            <span className="text-xs text-gray-600">Danger</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner variant="warning" />
            <span className="text-xs text-gray-600">Warning</span>
          </div>
        </div>
      </section>

      {/* Loader 组件 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Loader 组件（渐入动画）</h2>
        <div className="flex gap-6 p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-lg">
          <Loader size="sm" message="小尺寸" />
          <Loader size="md" message="中等尺寸" color="success" />
          <Loader size="lg" message="大尺寸" color="danger" />
        </div>
      </section>

      {/* 按钮变体 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">按钮变体（悬停缩放 & 阴影）</h2>
        <div className="p-6 bg-gray-50 rounded-lg space-y-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* 加载按钮 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "500ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">加载按钮（平滑过渡）</h2>
        <div className="p-6 bg-gray-50 rounded-lg flex flex-wrap gap-3 transition-all duration-300 hover:shadow-lg">
          <Button loading={buttonLoading} onClick={handleButtonClick} variant="primary">
            {buttonLoading ? "提交中..." : "点击提交"}
          </Button>
          <Button loading={buttonLoading} onClick={handleButtonClick} variant="secondary">
            {buttonLoading ? "处理中..." : "次要按钮"}
          </Button>
          <Button loading={buttonLoading} onClick={handleButtonClick} variant="outline">
            {buttonLoading ? "加载中..." : "描边按钮"}
          </Button>
        </div>
      </section>

      {/* 全屏覆盖 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "600ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800">全屏覆盖 Loader（背景模糊 + 脉冲环）</h2>
        <div className="p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-lg">
          <Button onClick={handleOverlayClick}>显示全屏加载（3秒）</Button>
        </div>
      </section>

      {/* 骨架屏 */}
      <section className="mb-10 animate-fade-in" style={{ animationDelay: "700ms" }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-800 flex items-center gap-3">
          骨架屏加载（光泽滑动 & 交错动画）
          <Button size="sm" variant="ghost" onClick={handleSkeletonToggle}>
            重新加载
          </Button>
        </h2>
        <div className="space-y-4">
          {showSkeleton && (
            <>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                <SkeletonCard />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
                <SkeletonAvatar />
              </div>
            </>
          )}
        </div>
      </section>

      {/* 全屏覆盖层 */}
      {showOverlay && <Loader size="xl" color="primary" message="正在加载，请稍候..." overlay={true} />}
    </div>
  )
}
