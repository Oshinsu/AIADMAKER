import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { AuthService } from '../services/auth'
import { logger } from '../lib/logger'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['admin', 'pm', 'creative', 'traffic']).default('creative'),
})

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService()

  // Register
  fastify.post('/register', {
    schema: {
      body: RegisterSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof RegisterSchema> }>, reply: FastifyReply) => {
    try {
      const result = await authService.register(request.body)
      
      logger.info('User registered', { userId: result.user.id, email: result.user.email })
      
      reply.status(201).send(result)
    } catch (error) {
      logger.error('Failed to register user:', error)
      reply.status(400).send({ error: 'Failed to register user' })
    }
  })

  // Login
  fastify.post('/login', {
    schema: {
      body: LoginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' },
              },
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof LoginSchema> }>, reply: FastifyReply) => {
    try {
      const result = await authService.login(request.body)
      
      logger.info('User logged in', { userId: result.user.id, email: result.user.email })
      
      reply.send(result)
    } catch (error) {
      logger.error('Failed to login user:', error)
      reply.status(401).send({ error: 'Invalid credentials' })
    }
  })

  // Refresh token
  fastify.post('/refresh', {
    schema: {
      body: RefreshTokenSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof RefreshTokenSchema> }>, reply: FastifyReply) => {
    try {
      const result = await authService.refreshToken(request.body.refreshToken)
      
      reply.send(result)
    } catch (error) {
      logger.error('Failed to refresh token:', error)
      reply.status(401).send({ error: 'Invalid refresh token' })
    }
  })

  // Logout
  fastify.post('/logout', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.id
      await authService.logout(userId)
      
      logger.info('User logged out', { userId })
      
      reply.send({ success: true })
    } catch (error) {
      logger.error('Failed to logout user:', error)
      reply.status(500).send({ error: 'Failed to logout' })
    }
  })

  // Get current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.id
      const user = await authService.getCurrentUser(userId)
      
      reply.send(user)
    } catch (error) {
      logger.error('Failed to get current user:', error)
      reply.status(500).send({ error: 'Failed to get user' })
    }
  })

  // Update user
  fastify.put('/me', {
    preHandler: [fastify.authenticate],
    schema: {
      body: z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      }),
    },
  }, async (request: FastifyRequest<{ 
    Body: { name?: string; email?: string } 
  }>, reply: FastifyReply) => {
    try {
      const userId = (request as any).user.id
      const user = await authService.updateUser(userId, request.body)
      
      reply.send(user)
    } catch (error) {
      logger.error('Failed to update user:', error)
      reply.status(500).send({ error: 'Failed to update user' })
    }
  })
}
