/**
 * WORKFLOW TEMPLATES SOTA OCTOBRE 2025
 * Templates prêts pour différents types de campagnes publicitaires
 */

import { z } from 'zod'

const WorkflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  agentId: z.string(),
  config: z.record(z.any()),
  inputs: z.array(z.string()),
  outputs: z.array(z.string()),
  dependencies: z.array(z.string()),
  estimatedTime: z.number(), // en secondes
  retryPolicy: z.object({
    maxRetries: z.number(),
    backoffStrategy: z.enum(['linear', 'exponential', 'fixed']),
    retryDelay: z.number(),
  }),
})

const WorkflowTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['social', 'display', 'video', 'audio', 'email', 'search']),
  subcategory: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimatedDuration: z.number(), // en minutes
  cost: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  steps: z.array(WorkflowStepSchema),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.enum(['string', 'number', 'boolean', 'select', 'multiselect', 'file']),
    required: z.boolean(),
    description: z.string(),
    defaultValue: z.any().optional(),
    options: z.array(z.string()).optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
      custom: z.string().optional(),
    }).optional(),
  })),
  examples: z.array(z.object({
    name: z.string(),
    description: z.string(),
    parameters: z.record(z.any()),
    expectedOutput: z.string(),
    successRate: z.number(),
  })),
  performance: z.object({
    averageScore: z.number(),
    successRate: z.number(),
    usageCount: z.number(),
    averageTime: z.number(),
  }),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.string(),
})

export const WORKFLOW_TEMPLATES: z.infer<typeof WorkflowTemplateSchema>[] = [
  {
    id: 'social-media-campaign',
    name: 'Campagne Réseaux Sociaux',
    description: 'Template complet pour campagne réseaux sociaux avec images, vidéos et textes optimisés',
    category: 'social',
    subcategory: 'Multi-platform',
    difficulty: 'intermediate',
    estimatedDuration: 45,
    cost: {
      min: 500,
      max: 5000,
      currency: 'EUR',
    },
    steps: [
      {
        id: 'brief-generation',
        name: 'Génération du Brief',
        description: 'Création d\'un brief créatif complet',
        agentId: 'brief-gen',
        config: {
          platform: 'social',
          targetAudience: '{{audience}}',
          budget: '{{budget}}',
          objectives: '{{objectives}}',
        },
        inputs: ['brand', 'product', 'audience', 'budget'],
        outputs: ['brief'],
        dependencies: [],
        estimatedTime: 300,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 1000,
        },
      },
      {
        id: 'brief-evaluation',
        name: 'Évaluation du Brief',
        description: 'Évaluation et sélection du meilleur brief',
        agentId: 'brief-judge',
        config: {
          criteria: ['clarity', 'audience', 'message', 'cta', 'feasibility'],
          threshold: 7.0,
        },
        inputs: ['brief'],
        outputs: ['evaluation', 'selectedBrief'],
        dependencies: ['brief-generation'],
        estimatedTime: 180,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000,
        },
      },
      {
        id: 'brand-analysis',
        name: 'Analyse de Marque',
        description: 'Analyse des guidelines de marque et contraintes',
        agentId: 'brand-brain',
        config: {
          brandId: '{{brandId}}',
          guidelines: '{{guidelines}}',
          constraints: '{{constraints}}',
        },
        inputs: ['selectedBrief'],
        outputs: ['brandConstraints', 'guidelines'],
        dependencies: ['brief-evaluation'],
        estimatedTime: 240,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'exponential',
          retryDelay: 1500,
        },
      },
      {
        id: 'prompt-optimization',
        name: 'Optimisation des Prompts',
        description: 'Optimisation des prompts pour la génération créative',
        agentId: 'prompt-smith',
        config: {
          type: 'image',
          platform: '{{platform}}',
          style: '{{style}}',
          brandConstraints: '{{brandConstraints}}',
        },
        inputs: ['selectedBrief', 'brandConstraints'],
        outputs: ['optimizedPrompts'],
        dependencies: ['brand-analysis'],
        estimatedTime: 200,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 1000,
        },
      },
      {
        id: 'image-generation',
        name: 'Génération d\'Images',
        description: 'Création d\'images publicitaires pour réseaux sociaux',
        agentId: 'image-artisan',
        config: {
          formats: ['facebook', 'instagram', 'twitter'],
          styles: ['{{style}}'],
          dimensions: {
            facebook: { width: 1200, height: 630 },
            instagram: { width: 1080, height: 1080 },
            twitter: { width: 1200, height: 675 },
          },
          quality: 'hd',
        },
        inputs: ['optimizedPrompts', 'brandConstraints'],
        outputs: ['images'],
        dependencies: ['prompt-optimization'],
        estimatedTime: 600,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 2000,
        },
      },
      {
        id: 'video-animation',
        name: 'Animation Vidéo',
        description: 'Création de vidéos animées pour réseaux sociaux',
        agentId: 'animator',
        config: {
          duration: 15,
          formats: ['facebook', 'instagram', 'tiktok'],
          styles: ['{{animationStyle}}'],
          dimensions: {
            facebook: { width: 1280, height: 720 },
            instagram: { width: 1080, height: 1080 },
            tiktok: { width: 1080, height: 1920 },
          },
          quality: 'hd',
        },
        inputs: ['optimizedPrompts', 'brandConstraints'],
        outputs: ['videos'],
        dependencies: ['prompt-optimization'],
        estimatedTime: 900,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'exponential',
          retryDelay: 3000,
        },
      },
      {
        id: 'creative-evaluation',
        name: 'Évaluation Créative',
        description: 'Évaluation de la qualité et conformité des créations',
        agentId: 'creative-evaluator',
        config: {
          criteria: ['readability', 'brand_compliance', 'platform_compliance', 'authenticity'],
          thresholds: {
            overall: 6.0,
            readability: 5.0,
            authenticity: 7.0,
          },
        },
        inputs: ['images', 'videos'],
        outputs: ['evaluation', 'approvedAssets'],
        dependencies: ['image-generation', 'video-animation'],
        estimatedTime: 300,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000,
        },
      },
    ],
    parameters: [
      {
        name: 'brand',
        type: 'string',
        required: true,
        description: 'Nom de la marque',
        validation: {
          min: 2,
          max: 50,
        },
      },
      {
        name: 'product',
        type: 'string',
        required: true,
        description: 'Produit à promouvoir',
        validation: {
          min: 2,
          max: 100,
        },
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Audience cible (ex: 18-35 ans, urbains, tech-savvy)',
        validation: {
          min: 10,
          max: 200,
        },
      },
      {
        name: 'budget',
        type: 'number',
        required: true,
        description: 'Budget de la campagne en EUR',
        validation: {
          min: 100,
          max: 10000,
        },
      },
      {
        name: 'objectives',
        type: 'multiselect',
        required: true,
        description: 'Objectifs de la campagne',
        options: ['notoriété', 'ventes', 'engagement', 'trafic', 'conversion'],
        validation: {
          min: 1,
          max: 3,
        },
      },
      {
        name: 'platform',
        type: 'select',
        required: true,
        description: 'Plateforme principale',
        options: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
      },
      {
        name: 'style',
        type: 'select',
        required: true,
        description: 'Style visuel',
        options: ['moderne', 'classique', 'minimaliste', 'coloré', 'élégant'],
      },
      {
        name: 'animationStyle',
        type: 'select',
        required: false,
        description: 'Style d\'animation',
        options: ['dynamique', 'élégant', 'minimaliste', 'coloré', 'professionnel'],
        defaultValue: 'dynamique',
      },
      {
        name: 'brandId',
        type: 'string',
        required: false,
        description: 'ID de la marque dans le système',
      },
      {
        name: 'guidelines',
        type: 'file',
        required: false,
        description: 'Fichier des guidelines de marque',
      },
      {
        name: 'constraints',
        type: 'string',
        required: false,
        description: 'Contraintes spécifiques',
        validation: {
          max: 500,
        },
      },
    ],
    examples: [
      {
        name: 'Nike Air Max 270',
        description: 'Campagne Nike Air Max 270 pour Instagram',
        parameters: {
          brand: 'Nike',
          product: 'Air Max 270',
          audience: '18-35 ans, sportifs, urbains',
          budget: 5000,
          objectives: ['notoriété', 'ventes'],
          platform: 'instagram',
          style: 'moderne',
          animationStyle: 'dynamique',
        },
        expectedOutput: 'Images et vidéos publicitaires Nike Air Max 270, style moderne, optimisées Instagram, conformes aux guidelines Nike',
        successRate: 94.5,
      },
      {
        name: 'McDonald\'s Big Mac',
        description: 'Promotion McDonald\'s Big Mac pour Facebook',
        parameters: {
          brand: 'McDonald\'s',
          product: 'Big Mac',
          audience: '25-45 ans, familles, urbains',
          budget: 3000,
          objectives: ['ventes', 'engagement'],
          platform: 'facebook',
          style: 'coloré',
          animationStyle: 'dynamique',
        },
        expectedOutput: 'Images et vidéos publicitaires McDonald\'s Big Mac, style coloré, optimisées Facebook, conformes aux guidelines McDonald\'s',
        successRate: 92.3,
      },
    ],
    performance: {
      averageScore: 8.7,
      successRate: 93.4,
      usageCount: 1247,
      averageTime: 42,
    },
    tags: ['social', 'images', 'videos', 'multi-platform', 'brand-compliant'],
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-15T10:30:00Z',
    version: '1.2.0',
  },
  {
    id: 'video-ad-campaign',
    name: 'Campagne Vidéo Publicitaire',
    description: 'Template pour campagne vidéo publicitaire complète avec génération, montage et optimisation',
    category: 'video',
    subcategory: 'TV/Online',
    difficulty: 'advanced',
    estimatedDuration: 90,
    cost: {
      min: 2000,
      max: 15000,
      currency: 'EUR',
    },
    steps: [
      {
        id: 'brief-generation',
        name: 'Génération du Brief',
        description: 'Création d\'un brief créatif pour vidéo publicitaire',
        agentId: 'brief-gen',
        config: {
          platform: 'video',
          targetAudience: '{{audience}}',
          budget: '{{budget}}',
          objectives: '{{objectives}}',
          duration: '{{duration}}',
        },
        inputs: ['brand', 'product', 'audience', 'budget', 'duration'],
        outputs: ['brief'],
        dependencies: [],
        estimatedTime: 300,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 1000,
        },
      },
      {
        id: 'brand-analysis',
        name: 'Analyse de Marque',
        description: 'Analyse des guidelines de marque pour vidéo',
        agentId: 'brand-brain',
        config: {
          brandId: '{{brandId}}',
          guidelines: '{{guidelines}}',
          constraints: '{{constraints}}',
          videoSpecific: true,
        },
        inputs: ['brief'],
        outputs: ['brandConstraints', 'videoGuidelines'],
        dependencies: ['brief-generation'],
        estimatedTime: 240,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'exponential',
          retryDelay: 1500,
        },
      },
      {
        id: 'prompt-optimization',
        name: 'Optimisation des Prompts',
        description: 'Optimisation des prompts pour génération vidéo',
        agentId: 'prompt-smith',
        config: {
          type: 'video',
          platform: '{{platform}}',
          style: '{{style}}',
          duration: '{{duration}}',
          brandConstraints: '{{brandConstraints}}',
        },
        inputs: ['brief', 'brandConstraints'],
        outputs: ['optimizedPrompts'],
        dependencies: ['brand-analysis'],
        estimatedTime: 200,
        retryPolicy: {
          maxRetries: 3,
          backoffStrategy: 'exponential',
          retryDelay: 1000,
        },
      },
      {
        id: 'video-generation',
        name: 'Génération Vidéo',
        description: 'Création de vidéos publicitaires',
        agentId: 'animator',
        config: {
          duration: '{{duration}}',
          style: '{{style}}',
          quality: '{{quality}}',
          formats: ['{{format}}'],
          dimensions: {
            width: '{{width}}',
            height: '{{height}}',
          },
        },
        inputs: ['optimizedPrompts', 'brandConstraints'],
        outputs: ['videos'],
        dependencies: ['prompt-optimization'],
        estimatedTime: 1200,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'exponential',
          retryDelay: 3000,
        },
      },
      {
        id: 'video-editing',
        name: 'Montage Vidéo',
        description: 'Montage et finalisation des vidéos',
        agentId: 'editor',
        config: {
          duration: '{{duration}}',
          style: '{{editingStyle}}',
          transitions: '{{transitions}}',
          effects: '{{effects}}',
        },
        inputs: ['videos'],
        outputs: ['editedVideos'],
        dependencies: ['video-generation'],
        estimatedTime: 600,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000,
        },
      },
      {
        id: 'audio-generation',
        name: 'Génération Audio',
        description: 'Création de musique et voix-off',
        agentId: 'music-gen',
        config: {
          style: '{{musicStyle}}',
          duration: '{{duration}}',
          voice: '{{voice}}',
          language: '{{language}}',
        },
        inputs: ['brief', 'editedVideos'],
        outputs: ['audio'],
        dependencies: ['video-editing'],
        estimatedTime: 400,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'exponential',
          retryDelay: 2000,
        },
      },
      {
        id: 'final-assembly',
        name: 'Assemblage Final',
        description: 'Assemblage final vidéo + audio',
        agentId: 'editor',
        config: {
          sync: true,
          quality: '{{quality}}',
          format: '{{format}}',
        },
        inputs: ['editedVideos', 'audio'],
        outputs: ['finalVideos'],
        dependencies: ['audio-generation'],
        estimatedTime: 300,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000,
        },
      },
      {
        id: 'creative-evaluation',
        name: 'Évaluation Créative',
        description: 'Évaluation finale des vidéos',
        agentId: 'creative-evaluator',
        config: {
          criteria: ['quality', 'brand_compliance', 'platform_compliance', 'authenticity'],
          thresholds: {
            overall: 7.0,
            quality: 8.0,
            authenticity: 8.0,
          },
        },
        inputs: ['finalVideos'],
        outputs: ['evaluation', 'approvedVideos'],
        dependencies: ['final-assembly'],
        estimatedTime: 300,
        retryPolicy: {
          maxRetries: 2,
          backoffStrategy: 'linear',
          retryDelay: 2000,
        },
      },
    ],
    parameters: [
      {
        name: 'brand',
        type: 'string',
        required: true,
        description: 'Nom de la marque',
        validation: {
          min: 2,
          max: 50,
        },
      },
      {
        name: 'product',
        type: 'string',
        required: true,
        description: 'Produit à promouvoir',
        validation: {
          min: 2,
          max: 100,
        },
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Audience cible',
        validation: {
          min: 10,
          max: 200,
        },
      },
      {
        name: 'budget',
        type: 'number',
        required: true,
        description: 'Budget de la campagne en EUR',
        validation: {
          min: 2000,
          max: 50000,
        },
      },
      {
        name: 'duration',
        type: 'number',
        required: true,
        description: 'Durée de la vidéo en secondes',
        validation: {
          min: 15,
          max: 60,
        },
      },
      {
        name: 'platform',
        type: 'select',
        required: true,
        description: 'Plateforme de diffusion',
        options: ['youtube', 'facebook', 'instagram', 'tiktok', 'tv'],
      },
      {
        name: 'style',
        type: 'select',
        required: true,
        description: 'Style visuel',
        options: ['dynamique', 'élégant', 'minimaliste', 'coloré', 'professionnel'],
      },
      {
        name: 'quality',
        type: 'select',
        required: true,
        description: 'Qualité vidéo',
        options: ['hd', '4k', '8k'],
      },
      {
        name: 'format',
        type: 'select',
        required: true,
        description: 'Format de sortie',
        options: ['mp4', 'mov', 'avi'],
      },
      {
        name: 'width',
        type: 'number',
        required: true,
        description: 'Largeur en pixels',
        validation: {
          min: 720,
          max: 3840,
        },
      },
      {
        name: 'height',
        type: 'number',
        required: true,
        description: 'Hauteur en pixels',
        validation: {
          min: 480,
          max: 2160,
        },
      },
      {
        name: 'editingStyle',
        type: 'select',
        required: false,
        description: 'Style de montage',
        options: ['dynamique', 'élégant', 'minimaliste', 'coloré', 'professionnel'],
        defaultValue: 'professionnel',
      },
      {
        name: 'transitions',
        type: 'multiselect',
        required: false,
        description: 'Types de transitions',
        options: ['cut', 'fade', 'dissolve', 'wipe', 'zoom'],
        defaultValue: ['cut', 'fade'],
      },
      {
        name: 'effects',
        type: 'multiselect',
        required: false,
        description: 'Effets visuels',
        options: ['color_grading', 'stabilization', 'slow_motion', 'fast_motion', 'text_overlay'],
        defaultValue: ['color_grading', 'text_overlay'],
      },
      {
        name: 'musicStyle',
        type: 'select',
        required: false,
        description: 'Style musical',
        options: ['upbeat', 'dramatic', 'calm', 'energetic', 'emotional'],
        defaultValue: 'upbeat',
      },
      {
        name: 'voice',
        type: 'select',
        required: false,
        description: 'Type de voix',
        options: ['male', 'female', 'neutral', 'energetic', 'calm'],
        defaultValue: 'neutral',
      },
      {
        name: 'language',
        type: 'select',
        required: false,
        description: 'Langue',
        options: ['fr', 'en', 'es', 'de', 'it'],
        defaultValue: 'fr',
      },
    ],
    examples: [
      {
        name: 'Apple iPhone 15 Pro',
        description: 'Vidéo publicitaire Apple iPhone 15 Pro pour YouTube',
        parameters: {
          brand: 'Apple',
          product: 'iPhone 15 Pro',
          audience: 'Tech enthusiasts, 25-45 ans',
          budget: 15000,
          duration: 30,
          platform: 'youtube',
          style: 'élégant',
          quality: '4k',
          format: 'mp4',
          width: 1920,
          height: 1080,
          editingStyle: 'élégant',
          transitions: ['fade', 'dissolve'],
          effects: ['color_grading', 'text_overlay'],
          musicStyle: 'dramatic',
          voice: 'male',
          language: 'fr',
        },
        expectedOutput: 'Vidéo publicitaire Apple iPhone 15 Pro, 30s, 4K, style élégant, optimisée YouTube, montage professionnel, musique dramatique, voix masculine française',
        successRate: 96.8,
      },
    ],
    performance: {
      averageScore: 9.1,
      successRate: 95.2,
      usageCount: 456,
      averageTime: 87,
    },
    tags: ['video', 'tv', 'youtube', 'professional', 'high-quality'],
    createdAt: '2025-10-01T00:00:00Z',
    updatedAt: '2025-10-15T10:30:00Z',
    version: '1.1.0',
  },
]

export class WorkflowTemplateManager {
  private templates: Map<string, z.infer<typeof WorkflowTemplateSchema>>

  constructor() {
    this.templates = new Map()
    this.initializeTemplates()
  }

  private initializeTemplates() {
    WORKFLOW_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  async getTemplate(id: string): Promise<z.infer<typeof WorkflowTemplateSchema> | null> {
    return this.templates.get(id) || null
  }

  async getTemplates(category?: string, difficulty?: string): Promise<z.infer<typeof WorkflowTemplateSchema>[]> {
    let templates = Array.from(this.templates.values())
    
    if (category) {
      templates = templates.filter(t => t.category === category)
    }
    
    if (difficulty) {
      templates = templates.filter(t => t.difficulty === difficulty)
    }
    
    return templates
  }

  async searchTemplates(query: string): Promise<z.infer<typeof WorkflowTemplateSchema>[]> {
    const searchTerm = query.toLowerCase()
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  async getPopularTemplates(limit: number = 10): Promise<z.infer<typeof WorkflowTemplateSchema>[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => b.performance.usageCount - a.performance.usageCount)
      .slice(0, limit)
  }

  async getTemplatesByPerformance(metric: 'successRate' | 'averageScore' | 'usageCount'): Promise<z.infer<typeof WorkflowTemplateSchema>[]> {
    return Array.from(this.templates.values())
      .sort((a, b) => b.performance[metric] - a.performance[metric])
  }

  async validateParameters(templateId: string, parameters: Record<string, any>): Promise<{
    valid: boolean
    errors: string[]
    warnings: string[]
  }> {
    const template = this.templates.get(templateId)
    if (!template) {
      return {
        valid: false,
        errors: ['Template not found'],
        warnings: []
      }
    }

    const errors: string[] = []
    const warnings: string[] = []

    // Validation des paramètres requis
    const requiredParams = template.parameters.filter(p => p.required)
    for (const param of requiredParams) {
      if (!parameters[param.name]) {
        errors.push(`Parameter ${param.name} is required`)
      }
    }

    // Validation des types et contraintes
    for (const param of template.parameters) {
      const value = parameters[param.name]
      if (value !== undefined) {
        // Validation de type
        if (param.type === 'number' && typeof value !== 'number') {
          errors.push(`Parameter ${param.name} must be a number`)
        }
        
        if (param.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`Parameter ${param.name} must be a boolean`)
        }
        
        if (param.type === 'string' && typeof value !== 'string') {
          errors.push(`Parameter ${param.name} must be a string`)
        }

        // Validation des contraintes
        if (param.validation) {
          if (param.validation.min !== undefined && value < param.validation.min) {
            errors.push(`Parameter ${param.name} must be at least ${param.validation.min}`)
          }
          
          if (param.validation.max !== undefined && value > param.validation.max) {
            errors.push(`Parameter ${param.name} must be at most ${param.validation.max}`)
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }

  async getTemplateStats(): Promise<{
    totalTemplates: number
    categories: Record<string, number>
    difficulties: Record<string, number>
    averagePerformance: {
      successRate: number
      averageScore: number
      usageCount: number
    }
  }> {
    const templates = Array.from(this.templates.values())
    
    const categories: Record<string, number> = {}
    const difficulties: Record<string, number> = {}
    
    templates.forEach(template => {
      categories[template.category] = (categories[template.category] || 0) + 1
      difficulties[template.difficulty] = (difficulties[template.difficulty] || 0) + 1
    })
    
    const averagePerformance = {
      successRate: templates.reduce((sum, t) => sum + t.performance.successRate, 0) / templates.length,
      averageScore: templates.reduce((sum, t) => sum + t.performance.averageScore, 0) / templates.length,
      usageCount: templates.reduce((sum, t) => sum + t.performance.usageCount, 0) / templates.length,
    }

    return {
      totalTemplates: templates.length,
      categories,
      difficulties,
      averagePerformance
    }
  }
}
