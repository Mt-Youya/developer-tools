import fs from "node:fs"
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig, type Plugin, type PluginOption, type ServerOptions } from "vite"
import Inspect from "vite-plugin-inspect"
import { oxlintConfig } from "../../configs/oxlint-config"

function GameProxy(): ServerOptions["proxy"] {
  const envPath = path.resolve("../../server/api/.env")
  console.log("envPath", envPath)

  const envRaw = fs.readFileSync(envPath, "utf8")
  // console.log("envRaw", envRaw)
  const port = envRaw.match(/^PORT=(\d+)/m)?.[1]

  const target = "http://localhost:" + port
  console.log("target", target)

  return {
    "/api/v1/games/all": {
      target,
    },
    "/api/v1/games/gog": {
      target,
    },
    "/api/v1/games/steam": {
      target,
    },
    "/api/v1/games/epic": {
      target,
    },
    "/api/v1/games/freetogame": {
      target,
    },
    "/api/v1/games/cheapshark": {
      target,
    },
    "/api/v1/music/tracks": {
      target,
    },
  }
}

const defaultConf = defineConfig({
  plugins: [
    react(),
    tailwindcss() as PluginOption,
    // Inspect({ build: true, outputDir: ".vite-inspect" }),
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
      dts: true,
    }),
    oxlintConfig,
  ],
  server: {
    host: true, // 允许外部访问
    proxy: GameProxy(),
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },

  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  preview: {
    host: true,
  },
})

export default defaultConf
