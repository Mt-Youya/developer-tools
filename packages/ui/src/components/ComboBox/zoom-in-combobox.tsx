"use client"

import { cn } from "@devtools/libs"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { useId, useState } from "react"
import { Button } from "../Button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../Command"
import { Label } from "../Label"
import { Popover, PopoverContent, PopoverTrigger } from "../Popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ComboboxZoomIn() {
  "use memo"
  const id = useId()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor={id}>Combobox menu zoom-in</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full max-w-xs justify-between"
          >
            {value ? frameworks.find((framework) => framework.value === value)?.label : "Select framework..."}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="data-[state=open]:zoom-in-0! origin-center p-0 duration-500">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.label}
                    <CheckIcon className={cn("ml-auto", value === framework.value ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
