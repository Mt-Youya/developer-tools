import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const IS_DEV = process.env.NODE_ENV === "development"

function checkProcess() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const runDevShellPath = path.join(__dirname, "../../../../scripts/run-dev.sh")

  console.log("runDevShellPath", runDevShellPath)

  // 执行 sh 文件
  const child = spawn("sh", [runDevShellPath])

  // 实时输出 stdout
  child.stdout.on("data", (data) => {
    console.log(`${data}`)
  })

  // 实时输出 stderr
  child.stderr.on("data", (data) => {
    console.error(`${data}`)
  })

  // 监听退出
  child.on("close", (code) => {
    console.log(`进程退出，代码: ${code}`)
  })
}

if (IS_DEV) {
  checkProcess()
}
