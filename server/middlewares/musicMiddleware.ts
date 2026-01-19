import fs from "node:fs"
import path from "node:path"

export default function MusicMiddlewar() {
  return {
    name: "tracks-cache-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (url?.startsWith("/api/tracks/")) {
          tracks(req, res)
        } else if (url.startsWith("/api/audio/")) {
          audio(req, res)
        } else if (url.startsWith("/api/image/")) {
          image(req, res)
        } else {
          next()
        }
      })
    },
  }
}

async function tracks(req, res) {
  const dataPath = path.resolve(".cache/music/data.json")

  try {
    // 检查缓存
    if (fs.existsSync(dataPath)) {
      const musicsData = fs.readFileSync(dataPath, "utf8")
      const parsedData = JSON.parse(musicsData)

      if (parsedData?.results?.length > 0) {
        console.log("✅ tracks: 从缓存返回数据")
        res.setHeader("Content-Type", "application/json")
        res.statusCode = 200
        res.end(musicsData)
        return
      }
    }

    // 从 API 获取
    console.log("🌐 从 Jamendo API 获取数据")
    const apiUrl = req.url.replace("/api/tracks/", "")
    const response = await fetch(`https://api.jamendo.com/${apiUrl}`)
    const data = await response.json()

    if (data?.results?.length > 0) {
      // 保存缓存
      const cacheDir = path.dirname(dataPath)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8")

      res.setHeader("Content-Type", "application/json")
      res.statusCode = 200
      res.end(JSON.stringify(data))
    } else {
      res.statusCode = 404
      res.end(JSON.stringify({ error: "No results" }))
    }
  } catch (error) {
    console.error("❌ tracks: 错误:", error)
    res.statusCode = 500
    res.end(JSON.stringify({ error: error.message }))
  }
}

async function audio(req, res) {
  const trackid = new URL(req.url, "https://localhost:1100").searchParams.get("trackid")
  const dataPath = path.resolve(".cache/music/mp3/")
  const audioPath = path.resolve(dataPath, `${trackid}.mp3`)

  try {
    if (fs.existsSync(audioPath)) {
      res.setHeader("Content-Type", "audio/mpeg")
      console.log("✅ audio: 从缓存返回数据")
      return res.end(fs.readFileSync(audioPath))
    }

    const response = await fetch(`https://prod-1.storage.jamendo.com${req.url}`)
    const data = await response.arrayBuffer()
    if (data) {
      const cacheDir = path.dirname(audioPath)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(audioPath, Buffer.from(data))
      res.setHeader("Content-Type", "audio/mpeg")
      res.end(Buffer.from(data))
    }
  } catch (error) {
    console.error("❌ audio 错误:", error)
  }
}

async function image(req, res) {
  const trackid = new URL(req.url, "https://localhost:1100").searchParams.get("trackid")
  const imagePath = path.resolve(".cache/music/image/")
  const imageFilePath = path.resolve(imagePath, `${trackid}.png`)
  try {
    if (fs.existsSync(imageFilePath)) {
      console.log("✅ image: 从缓存返回数据")
      return res.end(fs.readFileSync(imageFilePath))
    }
    const response = await fetch(`https://usercontent.jamendo.com${req.url}`)
    const data = await response.arrayBuffer()
    if (data) {
      const cacheDir = path.dirname(imageFilePath)
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true })
      }
      fs.writeFileSync(imageFilePath, Buffer.from(data))
      res.end(Buffer.from(data))
    }
  } catch (error) {
    console.error("❌ image 错误:", error)
  }
}
