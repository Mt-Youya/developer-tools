import { Phase, type UseContainerProps, type UsePreloaderOptions, type UsePreloaderReturn } from "./interface.d"
import { calcTextBlur, calcTextOpacity, easeInOutQuad } from "./utils/easing"

/**
 * usePreloader
 *
 * 统一管理：
 * - rAF 驱动的进度动画（0 → 100）
 * - 生命周期阶段：idle → loading → exiting → done
 * - 文字 opacity / blur 动效值（供带文字的 Variant 使用）
 */
export function usePreloader({
  loading,
  duration,
  textFadeThreshold = 80,
  exitDuration = 900,
  onComplete,
  onLoadingStart,
  onLoadingComplete,
  customContent,
  className,
  backdropBlur,
  children,
}: UsePreloaderOptions): UsePreloaderReturn {
  "use memo"
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>(Phase.Idle)

  const rafRef = useRef(0)
  const startRef = useRef<number | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setProgress(0)
    setPhase(Phase.Loading)
    startRef.current = null
    onLoadingStart?.()

    function animate(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp

      const elapsed = timestamp - startRef.current
      const raw = Math.min(elapsed / duration, 1)
      const p = Math.floor(easeInOutQuad(raw) * 100)
      setProgress(p)

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setProgress(100)
        setPhase(Phase.Exiting)
        onComplete?.()
        exitTimerRef.current = setTimeout(() => {
          setPhase(Phase.Done)
          onLoadingComplete?.()
        }, exitDuration)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
      startRef.current = null
    }
  }, [loading, duration])

  const [useDone, setUseDone] = useState(false)
  useEffect(() => {
    if (phase === Phase.Done) {
      setUseDone(true)
    }
  }, [phase])

  const containerProps: UseContainerProps = {
    phase,
    progress,
    customContent,
    className,
    backdropBlur,
    renderContent: children,
    useDone,
  }
  return {
    progress,
    phase,
    idle: phase === Phase.Idle,
    loading: phase === Phase.Loading,
    done: phase === Phase.Done,
    exiting: phase === Phase.Exiting,
    textOpacity: calcTextOpacity(progress, 30, textFadeThreshold),
    textBlur: calcTextBlur(progress, 30, textFadeThreshold),
    containerProps,
  }
}
