import { Job } from 'bullmq'
import { SeedreamService } from '@ai-ad-maker/connectors'
import { GeminiService } from '@ai-ad-maker/connectors'
import { S3Service } from '@ai-ad-maker/connectors'
import { logger } from '../lib/logger'

export class ImageWorker {
  private seedream: SeedreamService
  private gemini: GeminiService
  private s3: S3Service

  constructor() {
    this.seedream = new SeedreamService()
    this.gemini = new GeminiService()
    this.s3 = new S3Service()
  }

  async process(jobData: {
    prompts: Array<{
      text: string
      model: 'seedream' | 'gemini'
      style?: string
      aspectRatio?: string
    }>
    jobId: string
    userId: string
  }) {
    try {
      logger.info('Starting image generation', { jobId: jobData.jobId })

      const results = []

      for (const prompt of jobData.prompts) {
        let imageResult

        if (prompt.model === 'seedream') {
          imageResult = await this.seedream.generateImage({
            prompt: prompt.text,
            style: prompt.style || 'photorealistic',
            aspectRatio: prompt.aspectRatio || '16:9',
            quality: 'high',
          })
        } else if (prompt.model === 'gemini') {
          imageResult = await this.gemini.generateImage({
            prompt: prompt.text,
            style: prompt.style || 'photorealistic',
            aspectRatio: prompt.aspectRatio || '16:9',
          })
        }

        if (imageResult) {
          // Upload to S3
          const s3Url = await this.s3.uploadImage({
            imageData: imageResult.imageData,
            filename: `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`,
            contentType: 'image/png',
          })

          results.push({
            prompt: prompt.text,
            model: prompt.model,
            url: s3Url,
            metadata: {
              width: imageResult.width,
              height: imageResult.height,
              format: 'png',
              size: imageResult.size,
            },
          })
        }
      }

      logger.info('Image generation completed', { 
        jobId: jobData.jobId, 
        count: results.length 
      })

      return {
        success: true,
        results,
        count: results.length,
      }
    } catch (error) {
      logger.error('Image generation failed', { 
        jobId: jobData.jobId, 
        error: error.message 
      })
      
      throw error
    }
  }
}
