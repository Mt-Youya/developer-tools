// src/components/chat/ChatWindow.tsx
import { cn } from "@devtools/libs"
import { Loader2 } from "lucide-react"
import { ChatInput } from "./components/ChatInput"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  metadata?: {
    images?: string[]
    audio?: string
  }
}

export default function ChatWindow() {
  "use memo"
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 创建助手消息占位符
    const assistantMessageId = crypto.randomUUID()
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      // SSE 流式响应
      await streamResponse(userMessage.content, assistantMessageId)
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: "抱歉，发生了错误。请重试。" } : msg))
      )
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const streamResponse = async (prompt: string, messageId: string) => {
    setIsStreaming(true)
    abortControllerRef.current = new AbortController()

    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, history: messages.slice(-10) }),
      signal: abortControllerRef.current.signal,
    })

    if (!response.ok) throw new Error("Stream failed")

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error("No reader available")

    let accumulatedContent = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") continue

          try {
            const parsed = JSON.parse(data)
            accumulatedContent += parsed.content || ""

            setMessages((prev) =>
              prev.map((msg) => (msg.id === messageId ? { ...msg, content: accumulatedContent } : msg))
            )
          } catch (e) {
            console.error("Parse error:", e)
          }
        }
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold">AI 助手</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>思考中...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput value={input} onChange={setInput} onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  )
}

// Message Bubble Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200"
        )}
      >
        <div className="whitespace-pre-wrap break-words">
          <MarkdownRenderer content={message.content} />
        </div>
        <div className={cn("text-xs mt-1", isUser ? "text-blue-100" : "text-gray-400")}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

// Markdown Renderer (简化版)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  // 这里可以集成 react-markdown 或自定义渲染
  return <div>{content}</div>
}
