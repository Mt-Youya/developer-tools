import { Button } from "@devtools/ui/Button"
import { Slider } from "@devtools/ui/Slider"
import { formatTime } from "@devtools/utils"
import { Heart, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"

import type { Song } from "@/types/music"

interface PlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  playlist: Song[]
}

function Player({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isLiked, setIsLiked] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    async function playAudio() {
      try {
        setIsLoading(true)
        setError(null)

        if (isPlaying) {
          await audio!.play()
          console.log("播放成功:", currentSong?.title)
        } else {
          audio!.pause()
          console.log("暂停播放")
        }
      } catch (err) {
        console.error("播放错误:", err)
        setError("播放失败，请检查音频文件")
      } finally {
        setIsLoading(false)
      }
    }

    playAudio()
  }, [isPlaying, currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      console.log("音频加载完成, 时长:", audioRef.current.duration)
    }
  }

  function handleSeek(value: number[]) {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  function handleEnded() {
    if (isRepeat) {
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
    } else {
      onNext()
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("音频加载错误:", e)
    setError("无法加载音频文件")
  }

  function handleCanPlay() {
    console.log("音频可以播放")
    setIsLoading(false)
  }

  const [audioUrl, setAudioUrl] = useState(currentSong?.audioUrl)
  useEffect(() => {
    const url = currentSong?.audioUrl
    if (url) {
      if (url.endsWith(".mp3")) {
        return setAudioUrl(url)
      }
      const [, query] = url.split("com/")
      fetch("/api/audio/" + query)
        .then((res) => res.blob())
        .then((res) => {
          const url = URL.createObjectURL(res)
          setAudioUrl(url)
        })
    }
  }, [currentSong?.audioUrl])

  if (!currentSong) {
    return null
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 z-50">
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={handleCanPlay}
        onLoadStart={() => {
          console.log("开始加载:", currentSong.audioUrl)
          setIsLoading(true)
        }}
        preload="metadata"
      />

      <div className="max-w-screen-2xl mx-auto">
        {/* Error Message */}
        {error && <div className="mb-2 text-center text-sm text-red-500">{error}</div>}

        {/* Progress Bar */}
        <div className="mb-2">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="relative">
              <img src={currentSong.cover} alt={currentSong.title} className="w-14 h-14 rounded-lg object-cover" />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold truncate">{currentSong.title}</h4>
              <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>
            </div>
            <Button variant="secondary" size="icon" onClick={() => setIsLiked(!isLiked)} className="shrink-0">
              <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 shrink-0 mx-8">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
              className={isShuffle ? "text-primary" : ""}
            >
              <Shuffle className="w-5 h-5" />
            </Button>

            <Button variant="secondary" size="icon" onClick={onPrevious} disabled={isLoading}>
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button size="icon" onClick={onPlayPause} className="w-12 h-12 rounded-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>

            <Button variant="secondary" size="icon" onClick={onNext} disabled={isLoading}>
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsRepeat(!isRepeat)}
              className={isRepeat ? "text-primary" : ""}
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24"
            />
            <span className="text-xs text-gray-500 w-8">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
