import type { Owner, SSHGit, URLAdress } from "../interface/common"

export type JobNodeStatus = "succeed" | "skip" | "running" | "failed" | string
export type JobStatus = "finish" | "running" | "pending" | string

interface JobDetail {
  [nodeId: string]: JobNodeStatus
  currentNodeId: string | number
  currentStatus: JobStatus
}

interface JobInfo {
  currentJobIds: number[]
  currentStatus: JobStatus
  [jobId: string]: JobDetail | number[] | JobStatus | string
}

interface Progress {
  [stageId: string]: JobInfo | string | number | JobStatus | any
  currentStageId: string | number
  currentStatus: JobStatus
}

export interface Workflow {
  id: number
  templateId: number
  taskId: number
  projectId: number
  project_id_list: string
  variableId: string
  parentWorkflowId: any
  isChildWorkflow: any
  status: "finish" | "progress" | "fail"
  progress: Progress
  nextWorkflowId?: string | number | null
  triggerTemplateNode?: number
  terminated?: boolean
  deleted?: boolean
  created?: string
  updated?: string
}

interface OrgInfo {
  name: string
  mis: string
  orgId: string
  orgName: string
  displayName: string
}

interface Project {
  id: string
  group_id: string
  name: string
  description: string
  repo_url: SSHGit
  import_platform: number
  tech_stack: string
  status: number
  import_id: string
  parent_id: string
  project_owners: Owner[]
  owner: string
  created_at: string
  updated_at: string
  fedo_type: string
  mis_id: string
  isMonorepo: boolean
  isSubApp: boolean
  orgInfo: OrgInfo
}

export interface FedoGroup {
  id: string
  type: number
  name: string
  guid: string
  biz: number
  sprint_id: string
  flow_id: string
  workflow_template_id: string
  start_time: number
  end_time: number
  designate_user: string
  qa: string
  pm: string
  ui: string
  teamwork_developer: any[]
  approver: string
  remarks: string
  tags: string
  project_id: string
  project_id_list: string
  test_project_id_list: string
  mrn_low_version: number
  ones_issue_id: string
  ones_requirement_id: string
  ones_url: URLAdress | string
  follow_app: string
  follow_mp: string
  follow_app_area: any
  create_time: string
  update_time: string
  finish: true
  parent_task: string
  op: string
  group_id: string
  creator: string
  workflow: Workflow
  children: any[]
  deploy: any[]
  publish: any
  project: Project
}
