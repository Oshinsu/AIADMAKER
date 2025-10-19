import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreativeEvaluator } from '@ai-ad-maker/agents'
import { logger } from '../lib/logger'

const EvaluateAssetSchema = z.object({
  assetUrl: z.string().url(),
  assetType: z.enum(['image', 'video']),
  platform: z.string(),
  metadata: z.object({
    width: z.number(),
    height: z.number(),
    size: z.number(),
    format: z.string(),
    duration: z.number().optional(),
  }),
})

const BatchEvaluationSchema = z.object({
  assets: z.array(EvaluateAssetSchema),
  jobId: z.string(),
  userId: z.string(),
})

export async function creativeEvaluationRoutes(fastify: FastifyInstance) {
  const evaluator = new CreativeEvaluator()

  // Évaluer un asset unique
  fastify.post('/evaluate', {
    schema: {
      body: EvaluateAssetSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            overallScore: { type: 'number' },
            readability: { type: 'object' },
            brandCompliance: { type: 'object' },
            platformCompliance: { type: 'object' },
            authenticity: { type: 'object' },
            recommendations: { type: 'array', items: { type: 'string' } },
            requiresHumanApproval: { type: 'boolean' },
            blockingIssues: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof EvaluateAssetSchema> }>, reply: FastifyReply) => {
    try {
      const evaluation = await evaluator.evaluateAsset(request.body)
      
      logger.info('Asset evaluated', { 
        assetUrl: request.body.assetUrl,
        score: evaluation.overallScore,
        requiresApproval: evaluation.requiresHumanApproval,
      })
      
      reply.send(evaluation)
    } catch (error) {
      logger.error('Asset evaluation failed:', error)
      reply.status(500).send({ error: 'Échec de l\'évaluation de l\'asset' })
    }
  })

  // Évaluer plusieurs assets en lot
  fastify.post('/evaluate/batch', {
    schema: {
      body: BatchEvaluationSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            evaluations: { type: 'array' },
            overallScore: { type: 'number' },
            requiresHumanApproval: { type: 'boolean' },
            blockingIssues: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof BatchEvaluationSchema> }>, reply: FastifyReply) => {
    try {
      const { assets, jobId, userId } = request.body
      
      const evaluations = []
      const allBlockingIssues = []
      let totalScore = 0
      let validEvaluations = 0

      for (const asset of assets) {
        try {
          const evaluation = await evaluator.evaluateAsset(asset)
          evaluations.push({
            assetUrl: asset.assetUrl,
            evaluation,
          })
          
          totalScore += evaluation.overallScore
          validEvaluations++
          
          if (evaluation.blockingIssues.length > 0) {
            allBlockingIssues.push(...evaluation.blockingIssues)
          }
        } catch (error) {
          logger.error('Individual asset evaluation failed:', error)
          evaluations.push({
            assetUrl: asset.assetUrl,
            error: error.message,
          })
        }
      }

      const overallScore = validEvaluations > 0 ? totalScore / validEvaluations : 0
      const requiresHumanApproval = allBlockingIssues.length > 0 || overallScore < 6.0

      logger.info('Batch evaluation completed', { 
        jobId,
        assetCount: assets.length,
        overallScore,
        requiresApproval: requiresHumanApproval,
      })

      reply.send({
        evaluations,
        overallScore,
        requiresHumanApproval,
        blockingIssues: allBlockingIssues,
      })
    } catch (error) {
      logger.error('Batch evaluation failed:', error)
      reply.status(500).send({ error: 'Échec de l\'évaluation en lot' })
    }
  })

  // Obtenir les métriques d'évaluation
  fastify.get('/metrics', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', default: '7d' },
          platform: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Querystring: { period?: string; platform?: string } }>, reply: FastifyReply) => {
    try {
      // TODO: Implémenter la récupération des métriques depuis la base de données
      const metrics = {
        totalEvaluations: 1250,
        averageScore: 8.2,
        successRate: 0.92,
        humanApprovalRate: 0.15,
        topIssues: [
          { issue: 'Contraste insuffisant', count: 45 },
          { issue: 'Texte trop petit', count: 32 },
          { issue: 'Logo mal placé', count: 28 },
        ],
        platformBreakdown: {
          facebook: { count: 450, averageScore: 8.5 },
          instagram: { count: 380, averageScore: 8.1 },
          tiktok: { count: 420, averageScore: 7.9 },
        },
      }

      reply.send(metrics)
    } catch (error) {
      logger.error('Metrics retrieval failed:', error)
      reply.status(500).send({ error: 'Échec de la récupération des métriques' })
    }
  })
}
