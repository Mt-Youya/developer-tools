// 共享配置 shared-vite-config.ts
import Oxlint from 'unplugin-oxlint/vite';

export const oxlintConfig = Oxlint({
  includes: ['src/**/*.{ts,tsx}'],
  glob: true,
  watch: true,
  deny: ['correctness', 'suspicious', 'perf'],
  allow: ['style', 'naming', 'formatting'],
});
