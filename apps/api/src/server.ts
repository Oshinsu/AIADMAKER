import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'

import { workflowRoutes } from './routes/workflow'
import { jobRoutes } from './routes/jobs'
import { webhookRoutes } from './routes/webhooks'
import { authRoutes } from './routes/auth'
import { creativeEvaluationRoutes } from './routes/creative-evaluation'
import { vendorRouterRoutes } from './routes/vendor-router'
import { brandBrainRoutes } from './routes/brand-brain'
import { apiRoutes } from './routes/apis'
import { setupDatabase } from './lib/database'
import { setupRedis } from './lib/redis'
import { setupWorkers } from './workers'
import { logger } from './lib/logger'

// Fastify v5 avec optimisations performance d'octobre 2025
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  // Nouvelles options Fastify v5
  keepAliveTimeout: 5000,
  maxParamLength: 200,
  bodyLimit: 1048576, // 1MB
  // Optimisations performance
  disableRequestLogging: false,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  genReqId: () => Math.random().toString(36).substring(2, 15),
})

const httpServer = createServer()
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

async function buildApp() {
  // Security middleware
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  })

  await fastify.register(cors, {
    origin: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    credentials: true,
  })

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // Database setup
  await setupDatabase()
  await setupRedis()

  // Routes
  await fastify.register(authRoutes, { prefix: '/api/auth' })
  await fastify.register(workflowRoutes, { prefix: '/api/workflows' })
  await fastify.register(jobRoutes, { prefix: '/api/jobs' })
  await fastify.register(webhookRoutes, { prefix: '/api/webhooks' })
  await fastify.register(creativeEvaluationRoutes, { prefix: '/api/creative-evaluation' })
  await fastify.register(vendorRouterRoutes, { prefix: '/api/vendor-router' })
  await fastify.register(brandBrainRoutes, { prefix: '/api/brand-brain' })
  await fastify.register(apiRoutes, { prefix: '/api/apis' })

  // Health check
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Socket.IO integration
  fastify.register(async function (fastify) {
    fastify.get('/socket.io/*', { websocket: true }, (connection, req) => {
      // WebSocket handling
    })
  })

  // Error handling
  fastify.setErrorHandler(async (error, request, reply) => {
    logger.error('Unhandled error:', error)
    
    reply.status(500).send({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    })
  })

  return fastify
}

async function start() {
  try {
    const app = await buildApp()
    
    // Setup workers
    await setupWorkers()
    
    const port = parseInt(process.env.PORT || '3001')
    const host = process.env.HOST || '0.0.0.0'
    
    await app.listen({ port, host })
    
    logger.info(`🚀 API Server running on http://${host}:${port}`)
    logger.info(`📊 Health check: http://${host}:${port}/health`)
    
    // Socket.IO server
    httpServer.listen(3002, () => {
      logger.info(`🔌 Socket.IO server running on port 3002`)
    })
    
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  await fastify.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully')
  await fastify.close()
  process.exit(0)
})

if (require.main === module) {
  start()
}

export { fastify }
