import { create } from "zustand"
import { FormatDetectors, type FormatDetectorsType } from "@/constants/FormatDetectors"
import type { Writeable } from "@/types/utils"

export interface Dictionary {
    [p: string]: string | number
}

type DetectorsType = Writeable<FormatDetectorsType>[number] & { checked: boolean }
interface CommandState {
    baseCommand: string
    setBaseCommand: (baseCommand: string) => void

    commandSuffix: string
    setCommandSuffix: (commandSuffix: string) => void
 
    extractedData: Dictionary
    setExtractedData: (extractedData: Dictionary) => void

    targetFields: string
    setTargetFields: (targetFields: string) => void

    detectors: DetectorsType[]
    setDetectors: (detectors: DetectorsType[]) => void
}

export const CommandStore = create<CommandState>((set) => ({
    baseCommand: `hdc shell "aa start -U 'protocol://www.example.com/?server=http://`,
    setBaseCommand: (baseCommand: string) => set({ baseCommand }),

    commandSuffix: `'"`,
    setCommandSuffix: (commandSuffix: string) => set({ commandSuffix }),

    extractedData: {},
    setExtractedData: (extractedData: Dictionary) => set({ extractedData }),

    targetFields: "cityId,mboxCouponId,spuId",
    setTargetFields: (targetFields: string) => set({ targetFields }),

    detectors: FormatDetectors.map(item => ({ ...item,  checked: item.format === "properties" })),
    setDetectors: (detectors: DetectorsType[]) => set({ detectors }),
}))
