import { exec } from "node:child_process"

import { argv } from "node:process"

const [component] = argv.slice(2)

exec(
  `pnpm dlx shadcn@latest add ${component} --src ./packages/ui/src/components --dst ./apps/dev-tools/src/ui --css tailwind --force`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  }
)
