import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from '@langchain/openai'
import { logger } from './lib/logger'

export class VectorStore {
  private pinecone: Pinecone
  private embeddings: OpenAIEmbeddings
  private indexName: string

  constructor() {
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    })
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY || '',
    })
    this.indexName = process.env.PINECONE_INDEX_NAME || 'ai-ad-maker'
  }

  async searchBrandGuidelines(brandId: string) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      // Rechercher les guidelines de marque
      const queryResponse = await index.query({
        vector: await this.embeddings.embedQuery(`brand guidelines ${brandId}`),
        topK: 10,
        includeMetadata: true,
        filter: {
          brandId: { $eq: brandId },
          type: { $eq: 'brand_guidelines' },
        },
      })

      const guidelines = queryResponse.matches?.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      })) || []

      return {
        brandId,
        guidelines,
        total: guidelines.length,
      }
    } catch (error) {
      logger.error('Brand guidelines search failed:', error)
      return {
        brandId,
        guidelines: [],
        total: 0,
      }
    }
  }

  async findSimilarCampaigns(brandId: string, context: any) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      // Rechercher des campagnes similaires
      const queryText = `${context.product} ${context.objective} ${context.audience} ${context.platform}`
      const queryResponse = await index.query({
        vector: await this.embeddings.embedQuery(queryText),
        topK: 5,
        includeMetadata: true,
        filter: {
          brandId: { $eq: brandId },
          type: { $eq: 'campaign' },
        },
      })

      const campaigns = queryResponse.matches?.map(match => ({
        id: match.id,
        score: match.score,
        description: match.metadata?.description,
        platform: match.metadata?.platform,
        results: match.metadata?.results,
      })) || []

      return campaigns
    } catch (error) {
      logger.error('Similar campaigns search failed:', error)
      return []
    }
  }

  async storeBrandGuidelines(brandId: string, guidelines: any) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      // Créer des embeddings pour chaque section des guidelines
      const sections = [
        { text: `logo ${guidelines.logo.primary}`, type: 'logo' },
        { text: `colors ${guidelines.colors.primary.join(' ')}`, type: 'colors' },
        { text: `typography ${guidelines.typography.primary}`, type: 'typography' },
        { text: `tone ${guidelines.tone.voice}`, type: 'tone' },
        { text: `claims ${guidelines.claims.allowed.join(' ')}`, type: 'claims' },
      ]

      const vectors = []
      for (const section of sections) {
        const embedding = await this.embeddings.embedQuery(section.text)
        vectors.push({
          id: `${brandId}_${section.type}_${Date.now()}`,
          values: embedding,
          metadata: {
            brandId,
            type: 'brand_guidelines',
            section: section.type,
            content: section.text,
            timestamp: new Date().toISOString(),
          },
        })
      }

      await index.upsert(vectors)
      
      logger.info('Brand guidelines stored in vector store', { brandId, sections: sections.length })
    } catch (error) {
      logger.error('Brand guidelines storage failed:', { error: (error as Error).message })
      throw new Error(`Échec du stockage des guidelines: ${error.message}`)
    }
  }

  async storeCampaign(brandId: string, campaign: any) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      // Créer un embedding pour la campagne
      const campaignText = `${campaign.product} ${campaign.objective} ${campaign.audience} ${campaign.platform}`
      const embedding = await this.embeddings.embedQuery(campaignText)
      
      await index.upsert([{
        id: `campaign_${campaign.id}`,
        values: embedding,
        metadata: {
          brandId,
          type: 'campaign',
          product: campaign.product,
          objective: campaign.objective,
          audience: campaign.audience,
          platform: campaign.platform,
          results: campaign.results,
          timestamp: new Date().toISOString(),
        },
      }])
      
      logger.info('Campaign stored in vector store', { brandId, campaignId: campaign.id })
    } catch (error) {
      logger.error('Campaign storage failed:', { error: (error as Error).message })
      throw new Error(`Échec du stockage de la campagne: ${error.message}`)
    }
  }

  async updateBrandGuidelines(brandId: string, updates: any) {
    try {
      // Supprimer les anciennes guidelines
      await this.deleteBrandGuidelines(brandId)
      
      // Stocker les nouvelles guidelines
      await this.storeBrandGuidelines(brandId, updates)
      
      logger.info('Brand guidelines updated in vector store', { brandId })
    } catch (error) {
      logger.error('Brand guidelines update failed:', error)
      throw new Error(`Échec de la mise à jour des guidelines: ${error.message}`)
    }
  }

  async deleteBrandGuidelines(brandId: string) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      // Supprimer toutes les guidelines de la marque
      await index.deleteMany({
        filter: {
          brandId: { $eq: brandId },
          type: { $eq: 'brand_guidelines' },
        },
      })
      
      logger.info('Brand guidelines deleted from vector store', { brandId })
    } catch (error) {
      logger.error('Brand guidelines deletion failed:', error)
      throw new Error(`Échec de la suppression des guidelines: ${error.message}`)
    }
  }

  async searchSimilarContent(query: string, brandId?: string) {
    try {
      const index = this.pinecone.Index(this.indexName)
      
      const queryResponse = await index.query({
        vector: await this.embeddings.embedQuery(query),
        topK: 10,
        includeMetadata: true,
        filter: brandId ? {
          brandId: { $eq: brandId },
        } : undefined,
      })

      const results = queryResponse.matches?.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata,
      })) || []

      return results
    } catch (error) {
      logger.error('Similar content search failed:', error)
      return []
    }
  }
}
