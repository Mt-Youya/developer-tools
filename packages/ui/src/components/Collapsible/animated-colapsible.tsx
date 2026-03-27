import { ChevronsUpDownIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"

export function CollapsibleAnimated() {
  "use memo"
  return (
    <Collapsible className="flex w-full max-w-[350px] flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="text-sm font-semibold">@peduarte starred 3 repositories</div>
        <CollapsibleTrigger>
          <ChevronsUpDownIcon />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">@base-ui/primitives</div>
      <CollapsibleContent className="data-[state=closed]:h-0 data-[state=open]:h-[calc(38px * 2 +8px)] flex flex-col gap-2 overflow-hidden transition-all duration-300">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@base-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
