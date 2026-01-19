export function resultFromCache<T>(data: T, ...args: any[]) {
  return {
    data,
    success: true,
    code: 200,
    message: "From Cache",
    ...args,
  }
}

export function resultSuccess<T>(data: T, ...args: any[]) {
  return {
    data,
    success: true,
    code: 200,
    message: "success",
    ...args,
  }
}

export function resultCookieInvalid<T>(data: T, ...args: any[]) {
  return {
    data,
    success: false,
    code: 401,
    message: "Cookie is invalid",
    ...args,
  }
}
