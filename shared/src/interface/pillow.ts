export interface PillowBundle {
  isStage: number
  bundleName: string
  bundleVersion: string
}

export interface PillowParams {
  index: number
  type: string
  blockOnFail: boolean
  info: PillowBundle
}

export interface PillowCode {
  code: string
  pillow: string
  h5Scheme: string
}
