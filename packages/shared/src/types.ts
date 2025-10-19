import { z } from 'zod'

// Types de base
export const StatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'paused', 'cancelled'])
export type Status = z.infer<typeof StatusSchema>

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export type Priority = z.infer<typeof PrioritySchema>

export const MediaTypeSchema = z.enum(['image', 'video', 'audio', 'voice'])
export type MediaType = z.infer<typeof MediaTypeSchema>

export const AgentTypeSchema = z.enum(['generator', 'evaluator', 'transformer', 'validator'])
export type AgentType = z.infer<typeof AgentTypeSchema>

// Types d'API
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Types de workflow
export interface WorkflowStep {
  id: string
  name: string
  status: Status
  completed: boolean
  active: boolean
  duration?: number
  error?: string
  metadata?: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  description?: string
  status: Status
  progress: number
  steps: WorkflowStep[]
  createdAt: string
  updatedAt: string
  createdBy: string
  tags: string[]
  metadata: Record<string, any>
}

// Types d'agents
export interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  status: Status
  tasksCompleted: number
  averageTime: number
  errors: number
  uptime: number
  lastActivity: string
  metadata: Record<string, any>
}

// Types de médias
export interface MediaItem {
  id: string
  name: string
  description: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  status: Status
  fileSize: string
  quality: number
  dimensions?: string
  duration?: string
  createdAt: string
  updatedAt: string
  tags: string[]
  metadata: Record<string, any>
}

// Types d'analytics
export interface AnalyticsMetrics {
  workflowsExecuted: number
  averageTime: string
  successRate: number
  totalCost: number
}

export interface AgentPerformance {
  name: string
  time: number
  trend: 'up' | 'down'
  change: number
}

// Types d'évaluation créative
export interface CreativeEvaluation {
  overallScore: number
  readability?: {
    score: number
    contrastRatio: number
    fontSize?: number
  }
  brandCompliance?: {
    score: number
    logoDetected: boolean
  }
  platformCompliance?: {
    score: number
    dimensions?: string
  }
  authenticity?: {
    score: number
    synthID: boolean
    c2pa: boolean
  }
  requiresHumanApproval: boolean
  blockingIssues: string[]
}

// Types de routage de vendeurs
export interface VendorRouting {
  selectedVendor: string
  fallbackVendors: string[]
  estimatedCost: number
  estimatedLatency: number
  confidence: number
  reasoning: string
}

// Types de contraintes de marque
export interface BrandConstraints {
  logoConstraints?: string
  colorConstraints?: string
  toneConstraints?: string
  claimConstraints?: string
  dos?: string[]
  donts?: string[]
}
