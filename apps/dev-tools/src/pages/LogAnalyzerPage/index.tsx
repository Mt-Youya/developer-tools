import { Alert, AlertDescription } from "@devtools/ui/Alert"
import { Badge } from "@devtools/ui/Badge"
import { Button } from "@devtools/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devtools/ui/Card"
import { ScrollArea } from "@devtools/ui/ScrollArea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@devtools/ui/Table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@devtools/ui/Tabs"
import { Textarea } from "@devtools/ui/Textarea"
import { Activity, BarChart, FileText, Trash2, Upload } from "lucide-react"

enum BadgeVariant {
  default = "default",
  private = "secondary",
  lx = "outline",
}
type BadgeKey = keyof typeof BadgeVariant

interface LogEntry {
  timestamp: string
  processId: string
  tag: string
  scope: BadgeKey
  name: string
  length: number
  callbackId: number
  rawData: string
  args?: any
}
export default function LogAnalyzerPage() {
  "use memo"
  const [logText, setLogText] = useState("")
  const [parsedLogs, setParsedLogs] = useState<LogEntry[]>([])
  const [parseError, setParseError] = useState("")

  // 解析日志文本
  function parseLogText(text: string) {
    try {
      const lines = text.trim().split("\n")
      const entries: LogEntry[] = []

      for (const line of lines) {
        // 匹配日志格式: 11-20 17:38:57.950   40026-40026   A00000/...  I     request data: length: 369 {...}
        const match = line.match(
          /(\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})\s+(\d+-\d+)\s+(.+?)\s+I\s+request data: length: (\d+)\s+(\{.+\})/
        )

        if (match) {
          const [, timestamp, processId, tag, lengthStr, jsonData] = match

          try {
            const data = JSON.parse(jsonData)
            entries.push({
              timestamp,
              processId,
              tag,
              scope: data.scope || "unknown",
              name: data.name || "unknown",
              length: parseInt(lengthStr, 10),
              callbackId: data.callbackId ?? -1,
              rawData: jsonData,
              args: data.args,
            })
          } catch (_e) {
            // console.log("jsonData", jsonData)
            console.warn("Failed to parse JSON for line:", line)
          }
        }
      }

      return entries
    } catch (error) {
      throw new Error("解析失败: " + (error as Error).message)
    }
  }

  // 处理日志上传
  function handleParse() {
    try {
      setParseError("")
      const logs = parseLogText(logText)
      if (logs.length === 0) {
        setParseError("未找到有效的日志数据")
      } else {
        setParsedLogs(logs)
      }
    } catch (error) {
      setParseError((error as Error).message)
    }
  }

  // 清除数据
  function handleClear() {
    setLogText("")
    setParsedLogs([])
    setParseError("")
  }

  // 计算统计数据
  const statistics = (() => {
    if (parsedLogs.length === 0) {
      return null
    }

    const lengths = parsedLogs.map((item) => item.length)
    const totalLines = parsedLogs.length
    const maxLength = Math.max(...lengths)
    const minLength = Math.min(...lengths)
    const avgLength = Math.round(lengths.reduce((a, b) => a + b, 0) / totalLines)
    const totalDataSize = lengths.reduce((a, b) => a + b, 0)

    // 按 scope 统计
    const scopeStats = parsedLogs.reduce(
      (acc, item) => {
        acc[item.scope] = (acc[item.scope] || 0) + 1
        return acc
      },
      {} as Record<BadgeKey, number>
    )

    // 按 name 统计
    const nameStats = parsedLogs.reduce(
      (acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    // Top 10 largest logs
    const topLargest = [...parsedLogs].sort((a, b) => b.length - a.length).slice(0, 10)

    // 时间范围
    const timestamps = parsedLogs.map((log) => log.timestamp)
    const timeRange = {
      start: timestamps[0],
      end: timestamps[timestamps.length - 1],
    }

    // Length 分布
    const lengthDistribution = {
      small: lengths.filter((l) => l < 200).length,
      medium: lengths.filter((l) => l >= 200 && l < 1000).length,
      large: lengths.filter((l) => l >= 1000).length,
    }

    return {
      totalLines,
      maxLength,
      minLength,
      avgLength,
      totalDataSize,
      scopeStats,
      nameStats,
      topLargest,
      timeRange,
      lengthDistribution,
    }
  })()

  // 格式化字节大小
  function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const nameStatsData = Object.entries(statistics?.nameStats || {}).sort(([, a], [, b]) => b - a)
  const scopeStatsData = Object.entries(statistics?.scopeStats || {}).sort(([, a], [, b]) => b - a)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MSI 日志分析器</h1>
          <p className="text-muted-foreground mt-1">解析和分析 Android 日志数据</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            输入日志数据
          </CardTitle>
          <CardDescription>
            粘贴 Android logcat 日志数据，格式: "MM-DD HH:mm:ss.SSS ... request data: length: XXX &#123;...&#125;"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="粘贴日志数据..."
            className="min-h-[200px] font-mono text-sm"
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={handleParse} disabled={!logText}>
              <Activity className="mr-2 h-4 w-4" />
              解析日志
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              清除
            </Button>
          </div>
          {parseError && (
            <Alert variant="destructive">
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {statistics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总行数</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalLines}</div>
                <p className="text-xs text-muted-foreground">日志条目数量</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">最大 Length</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.maxLength}</div>
                <p className="text-xs text-muted-foreground">{formatBytes(statistics.maxLength)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均 Length</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.avgLength}</div>
                <p className="text-xs text-muted-foreground">最小: {statistics.minLength}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总数据量</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatBytes(statistics.totalDataSize)}</div>
                <p className="text-xs text-muted-foreground">
                  {statistics.timeRange.start} - {statistics.timeRange.end}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="scope">Scope 统计</TabsTrigger>
              <TabsTrigger value="api">API 统计</TabsTrigger>
              <TabsTrigger value="largest">最大请求</TabsTrigger>
              <TabsTrigger value="raw">原始数据</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Length 分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">小 (&lt; 200)</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{statistics.lengthDistribution.small}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {((statistics.lengthDistribution.small / statistics.totalLines) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">中 (200-1000)</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{statistics.lengthDistribution.medium}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {((statistics.lengthDistribution.medium / statistics.totalLines) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">大 (&gt; 1000)</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{statistics.lengthDistribution.large}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {((statistics.lengthDistribution.large / statistics.totalLines) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>时间范围</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">开始时间</span>
                        <div className="font-mono text-sm">{statistics.timeRange.start}</div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">结束时间</span>
                        <div className="font-mono text-sm">{statistics.timeRange.end}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="scope">
              <Card>
                <CardHeader>
                  <CardTitle>按 Scope 统计</CardTitle>
                  <CardDescription>不同 scope 的请求数量分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Scope</TableHead>
                          <TableHead className="text-right">数量</TableHead>
                          <TableHead className="text-right">占比</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scopeStatsData.map(([scope, count]) => (
                          <TableRow key={scope}>
                            <TableCell>
                              <Badge variant={BadgeVariant[scope as BadgeKey]}>{scope}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{count}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {((count / statistics.totalLines) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card className="w-[440px]">
                <CardHeader>
                  <CardTitle>按 API Name 统计</CardTitle>
                  <CardDescription>不同 API 的调用频率</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>API Name</TableHead>
                          <TableHead className="text-right">调用次数</TableHead>
                          <TableHead className="text-right">占比</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nameStatsData.map(([name, count]) => (
                          <TableRow key={name}>
                            <TableCell>
                              <code className="text-sm">{name}</code>
                            </TableCell>
                            <TableCell className="text-right font-mono">{count}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              {((count / statistics.totalLines) * 100).toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="largest">
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 最大请求</CardTitle>
                  <CardDescription>按 length 排序的最大请求</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>时间</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Length</TableHead>
                          <TableHead className="text-right">Callback ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statistics.topLargest.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant={BadgeVariant[log.scope]}>{log.scope}</Badge>
                            </TableCell>
                            <TableCell>
                              <code className="text-sm">{log.name}</code>
                            </TableCell>
                            <TableCell className="text-right font-mono font-bold">{log.length}</TableCell>
                            <TableCell className="text-right font-mono text-muted-foreground">
                              {log.callbackId}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>原始日志数据</CardTitle>
                  <CardDescription>所有解析的日志条目</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">时间</TableHead>
                          <TableHead>Scope</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Length</TableHead>
                          <TableHead className="text-right">Callback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedLogs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant={BadgeVariant[log.scope]} className="text-xs">
                                {log.scope}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs">{log.name}</code>
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">{log.length}</TableCell>
                            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                              {log.callbackId}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
