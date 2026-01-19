export interface ResponseData<T = any> {
  code: number
  data: T
  success: boolean
  message?: string
  msg?: string
  error?: string
}

export type APIResponse<T> = Promise<ResponseData<T>>
export type NoDataResponse = Promise<ResponseData<void>>
export enum HttpStatus {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
export type HttpStatusKey = keyof typeof HttpStatus

export function parseResponse<T>(response: APIResponse<T>): Promise<T> {
  return response.then((res) => {
    if (res.success) {
      return res.data
    } else {
      return Promise.reject(new Error(res.error || "Unknown error"))
    }
  })
}
