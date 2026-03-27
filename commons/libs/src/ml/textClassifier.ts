// src/lib/ml/textClassifier.ts
import * as tf from "@tensorflow/tfjs"
import * as use from "@tensorflow-models/universal-sentence-encoder"

export class TextClassifier {
  private model: tf.LayersModel | null = null
  private encoder: use.UniversalSentenceEncoder | null = null
  private labels: string[] = []

  async loadModel(modelUrl: string, labels: string[]) {
    try {
      // 加载 Universal Sentence Encoder
      this.encoder = await use.load()

      // 加载分类模型
      this.model = await tf.loadLayersModel(modelUrl)
      this.labels = labels

      console.log("Text classifier model loaded")
    } catch (error) {
      console.error("Failed to load model:", error)
      throw error
    }
  }

  async classify(text: string): Promise<{ label: string; confidence: number }[]> {
    if (!this.model || !this.encoder) {
      throw new Error("Model not loaded")
    }

    // 编码文本
    const embeddings = await this.encoder.embed([text])

    // 预测
    const predictions = this.model.predict(embeddings) as tf.Tensor
    const scores = await predictions.data()

    // 清理内存
    embeddings.dispose()
    predictions.dispose()

    // 返回结果
    return this.labels
      .map((label, i) => ({
        label,
        confidence: scores[i],
      }))
      .sort((a, b) => b.confidence - a.confidence)
  }

  dispose() {
    if (this.model) {
      this.model.dispose()
    }
  }
}
