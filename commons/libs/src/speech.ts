// src/lib/speech.ts
export class SpeechService {
  private recognition: any
  private isListening = false

  constructor() {
    if ("webkitSpeechRecognition" in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.setupRecognition()
    }
  }

  private setupRecognition() {
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "zh-CN"
  }

  startListening(onResult: (text: string, isFinal: boolean) => void, onError: (error: any) => void) {
    if (!this.recognition) {
      onError(new Error("Speech recognition not supported"))
      return
    }

    this.recognition.onresult = (event: any) => {
      const results = event.results
      const lastResult = results[results.length - 1]
      const transcript = lastResult[0].transcript
      const isFinal = lastResult.isFinal

      onResult(transcript, isFinal)
    }

    this.recognition.onerror = (event: any) => {
      onError(event.error)
    }

    this.recognition.start()
    this.isListening = true
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }
}
