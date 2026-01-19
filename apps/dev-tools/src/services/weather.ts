import type { WeatherResponse } from "@devtools/shared"
import { useMyFetch } from "@/hooks/useFetchHook"
import { buildUrl } from "./request"

export function getWeather() {
  const MyFetch = useMyFetch()
  return (params: { location: string }) => {
    const url = buildUrl("/api/v1/weather/getWeather", params)
    return MyFetch<WeatherResponse>(url)
  }
}
