/// <reference types="vitest/config" />
import { readdirSync } from "node:fs"
import path, { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig, type PluginOption } from "vite"
import { oxlintConfig } from "../../configs/oxlint-config"

// 获取 components 目录下的所有组件
const componentsDir = resolve(__dirname, "src/components")
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)

// 生成入口点配置
const entry = components.reduce(
  (entries, component) => {
    entries[component] = resolve(componentsDir, component, "index.ts")
    return entries
  },
  {
    index: resolve(__dirname, "main.ts"),
  }
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), oxlintConfig as PluginOption],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__test__/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "**/*.test.{ts,tsx}", "**/*.config.{ts,js}", "**/index.ts"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: undefined,
  build: {
    watch: null,
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry,
      formats: ["es"],
      cssFileName: "style",
    },
    minify: true,
  },
})
