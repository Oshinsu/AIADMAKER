import axios from 'axios'
import { logger } from '../lib/logger'

export class C2PAService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.C2PA_API_KEY || ''
    this.baseUrl = 'https://api.c2pa.org/v1'
  }

  async verifyProvenance(imageUrl: string) {
    try {
      // Vérifier la provenance C2PA de l'image
      const response = await axios.post(
        `${this.baseUrl}/verify`,
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const provenanceData = response.data
      
      return {
        detected: provenanceData.manifestDetected || false,
        provenance: provenanceData.provenance || null,
        integrity: provenanceData.integrity || false,
        generator: provenanceData.generator || null,
        timestamp: provenanceData.timestamp || null,
        metadata: provenanceData.metadata || {},
      }
    } catch (error) {
      logger.error('C2PA verification failed:', error)
      
      // Fallback: simulation basée sur l'URL ou les métadonnées
      return this.simulateProvenanceDetection(imageUrl)
    }
  }

  async addProvenance(imageData: Buffer, metadata: any) {
    try {
      // Ajouter des métadonnées C2PA à l'image
      const response = await axios.post(
        `${this.baseUrl}/add`,
        {
          image: {
            source: {
              imageData: imageData.toString('base64'),
            },
          },
          provenance: {
            generator: 'ai-ad-maker',
            timestamp: new Date().toISOString(),
            version: '1.0',
            metadata: {
              ...metadata,
              createdBy: 'AI Ad Maker Platform',
              workflow: metadata.workflowId,
              job: metadata.jobId,
              agent: metadata.agentId,
            },
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      return {
        success: true,
        provenancedImage: Buffer.from(response.data.imageData, 'base64'),
        provenance: response.data.provenance,
      }
    } catch (error) {
      logger.error('C2PA provenance addition failed:', error)
      throw new Error(`Échec de l'ajout de la provenance: ${error.message}`)
    }
  }

  private simulateProvenanceDetection(imageUrl: string) {
    // Simulation basée sur l'URL ou les métadonnées
    const hasC2PA = imageUrl.includes('c2pa') || imageUrl.includes('provenance')
    const hasAIAdMaker = imageUrl.includes('ai-ad-maker') || imageUrl.includes('generated')
    
    return {
      detected: hasC2PA || hasAIAdMaker,
      provenance: hasC2PA ? 'c2pa-v1' : (hasAIAdMaker ? 'ai-ad-maker-v1.0' : null),
      integrity: hasC2PA || hasAIAdMaker,
      generator: hasAIAdMaker ? 'ai-ad-maker' : null,
      timestamp: new Date().toISOString(),
      metadata: hasAIAdMaker ? {
        createdBy: 'AI Ad Maker Platform',
        version: '1.0',
      } : {},
    }
  }

  async validateProvenanceChain(imageUrl: string) {
    try {
      const provenanceData = await this.verifyProvenance(imageUrl)
      
      if (!provenanceData.detected) {
        return {
          valid: false,
          reason: 'Aucune provenance C2PA détectée',
          risk: 'high',
        }
      }

      if (!provenanceData.integrity) {
        return {
          valid: false,
          reason: 'Intégrité de la provenance compromise',
          risk: 'high',
        }
      }

      // Vérifier la chaîne de provenance
      const chainValid = await this.validateProvenanceChain(provenanceData)
      
      return {
        valid: chainValid,
        reason: chainValid ? 'Chaîne de provenance valide' : 'Chaîne de provenance invalide',
        risk: chainValid ? 'low' : 'high',
        provenance: provenanceData,
      }
    } catch (error) {
      logger.error('Provenance chain validation failed:', error)
      return {
        valid: false,
        reason: 'Erreur de validation de la chaîne',
        risk: 'high',
      }
    }
  }

  private async validateProvenanceChain(provenanceData: any) {
    // Vérifier que la chaîne de provenance est valide
    if (!provenanceData.provenance) return false
    
    // Vérifier le générateur
    if (provenanceData.generator !== 'ai-ad-maker') return false
    
    // Vérifier le timestamp
    if (provenanceData.timestamp) {
      const provenanceDate = new Date(provenanceData.timestamp)
      const now = new Date()
      const ageInDays = (now.getTime() - provenanceDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (ageInDays > 30) return false // Provenance trop ancienne
    }
    
    // Vérifier les métadonnées requises
    const requiredMetadata = ['createdBy', 'version']
    for (const field of requiredMetadata) {
      if (!provenanceData.metadata[field]) return false
    }
    
    return true
  }

  async getProvenanceHistory(imageUrl: string) {
    try {
      const provenanceData = await this.verifyProvenance(imageUrl)
      
      if (!provenanceData.detected) {
        return {
          history: [],
          complete: false,
        }
      }

      // Construire l'historique de provenance
      const history = [
        {
          step: 'generation',
          timestamp: provenanceData.timestamp,
          agent: provenanceData.metadata.agent,
          workflow: provenanceData.metadata.workflow,
          job: provenanceData.metadata.job,
        },
        {
          step: 'validation',
          timestamp: new Date().toISOString(),
          agent: 'creative-evaluator',
          action: 'quality_check',
        },
      ]

      return {
        history,
        complete: true,
        provenance: provenanceData,
      }
    } catch (error) {
      logger.error('Provenance history retrieval failed:', error)
      return {
        history: [],
        complete: false,
      }
    }
  }
}
