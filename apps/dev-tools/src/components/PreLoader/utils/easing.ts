/**
 * Ease in-out quad — 先加速后减速
 * t: 0 → 1
 */
export const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

/**
 * Ease out cubic — 快速减速（适合退出动画）
 */
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Linear clamp — 将值限定在 [min, max]
 */
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/**
 * 计算文字透明度
 * - 0 → inEnd: 0 → 1 淡入
 * - inEnd → outStart: 保持 1
 * - outStart → 100: 1 → 0 淡出
 */
export const calcTextOpacity = (progress: number, inEnd = 30, outStart = 80) => {
  const fadeIn = clamp(progress / inEnd, 0, 1)
  const fadeOut = progress >= outStart ? clamp(1 - (progress - outStart) / (100 - outStart), 0, 1) : 1
  return fadeIn * fadeOut
}

/**
 * 计算文字模糊值 (px)
 * - 进入时 blur 8 → 0
 * - 退出时 0 → blur 8
 */
export const calcTextBlur = (progress: number, inEnd = 30, outStart = 80, maxBlur = 8) => {
  const blurIn = (1 - clamp(progress / inEnd, 0, 1)) * maxBlur
  const blurOut = progress >= outStart ? clamp((progress - outStart) / (100 - outStart), 0, 1) * maxBlur : 0
  return Math.max(blurIn, blurOut)
}
