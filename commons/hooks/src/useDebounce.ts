import { useRef } from "react"

export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay = 300) {
  "use memo"
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  return (...args: Parameters<T>) => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
