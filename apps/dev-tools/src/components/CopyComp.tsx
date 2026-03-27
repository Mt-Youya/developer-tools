import { Button, type ButtonProps } from "@devtools/ui/Button"
import { CheckCircle } from "lucide-react"
import type { ReactNode } from "react"
import useCopy from "@/hooks/useCopy"

type CopyCompProps = {
  copyValue: any
  text: ReactNode
} & ButtonProps

export default function CopyComp({ copyValue = "", text = "", ...props }: CopyCompProps) {
  "use memo"
  const { status, copyToClipboard } = useCopy(copyValue)

  async function handleCopy(value: typeof copyValue) {
    await copyToClipboard(value)
  }

  return (
    <Button className="my-2" onClick={() => handleCopy(copyValue)} {...props}>
      {status ? (
        <>
          <CheckCircle size={16} />
          已复制
        </>
      ) : (
        text
      )}
    </Button>
  )
}
