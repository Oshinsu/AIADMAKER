import axios from 'axios'

// Configuration de l'API client
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter l'authentification
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types pour les API
export interface Workflow {
  id: string
  name: string
  description?: string
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed'
  progress: number
  createdAt: string
  updatedAt: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface Job {
  id: string
  workflowId: string
  name: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  progress: number
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  name: string
  description: string
  type: 'generator' | 'evaluator' | 'transformer' | 'validator'
  status: 'active' | 'idle' | 'error' | 'maintenance'
  tasksCompleted: number
  averageTime: number
  errors: number
  uptime: number
  lastActivity: string
}

export interface MediaItem {
  id: string
  name: string
  description: string
  type: 'image' | 'video' | 'audio' | 'voice'
  url: string
  thumbnailUrl?: string
  status: 'processing' | 'ready' | 'error' | 'draft'
  fileSize: string
  quality: number
  dimensions?: string
  duration?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

// API Workflows
export const workflowApi = {
  // Créer un workflow
  create: async (data: {
    name: string
    description?: string
    input: string
    tags?: string[]
    metadata?: Record<string, any>
  }): Promise<Workflow> => {
    const response = await api.post('/api/workflows', data)
    return response.data
  },

  // Obtenir tous les workflows
  getAll: async (): Promise<{ workflows: Workflow[] }> => {
    const response = await api.get('/api/workflows')
    return response.data
  },

  // Obtenir un workflow spécifique
  getById: async (id: string): Promise<Workflow> => {
    const response = await api.get(`/api/workflows/${id}`)
    return response.data
  },

  // Mettre à jour un workflow
  update: async (id: string, data: Partial<Workflow>): Promise<Workflow> => {
    const response = await api.put(`/api/workflows/${id}`, data)
    return response.data
  },

  // Supprimer un workflow
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/workflows/${id}`)
  },

  // Démarrer un workflow
  start: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.post(`/api/workflows/${id}/start`)
    return response.data
  },

  // Pause un workflow
  pause: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.post(`/api/workflows/${id}/pause`)
    return response.data
  },

  // Arrêter un workflow
  stop: async (id: string): Promise<{ status: string; message: string }> => {
    const response = await api.post(`/api/workflows/${id}/stop`)
    return response.data
  },
}

// API Jobs
export const jobApi = {
  // Créer un job
  create: async (data: {
    workflowId: string
    name: string
    description?: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    metadata?: Record<string, any>
  }): Promise<Job> => {
    const response = await api.post('/api/jobs', data)
    return response.data
  },

  // Obtenir tous les jobs
  getAll: async (params?: {
    status?: string
    workflowId?: string
    limit?: number
    offset?: number
  }): Promise<{ jobs: Job[]; total: number; limit: number; offset: number }> => {
    const response = await api.get('/api/jobs', { params })
    return response.data
  },

  // Obtenir un job spécifique
  getById: async (id: string): Promise<Job> => {
    const response = await api.get(`/api/jobs/${id}`)
    return response.data
  },

  // Mettre à jour un job
  update: async (id: string, data: Partial<Job>): Promise<Job> => {
    const response = await api.put(`/api/jobs/${id}`, data)
    return response.data
  },

  // Supprimer un job
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/jobs/${id}`)
  },

  // Obtenir les logs d'un job
  getLogs: async (id: string): Promise<{ logs: Array<{
    timestamp: string
    level: string
    message: string
    metadata?: Record<string, any>
  }> }> => {
    const response = await api.get(`/api/jobs/${id}/logs`)
    return response.data
  },
}

// API Agents
export const agentApi = {
  // Obtenir tous les agents
  getAll: async (): Promise<{ agents: Agent[] }> => {
    const response = await api.get('/api/agents')
    return response.data
  },

  // Obtenir un agent spécifique
  getById: async (id: string): Promise<Agent> => {
    const response = await api.get(`/api/agents/${id}`)
    return response.data
  },

  // Mettre à jour le statut d'un agent
  updateStatus: async (id: string, status: Agent['status']): Promise<Agent> => {
    const response = await api.put(`/api/agents/${id}/status`, { status })
    return response.data
  },

  // Obtenir les métriques d'un agent
  getMetrics: async (id: string): Promise<{
    tasksCompleted: number
    averageTime: number
    errors: number
    uptime: number
  }> => {
    const response = await api.get(`/api/agents/${id}/metrics`)
    return response.data
  },
}

// API Media
export const mediaApi = {
  // Obtenir tous les médias
  getAll: async (): Promise<{ media: MediaItem[] }> => {
    const response = await api.get('/api/media')
    return response.data
  },

  // Obtenir un média spécifique
  getById: async (id: string): Promise<MediaItem> => {
    const response = await api.get(`/api/media/${id}`)
    return response.data
  },

  // Upload un fichier
  upload: async (file: File): Promise<MediaItem> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Mettre à jour un média
  update: async (id: string, data: Partial<MediaItem>): Promise<MediaItem> => {
    const response = await api.put(`/api/media/${id}`, data)
    return response.data
  },

  // Supprimer un média
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/media/${id}`)
  },
}

// API Analytics
export const analyticsApi = {
  // Obtenir les métriques générales
  getMetrics: async (): Promise<{
    workflowsExecuted: number
    averageTime: string
    successRate: number
    totalCost: number
  }> => {
    const response = await api.get('/api/analytics/metrics')
    return response.data
  },

  // Obtenir les performances des agents
  getAgentPerformance: async (): Promise<Array<{
    name: string
    time: number
    trend: 'up' | 'down'
    change: number
  }>> => {
    const response = await api.get('/api/analytics/agents')
    return response.data
  },

  // Obtenir l'analyse des coûts
  getCostAnalysis: async (): Promise<Array<{
    service: string
    amount: number
    percentage: number
    color: string
  }>> => {
    const response = await api.get('/api/analytics/costs')
    return response.data
  },

  // Obtenir l'activité récente
  getRecentActivity: async (): Promise<Array<{
    title: string
    description: string
    timestamp: string
    icon: 'success' | 'error' | 'info'
    iconBg: string
  }>> => {
    const response = await api.get('/api/analytics/activity')
    return response.data
  },
}

// API Creative Evaluation
export const creativeEvaluationApi = {
  // Évaluer un asset
  evaluate: async (data: {
    url: string
    type: 'image' | 'video'
    platform?: string
    metadata?: Record<string, any>
  }): Promise<{
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
  }> => {
    const response = await api.post('/api/creative-evaluation', data)
    return response.data
  },
}

// API Vendor Router
export const vendorRouterApi = {
  // Router une requête
  route: async (data: {
    type: 'image' | 'video' | 'audio'
    task: string
    requirements?: Record<string, any>
    constraints?: {
      maxCost?: number
      maxLatency?: number
      minQuality?: 'low' | 'medium' | 'high' | 'sota'
    }
  }): Promise<{
    selectedVendor: string
    fallbackVendors: string[]
    estimatedCost: number
    estimatedLatency: number
    confidence: number
    reasoning: string
  }> => {
    const response = await api.post('/api/vendor-router', data)
    return response.data
  },
}

// API Brand Brain
export const brandBrainApi = {
  // Générer des contraintes
  generateConstraints: async (data: {
    brandId: string
    context?: {
      product?: string
      objective?: string
      audience?: string
      platform?: string
    }
  }): Promise<{
    logoConstraints?: string
    colorConstraints?: string
    toneConstraints?: string
    claimConstraints?: string
    dos?: string[]
    donts?: string[]
  }> => {
    const response = await api.post('/api/brand-brain/generate-constraints', data)
    return response.data
  },

  // Obtenir les guidelines d'une marque
  getGuidelines: async (brandId: string): Promise<{
    brandId: string
    guidelines: Record<string, any>
  }> => {
    const response = await api.get(`/api/brand-brain/guidelines/${brandId}`)
    return response.data
  },
}

export default api
