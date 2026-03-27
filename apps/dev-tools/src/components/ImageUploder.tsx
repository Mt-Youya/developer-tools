// src/components/media/ImageUploader.tsx

import { Button } from "@devtools/ui/Button"
import { Loader2, Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (url: string) => void
  maxSize?: number // MB
}

export function ImageUploader({ onUpload, maxSize = 5 }: ImageUploaderProps) {
  "use memo"
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件大小
    if (file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件")
      return
    }

    // 显示预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 上传图片
    setIsUploading(true)
    try {
      const url = await uploadImageToServer(file)
      onUpload(url)
    } catch (error) {
      console.error("Upload failed:", error)
      alert("上传失败，请重试")
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemove() {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="relative">
      {!preview ? (
        <div
          key="image-uploader"
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition"
        >
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-sm text-gray-600">点击上传图片或拖拽到此处</p>
          <p className="text-xs text-gray-400 mt-2">支持 JPG、PNG、GIF，最大 {maxSize}MB</p>
        </div>
      ) : (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full rounded-lg" />
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  )
}

async function uploadImageToServer(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  const data = await response.json()
  return data.url
}
