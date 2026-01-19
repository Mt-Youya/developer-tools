import type { FedoGroup, FedoVariable, NocodePillow, PillowCode } from "@devtools/shared"
import { buildUrl, HttpMethod, MyFetch } from "./request"

export function nocodeRequest(bundleConfigList: NocodePillow[]) {
  return MyFetch<PillowCode>("/api/v1/fedo/nocodeRequest", {
    method: HttpMethod.POST,
    body: {
      config: bundleConfigList,
      source: "nocode",
    },
  })
}

export function getFedoList(groupId?: string | number) {
  const url = buildUrl("/api/v1/fedo/list", { groupId })
  return MyFetch<FedoGroup[]>(url)
}

export function getFedoVariable(taskId: string | number) {
  return MyFetch<FedoVariable>(`/api/v1/fedo/variable?taskId=${taskId}`)
}
