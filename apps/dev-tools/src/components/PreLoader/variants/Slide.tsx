import { cn } from "@devtools/libs"
import { PreloaderContainer } from "../Container"
import { Phase, type SlidePreloaderProps } from "../interface.d"
import { usePreloader } from "../usePreloader"

/**
 * SlidePreloader
 *
 * 推拉门式预加载器。
 * 退场时整块全屏遮罩向左或向右平移滑出，露出下方内容。
 *
 * @example
 * <SlidePreloader loading={isLoading} slideDirection="left" onLoadingComplete={() => setLoading(false)}>
 *   <App />
 * </SlidePreloader>
 */
export enum SlideDirection {
  Left = "left",
  Right = "right",
}
export function SlidePreloader({
  loading = false,
  duration = 2500,
  bgColor = "#0a0a0a",
  backdropBlur = 0,
  className = "",
  customContent,
  onComplete,
  onLoadingStart,
  onLoadingComplete,
  // ariaLabel = "Loading content",
  // ariaLive = "polite",
  children,
  // slide
  slideDirection = SlideDirection.Left,
}: SlidePreloaderProps) {
  "use memo"
  const { phase, exiting, containerProps } = usePreloader({
    loading,
    duration,
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
      {/* 推拉门主体 */}
      <div
        className={cn(
          "absolute inset-0 will-change-transform",
          `bg-${bgColor}`,
          exiting
            ? slideDirection === SlideDirection.Left
              ? "-translate-x-full"
              : "translate-x-full"
            : "translate-x-0",
          className
        )}
        style={{
          transition: exiting ? "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        }}
      />

      <div style={{ visibility: phase === Phase.Exiting ? "visible" : "hidden" }}>{children}</div>
    </PreloaderContainer>
  )
}
