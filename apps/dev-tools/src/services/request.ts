import { isDefined, isObject } from "@devtools/utils"

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type FetchParam = Parameters<typeof fetch>
type FetchInput = FetchParam[0]
type FetchInit = FetchParam[1]
export type FetchOptions = PostInit | GetInit
export type MyFetchArgs = [input: FetchInput, init?: FetchOptions]

interface PostInit extends Omit<RequestInit, "body" | "method"> {
  method: HttpMethod.POST
  body?: Record<string, any>
}

interface GetInit extends Omit<RequestInit, "method"> {
  method?: HttpMethod.GET
}

export function buildUrl(baseUrl: string, params?: Record<string, any>) {
  if (!isObject(params)) return baseUrl

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (isDefined(value)) {
      searchParams.append(key, String(value))
    }
  }
  const queryString = searchParams.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
