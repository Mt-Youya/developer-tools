import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devtools/ui/Select"
import MonacoEditor from "@monaco-editor/react"
import { useEffect, useState } from "react"

const languageOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  // 可根据需要扩展更多语言
]

const themeOptions = [
  { label: "GitHub Dimmed", value: "github-dimmed" },
  { label: "vs-dark", value: "vs-dark" },
  { label: "vs-light", value: "vs-light" },
  // 可根据需要扩展更多主题
]

function CodeEditor() {
  "use memo"
  const [language, setLanguage] = useState("javascript")
  const [theme, setTheme] = useState("github-dimmed")
  const [code, setCode] = useState("// 输入代码...")

  useEffect(() => {
    // fetch("/api/v1/waybill/routes")
    //   .then((r) => r.json())
    //   .then((res) => {
    //     console.log("res", res)
    //     const parser = new DOMParser()
    //     const doc = parser.parseFromString(res.data, "text/html")
    //     // const scripts = doc.querySelectorAll("script")
    //     // scripts.forEach((script) => {
    //     //   console.log("script", script)
    //     // })
    //     const blob = URL.createObjectURL(new Blob([doc.documentElement.outerHTML], { type: "text/html" }))
    //     setIframeSrc(blob)
    //     setHtmlContent(doc.documentElement.outerHTML)
    //   })
    // return () => {
    //   URL.revokeObjectURL(iframeSrc)
    // }
  }, [])

  const [_iframeSrc, _setIframeSrc] = useState("")
  const [_htmlContent, _setHtmlContent] = useState("")

  return (
    <div className="h-full">
      {/* <div className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{ __html: htmlContent }} /> */}
      <div className="mb-2">
        <Select onValueChange={(value) => setLanguage(value)} value={language}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language} />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setTheme(value)} value={theme}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={theme} />
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-max">
        <MonacoEditor
          className="h-[800px]"
          language={language}
          theme={theme}
          value={code}
          onChange={setCode}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
