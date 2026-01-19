import type { ErrorInfo, ReactNode } from "react"

// 错误边界组件的 props 类型
export interface ErrorBoundaryProps {
  /** 错误发生时的回退 UI */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode)
  /** 错误发生时的回调函数 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** 重置错误时的回调函数 */
  onReset?: () => void
  /** 错误重置的依赖项 */
  resetKeys?: any[]
  /** 子组件 */
  children: ReactNode
}

// 错误边界状态类型
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * 使用函数组件实现的 React 错误边界
 * 在 React 19 中，可以使用 use Hook 来处理异步错误
 */
export default function ErrorBoundary({ fallback, onError, onReset, resetKeys = [], children }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  })

  function resetErrorBoundary() {
    setErrorState({ hasError: false, error: null })
    onReset?.()
  }

  // 使用 useRef 来跟踪 resetKeys 的变化
  const prevResetKeysRef = useRef<any[]>([])

  useEffect(() => {
    // 检查 resetKeys 是否变化
    if (JSON.stringify(prevResetKeysRef.current) !== JSON.stringify(resetKeys)) {
      prevResetKeysRef.current = resetKeys
      // 如果 resetKeys 变化，重置错误边界
      if (errorState.hasError) {
        resetErrorBoundary()
      }
    }
  }, [resetKeys])

  // 处理渲染错误的函数
  function handleError(error: Error, errorInfo: ErrorInfo) {
    setErrorState({
      hasError: true,
      error,
    })

    if (onError) {
      onError(error, errorInfo)
    } else {
      // 默认错误处理：记录到控制台
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  // 在 React 19 中，我们可以使用 use Hook 来捕获异步错误
  // 但由于 use Hook 还在实验阶段，这里我们主要处理渲染错误

  // 如果有错误，显示回退 UI
  if (errorState.hasError && errorState.error) {
    if (typeof fallback === "function") {
      return <>{fallback(errorState.error, resetErrorBoundary)}</>
    }

    if (fallback) {
      return <>{fallback}</>
    }

    // 默认错误 UI
    return (
      <div style={errorBoundaryStyles.container}>
        <div style={errorBoundaryStyles.content}>
          <h2 style={errorBoundaryStyles.title}>Something went wrong</h2>
          <details style={errorBoundaryStyles.details}>
            <summary style={errorBoundaryStyles.summary}>Error details</summary>
            <pre style={errorBoundaryStyles.error}>{errorState.error.toString()}</pre>
          </details>
          <button type="button" onClick={resetErrorBoundary} style={errorBoundaryStyles.button}>
            Try again
          </button>
        </div>
      </div>
    )
  }

  // 渲染子组件
  return <>{children}</>
}

/**
 * 高阶组件：使用错误边界包装组件
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ErrorBoundaryProps, "children"> = {}
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  // 复制 displayName 以便调试
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || "Component"})`

  return WrappedComponent
}

/**
 * 自定义 hook：在组件内部使用错误边界
 */
export function useErrorHandler(error?: Error) {
  const [errorState, setErrorState] = useState<Error | null>(null)

  // 如果有传入 error，则设置错误状态
  useEffect(() => {
    if (error) {
      setErrorState(error)
    }
  }, [error])

  // 抛出错误，让最近的错误边界捕获
  function throwError(error: Error) {
    setErrorState(error)
  }

  // 清除错误
  function clearError() {
    setErrorState(null)
  }

  // 如果存在错误，抛出给错误边界
  if (errorState) {
    throw errorState
  }

  return { throwError, clearError }
}

/**
 * 处理异步错误的 hook
 */
export function useAsyncError() {
  const [_, setError] = useState()

  return (error: Error) => {
    // 使用 setTimeout 确保在下一次渲染时抛出错误
    const timer = setTimeout(() => {
      setError(() => {
        clearTimeout(timer)
        throw error
      })
    }, 0)
  }
}

// 错误边界样式
const errorBoundaryStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  content: {
    textAlign: "center" as const,
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    color: "#dc2626",
    fontSize: "1.5rem",
    marginBottom: "16px",
  },
  details: {
    textAlign: "left" as const,
    marginBottom: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "4px",
    padding: "12px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "bold" as const,
    marginBottom: "8px",
    color: "#475569",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.875rem",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflow: "auto",
    maxHeight: "200px",
    padding: "10px",
    backgroundColor: "#fef2f2",
    borderRadius: "4px",
    border: "1px solid #fecaca",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold" as const,
    transition: "background-color 0.2s",
    marginTop: "10px",
  },
}
