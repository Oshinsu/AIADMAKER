/**
 * AGENT COMMUNICATION HUB - SOTA OCTOBRE 2025
 * Système de communication entre agents avec message passing et event-driven architecture
 */

import { EventEmitter } from 'events'
import { z } from 'zod'
import { logger } from '../../connectors/src/lib/logger'

const AgentMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: z.enum(['data', 'command', 'status', 'error', 'result', 'request', 'response']),
  payload: z.any(),
  timestamp: z.string(),
  correlationId: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  ttl: z.number().default(300000), // 5 minutes
  retryCount: z.number().default(0),
  maxRetries: z.number().default(3),
})

const AgentStatusSchema = z.object({
  agentId: z.string(),
  status: z.enum(['idle', 'busy', 'error', 'offline']),
  lastActivity: z.string(),
  currentTask: z.string().optional(),
  performance: z.object({
    tasksCompleted: z.number(),
    averageTime: z.number(),
    successRate: z.number(),
    errorRate: z.number(),
  }),
  health: z.object({
    cpu: z.number(),
    memory: z.number(),
    uptime: z.number(),
  }),
})

const WorkflowEventSchema = z.object({
  id: z.string(),
  type: z.enum(['workflow.start', 'workflow.step.start', 'workflow.step.complete', 'workflow.step.error', 'workflow.complete', 'workflow.fail']),
  workflowId: z.string(),
  stepId: z.string().optional(),
  agentId: z.string().optional(),
  data: z.any(),
  timestamp: z.string(),
})

export class AgentCommunicationHub {
  private eventBus: EventEmitter
  private agents: Map<string, any>
  private messageQueue: Array<z.infer<typeof AgentMessageSchema>>
  private agentStatuses: Map<string, z.infer<typeof AgentStatusSchema>>
  private workflowEvents: Array<z.infer<typeof WorkflowEventSchema>>
  private messageHistory: Array<z.infer<typeof AgentMessageSchema>>
  private isRunning: boolean

  constructor() {
    this.eventBus = new EventEmitter()
    this.agents = new Map()
    this.messageQueue = []
    this.agentStatuses = new Map()
    this.workflowEvents = []
    this.messageHistory = []
    this.isRunning = false

    this.setupEventHandlers()
    this.startMessageProcessor()
  }

  private setupEventHandlers() {
    // Gestion des messages entre agents
    this.eventBus.on('agent.message', this.handleAgentMessage.bind(this))
    this.eventBus.on('agent.broadcast', this.handleBroadcast.bind(this))
    this.eventBus.on('agent.status', this.handleAgentStatus.bind(this))
    
    // Gestion des événements de workflow
    this.eventBus.on('workflow.start', this.handleWorkflowStart.bind(this))
    this.eventBus.on('workflow.step.start', this.handleWorkflowStepStart.bind(this))
    this.eventBus.on('workflow.step.complete', this.handleWorkflowStepComplete.bind(this))
    this.eventBus.on('workflow.step.error', this.handleWorkflowStepError.bind(this))
    this.eventBus.on('workflow.complete', this.handleWorkflowComplete.bind(this))
    this.eventBus.on('workflow.fail', this.handleWorkflowFail.bind(this))
  }

  private startMessageProcessor() {
    this.isRunning = true
    this.processMessageQueue()
  }

  private async processMessageQueue() {
    while (this.isRunning) {
      if (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()
        if (message) {
          await this.deliverMessage(message)
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100)) // 100ms delay
    }
  }

  // Méthodes de communication entre agents
  async sendMessage(message: Omit<z.infer<typeof AgentMessageSchema>, 'id' | 'timestamp'>): Promise<void> {
    try {
      const fullMessage: z.infer<typeof AgentMessageSchema> = {
        ...message,
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
      }

      this.messageQueue.push(fullMessage)
      this.messageHistory.push(fullMessage)

      logger.info('Message queued for delivery', {
        messageId: fullMessage.id,
        from: fullMessage.from,
        to: fullMessage.to,
        type: fullMessage.type
      })

    } catch (error) {
      logger.error('Failed to send message:', error)
      throw new Error(`Échec de l'envoi du message: ${error.message}`)
    }
  }

  async broadcast(message: Omit<z.infer<typeof AgentMessageSchema>, 'to'>): Promise<void> {
    try {
      const agentIds = Array.from(this.agents.keys())
      
      for (const agentId of agentIds) {
        await this.sendMessage({
          ...message,
          to: agentId
        })
      }

      logger.info('Message broadcasted to all agents', {
        from: message.from,
        type: message.type,
        recipients: agentIds.length
      })

    } catch (error) {
      logger.error('Failed to broadcast message:', error)
      throw new Error(`Échec de la diffusion du message: ${error.message}`)
    }
  }

  private async deliverMessage(message: z.infer<typeof AgentMessageSchema>): Promise<void> {
    try {
      const targetAgent = this.agents.get(message.to)
      
      if (!targetAgent) {
        logger.warn('Target agent not found', { agentId: message.to })
        return
      }

      // Vérification de la santé de l'agent
      const agentStatus = this.agentStatuses.get(message.to)
      if (agentStatus?.status === 'offline') {
        logger.warn('Target agent is offline', { agentId: message.to })
        return
      }

      // Livraison du message
      await targetAgent.receiveMessage(message)
      
      logger.info('Message delivered successfully', {
        messageId: message.id,
        to: message.to,
        type: message.type
      })

    } catch (error) {
      logger.error('Failed to deliver message:', error)
      
      // Retry logic
      if (message.retryCount < message.maxRetries) {
        message.retryCount++
        this.messageQueue.push(message)
        
        logger.info('Message queued for retry', {
          messageId: message.id,
          retryCount: message.retryCount
        })
      } else {
        logger.error('Message delivery failed permanently', {
          messageId: message.id,
          maxRetries: message.maxRetries
        })
      }
    }
  }

  // Gestion des événements de workflow
  async emitWorkflowEvent(event: Omit<z.infer<typeof WorkflowEventSchema>, 'id' | 'timestamp'>): Promise<void> {
    try {
      const fullEvent: z.infer<typeof WorkflowEventSchema> = {
        ...event,
        id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
      }

      this.workflowEvents.push(fullEvent)
      this.eventBus.emit(event.type, fullEvent)

      logger.info('Workflow event emitted', {
        eventId: fullEvent.id,
        type: fullEvent.type,
        workflowId: fullEvent.workflowId
      })

    } catch (error) {
      logger.error('Failed to emit workflow event:', error)
      throw new Error(`Échec de l'émission de l'événement: ${error.message}`)
    }
  }

  // Gestion des statuts des agents
  async updateAgentStatus(agentId: string, status: Partial<z.infer<typeof AgentStatusSchema>>): Promise<void> {
    try {
      const currentStatus = this.agentStatuses.get(agentId) || {
        agentId,
        status: 'idle',
        lastActivity: new Date().toISOString(),
        performance: {
          tasksCompleted: 0,
          averageTime: 0,
          successRate: 0,
          errorRate: 0,
        },
        health: {
          cpu: 0,
          memory: 0,
          uptime: 0,
        },
      }

      const updatedStatus = { ...currentStatus, ...status }
      this.agentStatuses.set(agentId, updatedStatus)

      this.eventBus.emit('agent.status', updatedStatus)

      logger.info('Agent status updated', {
        agentId,
        status: updatedStatus.status,
        lastActivity: updatedStatus.lastActivity
      })

    } catch (error) {
      logger.error('Failed to update agent status:', error)
      throw new Error(`Échec de la mise à jour du statut: ${error.message}`)
    }
  }

  // Handlers d'événements
  private async handleAgentMessage(message: z.infer<typeof AgentMessageSchema>) {
    logger.info('Agent message received', {
      messageId: message.id,
      from: message.from,
      to: message.to,
      type: message.type
    })
  }

  private async handleBroadcast(message: z.infer<typeof AgentMessageSchema>) {
    logger.info('Broadcast message received', {
      messageId: message.id,
      from: message.from,
      type: message.type
    })
  }

  private async handleAgentStatus(status: z.infer<typeof AgentStatusSchema>) {
    logger.info('Agent status received', {
      agentId: status.agentId,
      status: status.status,
      lastActivity: status.lastActivity
    })
  }

  private async handleWorkflowStart(event: z.infer<typeof WorkflowEventSchema>) {
    logger.info('Workflow started', {
      eventId: event.id,
      workflowId: event.workflowId
    })
  }

  private async handleWorkflowStepStart(event: z.infer<typeof WorkflowEventSchema>) {
    logger.info('Workflow step started', {
      eventId: event.id,
      workflowId: event.workflowId,
      stepId: event.stepId,
      agentId: event.agentId
    })
  }

  private async handleWorkflowStepComplete(event: z.infer<typeof WorkflowEventSchema>) {
    logger.info('Workflow step completed', {
      eventId: event.id,
      workflowId: event.workflowId,
      stepId: event.stepId,
      agentId: event.agentId
    })
  }

  private async handleWorkflowStepError(event: z.infer<typeof WorkflowEventSchema>) {
    logger.error('Workflow step failed', {
      eventId: event.id,
      workflowId: event.workflowId,
      stepId: event.stepId,
      agentId: event.agentId,
      error: event.data
    })
  }

  private async handleWorkflowComplete(event: z.infer<typeof WorkflowEventSchema>) {
    logger.info('Workflow completed', {
      eventId: event.id,
      workflowId: event.workflowId
    })
  }

  private async handleWorkflowFail(event: z.infer<typeof WorkflowEventSchema>) {
    logger.error('Workflow failed', {
      eventId: event.id,
      workflowId: event.workflowId,
      error: event.data
    })
  }

  // Méthodes utilitaires
  async registerAgent(agentId: string, agent: any): Promise<void> {
    this.agents.set(agentId, agent)
    await this.updateAgentStatus(agentId, {
      status: 'idle',
      lastActivity: new Date().toISOString()
    })

    logger.info('Agent registered', { agentId })
  }

  async unregisterAgent(agentId: string): Promise<void> {
    this.agents.delete(agentId)
    this.agentStatuses.delete(agentId)

    logger.info('Agent unregistered', { agentId })
  }

  async getAgentStatus(agentId: string): Promise<z.infer<typeof AgentStatusSchema> | null> {
    return this.agentStatuses.get(agentId) || null
  }

  async getAllAgentStatuses(): Promise<z.infer<typeof AgentStatusSchema>[]> {
    return Array.from(this.agentStatuses.values())
  }

  async getMessageHistory(agentId?: string): Promise<z.infer<typeof AgentMessageSchema>[]> {
    if (agentId) {
      return this.messageHistory.filter(msg => msg.from === agentId || msg.to === agentId)
    }
    return this.messageHistory
  }

  async getWorkflowEvents(workflowId?: string): Promise<z.infer<typeof WorkflowEventSchema>[]> {
    if (workflowId) {
      return this.workflowEvents.filter(event => event.workflowId === workflowId)
    }
    return this.workflowEvents
  }

  async getPerformanceMetrics(): Promise<{
    totalMessages: number
    averageDeliveryTime: number
    successRate: number
    activeAgents: number
    totalWorkflows: number
  }> {
    const totalMessages = this.messageHistory.length
    const successfulMessages = this.messageHistory.filter(msg => msg.retryCount === 0).length
    const successRate = (successfulMessages / totalMessages) * 100
    const activeAgents = Array.from(this.agentStatuses.values()).filter(status => status.status !== 'offline').length
    const totalWorkflows = new Set(this.workflowEvents.map(event => event.workflowId)).size

    return {
      totalMessages,
      averageDeliveryTime: 0, // TODO: Calculate based on message timestamps
      successRate,
      activeAgents,
      totalWorkflows
    }
  }

  async stop(): Promise<void> {
    this.isRunning = false
    this.eventBus.removeAllListeners()
    
    logger.info('Agent Communication Hub stopped')
  }
}
