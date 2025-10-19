import { Job } from 'bullmq'
import { S3Service } from '@ai-ad-maker/connectors'
import { logger } from '../lib/logger'
import * as ffmpeg from 'fluent-ffmpeg'
import * as path from 'path'
import * as fs from 'fs'

export class ExportWorker {
  private s3: S3Service

  constructor() {
    this.s3 = new S3Service()
  }

  async process(jobData: {
    assets: {
      images: Array<{ url: string; metadata: any }>
      videos: Array<{ url: string; metadata: any }>
      audio: Array<{ url: string; metadata: any }>
    }
    formats: Array<{
      platform: 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'twitter'
      duration: number
      aspectRatio: string
      resolution: string
    }>
    jobId: string
    userId: string
  }) {
    try {
      logger.info('Starting export process', { jobId: jobData.jobId })

      const results = []

      for (const format of jobData.formats) {
        const exportResult = await this.exportForPlatform(
          jobData.assets,
          format,
          jobData.jobId
        )

        if (exportResult) {
          results.push(exportResult)
        }
      }

      logger.info('Export completed', { 
        jobId: jobData.jobId, 
        count: results.length 
      })

      return {
        success: true,
        results,
        count: results.length,
      }
    } catch (error) {
      logger.error('Export failed', { 
        jobId: jobData.jobId, 
        error: error.message 
      })
      
      throw error
    }
  }

  private async exportForPlatform(
    assets: any,
    format: any,
    jobId: string
  ) {
    const tempDir = `/tmp/export_${jobId}_${Date.now()}`
    await fs.promises.mkdir(tempDir, { recursive: true })

    try {
      let outputPath: string

      switch (format.platform) {
        case 'facebook':
          outputPath = await this.exportForFacebook(assets, format, tempDir)
          break
        case 'instagram':
          outputPath = await this.exportForInstagram(assets, format, tempDir)
          break
        case 'youtube':
          outputPath = await this.exportForYouTube(assets, format, tempDir)
          break
        case 'tiktok':
          outputPath = await this.exportForTikTok(assets, format, tempDir)
          break
        case 'twitter':
          outputPath = await this.exportForTwitter(assets, format, tempDir)
          break
        default:
          throw new Error(`Unsupported platform: ${format.platform}`)
      }

      // Upload to S3
      const s3Url = await this.s3.uploadFile({
        filePath: outputPath,
        filename: `export_${format.platform}_${Date.now()}.mp4`,
        contentType: 'video/mp4',
      })

      return {
        platform: format.platform,
        url: s3Url,
        metadata: {
          duration: format.duration,
          aspectRatio: format.aspectRatio,
          resolution: format.resolution,
        },
      }
    } finally {
      // Cleanup temp directory
      await fs.promises.rmdir(tempDir, { recursive: true })
    }
  }

  private async exportForFacebook(assets: any, format: any, tempDir: string): Promise<string> {
    // Facebook specs: 16:9, 1080p, max 4GB, max 240 minutes
    const outputPath = path.join(tempDir, 'facebook_export.mp4')
    
    return new Promise((resolve, reject) => {
      new Ffmpeg()
        .input(assets.videos[0]?.url || assets.images[0]?.url)
        .size('1920x1080')
        .aspect('16:9')
        .duration(format.duration)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset fast',
          '-crf 23',
          '-maxrate 8M',
          '-bufsize 16M',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  private async exportForInstagram(assets: any, format: any, tempDir: string): Promise<string> {
    // Instagram specs: 9:16 for Stories, 1:1 for Posts, 16:9 for Reels
    const outputPath = path.join(tempDir, 'instagram_export.mp4')
    
    return new Promise((resolve, reject) => {
      new Ffmpeg()
        .input(assets.videos[0]?.url || assets.images[0]?.url)
        .size(format.aspectRatio === '9:16' ? '1080x1920' : '1080x1080')
        .aspect(format.aspectRatio)
        .duration(format.duration)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset fast',
          '-crf 23',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  private async exportForYouTube(assets: any, format: any, tempDir: string): Promise<string> {
    // YouTube specs: 16:9, 1080p, max 12 hours
    const outputPath = path.join(tempDir, 'youtube_export.mp4')
    
    return new Promise((resolve, reject) => {
      new Ffmpeg()
        .input(assets.videos[0]?.url || assets.images[0]?.url)
        .size('1920x1080')
        .aspect('16:9')
        .duration(format.duration)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset medium',
          '-crf 18',
          '-maxrate 8M',
          '-bufsize 16M',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  private async exportForTikTok(assets: any, format: any, tempDir: string): Promise<string> {
    // TikTok specs: 9:16, 1080x1920, max 3 minutes
    const outputPath = path.join(tempDir, 'tiktok_export.mp4')
    
    return new Promise((resolve, reject) => {
      new Ffmpeg()
        .input(assets.videos[0]?.url || assets.images[0]?.url)
        .size('1080x1920')
        .aspect('9:16')
        .duration(Math.min(format.duration, 180)) // Max 3 minutes
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset fast',
          '-crf 23',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }

  private async exportForTwitter(assets: any, format: any, tempDir: string): Promise<string> {
    // Twitter specs: 16:9, 1280x720, max 2 minutes 20 seconds
    const outputPath = path.join(tempDir, 'twitter_export.mp4')
    
    return new Promise((resolve, reject) => {
      new Ffmpeg()
        .input(assets.videos[0]?.url || assets.images[0]?.url)
        .size('1280x720')
        .aspect('16:9')
        .duration(Math.min(format.duration, 140)) // Max 2:20
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset fast',
          '-crf 23',
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', reject)
        .run()
    })
  }
}
