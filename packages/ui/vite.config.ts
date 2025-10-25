/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path, { resolve } from "node:path";
import { defineConfig } from "vite";
import { readdirSync } from 'node:fs'
import { oxlintConfig } from "../../configs/oxlint-config";
// import copy from "rollup-plugin-copy";

// 获取 components 目录下的所有组件
const componentsDir = resolve(__dirname, 'src/components')
const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

// 生成入口点配置
const entry = components.reduce((entries, component) => {
  entries[component] = resolve(componentsDir, component, 'index.ts')
  return entries
}, {
  index: resolve(__dirname, 'index.ts'), // 主入口
})


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    oxlintConfig,
    // copy({
    //   targets: [
    //     { src: "dist/style.css", dest: "." } // 复制到包根
    //   ]
    // })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__test__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/index.ts'
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build:{
    lib:{    
      entry,
      formats: ['es', 'cjs'],
      fileName: (f, e) => `${e}.${f === 'es' ? 'mjs' : f}`,
      cssFileName: "style",
    },
    rollupOptions:{
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@radix-ui/*',
        'class-variance-authority',
        'clsx',
        'tailwind-merge'
      ],
      output: {
        preserveModules: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      },
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
  }
});
