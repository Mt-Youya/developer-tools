import { Alert, AlertDescription } from "@devtools/ui/Alert"
import { Button } from "@devtools/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devtools/ui/Card"
import { Input } from "@devtools/ui/Input"
import { CheckCircle2, Copy, ExternalLink, Link2 } from "lucide-react"

export default function URLShortener() {
  "use memo"
  const [longUrl, setLongUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  function isValidUrl(url: string) {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  async function shortenUrl() {
    setError("")
    setShortUrl("")

    if (!longUrl.trim()) {
      setError("请输入要缩短的链接")
      return
    }

    if (!isValidUrl(longUrl)) {
      setError("请输入有效的 URL 格式（如：https://example.com）")
      return
    }

    setLoading(true)

    try {
      // 使用 TinyURL API
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)

      if (!response.ok) {
        throw new Error("生成短链接失败")
      }

      const shortLink = await response.text()
      setShortUrl(shortLink)
    } catch (err) {
      setError("生成短链接时出错，请稍后重试")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      shortenUrl()
    }
  }

  return (
    <div className="flex-1 bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold flex items-center gap-2">
            <Link2 className="w-8 h-8 text-indigo-600" />
            短链接生成器
          </CardTitle>
          <CardDescription className="text-base">将长链接转换为简短易分享的短链接</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="ipturl" className="text-sm font-medium text-gray-700">
              输入要缩短的链接
            </label>
            <div className="flex gap-2">
              <Input
                id="ipturl"
                type="url"
                placeholder="https://example.com/very/long/url..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-base"
              />
              <Button
                onClick={shortenUrl}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]"
              >
                {loading ? "生成中..." : "生成"}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shortUrl && (
            <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <label htmlFor="shorturl" className="text-sm font-medium text-green-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                生成的短链接
              </label>
              <div className="flex gap-2">
                <Input
                  id="shorturl"
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 bg-white text-base font-mono"
                />
                <Button onClick={copyToClipboard} variant="outline" className="min-w-[100px]">
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => window.open(shortUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t space-y-2">
            <h3 className="text-sm font-medium text-gray-700">使用说明</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>输入完整的 URL（必须包含 http:// 或 https://）</li>
              <li>点击"生成"按钮或按 Enter 键生成短链接</li>
              <li>使用 TinyURL 服务生成永久短链接</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
