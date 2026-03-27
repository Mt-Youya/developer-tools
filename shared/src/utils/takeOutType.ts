import type { APIResponse } from "@/services/responese"

export type TakeOut<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>["data"]

export type ExtractResponseType<T> = T extends APIResponse<infer R> ? R : never
