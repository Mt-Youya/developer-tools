// src/components/chat/ChatInput.tsx

import { Button } from "@devtools/ui/Button"
import { Textarea } from "@devtools/ui/Textarea"
import { Image as ImageIcon, Mic, Send } from "lucide-react"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading: boolean
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
  "use memo"
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const handleVoiceInput = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("浏览器不支持语音识别")
      return
    }

    // @ts-expect-error
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "zh-CN"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onChange(value + transcript)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleImageUpload = () => {
    // 触发文件上传
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // 处理图像上传逻辑
        const imageUrl = await uploadImage(file)
        onChange(value + `\n[图片: ${imageUrl}]`)
      }
    }
    input.click()
  }

  return (
    <div className="bg-white border-t px-6 py-4">
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
            className="min-h-[60px] max-h-[200px] resize-none pr-24"
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={isRecording ? "text-red-500" : ""}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={handleImageUpload} disabled={isLoading}>
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Send Button */}
        <Button onClick={onSend} disabled={isLoading || !value.trim()} className="h-[60px]">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

// 图片上传辅助函数
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data.url
}
