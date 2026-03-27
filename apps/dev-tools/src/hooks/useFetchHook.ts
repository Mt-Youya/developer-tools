import { type APIResponse, HttpStatus, type HttpStatusKey } from "@devtools/shared"
import { useNavigate } from "react-router-dom"
import { HttpMethod, type MyFetchArgs } from "@/services/request"

export function useMyFetch() {
  "use memo"
  const navigate = useNavigate()
  return async function MyFetch<T>(...args: MyFetchArgs): APIResponse<T> {
    const [url, init] = args
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...init?.headers,
        },
        body: init?.method === HttpMethod.POST ? JSON.stringify(init.body) : init?.body,
      })
      // handleStatus(401, navigate)
      if (response.status !== HttpStatus.OK) {
        handleStatus(response.status, navigate)
        // handleStatus(401, navigate)
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }
}

interface ResultStatusInfo {
  message: string
  redirect: string
}
export const ResultStatus: Record<HttpStatus, ResultStatusInfo> = {
  [HttpStatus.UNAUTHORIZED]: {
    message: "Unauthorized access. Please login.",
    redirect: "/unauthorized",
  },
  [HttpStatus.FORBIDDEN]: {
    message: "You do not have permission to access this resource.",
    redirect: "/forbidden",
  },
  [HttpStatus.NOT_FOUND]: {
    message: "The requested resource was not found.",
    redirect: "/not-found",
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    message: "Internal server error. Please try again later.",
    redirect: "/internal-error",
  },
  [HttpStatus.OK]: {
    message: "OK",
    redirect: "",
  },
}

function handleStatus(status: Response["status"], navigate: ReturnType<typeof useNavigate>) {
  function go(path: ResultStatusInfo["redirect"], message: ResultStatusInfo["message"]) {
    navigate(path)
    throw new Error(message)
  }
  for (const key in HttpStatus) {
    if (!Object.hasOwn(HttpStatus, key)) continue
    const value = HttpStatus[key as HttpStatusKey]
    if (value === status) {
      const { message, redirect } = ResultStatus[value]
      return go(redirect, message)
    }
  }
}
