import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { WorkflowOrchestratorV1 } from '../../../packages/agents/src/orchestrator-v1'

const workflowOrchestrator = new WorkflowOrchestratorV1()

const CreateWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  input: z.string().min(1),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
})

const UpdateWorkflowSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'running', 'paused', 'completed', 'failed']).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function workflowRoutes(fastify: FastifyInstance) {
  // Créer un nouveau workflow
  fastify.post('/', {
    schema: {
      body: CreateWorkflowSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          createdAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const workflowData = request.body as z.infer<typeof CreateWorkflowSchema>
        
        // Créer le workflow
        const workflow = {
          id: Date.now().toString(),
          name: workflowData.name,
          description: workflowData.description || '',
          status: 'pending',
          createdAt: new Date().toISOString(),
          tags: workflowData.tags || [],
          metadata: workflowData.metadata || {},
        }
        
        // Démarrer l'exécution du workflow
        const initialState = {
          jobId: workflow.id,
          input: workflowData.input,
          status: 'pending' as const,
          currentStep: null,
          results: {},
          errors: {},
          metadata: workflow.metadata,
          interruptPoints: [],
          humanApproval: false,
          retryCount: 0,
          chatHistory: [],
        }
        
        // Exécuter le workflow en arrière-plan
        workflowOrchestrator.executeWorkflow(initialState)
          .then((result) => {
            fastify.log.info(`Workflow ${workflow.id} completed:`, result)
          })
          .catch((error) => {
            fastify.log.error(`Workflow ${workflow.id} failed:`, error)
          })
        
        return reply.status(201).send(workflow)
      } catch (error) {
        fastify.log.error('Error creating workflow:', error)
        return reply.status(500).send({ error: 'Failed to create workflow' })
      }
    },
  })

  // Obtenir tous les workflows
  fastify.get('/', {
    schema: {
      response: {
        200: z.object({
          workflows: z.array(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            status: z.string(),
            progress: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
          })),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        // Simuler la récupération des workflows depuis la base de données
        const workflows = [
          {
            id: '1',
            name: 'Campagne Nike Air Max',
            description: 'Création de publicités pour la nouvelle collection Nike Air Max',
            status: 'running',
            progress: 65,
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-01-15T11:45:00Z',
          },
          {
            id: '2',
            name: 'Publicité iPhone 15',
            description: 'Création de publicités pour le nouvel iPhone 15',
            status: 'completed',
            progress: 100,
            createdAt: '2025-01-14T09:15:00Z',
            updatedAt: '2025-01-14T16:30:00Z',
          },
        ]
        
        return reply.send({ workflows })
      } catch (error) {
        fastify.log.error('Error fetching workflows:', error)
        return reply.status(500).send({ error: 'Failed to fetch workflows' })
      }
    },
  })

  // Obtenir un workflow spécifique
  fastify.get('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          progress: z.number(),
          steps: z.array(z.object({
            id: z.string(),
            name: z.string(),
            status: z.string(),
            completed: z.boolean(),
            active: z.boolean(),
          })),
          createdAt: z.string(),
          updatedAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Simuler la récupération d'un workflow spécifique
        const workflow = {
          id,
          name: 'Campagne Nike Air Max',
          description: 'Création de publicités pour la nouvelle collection Nike Air Max',
          status: 'running',
          progress: 65,
          steps: [
            { id: '1', name: 'Génération Brief', status: 'completed', completed: true, active: false },
            { id: '2', name: 'Évaluation Brief', status: 'completed', completed: true, active: false },
            { id: '3', name: 'Optimisation Prompts', status: 'running', completed: false, active: true },
            { id: '4', name: 'Génération Images', status: 'pending', completed: false, active: false },
            { id: '5', name: 'Animation Vidéo', status: 'pending', completed: false, active: false },
            { id: '6', name: 'Montage Final', status: 'pending', completed: false, active: false },
          ],
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T11:45:00Z',
        }
        
        return reply.send(workflow)
      } catch (error) {
        fastify.log.error('Error fetching workflow:', error)
        return reply.status(500).send({ error: 'Failed to fetch workflow' })
      }
    },
  })

  // Mettre à jour un workflow
  fastify.put('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      body: UpdateWorkflowSchema,
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string().optional(),
          status: z.string(),
          updatedAt: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        const updates = request.body as z.infer<typeof UpdateWorkflowSchema>
        
        // Simuler la mise à jour du workflow
        const updatedWorkflow = {
          id,
          name: updates.name || 'Campagne Nike Air Max',
          description: updates.description || 'Création de publicités pour la nouvelle collection Nike Air Max',
          status: updates.status || 'running',
          updatedAt: new Date().toISOString(),
        }
        
        return reply.send(updatedWorkflow)
      } catch (error) {
        fastify.log.error('Error updating workflow:', error)
        return reply.status(500).send({ error: 'Failed to update workflow' })
      }
    },
  })

  // Supprimer un workflow
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
        
        // Simuler la suppression du workflow
        fastify.log.info(`Workflow ${id} deleted`)
        
        return reply.status(204).send()
      } catch (error) {
        fastify.log.error('Error deleting workflow:', error)
        return reply.status(500).send({ error: 'Failed to delete workflow' })
      }
    },
  })

  // Démarrer un workflow
  fastify.post('/:id/start', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          status: z.string(),
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Démarrer le workflow
        fastify.log.info(`Starting workflow ${id}`)
        
        return reply.send({
          id,
          status: 'running',
          message: 'Workflow started successfully',
        })
      } catch (error) {
        fastify.log.error('Error starting workflow:', error)
        return reply.status(500).send({ error: 'Failed to start workflow' })
      }
    },
  })

  // Pause un workflow
  fastify.post('/:id/pause', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          status: z.string(),
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Pause le workflow
        fastify.log.info(`Pausing workflow ${id}`)
        
        return reply.send({
          id,
          status: 'paused',
          message: 'Workflow paused successfully',
        })
      } catch (error) {
        fastify.log.error('Error pausing workflow:', error)
        return reply.status(500).send({ error: 'Failed to pause workflow' })
      }
    },
  })

  // Arrêter un workflow
  fastify.post('/:id/stop', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          status: z.string(),
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string }
        
        // Arrêter le workflow
        fastify.log.info(`Stopping workflow ${id}`)
        
        return reply.send({
          id,
          status: 'stopped',
          message: 'Workflow stopped successfully',
        })
      } catch (error) {
        fastify.log.error('Error stopping workflow:', error)
        return reply.status(500).send({ error: 'Failed to stop workflow' })
      }
    },
  })
}