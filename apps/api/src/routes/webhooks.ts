import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { SlackService } from '../services/slack'
import { NotionService } from '../services/notion'
import { logger } from '../lib/logger'

const SlackEventSchema = z.object({
  type: z.string(),
  event: z.object({
    type: z.string(),
    text: z.string().optional(),
    user: z.string().optional(),
    channel: z.string().optional(),
  }).optional(),
  challenge: z.string().optional(),
})

const NotionEventSchema = z.object({
  object: z.string(),
  entry: z.array(z.object({
    id: z.string(),
    object: z.string(),
  })),
})

export async function webhookRoutes(fastify: FastifyInstance) {
  const slackService = new SlackService()
  const notionService = new NotionService()

  // Slack webhook
  fastify.post('/slack', {
    schema: {
      body: SlackEventSchema,
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof SlackEventSchema> }>, reply: FastifyReply) => {
    try {
      const { type, event, challenge } = request.body

      // URL verification challenge
      if (type === 'url_verification' && challenge) {
        return reply.send({ challenge })
      }

      // Handle Slack events
      if (type === 'event_callback' && event) {
        await slackService.handleEvent(event)
        logger.info('Slack event processed', { eventType: event.type })
      }

      reply.send({ success: true })
    } catch (error) {
      logger.error('Failed to process Slack webhook:', error)
      reply.status(500).send({ error: 'Failed to process webhook' })
    }
  })

  // Notion webhook
  fastify.post('/notion', {
    schema: {
      body: NotionEventSchema,
    },
  }, async (request: FastifyRequest<{ Body: z.infer<typeof NotionEventSchema> }>, reply: FastifyReply) => {
    try {
      const { object, entry } = request.body

      if (object === 'page' && entry.length > 0) {
        for (const page of entry) {
          await notionService.handlePageUpdate(page.id)
          logger.info('Notion page update processed', { pageId: page.id })
        }
      }

      reply.send({ success: true })
    } catch (error) {
      logger.error('Failed to process Notion webhook:', error)
      reply.status(500).send({ error: 'Failed to process webhook' })
    }
  })

  // Slack slash commands
  fastify.post('/slack/commands', {
    schema: {
      body: z.object({
        command: z.string(),
        text: z.string().optional(),
        user_id: z.string(),
        channel_id: z.string(),
        response_url: z.string(),
      }),
    },
  }, async (request: FastifyRequest<{ 
    Body: {
      command: string;
      text?: string;
      user_id: string;
      channel_id: string;
      response_url: string;
    }
  }>, reply: FastifyReply) => {
    try {
      const { command, text, user_id, channel_id, response_url } = request.body

      let response

      switch (command) {
        case '/ads':
          response = await slackService.handleAdsCommand(text, user_id, channel_id)
          break
        case '/brief':
          response = await slackService.handleBriefCommand(text, user_id, channel_id)
          break
        case '/approve':
          response = await slackService.handleApproveCommand(text, user_id, channel_id)
          break
        default:
          response = {
            text: 'Commande non reconnue',
            response_type: 'ephemeral',
          }
      }

      reply.send(response)
    } catch (error) {
      logger.error('Failed to process Slack command:', error)
      reply.status(500).send({ 
        text: 'Erreur lors du traitement de la commande',
        response_type: 'ephemeral',
      })
    }
  })

  // Slack interactive components
  fastify.post('/slack/interactive', {
    schema: {
      body: z.object({
        payload: z.string(),
      }),
    },
  }, async (request: FastifyRequest<{ Body: { payload: string } }>, reply: FastifyReply) => {
    try {
      const payload = JSON.parse(request.body.payload)
      
      const response = await slackService.handleInteractiveComponent(payload)
      
      reply.send(response)
    } catch (error) {
      logger.error('Failed to process Slack interactive component:', error)
      reply.status(500).send({ 
        text: 'Erreur lors du traitement du composant interactif',
        response_type: 'ephemeral',
      })
    }
  })
}
