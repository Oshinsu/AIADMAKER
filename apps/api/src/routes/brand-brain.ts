import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { BrandBrain } from '@ai-ad-maker/agents'
import { logger } from '../lib/logger'

const LoadBrandGuidelinesSchema = z.object({
  brandId: z.string(),
})

const GenerateConstraintsSchema = z.object({
  brandId: z.string(),
  context: z.object({
    product: z.string(),
    objective: z.string(),
    audience: z.string(),
    platform: z.string(),
  }),
})

const UpdateGuidelinesSchema = z.object({
  brandId: z.string(),
  updates: z.record(z.any()),
})

const ValidatePromptSchema = z.object({
  brandId: z.string(),
  prompt: z.string(),
})

export async function brandBrainRoutes(fastify: FastifyInstance) {
  const brandBrain = new BrandBrain()

  // Charger les guidelines d'une marque
  fastify.post('/guidelines/load', {
    schema: {
      body: LoadBrandGuidelinesSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            brandId: { type: 'string' },
            guidelines: { type: 'object' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof LoadBrandGuidelinesSchema> }>, reply: FastifyReply) => {
    try {
      const { brandId } = request.body
      
      await brandBrain.loadBrandGuidelines(brandId)
      
      logger.info('Brand guidelines loaded', { brandId })
      
      reply.send({
        success: true,
        brandId,
        message: 'Guidelines chargées avec succès',
      })
    } catch (error) {
      logger.error('Brand guidelines loading failed:', error)
      reply.status(500).send({ error: 'Échec du chargement des guidelines' })
    }
  })

  // Générer les contraintes de prompt
  fastify.post('/constraints/generate', {
    schema: {
      body: GenerateConstraintsSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            brandName: { type: 'string' },
            logoConstraints: { type: 'string' },
            colorConstraints: { type: 'string' },
            typographyConstraints: { type: 'string' },
            toneConstraints: { type: 'string' },
            claimConstraints: { type: 'string' },
            dos: { type: 'array', items: { type: 'string' } },
            donts: { type: 'array', items: { type: 'string' } },
            examples: { type: 'array', items: { type: 'string' } },
            technicalSpecs: { type: 'string' },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof GenerateConstraintsSchema> }>, reply: FastifyReply) => {
    try {
      const { brandId, context } = request.body
      
      const constraints = await brandBrain.generatePromptConstraints(brandId, context)
      
      logger.info('Prompt constraints generated', { brandId, context: context.product })
      
      reply.send(constraints)
    } catch (error) {
      logger.error('Prompt constraints generation failed:', error)
      reply.status(500).send({ error: 'Échec de la génération des contraintes' })
    }
  })

  // Valider un prompt contre les guidelines
  fastify.post('/prompt/validate', {
    schema: {
      body: ValidatePromptSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            isValid: { type: 'boolean' },
            score: { type: 'number' },
            violations: { type: 'array', items: { type: 'string' } },
            suggestions: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof ValidatePromptSchema> }>, reply: FastifyReply) => {
    try {
      const { brandId, prompt } = request.body
      
      const validation = await brandBrain.validatePromptAgainstBrand(brandId, prompt)
      
      logger.info('Prompt validated', { 
        brandId, 
        isValid: validation.isValid, 
        score: validation.score,
        violations: validation.violations.length,
      })
      
      reply.send(validation)
    } catch (error) {
      logger.error('Prompt validation failed:', error)
      reply.status(500).send({ error: 'Échec de la validation du prompt' })
    }
  })

  // Mettre à jour les guidelines
  fastify.put('/guidelines/update', {
    schema: {
      body: UpdateGuidelinesSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            brandId: { type: 'string' },
            updated: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof UpdateGuidelinesSchema> }>, reply: FastifyReply) => {
    try {
      const { brandId, updates } = request.body
      
      await brandBrain.updateBrandGuidelines(brandId, updates)
      
      logger.info('Brand guidelines updated', { brandId, updates: Object.keys(updates) })
      
      reply.send({
        success: true,
        brandId,
        updated: Object.keys(updates),
      })
    } catch (error) {
      logger.error('Brand guidelines update failed:', error)
      reply.status(500).send({ error: 'Échec de la mise à jour des guidelines' })
    }
  })

  // Obtenir le statut d'une marque
  fastify.get('/brand/:brandId/status', {
    schema: {
      params: {
        type: 'object',
        properties: {
          brandId: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Params: { brandId: string } }>, reply: FastifyReply) => {
    try {
      const { brandId } = request.params
      
      const status = await brandBrain.getBrandStatus(brandId)
      
      reply.send(status)
    } catch (error) {
      logger.error('Brand status retrieval failed:', error)
      reply.status(500).send({ error: 'Échec de la récupération du statut de la marque' })
    }
  })

  // Obtenir les métriques des marques
  fastify.get('/brands/metrics', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', default: '30d' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Querystring: { period?: string } }>, reply: FastifyReply) => {
    try {
      // TODO: Implémenter la récupération des métriques depuis la base de données
      const metrics = {
        totalBrands: 25,
        activeBrands: 20,
        averageGuidelines: 8.5,
        topBrands: [
          { brandId: 'nike', name: 'Nike', usage: 450 },
          { brandId: 'adidas', name: 'Adidas', usage: 380 },
          { brandId: 'apple', name: 'Apple', usage: 320 },
        ],
        guidelinesBreakdown: {
          logo: 20,
          colors: 20,
          typography: 18,
          tone: 15,
          claims: 12,
        },
      }

      reply.send(metrics)
    } catch (error) {
      logger.error('Brand metrics retrieval failed:', error)
      reply.status(500).send({ error: 'Échec de la récupération des métriques des marques' })
    }
  })
}
