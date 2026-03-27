import { Alert, AlertDescription, AlertTitle } from "@devtools/ui/Alert"
import { Badge } from "@devtools/ui/Badge"
import { Button } from "@devtools/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@devtools/ui/Card"
import { Separator } from "@devtools/ui/Separator"
import { AlertCircle, CircleStop, Download, Mic, MicOff, MonitorPlay, Video } from "lucide-react"

interface ScreenShareRecorderProps {
  onStreamReady?: (stream: MediaStream) => void // 用于父组件处理WebRTC逻辑
}

export function ScreenShareRecorder({ onStreamReady }: ScreenShareRecorderProps) {
  "use memo"
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [error, setError] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isStarted, setIsStarted] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // --- 1. 核心功能：开始屏幕共享 ---
  function startShare() {
    setIsStarted(true)
    handleShare()
  }

  async function handleShare() {
    try {
      setError(null)
      // 调用浏览器 API 获取屏幕媒体流
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: audioEnabled, // 请求系统音频
      })
      // 监听用户点击浏览器原生的"停止共享"按钮
      displayStream.getVideoTracks()[0].onended = stopShare

      setStream(displayStream)

      // 设置 Video 预览
      videoRef.current!.srcObject = displayStream

      // 回调给父组件 (此处用于 WebRTC 远程连接)
      onStreamReady?.(displayStream)
    } catch (err) {
      console.error("Error sharing screen:", err)
      setError("无法获取屏幕权限或用户取消了操作。")
    }
  }

  // --- 2. 核心功能：停止屏幕共享 ---
  function stopShare() {
    if (isRecording) {
      stopRecording()
    }

    if (stream) {
      const tracks = stream.getTracks()
      tracks?.forEach((track) => track.stop())
      setStream(null)
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // --- 3. 核心功能：开始录制 ---
  function startRecording() {
    if (!stream) return

    setRecordedChunks([])
    try {
      // 创建 MediaRecorder 实例
      // 注意：mimeType 可能需要根据浏览器兼容性调整，这里优先选 webm
      const options = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? { mimeType: "video/webm; codecs=vp9" }
        : { mimeType: "video/webm" }

      const recorder = new MediaRecorder(stream, options)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data])
        }
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch (err) {
      setError("初始化录制失败，请检查浏览器兼容性。")
    }
  }

  // --- 4. 核心功能：停止录制 ---
  function stopRecording() {
    if (!mediaRecorderRef.current || !isRecording) {
      return
    }
    mediaRecorderRef.current.stop()
    setIsRecording(false)
  }

  // --- 5. 核心功能：下载录像 ---
  function downloadRecording() {
    if (recordedChunks.length === 0) return

    const blob = new Blob(recordedChunks, { type: "video/webm" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    document.body.appendChild(a)
    a.style.display = "none"
    a.href = url
    a.download = `recording-${new Date().toISOString()}.webm`
    a.click()
    window.URL.revokeObjectURL(url)

    // 可选：下载后清空缓存
    // setRecordedChunks([]);
  }

  // 切换音频选项 (需要在开始共享前设置)
  function toggleAudioConfig() {
    if (!stream) {
      setAudioEnabled(!audioEnabled)
    }
  }

  return (
    <div className="flex justify-center p-6 w-full">
      <Card className="w-full max-w-4xl shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MonitorPlay className="w-5 h-5 text-blue-600" />
              屏幕共享与录制
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {/* 状态指示器 */}
            {stream && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                共享中
              </Badge>
            )}
            {isRecording && (
              <Badge variant="destructive" className="animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
                录制中 (REC)
              </Badge>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 视频预览区域 */}
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border shadow-inner">
            {isStarted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted // 本地预览必须静音，否则会产生回音
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-zinc-500 flex flex-col items-center">
                <MonitorPlay className="w-16 h-16 mb-4 opacity-20" />
                <p>点击下方按钮开始共享屏幕</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-4 justify-between bg-zinc-50/50 dark:bg-zinc-900/20 p-6">
          <div className="flex gap-2 items-center">
            {/* 共享控制 */}
            {!stream ? (
              <div className="flex gap-2">
                <Button onClick={startShare} className="gap-2">
                  <MonitorPlay className="w-4 h-4" />
                  开始共享
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudioConfig}
                  title={audioEnabled ? "将捕获系统音频" : "静音共享"}
                >
                  {audioEnabled ? (
                    <Mic className="w-4 h-4 text-green-600" />
                  ) : (
                    <MicOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={stopShare} variant="destructive" className="gap-2">
                <CircleStop className="w-4 h-4" />
                停止共享
              </Button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {/* 录制控制 */}
            {stream && !isRecording && (
              <Button
                onClick={startRecording}
                variant="outline"
                className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 text-zinc-700"
              >
                <Video className="w-4 h-4" />
                开始录制
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" className="gap-2">
                <CircleStop className="w-4 h-4" />
                停止录制
              </Button>
            )}

            {/* 下载控制 */}
            {recordedChunks.length > 0 && !isRecording && (
              <Button onClick={downloadRecording} variant="secondary" className="gap-2">
                <Download className="w-4 h-4" />
                下载录像 ({recordedChunks.length} chunks)
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ScreenShareRecorder
