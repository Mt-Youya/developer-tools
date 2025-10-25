import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取components文件夹下的所有子目录
function getDirectories(src: string) {
  return fs.readdirSync(src).filter((file: string) => fs.statSync(path.join(src, file)).isDirectory());
}

const componentsDir = path.resolve(__dirname, "../packages/ui/components");
console.log("componentsDir", componentsDir);

getDirectories(componentsDir).forEach((componentName: string) => {
  const componentPath = path.join(componentsDir, componentName);

  // 删除package.json文件
  fs.unlinkSync(path.join(componentPath, "package.json"));

  // 删除tsconfig.json文件
  fs.unlinkSync(path.join(componentPath, "tsconfig.json"));

  // 删除node_modules文件夹
  fs.rmSync(path.join(componentPath, "node_modules"), { recursive: true, force: true });

  // 复制 src 目录下的所有文件到组件根目录
  const srcDir = path.join(componentPath, "src");
  fs.readdirSync(srcDir).forEach((file: string) => {
    const srcFilePath = path.join(srcDir, file);
    const destFilePath = path.join(componentPath, file);
    fs.renameSync(srcFilePath, destFilePath);
  });

  // 删除 src 目录
  fs.rmdirSync(srcDir);

  console.log(`Processed component: ${componentName}`);
});
