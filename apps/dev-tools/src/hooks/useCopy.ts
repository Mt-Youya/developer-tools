import { isString } from "@devtools/utils"

export function copyCode(value = "") {
  const val = isString(value) ? value : JSON.stringify(value)
  try {
    navigator.clipboard.writeText(val)
  } catch (err) {
    console.log(err)
    // 降级处理
    const textArea = document.createElement("textarea")
    textArea.value = val ?? ""
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("copy")
    document.body.removeChild(textArea)
  }
}

export default function useCopy(text = "") {
  const [status, setStatus] = useState(false)

  function copyToClipboard(val = text) {
    setStatus(true)
    try {
      copyCode(val)
    } catch (err) {
      console.log(err)
    } finally {
      const timer = setTimeout(() => (setStatus(false), clearTimeout(timer)), 2000)
    }
  }
  return { status, copyToClipboard }
}

export { useCopy }
