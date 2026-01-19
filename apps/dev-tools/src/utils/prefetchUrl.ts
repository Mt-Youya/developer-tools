import { type PreinitOptions, type PreloadOptions, preconnect, preinit, preload } from "react-dom"

// const connects = [
//   "https://dl.polyhaven.org",
//   "https://grainy-gradients.vercel.app",
//   "https://unpkg.com",
//   "https://cdn.jsdelivr.net",
//   "https://images.unsplash.com",
//   "https://vgbujcuwptvheqijyjbe.supabase.co",
// ]

// for (const connect of connects) {
//   preconnect(connect)
// }

type AS = PreinitOptions["as"] | PreloadOptions["as"] | "fetch"
const urls: { href: string; as: AS; crossOrigin?: PreloadOptions["crossOrigin"] }[] = [
  {
    href: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr",
    as: "image",
  },
  {
    href: "https://grainy-gradients.vercel.app/noise.svg",
    as: "script",
  },
  {
    href: "https://unpkg.com/@ffmpeg/core@latest/dist/esm/ffmpeg-core.js",
    as: "script",
  },
  {
    href: "https://unpkg.com/@ffmpeg/core@latest/dist/esm/ffmpeg-core.wasm",
    as: "fetch",
  },
  {
    href: "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm/ffmpeg-core.worker.js",
    as: "worker",
  },
  {
    href: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    as: "image",
  },
  {
    href: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/videos/generated/131e814c-2206-4271-99a9-67b4cc0630a6.mp4",
    as: "video",
  },
  {
    href: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    as: "fetch",
    crossOrigin: "anonymous",
  },
  {
    href: "https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/projects/fb345f18-bc3b-488a-895f-665d245abc2d/generated-images/generated-35bab1be-23e8-4bc0-82df-b0cca00f10a2.png",
    as: "image",
  },
]

export function preloadFn() {
  for (const { href, as } of urls) {
    if (as === "fetch") {
      Promise.resolve(() => setTimeout(() => preload(href, { as: "script", crossOrigin: "anonymous" }), 2000))
    } else if (as === "image") {
      Promise.resolve(() => setTimeout(() => preload(href, { as: "script", crossOrigin: "anonymous" }), 2000))
    } else if (as === "worker") {
      preload(href, { as, crossOrigin: "anonymous" })
    } else if (as === "video" || as === "audio") {
      preconnect(href)
    } else {
      preload(href, { as: "script" })
    }
  }
}
