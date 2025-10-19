import { z } from 'zod'
import { SeedreamService } from './seedream'
import { GeminiService } from './gemini'
import { VeoService } from './veo'
import { SeedanceService } from './seedance'
import { KlingService } from './kling'
import { FalService } from './fal'
import { logger } from '../lib/logger'

const VendorConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['image', 'video', 'audio']),
  priority: z.number().min(1).max(10),
  costPerRequest: z.number(),
  costPerToken: z.number().optional(),
  sla: z.object({
    maxLatency: z.number(), // ms
    successRate: z.number(), // 0-1
    availability: z.number(), // 0-1
  }),
  quotas: z.object({
    daily: z.number(),
    monthly: z.number(),
    current: z.number(),
  }),
  capabilities: z.array(z.string()),
  fallbackTo: z.array(z.string()).optional(),
})

const RoutingDecisionSchema = z.object({
  selectedVendor: z.string(),
  fallbackVendors: z.array(z.string()),
  estimatedCost: z.number(),
  estimatedLatency: z.number(),
  confidence: z.number(),
  reasoning: z.string(),
})

export class MediaVendorRouter {
  private vendors: Map<string, z.infer<typeof VendorConfigSchema>>
  private services: Map<string, any>
  private metrics: Map<string, any>

  constructor() {
    this.vendors = new Map()
    this.services = new Map()
    this.metrics = new Map()
    
    this.initializeVendors()
    this.initializeServices()
  }

  private initializeVendors() {
    // Configuration des vendors
    const vendorConfigs = [
      {
        id: 'seedream-4.0',
        name: 'Seedream 4.0',
        type: 'image' as const,
        priority: 9,
        costPerRequest: 0.05,
        sla: {
          maxLatency: 30000,
          successRate: 0.95,
          availability: 0.98,
        },
        quotas: {
          daily: 1000,
          monthly: 30000,
          current: 0,
        },
        capabilities: ['text-to-image', 'image-editing', '4k', 'text-rendering'],
        fallbackTo: ['gemini-imagen', 'fal-seedream'],
      },
      {
        id: 'gemini-imagen',
        name: 'Gemini Imagen 4',
        type: 'image' as const,
        priority: 8,
        costPerRequest: 0.03,
        sla: {
          maxLatency: 25000,
          successRate: 0.92,
          availability: 0.99,
        },
        quotas: {
          daily: 2000,
          monthly: 60000,
          current: 0,
        },
        capabilities: ['text-to-image', 'synthid', 'watermark'],
        fallbackTo: ['seedream-4.0', 'fal-imagen'],
      },
      {
        id: 'veo-3.1',
        name: 'Veo 3.1',
        type: 'video' as const,
        priority: 9,
        costPerRequest: 0.15,
        sla: {
          maxLatency: 60000,
          successRate: 0.90,
          availability: 0.95,
        },
        quotas: {
          daily: 500,
          monthly: 15000,
          current: 0,
        },
        capabilities: ['text-to-video', 'image-to-video', 'audio-native'],
        fallbackTo: ['seedance-pro', 'kling-2.5'],
      },
      {
        id: 'seedance-pro',
        name: 'Seedance Pro',
        type: 'video' as const,
        priority: 8,
        costPerRequest: 0.12,
        sla: {
          maxLatency: 45000,
          successRate: 0.88,
          availability: 0.97,
        },
        quotas: {
          daily: 800,
          monthly: 24000,
          current: 0,
        },
        capabilities: ['text-to-video', 'image-to-video', '1080p'],
        fallbackTo: ['kling-2.5', 'fal-seedance'],
      },
      {
        id: 'kling-2.5',
        name: 'Kling 2.5',
        type: 'video' as const,
        priority: 7,
        costPerRequest: 0.08,
        sla: {
          maxLatency: 40000,
          successRate: 0.85,
          availability: 0.96,
        },
        quotas: {
          daily: 1200,
          monthly: 36000,
          current: 0,
        },
        capabilities: ['text-to-video', 'image-to-video', 'fast'],
        fallbackTo: ['fal-kling'],
      },
      {
        id: 'fal-seedream',
        name: 'FAL Seedream',
        type: 'image' as const,
        priority: 6,
        costPerRequest: 0.04,
        sla: {
          maxLatency: 35000,
          successRate: 0.90,
          availability: 0.94,
        },
        quotas: {
          daily: 1500,
          monthly: 45000,
          current: 0,
        },
        capabilities: ['text-to-image', 'image-editing'],
        fallbackTo: ['fal-imagen'],
      },
    ]

    vendorConfigs.forEach(config => {
      this.vendors.set(config.id, config)
    })
  }

  private initializeServices() {
    this.services.set('seedream-4.0', new SeedreamService())
    this.services.set('gemini-imagen', new GeminiService())
    this.services.set('veo-3.1', new VeoService())
    this.services.set('seedance-pro', new SeedanceService())
    this.services.set('kling-2.5', new KlingService())
    this.services.set('fal-seedream', new FalService())
  }

  async routeRequest(request: {
    type: 'image' | 'video' | 'audio'
    task: string
    requirements: {
      quality?: 'low' | 'medium' | 'high' | 'ultra'
      format?: string
      resolution?: string
      duration?: number
      budget?: number
      deadline?: number
    }
    constraints: {
      maxCost?: number
      maxLatency?: number
      requiredCapabilities?: string[]
      preferredVendors?: string[]
      blockedVendors?: string[]
    }
  }): Promise<z.infer<typeof RoutingDecisionSchema>> {
    try {
      // 1. Filtrer les vendors par type et contraintes
      const eligibleVendors = this.filterEligibleVendors(request)
      
      if (eligibleVendors.length === 0) {
        throw new Error('Aucun vendor éligible trouvé')
      }

      // 2. Calculer le score pour chaque vendor
      const vendorScores = await this.calculateVendorScores(eligibleVendors, request)
      
      // 3. Sélectionner le meilleur vendor
      const sortedVendors = vendorScores.sort((a, b) => b.score - a.score)
      const selectedVendor = sortedVendors[0]
      
      // 4. Préparer les fallbacks
      const fallbackVendors = sortedVendors.slice(1, 4).map(v => v.id)
      
      // 5. Calculer les métriques
      const estimatedCost = this.calculateCost(selectedVendor.id, request)
      const estimatedLatency = this.calculateLatency(selectedVendor.id, request)
      
      const decision: z.infer<typeof RoutingDecisionSchema> = {
        selectedVendor: selectedVendor.id,
        fallbackVendors,
        estimatedCost,
        estimatedLatency,
        confidence: selectedVendor.score,
        reasoning: selectedVendor.reasoning,
      }

      logger.info('Vendor routing decision', {
        request: request.task,
        selected: selectedVendor.id,
        score: selectedVendor.score,
        cost: estimatedCost,
        latency: estimatedLatency,
      })

      return decision
    } catch (error) {
      logger.error('Vendor routing failed:', error)
      throw new Error(`Échec du routing vendor: ${error.message}`)
    }
  }

  private filterEligibleVendors(request: any) {
    return Array.from(this.vendors.values()).filter(vendor => {
      // Type matching
      if (vendor.type !== request.type) return false
      
      // Blocked vendors
      if (request.constraints.blockedVendors?.includes(vendor.id)) return false
      
      // Required capabilities
      if (request.constraints.requiredCapabilities) {
        const hasAllCapabilities = request.constraints.requiredCapabilities.every(
          (cap: string) => vendor.capabilities.includes(cap)
        )
        if (!hasAllCapabilities) return false
      }
      
      // Quota check
      if (vendor.quotas.current >= vendor.quotas.daily) return false
      
      // Availability check
      const currentAvailability = this.getCurrentAvailability(vendor.id)
      if (currentAvailability < vendor.sla.availability) return false
      
      return true
    })
  }

  private async calculateVendorScores(vendors: any[], request: any) {
    const scores = []
    
    for (const vendor of vendors) {
      const score = await this.calculateVendorScore(vendor, request)
      scores.push({
        id: vendor.id,
        score: score.total,
        reasoning: score.reasoning,
        breakdown: score.breakdown,
      })
    }
    
    return scores
  }

  private async calculateVendorScore(vendor: any, request: any) {
    const breakdown = {
      priority: vendor.priority * 10, // 10-100
      cost: this.calculateCostScore(vendor, request),
      latency: this.calculateLatencyScore(vendor, request),
      reliability: this.calculateReliabilityScore(vendor),
      availability: this.calculateAvailabilityScore(vendor),
      quality: this.calculateQualityScore(vendor, request),
    }
    
    const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0) / 6
    
    const reasoning = this.generateReasoning(vendor, breakdown, request)
    
    return {
      total,
      breakdown,
      reasoning,
    }
  }

  private calculateCostScore(vendor: any, request: any) {
    const cost = this.calculateCost(vendor.id, request)
    const maxBudget = request.constraints.maxCost || 1.0
    
    if (cost > maxBudget) return 0
    
    return Math.max(0, 100 - (cost / maxBudget) * 100)
  }

  private calculateLatencyScore(vendor: any, request: any) {
    const latency = this.calculateLatency(vendor.id, request)
    const maxLatency = request.constraints.maxLatency || vendor.sla.maxLatency
    
    if (latency > maxLatency) return 0
    
    return Math.max(0, 100 - (latency / maxLatency) * 100)
  }

  private calculateReliabilityScore(vendor: any) {
    return vendor.sla.successRate * 100
  }

  private calculateAvailabilityScore(vendor: any) {
    const currentAvailability = this.getCurrentAvailability(vendor.id)
    return currentAvailability * 100
  }

  private calculateQualityScore(vendor: any, request: any) {
    const quality = request.requirements.quality || 'medium'
    const qualityScores = {
      low: 60,
      medium: 80,
      high: 90,
      ultra: 95,
    }
    
    return qualityScores[quality] || 80
  }

  private calculateCost(vendorId: string, request: any) {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return 0
    
    let cost = vendor.costPerRequest
    
    // Ajustements selon les requirements
    if (request.requirements.quality === 'high') cost *= 1.5
    if (request.requirements.quality === 'ultra') cost *= 2.0
    if (request.requirements.resolution === '4k') cost *= 1.3
    if (request.requirements.duration && request.requirements.duration > 30) {
      cost *= (request.requirements.duration / 30)
    }
    
    return cost
  }

  private calculateLatency(vendorId: string, request: any) {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return 0
    
    let latency = vendor.sla.maxLatency
    
    // Ajustements selon les requirements
    if (request.requirements.quality === 'high') latency *= 1.2
    if (request.requirements.quality === 'ultra') latency *= 1.5
    if (request.requirements.resolution === '4k') latency *= 1.3
    
    return latency
  }

  private getCurrentAvailability(vendorId: string) {
    // Simulation de la disponibilité actuelle
    // En production, ceci viendrait d'un monitoring en temps réel
    const baseAvailability = this.vendors.get(vendorId)?.sla.availability || 0.95
    const randomFactor = 0.9 + Math.random() * 0.1 // ±10%
    return Math.min(1.0, baseAvailability * randomFactor)
  }

  private generateReasoning(vendor: any, breakdown: any, request: any) {
    const reasons = []
    
    if (breakdown.priority > 80) reasons.push('Vendor prioritaire')
    if (breakdown.cost > 80) reasons.push('Coût optimisé')
    if (breakdown.latency > 80) reasons.push('Latence faible')
    if (breakdown.reliability > 90) reasons.push('Très fiable')
    if (breakdown.availability > 95) reasons.push('Haute disponibilité')
    
    return reasons.join(', ') || 'Vendor standard'
  }

  async executeRequest(decision: z.infer<typeof RoutingDecisionSchema>, request: any) {
    try {
      const service = this.services.get(decision.selectedVendor)
      if (!service) {
        throw new Error(`Service non trouvé pour vendor: ${decision.selectedVendor}`)
      }
      
      // Exécuter la requête
      const result = await service.process(request)
      
      // Mettre à jour les métriques
      await this.updateVendorMetrics(decision.selectedVendor, result)
      
      return result
    } catch (error) {
      logger.error('Vendor execution failed:', error)
      
      // Essayer les fallbacks
      for (const fallbackVendor of decision.fallbackVendors) {
        try {
          const fallbackService = this.services.get(fallbackVendor)
          if (fallbackService) {
            logger.info('Trying fallback vendor:', fallbackVendor)
            const result = await fallbackService.process(request)
            await this.updateVendorMetrics(fallbackVendor, result)
            return result
          }
        } catch (fallbackError) {
          logger.error('Fallback vendor failed:', fallbackError)
          continue
        }
      }
      
      throw new Error('Tous les vendors ont échoué')
    }
  }

  private async updateVendorMetrics(vendorId: string, result: any) {
    const vendor = this.vendors.get(vendorId)
    if (!vendor) return
    
    // Mettre à jour les quotas
    vendor.quotas.current += 1
    
    // Mettre à jour les métriques de performance
    const metrics = this.metrics.get(vendorId) || {
      totalRequests: 0,
      successfulRequests: 0,
      averageLatency: 0,
      averageCost: 0,
    }
    
    metrics.totalRequests += 1
    if (result.success) metrics.successfulRequests += 1
    
    this.metrics.set(vendorId, metrics)
  }

  async getVendorStatus() {
    const status = []
    
    for (const [id, vendor] of this.vendors) {
      const metrics = this.metrics.get(id) || {
        totalRequests: 0,
        successfulRequests: 0,
        averageLatency: 0,
        averageCost: 0,
      }
      
      status.push({
        id,
        name: vendor.name,
        type: vendor.type,
        priority: vendor.priority,
        quotas: vendor.quotas,
        availability: this.getCurrentAvailability(id),
        metrics: {
          successRate: metrics.totalRequests > 0 
            ? metrics.successfulRequests / metrics.totalRequests 
            : 0,
          totalRequests: metrics.totalRequests,
          averageLatency: metrics.averageLatency,
          averageCost: metrics.averageCost,
        },
      })
    }
    
    return status
  }
}
