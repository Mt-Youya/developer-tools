import fs,{ readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const pkgPath = resolve(__dirname, "../packages/ui/package.json");
const componentsDir = resolve(__dirname, "../packages/ui/components");
const pkg = JSON.parse(await fs.promises.readFile(pkgPath, "utf-8"));

const components = readdirSync(componentsDir, { withFileTypes: true })
  .filter(f => f.isDirectory())
  .map(f => f.name);

pkg.exports = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.mjs",
    require: "./dist/index.cjs"
  }
};

for (const name of components) {
  pkg.exports[`./${name}`] = {
    types: `./dist/${name}.d.ts`,
    import: `./dist/${name}.mjs`,
    require: `./dist/${name}.cjs`
  };
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log("✅ 已自动生成 exports 配置");
