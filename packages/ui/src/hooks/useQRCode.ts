import { useMemo } from "react"
import { QrCode, QrSegment } from "../components/QRCode/QRCode"
import type { ErrorCorrectionLevel, ImageSettings } from "../components/QRCode/type"
import { ERROR_LEVEL_MAP, getImageSettings, getMarginSize } from "../components/QRCode/util"

interface Options {
  value: string | string[]
  level: ErrorCorrectionLevel
  minVersion: number
  includeMargin: boolean
  marginSize?: number
  imageSettings?: ImageSettings
  size: number
  boostLevel?: boolean
}

export function useQRCode({
  value,
  level,
  minVersion,
  includeMargin,
  marginSize,
  imageSettings,
  size,
  boostLevel,
}: Options) {
  const memoizedQrcode = useMemo(() => {
    const values = Array.isArray(value) ? value : [value]
    const segments = values.reduce<QrSegment[]>((acc, val) => {
      acc.push(...QrSegment.makeSegments(val))
      return acc
    }, [])
    return QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, undefined, undefined, boostLevel)
  }, [value, level, minVersion, boostLevel])

  return useMemo(() => {
    const cs = memoizedQrcode.getModules()
    const mg = getMarginSize(includeMargin, marginSize)
    const ncs = cs.length + mg * 2
    const cis = getImageSettings(cs, size, mg, imageSettings)
    return {
      cells: cs,
      margin: mg,
      numCells: ncs,
      calculatedImageSettings: cis,
      qrcode: memoizedQrcode,
    }
  }, [memoizedQrcode, size, imageSettings, includeMargin, marginSize])
}
