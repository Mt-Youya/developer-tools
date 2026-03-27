import fs from "node:fs"
import path, { extname } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig, type ServerOptions } from "vite"
import Inspect from "vite-plugin-inspect"
import { oxlintConfig } from "../../configs/oxlint-config"

function ServerProxy(): ServerOptions["proxy"] {
  const envPath = path.resolve("../../server/api/.env")

  const envRaw = fs.readFileSync(envPath, "utf8")
  const port = envRaw.match(/^PORT=(\d+)/m)?.[1]

  const target = "http://localhost:" + port
  // console.log("target", target)

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
    "/api/v1/waybill/routes": {
      target,
    },
    "/api/v1/diva/listVersions": {
      target,
    },
    "/api/v1/diva/groupVerions": {
      target,
    },
    "/api/v1/diva/pillowRequest": {
      target,
    },
    "/api/v1/weather/getWeather": {
      target,
    },
    "/api/v1/catpaw": {
      target: "http://localhost:3000",
    },
    "/api/v1/getOrgPages": {
      target: "http://localhost:3000",
    },
    "/api/v1/getOrgModule": {
      target: "http://localhost:3000",
    },
  }
}
const cssExts = [".css", ".less", ".scss", "sass", ".stylus"]
const defaultConf = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    Inspect({ build: true, outputDir: ".vite-inspect" }),
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
    }),
    // oxlintConfig,
  ],
  server: {
    host: true,
    proxy: ServerProxy(),
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },

  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name].[hash].js",
        compact: true,
        assetFileNames: (chunkInfo) => {
          const exts = chunkInfo.names.map((n) => extname(n)).filter(Boolean)

          if (cssExts.includes(exts[0])) {
            return `assets/css/[name].[hash].[ext]`
          }

          return `assets/images/[name].[hash].[ext]`
        },
      },
    },
    minify: true,
    // terserOptions: {
    //     compress: {
    //         drop_console: false,
    //         ecma: 2015,
    //         toplevel: true,
    //     },
    // },
    // reportCompressedSize: false,
    cssCodeSplit: true,
    assetsInlineLimit: 1024 * 5,
    emptyOutDir: true,
  },

  preview: {
    host: true,
  },
})

export default defaultConf
