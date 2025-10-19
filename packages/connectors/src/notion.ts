import { Client } from '@notionhq/client'
import { logger } from '../lib/logger'

export class NotionService {
  private client: Client

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_API_KEY,
    })
  }

  async handlePageUpdate(pageId: string) {
    try {
      const page = await this.client.pages.retrieve({ page_id: pageId })
      
      // Check if it's a brief page
      if (this.isBriefPage(page)) {
        await this.processBriefUpdate(page)
      }
      
      // Check if it's a job page
      if (this.isJobPage(page)) {
        await this.processJobUpdate(page)
      }
      
      logger.info('Notion page update processed', { pageId })
    } catch (error) {
      logger.error('Error processing Notion page update:', error)
    }
  }

  private isBriefPage(page: any): boolean {
    return page.properties?.Type?.select?.name === 'Brief'
  }

  private isJobPage(page: any): boolean {
    return page.properties?.Type?.select?.name === 'Job'
  }

  private async processBriefUpdate(page: any) {
    try {
      const briefData = this.extractBriefData(page)
      
      // Update brief in database
      // TODO: Update database with brief data
      
      logger.info('Brief updated', { pageId: page.id, briefData })
    } catch (error) {
      logger.error('Error processing brief update:', error)
    }
  }

  private async processJobUpdate(page: any) {
    try {
      const jobData = this.extractJobData(page)
      
      // Update job in database
      // TODO: Update database with job data
      
      logger.info('Job updated', { pageId: page.id, jobData })
    } catch (error) {
      logger.error('Error processing job update:', error)
    }
  }

  private extractBriefData(page: any) {
    const properties = page.properties
    
    return {
      id: page.id,
      title: properties.Title?.title?.[0]?.text?.content || '',
      objective: properties.Objective?.rich_text?.[0]?.text?.content || '',
      audience: properties.Audience?.rich_text?.[0]?.text?.content || '',
      keyMessage: properties['Key Message']?.rich_text?.[0]?.text?.content || '',
      callToAction: properties['Call to Action']?.rich_text?.[0]?.text?.content || '',
      constraints: this.extractMultiSelect(properties.Constraints),
      formats: this.extractMultiSelect(properties.Formats),
      budget: properties.Budget?.number || null,
      timeline: properties.Timeline?.rich_text?.[0]?.text?.content || '',
      status: properties.Status?.select?.name || 'Draft',
      score: properties.Score?.number || null,
    }
  }

  private extractJobData(page: any) {
    const properties = page.properties
    
    return {
      id: page.id,
      workflowId: properties.Workflow?.relation?.[0]?.id || '',
      status: properties.Status?.select?.name || 'Pending',
      priority: properties.Priority?.select?.name || 'Normal',
      progress: properties.Progress?.number || 0,
      startedAt: properties['Started At']?.date?.start || null,
      completedAt: properties['Completed At']?.date?.start || null,
      error: properties.Error?.rich_text?.[0]?.text?.content || null,
    }
  }

  private extractMultiSelect(property: any): string[] {
    if (!property?.multi_select) return []
    return property.multi_select.map((item: any) => item.name)
  }

  async createBrief(briefData: any) {
    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_BRIEFS!,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: briefData.title,
                },
              },
            ],
          },
          Objective: {
            rich_text: [
              {
                text: {
                  content: briefData.objective,
                },
              },
            ],
          },
          Audience: {
            rich_text: [
              {
                text: {
                  content: briefData.audience,
                },
              },
            ],
          },
          'Key Message': {
            rich_text: [
              {
                text: {
                  content: briefData.keyMessage,
                },
              },
            ],
          },
          'Call to Action': {
            rich_text: [
              {
                text: {
                  content: briefData.callToAction,
                },
              },
            ],
          },
          Constraints: {
            multi_select: briefData.constraints.map((constraint: string) => ({
              name: constraint,
            })),
          },
          Formats: {
            multi_select: briefData.formats.map((format: string) => ({
              name: format,
            })),
          },
          Status: {
            select: {
              name: 'Draft',
            },
          },
        },
      })

      logger.info('Brief created in Notion', { briefId: response.id })
      return response
    } catch (error) {
      logger.error('Error creating brief in Notion:', error)
      throw error
    }
  }

  async createJob(jobData: any) {
    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_JOBS!,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: `Job ${jobData.id}`,
                },
              },
            ],
          },
          Workflow: {
            relation: [
              {
                id: jobData.workflowId,
              },
            ],
          },
          Status: {
            select: {
              name: jobData.status,
            },
          },
          Priority: {
            select: {
              name: jobData.priority,
            },
          },
          Progress: {
            number: 0,
          },
        },
      })

      logger.info('Job created in Notion', { jobId: response.id })
      return response
    } catch (error) {
      logger.error('Error creating job in Notion:', error)
      throw error
    }
  }

  async updateJobStatus(jobId: string, status: string, progress?: number) {
    try {
      await this.client.pages.update({
        page_id: jobId,
        properties: {
          Status: {
            select: {
              name: status,
            },
          },
          ...(progress !== undefined && {
            Progress: {
              number: progress,
            },
          }),
        },
      })

      logger.info('Job status updated in Notion', { jobId, status, progress })
    } catch (error) {
      logger.error('Error updating job status in Notion:', error)
      throw error
    }
  }

  async createAsset(assetData: any) {
    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ASSETS!,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: assetData.name,
                },
              },
            ],
          },
          Type: {
            select: {
              name: assetData.type,
            },
          },
          URL: {
            url: assetData.url,
          },
          'Job ID': {
            rich_text: [
              {
                text: {
                  content: assetData.jobId || '',
                },
              },
            ],
          },
        },
      })

      logger.info('Asset created in Notion', { assetId: response.id })
      return response
    } catch (error) {
      logger.error('Error creating asset in Notion:', error)
      throw error
    }
  }
}
