import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

let prisma: PrismaClient

export async function setupDatabase() {
  try {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    })

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query', (e: any) => {
        logger.debug('Query:', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        })
      })
    }

    await prisma.$connect()
    logger.info('✅ Database connected successfully')
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error)
    throw error
  }
}

export function getDatabase() {
  if (!prisma) {
    throw new Error('Database not initialized. Call setupDatabase() first.')
  }
  return prisma
}

export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect()
    logger.info('Database disconnected')
  }
}
