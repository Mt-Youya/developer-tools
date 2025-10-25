import { IS_PROD } from "@devtools/libs"
import { Button } from "@devtools/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@devtools/ui/Card"
import { Input } from "@devtools/ui/Input"
import { Label } from "@devtools/ui/Label"
import { Progress } from "@devtools/ui/Progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devtools/ui/Select"
import { Slider } from "@devtools/ui/Slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@devtools/ui/Tabs"
import { downloadURL } from "@devtools/utils"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile, toBlobURL } from "@ffmpeg/util"
import { AlertCircle, Download, Loader2, Music, Scissors, Upload, Video } from "lucide-react"
import { type PropsWithChildren, useEffect, useRef, useState } from "react"

interface AudioFormat {
  value: string
  label: string
  extension: string
}

const AUDIO_FORMATS: AudioFormat[] = [
  { value: "mp3", label: "MP3", extension: ".mp3" },
  { value: "wav", label: "WAV", extension: ".wav" },
  { value: "aac", label: "AAC", extension: ".aac" },
  { value: "ogg", label: "OGG", extension: ".ogg" },
  { value: "flac", label: "FLAC", extension: ".flac" },
  { value: "m4a", label: "M4A", extension: ".m4a" },
]

function AudioExtractor() {
  const [loaded, setLoaded] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<string>("mp3")
  const [progress, setProgress] = useState<number>(0)
  const [processing, setProcessing] = useState(false)
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState<number>(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [enableTrim, setEnableTrim] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const ffmpegRef = useRef(new FFmpeg())

  useEffect(() => {
    loadFFmpeg()

    return () => {
      if (extractedAudioUrl) {
        URL.revokeObjectURL(extractedAudioUrl)
      }
    }
  }, [])

  async function loadFFmpeg() {
    const ffmpeg = ffmpegRef.current

    ffmpeg.on("log", ({ message }) => {
      console.log("log: ", message)
    })

    ffmpeg.on("progress", ({ progress: prog }) => {
      setProgress(Math.round(prog * 100))
    })

    try {
      console.log("Loading FFmpeg from local files...")

      const LocalFFmpeg = IS_PROD ? "/public" : "" + "/ffmpeg"
      const baseURL = loadError ? LocalFFmpeg : "https://unpkg.com/@ffmpeg/core@latest/dist/esm"

      // 使用 toBlobURL 转换为 Blob URL，避免 CORS 问题
      console.log("Converting to Blob URLs...")
      const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript")
      console.log("Core Blob URL created:", coreURL)

      const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
      console.log("Wasm Blob URL created:", wasmURL)

      const workerBaseURL = loadError ? LocalFFmpeg : "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm"
      const workerURL = await await toBlobURL(`${workerBaseURL}/ffmpeg-core.worker.js`, "text/javascript")
      console.log("Worker Blob URL created:", wasmURL)

      console.log("Loading FFmpeg...")
      await ffmpeg.load({
        coreURL,
        wasmURL,
        workerURL,
      })

      console.log("FFmpeg loaded successfully!")
      setLoaded(true)
      setLoadError(null)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load FFmpeg:", error)
      setLoadError(
        "无法加载 FFmpeg。\n\n" +
          "错误详情: " +
          (error instanceof Error ? ("message" in error ? error.message : error) : String(error))
      )
      setIsLoading(false)
      loadFFmpeg()
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setExtractedAudioUrl(null)
      setProgress(0)

      const video = document.createElement("video")
      video.preload = "metadata"
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration)
        setEndTime(video.duration)
        URL.revokeObjectURL(video.src)
      }
      video.onerror = () => {
        console.error("无法加载视频元数据")
        URL.revokeObjectURL(video.src)
      }
      video.src = URL.createObjectURL(file)
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  async function extractAudio() {
    if (!videoFile || !loaded) return

    setProcessing(true)
    setProgress(0)

    try {
      const ffmpeg = ffmpegRef.current
      const inputFileName =
        "input" + (videoFile.name.includes(".") ? videoFile.name.substring(videoFile.name.lastIndexOf(".")) : ".mp4")
      const outputFileName = `output.${outputFormat}`

      console.log("Writing input file...")
      await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile))

      const ffmpegArgs: string[] = ["-i", inputFileName]

      if (enableTrim && startTime < endTime) {
        ffmpegArgs.push("-ss", startTime.toString())
        ffmpegArgs.push("-to", endTime.toString())
      }

      switch (outputFormat) {
        case "mp3":
          ffmpegArgs.push("-q:a", "0")
          break
        case "wav":
          ffmpegArgs.push("-acodec", "pcm_s16le")
          break
        case "aac":
          ffmpegArgs.push("-c:a", "aac", "-b:a", "192k")
          break
        case "ogg":
          ffmpegArgs.push("-c:a", "libvorbis", "-q:a", "5")
          break
        case "flac":
          ffmpegArgs.push("-c:a", "flac")
          break
        case "m4a":
          ffmpegArgs.push("-c:a", "aac", "-b:a", "192k")
          break
      }

      ffmpegArgs.push("-vn")
      ffmpegArgs.push(outputFileName)

      console.log("Executing FFmpeg command:", ffmpegArgs.join(" "))
      await ffmpeg.exec(ffmpegArgs)

      console.log("Reading output file...")
      const data = await ffmpeg.readFile(outputFileName)
      const blob = new Blob([data], { type: `audio/${outputFormat}` })

      if (extractedAudioUrl) {
        URL.revokeObjectURL(extractedAudioUrl)
      }

      const url = URL.createObjectURL(blob)
      setExtractedAudioUrl(url)
      setProgress(100)

      console.log("Audio extraction completed successfully!")
    } catch (error) {
      console.error("Error extracting audio:", error)
      alert(`提取音频时出错: ${error instanceof Error ? error.message : "未知错误"}`)
    } finally {
      setProcessing(false)
    }
  }

  function downloadAudio() {
    if (!extractedAudioUrl) return
    downloadURL(extractedAudioUrl, `extracted_audio_${Date.now()}.${outputFormat}`)
  }

  function resetState() {
    if (extractedAudioUrl) {
      URL.revokeObjectURL(extractedAudioUrl)
    }
    setVideoFile(null)
    setExtractedAudioUrl(null)
    setProgress(0)
    setStartTime(0)
    setEndTime(0)
    setVideoDuration(0)
    setEnableTrim(false)
  }

  if (isLoading) return <Loading />

  if (loadError) return <Error> {loadError} </Error>

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Music className="w-10 h-10 text-purple-600" />
            音频提取器
          </h1>
          <p className="text-gray-600">从视频中提取音频，支持多种格式和剪切功能</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              上传视频文件
            </CardTitle>
            <CardDescription>支持 MP4, AVI, MKV, MOV, FLV 等常见视频格式（最大 2GB）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="video-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                  {videoFile ? (
                    <div className="space-y-2">
                      <Video className="w-12 h-12 mx-auto text-purple-600" />
                      <p className="text-sm font-medium">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                        {videoDuration > 0 && ` • ${formatTime(videoDuration)}`}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          resetState()
                        }}
                      >
                        重新选择
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-600">点击上传或拖拽视频文件</p>
                      <p className="text-xs text-gray-500">支持最大 2GB 的视频文件</p>
                    </div>
                  )}
                </div>
              </Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={processing}
              />
            </div>

            {videoFile && (
              <Tabs defaultValue="extract" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="extract">提取设置</TabsTrigger>
                  <TabsTrigger value="trim" onClick={() => setEnableTrim(true)}>
                    <Scissors className="w-4 h-4 mr-2" />
                    剪切音频
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="extract" className="space-y-4">
                  <div className="space-y-2">
                    <Label>输出格式</Label>
                    <Select value={outputFormat} onValueChange={setOutputFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIO_FORMATS.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="trim" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>开始时间: {formatTime(startTime)}</Label>
                      <Slider
                        value={[startTime]}
                        onValueChange={([value]) => setStartTime(Math.min(value, endTime - 1))}
                        max={videoDuration}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>结束时间: {formatTime(endTime)}</Label>
                      <Slider
                        value={[endTime]}
                        onValueChange={([value]) => setEndTime(Math.max(value, startTime + 1))}
                        max={videoDuration}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">剪切时长: {formatTime(endTime - startTime)}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>处理中...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {videoFile && (
              <div className="flex gap-3">
                <Button onClick={extractAudio} disabled={!loaded || processing} className="flex-1" size="lg">
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4 mr-2" />
                      提取音频
                    </>
                  )}
                </Button>

                {extractedAudioUrl && (
                  <Button onClick={downloadAudio} variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>
                )}
              </div>
            )}

            {extractedAudioUrl && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Music className="w-4 h-4 text-green-600" />
                    提取成功！
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <audio src={extractedAudioUrl} controls className="w-full" />
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">功能特点</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Video className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">多格式支持</h3>
                  <p className="text-xs text-gray-600 mt-1">支持所有常见视频格式</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Music className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">音频格式</h3>
                  <p className="text-xs text-gray-600 mt-1">输出 MP3, WAV, AAC 等格式</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Scissors className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">精准剪切</h3>
                  <p className="text-xs text-gray-600 mt-1">自由选择音频片段</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 text-center">
              🔒 所有处理都在您的浏览器本地完成，文件不会上传到服务器，保护您的隐私
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AudioExtractor

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600" />
          <div>
            <h3 className="font-semibold text-lg mb-2">正在加载 FFmpeg...</h3>
            <p className="text-sm text-gray-600">首次加载可能需要一些时间，请稍候</p>
            <p className="text-xs text-gray-500 mt-2">正在加载约 30MB 的 WASM 文件</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Error({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <Card className="max-w-lg w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            FFmpeg 加载失败
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-line font-mono text-xs max-h-64 overflow-y-auto">
            {children}
          </div>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              刷新页面重试
            </Button>
            <p className="text-xs text-center text-gray-600">如问题持续，请尝试使用最新版 Chrome 或 Edge 浏览器</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
