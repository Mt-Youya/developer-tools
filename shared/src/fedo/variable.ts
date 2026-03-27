import type { SSHGit, URLAdress, VersionString } from "../interface/common"

export interface OrgInfo {
  name: string
  mis: string
  orgId: string
  orgName: string
  displayName: string
}

export interface CommitParent {
  id: string
  displayId: string
}

export interface CommitAuthor {
  id: number
  link: {
    rel: string
    url: string
  }
  name: string
  slug: string
  type: string
  links: {
    self: { href: URLAdress }[]
  }
  active: boolean
  jobStatus: string
  displayName: string
  emailAddress: string
}

export interface Commit {
  id: string
  author: CommitAuthor
  message: string
  parents: CommitParent[]
  subject: string
  committer: CommitAuthor
  displayId: string
  lastUpdated: number
  authorTimestamp: number
  committerTimestamp: number
}

export interface ProjectMrnDevopsConfig {
  branch?: string
  talosId?: number
  entryName?: string
  projectRoot?: string
  tags?: string[]
  [key: string]: any
}

export interface ProjectMrnDevops {
  id: number
  tags: any
  type: string
  group: string
  config: ProjectMrnDevopsConfig
  repo_name: string
  created_at: string
  project_id: number
  repository: string
  updated_at: string
  review_rule: any
  repository_data: any
}

export interface ProjectCustomConfig {
  isPreset?: string
  entryName?: string
  user_type: string
  projectRoot: string
  mrnBaseVersion?: string
  packageManager: string
  mrnVersionUpdate?: string
  dockerImageVersion: string
  web_talos_test_cid?: string
  download_tags?: string
  mmcd_business?: string
}

export interface ProjectType {
  id: string
  pm?: string[]
  qa?: string[]
  tl?: string[]
  name: string
  admin?: string[]
  owner: string
  member?: string[]
  status: number
  group_id: string
  repo_url: string
  fedo_type?: string
  import_id: string
  parent_id: string
  created_at: string
  mrn_devops?: ProjectMrnDevops
  tech_stack: string
  updated_at: string
  description: string
  custom_config?: ProjectCustomConfig
  releaseBranch?: string
  project_owners: (string[] | null) | undefined
  import_platform: number
  mis_id?: string
  isMonorepo?: boolean
  isSubApp?: boolean
  orgInfo?: OrgInfo
  [key: string]: any
}

export interface PrResultType {
  prId: number
  repo: SSHGit
  skip: boolean
  prUrl: URLAdress
  title: string
  required: boolean
  taskName: string
  toBranch: string
  reviewers: any[]
  fromBranch: string
  globalPrId: number
  projectKey: string
  repositorySlug: string
}

export interface FastMeasureType {
  risk: {
    status: string
    message: string
  }
  groupId: number
  prResult: PrResultType
  hasPushDx: boolean
  workflowId: number
  hasMigrated: boolean
  allowMigration: boolean
  shouldAssessRisk: boolean
  hasWebTalosBetter: boolean
  isDynamicWorkflow: boolean
  isFeature2Release: boolean
  recommendMigration: boolean
}

export interface AutoTestConfig {
  bundles: {
    version: string
    bundleName: string
  }[]
  testObjects: {
    os: string
    app: string
    mrn: {
      bundle: {
        env: string
        version: string
        bundle_name: string
      }[]
      up_version: string
      low_version: string
    }
    server: {
      swimlane: string
    }
    category: any[]
  }[]
  nativeRelated: boolean
}

export interface BuildConfig {
  repo: SSHGit
  versions: {
    app: string
    appId: string
    branch: string
    taskId: string
    platform: string
    sprintId: string
    bundleName: string
    appLowerVersionCode: number
    appLowerVersionName: string
    appUpperVersionCode: number
    appUpperVersionName: string
  }[]
  bundleName: string
}

export interface TalosCallback {
  talosFlowId: number
  talosFlowIds: number[]
}

// 新增：NPM 版本信息
export interface NpmVersionInfo {
  name: string
  version: string
  commitId?: string
}

// 新增：MDO 发布数据
export interface MdoPublishData {
  branch: string
  commit: string
  endTime: number
  commitId: string
  startTime: number
  workflowId: number
}

export interface ConcurrentTalosBuildGlobalParamsType {
  name: string
  zipUrl: string[]
  version: VersionString
  commitId: string
}

export interface FedoVariable {
  repo?: SSHGit
  ticeId?: number
  commits?: Commit[]
  concurrentTalosBuildGlobalParams?: ConcurrentTalosBuildGlobalParamsType
  dxGroup?: string
  onesUrl?: URLAdress | string
  orgPath?: string
  project?: ProjectType
  autoTest?: AutoTestConfig
  onesName?: string
  operator?: string
  prResult?: PrResultType
  pillowUrl?: URLAdress
  mainBranch?: string
  buildConfig?: BuildConfig
  fastMeasure?: FastMeasureType
  featureBranch?: string
  releaseBranch?: string
  talosCallback?: TalosCallback
  mrnBuildCustomEnv?: Record<string, string>
  mrnBuildCustomPlugin?: Record<string, Record<string, any>>
  nodeRunTimes?: string[]
  npmVersionInfo?: NpmVersionInfo
  npmVersionInfoList?: NpmVersionInfo[]
  MDO_PUBLISH_DATA?: MdoPublishData[]
  featureBranchCreateTime?: number
  [key: string]: any
}
