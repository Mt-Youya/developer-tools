import { cn } from "@devtools/libs"
import { PreloaderContainer } from "../Container"
import type { CurtainPreloaderProps } from "../interface.d"
import { usePreloader } from "../usePreloader"

/**
 * CurtainPreloader
 *
 * 幕布式预加载器。
 * 退场时左右两块遮罩同时向两侧滑出，如舞台幕布拉开。
 * 加载中在水平中央显示细进度线。
 *
 * @example
 * <CurtainPreloader loading={isLoading} onLoadingComplete={() => setLoading(false)}>
 *   <App />
 * </CurtainPreloader>
 */
export function CurtainPreloader({
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
}: CurtainPreloaderProps) {
  "use memo"
  const { progress, containerProps, exiting } = usePreloader({
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

  const transitionClass = "transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)]"
  const transitionEndClass = "transform-none translate-x-0"
  const windClass = "absolute top-0 bottom-0 w-1/2 will-change-transform bg-(--bg)"
  return (
    <PreloaderContainer {...containerProps}>
      {/* 左幕 */}
      <div
        className={cn("left-0", windClass, exiting ? transitionClass + " -translate-x-full" : transitionEndClass)}
        // @ts-ignore
        style={{ "--bg": bgColor }}
      />

      {/* 右幕 */}
      <div
        className={cn("right-0", windClass, exiting ? transitionClass + " translate-x-full" : transitionEndClass)}
        // @ts-ignore
        style={{ "--bg": bgColor }}
      />

      {/* 中央进度线（仅加载中可见） */}
      {!exiting && (
        <div className="absolute top-1/2 left-[8%] right-[8%] h-px bg-[rgba(255,255,255,0.08)] translate-y-1/2 z-1">
          <div
            className={cn("h-full transition-[width] duration-75 ease-linear bg-[rgba(255,255,255,0.35)]", `w-(--w)`)}
            // @ts-ignore
            style={{ "--w": `${progress}%` }}
          />
        </div>
      )}
    </PreloaderContainer>
  )
}
