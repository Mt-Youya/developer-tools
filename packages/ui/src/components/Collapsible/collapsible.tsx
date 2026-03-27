"use client"

import {
  type CollapsiblePanelProps,
  Collapsible as CollapsiblePrimitive,
  type CollapsibleRootProps,
  type CollapsibleTriggerProps,
} from "@base-ui/react/collapsible"
import { cn } from "@devtools/libs"

const { Root, Trigger, Panel } = CollapsiblePrimitive

function Collapsible({ ...props }: CollapsibleRootProps) {
  "use memo"
  return <Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsibleTriggerProps) {
  "use memo"
  return <Trigger data-slot="collapsible-trigger" {...props} />
}

function CollapsibleContent({ ...props }: CollapsiblePanelProps) {
  "use memo"
  return <Panel data-slot="collapsible-content" {...props} />
}

function CollapsibleContentAnimated({ className, ...props }: CollapsiblePanelProps) {
  "use memo"
  return (
    <Panel
      data-slot="collapsible-content"
      className={cn(
        "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down flex flex-col gap-2 overflow-hidden transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, CollapsibleContentAnimated }
