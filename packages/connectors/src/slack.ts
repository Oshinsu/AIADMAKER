import { App } from '@slack/bolt'
import { logger } from '../lib/logger'

export class SlackService {
  private app: App

  constructor() {
    this.app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      appToken: process.env.SLACK_APP_TOKEN,
      socketMode: true,
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // Slash commands
    this.app.command('/ads', async ({ command, ack, respond }) => {
      await ack()
      await this.handleAdsCommand(command.text, command.user_id, command.channel_id)
    })

    this.app.command('/brief', async ({ command, ack, respond }) => {
      await ack()
      await this.handleBriefCommand(command.text, command.user_id, command.channel_id)
    })

    this.app.command('/approve', async ({ command, ack, respond }) => {
      await ack()
      await this.handleApproveCommand(command.text, command.user_id, command.channel_id)
    })

    // Interactive components
    this.app.action('approve_job', async ({ ack, body, respond }) => {
      await ack()
      await this.handleJobApproval(body, true)
    })

    this.app.action('reject_job', async ({ ack, body, respond }) => {
      await ack()
      await this.handleJobApproval(body, false)
    })
  }

  async handleEvent(event: any) {
    try {
      switch (event.type) {
        case 'app_mention':
          await this.handleAppMention(event)
          break
        case 'message':
          if (event.text?.includes('@ai-ad-maker')) {
            await this.handleDirectMessage(event)
          }
          break
        default:
          logger.info('Unhandled Slack event', { type: event.type })
      }
    } catch (error) {
      logger.error('Error handling Slack event:', error)
    }
  }

  async handleAdsCommand(text: string, userId: string, channelId: string) {
    try {
      const [action, ...args] = text.split(' ')
      
      switch (action) {
        case 'new':
          return await this.createNewAd(args.join(' '), userId, channelId)
        case 'status':
          return await this.getAdStatus(args[0], userId, channelId)
        case 'list':
          return await this.listAds(userId, channelId)
        default:
          return {
            text: 'Commande non reconnue. Utilisez: `/ads new`, `/ads status <id>`, `/ads list`',
            response_type: 'ephemeral',
          }
      }
    } catch (error) {
      logger.error('Error handling /ads command:', error)
      return {
        text: 'Erreur lors du traitement de la commande',
        response_type: 'ephemeral',
      }
    }
  }

  async handleBriefCommand(text: string, userId: string, channelId: string) {
    try {
      // Parse brief parameters from text
      const params = this.parseBriefParams(text)
      
      // Create brief generation job
      const jobId = await this.createBriefJob(params, userId)
      
      return {
        text: `Brief en cours de génération...\nJob ID: ${jobId}\nJe vous notifierai dès que c'est prêt !`,
        response_type: 'in_channel',
      }
    } catch (error) {
      logger.error('Error handling /brief command:', error)
      return {
        text: 'Erreur lors de la génération du brief',
        response_type: 'ephemeral',
      }
    }
  }

  async handleApproveCommand(text: string, userId: string, channelId: string) {
    try {
      const jobId = text.trim()
      
      if (!jobId) {
        return {
          text: 'Usage: `/approve <job_id>`',
          response_type: 'ephemeral',
        }
      }

      // Process approval
      await this.processApproval(jobId, userId, true)
      
      return {
        text: `Job ${jobId} approuvé !`,
        response_type: 'in_channel',
      }
    } catch (error) {
      logger.error('Error handling /approve command:', error)
      return {
        text: 'Erreur lors de l\'approbation',
        response_type: 'ephemeral',
      }
    }
  }

  async handleInteractiveComponent(payload: any) {
    try {
      const { type, actions, user, channel } = payload
      
      if (type === 'block_actions') {
        for (const action of actions) {
          switch (action.action_id) {
            case 'approve_job':
              await this.processApproval(action.value, user.id, true)
              break
            case 'reject_job':
              await this.processApproval(action.value, user.id, false)
              break
          }
        }
      }
      
      return {
        text: 'Action traitée avec succès',
        response_type: 'ephemeral',
      }
    } catch (error) {
      logger.error('Error handling interactive component:', error)
      return {
        text: 'Erreur lors du traitement de l\'action',
        response_type: 'ephemeral',
      }
    }
  }

  private async createNewAd(description: string, userId: string, channelId: string) {
    // Create new ad campaign
    const campaign = {
      description,
      userId,
      channelId,
      status: 'draft',
    }

    // TODO: Save to database and start workflow
    
    return {
      text: `Nouvelle campagne créée !\nDescription: ${description}\nStatus: Draft`,
      response_type: 'in_channel',
    }
  }

  private async getAdStatus(jobId: string, userId: string, channelId: string) {
    // TODO: Get job status from database
    
    return {
      text: `Status du job ${jobId}: En cours...`,
      response_type: 'ephemeral',
    }
  }

  private async listAds(userId: string, channelId: string) {
    // TODO: Get user's ads from database
    
    return {
      text: 'Vos campagnes récentes:\n• Campagne 1 - En cours\n• Campagne 2 - Terminée',
      response_type: 'ephemeral',
    }
  }

  private parseBriefParams(text: string) {
    // Simple parsing - in production, use a more robust parser
    const params: any = {}
    
    const lines = text.split('\n')
    for (const line of lines) {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim()
        params[key.trim().toLowerCase()] = value
      }
    }
    
    return params
  }

  private async createBriefJob(params: any, userId: string) {
    // TODO: Create job in database and start brief generation
    return `job_${Date.now()}`
  }

  private async processApproval(jobId: string, userId: string, approved: boolean) {
    // TODO: Update job approval status in database
    logger.info('Job approval processed', { jobId, userId, approved })
  }

  private async handleJobApproval(body: any, approved: boolean) {
    // TODO: Handle job approval logic
  }

  private async handleAppMention(event: any) {
    // TODO: Handle @ai-ad-maker mentions
  }

  private async handleDirectMessage(event: any) {
    // TODO: Handle direct messages to the bot
  }

  async start() {
    await this.app.start(process.env.PORT || 3000)
    logger.info('Slack app started')
  }
}
