import type { DevicePlatform, Env } from "@/interface/common"

export interface DivaVersionParams {
  bundleName: string
  env: Env
  platform: DevicePlatform
  pageSize: number
  pageIndex: number
}

export interface DivaGroupVersions {
  bundleNames: DivaVersionParams["bundleName"][]
  env: Env
  platform: DevicePlatform
}

interface Page {
  currentPageNum: number
  pageSize: number
  totalCount: number
  totalPageCount: number
}

export interface BundleVersionList {
  list: BundleVersionInfo[]
  pageInfo: Page
}

export interface BundleVersionInfo {
  name: string
  version: string
  publishLogUrl: string
  packUser: string
  packTime: string
  latestUpdateTime: string
  comment: string
  publishType: string
  ruleList: PublishRule[]
  id: number
  commitUrl: string
  rnVersion: string
  createTime: string
  originMd5: string
  md5DioZip0: string | null
  productType: string | null
  versionInfoUrl: string | null
  packUserInfo: PackUserInfo
  commentText: string
  publishTypeText: string
  dynamicAppType: string
  env: string
  mrnBaseType: string
}

interface PublishRule {
  platform: string
  app: string
  status: number
  publishApp: PublishApp
  bundleVersionStatus: number
  md5: string
  bundleHitReportDto: any | null
  products: Product[]
}

interface PublishApp {
  id: number
  platform: string
  name: string
  applicationId: string
  nick: string
  appKey: string
  settings: string | null
  callbackUrl: string | null
  adminCallbackUrl: string | null
  icon: string | null
  sharkPushAppId: number | null
  orderby: number
  hyperloopxName: string
  crashName: string
  oceanName: string
  isDelete: number
  patchApproversJson: string | null
  patchNotifyGroupId: number | null
  approversJson: string | null
  enableExpireNotify: boolean
  expireDays: number | null
  unitConfirm: boolean
}

interface Product {
  productType: string
  bundleId: number
  zip9Url: string
  dioZip9Url: string
  brUrl: string
  xzipUrl: string | null
  md5: string
  packageSize: number
}

interface PackUserInfo {
  misId: string
  name: string
  avatar: string
  uid: number
}
