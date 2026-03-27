import { cn } from "@devtools/libs"
import { BlurText } from "@devtools/ui"

/**
 * LoadingText
 *
 * 带 blur + opacity 双重淡入淡出的加载文字。
 * 由 usePreloader 计算 opacity / blur 后传入驱动。
 */
export interface LoadingTextProps {
  opacity: number
  blur: number
  loadingText: string
  className?: string
  progress?: number
}

const defaultText = "Loading your next level experience..."
export function LoadingText({ opacity, blur, progress, loadingText = defaultText, className = "" }: LoadingTextProps) {
  "use memo"

  const blurRange: [number, number] = useMemo(() => [8, 0], [])
  const opacityRange: [number, number] = useMemo(() => [0, 1], [])
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute z-2 pointer-events-none text-6xl inset-0 m-auto w-fit h-fit",
        // opacity > 0 ? `opacity-[${opacity}]` : "opacity-0",
        // `blur-[${+blur.toFixed(2)}px]`,
        className
      )}
      //   style={{
      //     transition: "opacity 0.6s ease-in-out, filter 0.6s ease-in-out",
      //   }}
    >
      <BlurText
        className={cn("text-white", className)}
        progress={progress}
        text={loadingText}
        blur={blurRange}
        opacity={opacityRange}
      />
      {/* <p
        className={textClassName}
        style={{
          margin: 0,
          color: "#fff",
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: "clamp(0.875rem, 1.4vw, 1.2rem)",
          fontWeight: 400,
          letterSpacing: "0.04em",
          lineHeight: 1.5,
        }}
      >
        {loadingText}
      </p> */}
    </div>
  )
}
