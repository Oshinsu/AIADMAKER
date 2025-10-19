/**
 * API CONNECTORS - SOTA OCTOBRE 2025
 * Connecteurs frontend pour toutes les APIs
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { z } from 'zod'

// Types pour les réponses API
const ApiTestResponseSchema = z.object({
  success: z.boolean(),
  apiId: z.string(),
  testType: z.string(),
  result: z.any(),
  duration: z.number(),
  timestamp: z.string(),
})

const ApiConfigResponseSchema = z.object({
  apiId: z.string(),
  config: z.any(),
  status: z.string(),
  lastTest: z.string().optional(),
})

const ApiStatsResponseSchema = z.object({
  totalApis: z.number(),
  activeApis: z.number(),
  totalRequests: z.number(),
  totalCost: z.number(),
  apis: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    requests: z.number(),
    cost: z.number(),
    lastUsed: z.string(),
  })),
})

const ApiTestAllResponseSchema = z.object({
  success: z.boolean(),
  results: z.array(z.object({
    apiId: z.string(),
    success: z.boolean(),
    duration: z.number(),
    error: z.string().optional(),
  })),
  totalDuration: z.number(),
})

export type ApiTestResponse = z.infer<typeof ApiTestResponseSchema>
export type ApiConfigResponse = z.infer<typeof ApiConfigResponseSchema>
export type ApiStatsResponse = z.infer<typeof ApiStatsResponseSchema>
export type ApiTestAllResponse = z.infer<typeof ApiTestAllResponseSchema>

export class ApiConnector {
  private client: AxiosInstance

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Intercepteur pour la gestion des erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  // Test d'une API spécifique
  async testApi(apiId: string, testType: 'connection' | 'generation' | 'full' = 'connection', parameters?: Record<string, any>): Promise<ApiTestResponse> {
    try {
      const response: AxiosResponse<ApiTestResponse> = await this.client.post('/api/apis/test', {
        apiId,
        testType,
        parameters,
      })

      return ApiTestResponseSchema.parse(response.data)
    } catch (error) {
      console.error(`Test API ${apiId} failed:`, error)
      throw new Error(`Test API ${apiId} failed: ${error.message}`)
    }
  }

  // Obtenir la configuration d'une API
  async getApiConfig(apiId: string): Promise<ApiConfigResponse> {
    try {
      const response: AxiosResponse<ApiConfigResponse> = await this.client.get(`/api/apis/config/${apiId}`)
      return ApiConfigResponseSchema.parse(response.data)
    } catch (error) {
      console.error(`Get config for ${apiId} failed:`, error)
      throw new Error(`Get config for ${apiId} failed: ${error.message}`)
    }
  }

  // Mettre à jour la configuration d'une API
  async updateApiConfig(apiId: string, config: {
    apiKey: string
    baseUrl?: string
    timeout?: number
    maxRetries?: number
  }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.put(`/api/apis/config/${apiId}`, config)
      return response.data
    } catch (error) {
      console.error(`Update config for ${apiId} failed:`, error)
      throw new Error(`Update config for ${apiId} failed: ${error.message}`)
    }
  }

  // Obtenir les statistiques de toutes les APIs
  async getApiStats(): Promise<ApiStatsResponse> {
    try {
      const response: AxiosResponse<ApiStatsResponse> = await this.client.get('/api/apis/stats')
      return ApiStatsResponseSchema.parse(response.data)
    } catch (error) {
      console.error('Get API stats failed:', error)
      throw new Error(`Get API stats failed: ${error.message}`)
    }
  }

  // Test global de toutes les APIs
  async testAllApis(): Promise<ApiTestAllResponse> {
    try {
      const response: AxiosResponse<ApiTestAllResponse> = await this.client.post('/api/apis/test-all')
      return ApiTestAllResponseSchema.parse(response.data)
    } catch (error) {
      console.error('Test all APIs failed:', error)
      throw new Error(`Test all APIs failed: ${error.message}`)
    }
  }

  // Méthodes spécialisées pour chaque API
  async testOpenAI(): Promise<ApiTestResponse> {
    return this.testApi('openai', 'generation', {
      model: 'gpt-4o-2025-10-01',
      maxTokens: 100,
    })
  }

  async testGemini(): Promise<ApiTestResponse> {
    return this.testApi('gemini', 'generation', {
      model: 'gemini-2.0-flash-exp',
      maxTokens: 100,
    })
  }

  async testSeedream(): Promise<ApiTestResponse> {
    return this.testApi('seedream', 'generation', {
      prompt: 'Test video generation',
      duration: 5,
      style: 'realistic',
    })
  }

  async testKling(): Promise<ApiTestResponse> {
    return this.testApi('kling', 'generation', {
      prompt: 'Test video generation',
      duration: 5,
      style: 'realistic',
    })
  }

  async testElevenLabs(): Promise<ApiTestResponse> {
    return this.testApi('elevenlabs', 'connection')
  }

  async testPinecone(): Promise<ApiTestResponse> {
    return this.testApi('pinecone', 'connection')
  }

  async testAWSS3(): Promise<ApiTestResponse> {
    return this.testApi('aws-s3', 'connection')
  }
}

// Instance singleton
export const apiConnector = new ApiConnector()

// Hooks React pour l'utilisation des APIs
export const useApiConnector = () => {
  return {
    testApi: apiConnector.testApi.bind(apiConnector),
    getApiConfig: apiConnector.getApiConfig.bind(apiConnector),
    updateApiConfig: apiConnector.updateApiConfig.bind(apiConnector),
    getApiStats: apiConnector.getApiStats.bind(apiConnector),
    testAllApis: apiConnector.testAllApis.bind(apiConnector),
    
    // Méthodes spécialisées
    testOpenAI: apiConnector.testOpenAI.bind(apiConnector),
    testGemini: apiConnector.testGemini.bind(apiConnector),
    testSeedream: apiConnector.testSeedream.bind(apiConnector),
    testKling: apiConnector.testKling.bind(apiConnector),
    testElevenLabs: apiConnector.testElevenLabs.bind(apiConnector),
    testPinecone: apiConnector.testPinecone.bind(apiConnector),
    testAWSS3: apiConnector.testAWSS3.bind(apiConnector),
  }
}
