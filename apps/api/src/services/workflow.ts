import { getDatabase } from '../lib/database'
import { WorkflowOrchestrator } from '@ai-ad-maker/agents'
import { logger } from '../lib/logger'

export class WorkflowService {
  private db = getDatabase()
  private orchestrator = new WorkflowOrchestrator()

  async createWorkflow(data: {
    name: string
    description?: string
    nodes: any[]
    edges: any[]
  }) {
    const workflow = await this.db.workflow.create({
      data: {
        name: data.name,
        description: data.description,
        nodes: data.nodes,
        edges: data.edges,
        status: 'DRAFT',
        userId: 'system', // TODO: Get from auth context
      },
    })

    return {
      id: workflow.id,
      name: workflow.name,
      status: workflow.status,
      createdAt: workflow.createdAt,
    }
  }

  async getWorkflow(id: string) {
    return await this.db.workflow.findUnique({
      where: { id },
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
  }

  async listWorkflows(options: {
    limit: number
    offset: number
    status?: string
  }) {
    const where = options.status ? { status: options.status as any } : {}
    
    const [workflows, total] = await Promise.all([
      this.db.workflow.findMany({
        where,
        skip: options.offset,
        take: options.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { jobs: true },
          },
        },
      }),
      this.db.workflow.count({ where }),
    ])

    return {
      workflows,
      total,
      limit: options.limit,
      offset: options.offset,
    }
  }

  async updateWorkflow(id: string, data: Partial<{
    name: string
    description: string
    nodes: any[]
    edges: any[]
  }>) {
    return await this.db.workflow.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })
  }

  async deleteWorkflow(id: string) {
    return await this.db.workflow.delete({
      where: { id },
    })
  }

  async runWorkflow(data: {
    workflowId: string
    inputs?: Record<string, any>
    priority?: 'low' | 'normal' | 'high'
  }) {
    const workflow = await this.getWorkflow(data.workflowId)
    if (!workflow) {
      throw new Error('Workflow not found')
    }

    // Create job record
    const job = await this.db.job.create({
      data: {
        workflowId: data.workflowId,
        status: 'PENDING',
        priority: data.priority?.toUpperCase() as any || 'NORMAL',
        inputs: data.inputs || {},
        userId: 'system', // TODO: Get from auth context
      },
    })

    // Start workflow execution asynchronously
    this.executeWorkflowAsync(job.id, workflow, data.inputs || {})

    return {
      jobId: job.id,
      status: 'pending',
      estimatedDuration: this.estimateDuration(workflow.nodes),
    }
  }

  private async executeWorkflowAsync(jobId: string, workflow: any, inputs: Record<string, any>) {
    try {
      // Update job status
      await this.db.job.update({
        where: { id: jobId },
        data: { 
          status: 'RUNNING',
          startedAt: new Date(),
        },
      })

      // Execute workflow
      const initialState = {
        jobId,
        status: 'running' as const,
        currentStep: null,
        results: {},
        errors: {},
        metadata: { inputs },
      }

      const result = await this.orchestrator.executeWorkflow(initialState)

      // Update job with results
      await this.db.job.update({
        where: { id: jobId },
        data: {
          status: result.status === 'completed' ? 'COMPLETED' : 'FAILED',
          results: result.results,
          logs: Object.values(result.errors),
          completedAt: new Date(),
        },
      })

      logger.info('Workflow execution completed', { jobId, status: result.status })
    } catch (error) {
      logger.error('Workflow execution failed', { jobId, error: error.message })
      
      await this.db.job.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          error: error.message,
          completedAt: new Date(),
        },
      })
    }
  }

  private estimateDuration(nodes: any[]): number {
    // Rough estimation based on node types
    const nodeDurations: Record<string, number> = {
      'brief-gen': 30,
      'brief-judge': 15,
      'prompt-smith': 20,
      'image-artisan': 120,
      'animator': 180,
      'editor': 60,
      'music-gen': 90,
      'voice-gen': 30,
      'spec-check': 15,
      'compliance': 30,
    }

    return nodes.reduce((total, node) => {
      return total + (nodeDurations[node.type] || 30)
    }, 0)
  }
}
