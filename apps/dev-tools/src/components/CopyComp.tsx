import { Button, type ButtonProps } from "@devtools/ui/Button"
import { Slot } from "@radix-ui/react-slot"
import { CheckCircle } from "lucide-react"
import useCopy from "@/hooks/useCopy"

export default function CopyComp({
  asChild = false,
  copyValue = "",
  text = "",
  ...props
}: ButtonProps & { copyValue: any; text: React.ReactNode }) {
  const { status, copyToClipboard } = useCopy(copyValue)

  async function handleCopy(value: typeof copyValue) {
    fetch("/api/copy", {
      method: "POST",
      body: JSON.stringify({
        g: "bbb",
        a: "sss",
      }),
    })

    await copyToClipboard(value)
  }

  const Comp = asChild ? Slot : Button

  return (
    <Comp className="my-2" onClick={() => handleCopy(copyValue)} {...props}>
      {status ? (
        <>
          <CheckCircle size={16} />
          已复制
        </>
      ) : (
        text
      )}
    </Comp>
  )
}
