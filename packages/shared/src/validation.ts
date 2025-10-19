import { z } from 'zod'

// Schémas de validation de base
export const IdSchema = z.string().uuid()
export const EmailSchema = z.string().email()
export const UrlSchema = z.string().url()
export const DateSchema = z.string().datetime()
export const StatusValidationSchema = z.enum(['pending', 'running', 'completed', 'failed', 'paused', 'cancelled'])
export const PriorityValidationSchema = z.enum(['low', 'medium', 'high', 'urgent'])
export const MediaTypeValidationSchema = z.enum(['image', 'video', 'audio', 'voice'])
export const AgentTypeValidationSchema = z.enum(['generator', 'evaluator', 'transformer', 'validator'])

// Schémas de validation pour les workflows
export const WorkflowStepSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  status: StatusValidationSchema,
  completed: z.boolean(),
  active: z.boolean(),
  duration: z.number().positive().optional(),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: StatusValidationSchema,
  progress: z.number().min(0).max(100),
  steps: z.array(WorkflowStepSchema),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  createdBy: z.string().uuid(),
  tags: z.array(z.string().max(50)).max(20),
  metadata: z.record(z.any()).optional()
})

export const CreateWorkflowSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  input: z.string().min(1),
  tags: z.array(z.string().max(50)).max(20).optional(),
  metadata: z.record(z.any()).optional()
})

export const UpdateWorkflowSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  status: StatusValidationSchema.optional(),
  metadata: z.record(z.any()).optional()
})

// Schémas de validation pour les agents
export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  type: AgentTypeValidationSchema,
  status: StatusValidationSchema,
  tasksCompleted: z.number().int().min(0),
  averageTime: z.number().int().min(0),
  errors: z.number().int().min(0),
  uptime: z.number().min(0).max(100),
  lastActivity: z.string(),
  metadata: z.record(z.any()).optional()
})

export const UpdateAgentStatusSchema = z.object({
  status: StatusValidationSchema
})

// Schémas de validation pour les médias
export const MediaItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  type: MediaTypeValidationSchema,
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  status: StatusValidationSchema,
  fileSize: z.string(),
  quality: z.number().min(0).max(10),
  dimensions: z.string().optional(),
  duration: z.string().optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  tags: z.array(z.string().max(50)).max(20),
  metadata: z.record(z.any()).optional()
})

export const UploadMediaSchema = z.object({
  file: z.instanceof(File),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  metadata: z.record(z.any()).optional()
})

// Schémas de validation pour les jobs
export const JobSchema = z.object({
  id: z.string().uuid(),
  workflowId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  status: StatusValidationSchema,
  priority: PriorityValidationSchema,
  progress: z.number().min(0).max(100),
  createdAt: DateSchema,
  updatedAt: DateSchema,
  metadata: z.record(z.any()).optional()
})

export const CreateJobSchema = z.object({
  workflowId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  priority: PriorityValidationSchema.optional(),
  metadata: z.record(z.any()).optional()
})

export const UpdateJobSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  status: StatusValidationSchema.optional(),
  priority: PriorityValidationSchema.optional(),
  metadata: z.record(z.any()).optional()
})

// Schémas de validation pour les analytics
export const AnalyticsMetricsSchema = z.object({
  workflowsExecuted: z.number().int().min(0),
  averageTime: z.string(),
  successRate: z.number().min(0).max(100),
  totalCost: z.number().min(0)
})

export const AgentPerformanceSchema = z.object({
  name: z.string().min(1),
  time: z.number().int().min(0),
  trend: z.enum(['up', 'down']),
  change: z.number().min(-100).max(100)
})

// Schémas de validation pour l'évaluation créative
export const CreativeEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(10),
  readability: z.object({
    score: z.number().min(0).max(10),
    contrastRatio: z.number().min(0),
    fontSize: z.number().positive().optional()
  }).optional(),
  brandCompliance: z.object({
    score: z.number().min(0).max(10),
    logoDetected: z.boolean()
  }).optional(),
  platformCompliance: z.object({
    score: z.number().min(0).max(10),
    dimensions: z.string().optional()
  }).optional(),
  authenticity: z.object({
    score: z.number().min(0).max(10),
    synthID: z.boolean(),
    c2pa: z.boolean()
  }).optional(),
  requiresHumanApproval: z.boolean(),
  blockingIssues: z.array(z.string())
})

// Schémas de validation pour le routage de vendeurs
export const VendorRoutingSchema = z.object({
  selectedVendor: z.string().min(1),
  fallbackVendors: z.array(z.string()),
  estimatedCost: z.number().min(0),
  estimatedLatency: z.number().min(0),
  confidence: z.number().min(0).max(1),
  reasoning: z.string().min(1)
})

export const VendorRoutingRequestSchema = z.object({
  type: MediaTypeValidationSchema,
  task: z.string().min(1),
  requirements: z.record(z.any()).optional(),
  constraints: z.object({
    maxCost: z.number().positive().optional(),
    maxLatency: z.number().positive().optional(),
    minQuality: z.enum(['low', 'medium', 'high', 'sota']).optional()
  }).optional()
})

// Schémas de validation pour les contraintes de marque
export const BrandConstraintsSchema = z.object({
  logoConstraints: z.string().optional(),
  colorConstraints: z.string().optional(),
  toneConstraints: z.string().optional(),
  claimConstraints: z.string().optional(),
  dos: z.array(z.string()).optional(),
  donts: z.array(z.string()).optional()
})

export const BrandConstraintsRequestSchema = z.object({
  brandId: z.string().uuid(),
  context: z.object({
    product: z.string().optional(),
    objective: z.string().optional(),
    audience: z.string().optional(),
    platform: z.string().optional()
  }).optional()
})

// Schémas de validation pour les réponses API
export const ApiResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional()
})

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
  hasMore: z.boolean()
})

// Schémas de validation pour les paramètres de requête
export const PaginationSchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().min(0)).optional()
})

export const FilterSchema = z.object({
  status: StatusValidationSchema.optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  tags: z.string().optional()
})

// Schémas de validation pour l'authentification
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(128)
})

export const RegisterSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50)
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128)
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les nouveaux mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

// Schémas de validation pour les paramètres de configuration
export const ConfigSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  language: z.enum(['fr', 'en', 'es', 'de']).optional(),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean()
  }).optional()
})

// Utilitaires de validation
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}

export function safeValidateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

export function getValidationErrors(error: z.ZodError): Record<string, string[]> {
  return error.errors.reduce((acc, err) => {
    const path = err.path.join('.')
    if (!acc[path]) {
      acc[path] = []
    }
    acc[path].push(err.message)
    return acc
  }, {} as Record<string, string[]>)
}
