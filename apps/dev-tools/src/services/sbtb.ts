import { useMyFetch } from "@/hooks/useFetchHook"
import { HttpMethod } from "./request"

export function cnmtb() {
  const MyFetch = useMyFetch()
  return MyFetch("/api/v1/sbtb/caonima", {
    method: HttpMethod.POST,
  })
}
