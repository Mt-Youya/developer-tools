import type {
  BundleVersionList,
  DivaGroupVersions,
  DivaVersionParams,
  PillowCode,
  PillowParams,
} from "@devtools/shared"
import { useMyFetch } from "@/hooks/useFetchHook"
import { buildUrl, HttpMethod } from "./request"

export function pillowRequest(headersInit: HeadersInit = {}) {
  const MyFetch = useMyFetch()
  return (bundleConfigList: PillowParams[], headers = headersInit) =>
    MyFetch<PillowCode>("/api/v1/diva/pillowRequest", {
      method: HttpMethod.POST,
      headers,
      body: {
        config: bundleConfigList,
        source: "nocode",
      },
    })
}

export function getListVersions(headersInit: HeadersInit = {}) {
  const MyFetch = useMyFetch()
  return (params: DivaVersionParams, headers = headersInit) => {
    const url = buildUrl("/api/v1/diva/listVersions", params)
    return MyFetch<BundleVersionList>(url, { headers })
  }
}

export function getGroupVersions(headersInit: HeadersInit = {}) {
  const MyFetch = useMyFetch()
  return (params: DivaGroupVersions, headers = headersInit) => {
    return MyFetch<Record<string, BundleVersionList>>(`/api/v1/diva/groupVerions`, {
      method: HttpMethod.POST,
      headers,
      body: params,
    })
  }
}
