import type { PropsWithChildren, ReactNode } from "react"

/* ============================================================
   Primitive Literal Types
   ============================================================ */
export enum Phase {
  Idle = "idle",
  Loading = "loading",
  Exiting = "exiting",
  Done = "done",
}
export type AriaLiveType = "polite" | "assertive" | "off"
export enum ProgressBarPosition {
  Top = "top",
  Bottom = "bottom",
}
export enum PercentagePosition {
  Center = "center",
  BottomLeft = "bottom-left",
  TopLeft = "top-left",
}
export enum RevealFrom {
  Left = "left",
  Right = "right",
  Center = "center",
}
export enum RevealDirection {
  Up = "up",
  Down = "down",
}

/* ============================================================
   Base Props — 所有 Variant 共享的基础 Props
   ============================================================ */
export interface BasePreloaderProps {
  /** 是否激活预加载 */
  loading?: boolean
  /** 加载动画总时长 (ms)，默认 2500 */
  duration?: number
  /** 背景颜色，默认 #0a0a0a */
  bgColor?: string
  /** 背景模糊 (px)，默认 0 */
  backdropBlur?: number
  /** 额外 className */
  className?: string
  /** 自定义内容，接收当前进度 0-100 */
  customContent?: (progress: number) => ReactNode
  /** progress 到达 100 时触发 */
  onComplete?: () => void
  /** 动画开始时触发 */
  onLoadingStart?: () => void
  /** 退出动画完成时触发 */
  onLoadingComplete?: () => void
  //   /** ARIA label */
  //   ariaLabel?: string;
  //   /** ARIA live */
  //   ariaLive?: AriaLiveType;
  /** 加载完成后展示的内容 */
  children?: ReactNode
}

/* ============================================================
   Text Props — 带文字的 Variant 附加 Props
   ============================================================ */
export interface TextPreloaderProps extends BasePreloaderProps {
  /** 加载文字 */
  loadingText?: string
  /** 文字额外 className */
  textClassName?: string
  /** 文字开始消失的进度阈值 (0-100)，默认 80 */
  textFadeThreshold?: number
}

/* ============================================================
   Individual Variant Props
   ============================================================ */

/** StairsPreloader */
export interface StairsPreloaderProps extends TextPreloaderProps {
  /** 台阶数量，默认 10 */
  stairCount?: number
  /** 台阶退场起始方向，默认 left */
  revealFrom?: RevealFrom
  /** 台阶退场移动方向，默认 up */
  revealDirection?: RevealDirection
}

/** PercentagePreloader */
export interface PercentagePreloaderProps extends BasePreloaderProps {
  /** 百分比数字位置，默认 center */
  percentagePosition?: PercentagePosition
  /** 是否显示 % 符号，默认 true */
  showPercentageSign?: boolean
  /** 百分比文字额外 className */
  percentageTextClassName?: string
  /** 是否显示进度条，默认 true */
  showProgressBar?: boolean
  /** 进度条位置，默认 bottom */
  progressBarPosition?: ProgressBarPosition
}

/** CirclePreloader */
export interface CirclePreloaderProps extends TextPreloaderProps {}

/** SlidePreloader */
export interface SlidePreloaderProps extends BasePreloaderProps {
  /** 推出方向，默认 left */
  slideDirection?: SlideDirection
}

/** CurtainPreloader */
export interface CurtainPreloaderProps extends BasePreloaderProps {}

/* ============================================================
   Hook
   ============================================================ */
export interface UsePreloaderOptions extends PropsWithChildren {
  loading: boolean
  duration: number
  textFadeThreshold?: number
  exitDuration?: number
  onComplete?: () => void
  onLoadingStart?: () => void
  onLoadingComplete?: () => void
  customContent?: (progress: number) => ReactNode
  className?: string
  backdropBlur?: number
}

export interface UsePreloaderReturn {
  progress: number
  phase: Phase
  idle: boolean
  loading: boolean
  done: boolean
  exiting: boolean
  /** 文字透明度 0-1 */
  textOpacity: number
  /** 文字模糊 px */
  textBlur: number
  containerProps: UseContainerProps
}

export interface PreloaderContainerProps {
  className?: string
  phase?: Phase
  customContent?: (progress: number) => ReactNode
  progress?: number
  backdropBlur?: number
  children?: ReactNode
  renderContent: ReactNode
  loading?: boolean
  useDone?: boolean
}

export type UseContainerProps = Omit<PreloaderContainerProps, "loading">
