import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

execSync("vite build --mode production")

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log("__dirname", __dirname)

const cssRaw = fs.readFileSync(path.join(__dirname, "dist/style.css"), "utf8")

const appPath = path.join(__dirname, "../../apps/dev-tools/src/style/global.css")
fs.writeFileSync(appPath, cssRaw)
