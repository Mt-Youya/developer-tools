import { cn } from "@devtools/libs"
import { Phase, type PreloaderContainerProps } from "./interface.d"

export function PreloaderContainer({
  className,
  phase,
  customContent,
  progress = 0,
  backdropBlur = 0,
  children,
  renderContent,
  loading = false,
  useDone,
}: PreloaderContainerProps) {
  "use memo"
  if (useDone || (!loading && phase === Phase.Idle)) {
    return renderContent
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden",
        backdropBlur > 0 ? `backdrop-blur-${backdropBlur}px` : "",
        className
      )}
    >
      {children}
      {customContent && <div className="absolute inset-0 z-10 pointer-events-none">{customContent(progress)}</div>}

      <div style={{ visibility: phase === Phase.Exiting ? "visible" : "hidden" }}>{renderContent}</div>
    </div>
  )
}
