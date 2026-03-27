export function useTimeout(fn: (...args: any[]) => void, delay = 500) {
  const timer = setTimeout(async () => {
    await fn()
    clearTimeout(timer)
  }, delay)
}
