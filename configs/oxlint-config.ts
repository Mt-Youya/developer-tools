// 共享配置 shared-vite-config.ts
import Oxlint from "unplugin-oxlint/vite"

export const oxlintConfig = Oxlint({
  glob: true,
  includes: ["src/**/*.{ts,tsx}"],
  deny: ["correctness", "suspicious", "perf"],
  allow: ["style", "naming", "formatting"],
})
