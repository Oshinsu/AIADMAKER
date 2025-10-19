import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MediaVendorRouter } from '@ai-ad-maker/connectors'
import { logger } from '../lib/logger'

const RouteRequestSchema = z.object({
  type: z.enum(['image', 'video', 'audio']),
  task: z.string(),
  requirements: z.object({
    quality: z.enum(['low', 'medium', 'high', 'ultra']).optional(),
    format: z.string().optional(),
    resolution: z.string().optional(),
    duration: z.number().optional(),
    budget: z.number().optional(),
    deadline: z.number().optional(),
  }),
  constraints: z.object({
    maxCost: z.number().optional(),
    maxLatency: z.number().optional(),
    requiredCapabilities: z.array(z.string()).optional(),
    preferredVendors: z.array(z.string()).optional(),
    blockedVendors: z.array(z.string()).optional(),
  }),
})

const ExecuteRequestSchema = z.object({
  decision: z.object({
    selectedVendor: z.string(),
    fallbackVendors: z.array(z.string()),
    estimatedCost: z.number(),
    estimatedLatency: z.number(),
    confidence: z.number(),
    reasoning: z.string(),
  }),
  request: z.object({
    type: z.string(),
    task: z.string(),
    requirements: z.record(z.any()),
  }),
})

export async function vendorRouterRoutes(fastify: FastifyInstance) {
  const vendorRouter = new MediaVendorRouter()

  // Router une requête vers le meilleur vendor
  fastify.post('/route', {
    schema: {
      body: RouteRequestSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            selectedVendor: { type: 'string' },
            fallbackVendors: { type: 'array', items: { type: 'string' } },
            estimatedCost: { type: 'number' },
            estimatedLatency: { type: 'number' },
            confidence: { type: 'number' },
            reasoning: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof RouteRequestSchema> }>, reply: FastifyReply) => {
    try {
      const decision = await vendorRouter.routeRequest(request.body)
      
      logger.info('Request routed', { 
        task: request.body.task,
        selectedVendor: decision.selectedVendor,
        confidence: decision.confidence,
        cost: decision.estimatedCost,
      })
      
      reply.send(decision)
    } catch (error) {
      logger.error('Request routing failed:', error)
      reply.status(500).send({ error: 'Échec du routing de la requête' })
    }
  })

  // Exécuter une requête avec un vendor spécifique
  fastify.post('/execute', {
    schema: {
      body: ExecuteRequestSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            result: { type: 'object' },
            vendor: { type: 'string' },
            executionTime: { type: 'number' },
            cost: { type: 'number' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof ExecuteRequestSchema> }>, reply: FastifyReply) => {
    try {
      const { decision, request: req } = request.body
      
      const startTime = Date.now()
      const result = await vendorRouter.executeRequest(decision, req)
      const executionTime = Date.now() - startTime
      
      logger.info('Request executed', { 
        vendor: decision.selectedVendor,
        executionTime,
        success: result.success,
      })
      
      reply.send({
        success: result.success,
        result: result.data,
        vendor: decision.selectedVendor,
        executionTime,
        cost: decision.estimatedCost,
      })
    } catch (error) {
      logger.error('Request execution failed:', error)
      reply.status(500).send({ error: 'Échec de l\'exécution de la requête' })
    }
  })

  // Obtenir le statut des vendors
  fastify.get('/status', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            vendors: { type: 'array' },
            totalVendors: { type: 'number' },
            activeVendors: { type: 'number' },
          },
        },
      },
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const status = await vendorRouter.getVendorStatus()
      
      const activeVendors = status.filter(v => v.availability > 0.8).length
      
      reply.send({
        vendors: status,
        totalVendors: status.length,
        activeVendors,
      })
    } catch (error) {
      logger.error('Vendor status retrieval failed:', error)
      reply.status(500).send({ error: 'Échec de la récupération du statut des vendors' })
    }
  })

  // Obtenir les métriques d'un vendor spécifique
  fastify.get('/vendor/:vendorId/metrics', {
    schema: {
      params: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Params: { vendorId: string } }>, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params
      const status = await vendorRouter.getVendorStatus()
      
      const vendor = status.find(v => v.id === vendorId)
      if (!vendor) {
        return reply.status(404).send({ error: 'Vendor non trouvé' })
      }
      
      reply.send(vendor)
    } catch (error) {
      logger.error('Vendor metrics retrieval failed:', error)
      reply.status(500).send({ error: 'Échec de la récupération des métriques du vendor' })
    }
  })

  // Tester un vendor
  fastify.post('/vendor/:vendorId/test', {
    schema: {
      params: {
        type: 'object',
        properties: {
          vendorId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        properties: {
          testType: { type: 'string' },
          parameters: { type: 'object' },
        },
      },
    },
  }, async (request: FastifyRequest<{ 
    Params: { vendorId: string }
    Body: { testType: string; parameters: any }
  }>, reply: FastifyReply) => {
    try {
      const { vendorId } = request.params
      const { testType, parameters } = request.body
      
      // TODO: Implémenter les tests de vendor
      const testResult = {
        vendorId,
        testType,
        success: true,
        latency: 1500,
        quality: 8.5,
        cost: 0.05,
        timestamp: new Date().toISOString(),
      }
      
      logger.info('Vendor test completed', { vendorId, testType, success: testResult.success })
      
      reply.send(testResult)
    } catch (error) {
      logger.error('Vendor test failed:', error)
      reply.status(500).send({ error: 'Échec du test du vendor' })
    }
  })
}
