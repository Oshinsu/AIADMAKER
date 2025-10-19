import Redis from 'ioredis'
import { logger } from './logger'

let redis: Redis

export async function setupRedis() {
  try {
    redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    redis.on('connect', () => {
      logger.info('✅ Redis connected successfully')
    })

    redis.on('error', (error) => {
      logger.error('❌ Redis connection error:', error)
    })

    await redis.ping()
  } catch (error) {
    logger.error('❌ Failed to connect to Redis:', error)
    throw error
  }
}

export function getRedis() {
  if (!redis) {
    throw new Error('Redis not initialized. Call setupRedis() first.')
  }
  return redis
}

export async function disconnectRedis() {
  if (redis) {
    await redis.quit()
    logger.info('Redis disconnected')
  }
}
