/*
 * @Author: Mt-Youya dd257248@163.com
 * @Date: 2026-03-28 01:33:34
 * @LastEditors: Mt-Youya dd257248@163.com
 * @LastEditTime: 2026-03-28 02:36:17
 * @FilePath: \developer-tools\packages\ui\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/// <reference types="vitest/config" />
import { readdirSync } from "node:fs"
import path, { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import AutoImport from "unplugin-auto-import/vite"
import { defineConfig } from "vite"
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
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    // oxlintConfig,
    AutoImport({
      imports: ["react", "react-router", "react-router-dom"],
      include: [/\.[tj]sx?$/],
      dts: true,
    }),
  ],
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
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1024 * 4,
    outDir: "dist",
    lib: {
      entry,
      formats: ["es", "cjs"],
      fileName: (f, e) => `${e}.${f === "es" ? "mjs" : f}`,
      cssFileName: "style",
    },
    minify: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
})
