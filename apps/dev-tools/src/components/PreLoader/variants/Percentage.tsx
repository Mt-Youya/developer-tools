import type { CSSProperties } from "react"
import { PreloaderContainer } from "../Container"
import type { PercentagePosition, PercentagePreloaderProps, ProgressBarPosition } from "../interface.d"
import { usePreloader } from "../usePreloader"

/**
 * PercentagePreloader
 *
 * 大字号百分比数字 + 进度条预加载器。
 * 退场时整体 opacity fade-out。
 *
 * @example
 * <PercentagePreloader loading={isLoading} percentagePosition="bottom-left" onLoadingComplete={() => setLoading(false)}>
 *   <App />
 * </PercentagePreloader>
 */
export function PercentagePreloader({
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
  // percentage
  percentagePosition = "center" as PercentagePosition,
  showPercentageSign = true,
  percentageTextClassName = "",
  showProgressBar = true,
  progressBarPosition = "bottom" as ProgressBarPosition,
}: PercentagePreloaderProps) {
  "use memo"
  const { progress, phase, exiting, containerProps } = usePreloader({
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

  if (phase === "done" || (!loading && phase === "idle")) {
    return <>{children}</>
  }

  const posMap: Record<PercentagePosition, CSSProperties> = {
    center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    "bottom-left": { bottom: "3rem", left: "3rem" },
    "top-left": { top: "3rem", left: "3rem" },
  }

  return (
    <PreloaderContainer {...containerProps}>
      {/* 背景 + 退场淡出 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: bgColor,
          opacity: exiting ? 0 : 1,
          transition: exiting ? "opacity 0.6s ease" : "none",
        }}
      />

      {/* 进度条 */}
      {showProgressBar && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            [progressBarPosition]: 0,
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            zIndex: 1,
            opacity: exiting ? 0 : 1,
            transition: exiting ? "opacity 0.6s ease" : "none",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#fff",
              transition: "width 0.08s linear",
            }}
          />
        </div>
      )}

      {/* 百分比数字 */}
      <div
        className={percentageTextClassName}
        style={{
          position: "absolute",
          ...posMap[percentagePosition],
          color: "#fff",
          fontFamily: "'DM Mono', monospace",
          fontSize: "clamp(4rem, 14vw, 11rem)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          userSelect: "none",
          zIndex: 1,
          opacity: exiting ? 0 : 1,
          transition: exiting ? "opacity 0.6s ease" : "none",
        }}
      >
        {String(progress).padStart(2, "0")}
        {showPercentageSign && (
          <span style={{ fontSize: "0.35em", verticalAlign: "super", marginLeft: "0.15em", opacity: 0.7 }}>%</span>
        )}
      </div>
    </PreloaderContainer>
  )
}
