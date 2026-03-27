import { cn } from "@devtools/libs"
import { PreloaderContainer } from "../Container"
import { RevealDirection, RevealFrom, type StairsPreloaderProps } from "../interface.d"
import { LoadingText } from "../LoadingText"
import { usePreloader } from "../usePreloader"

/**
 * StairsPreloader
 *
 * 台阶式遮罩预加载器。
 * 退场时竖条依次向上/下滑出，形成阶梯错落的视觉效果。
 *
 * @example
 * <StairsPreloader loading={isLoading} stairCount={12} revealFrom="left" onLoadingComplete={() => setLoading(false)}>
 *   <App />
 * </StairsPreloader>
 */
export function StairsPreloader({
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
  loadingText = "Loading your next level experience.",
  textClassName = "",
  textFadeThreshold = 80,
  // stairs
  stairCount = 10,
  revealFrom = RevealFrom.Left,
  revealDirection = RevealDirection.Up,
}: StairsPreloaderProps) {
  "use memo"
  const { exiting, progress, textOpacity, textBlur, containerProps } = usePreloader({
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

  function getDelay(i: number) {
    const max = 0.7
    if (revealFrom === RevealFrom.Right) return ((stairCount - 1 - i) / stairCount) * max
    if (revealFrom === RevealFrom.Center) {
      const mid = (stairCount - 1) / 2
      return (Math.abs(i - mid) / mid) * max
    }
    return (i / stairCount) * max * 1000
  }

  return (
    <PreloaderContainer {...containerProps}>
      <div className="absolute inset-0 flex">
        {Array.from({ length: stairCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 will-change-transform transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]",
              `bg-[${bgColor}]`,
              exiting
                ? revealDirection === RevealDirection.Down
                  ? "translate-y-full"
                  : "-translate-y-full"
                : "translate-y-0",
              "delay-(--t-delay)"
            )}
            style={{
              // @ts-ignore
              "--t-delay": getDelay(i).toFixed() + "ms",
              backgroundColor: bgColor,
            }}
          />
        ))}
      </div>

      <LoadingText
        progress={progress}
        opacity={textOpacity}
        blur={textBlur}
        loadingText={loadingText}
        className={textClassName}
      />
    </PreloaderContainer>
  )
}
