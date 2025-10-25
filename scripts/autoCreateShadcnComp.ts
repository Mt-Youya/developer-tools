import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = argv.slice(2);

const shadcnCommand = "pnpm dlx shadcn@latest add";
const uiPath = path.resolve(__dirname, "../packages/ui/src/components/");
// 执行命令的函数
function executeCommand(component = "") {
  try {
    console.log("Executing component: ", component);
    execSync(`${shadcnCommand} ${component}`, { stdio: "inherit" });
    console.log('created via shadcn');
    const raw = fs.readFileSync(path.join(uiPath, `${component}.tsx`), 'utf-8');
    console.log('raw');
    
    const compo = component.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join("");
    console.log('comp');
    createDirAndFile(path.join(uiPath, compo), path.join(uiPath, `${compo}/${component}.tsx`));
    console.log('comp.tsx');
    createDirAndFile(path.join(uiPath, compo), path.join(uiPath, `${compo}/${component}.test.tsx`));
    console.log('comp.test.tsx');
    createDirAndFile(path.join(uiPath, compo), path.join(uiPath, `${compo}/index.ts`));
    console.log('index.ts');
    fs.writeFileSync(path.join(uiPath, `${compo}/${component}.tsx`), raw);
    console.log('wrote tsx');
    fs.writeFileSync(path.join(uiPath, `${compo}/index.ts`), `export * from './${component}';`);
    console.log('wrote index.ts');
    console.log(`Component ${compo} created successfully in ${uiPath}`);
    fs.unlinkSync(path.join(uiPath, `${component}.tsx`));
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
executeCommand(args[0]);
