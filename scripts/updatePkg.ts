const fs = require("fs");
const path = require("path");

// 获取components文件夹下的所有子目录
function getDirectories(src: string) {
  return fs.readdirSync(src).filter((file: string) => fs.statSync(path.join(src, file)).isDirectory());
}

const componentsDir = path.resolve(__dirname, "../packages/components");
console.log("componentsDir", componentsDir);

getDirectories(componentsDir).forEach((componentName: string) => {
  const componentPath = path.join(componentsDir, componentName);

  // 创建package.json文件
  // fs.writeFileSync(
  //   path.join(componentPath, "package.json"),
  //   JSON.stringify({
  //     name: `@devtools/${componentName}`,
  //     version: "1.0.0",
  //     license: "MIT",
  //     source: "./src/index.ts",
  //     main: "./src/index.ts",
  //     type: "module",
  //     module: "./src/index.ts",
  //     publishConfig: {
  //       main: "./dist/index.js",
  //       module: "./dist/index.mjs",
  //       types: "./dist/index.d.ts",
  //       exports: {
  //         ".": {
  //           import: {
  //             types: "./dist/index.d.mts",
  //             default: "./dist/index.mjs",
  //           },
  //           require: {
  //             types: "./dist/index.d.ts",
  //             default: "./dist/index.js",
  //           },
  //         },
  //       },
  //     },
  //     files: ["dist", "README.md"],
  //     sideEffects: false,
  //     scripts: {
  //       lint: "eslint  --max-warnings 0 src",
  //       clean: "rm -rf dist",
  //       typecheck: "tsc --noEmit",
  //     },
  //     devDependencies: {
  //       "@types/react": "^19.2.2",
  //       "@types/react-dom": "^19.2.2",
  //       react: "^19.2.0",
  //       "react-dom": "^19.2.0",
  //       typescript: "^5.9.3",
  //     },
  //   })
  // );

  // // 创建tsconfig.json文件
  // fs.writeFileSync(
  //   path.join(componentPath, "tsconfig.json"),
  //   JSON.stringify({
  //     extends: "../../../internal/library.json",
  //     compilerOptions: {
  //       outDir: "dist",
  //     },
  //     include: ["src"],
  //     exclude: ["node_modules", "dist"],
  //   })
  // );

  // // 创建src文件夹和其中的index.ts文件
  // fs.mkdirSync(path.join(componentPath, "src"));
  // fs.writeFileSync(path.join(componentPath, "src", `${componentName}.ts`), "");
  try {
    const cname = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const pkgPath = path.join(componentPath, "src", "index.ts");
    const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
    fs.writeFileSync(pkgPath, pkgRaw.replace(`export { ${componentName} }`, `export *`));
  } catch (err) {
    console.error(`Error file for component ${componentName}:`, err);
  }

  // try {
  //     const indexFile = fs.readFileSync(
  //       path.join(componentPath, "index.tsx"),
  //       "utf-8"
  //     );

  //     const cname =
  //       componentName.charAt(0).toLowerCase() + componentName.slice(1);
  //     fs.writeFileSync(
  //       path.join(componentPath, "src", `${cname}.tsx`),
  //       indexFile
  //     );
  //     fs.writeFileSync(path.join(componentPath, "src", `${cname}.test.tsx`), "");
  //     fs.writeFileSync(
  //       path.join(componentPath, "src", "index.ts"),
  //       `'use client';
  // export {} from './${cname}';`
  //     );

  //     fs.unlinkSync(path.join(componentPath, "index.tsx")).catch(() => {});
  //     fs.unlinkSync(path.join(componentPath, "src", `${componentName}.ts`)).catch(
  //       () => {}
  //     );
  //   } catch (err) {
  //     console.error(`Error processing component ${componentName}:`, err);
  // }
});
