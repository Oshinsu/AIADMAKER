import { Worker } from 'bullmq'
import { getRedis } from '../lib/redis'
import { logger } from '../lib/logger'
import { ImageWorker } from './image-worker'
import { VideoWorker } from './video-worker'
import { AudioWorker } from './audio-worker'
import { ExportWorker } from './export-worker'

export async function setupWorkers() {
  const redis = getRedis()
  
  // Image generation worker
  const imageWorker = new Worker(
    'image-generation',
    async (job) => {
      const worker = new ImageWorker()
      return await worker.process(job.data)
    },
    {
      connection: redis,
      concurrency: 3,
    }
  )

  // Video generation worker
  const videoWorker = new Worker(
    'video-generation',
    async (job) => {
      const worker = new VideoWorker()
      return await worker.process(job.data)
    },
    {
      connection: redis,
      concurrency: 2,
    }
  )

  // Audio generation worker
  const audioWorker = new Worker(
    'audio-generation',
    async (job) => {
      const worker = new AudioWorker()
      return await worker.process(job.data)
    },
    {
      connection: redis,
      concurrency: 5,
    }
  )

  // Export worker
  const exportWorker = new Worker(
    'export',
    async (job) => {
      const worker = new ExportWorker()
      return await worker.process(job.data)
    },
    {
      connection: redis,
      concurrency: 2,
    }
  )

  // Error handling
  imageWorker.on('error', (error) => {
    logger.error('Image worker error:', error)
  })

  videoWorker.on('error', (error) => {
    logger.error('Video worker error:', error)
  })

  audioWorker.on('error', (error) => {
    logger.error('Audio worker error:', error)
  })

  exportWorker.on('error', (error) => {
    logger.error('Export worker error:', error)
  })

  logger.info('Workers started successfully')
}
