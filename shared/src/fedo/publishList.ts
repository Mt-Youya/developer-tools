import type { FedoGroup, Workflow } from "./list"
import type { FedoVariable, ProjectType } from "./variable"

// 工作流及其变量配置
export interface WorkflowWithVariable extends Workflow {
  variable?: {
    id?: number
    workflowId?: number
    variables?: FedoVariable
  }
}

// 发布任务
interface PublishTask {
  id?: number | string
  type?: string | number
  title?: string
  status?: string
  [key: string]: any
}

// 模板
interface Template {
  id?: number | string
  name?: string
  type?: string
  content?: string
  [key: string]: any
}

// 开发任务
export interface DevTask extends Omit<FedoGroup, "workflow" | "project" | "children" | "deploy"> {
  workflow?: WorkflowWithVariable
  project?: ProjectType
  children?: any[]
  deploy?: any[]
  [key: string]: any
}

// 任务调度
interface Schedule {
  id?: number | string
  type?: string
  cron?: string
  enabled?: boolean
  [key: string]: any
}

// 变量配置
interface VariableConfig {
  [key: string]: any
}

// 发布列表类型
export interface PublishList extends Omit<FedoGroup, "children" | "deploy" | "publish" | "workflow" | "project"> {
  projectList?: ProjectType[]
  devTasks?: DevTask[]
  children?: any[]
  deploy?: any[]
  publish?: PublishTask | null
  workflow?: WorkflowWithVariable
  project?: ProjectType
  template?: Template
  schedule?: Schedule
  variableConfig?: VariableConfig
}
