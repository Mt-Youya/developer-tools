import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig, type PluginOption } from "vite"
import Inspect from "vite-plugin-inspect"
import { oxlintConfig } from "../../configs/oxlint-config"

const defaultConf = defineConfig({
  plugins: [
    react(),
    tailwindcss() as PluginOption,
    Inspect({ build: true, outputDir: ".vite-inspect" }),
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
      dts: true,
    }),
    oxlintConfig,
  ],
  server: {
    host: true, // 允许外部访问
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },

  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  // 预览服务器配置（用于预览构建结果）
  preview: {
    port: 4103,
    host: true,
  },
})

// export default mergeConfig(defaultConf, configs, true);
export default defaultConf
