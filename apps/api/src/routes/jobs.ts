import { FastifyInstance } from 'fastify'
import { z } from 'zod'

const CreateJobSchema = z.object({
  workflowId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  metadata: z.record(z.any()).optional(),
})

const UpdateJobSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function jobRoutes(fastify: FastifyInstance) {
  // Créer un nouveau job
  fastify.post('/', {
    schema: {
      body: CreateJobSchema,
      response: {
        201: z.object({
          id: z.string(),
          workflowId: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          priority: z.string(),
          createdAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const jobData = request.body as z.infer<typeof CreateJobSchema>
        
        // Créer le job
        const job = {
          id: Date.now().toString(),
          workflowId: jobData.workflowId,
          name: jobData.name,
          description: jobData.description || '',
          status: 'pending',
          priority: jobData.priority || 'medium',
          createdAt: new Date().toISOString(),
          metadata: jobData.metadata || {},
        }
        
        fastify.log.info(`Job created: ${job.id}`)
        
        return reply.status(201).send(job)
      } catch (error) {
        fastify.log.error('Error creating job:', error)
        return reply.status(500).send({ error: 'Failed to create job' })
      }
    },
  })

  // Obtenir tous les jobs
  fastify.get('/', {
    schema: {
      querystring: z.object({
        status: z.string().optional(),
        workflowId: z.string().optional(),
        limit: z.string().optional(),
        offset: z.string().optional(),
      }),
      response: {
        200: z.object({
          jobs: z.array(z.object({
            id: z.string(),
            workflowId: z.string(),
            name: z.string(),
            description: z.string().optional(),
            status: z.string(),
            priority: z.string(),
            progress: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })),
          total: z.number(),
          limit: z.number(),
          offset: z.number(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { status, workflowId, limit = '10', offset = '0' } = request.query as {
          status?: string
          workflowId?: string
          limit?: string
          offset?: string
        }
        
        // Simuler la récupération des jobs depuis la base de données
        const jobs = [
          {
            id: '1',
            workflowId: '1',
            name: 'Génération Brief Nike',
            description: 'Génération du brief pour la campagne Nike Air Max',
            status: 'completed',
            priority: 'high',
            progress: 100,
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-01-15T10:35:00Z',
          },
          {
            id: '2',
            workflowId: '1',
            name: 'Évaluation Brief Nike',
            description: 'Évaluation de la qualité du brief Nike',
            status: 'running',
            priority: 'high',
            progress: 75,
            createdAt: '2025-01-15T10:35:00Z',
            updatedAt: '2025-01-15T11:00:00Z',
          },
          {
            id: '3',
            workflowId: '2',
            name: 'Génération Images iPhone',
            description: 'Génération des images pour la publicité iPhone 15',
            status: 'pending',
            priority: 'medium',
            progress: 0,
            createdAt: '2025-01-14T16:30:00Z',
            updatedAt: '2025-01-14T16:30:00Z',
          },
        ]
        
        // Filtrer les jobs selon les paramètres
        let filteredJobs = jobs
        if (status) {
          filteredJobs = filteredJobs.filter(job => job.status === status)
        }
        if (workflowId) {
          filteredJobs = filteredJobs.filter(job => job.workflowId === workflowId)
        }
        
        const limitNum = parseInt(limit)
        const offsetNum = parseInt(offset)
        const paginatedJobs = filteredJobs.slice(offsetNum, offsetNum + limitNum)
        
        return reply.send({
          jobs: paginatedJobs,
          total: filteredJobs.length,
          limit: limitNum,
          offset: offsetNum,
        })
      } catch (error) {
        fastify.log.error('Error fetching jobs:', error)
        return reply.status(500).send({ error: 'Failed to fetch jobs' })
      }
    },
  })

  // Obtenir un job spécifique
  fastify.get('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          workflowId: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          priority: z.string(),
          progress: z.number(),
          steps: z.array(z.object({
            id: z.string(),
            name: z.string(),
            status: z.string(),
            completed: z.boolean(),
            active: z.boolean(),
            duration: z.number().optional(),
            error: z.string().optional(),
          })),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Simuler la récupération d'un job spécifique
        const job = {
          id,
          workflowId: '1',
          name: 'Génération Brief Nike',
          description: 'Génération du brief pour la campagne Nike Air Max',
          status: 'running',
          priority: 'high',
          progress: 65,
          steps: [
            { id: '1', name: 'Génération Brief', status: 'completed', completed: true, active: false, duration: 2500 },
            { id: '2', name: 'Évaluation Brief', status: 'completed', completed: true, active: false, duration: 1800 },
            { id: '3', name: 'Optimisation Prompts', status: 'running', completed: false, active: true },
            { id: '4', name: 'Génération Images', status: 'pending', completed: false, active: false },
            { id: '5', name: 'Animation Vidéo', status: 'pending', completed: false, active: false },
            { id: '6', name: 'Montage Final', status: 'pending', completed: false, active: false },
          ],
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T11:45:00Z',
        }
        
        return reply.send(job)
      } catch (error) {
        fastify.log.error('Error fetching job:', error)
        return reply.status(500).send({ error: 'Failed to fetch job' })
      }
    },
  })

  // Mettre à jour un job
  fastify.put('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      body: UpdateJobSchema,
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          priority: z.string(),
          updatedAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const updates = request.body as z.infer<typeof UpdateJobSchema>
        
        // Simuler la mise à jour du job
        const updatedJob = {
          id,
          name: updates.name || 'Génération Brief Nike',
          description: updates.description || 'Génération du brief pour la campagne Nike Air Max',
          status: updates.status || 'running',
          priority: updates.priority || 'high',
          updatedAt: new Date().toISOString(),
        }
        
        fastify.log.info(`Job updated: ${id}`)
        
        return reply.send(updatedJob)
      } catch (error) {
        fastify.log.error('Error updating job:', error)
        return reply.status(500).send({ error: 'Failed to update job' })
      }
    },
  })

  // Supprimer un job
  fastify.delete('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        204: z.object({}),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Simuler la suppression du job
        fastify.log.info(`Job deleted: ${id}`)
        
        return reply.status(204).send()
      } catch (error) {
        fastify.log.error('Error deleting job:', error)
        return reply.status(500).send({ error: 'Failed to delete job' })
      }
    },
  })

  // Obtenir les logs d'un job
  fastify.get('/:id/logs', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          logs: z.array(z.object({
            timestamp: z.string(),
            level: z.string(),
            message: z.string(),
            metadata: z.record(z.any()).optional(),
          })),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Simuler les logs du job
        const logs = [
          {
            timestamp: '2025-01-15T10:30:00Z',
            level: 'info',
            message: 'Job started',
            metadata: { workflowId: '1', priority: 'high' },
          },
          {
            timestamp: '2025-01-15T10:30:05Z',
            level: 'info',
            message: 'Brief generation completed',
            metadata: { duration: 2500, quality: 9.2 },
          },
          {
            timestamp: '2025-01-15T10:30:10Z',
            level: 'info',
            message: 'Brief evaluation started',
            metadata: { evaluator: 'brief-judge' },
          },
          {
            timestamp: '2025-01-15T10:30:15Z',
            level: 'info',
            message: 'Brief evaluation completed',
            metadata: { duration: 1800, score: 8.7 },
          },
          {
            timestamp: '2025-01-15T10:30:20Z',
            level: 'info',
            message: 'Prompt optimization started',
            metadata: { optimizer: 'prompt-smith' },
          },
        ]
        
        return reply.send({ logs })
      } catch (error) {
        fastify.log.error('Error fetching job logs:', error)
        return reply.status(500).send({ error: 'Failed to fetch job logs' })
      }
    },
  })
}