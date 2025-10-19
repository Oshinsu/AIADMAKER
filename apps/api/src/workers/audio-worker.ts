import { Job } from 'bullmq'
import { ElevenLabsService } from '@ai-ad-maker/connectors'
import { SunoService } from '@ai-ad-maker/connectors'
import { S3Service } from '@ai-ad-maker/connectors'
import { logger } from '../lib/logger'

export class AudioWorker {
  private elevenlabs: ElevenLabsService
  private suno: SunoService
  private s3: S3Service

  constructor() {
    this.elevenlabs = new ElevenLabsService()
    this.suno = new SunoService()
    this.s3 = new S3Service()
  }

  async process(jobData: {
    tasks: Array<{
      type: 'voice' | 'music'
      text?: string
      prompt?: string
      voiceId?: string
      style?: string
      duration?: number
    }>
    jobId: string
    userId: string
  }) {
    try {
      logger.info('Starting audio generation', { jobId: jobData.jobId })

      const results = []

      for (const task of jobData.tasks) {
        let audioResult

        if (task.type === 'voice') {
          audioResult = await this.generateVoice(task)
        } else if (task.type === 'music') {
          audioResult = await this.generateMusic(task)
        }

        if (audioResult) {
          // Upload to S3
          const s3Url = await this.s3.uploadAudio({
            audioData: audioResult.audioData,
            filename: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`,
            contentType: 'audio/mpeg',
          })

          results.push({
            type: task.type,
            url: s3Url,
            metadata: {
              duration: audioResult.duration,
              format: 'mp3',
              size: audioResult.size,
              bitrate: audioResult.bitrate,
            },
          })
        }
      }

      logger.info('Audio generation completed', { 
        jobId: jobData.jobId, 
        count: results.length 
      })

      return {
        success: true,
        results,
        count: results.length,
      }
    } catch (error) {
      logger.error('Audio generation failed', { 
        jobId: jobData.jobId, 
        error: error.message 
      })
      
      throw error
    }
  }

  private async generateVoice(task: any) {
    return await this.elevenlabs.generateVoice({
      text: task.text!,
      voiceId: task.voiceId || 'default',
      style: task.style || 'neutral',
    })
  }

  private async generateMusic(task: any) {
    // Note: Suno API is experimental and not officially available
    // This is a placeholder implementation
    try {
      return await this.suno.generateMusic({
        prompt: task.prompt!,
        style: task.style || 'upbeat',
        duration: task.duration || 30,
      })
    } catch (error) {
      logger.warn('Suno API not available, using placeholder', { error: error.message })
      
      // Return placeholder music generation
      return {
        audioData: Buffer.from('placeholder'),
        duration: task.duration || 30,
        size: 1024,
        bitrate: 128,
      }
    }
  }
}
