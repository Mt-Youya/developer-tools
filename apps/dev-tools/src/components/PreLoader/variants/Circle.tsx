import { PreloaderContainer } from "../Container"
import type { CirclePreloaderProps } from "../interface.d"
import { LoadingText } from "../LoadingText"
import { usePreloader } from "../usePreloader"

/**
 * CirclePreloader
 *
 * 全屏圆形遮罩预加载器。
 * 退场时通过 clip-path circle() 从全屏向圆心收缩至消失。
 *
 * 原理：
 *   加载中 → clip-path: circle(150% at 50% 50%)  完全覆盖（含四角）
 *   退场   → clip-path: circle(0% at 50% 50%)    从圆心收缩消失
 *
 * @example
 * <CirclePreloader loading={isLoading} loadingText="Preparing..." onLoadingComplete={() => setLoading(false)}>
 *   <App />
 * </CirclePreloader>
 */
export function CirclePreloader({
  loading = false,
  duration = 2500,
  bgColor = "#0a0a0a",
  backdropBlur = 0,
  className = "",
  customContent,
  onComplete,
  onLoadingStart,
  onLoadingComplete,
  children,
  // text
  loadingText = "loading your next level experience.",
  textClassName = "",
  textFadeThreshold = 80,
}: CirclePreloaderProps) {
  "use memo"
  const { containerProps, exiting, textOpacity, textBlur } = usePreloader({
    loading,
    duration,
    textFadeThreshold,
    onComplete,
    onLoadingStart,
    onLoadingComplete,
    customContent,
    className,
    backdropBlur,
    children,
  })

  return (
    <PreloaderContainer {...containerProps}>
      {/* clip-path 圆形遮罩 */}
      <div
        className="absolute inset-0 will-change-[clip-path]"
        style={{
          background: bgColor,
          clipPath: exiting ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
          transition: exiting ? "clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        }}
      />

      {/* 文字（渲染在遮罩层之上，跟随 clip 裁切区域内） */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: exiting ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
          transition: exiting ? "clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        }}
      >
        <LoadingText opacity={textOpacity} blur={textBlur} loadingText={loadingText} className={textClassName} />
      </div>
    </PreloaderContainer>
  )
}
