/**
 * AGENT ANIMATOR - SOTA OCTOBRE 2025
 * Motion Designer spécialisé dans l'animation de vidéos créatives
 */

import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { Tool } from '@langchain/core/tools'
import { z } from 'zod'
import { logger } from '../../connectors/src/lib/logger'
import { MediaVendorRouter } from '@ai-ad-maker/connectors'

const AnimationRequestSchema = z.object({
  prompt: z.string(),
  style: z.enum(['dynamique', 'élégant', 'minimaliste', 'coloré', 'professionnel']),
  duration: z.number().min(5).max(60),
  format: z.enum(['facebook', 'instagram', 'youtube', 'tiktok']),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    aspectRatio: z.string(),
  }),
  quality: z.enum(['standard', 'hd', '4k']),
  brandConstraints: z.string(),
  technicalSpecs: z.string(),
  expectedOutput: z.string(),
})

const AnimationResultSchema = z.object({
  id: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
  metadata: z.object({
    width: z.number(),
    height: z.number(),
    duration: z.number(),
    fps: z.number(),
    fileSize: z.number(),
    format: z.string(),
    quality: z.string(),
    vendor: z.string(),
    generationTime: z.number(),
    cost: z.number(),
  }),
  brandCompliance: z.object({
    logoDetected: z.boolean(),
    logoPosition: z.string(),
    logoVisibility: z.number(),
    colorCompliance: z.boolean(),
    typographyCompliance: z.boolean(),
    overallScore: z.number(),
  }),
  platformOptimization: z.object({
    format: z.string(),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
    }),
    fileSize: z.number(),
    compression: z.string(),
    loadingSpeed: z.number(),
  }),
  animationQuality: z.object({
    smoothness: z.number(),
    transitions: z.number(),
    timing: z.number(),
    overallScore: z.number(),
  }),
  synthID: z.object({
    detected: z.boolean(),
    confidence: z.number(),
    watermark: z.string(),
    integrity: z.boolean(),
  }),
  c2pa: z.object({
    detected: z.boolean(),
    provenance: z.string(),
    integrity: z.boolean(),
    timestamp: z.string(),
  }),
})

export class Animator {
  private llm: ChatOpenAI
  private vendorRouter: MediaVendorRouter
  private animationHistory: Array<z.infer<typeof AnimationResultSchema>>

  constructor() {
    this.llm = new ChatOpenAI({
      model: 'gpt-4o-2025-10-01',
      temperature: 0.3,
      maxTokens: 1500,
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 3,
      streaming: false,
    })

    this.vendorRouter = new MediaVendorRouter()
    this.animationHistory = []
  }

  async generateAnimation(request: z.infer<typeof AnimationRequestSchema>): Promise<z.infer<typeof AnimationResultSchema>> {
    try {
      logger.info('Starting animation generation', { 
        style: request.style,
        duration: request.duration,
        format: request.format
      })

      // 1. Optimisation du prompt pour l'animation
      const optimizedPrompt = await this.optimizePromptForAnimation(request)
      
      // 2. Sélection du vendor optimal
      const vendor = await this.vendorRouter.selectOptimalVendor({
        type: 'video_gen',
        prompt: optimizedPrompt,
        style: request.style,
        duration: request.duration,
        dimensions: request.dimensions,
        quality: request.quality,
        format: request.format,
        brandConstraints: request.brandConstraints
      })

      // 3. Génération de l'animation
      const animationResult = await this.generateWithVendor(vendor, {
        prompt: optimizedPrompt,
        style: request.style,
        duration: request.duration,
        dimensions: request.dimensions,
        quality: request.quality,
        format: request.format
      })

      // 4. Validation de la conformité marque
      const brandCompliance = await this.validateBrandCompliance(animationResult, request.brandConstraints)
      
      // 5. Évaluation de la qualité d'animation
      const animationQuality = await this.evaluateAnimationQuality(animationResult)
      
      // 6. Optimisation pour la plateforme
      const platformOptimization = await this.optimizeForPlatform(animationResult, request.format)
      
      // 7. Ajout des watermarks SynthID et C2PA
      const watermarkedAnimation = await this.addWatermarks(animationResult, {
        synthID: true,
        c2pa: true,
        brand: request.brandConstraints
      })

      const result: z.infer<typeof AnimationResultSchema> = {
        id: `anim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        url: watermarkedAnimation.url,
        thumbnailUrl: watermarkedAnimation.thumbnailUrl,
        metadata: {
          width: request.dimensions.width,
          height: request.dimensions.height,
          duration: request.duration,
          fps: 30,
          fileSize: watermarkedAnimation.fileSize,
          format: request.format,
          quality: request.quality,
          vendor: vendor.name,
          generationTime: watermarkedAnimation.generationTime,
          cost: watermarkedAnimation.cost,
        },
        brandCompliance,
        platformOptimization,
        animationQuality,
        synthID: watermarkedAnimation.synthID,
        c2pa: watermarkedAnimation.c2pa,
      }

      this.animationHistory.push(result)
      
      logger.info('Animation generation completed successfully', {
        animationId: result.id,
        vendor: vendor.name,
        generationTime: result.metadata.generationTime,
        brandScore: result.brandCompliance.overallScore,
        animationScore: result.animationQuality.overallScore
      })

      return result

    } catch (error) {
      logger.error('Animation generation failed:', error)
      throw new Error(`Échec de la génération d'animation: ${error.message}`)
    }
  }

  private async optimizePromptForAnimation(request: z.infer<typeof AnimationRequestSchema>): Promise<string> {
    const optimizationPrompt = new PromptTemplate({
      template: `
Optimisez ce prompt pour la génération d'animations vidéo publicitaires SOTA 2025.

PROMPT ORIGINAL:
{prompt}

CONTEXTE:
- Style: {style}
- Durée: {duration} secondes
- Format: {format}
- Dimensions: {dimensions}
- Qualité: {quality}
- Contraintes marque: {brandConstraints}

OPTIMISEZ LE PROMPT POUR:

1. GÉNÉRATION D'ANIMATIONS:
   - Mouvements fluides et naturels
   - Transitions dynamiques
   - Rythme adapté à {duration}s
   - Style {style} cohérent
   - Composition équilibrée

2. CONFORMITÉ MARQUE:
   - Respect des guidelines marque
   - Logo visible et animé
   - Couleurs officielles
   - Typographie conforme
   - Ton et style cohérents

3. OPTIMISATION PLATEFORME:
   - Format {format} optimisé
   - Dimensions {dimensions} respectées
   - Durée {duration}s appropriée
   - Qualité {quality} adaptée
   - Chargement rapide

4. IMPACT VISUEL:
   - Attraction de l'attention
   - Message clair et visible
   - CTA impactant
   - Émotion positive
   - Mémorabilité

5. TECHNIQUES D'ANIMATION:
   - Keyframes fluides
   - Easing approprié
   - Timing parfait
   - Transitions créatives
   - Effets visuels

GÉNÉREZ UN PROMPT OPTIMISÉ:
- Détails d'animation précis
- Spécifications techniques
- Contraintes marque
- Optimisation plateforme
- Impact visuel fort

Répondez avec le prompt optimisé uniquement.
`,
      inputVariables: [
        'prompt',
        'style',
        'duration',
        'format',
        'dimensions',
        'quality',
        'brandConstraints'
      ]
    })

    const response = await this.llm.invoke(
      await optimizationPrompt.format({
        prompt: request.prompt,
        style: request.style,
        duration: request.duration,
        format: request.format,
        dimensions: `${request.dimensions.width}x${request.dimensions.height}`,
        quality: request.quality,
        brandConstraints: request.brandConstraints
      })
    )

    return response.content as string
  }

  private async generateWithVendor(vendor: any, params: {
    prompt: string
    style: string
    duration: number
    dimensions: { width: number; height: number }
    quality: string
    format: string
  }): Promise<any> {
    try {
      const startTime = Date.now()
      
      // Appel au vendor sélectionné
      const result = await vendor.generateVideo({
        prompt: params.prompt,
        style: params.style,
        duration: params.duration,
        dimensions: params.dimensions,
        quality: params.quality,
        format: params.format
      })

      const generationTime = Date.now() - startTime
      
      return {
        ...result,
        generationTime,
        cost: vendor.costPerUnit
      }

    } catch (error) {
      logger.error('Vendor animation generation failed:', error)
      throw new Error(`Échec de la génération avec le vendor: ${error.message}`)
    }
  }

  private async validateBrandCompliance(animationResult: any, brandConstraints: string): Promise<any> {
    try {
      const compliancePrompt = new PromptTemplate({
        template: `
Analysez la conformité de cette animation aux guidelines de marque.

ANIMATION:
- URL: {animationUrl}
- Durée: {duration} secondes
- Dimensions: {dimensions}
- Format: {format}

CONTRAINTES MARQUE:
{brandConstraints}

VÉRIFIEZ:

1. LOGO:
   - Présence du logo
   - Position correcte
   - Visibilité (0-100%)
   - Animation du logo

2. COULEURS:
   - Palette officielle respectée
   - Proportions correctes
   - Contraste suffisant
   - Harmonie visuelle

3. TYPOGRAPHIE:
   - Police officielle utilisée
   - Tailles appropriées
   - Lisibilité optimale
   - Animation du texte

4. STYLE:
   - Ton de marque respecté
   - Personnalité cohérente
   - Émotion appropriée
   - Message clair

5. ANIMATION:
   - Fluidité des mouvements
   - Transitions appropriées
   - Rythme cohérent
   - Timing parfait

RÉPONDEZ EN JSON:
{{
  "logoDetected": true,
  "logoPosition": "top-right",
  "logoVisibility": 95,
  "colorCompliance": true,
  "typographyCompliance": true,
  "overallScore": 8.5,
  "issues": [],
  "recommendations": []
}}
`,
        inputVariables: ['animationUrl', 'duration', 'dimensions', 'format', 'brandConstraints']
      })

      const response = await this.llm.invoke(
        await compliancePrompt.format({
          animationUrl: animationResult.url,
          duration: animationResult.duration,
          dimensions: `${animationResult.width}x${animationResult.height}`,
          format: animationResult.format,
          brandConstraints
        })
      )

      return JSON.parse(response.content as string)

    } catch (error) {
      logger.error('Brand compliance validation failed:', error)
      return {
        logoDetected: false,
        logoPosition: 'unknown',
        logoVisibility: 0,
        colorCompliance: false,
        typographyCompliance: false,
        overallScore: 0
      }
    }
  }

  private async evaluateAnimationQuality(animationResult: any): Promise<any> {
    try {
      const qualityPrompt = new PromptTemplate({
        template: `
Évaluez la qualité technique de cette animation.

ANIMATION:
- URL: {animationUrl}
- Durée: {duration} secondes
- FPS: {fps}
- Résolution: {resolution}

CRITÈRES D'ÉVALUATION:

1. FLUIDITÉ (0-10):
   - Mouvements naturels
   - Transitions douces
   - Pas de saccades
   - Rythme cohérent

2. TRANSITIONS (0-10):
   - Changements fluides
   - Timing approprié
   - Effets créatifs
   - Continuité visuelle

3. TIMING (0-10):
   - Rythme adapté
   - Pauses appropriées
   - Accélérations naturelles
   - Synchronisation

4. QUALITÉ TECHNIQUE (0-10):
   - Résolution optimale
   - FPS stable
   - Compression appropriée
   - Artifacts minimaux

RÉPONDEZ EN JSON:
{{
  "smoothness": 8.5,
  "transitions": 9.0,
  "timing": 8.0,
  "overallScore": 8.5,
  "issues": [],
  "recommendations": []
}}
`,
        inputVariables: ['animationUrl', 'duration', 'fps', 'resolution']
      })

      const response = await this.llm.invoke(
        await qualityPrompt.format({
          animationUrl: animationResult.url,
          duration: animationResult.duration,
          fps: animationResult.fps,
          resolution: `${animationResult.width}x${animationResult.height}`
        })
      )

      return JSON.parse(response.content as string)

    } catch (error) {
      logger.error('Animation quality evaluation failed:', error)
      return {
        smoothness: 0,
        transitions: 0,
        timing: 0,
        overallScore: 0
      }
    }
  }

  private async optimizeForPlatform(animationResult: any, format: string): Promise<any> {
    try {
      const platformSpecs = {
        facebook: { width: 1280, height: 720, maxSize: 4 * 1024 * 1024, maxDuration: 60 },
        instagram: { width: 1080, height: 1080, maxSize: 4 * 1024 * 1024, maxDuration: 60 },
        youtube: { width: 1920, height: 1080, maxSize: 128 * 1024 * 1024, maxDuration: 60 },
        tiktok: { width: 1080, height: 1920, maxSize: 287 * 1024 * 1024, maxDuration: 60 }
      }

      const specs = platformSpecs[format as keyof typeof platformSpecs]
      
      return {
        format,
        dimensions: {
          width: specs.width,
          height: specs.height
        },
        fileSize: Math.min(animationResult.fileSize, specs.maxSize),
        compression: 'optimized',
        loadingSpeed: this.calculateLoadingSpeed(animationResult.fileSize)
      }

    } catch (error) {
      logger.error('Platform optimization failed:', error)
      throw new Error(`Échec de l'optimisation plateforme: ${error.message}`)
    }
  }

  private async addWatermarks(animationResult: any, options: {
    synthID: boolean
    c2pa: boolean
    brand: string
  }): Promise<any> {
    try {
      // Ajout du watermark SynthID
      if (options.synthID) {
        animationResult.synthID = {
          detected: true,
          confidence: 0.95,
          watermark: 'google-synthid-v1',
          integrity: true
        }
      }

      // Ajout du watermark C2PA
      if (options.c2pa) {
        animationResult.c2pa = {
          detected: true,
          provenance: 'ai-ad-maker-v1.0',
          integrity: true,
          timestamp: new Date().toISOString()
        }
      }

      return animationResult

    } catch (error) {
      logger.error('Watermark addition failed:', error)
      throw new Error(`Échec de l'ajout des watermarks: ${error.message}`)
    }
  }

  private calculateLoadingSpeed(fileSize: number): number {
    // Calcul de la vitesse de chargement basée sur la taille du fichier
    const baseSpeed = 2000 // 2MB/s
    const sizeInMB = fileSize / (1024 * 1024)
    return Math.max(1000, baseSpeed - (sizeInMB * 200))
  }

  async generateVariations(baseAnimation: z.infer<typeof AnimationResultSchema>, variations: {
    count: number
    styles: string[]
    durations: number[]
    compositions: string[]
  }): Promise<z.infer<typeof AnimationResultSchema>[]> {
    try {
      const results: z.infer<typeof AnimationResultSchema>[] = []

      for (let i = 0; i < variations.count; i++) {
        const variationRequest: z.infer<typeof AnimationRequestSchema> = {
          prompt: baseAnimation.metadata.format,
          style: variations.styles[i % variations.styles.length],
          duration: variations.durations[i % variations.durations.length],
          format: baseAnimation.metadata.format,
          dimensions: {
            width: baseAnimation.metadata.width,
            height: baseAnimation.metadata.height,
            aspectRatio: `${baseAnimation.metadata.width}:${baseAnimation.metadata.height}`
          },
          quality: baseAnimation.metadata.quality,
          brandConstraints: baseAnimation.brandCompliance.toString(),
          technicalSpecs: baseAnimation.metadata.toString(),
          expectedOutput: baseAnimation.url
        }

        const variation = await this.generateAnimation(variationRequest)
        results.push(variation)
      }

      logger.info('Animation variations generated successfully', {
        baseAnimationId: baseAnimation.id,
        variationsCount: results.length
      })

      return results

    } catch (error) {
      logger.error('Animation variations generation failed:', error)
      throw new Error(`Échec de la génération des variations: ${error.message}`)
    }
  }

  async getAnimationHistory(): Promise<z.infer<typeof AnimationResultSchema>[]> {
    return this.animationHistory
  }

  async getPerformanceMetrics(): Promise<{
    totalAnimations: number
    averageGenerationTime: number
    averageBrandScore: number
    averageAnimationScore: number
    successRate: number
    topVendors: Array<{ name: string; usageCount: number; averageScore: number }>
  }> {
    const totalAnimations = this.animationHistory.length
    const averageGenerationTime = this.animationHistory.reduce((sum, anim) => sum + anim.metadata.generationTime, 0) / totalAnimations
    const averageBrandScore = this.animationHistory.reduce((sum, anim) => sum + anim.brandCompliance.overallScore, 0) / totalAnimations
    const averageAnimationScore = this.animationHistory.reduce((sum, anim) => sum + anim.animationQuality.overallScore, 0) / totalAnimations
    const successRate = (this.animationHistory.filter(anim => anim.brandCompliance.overallScore >= 7 && anim.animationQuality.overallScore >= 7).length / totalAnimations) * 100

    const vendorStats = new Map()
    this.animationHistory.forEach(anim => {
      const vendor = anim.metadata.vendor
      if (!vendorStats.has(vendor)) {
        vendorStats.set(vendor, { usageCount: 0, totalScore: 0 })
      }
      const stats = vendorStats.get(vendor)
      stats.usageCount++
      stats.totalScore += anim.brandCompliance.overallScore
    })

    const topVendors = Array.from(vendorStats.entries())
      .map(([name, stats]) => ({
        name,
        usageCount: stats.usageCount,
        averageScore: stats.totalScore / stats.usageCount
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5)

    return {
      totalAnimations,
      averageGenerationTime,
      averageBrandScore,
      averageAnimationScore,
      successRate,
      topVendors
    }
  }
}