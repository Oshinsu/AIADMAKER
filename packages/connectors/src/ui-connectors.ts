/**
 * UI CONNECTORS SOTA OCTOBRE 2025
 * Connecteurs UI pour les APIs avec gestion d'état et retry automatique
 */

import { z } from 'zod'
import { logger } from './lib/logger'

const APIConnectorSchema = z.object({
  name: z.string(),
  baseUrl: z.string(),
  authentication: z.object({
    type: z.enum(['api_key', 'oauth', 'bearer', 'basic']),
    apiKey: z.string().optional(),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
  endpoints: z.array(z.object({
    name: z.string(),
    path: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    headers: z.record(z.string()).optional(),
    timeout: z.number().default(30000),
  })),
  rateLimits: z.object({
    requestsPerMinute: z.number(),
    requestsPerHour: z.number(),
    burstLimit: z.number(),
  }),
  retryPolicy: z.object({
    maxRetries: z.number(),
    backoffStrategy: z.enum(['linear', 'exponential', 'fixed']),
    retryDelay: z.number(),
    maxDelay: z.number(),
  }),
  healthCheck: z.object({
    endpoint: z.string(),
    interval: z.number(),
    timeout: z.number(),
  }),
})

const ConnectionStateSchema = z.object({
  connected: z.boolean(),
  lastConnected: z.string().optional(),
  lastError: z.string().optional(),
  retryCount: z.number(),
  healthScore: z.number(),
  latency: z.number(),
  uptime: z.number(),
})

export class SOTAAPIConnector {
  private connector: z.infer<typeof APIConnectorSchema>
  private state: z.infer<typeof ConnectionStateSchema>
  private requestQueue: Array<{
    id: string
    endpoint: string
    data: any
    resolve: (value: any) => void
    reject: (error: any) => void
    retryCount: number
    timestamp: number
  }>
  private isProcessing: boolean
  private healthCheckInterval: NodeJS.Timeout | null

  constructor(connector: z.infer<typeof APIConnectorSchema>) {
    this.connector = connector
    this.state = {
      connected: false,
      retryCount: 0,
      healthScore: 0,
      latency: 0,
      uptime: 0,
    }
    this.requestQueue = []
    this.isProcessing = false
    this.healthCheckInterval = null

    this.startHealthCheck()
    this.startRequestProcessor()
  }

  private startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck()
    }, this.connector.healthCheck.interval)
  }

  private startRequestProcessor() {
    this.processRequestQueue()
  }

  private async processRequestQueue() {
    while (true) {
      if (this.requestQueue.length > 0 && this.state.connected) {
        const request = this.requestQueue.shift()
        if (request) {
          await this.executeRequest(request)
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  async connect(): Promise<void> {
    try {
      logger.info('Connecting to API', { name: this.connector.name, baseUrl: this.connector.baseUrl })

      // Test de connexion
      const healthCheck = await this.performHealthCheck()
      if (!healthCheck) {
        throw new Error('Health check failed')
      }

      this.state.connected = true
      this.state.lastConnected = new Date().toISOString()
      this.state.retryCount = 0
      this.state.uptime = Date.now()

      logger.info('API connected successfully', { name: this.connector.name })

    } catch (error) {
      this.state.connected = false
      this.state.lastError = error.message
      this.state.retryCount++

      logger.error('API connection failed:', error)
      throw new Error(`Échec de la connexion à l'API: ${error.message}`)
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.state.connected = false
      
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval)
        this.healthCheckInterval = null
      }

      logger.info('API disconnected', { name: this.connector.name })

    } catch (error) {
      logger.error('API disconnection failed:', error)
      throw new Error(`Échec de la déconnexion de l'API: ${error.message}`)
    }
  }

  async call(endpoint: string, data: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      this.requestQueue.push({
        id: requestId,
        endpoint,
        data,
        resolve,
        reject,
        retryCount: 0,
        timestamp: Date.now()
      })

      logger.info('Request queued', { requestId, endpoint, connector: this.connector.name })
    })
  }

  private async executeRequest(request: {
    id: string
    endpoint: string
    data: any
    resolve: (value: any) => void
    reject: (error: any) => void
    retryCount: number
    timestamp: number
  }): Promise<void> {
    try {
      const endpointConfig = this.connector.endpoints.find(e => e.name === request.endpoint)
      if (!endpointConfig) {
        throw new Error(`Endpoint ${request.endpoint} not found`)
      }

      const startTime = Date.now()
      
      // Construction de l'URL
      const url = `${this.connector.baseUrl}${endpointConfig.path}`
      
      // Construction des headers
      const headers = {
        'Content-Type': 'application/json',
        ...endpointConfig.headers,
        ...this.getAuthHeaders()
      }

      // Construction de la requête
      const requestConfig: RequestInit = {
        method: endpointConfig.method,
        headers,
        timeout: endpointConfig.timeout,
      }

      if (['POST', 'PUT', 'PATCH'].includes(endpointConfig.method)) {
        requestConfig.body = JSON.stringify(request.data)
      }

      // Exécution de la requête
      const response = await fetch(url, requestConfig)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      const latency = Date.now() - startTime

      // Mise à jour des métriques
      this.state.latency = latency
      this.state.healthScore = Math.min(100, this.state.healthScore + 5)

      request.resolve(result)

      logger.info('Request completed successfully', {
        requestId: request.id,
        endpoint: request.endpoint,
        latency,
        connector: this.connector.name
      })

    } catch (error) {
      // Gestion des erreurs avec retry
      if (request.retryCount < this.connector.retryPolicy.maxRetries) {
        request.retryCount++
        
        const delay = this.calculateRetryDelay(request.retryCount)
        setTimeout(() => {
          this.requestQueue.push(request)
        }, delay)

        logger.info('Request queued for retry', {
          requestId: request.id,
          endpoint: request.endpoint,
          retryCount: request.retryCount,
          delay
        })
      } else {
        this.state.healthScore = Math.max(0, this.state.healthScore - 10)
        request.reject(error)

        logger.error('Request failed permanently', {
          requestId: request.id,
          endpoint: request.endpoint,
          error: error.message
        })
      }
    }
  }

  private async performHealthCheck(): Promise<boolean> {
    try {
      const startTime = Date.now()
      
      const response = await fetch(`${this.connector.baseUrl}${this.connector.healthCheck.endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        timeout: this.connector.healthCheck.timeout
      })

      const latency = Date.now() - startTime
      this.state.latency = latency

      if (response.ok) {
        this.state.healthScore = Math.min(100, this.state.healthScore + 1)
        return true
      } else {
        this.state.healthScore = Math.max(0, this.state.healthScore - 5)
        return false
      }

    } catch (error) {
      this.state.healthScore = Math.max(0, this.state.healthScore - 10)
      this.state.lastError = error.message
      return false
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    switch (this.connector.authentication.type) {
      case 'api_key':
        if (this.connector.authentication.apiKey) {
          headers['X-API-Key'] = this.connector.authentication.apiKey
        }
        break
      case 'bearer':
        if (this.connector.authentication.token) {
          headers['Authorization'] = `Bearer ${this.connector.authentication.token}`
        }
        break
      case 'basic':
        if (this.connector.authentication.username && this.connector.authentication.password) {
          const credentials = Buffer.from(
            `${this.connector.authentication.username}:${this.connector.authentication.password}`
          ).toString('base64')
          headers['Authorization'] = `Basic ${credentials}`
        }
        break
    }

    return headers
  }

  private calculateRetryDelay(retryCount: number): number {
    const baseDelay = this.connector.retryPolicy.retryDelay
    const maxDelay = this.connector.retryPolicy.maxDelay

    let delay: number

    switch (this.connector.retryPolicy.backoffStrategy) {
      case 'linear':
        delay = baseDelay * retryCount
        break
      case 'exponential':
        delay = baseDelay * Math.pow(2, retryCount - 1)
        break
      case 'fixed':
        delay = baseDelay
        break
      default:
        delay = baseDelay
    }

    return Math.min(delay, maxDelay)
  }

  async getConnectionState(): Promise<z.infer<typeof ConnectionStateSchema>> {
    return this.state
  }

  async getPerformanceMetrics(): Promise<{
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageLatency: number
    successRate: number
    uptime: number
  }> {
    const totalRequests = this.requestQueue.length
    const successfulRequests = this.state.healthScore
    const failedRequests = totalRequests - successfulRequests
    const successRate = (successfulRequests / totalRequests) * 100
    const uptime = this.state.connected ? Date.now() - this.state.uptime : 0

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency: this.state.latency,
      successRate,
      uptime
    }
  }

  async updateAuth(auth: Partial<z.infer<typeof APIConnectorSchema>['authentication']>): Promise<void> {
    this.connector.authentication = { ...this.connector.authentication, ...auth }
    
    // Reconnecter avec les nouvelles credentials
    await this.disconnect()
    await this.connect()
  }

  async updateRateLimits(rateLimits: Partial<z.infer<typeof APIConnectorSchema>['rateLimits']>): Promise<void> {
    this.connector.rateLimits = { ...this.connector.rateLimits, ...rateLimits }
  }

  async updateRetryPolicy(retryPolicy: Partial<z.infer<typeof APIConnectorSchema>['retryPolicy']>): Promise<void> {
    this.connector.retryPolicy = { ...this.connector.retryPolicy, ...retryPolicy }
  }
}

export class ConnectorManager {
  private connectors: Map<string, SOTAAPIConnector>

  constructor() {
    this.connectors = new Map()
  }

  async registerConnector(connector: z.infer<typeof APIConnectorSchema>): Promise<SOTAAPIConnector> {
    const apiConnector = new SOTAAPIConnector(connector)
    await apiConnector.connect()
    
    this.connectors.set(connector.name, apiConnector)
    
    logger.info('Connector registered', { name: connector.name })
    
    return apiConnector
  }

  async unregisterConnector(name: string): Promise<void> {
    const connector = this.connectors.get(name)
    if (connector) {
      await connector.disconnect()
      this.connectors.delete(name)
      
      logger.info('Connector unregistered', { name })
    }
  }

  async getConnector(name: string): Promise<SOTAAPIConnector | null> {
    return this.connectors.get(name) || null
  }

  async getAllConnectors(): Promise<SOTAAPIConnector[]> {
    return Array.from(this.connectors.values())
  }

  async getConnectorStatus(name: string): Promise<z.infer<typeof ConnectionStateSchema> | null> {
    const connector = this.connectors.get(name)
    if (!connector) return null
    
    return await connector.getConnectionState()
  }

  async getAllConnectorStatuses(): Promise<Record<string, z.infer<typeof ConnectionStateSchema>>> {
    const statuses: Record<string, z.infer<typeof ConnectionStateSchema>> = {}
    
    for (const [name, connector] of this.connectors) {
      statuses[name] = await connector.getConnectionState()
    }
    
    return statuses
  }

  async getGlobalMetrics(): Promise<{
    totalConnectors: number
    connectedConnectors: number
    averageHealthScore: number
    totalRequests: number
    averageLatency: number
  }> {
    const connectors = Array.from(this.connectors.values())
    const totalConnectors = connectors.length
    const connectedConnectors = connectors.filter(c => c.getConnectionState().then(s => s.connected)).length
    
    let totalHealthScore = 0
    let totalRequests = 0
    let totalLatency = 0
    
    for (const connector of connectors) {
      const state = await connector.getConnectionState()
      const metrics = await connector.getPerformanceMetrics()
      
      totalHealthScore += state.healthScore
      totalRequests += metrics.totalRequests
      totalLatency += metrics.averageLatency
    }
    
    return {
      totalConnectors,
      connectedConnectors,
      averageHealthScore: totalHealthScore / totalConnectors,
      totalRequests,
      averageLatency: totalLatency / totalConnectors
    }
  }
}
