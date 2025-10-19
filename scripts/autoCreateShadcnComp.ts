import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { argv } from "node:process";

const args = argv.slice(2);

const shadcnCommand = "pnpm dlx shadcn@latest add";
// 执行命令的函数
function executeCommand(component = "") {
  try {
    console.log("Executing component: ", component);
    return execSync(`${shadcnCommand} ${component}`, { stdio: "inherit" });
  } catch (error) {
    console.error("Failed to execute command: ", error);
  }
}

// 创建目录和文件的函数
function createDirAndFile(dir: string, file: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "");
  }
}

// 执行pnpm命令来添加popover组件
executeCommand(args[4]);

// 创建目录和文件
const baseDir = path.resolve(__dirname, "..", "packages/components");
createDirAndFile(baseDir, path.join(baseDir, "package.json"));
createDirAndFile(path.join(baseDir, "Popover"), path.join(baseDir, "Popover/tsconfig.json"));
createDirAndFile(path.join(baseDir, "Popover", "src"), path.join(baseDir, "Popover/src/popover.tsx"));
createDirAndFile(baseDir, path.join(baseDir, "Popover/index.ts"));
