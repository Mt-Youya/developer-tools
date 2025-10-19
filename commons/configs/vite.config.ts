// commons/vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    // 指定库的入口文件，根据你的实际情况调整
    lib: {
      entry: resolve(__dirname, 'index.ts'), 
    },
    // 确保构建产物是纯净的，不夹杂应用特有的代码分割等
    rollupOptions: {
      // 如果有外部依赖，在此声明，避免打包进库
      external: ['react','react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  },
  // 配置路径别名，保持与项目中其他部分一致
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
