export interface AgentConfig {
  id: string
  type: string
  name: string
  description: string
  inputs: string[]
  outputs: string[]
  config: Record<string, any>
}

export interface AgentResult {
  agentId: string
  status: 'success' | 'error' | 'pending'
  data?: any
  error?: string
  metadata?: Record<string, any>
}

export interface WorkflowState {
  jobId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  currentStep: string | null
  results: Record<string, AgentResult>
  errors: Record<string, string>
  metadata: Record<string, any>
}

export interface BriefData {
  title: string
  objective: string
  audience: string
  keyMessage: string
  callToAction: string
  constraints: string[]
  formats: string[]
  budget?: number
  timeline?: string
}

export interface ImageData {
  id: string
  url: string
  prompt: string
  model: string
  metadata: {
    width: number
    height: number
    format: string
    size: number
  }
}

export interface VideoData {
  id: string
  url: string
  prompt: string
  model: string
  duration: number
  metadata: {
    width: number
    height: number
    format: string
    size: number
    fps: number
  }
}

export interface AudioData {
  id: string
  url: string
  type: 'music' | 'voice'
  text?: string
  model: string
  duration: number
  metadata: {
    format: string
    size: number
    bitrate: number
  }
}

export interface JobData {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  priority: 'low' | 'normal' | 'high'
  inputs: Record<string, any>
  results: Record<string, any>
  logs: string[]
  error?: string
  createdAt: Date
  updatedAt: Date
}
