import { cn } from "@devtools/libs"
import { type Easing, motion, type Transition } from "motion/react"

interface BlurTextProps {
  text?: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
  direction?: "top" | "bottom"
  threshold?: number
  rootMargin?: string
  animationFrom?: Record<string, string | number>
  animationTo?: Array<Record<string, string | number>>
  animationExit?: Array<Record<string, string | number>>
  easing?: Easing | Easing[]
  onAnimationComplete?: () => void
  /** 退出动画完成时触发 */
  onExitComplete?: () => void
  stepDuration?: number
  blur?: [number, number]
  opacity?: [number, number]
  /** 外部控制：true 时触发退出动画 */
  progress?: number
}

type Keyframes = Record<string, Array<string | number>>
type From = Record<string, string | number>
type Steps = Array<Record<string, string | number>>
function buildKeyframes(from: From, steps: Steps): Keyframes {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))])
  return Array.from(keys).reduce((prev, now) => {
    prev[now] = [from[now], ...steps.map((s) => s[now])]
    return prev
  }, {} as Keyframes)
}

export function BlurText({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  animationExit,
  easing = (t: number) => t,
  onAnimationComplete,
  onExitComplete,
  stepDuration = 0.25,
  blur = [0, 8],
  opacity = [0, 1],
  progress = 0,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("")
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  // ── Intersection Observer：控制进入动画 ──
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(ref.current as Element)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const [blurStart, blurEnd] = blur

  // ── 进入动画：from ──
  const defaultFrom =
    direction === "top"
      ? { filter: `blur(${blurStart}px)`, opacity: opacity[0], y: -50 }
      : { filter: `blur(${blurStart}px)`, opacity: opacity[0], y: 50 }

  // ── 进入动画：to（两步关键帧，先模糊后清晰）──
  const defaultTo = [
    {
      filter: `blur(${(blurEnd + blurStart) / 2}px)`,
      opacity: (opacity[1] + opacity[0]) / 2,
      y: direction === "top" ? 5 : -5,
    },
    {
      filter: `blur(${blurEnd}px)`,
      opacity: opacity[1],
      y: 0,
    },
  ]

  // ── 退出动画：默认是进入动画的反向 ──
  const defaultExit = [
    {
      filter: `blur(${(blurEnd + blurStart) / 2}px)`,
      opacity: (opacity[1] + opacity[0]) / 2,
      y: direction === "top" ? -5 : 5,
    },
    {
      filter: `blur(${blurStart}px)`,
      opacity: opacity[0],
      y: direction === "top" ? -50 : 50,
    },
  ]

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const exitSnapshots = animationExit ?? defaultExit

  // ── 公共时间轴参数 ──
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)))

  // ── 构建关键帧 ──
  const enterKeyframes = useMemo(() => buildKeyframes(fromSnapshot, toSnapshots), [fromSnapshot, toSnapshots])

  const exitKeyframes = useMemo(
    () => buildKeyframes(toSnapshots[toSnapshots.length - 1], exitSnapshots),
    [toSnapshots, exitSnapshots]
  )

  const exitProgress = +progress >= 75

  // ── 当前应该播放哪组 animate ──
  // idle（未入视）→ fromSnapshot 保持初始
  // inView        → enterKeyframes 进入
  // exiting       → exitKeyframes 退出（每个 span 延迟反向，最后一个最先退）
  const getAnimate = (index: number) => {
    if (exitProgress) return exitKeyframes
    if (inView) return enterKeyframes
    return fromSnapshot
  }

  // 退出时延迟顺序反转：最后一个词最先开始退出
  const getDelay = (index: number) => {
    if (exitProgress) {
      // 从末尾往前依次退出
      const reverseIndex = elements.length - 1 - index
      return (reverseIndex * delay) / 1000
    }
    return (index * delay) / 1000
  }

  const getTransition = (index: number): Transition => ({
    duration: totalDuration,
    times,
    delay: getDelay(index),
    ease: easing,
  })

  return (
    <p ref={ref} className={cn("blur-text flex flex-wrap", className)}>
      {elements.map((segment, index) => (
        <motion.span
          key={index + segment}
          initial={fromSnapshot}
          animate={getAnimate(index)}
          transition={getTransition(index)}
          onAnimationComplete={
            exitProgress
              ? // 退出时：第一个元素延迟最长，它完成时整体退出结束
                index === 0
                ? onExitComplete
                : undefined
              : // 进入时：最后一个元素完成时触发
                index === elements.length - 1
                ? onAnimationComplete
                : undefined
          }
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  )
}
