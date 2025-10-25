import { fetchAllFreeGames, fetchEpicGames } from "@devtools/libs"
import { useCallback, useEffect, useState } from "react"

// 主要的免费游戏数据获取 Hook
export function useFreeGames() {
  const [data, setData] = useState({
    epic: [],
    freetogame: [],
    steam: [],
    gog: [],
    cheapshark: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // 如果数据存在且不是强制刷新，则不重复获取
      if (!forceRefresh && data.epic.length > 0) return

      setLoading(true)
      setError(null)

      try {
        const result = await fetchAllFreeGames()
        console.log("Fetched free games:", result)

        setData({
          epic: result.epic || [],
          freetogame: result.freetogame || [],
          steam: result.steam || [],
          gog: result.gog || [],
          cheapshark: result.cheapshark || [],
        })

        setLastUpdated(new Date())

        // 如果有错误，记录但不阻止显示已获取的数据
        if (result.errors && result.errors.length > 0) {
          console.warn("Some APIs failed:", result.errors)
        }
      } catch (err) {
        setError(err.message || "获取数据失败")
        console.error("Failed to fetch free games:", err)
      } finally {
        setLoading(false)
      }
    },
    [data]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: () => fetchData(true),
  }
}

// Epic Games 专用 Hook
export function useEpicGames(params = {}) {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEpic = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const epicGames = await fetchEpicGames(params)
      setGames(epicGames)
    } catch (err) {
      setError(err.message)
      console.error("Failed to fetch Epic games:", err)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)]) // 依赖 params

  useEffect(() => {
    fetchEpic()
  }, [fetchEpic])

  return {
    games,
    loading,
    error,
    refetch: fetchEpic,
  }
}

// 本地存储 Hook（用于缓存和用户设置）
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue]
}

// 用户偏好设置 Hook
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage("userPreferences", {
    theme: "system", // light, dark, system
    language: "zh-CN",
    autoRefresh: true,
    refreshInterval: 30, // 分钟
    favoriteGames: [],
    hiddenGames: [],
    notificationEnabled: false,
  })

  const updatePreference = useCallback(
    (key, value) => {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }))
    },
    [setPreferences]
  )

  const toggleFavoriteGame = useCallback(
    (gameId) => {
      setPreferences((prev) => {
        const favorites = prev.favoriteGames || []
        const isAlreadyFavorite = favorites.includes(gameId)

        return {
          ...prev,
          favoriteGames: isAlreadyFavorite ? favorites.filter((id) => id !== gameId) : [...favorites, gameId],
        }
      })
    },
    [setPreferences]
  )

  const hideGame = useCallback(
    (gameId) => {
      setPreferences((prev) => ({
        ...prev,
        hiddenGames: [...(prev.hiddenGames || []), gameId],
      }))
    },
    [setPreferences]
  )

  return {
    preferences,
    updatePreference,
    toggleFavoriteGame,
    hideGame,
  }
}

// 自动刷新 Hook
export function useAutoRefresh(callback, interval = 30 * 60 * 1000, enabled = true) {
  useEffect(() => {
    if (!enabled || !callback) return

    const timer = setInterval(callback, interval)
    return () => clearInterval(timer)
  }, [callback, interval, enabled])
}
