// src/lib/ml/imageClassifier.ts
import * as tf from "@tensorflow/tfjs"
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import * as mobilenet from "@tensorflow-models/mobilenet"

export class ImageClassifier {
  private mobileNetModel: mobilenet.MobileNet | null = null
  private objectDetectionModel: cocoSsd.ObjectDetection | null = null

  async loadModels() {
    try {
      // 使用 WebGL 后端优化性能
      await tf.setBackend("webgl")

      // 加载 MobileNet (图像分类)
      this.mobileNetModel = await mobilenet.load({
        version: 2,
        alpha: 1.0,
      })

      // 加载 COCO-SSD (物体检测)
      this.objectDetectionModel = await cocoSsd.load({
        base: "mobilenet_v2",
      })

      console.log("Image models loaded")
    } catch (error) {
      console.error("Failed to load models:", error)
      throw error
    }
  }

  async classifyImage(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<Array<{ className: string; probability: number }>> {
    if (!this.mobileNetModel) {
      throw new Error("MobileNet model not loaded")
    }

    const predictions = await this.mobileNetModel.classify(imageElement, 3)
    return predictions
  }

  async detectObjects(
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<Array<{ class: string; score: number; bbox: number[] }>> {
    if (!this.objectDetectionModel) {
      throw new Error("Object detection model not loaded")
    }

    const predictions = await this.objectDetectionModel.detect(imageElement)
    return predictions
  }

  dispose() {
    if (this.mobileNetModel) {
      this.mobileNetModel.dispose()
    }
    if (this.objectDetectionModel) {
      this.objectDetectionModel.dispose()
    }
  }
}

// 使用示例
export async function analyzeImage(imageUrl: string) {
  const classifier = new ImageClassifier()
  await classifier.loadModels()

  const img = new Image()
  img.src = imageUrl
  await img.decode()

  const [classifications, detections] = await Promise.all([
    classifier.classifyImage(img),
    classifier.detectObjects(img),
  ])

  classifier.dispose()

  return { classifications, detections }
}
