import { BaseMessage } from '@langchain/core/messages'
import { z } from 'zod'

// Types mis à jour pour LangChain v1.0 et LangGraph v0.4
export interface WorkflowStateV1 {
  // État de base
  jobId: string | null
  status: 'pending' | 'running' | 'completed' | 'failed' | 'interrupted' | 'waiting_for_human'
  currentStep: string | null
  
  // Résultats et erreurs
  results: Record<string, AgentResult>
  errors: Record<string, string>
  metadata: Record<string, any>
  
  // Nouvelles fonctionnalités LangGraph v0.4
  interruptPoints: string[]
  humanApproval: boolean
  retryCount: number
  
  // Historique des messages
  chatHistory: BaseMessage[]
  
  // Données de workflow
  input: string
  briefs?: BriefData[]
  selectedBrief?: BriefData
  prompts?: PromptData[]
  assets?: AssetData[]
  finalOutput?: OutputData
}

export interface AgentResult {
  agentId: string
  status: 'success' | 'error' | 'pending' | 'interrupted'
  data?: any
  error?: string
  metadata?: Record<string, any>
  requiresHumanApproval?: boolean
  confidence?: number
  executionTime?: number
}

export interface BriefData {
  id: string
  title: string
  objective: string
  audience: string
  keyMessage: string
  callToAction: string
  formats: string[]
  tone: string
  brandGuidelines?: string
  score?: number
  reasoning?: string
  createdAt: Date
}

export interface PromptData {
  id: string
  type: 'image' | 'video' | 'audio' | 'text'
  content: string
  model: string
  parameters: Record<string, any>
  generatedAt: Date
  quality?: number
}

export interface AssetData {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnailUrl?: string
  metadata: {
    width?: number
    height?: number
    duration?: number
    size: number
    format: string
    quality: number
    watermark?: boolean
    provenance?: string
  }
  generatedAt: Date
  agentId: string
  promptId: string
}

export interface OutputData {
  id: string
  type: 'ad' | 'campaign' | 'asset'
  title: string
  description: string
  assets: AssetData[]
  metadata: {
    platform: string
    format: string
    duration?: number
    dimensions?: string
    fileSize: number
    quality: number
    compliance: boolean
    approvalStatus: 'pending' | 'approved' | 'rejected'
  }
  createdAt: Date
  updatedAt: Date
}

// Schémas de validation avec Zod
export const WorkflowStateSchema = z.object({
  jobId: z.string().nullable(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'interrupted', 'waiting_for_human']),
  currentStep: z.string().nullable(),
  results: z.record(z.any()),
  errors: z.record(z.string()),
  metadata: z.record(z.any()),
  interruptPoints: z.array(z.string()),
  humanApproval: z.boolean(),
  retryCount: z.number(),
  chatHistory: z.array(z.any()),
  input: z.string(),
  briefs: z.array(z.any()).optional(),
  selectedBrief: z.any().optional(),
  prompts: z.array(z.any()).optional(),
  assets: z.array(z.any()).optional(),
  finalOutput: z.any().optional(),
})

export const AgentResultSchema = z.object({
  agentId: z.string(),
  status: z.enum(['success', 'error', 'pending', 'interrupted']),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  requiresHumanApproval: z.boolean().optional(),
  confidence: z.number().optional(),
  executionTime: z.number().optional(),
})

export const BriefDataSchema = z.object({
  id: z.string(),
  title: z.string(),
  objective: z.string(),
  audience: z.string(),
  keyMessage: z.string(),
  callToAction: z.string(),
  formats: z.array(z.string()),
  tone: z.string(),
  brandGuidelines: z.string().optional(),
  score: z.number().optional(),
  reasoning: z.string().optional(),
  createdAt: z.date(),
})

export const PromptDataSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video', 'audio', 'text']),
  content: z.string(),
  model: z.string(),
  parameters: z.record(z.any()),
  generatedAt: z.date(),
  quality: z.number().optional(),
})

export const AssetDataSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video', 'audio']),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  metadata: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    duration: z.number().optional(),
    size: z.number(),
    format: z.string(),
    quality: z.number(),
    watermark: z.boolean().optional(),
    provenance: z.string().optional(),
  }),
  generatedAt: z.date(),
  agentId: z.string(),
  promptId: z.string(),
})

export const OutputDataSchema = z.object({
  id: z.string(),
  type: z.enum(['ad', 'campaign', 'asset']),
  title: z.string(),
  description: z.string(),
  assets: z.array(AssetDataSchema),
  metadata: z.object({
    platform: z.string(),
    format: z.string(),
    duration: z.number().optional(),
    dimensions: z.string().optional(),
    fileSize: z.number(),
    quality: z.number(),
    compliance: z.boolean(),
    approvalStatus: z.enum(['pending', 'approved', 'rejected']),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Types d'événements pour les interruptions
export interface InterruptEvent {
  type: 'human_approval' | 'error' | 'retry' | 'timeout'
  step: string
  data: any
  timestamp: Date
  resolved: boolean
}

// Types de configuration pour les agents
export interface AgentConfig {
  id: string
  name: string
  description: string
  type: 'generator' | 'evaluator' | 'transformer' | 'validator'
  model: string
  parameters: Record<string, any>
  timeout: number
  retries: number
  requiresHumanApproval: boolean
  maxExecutionTime: number
}

// Types pour la gestion des erreurs
export interface WorkflowError {
  code: string
  message: string
  step: string
  timestamp: Date
  recoverable: boolean
  retryCount: number
  maxRetries: number
}

// Types pour les métriques et monitoring
export interface WorkflowMetrics {
  jobId: string
  startTime: Date
  endTime?: Date
  duration?: number
  steps: Array<{
    step: string
    startTime: Date
    endTime?: Date
    duration?: number
    status: string
    error?: string
  }>
  totalTokens: number
  totalCost: number
  quality: number
  humanApprovals: number
  retries: number
}

// Types pour les notifications
export interface WorkflowNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  step: string
  timestamp: Date
  read: boolean
  actionRequired: boolean
  actionUrl?: string
}

// Types pour les webhooks
export interface WebhookEvent {
  id: string
  type: 'workflow_started' | 'workflow_completed' | 'workflow_failed' | 'step_completed' | 'human_approval_required'
  jobId: string
  step?: string
  data: any
  timestamp: Date
  signature: string
}

// Types pour les intégrations
export interface IntegrationConfig {
  id: string
  name: string
  type: 'slack' | 'notion' | 'google' | 'microsoft' | 'custom'
  enabled: boolean
  credentials: Record<string, any>
  settings: Record<string, any>
  webhooks: string[]
}

// Types pour les templates
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  steps: Array<{
    id: string
    type: string
    config: Record<string, any>
  }>
  variables: Array<{
    name: string
    type: string
    required: boolean
    defaultValue?: any
  }>
  createdAt: Date
  updatedAt: Date
  version: string
}
