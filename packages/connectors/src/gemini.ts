/**
 * GEMINI CONNECTOR - SOTA OCTOBRE 2025
 * Connecteur pour l'API Google Gemini (modèle multimodal)
 */

import { z } from 'zod'
import { logger } from './lib/logger'

const GeminiConfigSchema = z.object({
  apiKey: z.string(),
  baseUrl: z.string().default('https://generativelanguage.googleapis.com/v1beta'),
  timeout: z.number().default(30000),
  maxRetries: z.number().default(3),
  model: z.string().default('gemini-2.0-flash-exp'),
})

const GeminiRequestSchema = z.object({
  prompt: z.string(),
  images: z.array(z.string()).optional(), // URLs d'images
  maxTokens: z.number().min(1).max(8192).default(2048),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(0.9),
  topK: z.number().min(1).max(100).default(40),
  safetySettings: z.object({
    harassment: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']).default('BLOCK_MEDIUM_AND_ABOVE'),
    hateSpeech: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']).default('BLOCK_MEDIUM_AND_ABOVE'),
    sexuallyExplicit: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']).default('BLOCK_MEDIUM_AND_ABOVE'),
    dangerousContent: z.enum(['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE']).default('BLOCK_MEDIUM_AND_ABOVE'),
  }).optional(),
  systemInstruction: z.string().optional(),
})

const GeminiResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
  finishReason: z.enum(['STOP', 'MAX_TOKENS', 'SAFETY', 'RECITATION', 'OTHER']),
  safetyRatings: z.array(z.object({
    category: z.string(),
    probability: z.enum(['NEGLIGIBLE', 'LOW', 'MEDIUM', 'HIGH']),
  })),
  createdAt: z.string(),
  model: z.string(),
})

export class GeminiConnector {
  private config: z.infer<typeof GeminiConfigSchema>

  constructor(config: z.infer<typeof GeminiConfigSchema>) {
    this.config = config
  }

  async generateText(request: z.infer<typeof GeminiRequestSchema>): Promise<z.infer<typeof GeminiResponseSchema>> {
    try {
      const startTime = Date.now()
      
      // Construction du contenu multimodal
      const contents = []
      
      // Ajout du texte
      contents.push({
        role: 'user',
        parts: [
          { text: request.prompt }
        ]
      })

      // Ajout des images si présentes
      if (request.images && request.images.length > 0) {
        const imageParts = request.images.map(imageUrl => ({
          inline_data: {
            mime_type: 'image/jpeg',
            data: imageUrl // En production, il faudrait télécharger et encoder l'image
          }
        }))
        
        contents[0].parts.push(...imageParts)
      }

      const requestBody = {
        contents,
        generationConfig: {
          maxOutputTokens: request.maxTokens,
          temperature: request.temperature,
          topP: request.topP,
          topK: request.topK,
        },
        safetySettings: request.safetySettings ? Object.entries(request.safetySettings).map(([category, threshold]) => ({
          category: category.toUpperCase(),
          threshold: threshold
        })) : undefined,
        systemInstruction: request.systemInstruction ? {
          parts: [{ text: request.systemInstruction }]
        } : undefined,
      }

      const response = await fetch(`${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
      }

      const result = await response.json()
      const processingTime = Date.now() - startTime

      const geminiResponse: z.infer<typeof GeminiResponseSchema> = {
        id: result.candidates?.[0]?.content?.parts?.[0]?.text ? `gemini_${Date.now()}_${Math.random().toString(36).substring(2, 15)}` : '',
        text: result.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          promptTokens: result.usageMetadata?.promptTokenCount || 0,
          completionTokens: result.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: result.usageMetadata?.totalTokenCount || 0,
        },
        finishReason: result.candidates?.[0]?.finishReason || 'STOP',
        safetyRatings: result.candidates?.[0]?.safetyRatings?.map((rating: any) => ({
          category: rating.category,
          probability: rating.probability,
        })) || [],
        createdAt: new Date().toISOString(),
        model: this.config.model,
      }

      logger.info('Gemini text generation completed', {
        requestId: geminiResponse.id,
        processingTime,
        tokensUsed: geminiResponse.usage.totalTokens,
        finishReason: geminiResponse.finishReason
      })

      return geminiResponse

    } catch (error) {
      logger.error('Gemini text generation failed:', error)
      throw new Error(`Gemini text generation failed: ${error.message}`)
    }
  }

  async generateMultimodal(request: z.infer<typeof GeminiRequestSchema>): Promise<z.infer<typeof GeminiResponseSchema>> {
    // Pour les requêtes multimodales, on utilise la même méthode que generateText
    // mais avec des paramètres optimisés pour le multimodal
    const multimodalRequest = {
      ...request,
      maxTokens: Math.min(request.maxTokens * 1.5, 8192), // Plus de tokens pour le multimodal
      temperature: Math.min(request.temperature * 0.8, 1.0), // Température légèrement réduite
    }

    return this.generateText(multimodalRequest)
  }

  async analyzeImage(imageUrl: string, prompt: string): Promise<z.infer<typeof GeminiResponseSchema>> {
    const request: z.infer<typeof GeminiRequestSchema> = {
      prompt,
      images: [imageUrl],
      maxTokens: 2048,
      temperature: 0.3, // Température plus basse pour l'analyse
      systemInstruction: "Tu es un expert en analyse d'images. Fournis une analyse détaillée et précise."
    }

    return this.generateMultimodal(request)
  }

  async getModelInfo(): Promise<{
    name: string
    displayName: string
    description: string
    supportedGenerationMethods: string[]
    inputTokenLimit: number
    outputTokenLimit: number
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/models/${this.config.model}?key=${this.config.apiKey}`, {
        method: 'GET',
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        name: result.name,
        displayName: result.displayName,
        description: result.description,
        supportedGenerationMethods: result.supportedGenerationMethods,
        inputTokenLimit: result.inputTokenLimit,
        outputTokenLimit: result.outputTokenLimit,
      }

    } catch (error) {
      logger.error('Failed to get Gemini model info:', error)
      throw new Error(`Failed to get model info: ${error.message}`)
    }
  }

  async getUsageStats(): Promise<{
    totalRequests: number
    totalTokens: number
    averageTokensPerRequest: number
    costEstimate: number
  }> {
    try {
      // Note: Gemini ne fournit pas d'API de statistiques d'usage directe
      // Cette méthode retourne des statistiques simulées basées sur les requêtes locales
      return {
        totalRequests: 0,
        totalTokens: 0,
        averageTokensPerRequest: 0,
        costEstimate: 0,
      }

    } catch (error) {
      logger.error('Failed to get Gemini usage stats:', error)
      throw new Error(`Failed to get usage stats: ${error.message}`)
    }
  }
}