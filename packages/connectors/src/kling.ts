/**
 * KLING CONNECTOR - SOTA OCTOBRE 2025
 * Connecteur pour l'API Kling (génération vidéo IA)
 */

import { z } from 'zod'
import { logger } from './lib/logger'

const KlingConfigSchema = z.object({
  apiKey: z.string(),
  baseUrl: z.string().default('https://api.kling.ai/v1'),
  timeout: z.number().default(30000),
  maxRetries: z.number().default(3),
})

const KlingVideoRequestSchema = z.object({
  prompt: z.string(),
  duration: z.number().min(5).max(30),
  style: z.enum(['realistic', 'anime', 'cinematic', 'documentary']),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']),
  quality: z.enum(['standard', 'hd', '4k']),
  seed: z.number().optional(),
  negativePrompt: z.string().optional(),
  referenceImage: z.string().optional(),
})

const KlingVideoResponseSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  duration: z.number(),
  fileSize: z.number(),
  createdAt: z.string(),
  estimatedTime: z.number(),
  progress: z.number().min(0).max(100),
  style: z.string(),
  aspectRatio: z.string(),
})

export class KlingConnector {
  private config: z.infer<typeof KlingConfigSchema>
  private requestQueue: Array<{
    id: string
    request: z.infer<typeof KlingVideoRequestSchema>
    resolve: (value: any) => void
    reject: (error: any) => void
    retryCount: number
  }>

  constructor(config: z.infer<typeof KlingConfigSchema>) {
    this.config = config
    this.requestQueue = []
    this.startProcessing()
  }

  async generateVideo(request: z.infer<typeof KlingVideoRequestSchema>): Promise<z.infer<typeof KlingVideoResponseSchema>> {
    return new Promise((resolve, reject) => {
      const requestId = `kling_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      
      this.requestQueue.push({
        id: requestId,
        request,
        resolve,
        reject,
        retryCount: 0
      })

      logger.info('Kling video generation queued', { requestId, duration: request.duration, style: request.style })
    })
  }

  private async startProcessing() {
    while (true) {
      if (this.requestQueue.length > 0) {
        const queuedRequest = this.requestQueue.shift()
        if (queuedRequest) {
          await this.processVideoGeneration(queuedRequest)
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  private async processVideoGeneration(queuedRequest: {
    id: string
    request: z.infer<typeof KlingVideoRequestSchema>
    resolve: (value: any) => void
    reject: (error: any) => void
    retryCount: number
  }) {
    try {
      const startTime = Date.now()
      
      // Appel à l'API Kling
      const response = await fetch(`${this.config.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: queuedRequest.request.prompt,
          duration: queuedRequest.request.duration,
          style: queuedRequest.request.style,
          aspect_ratio: queuedRequest.request.aspectRatio,
          quality: queuedRequest.request.quality,
          seed: queuedRequest.request.seed,
          negative_prompt: queuedRequest.request.negativePrompt,
          reference_image: queuedRequest.request.referenceImage,
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      const processingTime = Date.now() - startTime

      const videoResult: z.infer<typeof KlingVideoResponseSchema> = {
        id: result.id || queuedRequest.id,
        status: 'completed',
        videoUrl: result.video_url,
        thumbnailUrl: result.thumbnail_url,
        duration: queuedRequest.request.duration,
        fileSize: result.file_size || 0,
        createdAt: new Date().toISOString(),
        estimatedTime: result.estimated_time || processingTime,
        progress: 100,
        style: queuedRequest.request.style,
        aspectRatio: queuedRequest.request.aspectRatio,
      }

      queuedRequest.resolve(videoResult)

      logger.info('Kling video generation completed', {
        requestId: queuedRequest.id,
        videoId: videoResult.id,
        processingTime,
        fileSize: videoResult.fileSize
      })

    } catch (error) {
      logger.error('Kling video generation failed:', error)
      
      if (queuedRequest.retryCount < this.config.maxRetries) {
        queuedRequest.retryCount++
        this.requestQueue.push(queuedRequest)
        
        logger.info('Kling video generation queued for retry', {
          requestId: queuedRequest.id,
          retryCount: queuedRequest.retryCount
        })
      } else {
        queuedRequest.reject(new Error(`Kling video generation failed after ${this.config.maxRetries} retries: ${error.message}`))
      }
    }
  }

  async getVideoStatus(videoId: string): Promise<z.infer<typeof KlingVideoResponseSchema>> {
    try {
      const response = await fetch(`${this.config.baseUrl}/status/${videoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        id: result.id,
        status: result.status,
        videoUrl: result.video_url,
        thumbnailUrl: result.thumbnail_url,
        duration: result.duration,
        fileSize: result.file_size,
        createdAt: result.created_at,
        estimatedTime: result.estimated_time,
        progress: result.progress,
        style: result.style,
        aspectRatio: result.aspect_ratio,
      }

    } catch (error) {
      logger.error('Failed to get Kling video status:', error)
      throw new Error(`Failed to get video status: ${error.message}`)
    }
  }

  async downloadVideo(videoUrl: string): Promise<Buffer> {
    try {
      const response = await fetch(videoUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status} ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()
      return Buffer.from(buffer)

    } catch (error) {
      logger.error('Failed to download Kling video:', error)
      throw new Error(`Failed to download video: ${error.message}`)
    }
  }

  async getUsageStats(): Promise<{
    totalVideos: number
    totalDuration: number
    totalFileSize: number
    averageProcessingTime: number
  }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/usage`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        signal: AbortSignal.timeout(this.config.timeout)
      })

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        totalVideos: result.total_videos || 0,
        totalDuration: result.total_duration || 0,
        totalFileSize: result.total_file_size || 0,
        averageProcessingTime: result.average_processing_time || 0,
      }

    } catch (error) {
      logger.error('Failed to get Kling usage stats:', error)
      throw new Error(`Failed to get usage stats: ${error.message}`)
    }
  }
}