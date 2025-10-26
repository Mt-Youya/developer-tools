export interface ApiResponse<T = any> {
  code: number
  data: T
  success: boolean
  error?: string
}
